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

// src/components/index.ts
var components_exports = {};
__export(components_exports, {
  ChatHeader: () => ChatHeader,
  ChatInput: () => ChatInput,
  ChatMessageArea: () => ChatMessageArea,
  CompositionSkillBuilder: () => CompositionSkillBuilder,
  PhaseSectionConcrete: () => PhaseSectionConcrete,
  SkillCatalogConcrete: () => SkillCatalogConcrete,
  SkillParamForm: () => SkillParamForm,
  StepItemConcrete: () => StepItemConcrete,
  WorkflowPreviewPanel: () => WorkflowPreviewPanel
});
module.exports = __toCommonJS(components_exports);

// src/components/PhaseSection.tsx
var import_react2 = require("react");
var import_workflow = require("@qontinui/shared-types/workflow");

// src/config/phase-colors.ts
var PHASE_COLORS = {
  setup: {
    bg: "bg-blue-500/5",
    bgHeader: "bg-blue-500/10",
    border: "border-blue-500/30",
    borderHover: "hover:border-blue-500/50",
    text: "text-blue-400",
    textMuted: "text-blue-400/60",
    badge: "bg-blue-900/50 text-blue-300",
    button: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
  },
  verification: {
    bg: "bg-green-500/5",
    bgHeader: "bg-green-500/10",
    border: "border-green-500/30",
    borderHover: "hover:border-green-500/50",
    text: "text-green-400",
    textMuted: "text-green-400/60",
    badge: "bg-green-900/50 text-green-300",
    button: "bg-green-500/10 hover:bg-green-500/20 text-green-400"
  },
  agentic: {
    bg: "bg-amber-500/5",
    bgHeader: "bg-amber-500/10",
    border: "border-amber-500/30",
    borderHover: "hover:border-amber-500/50",
    text: "text-amber-400",
    textMuted: "text-amber-400/60",
    badge: "bg-amber-900/50 text-amber-300",
    button: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
  },
  completion: {
    bg: "bg-purple-500/5",
    bgHeader: "bg-purple-500/10",
    border: "border-purple-500/30",
    borderHover: "hover:border-purple-500/50",
    text: "text-purple-400",
    textMuted: "text-purple-400/60",
    badge: "bg-purple-900/50 text-purple-300",
    button: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
  }
};

// src/UIProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var CollapsibleOpenCtx = (0, import_react.createContext)(true);
function DefaultCollapsible({
  open,
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleOpenCtx.Provider, { value: open, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className, children }) });
}
function DefaultCollapsibleTrigger({
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className, children });
}
function DefaultCollapsibleContent({
  children,
  className
}) {
  const open = (0, import_react.useContext)(CollapsibleOpenCtx);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className, children });
}
var defaultPrimitives = {
  Collapsible: DefaultCollapsible,
  CollapsibleTrigger: DefaultCollapsibleTrigger,
  CollapsibleContent: DefaultCollapsibleContent
};
var UIContext = (0, import_react.createContext)(defaultPrimitives);
function useUIPrimitives() {
  return (0, import_react.useContext)(UIContext);
}

