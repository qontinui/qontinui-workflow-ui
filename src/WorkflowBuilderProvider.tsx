import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type {
  UnifiedWorkflow,
  UnifiedStep,
  WorkflowPhase,
  WorkflowStage,
  WorkflowFeatures,
} from "@qontinui/shared-types/workflow";
import {
  createDefaultWorkflow,
  generateStepId,
} from "@qontinui/workflow-utils";
import {
  detectWorkflowFeatures,
  isWorkflowEmpty,
  getTotalStepCount,
} from "@qontinui/workflow-utils";

// ============================================================================
// State
// ============================================================================

export interface WorkflowBuilderState {
  workflow: UnifiedWorkflow;
  originalWorkflow: UnifiedWorkflow | null;
  selectedStepId: string | null;
  currentStageIndex: number;
  expandedPhases: Record<WorkflowPhase, boolean>;
  isAddStepOpen: boolean;
  addStepPhase: WorkflowPhase | null;
}

// ============================================================================
// Actions
// ============================================================================

export type WorkflowBuilderAction =
  | { type: "SET_WORKFLOW"; workflow: UnifiedWorkflow }
  | { type: "SET_ORIGINAL_WORKFLOW"; workflow: UnifiedWorkflow | null }
  | { type: "UPDATE_WORKFLOW"; updates: Partial<UnifiedWorkflow> }
  | { type: "ADD_STEP"; step: UnifiedStep; phase: WorkflowPhase }
  | { type: "REMOVE_STEP"; stepId: string; phase: WorkflowPhase }
  | { type: "UPDATE_STEP"; stepId: string; updates: Partial<UnifiedStep> }
  | {
      type: "MOVE_STEP";
      stepId: string;
      phase: WorkflowPhase;
      direction: "up" | "down";
    }
  | { type: "REORDER_STEPS"; phase: WorkflowPhase; steps: UnifiedStep[] }
  | { type: "DUPLICATE_STEP"; stepId: string; phase: WorkflowPhase }
  | { type: "SELECT_STEP"; stepId: string | null }
  | { type: "TOGGLE_PHASE"; phase: WorkflowPhase }
  | { type: "OPEN_ADD_STEP"; phase: WorkflowPhase }
  | { type: "CLOSE_ADD_STEP" }
  | { type: "SET_STAGE_INDEX"; index: number }
  | { type: "ADD_STAGE"; stage: WorkflowStage }
  | { type: "REMOVE_STAGE"; stageIndex: number }
  | {
      type: "UPDATE_STAGE";
      stageIndex: number;
      updates: Partial<WorkflowStage>;
    }
  | { type: "ENABLE_STAGES" }
  | { type: "DISABLE_STAGES" }
  | { type: "RESET" };

// ============================================================================
// Phase helpers
// ============================================================================

function getPhaseSteps(
  workflow: UnifiedWorkflow,
  phase: WorkflowPhase,
  stageIndex: number,
): UnifiedStep[] {
  const source =
    workflow.stages &&
    workflow.stages.length > 0 &&
    stageIndex < workflow.stages.length
      ? workflow.stages[stageIndex]
      : workflow;
  switch (phase) {
    case "setup":
      return source.setupSteps;
    case "verification":
      return source.verificationSteps;
    case "agentic":
      return source.agenticSteps;
    case "completion":
      return source.completionSteps ?? [];
  }
}

function setPhaseSteps(
  workflow: UnifiedWorkflow,
  phase: WorkflowPhase,
  stageIndex: number,
  steps: UnifiedStep[],
): UnifiedWorkflow {
  if (
    workflow.stages &&
    workflow.stages.length > 0 &&
    stageIndex < workflow.stages.length
  ) {
    const stages = [...workflow.stages];
    const stage = { ...stages[stageIndex] };
    switch (phase) {
      case "setup":
        stage.setupSteps = steps;
        break;
      case "verification":
        stage.verificationSteps = steps;
        break;
      case "agentic":
        stage.agenticSteps = steps;
        break;
      case "completion":
        stage.completionSteps = steps;
        break;
    }
    stages[stageIndex] = stage;
    return { ...workflow, stages };
  }
  switch (phase) {
    case "setup":
      return {
        ...workflow,
        setupSteps: steps,
      };
    case "verification":
      return {
        ...workflow,
        verificationSteps: steps,
      };
    case "agentic":
      return {
        ...workflow,
        agenticSteps: steps,
      };
    case "completion":
      return {
        ...workflow,
        completionSteps: steps,
      };
  }
}

// ============================================================================
// Reducer
// ============================================================================

