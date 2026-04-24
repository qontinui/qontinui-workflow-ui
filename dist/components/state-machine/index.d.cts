import * as react_jsx_runtime from 'react/jsx-runtime';
import { StateMachineState, StateMachineTransition, PathfindingStep, StateMachineTransitionCreate, StateMachineStateUpdate, PathfindingResult } from '@qontinui/shared-types';
import * as React$1 from 'react';
import { NodeProps, EdgeProps } from '@xyflow/react';
import { Chunk } from '@qontinui/workflow-utils';
import { P as PermittedTrigger, B as BlockedTrigger } from '../../types-BcoFAlzg.cjs';
import '@qontinui/shared-types/workflow';
import '@qontinui/shared-types/library';

/**
 * Dagre library interface. Uses a permissive signature so both
 * typed (`@types/dagre`) and untyped dagre imports are accepted.
 * The actual constraints are enforced inside `getLayoutedElements`.
 */
type DagreLib = {
    graphlib: {
        Graph: any;
    };
    layout: any;
};
interface StateMachineGraphViewProps {
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
    /**
     * Map a transition's semantic transition_id to the ID used by
     * onSelectTransition/onDeleteTransition. By default returns the
     * transition_id. Override to return e.g. the database `id`.
     */
    resolveTransitionSelectionId?: (transition: StateMachineTransition) => string;
    /**
     * Additional shortcut entries to show in the keyboard shortcuts panel.
     * Each entry is [label, keyDescription].
     */
    extraShortcutEntries?: [string, string][];
    /** Map of element ID → base64 PNG thumbnail for rendering in state node tiles. */
    elementThumbnails?: Record<string, string>;
    /**
     * If set, the chunked overview narrows to chunks containing matching
     * states and shows per-chunk match counts (`Login flow (2 matches)`).
     * Case-insensitive substring match against each state's name and
     * description. Has no effect on the non-chunked single-view path.
     * Consumers typically thread this through from a page-level search
     * input — if no such input exists above `<StateMachineGraphView>`,
     * leave it undefined.
     */
    searchQuery?: string;
    /**
     * User-chosen chunk labels keyed by chunk id (stable djb2 hash under
     * input reorder). When set, overrides the auto-derived `chunk.name`
     * shown in the chunked overview.
     *
     * Ignored when the graph is below the chunking threshold (single-view
     * path doesn't render chunk cards).
     */
    chunkLabels?: Map<string, string>;
    /**
     * Called when the user saves a new chunk label. Passing an empty string
     * removes the override and the view falls back to the auto-derived
     * name. When this callback is absent the library renders the chunked
     * overview read-only — the rename affordance is hidden entirely.
     */
    onSaveChunkLabel?: (chunkId: string, label: string) => void;
}
declare function StateMachineGraphView(props: StateMachineGraphViewProps): react_jsx_runtime.JSX.Element;

interface ChunkedGraphViewProps extends StateMachineGraphViewProps {
}
declare function ChunkedGraphView(props: ChunkedGraphViewProps): react_jsx_runtime.JSX.Element;

interface ChunkNodeData {
    chunk: Chunk;
    matchCount?: number;
    /**
     * Names of the states contained in this chunk, used to populate the
     * hover tooltip. Supplied by the chunk node builder; if absent the
     * tooltip degrades to showing only the chunk name.
     */
    stateNames?: string[];
    /**
     * True when this chain chunk is currently expanded inline in the
     * overview (so that the chevron renders rotated). Ignored for
     * non-chain chunks.
     */
    isExpanded?: boolean;
    /**
     * Toggle inline-expansion of a chain chunk. When provided AND the
     * chunk is a chain, a chevron toggle button is rendered on the card
     * header. Clicking the toggle calls this (and swallows the event so
     * the body click — which drills in — doesn't also fire).
     */
    onToggleExpand?: (chunkId: string) => void;
    /**
     * User-chosen label override. If set and non-empty, takes precedence
     * over `chunk.name` in the rendered card header and tooltip.
     */
    userLabel?: string;
    /**
     * Called when the user saves a new label. Passing an empty string
     * removes the override (the view reverts to the auto-derived name).
     * When this prop is absent the rename affordance (pencil icon) is not
     * rendered — the library is effectively read-only for renames.
     */
    onSaveLabel?: (chunkId: string, label: string) => void;
}
declare function ChunkOverviewNodeInner({ data, selected }: NodeProps): react_jsx_runtime.JSX.Element;
declare const ChunkOverviewNode: React$1.MemoExoticComponent<typeof ChunkOverviewNodeInner>;

