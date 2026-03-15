import {
  SkillCatalog,
  UIProvider,
  useUIPrimitives
} from "./chunk-7BR6KOI7.js";
import {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  WorkflowPreviewPanel
} from "./chunk-47XJDVC4.js";

// src/WorkflowDataProvider.tsx
import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";
var WorkflowDataContext = createContext(null);
function WorkflowDataProvider({
  adapter,
  children
}) {
  return /* @__PURE__ */ jsx(WorkflowDataContext.Provider, { value: adapter, children });
}
function useWorkflowData() {
  const ctx = useContext(WorkflowDataContext);
  if (!ctx)
    throw new Error(
      "useWorkflowData must be used within WorkflowDataProvider"
    );
  return ctx;
}

// src/WorkflowBuilderProvider.tsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useReducer,
  useCallback
} from "react";
import {
  createDefaultWorkflow,
  generateStepId
} from "@qontinui/workflow-utils";
import {
  detectWorkflowFeatures,
  isWorkflowEmpty,
  getTotalStepCount
} from "@qontinui/workflow-utils";
import { jsx as jsx2 } from "react/jsx-runtime";
function getPhaseSteps(workflow, phase, stageIndex) {
  const source = workflow.stages && workflow.stages.length > 0 && stageIndex < workflow.stages.length ? workflow.stages[stageIndex] : workflow;
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
function setPhaseSteps(workflow, phase, stageIndex, steps) {
  if (workflow.stages && workflow.stages.length > 0 && stageIndex < workflow.stages.length) {
    const stages = [...workflow.stages];
    const stage = { ...stages[stageIndex] };
    switch (phase) {
      case "setup":
        stage.setup_steps = steps;
        break;
      case "verification":
        stage.verification_steps = steps;
        break;
      case "agentic":
        stage.agentic_steps = steps;
        break;
      case "completion":
        stage.completion_steps = steps;
        break;
    }
    stages[stageIndex] = stage;
    return { ...workflow, stages };
  }
  switch (phase) {
    case "setup":
      return {
        ...workflow,
        setup_steps: steps
      };
    case "verification":
      return {
        ...workflow,
        verification_steps: steps
      };
    case "agentic":
      return {
        ...workflow,
        agentic_steps: steps
      };
    case "completion":
      return {
        ...workflow,
        completion_steps: steps
      };
  }
}
function workflowBuilderReducer(state, action) {
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
          state.currentStageIndex
        ),
        action.step
      ];
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          steps
        ),
        selectedStepId: action.step.id
      };
    }
    case "REMOVE_STEP": {
      const steps = getPhaseSteps(
        state.workflow,
        action.phase,
        state.currentStageIndex
      ).filter((s) => s.id !== action.stepId);
      const selectedStepId = state.selectedStepId === action.stepId ? null : state.selectedStepId;
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          steps
        ),
        selectedStepId
      };
    }
    case "UPDATE_STEP": {
      const wf = state.workflow;
      const updateInSteps = (steps) => steps.map(
        (s) => s.id === action.stepId ? { ...s, ...action.updates } : s
      );
      let updated = {
        ...wf,
        setup_steps: updateInSteps(
          wf.setup_steps
        ),
        verification_steps: updateInSteps(
          wf.verification_steps
        ),
        agentic_steps: updateInSteps(
          wf.agentic_steps
        ),
        completion_steps: updateInSteps(
          wf.completion_steps ?? []
        )
      };
      if (updated.stages) {
        updated = {
          ...updated,
          stages: updated.stages.map((s) => ({
            ...s,
            setup_steps: updateInSteps(
              s.setup_steps
            ),
            verification_steps: updateInSteps(
              s.verification_steps
            ),
            agentic_steps: updateInSteps(
              s.agentic_steps
            ),
            completion_steps: updateInSteps(
              s.completion_steps ?? []
            )
          }))
        };
      }
      return { ...state, workflow: updated };
    }
    case "MOVE_STEP": {
      const steps = [
        ...getPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex
        )
      ];
      const idx = steps.findIndex((s) => s.id === action.stepId);
      if (idx === -1) return state;
      const newIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= steps.length) return state;
      if (action.phase === "completion" && newIdx === steps.length - 1 && steps[steps.length - 1].is_summary_step)
        return state;
      [steps[idx], steps[newIdx]] = [steps[newIdx], steps[idx]];
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          steps
        )
      };
    }
    case "REORDER_STEPS":
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          action.steps
        )
      };
    case "DUPLICATE_STEP": {
      const steps = getPhaseSteps(
        state.workflow,
        action.phase,
        state.currentStageIndex
      );
      const original = steps.find((s) => s.id === action.stepId);
      if (!original) return state;
      const clone = {
        ...original,
        id: generateStepId(),
        name: `${original.name} (copy)`
      };
      const idx = steps.findIndex((s) => s.id === action.stepId);
      const newSteps = [...steps];
      newSteps.splice(idx + 1, 0, clone);
      return {
        ...state,
        workflow: setPhaseSteps(
          state.workflow,
          action.phase,
          state.currentStageIndex,
          newSteps
        ),
        selectedStepId: clone.id
      };
    }
    case "SELECT_STEP":
      return { ...state, selectedStepId: action.stepId };
    case "TOGGLE_PHASE":
      return {
        ...state,
        expandedPhases: {
          ...state.expandedPhases,
          [action.phase]: !state.expandedPhases[action.phase]
        }
      };
    case "OPEN_ADD_STEP":
      return { ...state, isAddStepOpen: true, addStepPhase: action.phase };
    case "CLOSE_ADD_STEP":
      return { ...state, isAddStepOpen: false, addStepPhase: null };
    case "SET_STAGE_INDEX":
      return {
        ...state,
        currentStageIndex: action.index,
        selectedStepId: null
      };
    case "ADD_STAGE": {
      const stages = [...state.workflow.stages ?? [], action.stage];
      return {
        ...state,
        workflow: { ...state.workflow, stages },
        currentStageIndex: stages.length - 1
      };
    }
    case "REMOVE_STAGE": {
      const stages = (state.workflow.stages ?? []).filter(
        (_, i) => i !== action.stageIndex
      );
      const newIndex = Math.min(
        state.currentStageIndex,
        Math.max(0, stages.length - 1)
      );
      return {
        ...state,
        workflow: { ...state.workflow, stages },
        currentStageIndex: newIndex
      };
    }
    case "UPDATE_STAGE": {
      if (!state.workflow.stages) return state;
      const stages = [...state.workflow.stages];
      stages[action.stageIndex] = {
        ...stages[action.stageIndex],
        ...action.updates
      };
      return { ...state, workflow: { ...state.workflow, stages } };
    }
    case "ENABLE_STAGES": {
      const wf = state.workflow;
      const initialStage = {
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
        model: wf.model
      };
      return {
        ...state,
        workflow: {
          ...wf,
          stages: [initialStage],
          setup_steps: [],
          verification_steps: [],
          agentic_steps: [],
          completion_steps: []
        },
        currentStageIndex: 0
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
          stages: void 0,
          setup_steps: first.setup_steps,
          verification_steps: first.verification_steps,
          agentic_steps: first.agentic_steps,
          completion_steps: first.completion_steps
        },
        currentStageIndex: 0
      };
    }
    case "RESET":
      return createInitialState();
    default:
      return state;
  }
}
function createInitialState() {
  const defaultWf = createDefaultWorkflow();
  return {
    workflow: {
      ...defaultWf,
      id: "",
      created_at: "",
      modified_at: ""
    },
    originalWorkflow: null,
    selectedStepId: null,
    currentStageIndex: 0,
    expandedPhases: {
      setup: true,
      verification: true,
      agentic: true,
      completion: true
    },
    isAddStepOpen: false,
    addStepPhase: null
  };
}
var WorkflowBuilderContext = createContext2(null);
function WorkflowBuilderProvider({
  children,
  initialWorkflow
}) {
  const [state, dispatch] = useReducer(workflowBuilderReducer, void 0, () => {
    if (initialWorkflow) {
      return {
        ...createInitialState(),
        workflow: initialWorkflow,
        originalWorkflow: initialWorkflow
      };
    }
    return createInitialState();
  });
  const features = detectWorkflowFeatures(state.workflow);
  const isEmpty = isWorkflowEmpty(state.workflow);
  const totalStepCount = getTotalStepCount(state.workflow);
  const hasUnsavedChanges = state.originalWorkflow !== null && JSON.stringify(state.workflow) !== JSON.stringify(state.originalWorkflow);
  const selectedStep = (() => {
    if (!state.selectedStepId) return null;
    const allSteps = [
      ...state.workflow.setup_steps,
      ...state.workflow.verification_steps,
      ...state.workflow.agentic_steps,
      ...state.workflow.completion_steps ?? [],
      ...(state.workflow.stages ?? []).flatMap((s) => [
        ...s.setup_steps,
        ...s.verification_steps,
        ...s.agentic_steps,
        ...s.completion_steps ?? []
      ])
    ];
    return allSteps.find((s) => s.id === state.selectedStepId) ?? null;
  })();
  const currentPhaseSteps = useCallback(
    (phase) => {
      return getPhaseSteps(state.workflow, phase, state.currentStageIndex);
    },
    [state.workflow, state.currentStageIndex]
  );
  const value = {
    state,
    dispatch,
    features,
    isEmpty,
    totalStepCount,
    hasUnsavedChanges,
    selectedStep,
    currentPhaseSteps
  };
  return /* @__PURE__ */ jsx2(WorkflowBuilderContext.Provider, { value, children });
}
function useWorkflowBuilder() {
  const ctx = useContext2(WorkflowBuilderContext);
  if (!ctx)
    throw new Error(
      "useWorkflowBuilder must be used within WorkflowBuilderProvider"
    );
  return ctx;
}