function workflowBuilderReducer(
  state: WorkflowBuilderState,
  action: WorkflowBuilderAction,
): WorkflowBuilderState {
  switch (action.type) {
    case "SET_WORKFLOW":
      return { ...state, workflow: action.workflow, selectedStepId: null };

    case "SET_ORIGINAL_WORKFLOW":
      return { ...state, originalWorkflow: action.workflow };

    case "UPDATE_WORKFLOW":
      return { ...state, workflow: { ...state.workflow, ...action.updates } };

    case "ADD_STEP": {
      const steps = [
        ...getPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
        ),
        action.step,
      ];
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          steps,
        ),
        selectedStepId: (action.step as { id: string }).id,
      };
    }

    case "REMOVE_STEP": {
      const steps = getPhaseSteps(
        state.workflow,
        action.phase,
        state.currentStageIndex,
      ).filter((s) => s.id !== action.stepId);
      const selectedStepId =
        state.selectedStepId === action.stepId ? null : state.selectedStepId;
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          steps,
        ),
        selectedStepId,
      };
    }

    case "UPDATE_STEP": {
      const wf = state.workflow;
      const updateInSteps = (steps: UnifiedStep[]) =>
        steps.map((s) =>
          s.id === action.stepId
            ? ({ ...s, ...action.updates } as UnifiedStep)
            : s,
        );
      let updated: UnifiedWorkflow = {
        ...wf,
        setupSteps: updateInSteps(wf.setupSteps),
        verificationSteps: updateInSteps(wf.verificationSteps),
        agenticSteps: updateInSteps(wf.agenticSteps),
        completionSteps: updateInSteps(wf.completionSteps ?? []),
      };
      if (updated.stages) {
        updated = {
          ...updated,
          stages: updated.stages.map((s) => ({
            ...s,
            setupSteps: updateInSteps(s.setupSteps),
            verificationSteps: updateInSteps(s.verificationSteps),
            agenticSteps: updateInSteps(s.agenticSteps),
            completionSteps: updateInSteps(s.completionSteps ?? []),
          })),
        };
      }
      return { ...state, workflow: updated };
    }

    case "MOVE_STEP": {
      const steps = [
        ...getPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
        ),
      ];
      const idx = steps.findIndex((s) => s.id === action.stepId);
      if (idx === -1) return state;
      const newIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= steps.length) return state;
      // Don't allow moving past a summary step at the end
      if (
        action.phase === "completion" &&
        newIdx === steps.length - 1 &&
        (steps[steps.length - 1] as { is_summary_step?: boolean })
          .is_summary_step
      )
        return state;
      [steps[idx], steps[newIdx]] = [steps[newIdx], steps[idx]];
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          steps,
        ),
      };
    }

    case "REORDER_STEPS":
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          action.steps,
        ),
      };

    case "DUPLICATE_STEP": {
      const steps = getPhaseSteps(
        state.workflow,
        action.phase,
        state.currentStageIndex,
      );
      const original = steps.find((s) => s.id === action.stepId);
      if (!original) return state;
      const cloneId = generateStepId();
      const clone = {
        ...original,
        id: cloneId,
        name: `${(original as { name?: string }).name ?? ""} (copy)`,
      } as UnifiedStep;
      const idx = steps.findIndex((s) => s.id === action.stepId);
      const newSteps = [...steps];
      newSteps.splice(idx + 1, 0, clone);
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          newSteps,
        ),
        selectedStepId: cloneId,
      };
    }

    case "SELECT_STEP":
      return { ...state, selectedStepId: action.stepId };

    case "TOGGLE_PHASE":
      return {
        ...state,
        expandedPhases: {
          ...state.expandedPhases,
          [action.phase]: !state.expandedPhases[action.phase],
        },
      };

    case "OPEN_ADD_STEP":
      return { ...state, isAddStepOpen: true, addStepPhase: action.phase };

    case "CLOSE_ADD_STEP":
      return { ...state, isAddStepOpen: false, addStepPhase: null };

    case "SET_STAGE_INDEX":
      return {
        ...state,
        currentStageIndex: action.index,
        selectedStepId: null,
      };

    case "ADD_STAGE": {
      const stages = [...(state.workflow.stages ?? []), action.stage];
      return {
        ...state,
        workflow: { ...state.workflow, stages },
        currentStageIndex: stages.length - 1,
      };
    }

    case "REMOVE_STAGE": {
      const stages = (state.workflow.stages ?? []).filter(
        (_, i) => i !== action.stageIndex,
      );
      const newIndex = Math.min(
        state.currentStageIndex,
        Math.max(0, stages.length - 1),
      );
      return {
        ...state,
        workflow: { ...state.workflow, stages },
        currentStageIndex: newIndex,
      };
    }

    case "UPDATE_STAGE": {
      if (!state.workflow.stages) return state;
      const stages = [...state.workflow.stages];
      stages[action.stageIndex] = {
        ...stages[action.stageIndex],
        ...action.updates,
      };
      return { ...state, workflow: { ...state.workflow, stages } };
    }

    case "ENABLE_STAGES": {
      const wf = state.workflow;
      const initialStage: WorkflowStage = {
        id: generateStepId(),
        name: wf.name || "Stage 1",
        description: wf.description,
        setupSteps: wf.setupSteps,
        verificationSteps: wf.verificationSteps,
        agenticSteps: wf.agenticSteps,
        completionSteps: wf.completionSteps ?? [],
        maxIterations: wf.maxIterations,
        timeoutSeconds: wf.timeoutSeconds,
        provider: wf.provider,
        model: wf.model,
        approvalGate: false,
        completionPromptsFirst: false,
      };
      return {
        ...state,
        workflow: {
          ...wf,
          stages: [initialStage],
          setupSteps: [],
          verificationSteps: [],
          agenticSteps: [],
          completionSteps: [],
        },
        currentStageIndex: 0,
      };
    }

    case "DISABLE_STAGES": {
      const wf = state.workflow;
      const first = wf.stages?.[0];
      if (!first) return state;
      return {
        ...state,
        workflow: {
          ...wf,
          stages: undefined,
          setupSteps: first.setupSteps,
          verificationSteps: first.verificationSteps,
          agenticSteps: first.agenticSteps,
          completionSteps: first.completionSteps,
        },
        currentStageIndex: 0,
      };
    }

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

