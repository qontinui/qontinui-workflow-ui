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
  PhaseSectionConcrete: () => PhaseSectionConcrete,
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
  const ChevronIcon = ({ expanded }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      className: `w-4 h-4 ${colors.text}`,
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" })
    }
  );
  const PlusIcon = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 5v14M5 12h14" }) });
  const TrashIcon = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Collapsible, { open: isExpanded, onOpenChange: onToggle, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      "data-tutorial-id": `${phase}-phase`,
      "data-phase": phase,
      className: `rounded-lg border transition-colors ${colors.border} ${colors.borderHover} ${hasSelectedStep ? colors.bg : ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(CollapsibleTrigger, { className: `w-full flex items-center justify-between p-3 rounded-t-lg ${colors.bgHeader} transition-colors`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2 flex-1 cursor-pointer", onClick: onToggle, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChevronIcon, { expanded: isExpanded }),
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
                children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TrashIcon, {})
              }
            )
          ] })
        ] }),
        !isExpanded && steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "px-3 pb-2 text-xs text-zinc-500 truncate", children: [
          steps.slice(0, 3).map((s) => s.name).join(" \u2192 "),
          steps.length > 3 && ` +${steps.length - 3} more`
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CollapsibleContent, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "p-3 space-y-2", children: [
          isSelectionMode && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center justify-between px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-md", children: [
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
              className: `w-full flex items-center justify-center gap-2 p-2 rounded-md ${colors.button} transition-colors text-sm`,
              "data-ui-id": `workflow-builder-phase-${phase}-add-step-btn`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlusIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
                  "Add ",
                  phaseInfo.label,
                  " Step"
                ] })
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
  const LockIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { className: "w-3 h-3 text-zinc-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M7 11V7a5 5 0 0110 0v4" })
  ] });
  const TrashIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
  const CopyIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" })
  ] });
  const AlertIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { className: "w-4 h-4 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      "data-step-type": step.type,
      className: `
        group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all
        ${isSelectionMode && isSelectedForDelete ? "border border-red-500/50 bg-red-500/10" : isSelected ? "bg-zinc-700/80 ring-1 ring-zinc-500" : "hover:bg-zinc-800/60"}
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
function getStepItemIconData(step) {
  if (step.type === "command" && (step.test_type || step.test_id)) {
    const testType = step.test_type || "custom_command";
    return (0, import_workflow_utils.getTestIconData)(testType);
  }
  return (0, import_workflow_utils.getStepIconData)(step.type);
}

// src/components/chat/ChatHeader.tsx
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  const [isEditing, setIsEditing] = (0, import_react3.useState)(false);
  const [editValue, setEditValue] = (0, import_react3.useState)(sessionName);
  const inputRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    setEditValue(sessionName);
  }, [sessionName]);
  (0, import_react3.useEffect)(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleSave = (0, import_react3.useCallback)(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== sessionName) {
      onRename(trimmed);
    }
    setIsEditing(false);
  }, [editValue, sessionName, onRename]);
  const handleKeyDown = (0, import_react3.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50 bg-surface-canvas/80 backdrop-blur-sm", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "svg",
        {
          className: "size-5 text-purple-400",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
        }
      ),
      isEditing ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            ref: inputRef,
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onKeyDown: handleKeyDown,
            onBlur: handleSave,
            className: "bg-surface-canvas border border-border-subtle/50 rounded px-2 py-0.5 text-sm text-text-primary focus:outline-none focus:border-brand-primary/50",
            maxLength: 60
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            onClick: handleSave,
            className: "text-green-400 hover:text-green-300",
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "svg",
              {
                className: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          }
        )
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "button",
        {
          onClick: () => setIsEditing(true),
          className: "flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-text-secondary group",
          children: [
            sessionName,
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "svg",
              {
                className: "size-3 opacity-0 group-hover:opacity-60",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m15 5 4 4" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StateBadge, { state: sessionState }),
      isRunnerConnected !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "flex items-center gap-1 text-[10px]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: `inline-block size-1.5 rounded-full ${isRunnerConnected ? "bg-green-400" : "bg-red-400"}`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: isRunnerConnected ? "text-green-400" : "text-red-400",
            children: isRunnerConnected ? "Runner" : "Runner offline"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        onClick: onClose,
        className: "h-7 w-7 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-surface-hover",
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "svg",
          {
            className: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M18 6 6 18" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m6 6 12 12" })
            ]
          }
        )
      }
    )
  ] });
}