// src/components/PhaseSection.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ChevronIcon = ({ expanded, colorClass }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "svg",
  {
    className: `w-4 h-4 ${colorClass}`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" })
  }
);
var PlusIcon = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 5v14M5 12h14" }) });
var PhaseTrashIcon = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
function PhaseSectionConcrete({
  phase,
  steps,
  isExpanded,
  onToggle,
  onAddStep,
  hasSelectedStep = false,
  renderStepList,
  headerActions,
  onBatchDelete
}) {
  const { Collapsible, CollapsibleTrigger, CollapsibleContent } = useUIPrimitives();
  const phaseInfo = import_workflow.PHASE_INFO[phase];
  const colors = PHASE_COLORS[phase];
  const isEmpty = steps.length === 0;
  const [isSelectionMode, setIsSelectionMode] = (0, import_react2.useState)(false);
  const [selectedIds, setSelectedIds] = (0, import_react2.useState)(/* @__PURE__ */ new Set());
  const toggleSelect = (0, import_react2.useCallback)((stepId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  }, []);
  const exitSelectionMode = (0, import_react2.useCallback)(() => {
    setIsSelectionMode(false);
    setSelectedIds(/* @__PURE__ */ new Set());
  }, []);
  const handleBatchDelete = (0, import_react2.useCallback)(() => {
    if (onBatchDelete && selectedIds.size > 0) {
      onBatchDelete(Array.from(selectedIds));
    }
    exitSelectionMode();
  }, [onBatchDelete, selectedIds, exitSelectionMode]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Collapsible, { open: isExpanded, onOpenChange: onToggle, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      "data-tutorial-id": `${phase}-phase`,
      "data-phase": phase,
      className: `rounded-lg border transition-colors ${colors.border} ${colors.borderHover} ${hasSelectedStep ? colors.bg : ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(CollapsibleTrigger, { className: `w-full flex items-center justify-between p-3 rounded-t-lg ${colors.bgHeader} transition-colors`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2 flex-1 cursor-pointer", onClick: onToggle, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChevronIcon, { expanded: isExpanded, colorClass: colors.text }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `font-medium ${colors.text}`, children: phaseInfo.label }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `text-xs px-1.5 py-0.5 rounded ${colors.badge}`, children: steps.length })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `text-xs ${colors.textMuted} hidden sm:block`, children: phaseInfo.description }),
            headerActions,
            !isEmpty && onBatchDelete && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                onClick: () => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) setSelectedIds(/* @__PURE__ */ new Set());
                },
                className: `p-1 rounded transition-colors ${isSelectionMode ? "bg-red-500/20 text-red-400" : "text-zinc-400 hover:text-red-400 hover:bg-zinc-700"}`,
                title: isSelectionMode ? "Cancel selection" : "Select steps to delete",
                children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PhaseTrashIcon, {})
              }
            )
          ] })
        ] }),
        !isExpanded && steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "px-3 pb-2 text-xs text-zinc-500 truncate", children: [
          steps.slice(0, 3).map((s) => s.name).join(" \u2192 "),
          steps.length > 3 && ` +${steps.length - 3} more`
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CollapsibleContent, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "p-3 space-y-2", children: [
          isSelectionMode && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center justify-between px-3 py-2 status-error border border-red-500/30 rounded-md", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "text-sm text-red-400", children: [
              selectedIds.size,
              " selected"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2", children: [
              selectedIds.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  onClick: handleBatchDelete,
                  className: "flex items-center gap-1 px-3 py-1 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors",
                  children: "Delete"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  onClick: exitSelectionMode,
                  className: "px-3 py-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors",
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          steps.length > 0 ? renderStepList(steps, isSelectionMode, selectedIds, toggleSelect) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: `text-center py-4 ${colors.textMuted} text-sm`, children: [
            "No ",
            phase,
            " steps yet"
          ] }),
          !isSelectionMode && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              onClick: () => onAddStep(phase),
              className: `w-full flex items-center justify-center gap-2 py-1.5 rounded-md border border-dashed ${colors.border} ${colors.text} opacity-60 hover:opacity-100 transition-all text-xs`,
              "data-testid": `workflow-builder-phase-${phase}-add-step-btn`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlusIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Add Step" })
              ]
            }
          )
        ] }) })
      ]
    }
  ) });
}

// src/components/StepItem.tsx
var import_workflow_utils = require("@qontinui/workflow-utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
var LockIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { className: "w-3 h-3 text-zinc-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M7 11V7a5 5 0 0110 0v4" })
] });
var TrashIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
var CopyIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" })
] });
var AlertIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { className: "w-4 h-4 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
] });
function StepItemConcrete({
  step,
  isSelected,
  onClick,
  onDelete,
  onDuplicate,
  isSelectionMode = false,
  isSelectedForDelete = false,
  reorderSlot,
  selectionCheckbox,
  resolveIcon
}) {
  const isSummaryStep = step.type === "prompt" && step.is_summary_step === true;
  const iconData = getStepItemIconData(step);
  const Icon = resolveIcon(iconData.iconId);
  const subtitle = (0, import_workflow_utils.getStepSubtitle)(step);
  const issues = (0, import_workflow_utils.getStepValidationIssues)(step);
  const hasErrors = issues.some((i) => i.severity === "error");
  const hasWarnings = issues.some((i) => i.severity === "warning");
  const showNeedsConfig = (0, import_workflow_utils.needsConfig)(step);
  const validationTooltip = issues.map((i) => i.message).join("; ");
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      "data-step-type": step.type,
      className: `
        group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all
        ${isSelectionMode && isSelectedForDelete ? "border border-red-500/50 status-error" : isSelected ? "bg-zinc-700/80 ring-1 ring-zinc-500" : "hover:bg-zinc-800/60"}
      `,
      onClick,
      children: [
        isSelectionMode && selectionCheckbox,
        !isSelectionMode && !isSummaryStep && reorderSlot,
        !isSelectionMode && isSummaryStep && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "w-4 shrink-0" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `relative shrink-0 p-1 rounded ${iconData.bgClass}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { className: `w-4 h-4 ${iconData.textClass}` }),
          (hasErrors || hasWarnings) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "span",
            {
              className: `absolute -top-1 -right-1 w-2 h-2 rounded-full ${hasErrors ? "bg-red-500" : "bg-amber-500"}`,
              title: validationTooltip
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-sm text-zinc-200 truncate", children: step.name }),
            isSummaryStep && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(LockIcon, {}),
            showNeedsConfig && !hasErrors && !hasWarnings && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { title: "Needs configuration", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(AlertIcon, {}) })
          ] }),
          subtitle && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-xs text-zinc-500 truncate", children: subtitle })
        ] }),
        !isSummaryStep && !isSelectionMode && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          onDuplicate && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              className: "p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors",
              onClick: (e) => {
                e.stopPropagation();
                onDuplicate();
              },
              title: "Duplicate step",
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CopyIcon, {})
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              className: "p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors",
              onClick: (e) => {
                e.stopPropagation();
                onDelete();
              },
              title: "Delete step",
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TrashIcon, {})
            }
          )
        ] })
      ]
    }
  );
}
function getStepItemIconData(rawStep) {
  const step = rawStep;
  if (step.type === "command" && (step.test_type || step.test_id)) {
    const testType = step.test_type || "custom_command";
    return (0, import_workflow_utils.getTestIconData)(testType);
  }
  return (0, import_workflow_utils.getStepIconData)(step.type);
}

// src/components/SkillCatalog.tsx
var import_workflow_utils3 = require("@qontinui/workflow-utils");