function createInitialState(): WorkflowBuilderState {
  const defaultWf = createDefaultWorkflow();
  // The `createDefaultWorkflow` factory (in @qontinui/workflow-utils) still
  // returns snake_case step fields from the pre-camelCase era. Cast through
  // `unknown` so the rest of this file — which treats the workflow as the
  // current camelCase `UnifiedWorkflow` — type-checks. Runtime serialization
  // remains governed by whatever the factory and reducer write out.
  return {
    workflow: {
      ...defaultWf,
      id: "",
      created_at: "",
      modified_at: "",
    } as unknown as UnifiedWorkflow,
    originalWorkflow: null,
    selectedStepId: null,
    currentStageIndex: 0,
    expandedPhases: {
      setup: true,
      verification: true,
      agentic: true,
      completion: true,
    },
    isAddStepOpen: false,
    addStepPhase: null,
  };
}

// ============================================================================
// Context
// ============================================================================

export interface WorkflowBuilderContextValue {
  state: WorkflowBuilderState;
  dispatch: React.Dispatch<WorkflowBuilderAction>;
  // Computed values
  features: WorkflowFeatures;
  isEmpty: boolean;
  totalStepCount: number;
  hasUnsavedChanges: boolean;
  selectedStep: UnifiedStep | null;
  currentPhaseSteps: (phase: WorkflowPhase) => UnifiedStep[];
}

const WorkflowBuilderContext =
  createContext<WorkflowBuilderContextValue | null>(null);

export function WorkflowBuilderProvider({
  children,
  initialWorkflow,
}: {
  children: React.ReactNode;
  initialWorkflow?: UnifiedWorkflow;
}) {
  const [state, dispatch] = useReducer(workflowBuilderReducer, undefined, () => {
    if (initialWorkflow) {
      return {
        ...createInitialState(),
        workflow: initialWorkflow,
        originalWorkflow: initialWorkflow,
      };
    }
    return createInitialState();
  });

  const features = detectWorkflowFeatures(state.workflow);
  const isEmpty = isWorkflowEmpty(state.workflow);
  const totalStepCount = getTotalStepCount(state.workflow);

  const hasUnsavedChanges =
    state.originalWorkflow !== null &&
    JSON.stringify(state.workflow) !== JSON.stringify(state.originalWorkflow);

  const selectedStep = (() => {
    if (!state.selectedStepId) return null;
    const allSteps: UnifiedStep[] = [
      ...state.workflow.setupSteps,
      ...state.workflow.verificationSteps,
      ...state.workflow.agenticSteps,
      ...(state.workflow.completionSteps ?? []),
      ...(state.workflow.stages ?? []).flatMap((s) => [
        ...s.setupSteps,
        ...s.verificationSteps,
        ...s.agenticSteps,
        ...(s.completionSteps ?? []),
      ]),
    ];
    return allSteps.find((s) => s.id === state.selectedStepId) ?? null;
  })();

  const currentPhaseSteps = useCallback(
    (phase: WorkflowPhase) => {
      return getPhaseSteps(state.workflow, phase, state.currentStageIndex);
    },
    [state.workflow, state.currentStageIndex],
  );

  const value: WorkflowBuilderContextValue = {
    state,
    dispatch,
    features,
    isEmpty,
    totalStepCount,
    hasUnsavedChanges,
    selectedStep,
    currentPhaseSteps,
  };

  return (
    <WorkflowBuilderContext.Provider value={value}>
      {children}
    </WorkflowBuilderContext.Provider>
  );
}

export function useWorkflowBuilder(): WorkflowBuilderContextValue {
  const ctx = useContext(WorkflowBuilderContext);
  if (!ctx)
    throw new Error(
      "useWorkflowBuilder must be used within WorkflowBuilderProvider",
    );
  return ctx;
}
