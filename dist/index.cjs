"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AddStepDropdown: () => AddStepDropdown,
  ChatHeader: () => ChatHeader,
  ChatInput: () => ChatInput,
  ChatMessageArea: () => ChatMessageArea,
  LibraryPickerBase: () => LibraryPickerBase,
  PhaseSection: () => PhaseSection,
  SettingsPanel: () => SettingsPanel,
  SkillCatalog: () => SkillCatalog,
  StepItem: () => StepItem,
  UIProvider: () => UIProvider,
  WorkflowBuilderProvider: () => WorkflowBuilderProvider,
  WorkflowDataProvider: () => WorkflowDataProvider,
  WorkflowPreviewPanel: () => WorkflowPreviewPanel,
  clearWorkflowDraft: () => clearWorkflowDraft,
  useLibraryItems: () => useLibraryItems,
  useUIPrimitives: () => useUIPrimitives,
  useWorkflowBuilder: () => useWorkflowBuilder,
  useWorkflowData: () => useWorkflowData,
  useWorkflowPersistence: () => useWorkflowPersistence
});
module.exports = __toCommonJS(index_exports);

// src/WorkflowDataProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var WorkflowDataContext = (0, import_react.createContext)(null);
function WorkflowDataProvider({
  adapter,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowDataContext.Provider, { value: adapter, children });
}
function useWorkflowData() {
  const ctx = (0, import_react.useContext)(WorkflowDataContext);
  if (!ctx)
    throw new Error(
      "useWorkflowData must be used within WorkflowDataProvider"
    );
  return ctx;
}