interface ChunkPortNodeData {
    /** "input" = incoming cross-chunk edge; "output" = outgoing. */
    direction: "input" | "output";
    /** Adjacent chunk id this port represents. */
    adjacentChunkId: string;
    /** Adjacent chunk name (used in the label). */
    adjacentChunkName: string;
    /** Click handler — navigate to `adjacentChunkId`. */
    onNavigate?: (chunkId: string) => void;
}
declare function ChunkPortNodeInner({ data }: NodeProps): react_jsx_runtime.JSX.Element;
declare const ChunkPortNode: React$1.MemoExoticComponent<typeof ChunkPortNodeInner>;

declare function StateMachineStateNodeInner({ data }: NodeProps): react_jsx_runtime.JSX.Element;
declare const StateMachineStateNode: React$1.MemoExoticComponent<typeof StateMachineStateNodeInner>;

declare function StateMachineTransitionEdgeInner(props: EdgeProps): react_jsx_runtime.JSX.Element;
declare const StateMachineTransitionEdge: React$1.MemoExoticComponent<typeof StateMachineTransitionEdgeInner>;

interface TransitionEditorProps {
    /** Transition to edit (null = create new) */
    transition: StateMachineTransition | null;
    /** All states in the config (for from/activate/exit selectors) */
    states: StateMachineState[];
    /** Called when creating a new transition */
    onSave: (data: StateMachineTransitionCreate) => Promise<void>;
    /** Called when updating an existing transition */
    onUpdate: (id: string, data: Partial<StateMachineTransitionCreate>) => Promise<void>;
    /** Called when deleting a transition */
    onDelete: (id: string) => Promise<void>;
    /** Called to close the editor */
    onClose: () => void;
}
declare function TransitionEditor({ transition, states, onSave, onUpdate, onDelete, onClose, }: TransitionEditorProps): react_jsx_runtime.JSX.Element;

interface TransitionsPanelProps {
    states: StateMachineState[];
    transitions: StateMachineTransition[];
    /**
     * Currently-selected transition id. Fully controlled — the panel never
     * keeps its own shadow copy, so external selections (e.g., from the Graph
     * Editor tab) show up here and internal clicks flow out to the parent via
     * `onSelectTransition`.
     */
    selectedTransitionId: string | null;
    onSelectTransition: (id: string | null) => void;
    /**
     * Active-state IDs for the "permitted from active states" filter. When
     * omitted, the filter toggle has no effect (the filter is still visible
     * but disabled).
     */
    activeStateIds?: string[];
    /**
     * Permitted triggers computed from the current active state set. Usually
     * fetched by the parent via ``useWorkflowData().getPermittedTriggers``.
     */
    permittedTriggers?: PermittedTrigger[];
    /**
     * Blocked triggers (with reasons) computed from the current active state
     * set.
     */
    blockedTriggers?: BlockedTrigger[];
}
declare function TransitionsPanel({ states, transitions, selectedTransitionId, onSelectTransition, activeStateIds, permittedTriggers, blockedTriggers, }: TransitionsPanelProps): react_jsx_runtime.JSX.Element;