// src/useLibraryItems.ts
import { useState, useEffect, useCallback as useCallback2 } from "react";
function useLibraryItems(fetcher) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const refresh = useCallback2(() => {
    setIsLoading(true);
    setError(null);
    fetcher().then(setItems).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setIsLoading(false));
  }, [fetcher]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { items, isLoading, error, refresh };
}

// src/useWorkflowPersistence.ts
import { useEffect as useEffect2, useRef } from "react";
function useWorkflowPersistence(storageKey, workflow, setWorkflow) {
  const isInitialLoad = useRef(true);
  useEffect2(() => {
    if (!isInitialLoad.current) return;
    isInitialLoad.current = false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id !== void 0) {
          setWorkflow(parsed);
        }
      }
    } catch {
    }
  }, [storageKey, setWorkflow]);
  useEffect2(() => {
    if (isInitialLoad.current) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(workflow));
      } catch {
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [storageKey, workflow]);
}
function clearWorkflowDraft(storageKey) {
  localStorage.removeItem(storageKey);
}

// src/headless/LibraryPickerBase.tsx
import { useState as useState2, useMemo, useCallback as useCallback3 } from "react";
import { Fragment, jsx as jsx3 } from "react/jsx-runtime";
function LibraryPickerBase({
  items,
  isLoading,
  isOpen,
  onClose,
  onSelect,
  filterFn,
  children
}) {
  const [searchQuery, setSearchQuery] = useState2("");
  const defaultFilter = useCallback3((item, query) => {
    const q = query.toLowerCase();
    return item.name.toLowerCase().includes(q) || (item.description?.toLowerCase().includes(q) ?? false);
  }, []);
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const filter = filterFn ?? defaultFilter;
    return items.filter((item) => filter(item, searchQuery));
  }, [items, searchQuery, filterFn, defaultFilter]);
  const handleSelect = useCallback3(
    (item) => {
      onSelect(item);
      onClose();
      setSearchQuery("");
    },
    [onSelect, onClose]
  );
  const handleClose = useCallback3(() => {
    onClose();
    setSearchQuery("");
  }, [onClose]);
  return /* @__PURE__ */ jsx3(Fragment, { children: children({
    isOpen,
    searchQuery,
    setSearchQuery,
    filteredItems,
    isLoading,
    onSelect: handleSelect,
    onClose: handleClose
  }) });
}

