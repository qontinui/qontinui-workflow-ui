import {
  useUIPrimitives
} from "../chunk-2RKBTL3R.js";
import {
  PHASE_COLORS
} from "../chunk-WTHARRTP.js";
import {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  WorkflowPreviewPanel
} from "../chunk-CDLZ5R4Z.js";

// src/components/PhaseSection.tsx
import { useState, useCallback } from "react";
import { PHASE_INFO } from "@qontinui/shared-types/workflow";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const phaseInfo = PHASE_INFO[phase];
  const colors = PHASE_COLORS[phase];
  const isEmpty = steps.length === 0;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(/* @__PURE__ */ new Set());
  const toggleSelect = useCallback((stepId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  }, []);
  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(/* @__PURE__ */ new Set());
  }, []);
  const handleBatchDelete = useCallback(() => {
    if (onBatchDelete && selectedIds.size > 0) {
      onBatchDelete(Array.from(selectedIds));
    }
    exitSelectionMode();
  }, [onBatchDelete, selectedIds, exitSelectionMode]);
  const ChevronIcon = ({ expanded }) => /* @__PURE__ */ jsx(
    "svg",
    {
      className: `w-4 h-4 ${colors.text}`,
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      children: expanded ? /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) : /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" })
    }
  );
  const PlusIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 5v14M5 12h14" }) });
  const TrashIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
  return /* @__PURE__ */ jsx(Collapsible, { open: isExpanded, onOpenChange: onToggle, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-tutorial-id": `${phase}-phase`,
      "data-phase": phase,
      className: `rounded-lg border transition-colors ${colors.border} ${colors.borderHover} ${hasSelectedStep ? colors.bg : ""}`,
      children: [
        /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: `w-full flex items-center justify-between p-3 rounded-t-lg ${colors.bgHeader} transition-colors`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 cursor-pointer", onClick: onToggle, children: [
            /* @__PURE__ */ jsx(ChevronIcon, { expanded: isExpanded }),
            /* @__PURE__ */ jsx("span", { className: `font-medium ${colors.text}`, children: phaseInfo.label }),
            /* @__PURE__ */ jsx("span", { className: `text-xs px-1.5 py-0.5 rounded ${colors.badge}`, children: steps.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsx("span", { className: `text-xs ${colors.textMuted} hidden sm:block`, children: phaseInfo.description }),
            headerActions,
            !isEmpty && onBatchDelete && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) setSelectedIds(/* @__PURE__ */ new Set());
                },
                className: `p-1 rounded transition-colors ${isSelectionMode ? "bg-red-500/20 text-red-400" : "text-zinc-400 hover:text-red-400 hover:bg-zinc-700"}`,
                title: isSelectionMode ? "Cancel selection" : "Select steps to delete",
                children: /* @__PURE__ */ jsx(TrashIcon, {})
              }
            )
          ] })
        ] }),
        !isExpanded && steps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-3 pb-2 text-xs text-zinc-500 truncate", children: [
          steps.slice(0, 3).map((s) => s.name).join(" \u2192 "),
          steps.length > 3 && ` +${steps.length - 3} more`
        ] }),
        /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxs("div", { className: "p-3 space-y-2", children: [
          isSelectionMode && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-md", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-red-400", children: [
              selectedIds.size,
              " selected"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              selectedIds.size > 0 && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleBatchDelete,
                  className: "flex items-center gap-1 px-3 py-1 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors",
                  children: "Delete"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: exitSelectionMode,
                  className: "px-3 py-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors",
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          steps.length > 0 ? renderStepList(steps, isSelectionMode, selectedIds, toggleSelect) : /* @__PURE__ */ jsxs("div", { className: `text-center py-4 ${colors.textMuted} text-sm`, children: [
            "No ",
            phase,
            " steps yet"
          ] }),
          !isSelectionMode && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => onAddStep(phase),
              className: `w-full flex items-center justify-center gap-2 p-2 rounded-md ${colors.button} transition-colors text-sm`,
              "data-ui-id": `workflow-builder-phase-${phase}-add-step-btn`,
              children: [
                /* @__PURE__ */ jsx(PlusIcon, {}),
                /* @__PURE__ */ jsxs("span", { children: [
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
import {
  getStepSubtitle,
  needsConfig,
  getStepValidationIssues,
  getStepIconData,
  getTestIconData
} from "@qontinui/workflow-utils";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
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
  const subtitle = getStepSubtitle(step);
  const issues = getStepValidationIssues(step);
  const hasErrors = issues.some((i) => i.severity === "error");
  const hasWarnings = issues.some((i) => i.severity === "warning");
  const showNeedsConfig = needsConfig(step);
  const validationTooltip = issues.map((i) => i.message).join("; ");
  const LockIcon = () => /* @__PURE__ */ jsxs2("svg", { className: "w-3 h-3 text-zinc-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsx2("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsx2("path", { d: "M7 11V7a5 5 0 0110 0v4" })
  ] });
  const TrashIcon = () => /* @__PURE__ */ jsx2("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
  const CopyIcon = () => /* @__PURE__ */ jsxs2("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsx2("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsx2("path", { d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" })
  ] });
  const AlertIcon = () => /* @__PURE__ */ jsxs2("svg", { className: "w-4 h-4 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
    /* @__PURE__ */ jsx2("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    /* @__PURE__ */ jsx2("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
  ] });
  return /* @__PURE__ */ jsxs2(
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
        !isSelectionMode && isSummaryStep && /* @__PURE__ */ jsx2("div", { className: "w-4 shrink-0" }),
        /* @__PURE__ */ jsxs2("div", { className: `relative shrink-0 p-1 rounded ${iconData.bgClass}`, children: [
          /* @__PURE__ */ jsx2(Icon, { className: `w-4 h-4 ${iconData.textClass}` }),
          (hasErrors || hasWarnings) && /* @__PURE__ */ jsx2(
            "span",
            {
              className: `absolute -top-1 -right-1 w-2 h-2 rounded-full ${hasErrors ? "bg-red-500" : "bg-amber-500"}`,
              title: validationTooltip
            }
          )
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx2("span", { className: "text-sm text-zinc-200 truncate", children: step.name }),
            isSummaryStep && /* @__PURE__ */ jsx2(LockIcon, {}),
            showNeedsConfig && !hasErrors && !hasWarnings && /* @__PURE__ */ jsx2("span", { title: "Needs configuration", children: /* @__PURE__ */ jsx2(AlertIcon, {}) })
          ] }),
          subtitle && /* @__PURE__ */ jsx2("p", { className: "text-xs text-zinc-500 truncate", children: subtitle })
        ] }),
        !isSummaryStep && !isSelectionMode && /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          onDuplicate && /* @__PURE__ */ jsx2(
            "button",
            {
              className: "p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors",
              onClick: (e) => {
                e.stopPropagation();
                onDuplicate();
              },
              title: "Duplicate step",
              children: /* @__PURE__ */ jsx2(CopyIcon, {})
            }
          ),
          /* @__PURE__ */ jsx2(
            "button",
            {
              className: "p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors",
              onClick: (e) => {
                e.stopPropagation();
                onDelete();
              },
              title: "Delete step",
              children: /* @__PURE__ */ jsx2(TrashIcon, {})
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
    return getTestIconData(testType);
  }
  return getStepIconData(step.type);
}
export {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  PhaseSectionConcrete,
  StepItemConcrete,
  WorkflowPreviewPanel
};
//# sourceMappingURL=index.js.map