// src/headless/SkillCatalog.tsx
var import_react3 = require("react");
var import_workflow_utils2 = require("@qontinui/workflow-utils");
var import_jsx_runtime4 = require("react/jsx-runtime");
function SkillCatalog({
  phase,
  onAddSteps,
  onClose,
  onSkillUsed,
  children
}) {
  const [searchQuery, setSearchQuery] = (0, import_react3.useState)("");
  const [selectedCategory, setSelectedCategory] = (0, import_react3.useState)(null);
  const [selectedSource, setSelectedSource] = (0, import_react3.useState)(null);
  const [selectedSkill, setSelectedSkill] = (0, import_react3.useState)(
    null
  );
  const [paramValues, setParamValues] = (0, import_react3.useState)({});
  const mode = selectedSkill ? "configure" : "browse";
  const categories = (0, import_react3.useMemo)(() => {
    const phaseSkills = (0, import_workflow_utils2.getSkillsByPhase)(phase);
    const cats = /* @__PURE__ */ new Set();
    for (const skill of phaseSkills) {
      cats.add(skill.category);
    }
    return Array.from(cats);
  }, [phase]);
  const hasNonBuiltinSkills = (0, import_react3.useMemo)(() => {
    const phaseSkills = (0, import_workflow_utils2.getSkillsByPhase)(phase);
    return phaseSkills.some((s) => s.source !== "builtin");
  }, [phase]);
  const filteredSkills = (0, import_react3.useMemo)(() => {
    const filters = { phase };
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    if (selectedSource) {
      filters.source = selectedSource;
    }
    return (0, import_workflow_utils2.searchSkills)(searchQuery, filters);
  }, [searchQuery, selectedCategory, selectedSource, phase]);
  const onSelectSkill = (0, import_react3.useCallback)(
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
  const setParamValue = (0, import_react3.useCallback)(
    (name, value) => {
      setParamValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const validationErrors = (0, import_react3.useMemo)(() => {
    if (!selectedSkill) return [];
    return (0, import_workflow_utils2.validateSkillParams)(selectedSkill, paramValues);
  }, [selectedSkill, paramValues]);
  const onConfirm = (0, import_react3.useCallback)(() => {
    if (!selectedSkill || validationErrors.length > 0) return;
    const steps = (0, import_workflow_utils2.instantiateSkill)(selectedSkill, phase, paramValues);
    onAddSteps(steps, phase);
    if (onSkillUsed) {
      onSkillUsed(selectedSkill.id);
    }
    onClose();
  }, [selectedSkill, phase, paramValues, validationErrors, onAddSteps, onSkillUsed, onClose]);
  const onBack = (0, import_react3.useCallback)(() => {
    setSelectedSkill(null);
    setParamValues({});
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: children({
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

// src/components/SkillParamForm.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function SkillParamForm({
  parameters,
  values,
  onChange,
  errors
}) {
  if (parameters.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-sm text-zinc-500 italic py-2", children: "No parameters needed \u2014 this skill is ready to use." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "space-y-3", children: [
    parameters.map((param) => {
      if (param.depends_on) {
        const depValue = values[param.depends_on.param];
        if (depValue !== param.depends_on.value) {
          return null;
        }
      }
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        SkillParamField,
        {
          param,
          value: values[param.name],
          onChange: (value) => onChange(param.name, value)
        },
        param.name
      );
    }),
    errors && errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "space-y-1", children: errors.map((err, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-xs text-red-400", children: err }, `${i}-${err}`)) })
  ] });
}
function SkillParamField({ param, value, onChange }) {
  const inputClasses = "w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-200 [&>option]:text-black [&>option]:bg-white placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: "flex items-center gap-1 text-sm text-zinc-300 mb-1", children: [
      param.label,
      param.required && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-red-400", children: "*" })
    ] }),
    param.description && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-xs text-zinc-500 mb-1.5", children: param.description }),
    param.type === "string" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          type: "text",
          className: inputClasses,
          value: value ?? "",
          onChange: (e) => onChange(e.target.value),
          placeholder: param.placeholder
        }
      ),
      param.pattern && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "text-[11px] text-zinc-600 mt-1", children: [
        "Pattern: ",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { className: "text-zinc-500", children: param.pattern })
      ] })
    ] }),
    param.type === "number" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          type: "number",
          className: inputClasses,
          value: value !== void 0 && value !== null ? String(value) : "",
          onChange: (e) => {
            const num = e.target.value === "" ? void 0 : Number(e.target.value);
            onChange(num);
          },
          placeholder: param.placeholder,
          min: param.min,
          max: param.max
        }
      ),
      (param.min != null || param.max != null) && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-[11px] text-zinc-600 mt-1", children: param.min != null && param.max != null ? `Range: ${param.min} \u2013 ${param.max}` : param.min != null ? `Min: ${param.min}` : `Max: ${param.max}` })
    ] }),
    param.type === "boolean" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": !!value,
        className: `
            relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full
            transition-colors focus:outline-hidden focus:ring-1 focus:ring-zinc-500
            ${value ? "bg-blue-500" : "bg-zinc-700"}
          `,
        onClick: () => onChange(!value),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "span",
          {
            className: `
              pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow
              transform transition-transform mt-0.5
              ${value ? "translate-x-5 ml-0.5" : "translate-x-0.5"}
            `
          }
        )
      }
    ),
    param.type === "select" && param.options && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "select",
      {
        className: inputClasses,
        style: { colorScheme: "dark" },
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "Select..." }),
          param.options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: opt.value, children: opt.label }, opt.value))
        ]
      }
    )
  ] });
}