// src/headless/PhaseSection.tsx
import { PHASE_INFO } from "@qontinui/shared-types/workflow";
import { Fragment as Fragment2, jsx as jsx4 } from "react/jsx-runtime";
function PhaseSection({
  phase,
  steps,
  isExpanded,
  onToggle,
  onAddStep,
  children
}) {
  const info = PHASE_INFO[phase];
  return /* @__PURE__ */ jsx4(Fragment2, { children: children({
    phase,
    label: info.label,
    description: info.description,
    color: info.color,
    isExpanded,
    stepCount: steps.length,
    steps,
    onToggle,
    onAddStep
  }) });
}

// src/headless/StepItem.tsx
import { Fragment as Fragment3, jsx as jsx5 } from "react/jsx-runtime";
function StepItem({
  step,
  phase,
  isSelected,
  index,
  totalSteps,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  children
}) {
  const isSummaryStep = step.type === "prompt" && step.is_summary_step === true;
  const canMoveUp = index > 0 && !isSummaryStep;
  const canMoveDown = index < totalSteps - 1 && !isSummaryStep;
  return /* @__PURE__ */ jsx5(Fragment3, { children: children({
    step,
    phase,
    isSelected,
    canMoveUp,
    canMoveDown,
    isSummaryStep,
    onSelect,
    onMoveUp,
    onMoveDown,
    onDelete,
    onDuplicate
  }) });
}