// src/components/chat/ChatInput.tsx
var import_react4 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function ChatInput({
  sessionState,
  onSendMessage,
  onInterrupt,
  onGenerateWorkflow,
  isGeneratingWorkflow,
  messageCount,
  disabled
}) {
  const [message, setMessage] = (0, import_react4.useState)(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("chat-draft-message") ?? "";
  });
  const [includeUIBridge, setIncludeUIBridge] = (0, import_react4.useState)(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("chat-include-ui-bridge");
    return saved !== null ? saved === "true" : true;
  });
  const textareaRef = (0, import_react4.useRef)(null);
  const canSend = !disabled && message.trim().length > 0 && (sessionState === "ready" || sessionState === "processing");
  const canInterrupt = sessionState === "processing";
  const showGenerateWorkflow = messageCount >= 2;
  const handleSend = (0, import_react4.useCallback)(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
    localStorage.removeItem("chat-draft-message");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, onSendMessage]);
  const handleKeyDown = (0, import_react4.useCallback)(
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
  (0, import_react4.useEffect)(() => {
    localStorage.setItem("chat-include-ui-bridge", String(includeUIBridge));
  }, [includeUIBridge]);
  (0, import_react4.useEffect)(() => {
    if (message) {
      localStorage.setItem("chat-draft-message", message);
    } else {
      localStorage.removeItem("chat-draft-message");
    }
  }, [message]);
  (0, import_react4.useEffect)(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }
  }, [message]);
  const stateLabel = sessionState === "ready" ? "Ready" : sessionState === "processing" ? "Processing..." : sessionState === "initializing" ? "Initializing..." : sessionState === "connecting" ? "Connecting..." : sessionState === "disconnected" ? "Disconnected" : sessionState === "closed" ? "Session Closed" : "";
  const stateColor = sessionState === "ready" ? "text-green-400" : sessionState === "processing" ? "text-amber-400" : "text-text-muted";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "border-t border-border-subtle/50 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `text-xs ${stateColor}`, children: stateLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex items-center gap-2", children: showGenerateWorkflow && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "label",
          {
            className: "flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none",
            title: "Include UI Bridge SDK integration instructions in the generated workflow",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "button",
          {
            onClick: () => onGenerateWorkflow(includeUIBridge),
            disabled: isGeneratingWorkflow || disabled,
            className: "inline-flex items-center gap-1.5 text-xs h-7 px-2.5 rounded-md border border-purple-800/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              isGeneratingWorkflow ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "svg",
                {
                  className: "size-3 animate-spin",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" })
                }
              ),
              isGeneratingWorkflow ? "Generating..." : "Generate Workflow"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
      canInterrupt ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          onClick: onInterrupt,
          className: "h-[42px] px-3 rounded-md border border-amber-800/50 text-amber-400 hover:bg-amber-900/30 flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" })
            }
          )
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          onClick: handleSend,
          disabled: !canSend,
          className: "h-[42px] px-3 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m22 2-7 20-4-9-9-4Z" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M22 2 11 13" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/chat/ChatMessageArea.tsx