interface StateDetailPanelProps {
    /** The state to display/edit */
    state: StateMachineState;
    /** Called when saving changes. Receives state.id and the update payload. */
    onSave: (stateId: string, updates: StateMachineStateUpdate) => Promise<void>;
    /** Called when deleting the state */
    onDelete?: (stateId: string) => Promise<void>;
    /** Called to close the panel */
    onClose: () => void;
}
declare function StateDetailPanel({ state, onSave, onDelete, onClose, }: StateDetailPanelProps): react_jsx_runtime.JSX.Element;

/**
 * Shared constants and helper functions for StateViewPanel sub-components.
 */

/** Fingerprint detail from discovery co-occurrence data. */
interface FingerprintDetail {
    tagName: string;
    role: string;
    accessibleName?: string;
    positionZone: string;
    relativePosition: {
        top: number;
        left: number;
    };
    sizeCategory?: string;
}
/** Metadata for a capture screenshot (without image data). */
interface CaptureScreenshotMeta {
    id: string;
    configId: string;
    captureIndex: number;
    width: number;
    height: number;
    elementBoundsJson: string;
    fingerprintHashesJson: string;
    capturedAt: string;
}

interface StateViewPanelProps {
    states: StateMachineState[];
    transitions: StateMachineTransition[];
    selectedStateId: string | null;
    onSelectState: (stateId: string | null) => void;
    /** Optional map of element ID (or fingerprint hash) → base64 PNG thumbnail. */
    elementThumbnails?: Record<string, string>;
    /** Optional fingerprint details from discovery. Keys are fingerprint hashes. */
    fingerprintDetails?: Record<string, FingerprintDetail>;
    /** Optional capture screenshot metadata for screenshot view. */
    captureScreenshots?: CaptureScreenshotMeta[];
    /** Callback to load a screenshot image on demand. Returns data URL. */
    onLoadScreenshotImage?: (screenshotId: string) => Promise<string>;
}
declare function StateViewPanel({ states, transitions, selectedStateId, onSelectState, elementThumbnails, fingerprintDetails, captureScreenshots, onLoadScreenshotImage, }: StateViewPanelProps): react_jsx_runtime.JSX.Element;

interface PathfindingPanelProps {
    /** All states in the config */
    states: StateMachineState[];
    /** All transitions in the config */
    transitions: StateMachineTransition[];
    /** Optional: called when a path is found (e.g., to highlight on graph) */
    onPathFound?: (result: PathfindingResult) => void;
    /** Optional: custom pathfinding function (e.g., server-side via API) */
    onFindPath?: (fromStates: string[], targetStates: string[]) => Promise<PathfindingResult>;
}
declare function PathfindingPanel({ states, transitions, onPathFound, onFindPath, }: PathfindingPanelProps): react_jsx_runtime.JSX.Element;

interface StateViewTableProps {
    /** All states to display */
    states: StateMachineState[];
    /** Currently selected state ID (state_id, not database id) */
    selectedStateId: string | null;
    /** Called when a state is selected */
    onSelectState: (stateId: string | null) => void;
}
declare function StateViewTable({ states, selectedStateId, onSelectState, }: StateViewTableProps): react_jsx_runtime.JSX.Element;

/**
 * DiagramTab — live Mermaid rendering of the loaded state machine.
 *
 * Renders a Mermaid ``stateDiagram-v2`` (fetched from the runner's
 * ``GET /state-machine/mermaid-diagram`` endpoint) with active-state
 * highlighting baked into the diagram source by ``PathVisualizer``.
 *
 * ``mermaid`` is imported dynamically so this package stays headless —
 * consumers must add ``mermaid`` as a dependency (declared as an optional
 * peer here). If the dynamic import fails, a helpful install hint is shown
 * instead of a blank pane.
 */
