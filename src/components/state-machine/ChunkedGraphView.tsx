/**
 * Chunked state-machine graph renderer.
 *
 * For large state machines (400+ states) the single-view
 * `StateMachineGraphView` exhausts WebView2 memory during dagre layout.
 * This component replaces it for large graphs by decomposing the state
 * machine into SCC + chain-compacted chunks (via `chunkStateMachine` in
 * `@qontinui/workflow-utils`) and rendering:
 *
 *  - An **overview** showing chunk nodes + aggregated cross-chunk edges.
 *  - A **drilled** view when a chunk is clicked, showing that chunk's
 *    states + cross-chunk "phantom" entry/exit ports.
 *  - A **giant-SCC fallback** panel when a chunk itself is too large to
 *    render (> `CHUNK_MAX_NODES`).
 *
 * Selection (`selectedStateId` / `onSelectState`) is controlled end-to-end
 * by the parent. The chunked view auto-drills when the parent selects a
 * state in a different chunk; see the "Auto-drill" effect below.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Panel,
  type Node,
  type Edge,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import { ArrowLeft, Layers } from "lucide-react";
import type {
  StateMachineState,
  StateMachineTransition,
  StateNodeData,
  TransitionEdgeData,
} from "@qontinui/shared-types";
import {
  chunkStateMachine,
  firstActionTargetString,
  getLayoutedElements,
  STATE_MACHINE_LAYOUT_OPTIONS,
  type Chunk,
  type ChunkGraph,
} from "@qontinui/workflow-utils";

import type { StateMachineGraphViewProps } from "./StateMachineGraphView";
import { StateMachineStateNode } from "./StateMachineStateNode";
import { StateMachineTransitionEdge } from "./StateMachineTransitionEdge";
import { ChunkOverviewNode, type ChunkNodeData } from "./ChunkOverviewNode";
import { ChunkPortNode, type ChunkPortNodeData } from "./ChunkPortNode";

// =============================================================================
// Types + constants
// =============================================================================

export interface ChunkedGraphViewProps extends StateMachineGraphViewProps {}

type ViewMode =
  | { kind: "overview" }
  | { kind: "drilled"; chunkId: string };

/** Per-chunk node-count ceiling. Above this we render a scrollable list
 *  fallback instead of mounting ReactFlow. */
const CHUNK_MAX_NODES = 150;

// Shared fitView options (mirror StateMachineGraphView).
const FIT_VIEW_OPTIONS = { padding: 0.2, minZoom: 0.3 } as const;

// Overview-specific layout: chunk nodes are smaller than state nodes.
const OVERVIEW_LAYOUT_OPTIONS = {
  direction: "TB" as const,
  nodeWidth: 200,
  nodeHeight: 80,
  nodeSep: 60,
  rankSep: 100,
};

// Node types maps — registered once, outside components, to avoid
// ReactFlow's "it looks like you've created a new nodeTypes or edgeTypes
// object" warning that forces a full re-render.
//
// The overview also registers `stateNode` + `transitionEdge` so a chain
// chunk that is inline-expanded can render its component states directly
// inside the overview canvas (v2 expand-inline alternative to drill-in).
const overviewNodeTypes = {
  chunkOverview: ChunkOverviewNode,
  stateNode: StateMachineStateNode,
};
const overviewEdgeTypes = { transitionEdge: StateMachineTransitionEdge };
const drilledNodeTypes = {
  stateNode: StateMachineStateNode,
  chunkPort: ChunkPortNode,
};
const drilledEdgeTypes = { transitionEdge: StateMachineTransitionEdge };


// =============================================================================
// Overview canvas
// =============================================================================

interface OverviewCanvasProps {
  chunkGraph: ChunkGraph;
  dagreLib: StateMachineGraphViewProps["dagre"];
  onDrillIn: (chunkId: string) => void;
  /**
   * Names of states contained in each chunk, keyed by chunk id. Used to
   * populate per-chunk hover tooltips. May be absent (tooltip degrades).
   */
  stateNamesByChunkId: Map<string, string[]>;
  /**
   * Per-chunk match counts when a search is active; `null` means "no
   * search / show everything". When set to a Map, chunks not present
   * in the map are filtered out of the overview.
   */
  perChunkMatches: Map<string, number> | null;
  /** Set of chain chunks currently inline-expanded. */
  expandedChainIds: Set<string>;
  /** Toggle a chain chunk's inline expansion. */
  onToggleChainExpand: (chunkId: string) => void;
  /**
   * User-chosen chunk labels keyed by chunk id. When set and non-empty,
   * overrides the auto-derived `chunk.name` on the chunk card.
   */
  chunkLabels?: Map<string, string>;
  /**
   * Save handler for chunk label overrides. Empty strings remove the
   * override. When absent, the rename affordance is hidden in the
   * chunk card (read-only).
   */
  onSaveChunkLabel?: (chunkId: string, label: string) => void;
  /**
   * Full state list — needed so inline-expanded chain chunks can render
   * real `stateNode`s with the same data shape as the drilled canvas.
   */
  states: StateMachineState[];
  /**
   * Transition counts across the whole graph; used to populate the
   * incoming/outgoing badges on inline-expanded state nodes. Mirrors
   * the drilled canvas so badges stay consistent.
   */
  transitionCounts: {
    outgoing: Map<string, number>;
    incoming: Map<string, number>;
  };
  effectiveInitialStateId: string | null;
  selectedStateId: string | null;
  /** State-selection handler (fires when an inline-expanded state is clicked). */
  onSelectState: (stateId: string | null) => void;
  onSelectTransition: (transitionId: string | null) => void;
  elementThumbnails?: Record<string, string>;
}

