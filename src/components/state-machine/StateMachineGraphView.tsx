/**
 * Shared ReactFlow-based state machine graph viewer.
 *
 * Wraps ReactFlow with dagre layout, keyboard shortcuts, minimap,
 * and selection handling. Both qontinui-runner and qontinui-web
 * use this component for their state machine graph visualization.
 *
 * App-specific features (drag-and-drop, extra keyboard shortcuts)
 * are supported via callback props.
 */

import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type OnSelectionChangeParams,
  MarkerType,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";
import { LayoutGrid, Keyboard, Maximize, Play } from "lucide-react";
import type {
  StateMachineState,
  StateMachineTransition,
  StateNodeData,
  TransitionEdgeData,
  PathfindingStep,
} from "@qontinui/shared-types";
import {
  firstActionTargetString,
  getLayoutedElements,
  STATE_MACHINE_LAYOUT_OPTIONS,
} from "@qontinui/workflow-utils";
import { StateMachineStateNode } from "./StateMachineStateNode";
import { StateMachineTransitionEdge } from "./StateMachineTransitionEdge";
import { ChunkedGraphView } from "./ChunkedGraphView";

// Register custom node/edge types once (outside component to avoid re-renders)
const nodeTypes = { stateNode: StateMachineStateNode };
const edgeTypes = { transitionEdge: StateMachineTransitionEdge };

// Shared fitView options. minZoom prevents fitView from zooming so far out
// that every node lands in the viewport on large graphs, which would defeat
// <ReactFlow onlyRenderVisibleElements>.
const FIT_VIEW_OPTIONS = { padding: 0.2, minZoom: 0.3 } as const;
const FIT_VIEW_OPTIONS_ANIMATED = { ...FIT_VIEW_OPTIONS, duration: 300 } as const;

// Threshold above which the single-view path is replaced with the SCC-based
// `ChunkedGraphView`. Small graphs keep the classic direct-render experience;
// anything above this count is decomposed into chunks so dagre + ReactFlow
// don't process hundreds of nodes at once.
const CHUNKED_VIEW_THRESHOLD = 80;

// Outer safety ceiling. The chunked view handles the 80–500 band. Above 500,
// even chain-compacted chunk counts can blow up on pathological inputs
// (giant SCCs, fully-connected graphs), so we still fall through to the
// "too large" message as a final escape hatch. Normal operation should never
// hit this — ChunkedGraphView has its own in-chunk fallback (CHUNK_MAX_NODES)
// for giant SCCs.
const GRAPH_MAX_NODES = 500;

// =============================================================================
// Types
// =============================================================================

/**
 * Dagre library interface. Uses a permissive signature so both
 * typed (`@types/dagre`) and untyped dagre imports are accepted.
 * The actual constraints are enforced inside `getLayoutedElements`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DagreLib = { graphlib: { Graph: any }; layout: any };

export interface StateMachineGraphViewProps {
  /** The dagre library instance (app provides its own import). */
  dagre: DagreLib;
  /** States to display as nodes. */
  states: StateMachineState[];
  /** Transitions to display as edges. */
  transitions: StateMachineTransition[];
  /** Currently selected state ID. */
  selectedStateId: string | null;
  /** Currently selected transition ID (semantic or database). */
  selectedTransitionId: string | null;
  /** Called when a state node is selected/deselected. */
  onSelectState: (stateId: string | null) => void;
  /** Called when a transition edge is selected/deselected. */
  onSelectTransition: (transitionId: string | null) => void;
  /** Called when delete key is pressed on a selected transition. */
  onDeleteTransition?: (id: string) => void;
  /** Pathfinding highlight: list of steps whose edges to highlight. */
  highlightedPath?: PathfindingStep[];
  /** Override the initial state ID (otherwise determined from metadata). */
  initialStateId?: string | null;
  /** Empty state message shown when there are no states. */
  emptyMessage?: string;

  // --- Drag-and-drop support (optional) ---
  /** Called when an element tile drag starts. */
  onStartElementDrag?: (stateId: string, elementId: string) => void;
  /** Container onDragOver handler for element drag-and-drop. */
  onDragOver?: (event: React.DragEvent) => void;
  /** Container onDrop handler for element drag-and-drop. */
  onDrop?: (event: React.DragEvent) => void;
  /** Whether a drag is currently in progress. */
  isDragging?: boolean;
  /** The state ID that is currently a drop target. */
  dropTargetStateId?: string | null;

  // --- Selection ID mapping ---
  /**
   * Map a transition's semantic transition_id to the ID used by
   * onSelectTransition/onDeleteTransition. By default returns the
   * transition_id. Override to return e.g. the database `id`.
   */
  resolveTransitionSelectionId?: (
    transition: StateMachineTransition,
  ) => string;

  // --- Extra keyboard shortcut entries ---
  /**
   * Additional shortcut entries to show in the keyboard shortcuts panel.
   * Each entry is [label, keyDescription].
   */
  extraShortcutEntries?: [string, string][];

  // --- Element thumbnails (optional) ---
  /** Map of element ID → base64 PNG thumbnail for rendering in state node tiles. */
  elementThumbnails?: Record<string, string>;
}