interface DiagramTabProps {
    /**
     * Hypothetical active-state IDs the parent used when fetching
     * ``diagramSource``. Passed through for display purposes only — the
     * highlighting is already encoded in ``diagramSource``.
     */
    activeStateIds?: string[];
    /** Mermaid diagram source (``stateDiagram-v2``). */
    diagramSource?: string;
    /** Whether the parent is currently fetching the diagram. */
    isLoading?: boolean;
    /** Optional: manual refresh handler. Shows a refresh button when provided. */
    onRefresh?: () => void;
    /**
     * If set, render this message instead of the diagram. Caller uses this to
     * signal "too large to render" without DiagramTab needing to know about
     * state counts or other domain concepts.
     */
    unavailableReason?: string;
}
declare function DiagramTab({ activeStateIds, diagramSource, isLoading, onRefresh, unavailableReason, }: DiagramTabProps): react_jsx_runtime.JSX.Element;

/**
 * Synthetic giant-SCC state machine generator.
 *
 * Exists to exercise the nested-drill code path in `ChunkedGraphView` —
 * the primary chunker never produces a chunk > `CHUNK_MAX_NODES` (150)
 * from real-world configs, so without a synthetic fixture the
 * `decomposeGiantSCC` UI branch is unreachable in manual testing.
 *
 * The shape is a classic "hub + N linear branches" giant-SCC:
 *
 *     H → B1_0 → B1_1 → ... → B1_{m-1} → H    (branch 1)
 *     H → B2_0 → ...                           (branch 2)
 *       ...
 *
 * All branch nodes are only reachable through H, so every state lies in
 * a single strongly-connected component. With `m >= 20`, three branches
 * yields 61 states; ten branches yields 201 states (well above the
 * 150-state giant-SCC threshold).
 *
 * See `qontinui-workflow-utils/src/state-machine/scc-secondary.test.ts`
 * Case 2 for the canonical shape this mirrors.
 *
 * NOT EXPORTED FROM THE PACKAGE ROOT — test/dev-fixture use only. Pull
 * via the deep import:
 *
 *   import { generateGiantSCC } from
 *     "@qontinui/workflow-ui/dist/components/state-machine/__fixtures__/giant-scc";
 *
 * or reach it directly from a neighbouring runner dev component via the
 * relative source path. Keeping it off the public exports keeps test
 * helpers out of production bundles.
 */

interface GenerateGiantSCCOptions {
    /**
     * Number of linear branches emanating from the hub. Default 10.
     * Total states = 1 + branches * branchLength.
     */
    branches?: number;
    /**
     * States per branch (not counting the hub). Default 20.
     */
    branchLength?: number;
    /**
     * Stable prefix for generated state ids (e.g. "dev-giant"). Default
     * "giant".
     */
    idPrefix?: string;
    /**
     * Config id to stamp on every state + transition. Default
     * "synthetic-giant-scc".
     */
    configId?: string;
}
interface GiantSCCFixture {
    states: StateMachineState[];
    transitions: StateMachineTransition[];
    /** The hub state id — convenient for auto-drill targeting. */
    hubStateId: string;
}
/**
 * Generate a synthetic state machine containing exactly ONE giant SCC.
 *
 * Defaults (`branches=10`, `branchLength=20`) produce a 201-state SCC,
 * which exceeds `ChunkedGraphView`'s 150-state giant-SCC threshold and
 * therefore triggers the nested-overview render path.
 */
declare function generateGiantSCC(opts?: GenerateGiantSCCOptions): GiantSCCFixture;

export { type CaptureScreenshotMeta, type ChunkNodeData, ChunkOverviewNode, ChunkPortNode, type ChunkPortNodeData, ChunkedGraphView, type ChunkedGraphViewProps, DiagramTab, type DiagramTabProps, type FingerprintDetail, type GenerateGiantSCCOptions, type GiantSCCFixture, PathfindingPanel, type PathfindingPanelProps, StateDetailPanel, type StateDetailPanelProps, StateMachineGraphView, type StateMachineGraphViewProps, StateMachineStateNode, StateMachineTransitionEdge, StateViewPanel, type StateViewPanelProps, StateViewTable, type StateViewTableProps, TransitionEditor, type TransitionEditorProps, TransitionsPanel, type TransitionsPanelProps, generateGiantSCC };