// src/components/SkillCatalog.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var CATEGORY_LABELS = {
  "code-quality": "Code Quality",
  testing: "Testing",
  monitoring: "Monitoring",
  "ai-task": "AI Task",
  deployment: "Deployment",
  composition: "Composition",
  custom: "Custom"
};
function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] ?? category;
}
var SearchIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { strokeLinecap: "round", d: "m21 21-4.35-4.35" })
] });
var ArrowLeftIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 12H5m7-7-7 7 7 7" }) });
function SkillCatalogConcrete({
  phase,
  isOpen,
  onAddSteps,
  onClose,
  onSkillUsed,
  resolveIcon
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    SkillCatalog,
    {
      phase,
      onAddSteps,
      onClose,
      onSkillUsed,
      children: (props) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex flex-col h-full max-h-[480px]", children: props.mode === "browse" ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        BrowseView,
        {
          ...props,
          phase,
          resolveIcon
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        ConfigureView,
        {
          ...props,
          resolveIcon
        }
      ) })
    }
  );
}
function BrowseView({
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
  resolveIcon
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "px-3 pt-3 pb-2", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SearchIcon, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "input",
        {
          type: "text",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: "Search skills...",
          className: "w-full bg-zinc-800 border border-zinc-700 rounded pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-zinc-500",
          autoFocus: true
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "px-3 pb-2 flex gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CategoryChip,
        {
          label: "All",
          isActive: selectedCategory === null,
          onClick: () => setSelectedCategory(null)
        }
      ),
      categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CategoryChip,
        {
          label: getCategoryLabel(cat),
          isActive: selectedCategory === cat,
          onClick: () => setSelectedCategory(selectedCategory === cat ? null : cat)
        },
        cat
      ))
    ] }),
    hasNonBuiltinSkills && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "px-3 pb-2 flex gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CategoryChip,
        {
          label: "All Sources",
          isActive: selectedSource === null,
          onClick: () => setSelectedSource(null)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CategoryChip,
        {
          label: "Built-in",
          isActive: selectedSource === "builtin",
          onClick: () => setSelectedSource(selectedSource === "builtin" ? null : "builtin")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CategoryChip,
        {
          label: "Custom",
          isActive: selectedSource === "user",
          onClick: () => setSelectedSource(selectedSource === "user" ? null : "user")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        CategoryChip,
        {
          label: "Community",
          isActive: selectedSource === "community",
          onClick: () => setSelectedSource(
            selectedSource === "community" ? null : "community"
          )
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex-1 overflow-y-auto px-3 pb-2 space-y-1", children: filteredSkills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-sm text-zinc-500 py-4 text-center", children: "No skills match your search." }) : filteredSkills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      SkillCard,
      {
        skill,
        onClick: () => {
          if (skill.parameters.length === 0) {
            onSelectSkill(skill);
            return;
          }
          onSelectSkill(skill);
        },
        resolveIcon
      },
      skill.id
    )) })
  ] });
}
function ConfigureView({
  selectedSkill,
  paramValues,
  setParamValue,
  validationErrors,
  onConfirm,
  onBack,
  resolveIcon
}) {
  if (!selectedSkill) return null;
  const iconData = (0, import_workflow_utils3.getSkillCategoryIconData)(selectedSkill.category);
  const Icon = resolveIcon(selectedSkill.icon);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "px-3 pt-3 pb-2 flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          className: "p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors",
          onClick: onBack,
          title: "Back to catalog",
          children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ArrowLeftIcon, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `p-1.5 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { className: `w-4 h-4 ${iconData.textClass}` }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { className: "text-sm font-medium text-zinc-200 truncate", children: selectedSkill.name }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-xs text-zinc-500 truncate", children: selectedSkill.description })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex-1 overflow-y-auto px-3 pb-2", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      SkillParamForm,
      {
        parameters: selectedSkill.parameters,
        values: paramValues,
        onChange: setParamValue,
        errors: validationErrors
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "px-3 py-2 border-t border-zinc-800 flex justify-end gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          className: "px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded",
          onClick: onBack,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          className: "px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          onClick: onConfirm,
          disabled: validationErrors.length > 0,
          children: "Add to Phase"
        }
      )
    ] })
  ] });
}
function CategoryChip({
  label,
  isActive,
  onClick
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "button",
    {
      className: `
        px-2 py-0.5 text-xs rounded-full transition-colors
        ${isActive ? "bg-zinc-600 text-zinc-100" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"}
      `,
      onClick,
      children: label
    }
  );
}
function SkillCard({
  skill,
  onClick,
  resolveIcon
}) {
  const iconData = (0, import_workflow_utils3.getSkillCategoryIconData)(skill.category);
  const Icon = resolveIcon(skill.icon);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "button",
    {
      className: "w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-zinc-800/80 transition-colors text-left group",
      onClick,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `shrink-0 p-1.5 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { className: `w-4 h-4 ${iconData.textClass}` }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-zinc-200 group-hover:text-zinc-100", children: skill.name }),
            skill.source !== "builtin" && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${skill.source === "community" ? "bg-purple-900/30 text-purple-400" : "bg-blue-900/30 text-blue-400"}`, children: skill.source === "community" ? "Community" : "Custom" }),
            skill.forked_from && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ml-1.5 text-[10px] text-zinc-600", title: `Forked from ${skill.forked_from}`, children: "(fork)" }),
            skill.version && skill.version !== "1.0.0" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ml-1.5 px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-full", children: [
              "v",
              skill.version
            ] }),
            skill.approval_status && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${skill.approval_status === "approved" ? "bg-green-900/30 text-green-400" : skill.approval_status === "rejected" ? "bg-red-900/30 text-red-400" : "bg-yellow-900/30 text-yellow-400"}`, children: skill.approval_status === "approved" ? "Approved" : skill.approval_status === "rejected" ? "Rejected" : "Pending" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { className: "text-xs text-zinc-500 truncate", children: [
            skill.description,
            skill.author && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ml-1 text-zinc-600", children: [
              "\u2014 by ",
              skill.author.name
            ] })
          ] })
        ] }),
        skill.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "hidden sm:flex gap-1 shrink-0", children: skill.tags.slice(0, 2).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "span",
          {
            className: "px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded",
            children: tag
          },
          tag
        )) }),
        skill.usage_count != null && skill.usage_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "shrink-0 text-[10px] text-zinc-600", title: "Times used", children: [
          skill.usage_count,
          "x"
        ] })
      ]
    }
  );
}