// src/headless/AddStepDropdown.tsx
import { useState as useState3, useCallback as useCallback4 } from "react";
import { STEP_TYPES } from "@qontinui/shared-types/workflow";
import { Fragment as Fragment4, jsx as jsx6 } from "react/jsx-runtime";
function AddStepDropdown({
  isOpen,
  phase,
  onSelect,
  onClose,
  onAddSteps,
  defaultMode = "skills",
  customStepTypes,
  children
}) {
  const [mode, setMode] = useState3(defaultMode);
  const stepTypes = (customStepTypes ?? STEP_TYPES)[phase] ?? [];
  const onSwitchToRaw = useCallback4(() => setMode("raw"), []);
  const onSwitchToSkills = useCallback4(() => setMode("skills"), []);
  const handleAddSteps = useCallback4(
    (steps, targetPhase) => {
      onAddSteps?.(steps, targetPhase);
      onClose();
    },
    [onAddSteps, onClose]
  );
  const handleClose = useCallback4(() => {
    setMode(defaultMode);
    onClose();
  }, [defaultMode, onClose]);
  return /* @__PURE__ */ jsx6(Fragment4, { children: children({
    isOpen,
    phase,
    mode,
    stepTypes,
    onSelect,
    onSwitchToRaw,
    onSwitchToSkills,
    onAddSteps: handleAddSteps,
    onClose: handleClose
  }) });
}

// src/headless/SettingsPanel.tsx
import { useMemo as useMemo2, useCallback as useCallback5 } from "react";
import {
  WORKFLOW_SETTINGS_CONFIG,
  getVisibleSections,
  getBooleanDisplayValue,
  toBooleanStoredValue
} from "@qontinui/workflow-utils";
import { Fragment as Fragment5, jsx as jsx7 } from "react/jsx-runtime";
function SettingsPanel({
  settings,
  features,
  onChange,
  config,
  children
}) {
  const sectionConfig = config ?? WORKFLOW_SETTINGS_CONFIG;
  const visibleSections = useMemo2(
    () => getVisibleSections(sectionConfig, features),
    [sectionConfig, features]
  );
  const getBooleanValue = useCallback5(
    (def) => {
      return getBooleanDisplayValue(def, settings[def.key]);
    },
    [settings]
  );
  const setBooleanValue = useCallback5(
    (def, displayValue) => {
      onChange({ [def.key]: toBooleanStoredValue(def, displayValue) });
    },
    [onChange]
  );
  const getValue = useCallback5(
    (key) => settings[key],
    [settings]
  );
  const setValue = useCallback5(
    (key, value) => {
      onChange({ [key]: value });
    },
    [onChange]
  );
  return /* @__PURE__ */ jsx7(Fragment5, { children: children({
    settings,
    features,
    onChange,
    visibleSections,
    getBooleanValue,
    setBooleanValue,
    getValue,
    setValue
  }) });
}
export {
  AddStepDropdown,
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  LibraryPickerBase,
  PhaseSection,
  SettingsPanel,
  SkillCatalog,
  StepItem,
  UIProvider,
  WorkflowBuilderProvider,
  WorkflowDataProvider,
  WorkflowPreviewPanel,
  clearWorkflowDraft,
  useLibraryItems,
  useUIPrimitives,
  useWorkflowBuilder,
  useWorkflowData,
  useWorkflowPersistence
};
//# sourceMappingURL=index.js.map