// src/WorkflowBuilderProvider.tsx
var import_react2 = require("react");
var import_workflow_utils = require("@qontinui/workflow-utils");
var import_workflow_utils2 = require("@qontinui/workflow-utils");
var import_jsx_runtime2 = require("react/jsx-runtime");
function getPhaseSteps(workflow, phase, stageIndex) {
  const source = workflow.stages && workflow.stages.length > 0 && stageIndex < workflow.stages.length ? workflow.stages[stageIndex] : workflow;
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
function setPhaseSteps(workflow, phase, stageIndex, steps) {
  if (workflow.stages && workflow.stages.length > 0 && stageIndex < workflow.stages.length) {
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
        setupSteps: steps
      };
    case "verification":
      return {
        ...workflow,
        verificationSteps: steps
      };
    case "agentic":
      return {
        ...workflow,
        agenticSteps: steps
      };
    case "completion":
      return {
        ...workflow,
        completionSteps: steps
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
        setupSteps: updateInSteps(wf.setupSteps),
        verificationSteps: updateInSteps(wf.verificationSteps),
        agenticSteps: updateInSteps(wf.agenticSteps),
        completionSteps: updateInSteps(wf.completionSteps ?? [])
      };
      if (updated.stages) {
        updated = {
          ...updated,
          stages: updated.stages.map((s) => ({
            ...s,
            setupSteps: updateInSteps(s.setupSteps),
            verificationSteps: updateInSteps(s.verificationSteps),
            agenticSteps: updateInSteps(s.agenticSteps),
            completionSteps: updateInSteps(s.completionSteps ?? [])
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
      const cloneId = (0, import_workflow_utils.generateStepId)();
      const clone = {
        ...original,
        id: cloneId,
        name: `${original.name ?? ""} (copy)`
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
        selectedStepId: cloneId
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
        id: (0, import_workflow_utils.generateStepId)(),
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
        completionPromptsFirst: false
      };
      return {
        ...state,
        workflow: {
          ...wf,
          stages: [initialStage],
          setupSteps: [],
          verificationSteps: [],
          agenticSteps: [],
          completionSteps: []
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
          setupSteps: first.setupSteps,
          verificationSteps: first.verificationSteps,
          agenticSteps: first.agenticSteps,
          completionSteps: first.completionSteps
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
  const defaultWf = (0, import_workflow_utils.createDefaultWorkflow)();
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
var WorkflowBuilderContext = (0, import_react2.createContext)(null);
function WorkflowBuilderProvider({
  children,
  initialWorkflow
}) {
  const [state, dispatch] = (0, import_react2.useReducer)(workflowBuilderReducer, void 0, () => {
    if (initialWorkflow) {
      return {
        ...createInitialState(),
        workflow: initialWorkflow,
        originalWorkflow: initialWorkflow
      };
    }
    return createInitialState();
  });
  const features = (0, import_workflow_utils2.detectWorkflowFeatures)(state.workflow);
  const isEmpty = (0, import_workflow_utils2.isWorkflowEmpty)(state.workflow);
  const totalStepCount = (0, import_workflow_utils2.getTotalStepCount)(state.workflow);
  const hasUnsavedChanges = state.originalWorkflow !== null && JSON.stringify(state.workflow) !== JSON.stringify(state.originalWorkflow);
  const selectedStep = (() => {
    if (!state.selectedStepId) return null;
    const allSteps = [
      ...state.workflow.setupSteps,
      ...state.workflow.verificationSteps,
      ...state.workflow.agenticSteps,
      ...state.workflow.completionSteps ?? [],
      ...(state.workflow.stages ?? []).flatMap((s) => [
        ...s.setupSteps,
        ...s.verificationSteps,
        ...s.agenticSteps,
        ...s.completionSteps ?? []
      ])
    ];
    return allSteps.find((s) => s.id === state.selectedStepId) ?? null;
  })();
  const currentPhaseSteps = (0, import_react2.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(WorkflowBuilderContext.Provider, { value, children });
}
function useWorkflowBuilder() {
  const ctx = (0, import_react2.useContext)(WorkflowBuilderContext);
  if (!ctx)
    throw new Error(
      "useWorkflowBuilder must be used within WorkflowBuilderProvider"
    );
  return ctx;
}

// src/useLibraryItems.ts
var import_react3 = require("react");
function useLibraryItems(fetcher) {
  const [items, setItems] = (0, import_react3.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const refresh = (0, import_react3.useCallback)(() => {
    setIsLoading(true);
    setError(null);
    fetcher().then(setItems).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setIsLoading(false));
  }, [fetcher]);
  (0, import_react3.useEffect)(() => {
    refresh();
  }, [refresh]);
  return { items, isLoading, error, refresh };
}

// src/useWorkflowPersistence.ts
var import_react4 = require("react");
function useWorkflowPersistence(storageKey, workflow, setWorkflow) {
  const isInitialLoad = (0, import_react4.useRef)(true);
  (0, import_react4.useEffect)(() => {
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
  (0, import_react4.useEffect)(() => {
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
var import_react5 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function LibraryPickerBase({
  items,
  isLoading,
  isOpen,
  onClose,
  onSelect,
  filterFn,
  children
}) {
  const [searchQuery, setSearchQuery] = (0, import_react5.useState)("");
  const defaultFilter = (0, import_react5.useCallback)((item, query) => {
    const q = query.toLowerCase();
    return item.name.toLowerCase().includes(q) || (item.description?.toLowerCase().includes(q) ?? false);
  }, []);
  const filteredItems = (0, import_react5.useMemo)(() => {
    if (!searchQuery) return items;
    const filter = filterFn ?? defaultFilter;
    return items.filter((item) => filter(item, searchQuery));
  }, [items, searchQuery, filterFn, defaultFilter]);
  const handleSelect = (0, import_react5.useCallback)(
    (item) => {
      onSelect(item);
      onClose();
      setSearchQuery("");
    },
    [onSelect, onClose]
  );
  const handleClose = (0, import_react5.useCallback)(() => {
    onClose();
    setSearchQuery("");
  }, [onClose]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: children({
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
var import_workflow = require("@qontinui/shared-types/workflow");
var import_jsx_runtime4 = require("react/jsx-runtime");
function PhaseSection({
  phase,
  steps,
  isExpanded,
  onToggle,
  onAddStep,
  children
}) {
  const info = import_workflow.PHASE_INFO[phase];
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: children({
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
var import_jsx_runtime5 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children: children({
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
var import_react6 = require("react");
var import_workflow2 = require("@qontinui/shared-types/workflow");
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const [mode, setMode] = (0, import_react6.useState)(defaultMode);
  const stepTypes = (customStepTypes ?? import_workflow2.STEP_TYPES)[phase] ?? [];
  const onSwitchToRaw = (0, import_react6.useCallback)(() => setMode("raw"), []);
  const onSwitchToSkills = (0, import_react6.useCallback)(() => setMode("skills"), []);
  const handleAddSteps = (0, import_react6.useCallback)(
    (steps, targetPhase) => {
      onAddSteps?.(steps, targetPhase);
      onClose();
    },
    [onAddSteps, onClose]
  );
  const handleClose = (0, import_react6.useCallback)(() => {
    setMode(defaultMode);
    onClose();
  }, [defaultMode, onClose]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: children({
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

// src/headless/SkillCatalog.tsx
var import_react7 = require("react");
var import_workflow_utils3 = require("@qontinui/workflow-utils");
var import_jsx_runtime7 = require("react/jsx-runtime");
function SkillCatalog({
  phase,
  onAddSteps,
  onClose,
  onSkillUsed,
  children
}) {
  const [searchQuery, setSearchQuery] = (0, import_react7.useState)("");
  const [selectedCategory, setSelectedCategory] = (0, import_react7.useState)(null);
  const [selectedSource, setSelectedSource] = (0, import_react7.useState)(null);
  const [selectedSkill, setSelectedSkill] = (0, import_react7.useState)(
    null
  );
  const [paramValues, setParamValues] = (0, import_react7.useState)({});
  const mode = selectedSkill ? "configure" : "browse";
  const categories = (0, import_react7.useMemo)(() => {
    const phaseSkills = (0, import_workflow_utils3.getSkillsByPhase)(phase);
    const cats = /* @__PURE__ */ new Set();
    for (const skill of phaseSkills) {
      cats.add(skill.category);
    }
    return Array.from(cats);
  }, [phase]);
  const hasNonBuiltinSkills = (0, import_react7.useMemo)(() => {
    const phaseSkills = (0, import_workflow_utils3.getSkillsByPhase)(phase);
    return phaseSkills.some((s) => s.source !== "builtin");
  }, [phase]);
  const filteredSkills = (0, import_react7.useMemo)(() => {
    const filters = { phase };
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    if (selectedSource) {
      filters.source = selectedSource;
    }
    return (0, import_workflow_utils3.searchSkills)(searchQuery, filters);
  }, [searchQuery, selectedCategory, selectedSource, phase]);
  const onSelectSkill = (0, import_react7.useCallback)(
    (skill) => {
      setSelectedSkill(skill);
      const defaults = {};
      for (const param of skill.parameters) {
        if (param.default !== void 0) {
          defaults[param.name] = param.default;
        }
      }
      setParamValues(defaults);
    },
    []
  );
  const setParamValue = (0, import_react7.useCallback)(
    (name, value) => {
      setParamValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const validationErrors = (0, import_react7.useMemo)(() => {
    if (!selectedSkill) return [];
    return (0, import_workflow_utils3.validateSkillParams)(selectedSkill, paramValues);
  }, [selectedSkill, paramValues]);
  const onConfirm = (0, import_react7.useCallback)(() => {
    if (!selectedSkill || validationErrors.length > 0) return;
    const steps = (0, import_workflow_utils3.instantiateSkill)(selectedSkill, phase, paramValues);
    onAddSteps(steps, phase);
    if (onSkillUsed) {
      onSkillUsed(selectedSkill.id);
    }
    onClose();
  }, [selectedSkill, phase, paramValues, validationErrors, onAddSteps, onSkillUsed, onClose]);
  const onBack = (0, import_react7.useCallback)(() => {
    setSelectedSkill(null);
    setParamValues({});
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, { children: children({
    mode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    hasNonBuiltinSkills,
    categories,
    filteredSkills,
    onSelectSkill,
    selectedSkill,
    paramValues,
    setParamValue,
    validationErrors,
    onConfirm,
    onBack
  }) });
}

// src/headless/SettingsPanel.tsx
var import_react8 = require("react");
var import_workflow_utils4 = require("@qontinui/workflow-utils");
var import_jsx_runtime8 = require("react/jsx-runtime");
function SettingsPanel({
  settings,
  features,
  onChange,
  config,
  children
}) {
  const sectionConfig = config ?? import_workflow_utils4.WORKFLOW_SETTINGS_CONFIG;
  const visibleSections = (0, import_react8.useMemo)(
    () => (0, import_workflow_utils4.getVisibleSections)(sectionConfig, features),
    [sectionConfig, features]
  );
  const getBooleanValue = (0, import_react8.useCallback)(
    (def) => {
      return (0, import_workflow_utils4.getBooleanDisplayValue)(def, settings[def.key]);
    },
    [settings]
  );
  const setBooleanValue = (0, import_react8.useCallback)(
    (def, displayValue) => {
      onChange({ [def.key]: (0, import_workflow_utils4.toBooleanStoredValue)(def, displayValue) });
    },
    [onChange]
  );
  const getValue = (0, import_react8.useCallback)(
    (key) => settings[key],
    [settings]
  );
  const setValue = (0, import_react8.useCallback)(
    (key, value) => {
      onChange({ [key]: value });
    },
    [onChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_jsx_runtime8.Fragment, { children: children({
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

// src/components/chat/ChatHeader.tsx
var import_react9 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
function StateBadge({ state }) {
  const config = {
    ready: {
      classes: "bg-green-900/30 border-green-800/50 text-green-400",
      label: "Ready"
    },
    processing: {
      classes: "bg-amber-900/30 border-amber-800/50 text-amber-400",
      label: "Processing"
    },
    initializing: {
      classes: "bg-blue-900/30 border-blue-800/50 text-blue-400",
      label: "Initializing"
    },
    disconnected: {
      classes: "bg-red-900/30 border-red-800/50 text-red-400",
      label: "Disconnected"
    },
    closed: {
      classes: "bg-zinc-900/30 border-zinc-700/50 text-zinc-400",
      label: "Closed"
    },
    error: {
      classes: "bg-red-900/30 border-red-800/50 text-red-400",
      label: "Error"
    }
  };
  const c = config[state];
  if (!c) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${c.classes}`,
      children: c.label
    }
  );
}
function ChatHeader({
  sessionName,
  sessionState,
  onRename,
  onClose,
  isRunnerConnected
}) {
  const [isEditing, setIsEditing] = (0, import_react9.useState)(false);
  const [editValue, setEditValue] = (0, import_react9.useState)(sessionName);
  const inputRef = (0, import_react9.useRef)(null);
  const displayEditValue = isEditing ? editValue : sessionName;
  (0, import_react9.useEffect)(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleSave = (0, import_react9.useCallback)(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== sessionName) {
      onRename(trimmed);
    }
    setIsEditing(false);
  }, [editValue, sessionName, onRename]);
  const handleKeyDown = (0, import_react9.useCallback)(
    (e) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setEditValue(sessionName);
        setIsEditing(false);
      }
    },
    [handleSave, sessionName]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50 bg-surface-canvas/80 backdrop-blur-xs", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "svg",
        {
          className: "size-5 text-purple-400",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
        }
      ),
      isEditing ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "input",
          {
            ref: inputRef,
            value: displayEditValue,
            onChange: (e) => setEditValue(e.target.value),
            onKeyDown: handleKeyDown,
            onBlur: handleSave,
            className: "bg-surface-canvas border border-border-subtle/50 rounded px-2 py-0.5 text-sm text-text-primary focus:outline-hidden focus:border-brand-primary/50",
            maxLength: 60
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            onClick: handleSave,
            className: "text-green-400 hover:text-green-300",
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "svg",
              {
                className: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          }
        )
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        "button",
        {
          onClick: () => {
            setEditValue(sessionName);
            setIsEditing(true);
          },
          className: "flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-text-secondary group",
          children: [
            sessionName,
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
              "svg",
              {
                className: "size-3 opacity-0 group-hover:opacity-60",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "m15 5 4 4" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(StateBadge, { state: sessionState }),
      isRunnerConnected !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "flex items-center gap-1 text-[10px]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "span",
          {
            className: `inline-block size-1.5 rounded-full ${isRunnerConnected ? "bg-green-400" : "bg-red-400"}`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "span",
          {
            className: isRunnerConnected ? "text-green-400" : "text-red-400",
            children: isRunnerConnected ? "Runner" : "Runner offline"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "button",
      {
        onClick: onClose,
        className: "h-7 w-7 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-surface-hover",
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "svg",
          {
            className: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M18 6 6 18" }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "m6 6 12 12" })
            ]
          }
        )
      }
    )
  ] });
}

// src/components/chat/ChatInput.tsx
var import_react10 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function ChatInput({
  sessionState,
  onSendMessage,
  onInterrupt,
  onGenerateWorkflow,
  isGeneratingWorkflow,
  messageCount,
  disabled
}) {
  const [message, setMessage] = (0, import_react10.useState)(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("chat-draft-message") ?? "";
  });
  const [includeUIBridge, setIncludeUIBridge] = (0, import_react10.useState)(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("chat-include-ui-bridge");
    return saved !== null ? saved === "true" : true;
  });
  const textareaRef = (0, import_react10.useRef)(null);
  const canSend = !disabled && message.trim().length > 0 && (sessionState === "ready" || sessionState === "processing");
  const canInterrupt = sessionState === "processing";
  const showGenerateWorkflow = messageCount >= 2;
  const handleSend = (0, import_react10.useCallback)(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
    localStorage.removeItem("chat-draft-message");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, onSendMessage]);
  const handleKeyDown = (0, import_react10.useCallback)(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) {
          handleSend();
        }
      }
    },
    [canSend, handleSend]
  );
  (0, import_react10.useEffect)(() => {
    localStorage.setItem("chat-include-ui-bridge", String(includeUIBridge));
  }, [includeUIBridge]);
  (0, import_react10.useEffect)(() => {
    if (message) {
      localStorage.setItem("chat-draft-message", message);
    } else {
      localStorage.removeItem("chat-draft-message");
    }
  }, [message]);
  (0, import_react10.useEffect)(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }
  }, [message]);
  const stateLabel = sessionState === "ready" ? "Ready" : sessionState === "processing" ? "Processing..." : sessionState === "initializing" ? "Initializing..." : sessionState === "connecting" ? "Connecting..." : sessionState === "disconnected" ? "Disconnected" : sessionState === "closed" ? "Session Closed" : "";
  const stateColor = sessionState === "ready" ? "text-green-400" : sessionState === "processing" ? "text-amber-400" : "text-text-muted";
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "border-t border-border-subtle/50 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: `text-xs ${stateColor}`, children: stateLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex items-center gap-2", children: showGenerateWorkflow && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          "label",
          {
            className: "flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none",
            title: "Include UI Bridge SDK integration instructions in the generated workflow",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
                "input",
                {
                  type: "checkbox",
                  checked: includeUIBridge,
                  onChange: (e) => setIncludeUIBridge(e.target.checked),
                  disabled: isGeneratingWorkflow || disabled,
                  className: "rounded border-border-subtle accent-purple-500"
                }
              ),
              "UI Bridge"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          "button",
          {
            onClick: () => onGenerateWorkflow(includeUIBridge),
            disabled: isGeneratingWorkflow || disabled,
            className: "inline-flex items-center gap-1.5 text-xs h-7 px-2.5 rounded-md border border-purple-800/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              isGeneratingWorkflow ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
                "svg",
                {
                  className: "size-3 animate-spin",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" })
                }
              ),
              isGeneratingWorkflow ? "Generating..." : "Generate Workflow"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "textarea",
        {
          ref: textareaRef,
          value: message,
          onChange: (e) => setMessage(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: sessionState === "disconnected" ? "Disconnected from runner..." : sessionState === "closed" ? "Session is closed" : "Type a message... (Enter to send, Shift+Enter for newline)",
          disabled: disabled || sessionState === "disconnected" || sessionState === "closed",
          rows: 1,
          className: "flex-1 resize-none rounded-lg border border-border bg-surface-canvas px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed",
          style: { minHeight: "42px", maxHeight: "240px" }
        }
      ),
      canInterrupt ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "button",
        {
          onClick: onInterrupt,
          className: "h-[42px] px-3 rounded-md border border-amber-800/50 text-amber-400 hover:bg-amber-900/30 flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" })
            }
          )
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "button",
        {
          onClick: handleSend,
          disabled: !canSend,
          className: "h-[42px] px-3 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m22 2-7 20-4-9-9-4Z" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M22 2 11 13" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/chat/ChatMessageArea.tsx
var import_react11 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
function ChatMessageArea({
  messages,
  streamingContent,
  isStreaming,
  renderMarkdown,
  onCreateWorkflowFromMessage,
  toolActivity
}) {
  const scrollRef = (0, import_react11.useRef)(null);
  const [autoScroll, setAutoScroll] = (0, import_react11.useState)(true);
  const prevLenRef = (0, import_react11.useRef)(0);
  (0, import_react11.useEffect)(() => {
    const totalLen = messages.length + streamingContent.length;
    if (autoScroll && totalLen !== prevLenRef.current) {
      prevLenRef.current = totalLen;
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    }
  }, [messages, streamingContent, autoScroll]);
  const handleScroll = (0, import_react11.useCallback)(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  }, []);
  const scrollToBottom = (0, import_react11.useCallback)(() => {
    setAutoScroll(true);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  const renderContent = (content) => {
    if (renderMarkdown) return renderMarkdown(content);
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-text-primary whitespace-pre-wrap wrap-break-word", children: content });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      ref: scrollRef,
      onScroll: handleScroll,
      className: "flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 py-4",
      children: [
        messages.length === 0 && !streamingContent && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-text-muted", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
            "svg",
            {
              className: "size-12 mb-3 opacity-30",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.5",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 8V4H8" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M2 14h2" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M20 14h2" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M15 13v2" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M9 13v2" })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm", children: "Start a conversation with AI" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-xs mt-1 opacity-60", children: "Discuss features, plan workflows, then generate them" })
        ] }),
        messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          MessageBubble,
          {
            message: msg,
            index: i,
            renderContent,
            onCreateWorkflow: onCreateWorkflowFromMessage
          },
          i
        )),
        isStreaming && streamingContent && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AiBotIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "max-w-[85%]", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "max-w-none text-sm", children: renderContent(streamingContent) }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" })
              ]
            }
          ) })
        ] }),
        isStreaming && !streamingContent && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AiBotIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: toolActivity ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("svg", { className: "size-3.5 text-purple-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 2v4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 18v4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m4.93 4.93 2.83 2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m16.24 16.24 2.83 2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M2 12h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M18 12h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m4.93 19.07 2.83-2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m16.24 7.76 2.83-2.83" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xs text-purple-300/80", children: toolActivity })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" })
              ] })
            }
          )
        ] }),
        isStreaming && streamingContent && toolActivity && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex gap-3 items-center ml-10", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-raised/20", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("svg", { className: "size-3 text-purple-400/60 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 2v4" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 18v4" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m4.93 4.93 2.83 2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m16.24 16.24 2.83 2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M2 12h4" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M18 12h4" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m4.93 19.07 2.83-2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m16.24 7.76 2.83-2.83" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xs text-text-muted", children: toolActivity })
        ] }) }),
        !autoScroll && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: scrollToBottom,
            className: "sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle/50 text-text-secondary text-xs hover:bg-surface-hover flex items-center gap-1.5 shadow-lg",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 5v14" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m19 12-7 7-7-7" })
                  ]
                }
              ),
              "Scroll to bottom"
            ]
          }
        )
      ]
    }
  );
}
function AiBotIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "svg",
    {
      className: "size-4 text-purple-400",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M2 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M20 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M15 13v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M9 13v2" })
      ]
    }
  );
}
function UserIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "svg",
    {
      className: "size-4 text-brand-primary",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: "12", cy: "7", r: "4" })
      ]
    }
  );
}
function MessageBubble({
  message,
  index,
  renderContent,
  onCreateWorkflow
}) {
  const formattedTime = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : void 0;
  if (message.role === "system") {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-raised/40 border border-border-subtle/20", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "svg",
        {
          className: "size-3.5 text-text-muted/70 shrink-0",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 16v-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 8h.01" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xs text-text-muted/80", children: message.content })
    ] }) });
  }
  if (message.role === "user") {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex gap-3 items-start justify-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "max-w-[85%]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "div",
          {
            className: "rounded-lg px-4 py-3 border border-brand-primary/30",
            style: { background: "color-mix(in srgb, var(--qontinui-brand-primary, #4a90d9) 10%, var(--qontinui-surface-canvas, #111115))" },
            children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "text-sm text-text-primary", children: renderContent(message.content) })
          }
        ),
        formattedTime && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "text-[10px] text-text-muted/60 mt-1 text-right", children: formattedTime })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(UserIcon, {}) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "group/msg flex gap-3 items-start", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AiBotIcon, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "max-w-[85%]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "div",
        {
          className: "rounded-lg px-4 py-3 border border-border-subtle/30",
          style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "max-w-none text-sm", children: renderContent(message.content) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [
        formattedTime && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-[10px] text-text-muted/60", children: formattedTime }),
        onCreateWorkflow && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: () => onCreateWorkflow(index, message.content),
            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-muted hover:text-purple-300 hover:bg-purple-900/20 transition-colors opacity-0 group-hover/msg:opacity-100",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { className: "size-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" }) }),
              "Create Workflow"
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/components/chat/WorkflowPreviewPanel.tsx
var import_react12 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var PHASE_COLORS = {
  setup: {
    bg: "bg-blue-950/30",
    border: "border-blue-800/50",
    text: "text-blue-400",
    badge: "bg-blue-900/50 text-blue-300"
  },
  verification: {
    bg: "bg-green-950/30",
    border: "border-green-800/50",
    text: "text-green-400",
    badge: "bg-green-900/50 text-green-300"
  },
  agentic: {
    bg: "bg-amber-950/30",
    border: "border-amber-800/50",
    text: "text-amber-400",
    badge: "bg-amber-900/50 text-amber-300"
  },
  completion: {
    bg: "bg-purple-950/30",
    border: "border-purple-800/50",
    text: "text-purple-400",
    badge: "bg-purple-900/50 text-purple-300"
  }
};
function WorkflowPreviewPanel({
  workflow,
  isLoading,
  error,
  onExecute,
  onEditInBuilder,
  onRegenerate,
  onSave,
  onClose
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col h-full border-l border-border-subtle/50 bg-surface-canvas/95", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Generated Workflow" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "button",
        {
          onClick: onClose,
          className: "h-6 w-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover",
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            "svg",
            {
              className: "size-3.5",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M18 6 6 18" }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "m6 6 12 12" })
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex-1 overflow-y-auto p-4", children: [
      isLoading && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 text-text-muted", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "svg",
          {
            className: "size-8 animate-spin mb-3 text-purple-400",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-sm", children: "Generating workflow..." }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-xs mt-1 opacity-60", children: "This may take a minute" })
      ] }),
      error && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 text-red-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "svg",
          {
            className: "size-8 mb-3",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "m15 9-6 6" }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "m9 9 6 6" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-sm font-medium", children: "Generation Failed" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-xs mt-1 opacity-60 text-center max-w-[250px]", children: error })
      ] }),
      workflow && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h4", { className: "text-sm font-medium text-text-primary", children: workflow.name }),
          workflow.description && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-xs text-text-muted mt-1", children: workflow.description }),
          workflow.tags && workflow.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex gap-1 mt-2 flex-wrap", children: workflow.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "span",
            {
              className: "inline-flex items-center rounded-full border border-border-subtle/50 px-1.5 py-0 text-[10px] text-text-muted",
              children: tag
            },
            tag
          )) })
        ] }),
        ["setup", "verification", "agentic", "completion"].map(
          (phase) => {
            const steps = getStepsForPhase(workflow, phase);
            if (steps.length === 0) return null;
            return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              PreviewPhaseSection,
              {
                phase,
                steps
              },
              phase
            );
          }
        )
      ] })
    ] }),
    workflow && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "border-t border-border-subtle/50 p-4 space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "button",
          {
            onClick: onExecute,
            className: "flex-1 h-8 rounded-md bg-green-700 hover:bg-green-600 text-white text-sm flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("polygon", { points: "5 3 19 12 5 21 5 3" })
                }
              ),
              "Execute"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "button",
          {
            onClick: onEditInBuilder,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-sm hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "m15 5 4 4" })
                  ]
                }
              ),
              "Edit in Builder"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "button",
          {
            onClick: onRegenerate,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M3 3v5h5" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M16 16h5v5" })
                  ]
                }
              ),
              "Regenerate"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "button",
          {
            onClick: onSave,
            title: "Save workflow to library",
            "aria-label": "Save workflow to library",
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("polyline", { points: "17 21 17 13 7 13 7 21" }),
                    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("polyline", { points: "7 3 7 8 15 8" })
                  ]
                }
              ),
              "Save"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function PreviewPhaseSection({
  phase,
  steps
}) {
  const [isExpanded, setIsExpanded] = (0, import_react12.useState)(true);
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS["setup"];
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: `rounded-lg border ${colors.border} ${colors.bg}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "button",
      {
        onClick: () => setIsExpanded(!isExpanded),
        className: "flex items-center justify-between w-full px-3 py-2 cursor-pointer",
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "svg",
            {
              className: `w-3.5 h-3.5 transition-transform ${colors.text} ${isExpanded ? "rotate-90" : ""}`,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "m9 18 6-6-6-6" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "span",
            {
              className: `text-xs font-semibold uppercase tracking-wider ${colors.text}`,
              children: phase
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "span",
            {
              className: `text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`,
              children: steps.length
            }
          )
        ] })
      }
    ),
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "px-2 pb-2 space-y-1", children: steps.map((rawStep, i) => {
      const step = rawStep;
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
        "div",
        {
          className: "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/20",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(StepTypeIcon, { type: step.type }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "text-xs text-zinc-200 truncate", children: step.name }) }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
              "svg",
              {
                className: "w-3 h-3 text-zinc-600",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                  /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("polyline", { points: "22 4 12 14.01 9 11.01" })
                ]
              }
            )
          ]
        },
        step.id || i
      );
    }) })
  ] });
}
function StepTypeIcon({ type }) {
  if (type === "command") {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("polyline", { points: "4 17 10 11 4 5" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("line", { x1: "12", x2: "20", y1: "19", y2: "19" })
        ]
      }
    );
  }
  if (type === "ui_bridge") {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("line", { x1: "8", x2: "16", y1: "21", y2: "21" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("line", { x1: "12", x2: "12", y1: "17", y2: "21" })
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "svg",
    {
      className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M2 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M20 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M15 13v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M9 13v2" })
      ]
    }
  );
}
function getStepsForPhase(workflow, phase) {
  switch (phase) {
    case "setup":
      return workflow.setup_steps || [];
    case "verification":
      return workflow.verification_steps || [];
    case "agentic":
      return workflow.agentic_steps || [];
    case "completion":
      return workflow.completion_steps || [];
    default:
      return [];
  }
}

// src/UIProvider.tsx
var import_react13 = require("react");
var import_jsx_runtime13 = require("react/jsx-runtime");
var CollapsibleOpenCtx = (0, import_react13.createContext)(true);
function DefaultCollapsible({
  open,
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CollapsibleOpenCtx.Provider, { value: open, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className, children }) });
}
function DefaultCollapsibleTrigger({
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className, children });
}
function DefaultCollapsibleContent({
  children,
  className
}) {
  const open = (0, import_react13.useContext)(CollapsibleOpenCtx);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className, children });
}
var defaultPrimitives = {
  Collapsible: DefaultCollapsible,
  CollapsibleTrigger: DefaultCollapsibleTrigger,
  CollapsibleContent: DefaultCollapsibleContent
};
var UIContext = (0, import_react13.createContext)(defaultPrimitives);
function UIProvider({ primitives, children }) {
  const merged = { ...defaultPrimitives, ...primitives };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(UIContext.Provider, { value: merged, children });
}
function useUIPrimitives() {
  return (0, import_react13.useContext)(UIContext);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map