// src/components/CompositionSkillBuilder.tsx
var import_react4 = require("react");
var import_workflow_utils4 = require("@qontinui/workflow-utils");
var import_jsx_runtime7 = require("react/jsx-runtime");
var EMPTY_INITIAL_REFS = [];
function makeUid() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `uid-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
var ChevronUpIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m5 15 7-7 7 7" }) });
var ChevronDownIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m19 9-7 7-7-7" }) });
var XMarkIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" }) });
var SearchIcon2 = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { strokeLinecap: "round", d: "m21 21-4.35-4.35" })
] });
var ChevronRightIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m9 5 7 7-7 7" }) });
function resolveRef(ref) {
  const skill = (0, import_workflow_utils4.getSkill)(ref.skill_id);
  return {
    ...ref,
    _skill: skill,
    _uid: makeUid()
  };
}
function CompositionSkillBuilder({
  initialRefs = EMPTY_INITIAL_REFS,
  onSave,
  onCancel,
  resolveIcon
}) {
  const [refs, setRefs] = (0, import_react4.useState)(
    () => initialRefs.map(resolveRef)
  );
  const [showPicker, setShowPicker] = (0, import_react4.useState)(false);
  const [expandedIndex, setExpandedIndex] = (0, import_react4.useState)(null);
  const handleAddRef = (0, import_react4.useCallback)((skill) => {
    const newRef = {
      skill_id: skill.id,
      parameter_overrides: {},
      _skill: skill,
      _uid: makeUid()
    };
    setRefs((prev) => [...prev, newRef]);
    setShowPicker(false);
  }, []);
  const handleRemoveRef = (0, import_react4.useCallback)((index) => {
    setRefs((prev) => prev.filter((_, i) => i !== index));
    setExpandedIndex((prev) => {
      if (prev === index) return null;
      if (prev !== null && prev > index) return prev - 1;
      return prev;
    });
  }, []);
  const handleMoveUp = (0, import_react4.useCallback)((index) => {
    if (index === 0) return;
    setRefs((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setExpandedIndex((prev) => {
      if (prev === index) return index - 1;
      if (prev === index - 1) return index;
      return prev;
    });
  }, []);
  const handleMoveDown = (0, import_react4.useCallback)((index) => {
    setRefs((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setExpandedIndex((prev) => {
      if (prev === index) return index + 1;
      if (prev === index + 1) return index;
      return prev;
    });
  }, []);
  const handleToggleExpand = (0, import_react4.useCallback)((index) => {
    setExpandedIndex((prev) => prev === index ? null : index);
  }, []);
  const handleParamOverrideChange = (0, import_react4.useCallback)(
    (index, paramName, value) => {
      setRefs(
        (prev) => prev.map((ref, i) => {
          if (i !== index) return ref;
          const overrides = { ...ref.parameter_overrides };
          if (value === void 0 || value === "" || value === null) {
            delete overrides[paramName];
          } else {
            overrides[paramName] = value;
          }
          return { ...ref, parameter_overrides: overrides };
        })
      );
    },
    []
  );
  const handleSave = (0, import_react4.useCallback)(() => {
    const cleanRefs = refs.map(({ _skill, _uid, ...rest }) => {
      const clean = { skill_id: rest.skill_id };
      if (rest.parameter_overrides && Object.keys(rest.parameter_overrides).length > 0) {
        clean.parameter_overrides = rest.parameter_overrides;
      }
      return clean;
    });
    onSave(cleanRefs);
  }, [refs, onSave]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col h-full max-h-[500px]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "px-4 py-3 border-b border-zinc-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-medium text-zinc-200", children: "Composition Skill Builder" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-zinc-500 mt-0.5", children: "Add skills to compose into a single skill" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex-1 overflow-y-auto px-4 py-2 space-y-2", children: refs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm text-zinc-500 py-8 text-center", children: 'No skills added yet. Click "Add Skill" below.' }) : refs.map((ref, index) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      SkillRefItem,
      {
        ref_: ref,
        index,
        total: refs.length,
        isExpanded: expandedIndex === index,
        onToggleExpand: () => handleToggleExpand(index),
        onMoveUp: () => handleMoveUp(index),
        onMoveDown: () => handleMoveDown(index),
        onRemove: () => handleRemoveRef(index),
        onParamChange: (name, value) => handleParamOverrideChange(index, name, value),
        resolveIcon
      },
      ref._uid
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "px-4 py-2 border-t border-zinc-800", children: showPicker ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      MiniSkillPicker,
      {
        existingRefIds: refs.map((r) => r.skill_id),
        onSelect: handleAddRef,
        onCancel: () => setShowPicker(false),
        resolveIcon
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        onClick: () => setShowPicker(true),
        className: "w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-700 rounded hover:border-zinc-500 transition-colors",
        children: "+ Add Skill"
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "px-4 py-3 border-t border-zinc-800 flex justify-end gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: onCancel,
          className: "px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "button",
        {
          onClick: handleSave,
          disabled: refs.length === 0,
          className: "px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: [
            "Save Composition (",
            refs.length,
            " skill",
            refs.length !== 1 ? "s" : "",
            ")"
          ]
        }
      )
    ] })
  ] });
}
function SkillRefItem({
  ref_,
  index,
  total,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onRemove,
  onParamChange,
  resolveIcon
}) {
  const skill = ref_._skill;
  const hasParams = skill != null && skill.parameters.length > 0;
  const overrideCount = ref_.parameter_overrides ? Object.keys(ref_.parameter_overrides).length : 0;
  const iconData = skill ? (0, import_workflow_utils4.getSkillCategoryIconData)(skill.category) : null;
  const Icon = skill ? resolveIcon(skill.icon) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "border border-zinc-700 rounded-md overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2 px-3 py-2 bg-zinc-800/50", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-xs text-zinc-500 font-mono w-5 text-center shrink-0", children: index + 1 }),
      Icon && iconData && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: `shrink-0 p-1 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { className: `w-3.5 h-3.5 ${iconData.textClass}` }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-sm text-zinc-200 truncate block", children: skill?.name ?? ref_.skill_id }),
        !skill && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-xs text-red-400", children: "Unknown skill" })
      ] }),
      overrideCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "shrink-0 px-1.5 py-0.5 text-[10px] bg-blue-900/30 text-blue-400 rounded-full", children: [
        overrideCount,
        " override",
        overrideCount !== 1 ? "s" : ""
      ] }),
      hasParams && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: onToggleExpand,
          className: "shrink-0 p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors",
          title: isExpanded ? "Collapse parameters" : "Configure parameter overrides",
          children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            ChevronRightIcon,
            {
              className: `w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "shrink-0 flex flex-col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            onClick: onMoveUp,
            disabled: index === 0,
            className: "p-0.5 text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors",
            title: "Move up",
            children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ChevronUpIcon, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            onClick: onMoveDown,
            disabled: index === total - 1,
            className: "p-0.5 text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors",
            title: "Move down",
            children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ChevronDownIcon, { className: "w-3 h-3" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: onRemove,
          className: "shrink-0 p-1 rounded hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors",
          title: "Remove skill",
          children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(XMarkIcon, { className: "w-3.5 h-3.5" })
        }
      )
    ] }),
    isExpanded && skill && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "px-3 py-2 border-t border-zinc-700/50 bg-zinc-900/30", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-zinc-500 mb-2", children: "Parameter overrides (leave empty to use defaults)" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        SkillParamForm,
        {
          parameters: skill.parameters.map((p) => ({
            ...p,
            // Mark all as optional in override context
            required: false
          })),
          values: ref_.parameter_overrides ?? {},
          onChange: onParamChange
        }
      )
    ] })
  ] });
}
function MiniSkillPicker({
  existingRefIds,
  onSelect,
  onCancel,
  resolveIcon
}) {
  const [search, setSearch] = (0, import_react4.useState)("");
  const availableSkills = (0, import_react4.useMemo)(() => {
    const all = (0, import_workflow_utils4.getAllSkills)();
    let filtered = all.filter((s) => s.template.kind !== "composition");
    const trimmed = search.trim().toLowerCase();
    if (trimmed) {
      const words = trimmed.split(/\s+/);
      filtered = filtered.filter((skill) => {
        const haystack = [
          skill.name.toLowerCase(),
          skill.description.toLowerCase(),
          skill.slug.toLowerCase(),
          ...skill.tags.map((t) => t.toLowerCase())
        ].join(" ");
        return words.every((word) => haystack.includes(word));
      });
    }
    return filtered;
  }, [search]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "border border-zinc-700 rounded-md overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "relative px-2 py-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(SearchIcon2, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search skills...",
          className: "w-full bg-zinc-800 border border-zinc-700 rounded pl-7 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500",
          autoFocus: true
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "max-h-[200px] overflow-y-auto", children: availableSkills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-zinc-500 py-4 text-center", children: "No matching skills found." }) : availableSkills.map((skill) => {
      const iconData = (0, import_workflow_utils4.getSkillCategoryIconData)(skill.category);
      const Icon = resolveIcon(skill.icon);
      const alreadyAdded = existingRefIds.includes(skill.id);
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "button",
        {
          onClick: () => onSelect(skill),
          className: "w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800/80 transition-colors text-left",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: `shrink-0 p-1 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { className: `w-3.5 h-3.5 ${iconData.textClass}` }) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-sm text-zinc-200 truncate block", children: skill.name }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-xs text-zinc-500 truncate block", children: skill.description })
            ] }),
            alreadyAdded && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "shrink-0 text-[10px] text-zinc-600", children: "added" })
          ]
        },
        skill.id
      );
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "px-2 py-1.5 border-t border-zinc-700/50 flex justify-end", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        onClick: onCancel,
        className: "px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors",
        children: "Cancel"
      }
    ) })
  ] });
}

