/**
 * Shared state machine UI components.
 *
 * These components are used by both qontinui-web and qontinui-runner
 * for building and editing state machine configurations.
 *
 * Components:
 * - StateMachineGraphView — ReactFlow-based state machine graph canvas
 * - StateMachineStateNode — custom ReactFlow node for state cards
 * - StateMachineTransitionEdge — custom ReactFlow edge for transitions
 * - TransitionEditor — create/edit transitions with action forms
 * - TransitionsPanel — read-only transition viewer with action playback animation
 * - StateDetailPanel — view/edit state details with element list
 * - StateViewPanel — rich state viewer with list + force-directed spatial canvas
 * - PathfindingPanel — query paths between states
 * - StateViewTable — tabular state list with filtering
 * - DiagramTab — live Mermaid ``stateDiagram-v2`` with active-state highlight
 */

export { StateMachineGraphView } from "./StateMachineGraphView";
export type { StateMachineGraphViewProps } from "./StateMachineGraphView";

export { ChunkedGraphView } from "./ChunkedGraphView";
export type { ChunkedGraphViewProps } from "./ChunkedGraphView";

export { ChunkOverviewNode } from "./ChunkOverviewNode";
export type { ChunkNodeData } from "./ChunkOverviewNode";

export { ChunkPortNode } from "./ChunkPortNode";
export type { ChunkPortNodeData } from "./ChunkPortNode";

export { StateMachineStateNode } from "./StateMachineStateNode";

export { StateMachineTransitionEdge } from "./StateMachineTransitionEdge";

export { TransitionEditor } from "./TransitionEditor";
export type { TransitionEditorProps } from "./TransitionEditor";

export { TransitionsPanel } from "./TransitionsPanel";
export type { TransitionsPanelProps } from "./TransitionsPanel";

export { StateDetailPanel } from "./StateDetailPanel";
export type { StateDetailPanelProps } from "./StateDetailPanel";

export { StateViewPanel } from "./StateViewPanel";
export type { StateViewPanelProps, FingerprintDetail, CaptureScreenshotMeta } from "./StateViewPanel";

export { PathfindingPanel } from "./PathfindingPanel";
export type { PathfindingPanelProps } from "./PathfindingPanel";

export { StateViewTable } from "./StateViewTable";
export type { StateViewTableProps } from "./StateViewTable";

export { DiagramTab } from "./DiagramTab";
export type { DiagramTabProps } from "./DiagramTab";

// Dev/test fixtures — NOT intended for production code paths. The
// generator is re-exported here so dev fixtures in qontinui-runner can
// import it via the clean subpath `@qontinui/workflow-ui/state-machine`
// instead of reaching into internal paths. Keep consumers in dev-only
// components (tree-shaking drops the import in production builds only
// if the consumer is also gated by `import.meta.env.DEV`).
export {
  generateGiantSCC,
  type GenerateGiantSCCOptions,
  type GiantSCCFixture,
} from "./__fixtures__/giant-scc";