// =============================================================================
// Inner component (needs ReactFlowProvider)
// =============================================================================

function StateMachineGraphViewInner({
  dagre: dagreLib,
  states,
  transitions,
  selectedStateId,
  selectedTransitionId,
  onSelectState,
  onSelectTransition,
  onDeleteTransition,
  highlightedPath,
  initialStateId,
  emptyMessage = "No states in this config.",
  onStartElementDrag,
  onDragOver,
  onDrop,
  isDragging,
  dropTargetStateId,
  resolveTransitionSelectionId,
  extraShortcutEntries,
  elementThumbnails,
}: StateMachineGraphViewProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const reactFlowInstance = useReactFlow();
  const prevStateCountRef = useRef(states.length);

  const highlightedTransitionIds = useMemo(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath],
  );

  // Determine initial state
  const effectiveInitialStateId = useMemo(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => (s.extra_metadata as Record<string, unknown>)?.initial === true,
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);

  // Compute transition counts per state
  const transitionCounts = useMemo(() => {
    const outgoing = new Map<string, number>();
    const incoming = new Map<string, number>();
    for (const t of transitions) {
      for (const from of t.from_states) outgoing.set(from, (outgoing.get(from) ?? 0) + 1);
      for (const to of t.activate_states) incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
    return { outgoing, incoming };
  }, [transitions]);

  // Build nodes
  const initialNodes: Node[] = useMemo(
    () =>
      states.map((state) => ({
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
          isBlocking: (state.extra_metadata as Record<string, unknown>)?.blocking === true,
          isSelected: state.state_id === selectedStateId,
          isInitial: state.state_id === effectiveInitialStateId,
          outgoingCount: transitionCounts.outgoing.get(state.state_id) ?? 0,
          incomingCount: transitionCounts.incoming.get(state.state_id) ?? 0,
          isDropTarget: isDragging && dropTargetStateId === state.state_id,
          onStartElementDrag,
          elementThumbnails,
        } satisfies StateNodeData,
      })),
    [states, selectedStateId, effectiveInitialStateId, transitionCounts, isDragging, dropTargetStateId, onStartElementDrag, elementThumbnails],
  );

  // Resolve transition selection ID
  const getSelectionId = useCallback(
    (trans: StateMachineTransition) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(trans);
      return trans.transition_id;
    },
    [resolveTransitionSelectionId],
  );

  // Find which transition_id is selected (reverse-map from selection ID)
  const selectedTransitionSemanticId = useMemo(() => {
    if (!selectedTransitionId) return null;
    const trans = transitions.find((t) => getSelectionId(t) === selectedTransitionId);
    return trans?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);

  // Build edges
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (const trans of transitions) {
      const isSelected = trans.transition_id === selectedTransitionSemanticId;
      for (const fromState of trans.from_states) {
        for (const toState of trans.activate_states) {
          edges.push({
            id: `${trans.transition_id}-${fromState}-${toState}`,
            source: fromState,
            target: toState,
            type: "transitionEdge",
            selected: isSelected,
            markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: trans.transition_id,
              name: trans.name,
              pathCost: trans.path_cost,
              actionCount: trans.actions.length,
              actionTypes: trans.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(trans.transition_id),
              staysVisible: trans.stays_visible,
              firstActionTarget: firstActionTargetString(trans.actions[0]),
            } satisfies TransitionEdgeData,
          });
        }
      }
    }
    return edges;
  }, [transitions, highlightedTransitionIds, selectedTransitionSemanticId]);

  // Apply dagre layout
  const layouted = useMemo(() => {
    if (initialNodes.length === 0) return { nodes: [], edges: [] };
    return getLayoutedElements(dagreLib as Parameters<typeof getLayoutedElements>[0], initialNodes, initialEdges, STATE_MACHINE_LAYOUT_OPTIONS);
  }, [dagreLib, initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);

  useEffect(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);

  // Auto-fit when states are added
  useEffect(() => {
    if (states.length > prevStateCountRef.current) {
      setTimeout(() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED), 100);
    }
    prevStateCountRef.current = states.length;
  }, [states.length, reactFlowInstance]);

  // Selection handling
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams) => {
      const firstNode = selectedNodes[0];
      const firstEdge = selectedEdges[0];
      if (firstNode) {
        const nd = firstNode.data as unknown as StateNodeData;
        onSelectState(nd.stateId);
        onSelectTransition(null);
      } else if (firstEdge) {
        const ed = firstEdge.data as unknown as TransitionEdgeData;
        const trans = transitions.find((t) => t.transition_id === ed?.transitionId);
        onSelectTransition(trans ? getSelectionId(trans) : null);
        onSelectState(null);
      } else {
        onSelectState(null);
        onSelectTransition(null);
      }
    },
    [onSelectState, onSelectTransition, transitions, getSelectionId],
  );

  // Re-layout
  const handleRelayout = useCallback(() => {
    const result = getLayoutedElements(dagreLib as Parameters<typeof getLayoutedElements>[0], nodes, edges, STATE_MACHINE_LAYOUT_OPTIONS);
    setNodes(result.nodes);
    setEdges(result.edges);
    setTimeout(() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED), 50);
  }, [dagreLib, nodes, edges, setNodes, setEdges, reactFlowInstance]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "Escape") {
        onSelectState(null);
        onSelectTransition(null);
        setShowShortcuts(false);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) setShowShortcuts((p) => !p);
      if (e.key === "f" && !e.ctrlKey && !e.metaKey && !e.altKey)
        reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED);
      if (e.key === "l" && !e.ctrlKey && !e.metaKey && !e.altKey) handleRelayout();
      if (e.key === "=" || e.key === "+") reactFlowInstance.zoomIn({ duration: 200 });
      if (e.key === "-") reactFlowInstance.zoomOut({ duration: 200 });

      // I -- jump to initial state
      if (e.key === "i" && !e.ctrlKey && !e.metaKey && !e.altKey && effectiveInitialStateId) {
        onSelectState(effectiveInitialStateId);
        onSelectTransition(null);
        const node = reactFlowInstance.getNode(effectiveInitialStateId);
        if (node) {
          reactFlowInstance.setCenter(node.position.x + 130, node.position.y + 60, {
            duration: 300,
            zoom: reactFlowInstance.getZoom(),
          });
        }
      }

      // Delete selected transition
      if ((e.key === "Delete" || e.key === "Backspace") && !e.ctrlKey && !e.metaKey) {
        const selectedEdge = edges.find((edge) => edge.selected);
        if (selectedEdge && onDeleteTransition) {
          const ed = selectedEdge.data as unknown as TransitionEdgeData;
          if (ed?.transitionId) {
            const trans = transitions.find((t) => t.transition_id === ed.transitionId);
            if (trans) {
              e.preventDefault();
              onDeleteTransition(getSelectionId(trans));
            }
          }
        }
      }

      // Tab -- cycle states
      if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && states.length > 0) {
        e.preventDefault();
        const currentIndex = states.findIndex(
          (s) => s.state_id === nodes.find((n) => n.selected)?.id,
        );
        const nextIndex = e.shiftKey
          ? currentIndex <= 0 ? states.length - 1 : currentIndex - 1
          : (currentIndex + 1) % states.length;
        const nextState = states[nextIndex];
        if (nextState) {
          onSelectState(nextState.state_id);
          onSelectTransition(null);
          const node = reactFlowInstance.getNode(nextState.state_id);
          if (node) {
            reactFlowInstance.setCenter(node.position.x + 130, node.position.y + 60, {
              duration: 300,
              zoom: reactFlowInstance.getZoom(),
            });
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onSelectState,
    onSelectTransition,
    reactFlowInstance,
    handleRelayout,
    states,
    nodes,
    edges,
    transitions,
    effectiveInitialStateId,
    onDeleteTransition,
    getSelectionId,
  ]);

  // Stats
  const graphStats = useMemo(
    () => ({
      stateCount: states.length,
      transitionCount: transitions.length,
      initialStateName: states.find((s) => s.state_id === effectiveInitialStateId)?.name ?? "None",
    }),
    [states, transitions, effectiveInitialStateId],
  );

  if (states.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Hard safeguard — this branch should rarely fire in normal use because
  // graphs above CHUNKED_VIEW_THRESHOLD (80) are delegated to
  // `ChunkedGraphView` in the outer wrapper, which decomposes the graph
  // into SCC + chain-compacted chunks. It only fires if an external caller
  // mounts `StateMachineGraphViewInner` directly (bypassing the wrapper)
  // with an oversized graph. Treat it as a final escape hatch for
  // pathological inputs — dagre + the ReactFlow store can exhaust WebView2
  // memory above a few hundred nodes even with viewport virtualization.
  if (states.length > GRAPH_MAX_NODES) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8 text-text-muted">
        <LayoutGrid className="size-10 opacity-40" />
        <p className="text-sm font-medium text-text-primary">
          Graph too large to render ({states.length} states, {transitions.length} transitions).
        </p>
        <p className="text-xs max-w-md">
          Graphs above {GRAPH_MAX_NODES} nodes overwhelm the browser's layout
          engine. Use the <span className="text-brand-primary">State View</span> tab
          to browse all states with search, filter, and detail panels.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        minZoom={0.05}
        maxZoom={3}
        // Viewport-based virtualization: only mount nodes/edges that are
        // actually on-screen. Combined with fitView's minZoom cap, this
        // keeps the active DOM subtree tractable regardless of graph size.
        onlyRenderVisibleElements
        deleteKeyCode={null}
        selectNodesOnDrag={false}
      >
        <Background gap={20} size={1} variant={BackgroundVariant.Dots} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as unknown as StateNodeData;
            if (d?.isInitial) return "#FFD700";
            return d?.isBlocking ? "#f59e0b" : "var(--brand-primary)";
          }}
          maskColor="rgba(0,0,0,0.15)"
          pannable
          zoomable
        />

        {/* Top right controls */}
        <Panel position="top-right">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED)}
              className="flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded"
              title="Fit to view (F)"
            >
              <Maximize className="size-3.5" />
              Fit
            </button>
            <button
              onClick={() => setShowShortcuts((p) => !p)}
              className="flex items-center justify-center h-7 w-7 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="size-3.5" />
            </button>
            <button
              onClick={handleRelayout}
              className="flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary border border-border-secondary hover:border-text-muted rounded"
              title="Re-layout (L)"
            >
              <LayoutGrid className="size-3.5" />
              Re-layout
            </button>
          </div>
        </Panel>

        {/* Bottom left stats */}
        <Panel position="bottom-left">
          <div className="text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2">
            <span>{graphStats.stateCount} states</span>
            <span className="text-text-muted/30">|</span>
            <span>{graphStats.transitionCount} transitions</span>
            {graphStats.initialStateName !== "None" && (
              <>
                <span className="text-text-muted/30">|</span>
                <span className="text-yellow-500">
                  <Play className="size-2 inline mr-0.5 fill-current" />
                  {graphStats.initialStateName}
                </span>
              </>
            )}
          </div>
        </Panel>

        {/* Keyboard shortcuts overlay */}
        {showShortcuts && (
          <Panel position="bottom-right">
            <div className="bg-bg-primary/95 border border-border-secondary rounded-lg p-4 text-xs shadow-lg backdrop-blur-xs min-w-[200px]">
              <h4 className="font-semibold text-text-primary mb-2.5">Keyboard Shortcuts</h4>
              <div className="space-y-1.5 text-text-muted">
                {[
                  ["Deselect all", "Esc"],
                  ["Toggle shortcuts", "?"],
                  ["Fit to view", "F"],
                  ["Re-layout", "L"],
                  ["Zoom in/out", "+ / -"],
                ].map(([label, key]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span>{label}</span>
                    <kbd className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono">{key}</kbd>
                  </div>
                ))}
                <div className="border-t border-border-secondary pt-1.5 mt-1.5">
                  {[
                    ["Cycle states", "Tab"],
                    ["Jump to initial", "I"],
                    ["Delete transition", "Del"],
                    ...(extraShortcutEntries ?? []),
                  ].map(([label, key]) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <span>{label}</span>
                      <kbd className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono">{key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

// =============================================================================
// Exported wrapper with ReactFlowProvider
// =============================================================================

export function StateMachineGraphView(props: StateMachineGraphViewProps) {
  // Delegate to ChunkedGraphView above the threshold. The empty-state
  // guard inside the inner component still wins for zero states — we only
  // chunk when there's actually a non-trivial graph to decompose.
  //
  // `ChunkedGraphView` owns its own ReactFlowProvider(s) internally (each
  // of its sub-canvases wraps itself), so we short-circuit BEFORE mounting
  // the outer provider here to avoid nesting a redundant one.
  if (props.states.length > CHUNKED_VIEW_THRESHOLD) {
    return <ChunkedGraphView {...props} />;
  }
  return (
    <ReactFlowProvider>
      <StateMachineGraphViewInner {...props} />
    </ReactFlowProvider>
  );
}