var import_react5 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function ChatMessageArea({
  messages,
  streamingContent,
  isStreaming,
  renderMarkdown,
  onCreateWorkflowFromMessage,
  toolActivity
}) {
  const scrollRef = (0, import_react5.useRef)(null);
  const [autoScroll, setAutoScroll] = (0, import_react5.useState)(true);
  const prevLenRef = (0, import_react5.useRef)(0);
  (0, import_react5.useEffect)(() => {
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
  const handleScroll = (0, import_react5.useCallback)(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  }, []);
  const scrollToBottom = (0, import_react5.useCallback)(() => {
    setAutoScroll(true);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  const renderContent = (content) => {
    if (renderMarkdown) return renderMarkdown(content);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-sm text-text-primary whitespace-pre-wrap break-words", children: content });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      ref: scrollRef,
      onScroll: handleScroll,
      className: "flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 py-4",
      children: [
        messages.length === 0 && !streamingContent && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-text-muted", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "svg",
            {
              className: "size-12 mb-3 opacity-30",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.5",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 8V4H8" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2 14h2" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M20 14h2" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M15 13v2" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M9 13v2" })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-sm", children: "Start a conversation with AI" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-xs mt-1 opacity-60", children: "Discuss features, plan workflows, then generate them" })
        ] }),
        messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          MessageBubble,
          {
            message: msg,
            index: i,
            renderContent,
            onCreateWorkflow: onCreateWorkflowFromMessage
          },
          i
        )),
        isStreaming && streamingContent && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(AiBotIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "max-w-[85%]", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "max-w-none text-sm", children: renderContent(streamingContent) }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" })
              ]
            }
          ) })
        ] }),
        isStreaming && !streamingContent && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(AiBotIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: toolActivity ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { className: "size-3.5 text-purple-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 2v4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 18v4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m4.93 4.93 2.83 2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m16.24 16.24 2.83 2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2 12h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M18 12h4" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m4.93 19.07 2.83-2.83" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m16.24 7.76 2.83-2.83" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-xs text-purple-300/80", children: toolActivity })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" })
              ] })
            }
          )
        ] }),
        isStreaming && streamingContent && toolActivity && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex gap-3 items-center ml-10", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-raised/20", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { className: "size-3 text-purple-400/60 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 2v4" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 18v4" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m4.93 4.93 2.83 2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m16.24 16.24 2.83 2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2 12h4" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M18 12h4" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m4.93 19.07 2.83-2.83" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m16.24 7.76 2.83-2.83" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-xs text-text-muted", children: toolActivity })
        ] }) }),
        !autoScroll && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "button",
          {
            onClick: scrollToBottom,
            className: "sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle/50 text-text-secondary text-xs hover:bg-surface-hover flex items-center gap-1.5 shadow-lg",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 5v14" }),
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m19 12-7 7-7-7" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "svg",
    {
      className: "size-4 text-purple-400",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M20 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M15 13v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M9 13v2" })
      ]
    }
  );
}
function UserIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "svg",
    {
      className: "size-4 text-brand-primary",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "12", cy: "7", r: "4" })
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
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-raised/40 border border-border-subtle/20", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "svg",
        {
          className: "size-3.5 text-text-muted/70 shrink-0",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 16v-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 8h.01" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-xs text-text-muted/80", children: message.content })
    ] }) });
  }
  if (message.role === "user") {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-3 items-start justify-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "max-w-[85%]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "div",
          {
            className: "rounded-lg px-4 py-3 border border-brand-primary/30",
            style: { background: "color-mix(in srgb, var(--qontinui-brand-primary, #4a90d9) 10%, var(--qontinui-surface-canvas, #111115))" },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "text-sm text-text-primary", children: renderContent(message.content) })
          }
        ),
        formattedTime && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "text-[10px] text-text-muted/60 mt-1 text-right", children: formattedTime })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(UserIcon, {}) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "group/msg flex gap-3 items-start", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(AiBotIcon, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "max-w-[85%]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "div",
        {
          className: "rounded-lg px-4 py-3 border border-border-subtle/30",
          style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
          children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "max-w-none text-sm", children: renderContent(message.content) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [
        formattedTime && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-[10px] text-text-muted/60", children: formattedTime }),
        onCreateWorkflow && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "button",
          {
            onClick: () => onCreateWorkflow(index, message.content),
            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-muted hover:text-purple-300 hover:bg-purple-900/20 transition-colors opacity-0 group-hover/msg:opacity-100",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { className: "size-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" }) }),
              "Create Workflow"
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/components/chat/WorkflowPreviewPanel.tsx
var import_react6 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col h-full border-l border-border-subtle/50 bg-surface-canvas/95", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Generated Workflow" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: onClose,
          className: "h-6 w-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover",
          children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            "svg",
            {
              className: "size-3.5",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M18 6 6 18" }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m6 6 12 12" })
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex-1 overflow-y-auto p-4", children: [
      isLoading && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 text-text-muted", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "svg",
          {
            className: "size-8 animate-spin mb-3 text-purple-400",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm", children: "Generating workflow..." }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs mt-1 opacity-60", children: "This may take a minute" })
      ] }),
      error && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col items-center justify-center h-48 text-red-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "svg",
          {
            className: "size-8 mb-3",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m15 9-6 6" }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m9 9 6 6" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm font-medium", children: "Generation Failed" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs mt-1 opacity-60 text-center max-w-[250px]", children: error })
      ] }),
      workflow && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h4", { className: "text-sm font-medium text-text-primary", children: workflow.name }),
          workflow.description && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-text-muted mt-1", children: workflow.description }),
          workflow.tags && workflow.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex gap-1 mt-2 flex-wrap", children: workflow.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
            return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    workflow && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "border-t border-border-subtle/50 p-4 space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            onClick: onExecute,
            className: "flex-1 h-8 rounded-md bg-green-700 hover:bg-green-600 text-white text-sm flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("polygon", { points: "5 3 19 12 5 21 5 3" })
                }
              ),
              "Execute"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            onClick: onEditInBuilder,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-sm hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m15 5 4 4" })
                  ]
                }
              ),
              "Edit in Builder"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            onClick: onRegenerate,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M3 3v5h5" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M16 16h5v5" })
                  ]
                }
              ),
              "Regenerate"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            onClick: onSave,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("polyline", { points: "17 21 17 13 7 13 7 21" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("polyline", { points: "7 3 7 8 15 8" })
                  ]
                }
              ),
              "Save to Library"
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
  const [isExpanded, setIsExpanded] = (0, import_react6.useState)(true);
  const colors = PHASE_COLORS2[phase] ?? PHASE_COLORS2["setup"];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: `rounded-lg border ${colors.border} ${colors.bg}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        onClick: () => setIsExpanded(!isExpanded),
        className: "flex items-center justify-between w-full px-3 py-2 cursor-pointer",
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "svg",
            {
              className: `w-3.5 h-3.5 transition-transform ${colors.text} ${isExpanded ? "rotate-90" : ""}`,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "m9 18 6-6-6-6" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "span",
            {
              className: `text-xs font-semibold uppercase tracking-wider ${colors.text}`,
              children: phase
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "span",
            {
              className: `text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`,
              children: steps.length
            }
          )
        ] })
      }
    ),
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "px-2 pb-2 space-y-1", children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/20",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(StepTypeIcon, { type: step.type }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "text-xs text-zinc-200 truncate", children: step.name }) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            "svg",
            {
              className: "w-3 h-3 text-zinc-600",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("polyline", { points: "22 4 12 14.01 9 11.01" })
              ]
            }
          )
        ]
      },
      step.id || i
    )) })
  ] });
}
function StepTypeIcon({ type }) {
  if (type === "command") {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("polyline", { points: "4 17 10 11 4 5" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("line", { x1: "12", x2: "20", y1: "19", y2: "19" })
        ]
      }
    );
  }
  if (type === "ui_bridge") {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("line", { x1: "8", x2: "16", y1: "21", y2: "21" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("line", { x1: "12", x2: "12", y1: "17", y2: "21" })
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "svg",
    {
      className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M2 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M20 14h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M15 13v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M9 13v2" })
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
  PhaseSectionConcrete,
  StepItemConcrete,
  WorkflowPreviewPanel
});
//# sourceMappingURL=index.cjs.map