// src/components/chat/ChatHeader.tsx
var import_react5 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
  const [isEditing, setIsEditing] = (0, import_react5.useState)(false);
  const [editValue, setEditValue] = (0, import_react5.useState)(sessionName);
  const inputRef = (0, import_react5.useRef)(null);
  const displayEditValue = isEditing ? editValue : sessionName;
  (0, import_react5.useEffect)(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleSave = (0, import_react5.useCallback)(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== sessionName) {
      onRename(trimmed);
    }
    setIsEditing(false);
  }, [editValue, sessionName, onRename]);
  const handleKeyDown = (0, import_react5.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50 bg-surface-canvas/80 backdrop-blur-xs", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "svg",
        {
          className: "size-5 text-purple-400",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
        }
      ),
      isEditing ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "button",
          {
            onClick: handleSave,
            className: "text-green-400 hover:text-green-300",
            children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "svg",
              {
                className: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          }
        )
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "button",
        {
          onClick: () => {
            setEditValue(sessionName);
            setIsEditing(true);
          },
          className: "flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-text-secondary group",
          children: [
            sessionName,
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
              "svg",
              {
                className: "size-3 opacity-0 group-hover:opacity-60",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "m15 5 4 4" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(StateBadge, { state: sessionState }),
      isRunnerConnected !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "flex items-center gap-1 text-[10px]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "span",
          {
            className: `inline-block size-1.5 rounded-full ${isRunnerConnected ? "bg-green-400" : "bg-red-400"}`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "span",
          {
            className: isRunnerConnected ? "text-green-400" : "text-red-400",
            children: isRunnerConnected ? "Runner" : "Runner offline"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "button",
      {
        onClick: onClose,
        className: "h-7 w-7 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-surface-hover",
        children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "svg",
          {
            className: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M18 6 6 18" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "m6 6 12 12" })
            ]
          }
        )
      }
    )
  ] });
}

