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
      return source.setup_steps;
    case "verification":
      return source.verification_steps;
    case "agentic":
      return source.agentic_steps;
    case "completion":
      return source.completion_steps ?? [];
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
        stage.setup_steps = steps as WorkflowStage["setup_steps"];
        break;
      case "verification":
        stage.verification_steps =
          steps as WorkflowStage["verification_steps"];
        break;
      case "agentic":
        stage.agentic_steps = steps as WorkflowStage["agentic_steps"];
        break;
      case "completion":
        stage.completion_steps = steps as WorkflowStage["completion_steps"];
        break;
    }
    stages[stageIndex] = stage;
    return { ...workflow, stages };
  }
  switch (phase) {
    case "setup":
      return {
        ...workflow,
        setup_steps: steps as UnifiedWorkflow["setup_steps"],
      };
    case "verification":
      return {
        ...workflow,
        verification_steps: steps as UnifiedWorkflow["verification_steps"],
      };
    case "agentic":
      return {
        ...workflow,
        agentic_steps: steps as UnifiedWorkflow["agentic_steps"],
      };
    case "completion":
      return {
        ...workflow,
        completion_steps: steps as UnifiedWorkflow["completion_steps"],
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
        selectedStepId: action.step.id,
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
        setup_steps: updateInSteps(
          wf.setup_steps,
        ) as UnifiedWorkflow["setup_steps"],
        verification_steps: updateInSteps(
          wf.verification_steps,
        ) as UnifiedWorkflow["verification_steps"],
        agentic_steps: updateInSteps(
          wf.agentic_steps,
        ) as UnifiedWorkflow["agentic_steps"],
        completion_steps: updateInSteps(
          wf.completion_steps ?? [],
        ) as UnifiedWorkflow["completion_steps"],
      };
      if (updated.stages) {
        updated = {
          ...updated,
          stages: updated.stages.map((s) => ({
            ...s,
            setup_steps: updateInSteps(
              s.setup_steps,
            ) as WorkflowStage["setup_steps"],
            verification_steps: updateInSteps(
              s.verification_steps,
            ) as WorkflowStage["verification_steps"],
            agentic_steps: updateInSteps(
              s.agentic_steps,
            ) as WorkflowStage["agentic_steps"],
            completion_steps: updateInSteps(
              s.completion_steps ?? [],
            ) as WorkflowStage["completion_steps"],
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
      const clone = {
        ...original,
        id: generateStepId(),
        name: `${original.name} (copy)`,
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
        selectedStepId: clone.id,
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
        setup_steps: wf.setup_steps,
        verification_steps: wf.verification_steps,
        agentic_steps: wf.agentic_steps,
        completion_steps: wf.completion_steps ?? [],
        max_iterations: wf.max_iterations,
        timeout_seconds: wf.timeout_seconds,
        provider: wf.provider,
        model: wf.model,
      };
      return {
        ...state,
        workflow: {
          ...wf,
          stages: [initialStage],
          setup_steps: [] as unknown as UnifiedWorkflow["setup_steps"],
          verification_steps:
            [] as unknown as UnifiedWorkflow["verification_steps"],
          agentic_steps: [] as unknown as UnifiedWorkflow["agentic_steps"],
          completion_steps:
            [] as unknown as UnifiedWorkflow["completion_steps"],
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
          stages: undefined as unknown as UnifiedWorkflow["stages"],
          setup_steps:
            first.setup_steps as unknown as UnifiedWorkflow["setup_steps"],
          verification_steps:
            first.verification_steps as unknown as UnifiedWorkflow["verification_steps"],
          agentic_steps:
            first.agentic_steps as unknown as UnifiedWorkflow["agentic_steps"],
          completion_steps:
            first.completion_steps as unknown as UnifiedWorkflow["completion_steps"],
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
  return {
    workflow: {
      ...defaultWf,
      id: "",
      created_at: "",
      modified_at: "",
    } as UnifiedWorkflow,
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
      ...state.workflow.setup_steps,
      ...state.workflow.verification_steps,
      ...state.workflow.agentic_steps,
      ...(state.workflow.completion_steps ?? []),
      ...(state.workflow.stages ?? []).flatMap((s) => [
        ...(s.setup_steps as UnifiedStep[]),
        ...(s.verification_steps as UnifiedStep[]),
        ...(s.agentic_steps as UnifiedStep[]),
        ...((s.completion_steps ?? []) as UnifiedStep[]),
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