function OverviewCanvasInner({
  chunkGraph,
  dagreLib,
  onDrillIn,
  stateNamesByChunkId,
  perChunkMatches,
  expandedChainIds,
  onToggleChainExpand,
  chunkLabels,
  onSaveChunkLabel,
  states,
  transitionCounts,
  effectiveInitialStateId,
  selectedStateId,
  onSelectState,
  onSelectTransition,
  elementThumbnails,
}: OverviewCanvasProps) {
  const reactFlowInstance = useReactFlow();

  // State lookup for inline-expanded chain rendering.
  const stateById = useMemo(() => {
    const m = new Map<string, StateMachineState>();
    for (const s of states) m.set(s.state_id, s);
    return m;
  }, [states]);

  // Build chunk nodes — plus, for each inline-expanded chain, a sequence
  // of real stateNodes instead of the chunk card.
  //
  // When `perChunkMatches` is set (search active), chunks with zero
  // matches are filtered out entirely. Expanded chains still respect
  // this filter via their parent chunk.
  const baseNodes: Node[] = useMemo(() => {
    const list: Node[] = [];
    for (const chunk of chunkGraph.chunks) {
      // Search filter: drop chunks with no matching states.
      if (perChunkMatches !== null && !perChunkMatches.has(chunk.id)) {
        continue;
      }

      const isExpandedChain =
        chunk.kind === "chain" && expandedChainIds.has(chunk.id);

      if (isExpandedChain) {
        // Emit one stateNode per state in the chain, in order.
        for (const stateId of chunk.stateIds) {
          const state = stateById.get(stateId);
          if (!state) continue;
          list.push({
            id: stateId,
            type: "stateNode",
            position: { x: 0, y: 0 },
            data: {
              stateId: state.state_id,
              name: state.name,
              elementCount: state.element_ids.length,
              confidence: state.confidence,
              elementIds: state.element_ids,
              description: state.description ?? null,
              isBlocking:
                (state.extra_metadata as Record<string, unknown>)?.blocking ===
                true,
              isSelected: state.state_id === selectedStateId,
              isInitial: state.state_id === effectiveInitialStateId,
              outgoingCount: transitionCounts.outgoing.get(state.state_id) ?? 0,
              incomingCount: transitionCounts.incoming.get(state.state_id) ?? 0,
              isDropTarget: false,
              onStartElementDrag: undefined,
              elementThumbnails,
            } satisfies StateNodeData,
          });
        }
      } else {
        list.push({
          id: chunk.id,
          type: "chunkOverview",
          position: { x: 0, y: 0 },
          data: {
            chunk,
            matchCount: perChunkMatches?.get(chunk.id),
            stateNames: stateNamesByChunkId.get(chunk.id),
            isExpanded: false,
            onToggleExpand:
              chunk.kind === "chain" ? onToggleChainExpand : undefined,
            userLabel: chunkLabels?.get(chunk.id),
            onSaveLabel: onSaveChunkLabel,
          } satisfies ChunkNodeData,
        });
      }
    }
    return list;
  }, [
    chunkGraph.chunks,
    perChunkMatches,
    expandedChainIds,
    stateById,
    selectedStateId,
    effectiveInitialStateId,
    transitionCounts,
    elementThumbnails,
    stateNamesByChunkId,
    onToggleChainExpand,
    chunkLabels,
    onSaveChunkLabel,
  ]);

  // For inline-expanded chains, rewrite cross-chunk edge endpoints so
  // they connect to the chain's first state (inbound) or last state
  // (outbound) instead of the now-missing chunk node. This matches the
  // "chain = linear flow" semantic — entry flows to the head, exit
  // flows from the tail.
  const expandedEndpointFor = useCallback(
    (
      chunkId: string,
      role: "source" | "target",
    ): { id: string; kind: "chain-head" | "chain-tail" } | null => {
      if (!expandedChainIds.has(chunkId)) return null;
      const chunk = chunkGraph.chunks.find((c) => c.id === chunkId);
      if (!chunk || chunk.stateIds.length === 0) return null;
      if (role === "source") {
        // Outbound from this expanded chain → use the tail.
        const tail = chunk.stateIds[chunk.stateIds.length - 1]!;
        return { id: tail, kind: "chain-tail" };
      }
      // Inbound into this expanded chain → use the head.
      const head = chunk.stateIds[0]!;
      return { id: head, kind: "chain-head" };
    },
    [expandedChainIds, chunkGraph.chunks],
  );

  // Build aggregated cross-chunk edges + internal chain edges for
  // inline-expanded chains.
  const baseEdges: Edge[] = useMemo(() => {
    const list: Edge[] = [];

    // Cross-chunk edges. Skip edges whose endpoint was filtered out by
    // the search narrowing; rewrite endpoints for inline-expanded chains.
    for (const e of chunkGraph.edges) {
      if (perChunkMatches !== null) {
        if (!perChunkMatches.has(e.from) || !perChunkMatches.has(e.to)) {
          continue;
        }
      }

      const sourceRemap = expandedEndpointFor(e.from, "source");
      const targetRemap = expandedEndpointFor(e.to, "target");
      const source = sourceRemap?.id ?? e.from;
      const target = targetRemap?.id ?? e.to;

      const thickness = Math.log(Math.max(e.transitionCount, 1)) + 1;
      list.push({
        id: `chunk-edge-${e.from}-${e.to}`,
        source,
        target,
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
        label: String(e.transitionCount),
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
        labelBgStyle: {
          fill: "var(--bg-secondary, #1a1a1a)",
          stroke: "var(--border-secondary, #333)",
          strokeWidth: 1,
        },
        labelStyle: {
          fontSize: 10,
          fill: "var(--text-muted, #999)",
          fontWeight: 500,
        },
        style: {
          strokeWidth: thickness,
          stroke: "var(--border-secondary, #555)",
        },
      });
    }

    // Internal sequential edges for each inline-expanded chain.
    for (const chunkId of expandedChainIds) {
      const chunk = chunkGraph.chunks.find((c) => c.id === chunkId);
      if (!chunk || chunk.kind !== "chain") continue;
      if (perChunkMatches !== null && !perChunkMatches.has(chunkId)) continue;
      for (let i = 0; i < chunk.stateIds.length - 1; i++) {
        const from = chunk.stateIds[i]!;
        const to = chunk.stateIds[i + 1]!;
        list.push({
          id: `chain-inline-${chunkId}-${from}-${to}`,
          source: from,
          target: to,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: "var(--indigo-400, #818cf8)",
            strokeWidth: 1.5,
            opacity: 0.7,
          },
        });
      }
    }

    return list;
  }, [
    chunkGraph.edges,
    chunkGraph.chunks,
    perChunkMatches,
    expandedEndpointFor,
    expandedChainIds,
  ]);

  // Apply dagre layout with the lighter overview options.
  const layouted = useMemo(() => {
    if (baseNodes.length === 0) return { nodes: [], edges: [] };
    return getLayoutedElements(
      dagreLib as Parameters<typeof getLayoutedElements>[0],
      baseNodes,
      baseEdges,
      OVERVIEW_LAYOUT_OPTIONS,
    );
  }, [dagreLib, baseNodes, baseEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);

  useEffect(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);

  // Clear the overview's internal selection after drilling so the node
  // doesn't stay visually selected when the user returns to overview.
  const clearOverviewSelection = useCallback(() => {
    setNodes((prev) =>
      prev.some((n) => n.selected)
        ? prev.map((n) => (n.selected ? { ...n, selected: false } : n))
        : prev,
    );
  }, [setNodes]);

  // Overview selection semantics:
  //   chunkOverview node     → drill in
  //   stateNode (inline chain expand) → state selection (no drill)
  //   transition edge inside an inline chain → no-op (no semantic id)
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const first = selectedNodes[0];
      if (!first) return;

      if (first.type === "chunkOverview") {
        const d = first.data as unknown as ChunkNodeData;
        if (!d?.chunk) return;
        onDrillIn(d.chunk.id);
        // Don't await state update — drill-in replaces the canvas anyway.
        clearOverviewSelection();
        return;
      }

      if (first.type === "stateNode") {
        const d = first.data as unknown as StateNodeData;
        onSelectState(d.stateId);
        onSelectTransition(null);
      }
    },
    [onDrillIn, clearOverviewSelection, onSelectState, onSelectTransition],
  );

  const fitView = useCallback(() => {
    reactFlowInstance.fitView({ ...FIT_VIEW_OPTIONS, duration: 300 });
  }, [reactFlowInstance]);

  // One-shot fit on mount.
  useEffect(() => {
    const id = setTimeout(fitView, 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={onSelectionChange}
      nodeTypes={overviewNodeTypes}
      edgeTypes={overviewEdgeTypes}
      fitView
      fitViewOptions={FIT_VIEW_OPTIONS}
      minZoom={0.1}
      maxZoom={3}
      deleteKeyCode={null}
      selectNodesOnDrag={false}
    >
      <Background gap={20} size={1} variant={BackgroundVariant.Dots} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeColor={(n) => {
          const d = n.data as unknown as ChunkNodeData | undefined;
          if (d?.chunk?.containsInitialState) return "#FFD700";
          return "#818cf8"; // indigo-400
        }}
        maskColor="rgba(0,0,0,0.15)"
        pannable
        zoomable
      />
      <Panel position="bottom-left">
        <div className="text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2">
          <Layers className="size-3" />
          <span>{chunkGraph.chunks.length} chunks</span>
          <span className="text-text-muted/30">|</span>
          <span>{chunkGraph.edges.length} cross-chunk edges</span>
          <span className="text-text-muted/30">|</span>
          <span className="text-indigo-300/80">Click a chunk to drill in</span>
        </div>
      </Panel>
    </ReactFlow>
  );
}

function OverviewCanvas(props: OverviewCanvasProps) {
  return (
    <ReactFlowProvider>
      <OverviewCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

/**
 * When a chain is inline-expanded, the `ChunkOverviewNode` tooltip
 * shows only the first 15 state names of the chunk. The inline state
 * nodes have their own native tooltips via `StateMachineStateNode`.
 * Both coexist — the chunk-card tooltip and the state-node tooltip
 * never render for the same node because an expanded chunk replaces
 * its card with state nodes.
 */

// =============================================================================
// Drilled canvas (state nodes + phantom ports in one ReactFlow)
// =============================================================================

interface DrilledCanvasProps {
  chunk: Chunk;
  chunkGraph: ChunkGraph;
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  dagreLib: StateMachineGraphViewProps["dagre"];
  selectedStateId: string | null;
  selectedTransitionId: string | null;
  effectiveInitialStateId: string | null;
  elementThumbnails?: Record<string, string>;
  /**
   * User-chosen chunk labels keyed by chunk id. When set, phantom port
   * labels reflect the override rather than the auto-derived chunk name.
   */
  chunkLabels?: Map<string, string>;
  highlightedTransitionIds: Set<string>;
  transitionCounts: {
    outgoing: Map<string, number>;
    incoming: Map<string, number>;
  };
  onSelectState: (stateId: string | null) => void;
  onSelectTransition: (transitionId: string | null) => void;
  resolveTransitionSelectionId?: StateMachineGraphViewProps["resolveTransitionSelectionId"];
  onNavigateToChunk: (chunkId: string) => void;
  isDragging?: boolean;
  dropTargetStateId?: string | null;
  onStartElementDrag?: StateMachineGraphViewProps["onStartElementDrag"];
}

function DrilledCanvasInner({
  chunk,
  chunkGraph,
  states,
  transitions,
  dagreLib,
  selectedStateId,
  selectedTransitionId,
  effectiveInitialStateId,
  elementThumbnails,
  chunkLabels,
  highlightedTransitionIds,
  transitionCounts,
  onSelectState,
  onSelectTransition,
  resolveTransitionSelectionId,
  onNavigateToChunk,
  isDragging,
  dropTargetStateId,
  onStartElementDrag,
}: DrilledCanvasProps) {
  const reactFlowInstance = useReactFlow();

  // Filter states/transitions to this chunk.
  const chunkStateIds = useMemo(
    () => new Set(chunk.stateIds),
    [chunk.stateIds],
  );
  const chunkStates = useMemo(
    () => states.filter((s) => chunkStateIds.has(s.state_id)),
    [states, chunkStateIds],
  );

  // Internal transitions: both endpoints in this chunk.
  // Cross-chunk transitions: used to wire phantom ports.
  const { internalTransitions, inboundByAdjChunk, outboundByAdjChunk } =
    useMemo(() => {
      const internal: StateMachineTransition[] = [];
      const inbound = new Map<
        string,
        { states: Set<string>; transitionIds: Set<string> }
      >();
      const outbound = new Map<
        string,
        { states: Set<string>; transitionIds: Set<string> }
      >();

      for (const t of transitions) {
        const fromsInChunk = t.from_states.filter((s) => chunkStateIds.has(s));
        const tosInChunk = t.activate_states.filter((s) =>
          chunkStateIds.has(s),
        );
        const fromsOutChunk = t.from_states.filter(
          (s) => !chunkStateIds.has(s) && chunkGraph.stateIndex.has(s),
        );
        const tosOutChunk = t.activate_states.filter(
          (s) => !chunkStateIds.has(s) && chunkGraph.stateIndex.has(s),
        );

        // Purely internal transition (every endpoint in the chunk).
        if (fromsOutChunk.length === 0 && tosOutChunk.length === 0) {
          if (fromsInChunk.length > 0 && tosInChunk.length > 0) {
            internal.push(t);
          }
          continue;
        }

        // Inbound: external source feeds one of our states.
        if (fromsOutChunk.length > 0 && tosInChunk.length > 0) {
          for (const extFrom of fromsOutChunk) {
            const extChunkId = chunkGraph.stateIndex.get(extFrom);
            if (!extChunkId || extChunkId === chunk.id) continue;
            const entry = inbound.get(extChunkId) ?? {
              states: new Set<string>(),
              transitionIds: new Set<string>(),
            };
            for (const dst of tosInChunk) entry.states.add(dst);
            entry.transitionIds.add(t.transition_id);
            inbound.set(extChunkId, entry);
          }
        }

        // Outbound: our state feeds an external destination.
        if (fromsInChunk.length > 0 && tosOutChunk.length > 0) {
          for (const extTo of tosOutChunk) {
            const extChunkId = chunkGraph.stateIndex.get(extTo);
            if (!extChunkId || extChunkId === chunk.id) continue;
            const entry = outbound.get(extChunkId) ?? {
              states: new Set<string>(),
              transitionIds: new Set<string>(),
            };
            for (const src of fromsInChunk) entry.states.add(src);
            entry.transitionIds.add(t.transition_id);
            outbound.set(extChunkId, entry);
          }
        }
      }

      return {
        internalTransitions: internal,
        inboundByAdjChunk: inbound,
        outboundByAdjChunk: outbound,
      };
    }, [transitions, chunkStateIds, chunkGraph, chunk.id]);

  // Chunk-name lookup for phantom port labels. Respects user-chosen
  // chunk label overrides when present.
  const chunkNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of chunkGraph.chunks) {
      const override = chunkLabels?.get(c.id);
      m.set(c.id, override && override.length > 0 ? override : c.name);
    }
    return m;
  }, [chunkGraph.chunks, chunkLabels]);

  // Build state nodes (mirrors StateMachineGraphView's stateNode build).
  const stateNodes: Node[] = useMemo(
    () =>
      chunkStates.map((state) => ({
        id: state.state_id,
        type: "stateNode",
        position: { x: 0, y: 0 },
        data: {
          stateId: state.state_id,
          name: state.name,
          elementCount: state.element_ids.length,
          confidence: state.confidence,
          elementIds: state.element_ids,
          description: state.description ?? null,
          isBlocking:
            (state.extra_metadata as Record<string, unknown>)?.blocking ===
            true,
          isSelected: state.state_id === selectedStateId,
          isInitial: state.state_id === effectiveInitialStateId,
          outgoingCount: transitionCounts.outgoing.get(state.state_id) ?? 0,
          incomingCount: transitionCounts.incoming.get(state.state_id) ?? 0,
          isDropTarget: isDragging && dropTargetStateId === state.state_id,
          onStartElementDrag,
          elementThumbnails,
        } satisfies StateNodeData,
      })),
    [
      chunkStates,
      selectedStateId,
      effectiveInitialStateId,
      transitionCounts,
      isDragging,
      dropTargetStateId,
      onStartElementDrag,
      elementThumbnails,
    ],
  );

  const getSelectionId = useCallback(
    (t: StateMachineTransition) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(t);
      return t.transition_id;
    },
    [resolveTransitionSelectionId],
  );

  // Resolve the semantic transition id of the currently-selected edge.
  const selectedTransitionSemanticId = useMemo(() => {
    if (!selectedTransitionId) return null;
    const t = transitions.find(
      (tr) => getSelectionId(tr) === selectedTransitionId,
    );
    return t?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);

  // Build internal transition edges.
  const stateEdges: Edge[] = useMemo(() => {
    const list: Edge[] = [];
    for (const t of internalTransitions) {
      const isSelected = t.transition_id === selectedTransitionSemanticId;
      for (const from of t.from_states) {
        if (!chunkStateIds.has(from)) continue;
        for (const to of t.activate_states) {
          if (!chunkStateIds.has(to)) continue;
          list.push({
            id: `${t.transition_id}-${from}-${to}`,
            source: from,
            target: to,
            type: "transitionEdge",
            selected: isSelected,
            markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: t.transition_id,
              name: t.name,
              pathCost: t.path_cost,
              actionCount: t.actions.length,
              actionTypes: t.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(t.transition_id),
              staysVisible: t.stays_visible,
              firstActionTarget: firstActionTargetString(t.actions[0]),
            } satisfies TransitionEdgeData,
          });
        }
      }
    }
    return list;
  }, [
    internalTransitions,
    chunkStateIds,
    selectedTransitionSemanticId,
    highlightedTransitionIds,
  ]);

  // Build phantom port nodes (input + output).
  const portNodes: Node[] = useMemo(() => {
    const list: Node[] = [];
    for (const [adjChunkId] of inboundByAdjChunk) {
      list.push({
        id: `port-in-${adjChunkId}`,
        type: "chunkPort",
        position: { x: 0, y: 0 },
        data: {
          direction: "input",
          adjacentChunkId: adjChunkId,
          adjacentChunkName: chunkNameById.get(adjChunkId) ?? adjChunkId,
          onNavigate: onNavigateToChunk,
        } satisfies ChunkPortNodeData,
      });
    }
    for (const [adjChunkId] of outboundByAdjChunk) {
      list.push({
        id: `port-out-${adjChunkId}`,
        type: "chunkPort",
        position: { x: 0, y: 0 },
        data: {
          direction: "output",
          adjacentChunkId: adjChunkId,
          adjacentChunkName: chunkNameById.get(adjChunkId) ?? adjChunkId,
          onNavigate: onNavigateToChunk,
        } satisfies ChunkPortNodeData,
      });
    }
    return list;
  }, [inboundByAdjChunk, outboundByAdjChunk, chunkNameById, onNavigateToChunk]);

  // Build phantom port edges: input-port → each real entry state; each real
  // exit state → output-port.
  const portEdges: Edge[] = useMemo(() => {
    const list: Edge[] = [];
    for (const [adjChunkId, info] of inboundByAdjChunk) {
      const portId = `port-in-${adjChunkId}`;
      for (const stateId of info.states) {
        list.push({
          id: `port-in-edge-${adjChunkId}-${stateId}`,
          source: portId,
          target: stateId,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: "var(--indigo-400, #818cf8)",
            strokeDasharray: "4 3",
            strokeWidth: 1.5,
            opacity: 0.6,
          },
        });
      }
    }
    for (const [adjChunkId, info] of outboundByAdjChunk) {
      const portId = `port-out-${adjChunkId}`;
      for (const stateId of info.states) {
        list.push({
          id: `port-out-edge-${stateId}-${adjChunkId}`,
          source: stateId,
          target: portId,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: "var(--indigo-400, #818cf8)",
            strokeDasharray: "4 3",
            strokeWidth: 1.5,
            opacity: 0.6,
          },
        });
      }
    }
    return list;
  }, [inboundByAdjChunk, outboundByAdjChunk]);

  // Combine all nodes + edges, run dagre, then post-adjust phantom Y
  // positions to sit above/below the state cluster.
  const layouted = useMemo(() => {
    const allNodes = [...portNodes, ...stateNodes];
    const allEdges = [...stateEdges, ...portEdges];
    if (allNodes.length === 0) return { nodes: [], edges: [] };

    const result = getLayoutedElements(
      dagreLib as Parameters<typeof getLayoutedElements>[0],
      allNodes,
      allEdges,
      STATE_MACHINE_LAYOUT_OPTIONS,
    );

    // Find the Y-range of real state nodes so we can pin ports above/below.
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of result.nodes) {
      if (n.type === "stateNode") {
        if (n.position.y < minY) minY = n.position.y;
        if (n.position.y > maxY) maxY = n.position.y;
      }
    }
    if (!isFinite(minY) || !isFinite(maxY)) {
      return result;
    }

    const PORT_MARGIN = 100;
    const portTopY = minY - PORT_MARGIN;
    const portBottomY = maxY + PORT_MARGIN + STATE_MACHINE_LAYOUT_OPTIONS.nodeHeight;

    return {
      ...result,
      nodes: result.nodes.map((n) => {
        if (n.type !== "chunkPort") return n;
        const d = n.data as unknown as ChunkPortNodeData;
        return {
          ...n,
          position: {
            x: n.position.x,
            y: d.direction === "input" ? portTopY : portBottomY,
          },
        };
      }),
    };
  }, [dagreLib, stateNodes, stateEdges, portNodes, portEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);

  useEffect(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);

  // Selection: route state-node selection to onSelectState, transition
  // edges to onSelectTransition, and ignore phantom port selection (they
  // use their own onClick).
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams) => {
      const firstNode = selectedNodes[0];
      const firstEdge = selectedEdges[0];
      if (firstNode) {
        if (firstNode.type === "chunkPort") {
          // Navigation happens via the port's own onClick handler.
          onSelectState(null);
          onSelectTransition(null);
          return;
        }
        const nd = firstNode.data as unknown as StateNodeData;
        onSelectState(nd.stateId);
        onSelectTransition(null);
      } else if (firstEdge) {
        const ed = firstEdge.data as unknown as TransitionEdgeData | undefined;
        if (!ed?.transitionId) {
          // Phantom port edge — no transition semantics.
          onSelectState(null);
          onSelectTransition(null);
          return;
        }
        const trans = transitions.find(
          (t) => t.transition_id === ed.transitionId,
        );
        onSelectTransition(trans ? getSelectionId(trans) : null);
        onSelectState(null);
      } else {
        onSelectState(null);
        onSelectTransition(null);
      }
    },
    [onSelectState, onSelectTransition, transitions, getSelectionId],
  );

  // Fit view once when the drilled chunk is mounted.
  const didFitRef = useRef(false);
  useEffect(() => {
    if (didFitRef.current) return;
    if (nodes.length === 0) return;
    didFitRef.current = true;
    const id = setTimeout(() => {
      reactFlowInstance.fitView({ ...FIT_VIEW_OPTIONS, duration: 300 });
    }, 50);
    return () => clearTimeout(id);
  }, [nodes.length, reactFlowInstance]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={onSelectionChange}
      nodeTypes={drilledNodeTypes}
      edgeTypes={drilledEdgeTypes}
      fitView
      fitViewOptions={FIT_VIEW_OPTIONS}
      minZoom={0.05}
      maxZoom={3}
      onlyRenderVisibleElements
      deleteKeyCode={null}
      selectNodesOnDrag={false}
    >
      <Background gap={20} size={1} variant={BackgroundVariant.Dots} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeColor={(n) => {
          if (n.type === "chunkPort") return "#6366f1";
          const d = n.data as unknown as StateNodeData | undefined;
          if (d?.isInitial) return "#FFD700";
          return d?.isBlocking ? "#f59e0b" : "var(--brand-primary)";
        }}
        maskColor="rgba(0,0,0,0.15)"
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

function DrilledCanvas(props: DrilledCanvasProps) {
  return (
    <ReactFlowProvider>
      <DrilledCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

// =============================================================================
// Giant-SCC fallback panel
// =============================================================================

interface GiantChunkPanelProps {
  chunk: Chunk;
  states: StateMachineState[];
  selectedStateId: string | null;
  onSelectState: (stateId: string | null) => void;
}

function GiantChunkPanel({
  chunk,
  states,
  selectedStateId,
  onSelectState,
}: GiantChunkPanelProps) {
  const chunkStates = useMemo(() => {
    const order = new Map(chunk.stateIds.map((id, i) => [id, i]));
    return states
      .filter((s) => order.has(s.state_id))
      .sort(
        (a, b) =>
          (order.get(a.state_id) ?? 0) - (order.get(b.state_id) ?? 0),
      );
  }, [chunk.stateIds, states]);

  return (
    <div className="h-full w-full flex flex-col p-4 gap-3">
      <div className="flex items-start gap-3 bg-amber-950/20 border border-amber-600/40 rounded px-3 py-2.5">
        <Layers className="size-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90">
          <p className="font-medium">
            Chunk too large to render ({chunkStates.length} states).
          </p>
          <p className="text-amber-200/70 mt-1">
            This strongly-connected component has too many interconnected
            cycles to lay out cleanly. Browse states from the list below or
            switch to the State View tab.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto max-h-[80vh] border border-border-secondary rounded bg-bg-secondary/40">
        <ul className="divide-y divide-border-secondary/60">
          {chunkStates.map((s) => {
            const isSel = s.state_id === selectedStateId;
            return (
              <li key={s.state_id}>
                <button
                  type="button"
                  onClick={() =>
                    onSelectState(isSel ? null : s.state_id)
                  }
                  className={`
                    w-full text-left px-3 py-2 text-xs flex items-center gap-2
                    transition-colors
                    ${
                      isSel
                        ? "bg-brand-primary/20 text-text-primary"
                        : "hover:bg-bg-tertiary text-text-secondary"
                    }
                  `}
                >
                  <Layers className="size-3 shrink-0 text-brand-primary/70" />
                  <span className="truncate flex-1 font-medium">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {s.element_ids.length} el
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// =============================================================================
// Main component
// =============================================================================

function ChunkedGraphViewInner(props: ChunkedGraphViewProps) {
  const {
    dagre: dagreLib,
    states,
    transitions,
    selectedStateId,
    selectedTransitionId,
    onSelectState,
    onSelectTransition,
    initialStateId,
    emptyMessage = "No states in this config.",
    highlightedPath,
    elementThumbnails,
    onStartElementDrag,
    onDragOver,
    onDrop,
    isDragging,
    dropTargetStateId,
    resolveTransitionSelectionId,
    searchQuery,
    chunkLabels,
    onSaveChunkLabel,
  } = props;

  // Effective initial state: mirror StateMachineGraphView's logic.
  const effectiveInitialStateId = useMemo(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => (s.extra_metadata as Record<string, unknown>)?.initial === true,
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);

  const chunkGraph = useMemo(
    () =>
      chunkStateMachine(states, transitions, {
        initialStateId: effectiveInitialStateId,
      }),
    [states, transitions, effectiveInitialStateId],
  );

  const chunkById = useMemo(() => {
    const m = new Map<string, Chunk>();
    for (const c of chunkGraph.chunks) m.set(c.id, c);
    return m;
  }, [chunkGraph.chunks]);

  // Transition counts are computed across the whole graph — passed to
  // drilled view so per-state badges reflect true degrees, not chunk-local.
  const transitionCounts = useMemo(() => {
    const outgoing = new Map<string, number>();
    const incoming = new Map<string, number>();
    for (const t of transitions) {
      for (const from of t.from_states)
        outgoing.set(from, (outgoing.get(from) ?? 0) + 1);
      for (const to of t.activate_states)
        incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
    return { outgoing, incoming };
  }, [transitions]);

  const highlightedTransitionIds = useMemo(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath],
  );

  const [viewMode, setViewMode] = useState<ViewMode>({ kind: "overview" });

  // Chain chunks expanded inline in the overview. Held at this level
  // (not inside `OverviewCanvasInner`) so the set survives overview
  // remounts caused by switching between drilled and overview view.
  const [expandedChainIds, setExpandedChainIds] = useState<Set<string>>(
    () => new Set(),
  );
  const toggleChainExpand = useCallback((chunkId: string) => {
    setExpandedChainIds((prev) => {
      const next = new Set(prev);
      if (next.has(chunkId)) next.delete(chunkId);
      else next.add(chunkId);
      return next;
    });
  }, []);

  // Chunk id → list of contained state names (for hover tooltips).
  const stateNamesByChunkId = useMemo(() => {
    const nameById = new Map<string, string>();
    for (const s of states) nameById.set(s.state_id, s.name);
    const m = new Map<string, string[]>();
    for (const c of chunkGraph.chunks) {
      m.set(
        c.id,
        c.stateIds.map((id) => nameById.get(id) ?? id),
      );
    }
    return m;
  }, [chunkGraph.chunks, states]);

  // Per-chunk match counts when a search is active. `null` means no
  // search at all (no filtering); an empty-trimmed string also yields
  // `null` so an empty search doesn't filter the overview to nothing.
  const perChunkMatches = useMemo<Map<string, number> | null>(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return null;
    const m = new Map<string, number>();
    for (const s of states) {
      const name = s.name.toLowerCase();
      const desc = (s.description ?? "").toLowerCase();
      if (name.includes(q) || desc.includes(q)) {
        const cid = chunkGraph.stateIndex.get(s.state_id);
        if (cid) m.set(cid, (m.get(cid) ?? 0) + 1);
      }
    }
    return m;
  }, [searchQuery, states, chunkGraph.stateIndex]);

  // Auto-drill on external selection change.
  //   overview + selected in chunk X      → drill X
  //   drilled A + selected in chunk B ≠ A → drill B
  //   drilled + selected in same chunk    → no-op
  //   drilled + selection null            → stay drilled
  const currentChunkId = viewMode.kind === "drilled" ? viewMode.chunkId : null;
  useEffect(() => {
    if (!selectedStateId) return;
    const targetChunkId = chunkGraph.stateIndex.get(selectedStateId);
    if (!targetChunkId) return;
    if (targetChunkId === currentChunkId) return;
    setViewMode({ kind: "drilled", chunkId: targetChunkId });
  }, [selectedStateId, chunkGraph.stateIndex, currentChunkId]);

  // Esc while drilled returns to overview.
  useEffect(() => {
    if (viewMode.kind !== "drilled") return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Escape") {
        setViewMode({ kind: "overview" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewMode.kind]);

  const goOverview = useCallback(() => {
    setViewMode({ kind: "overview" });
  }, []);

  const drillInto = useCallback((chunkId: string) => {
    setViewMode({ kind: "drilled", chunkId });
  }, []);

  // --- Empty state ---
  if (states.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // --- Drilled view ---
  if (viewMode.kind === "drilled") {
    const chunk = chunkById.get(viewMode.chunkId);
    if (!chunk) {
      // Chunk id no longer exists (e.g. after states mutation). Fall back.
      return (
        <ChunkedGraphViewFallbackMissingChunk onBack={goOverview} />
      );
    }

    const isGiant = chunk.stateIds.length > CHUNK_MAX_NODES;

    const drilledName = chunkLabels?.get(chunk.id) || chunk.name;

    return (
      <div
        className="h-full w-full flex flex-col"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <DrilledBreadcrumb chunkName={drilledName} onBack={goOverview} />
        <div className="flex-1 min-h-0">
          {isGiant ? (
            <GiantChunkPanel
              chunk={chunk}
              states={states}
              selectedStateId={selectedStateId}
              onSelectState={onSelectState}
            />
          ) : (
            <DrilledCanvas
              chunk={chunk}
              chunkGraph={chunkGraph}
              states={states}
              transitions={transitions}
              dagreLib={dagreLib}
              selectedStateId={selectedStateId}
              selectedTransitionId={selectedTransitionId}
              effectiveInitialStateId={effectiveInitialStateId}
              elementThumbnails={elementThumbnails}
              chunkLabels={chunkLabels}
              highlightedTransitionIds={highlightedTransitionIds}
              transitionCounts={transitionCounts}
              onSelectState={onSelectState}
              onSelectTransition={onSelectTransition}
              resolveTransitionSelectionId={resolveTransitionSelectionId}
              onNavigateToChunk={drillInto}
              isDragging={isDragging}
              dropTargetStateId={dropTargetStateId}
              onStartElementDrag={onStartElementDrag}
            />
          )}
        </div>
      </div>
    );
  }

  // --- Overview view ---
  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <OverviewCanvas
        chunkGraph={chunkGraph}
        dagreLib={dagreLib}
        onDrillIn={drillInto}
        stateNamesByChunkId={stateNamesByChunkId}
        perChunkMatches={perChunkMatches}
        expandedChainIds={expandedChainIds}
        onToggleChainExpand={toggleChainExpand}
        chunkLabels={chunkLabels}
        onSaveChunkLabel={onSaveChunkLabel}
        states={states}
        transitionCounts={transitionCounts}
        effectiveInitialStateId={effectiveInitialStateId}
        selectedStateId={selectedStateId}
        onSelectState={onSelectState}
        onSelectTransition={onSelectTransition}
        elementThumbnails={elementThumbnails}
      />
    </div>
  );
}

function DrilledBreadcrumb({
  chunkName,
  onBack,
}: {
  chunkName: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border-secondary bg-bg-secondary/40 shrink-0">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded transition-colors"
        title="Back to overview (Esc)"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>
      <div className="text-xs text-text-muted flex items-center gap-1.5">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-text-primary transition-colors"
        >
          All states
        </button>
        <span className="text-text-muted/60">&gt;</span>
        <span className="text-text-primary font-medium truncate max-w-[240px]">
          {chunkName}
        </span>
      </div>
    </div>
  );
}

function ChunkedGraphViewFallbackMissingChunk({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-center text-text-muted">
      <p className="text-sm">That chunk no longer exists.</p>
      <button
        type="button"
        onClick={onBack}
        className="px-3 py-1.5 text-xs bg-bg-secondary border border-border-secondary rounded hover:bg-bg-tertiary"
      >
        Back to overview
      </button>
    </div>
  );
}

// =============================================================================
// Exported wrapper
// =============================================================================

export function ChunkedGraphView(props: ChunkedGraphViewProps) {
  return <ChunkedGraphViewInner {...props} />;
}