// src/components/chat/ChatInput.tsx
var import_react6 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
function ChatInput({
  sessionState,
  onSendMessage,
  onInterrupt,
  onGenerateWorkflow,
  isGeneratingWorkflow,
  messageCount,
  disabled
}) {
  const [message, setMessage] = (0, import_react6.useState)(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("chat-draft-message") ?? "";
  });
  const [includeUIBridge, setIncludeUIBridge] = (0, import_react6.useState)(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("chat-include-ui-bridge");
    return saved !== null ? saved === "true" : true;
  });
  const textareaRef = (0, import_react6.useRef)(null);
  const canSend = !disabled && message.trim().length > 0 && (sessionState === "ready" || sessionState === "processing");
  const canInterrupt = sessionState === "processing";
  const showGenerateWorkflow = messageCount >= 2;
  const handleSend = (0, import_react6.useCallback)(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
    localStorage.removeItem("chat-draft-message");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, onSendMessage]);
  const handleKeyDown = (0, import_react6.useCallback)(
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
  (0, import_react6.useEffect)(() => {
    localStorage.setItem("chat-include-ui-bridge", String(includeUIBridge));
  }, [includeUIBridge]);
  (0, import_react6.useEffect)(() => {
    if (message) {
      localStorage.setItem("chat-draft-message", message);
    } else {
      localStorage.removeItem("chat-draft-message");
    }
  }, [message]);
  (0, import_react6.useEffect)(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }
  }, [message]);
  const stateLabel = sessionState === "ready" ? "Ready" : sessionState === "processing" ? "Processing..." : sessionState === "initializing" ? "Initializing..." : sessionState === "connecting" ? "Connecting..." : sessionState === "disconnected" ? "Disconnected" : sessionState === "closed" ? "Session Closed" : "";
  const stateColor = sessionState === "ready" ? "text-green-400" : sessionState === "processing" ? "text-amber-400" : "text-text-muted";
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "border-t border-border-subtle/50 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: `text-xs ${stateColor}`, children: stateLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex items-center gap-2", children: showGenerateWorkflow && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "label",
          {
            className: "flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none",
            title: "Include UI Bridge SDK integration instructions in the generated workflow",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "button",
          {
            onClick: () => onGenerateWorkflow(includeUIBridge),
            disabled: isGeneratingWorkflow || disabled,
            className: "inline-flex items-center gap-1.5 text-xs h-7 px-2.5 rounded-md border border-purple-800/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              isGeneratingWorkflow ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                "svg",
                {
                  className: "size-3 animate-spin",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" })
                }
              ),
              isGeneratingWorkflow ? "Generating..." : "Generate Workflow"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      canInterrupt ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          onClick: onInterrupt,
          className: "h-[42px] px-3 rounded-md border border-amber-800/50 text-amber-400 hover:bg-amber-900/30 flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" })
            }
          )
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          onClick: handleSend,
          disabled: !canSend,
          className: "h-[42px] px-3 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "m22 2-7 20-4-9-9-4Z" }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M22 2 11 13" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/chat/ChatMessageArea.tsx
