import * as react_jsx_runtime from 'react/jsx-runtime';
import { StateMachineState, StateMachineTransition, PathfindingStep, StateMachineTransitionCreate, StateMachineStateUpdate, PathfindingResult } from '@qontinui/shared-types';
import * as React$1 from 'react';
import { NodeProps, EdgeProps } from '@xyflow/react';

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
}
declare function StateMachineGraphView(props: StateMachineGraphViewProps): react_jsx_runtime.JSX.Element;

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
    onSelectTransition: (id: string | null) => void;
}
declare function TransitionsPanel({ states, transitions, onSelectTransition, }: TransitionsPanelProps): react_jsx_runtime.JSX.Element;

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
interface StateViewPanelProps {
    states: StateMachineState[];
    transitions: StateMachineTransition[];
    selectedStateId: string | null;
    onSelectState: (stateId: string | null) => void;
    /** Optional map of element ID (or fingerprint hash) → base64 PNG thumbnail. */
    elementThumbnails?: Record<string, string>;
    /** Optional fingerprint details from discovery. Keys are fingerprint hashes. */
    fingerprintDetails?: Record<string, FingerprintDetail>;
}
declare function StateViewPanel({ states, transitions, selectedStateId, onSelectState, elementThumbnails, fingerprintDetails, }: StateViewPanelProps): react_jsx_runtime.JSX.Element;

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

export { type FingerprintDetail, PathfindingPanel, type PathfindingPanelProps, StateDetailPanel, type StateDetailPanelProps, StateMachineGraphView, type StateMachineGraphViewProps, StateMachineStateNode, StateMachineTransitionEdge, StateViewPanel, type StateViewPanelProps, StateViewTable, type StateViewTableProps, TransitionEditor, type TransitionEditorProps, TransitionsPanel, type TransitionsPanelProps };