var import_react7 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function ChatMessageArea({
  messages,
  streamingContent,
  isStreaming,
  renderMarkdown,
  onCreateWorkflowFromMessage,
  toolActivity
}) {
  const scrollRef = (0, import_react7.useRef)(null);
  const [autoScroll, setAutoScroll] = (0, import_react7.useState)(true);
  const prevLenRef = (0, import_react7.useRef)(0);
  (0, import_react7.useEffect)(() => {
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
  const handleScroll = (0, import_react7.useCallback)(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  }, []);
  const scrollToBottom = (0, import_react7.useCallback)(() => {
    setAutoScroll(true);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  const renderContent = (content) => {
    if (renderMarkdown) return renderMarkdown(content);
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-text-primary whitespace-pre-wrap wrap-break-word", children: content });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      ref: scrollRef,
      onScroll: handleScroll,
      className: "flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 py-4",
      children: [
        messages.length === 0 && !streamingContent && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-text-muted", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
            "svg",
            {
              className: "size-12 mb-3 opacity-30",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.5",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 8V4H8" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M2 14h2" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M20 14h2" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M15 13v2" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M9 13v2" })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm", children: "Start a conversation with AI" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-xs mt-1 opacity-60", children: "Discuss features, plan workflows, then generate them" })
        ] }),
        messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          MessageBubble,
          {
            message: msg,
            index: i,
            renderContent,
            onCreateWorkflow: onCreateWorkflowFromMessage
          },
          `${msg.timestamp ?? i}-${msg.role}`
        )),
        isStreaming && streamingContent && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AiBotIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "max-w-[85%]", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "max-w-none text-sm", children: renderContent(streamingContent) }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" })
              ]
            }
          ) })
        ] }),
        isStreaming && !streamingContent && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AiBotIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: toolActivity ? /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("svg", { className: "size-3.5 text-purple-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 2v4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 18v4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m4.93 4.93 2.83 2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m16.24 16.24 2.83 2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M2 12h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M18 12h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m4.93 19.07 2.83-2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m16.24 7.76 2.83-2.83" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-xs text-purple-300/80", children: toolActivity })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" })
              ] })
            }
          )
        ] }),
        isStreaming && streamingContent && toolActivity && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex gap-3 items-center ml-10", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-raised/20", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("svg", { className: "size-3 text-purple-400/60 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 2v4" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 18v4" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m4.93 4.93 2.83 2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m16.24 16.24 2.83 2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M2 12h4" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M18 12h4" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m4.93 19.07 2.83-2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m16.24 7.76 2.83-2.83" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-xs text-text-muted", children: toolActivity })
        ] }) }),
        !autoScroll && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          "button",
          {
            onClick: scrollToBottom,
            className: "sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle/50 text-text-secondary text-xs hover:bg-surface-hover flex items-center gap-1.5 shadow-lg",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 5v14" }),
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "m19 12-7 7-7-7" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "svg",
    {
      className: "size-4 text-purple-400",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M2 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M20 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M15 13v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M9 13v2" })
      ]
    }
  );
}
function UserIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "svg",
    {
      className: "size-4 text-brand-primary",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("circle", { cx: "12", cy: "7", r: "4" })
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
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-raised/40 border border-border-subtle/20", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
        "svg",
        {
          className: "size-3.5 text-text-muted/70 shrink-0",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 16v-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 8h.01" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-xs text-text-muted/80", children: message.content })
    ] }) });
  }
  if (message.role === "user") {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex gap-3 items-start justify-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "max-w-[85%]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "div",
          {
            className: "rounded-lg px-4 py-3 border border-brand-primary/30",
            style: { background: "color-mix(in srgb, var(--qontinui-brand-primary, #4a90d9) 10%, var(--qontinui-surface-canvas, #111115))" },
            children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "text-sm text-text-primary", children: renderContent(message.content) })
          }
        ),
        formattedTime && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "text-[10px] text-text-muted/60 mt-1 text-right", children: formattedTime })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(UserIcon, {}) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "group/msg flex gap-3 items-start", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(AiBotIcon, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "max-w-[85%]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "div",
        {
          className: "rounded-lg px-4 py-3 border border-border-subtle/30",
          style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "max-w-none text-sm", children: renderContent(message.content) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [
        formattedTime && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-[10px] text-text-muted/60", children: formattedTime }),
        onCreateWorkflow && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          "button",
          {
            onClick: () => onCreateWorkflow(index, message.content),
            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-muted hover:text-purple-300 hover:bg-purple-900/20 transition-colors opacity-0 group-hover/msg:opacity-100",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("svg", { className: "size-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: "M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" }) }),
              "Create Workflow"
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/components/chat/WorkflowPreviewPanel.tsx
var import_react8 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
var PHASE_COLORS2 = {
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex flex-col h-full border-l border-border-subtle/50 bg-surface-canvas/95", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Generated Workflow" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "button",
        {
          onClick: onClose,
          className: "h-6 w-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover",
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
            "svg",
            {
              className: "size-3.5",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M18 6 6 18" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m6 6 12 12" })
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex-1 overflow-y-auto p-4", children: [
      isLoading && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 text-text-muted", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "svg",
          {
            className: "size-8 animate-spin mb-3 text-purple-400",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm", children: "Generating workflow..." }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-xs mt-1 opacity-60", children: "This may take a minute" })
      ] }),
      error && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 text-red-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "svg",
          {
            className: "size-8 mb-3",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m15 9-6 6" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m9 9 6 6" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm font-medium", children: "Generation Failed" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-xs mt-1 opacity-60 text-center max-w-[250px]", children: error })
      ] }),
      workflow && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h4", { className: "text-sm font-medium text-text-primary", children: workflow.name }),
          workflow.description && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-xs text-text-muted mt-1", children: workflow.description }),
          workflow.tags && workflow.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex gap-1 mt-2 flex-wrap", children: workflow.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
    workflow && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "border-t border-border-subtle/50 p-4 space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: onExecute,
            className: "flex-1 h-8 rounded-md bg-green-700 hover:bg-green-600 text-white text-sm flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("polygon", { points: "5 3 19 12 5 21 5 3" })
                }
              ),
              "Execute"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: onEditInBuilder,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-sm hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m15 5 4 4" })
                  ]
                }
              ),
              "Edit in Builder"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: onRegenerate,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
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
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M3 3v5h5" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M16 16h5v5" })
                  ]
                }
              ),
              "Regenerate"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: onSave,
            title: "Save workflow to library",
            "aria-label": "Save workflow to library",
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
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
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("polyline", { points: "17 21 17 13 7 13 7 21" }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("polyline", { points: "7 3 7 8 15 8" })
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
  const [isExpanded, setIsExpanded] = (0, import_react8.useState)(true);
  const colors = PHASE_COLORS2[phase] ?? PHASE_COLORS2["setup"];
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: `rounded-lg border ${colors.border} ${colors.bg}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        onClick: () => setIsExpanded(!isExpanded),
        className: "flex items-center justify-between w-full px-3 py-2 cursor-pointer",
        children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "svg",
            {
              className: `w-3.5 h-3.5 transition-transform ${colors.text} ${isExpanded ? "rotate-90" : ""}`,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "m9 18 6-6-6-6" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "span",
            {
              className: `text-xs font-semibold uppercase tracking-wider ${colors.text}`,
              children: phase
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "span",
            {
              className: `text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`,
              children: steps.length
            }
          )
        ] })
      }
    ),
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "px-2 pb-2 space-y-1", children: steps.map((rawStep, i) => {
      const step = rawStep;
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "div",
        {
          className: "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/20",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(StepTypeIcon, { type: step.type }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "text-xs text-zinc-200 truncate", children: step.name }) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
              "svg",
              {
                className: "w-3 h-3 text-zinc-600",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("polyline", { points: "22 4 12 14.01 9 11.01" })
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
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("polyline", { points: "4 17 10 11 4 5" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: "12", x2: "20", y1: "19", y2: "19" })
        ]
      }
    );
  }
  if (type === "ui_bridge") {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: "8", x2: "16", y1: "21", y2: "21" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: "12", x2: "12", y1: "17", y2: "21" })
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "svg",
    {
      className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  CompositionSkillBuilder,
  PhaseSectionConcrete,
  SkillCatalogConcrete,
  SkillParamForm,
  StepItemConcrete,
  WorkflowPreviewPanel
});
//# sourceMappingURL=index.cjs.map