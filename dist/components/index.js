import {
  SkillCatalog,
  useUIPrimitives
} from "../chunk-7BR6KOI7.js";
import {
  PHASE_COLORS
} from "../chunk-SK7ZPJYY.js";
import {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  WorkflowPreviewPanel
} from "../chunk-IICFUDT5.js";

// src/components/PhaseSection.tsx
import { useState, useCallback } from "react";
import { PHASE_INFO } from "@qontinui/shared-types/workflow";
import { jsx, jsxs } from "react/jsx-runtime";
var ChevronIcon = ({ expanded, colorClass }) => /* @__PURE__ */ jsx(
  "svg",
  {
    className: `w-4 h-4 ${colorClass}`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    children: expanded ? /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) : /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" })
  }
);
var PlusIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 5v14M5 12h14" }) });
var PhaseTrashIcon = () => /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
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
  return /* @__PURE__ */ jsx(Collapsible, { open: isExpanded, onOpenChange: onToggle, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-tutorial-id": `${phase}-phase`,
      "data-phase": phase,
      className: `rounded-lg border transition-colors ${colors.border} ${colors.borderHover} ${hasSelectedStep ? colors.bg : ""}`,
      children: [
        /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: `w-full flex items-center justify-between p-3 rounded-t-lg ${colors.bgHeader} transition-colors`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 cursor-pointer", onClick: onToggle, children: [
            /* @__PURE__ */ jsx(ChevronIcon, { expanded: isExpanded, colorClass: colors.text }),
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
                children: /* @__PURE__ */ jsx(PhaseTrashIcon, {})
              }
            )
          ] })
        ] }),
        !isExpanded && steps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-3 pb-2 text-xs text-zinc-500 truncate", children: [
          steps.slice(0, 3).map((s) => s.name).join(" \u2192 "),
          steps.length > 3 && ` +${steps.length - 3} more`
        ] }),
        /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxs("div", { className: "p-3 space-y-2", children: [
          isSelectionMode && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-2 status-error border border-red-500/30 rounded-md", children: [
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
              className: `w-full flex items-center justify-center gap-2 py-1.5 rounded-md border border-dashed ${colors.border} ${colors.text} opacity-60 hover:opacity-100 transition-all text-xs`,
              "data-testid": `workflow-builder-phase-${phase}-add-step-btn`,
              children: [
                /* @__PURE__ */ jsx(PlusIcon, {}),
                /* @__PURE__ */ jsx("span", { children: "Add Step" })
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
var LockIcon = () => /* @__PURE__ */ jsxs2("svg", { className: "w-3 h-3 text-zinc-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ jsx2("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
  /* @__PURE__ */ jsx2("path", { d: "M7 11V7a5 5 0 0110 0v4" })
] });
var TrashIcon = () => /* @__PURE__ */ jsx2("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) });
var CopyIcon = () => /* @__PURE__ */ jsxs2("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ jsx2("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ jsx2("path", { d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" })
] });
var AlertIcon = () => /* @__PURE__ */ jsxs2("svg", { className: "w-4 h-4 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ jsx2("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsx2("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
  /* @__PURE__ */ jsx2("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
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
  const subtitle = getStepSubtitle(step);
  const issues = getStepValidationIssues(step);
  const hasErrors = issues.some((i) => i.severity === "error");
  const hasWarnings = issues.some((i) => i.severity === "warning");
  const showNeedsConfig = needsConfig(step);
  const validationTooltip = issues.map((i) => i.message).join("; ");
  return /* @__PURE__ */ jsxs2(
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
function getStepItemIconData(rawStep) {
  const step = rawStep;
  if (step.type === "command" && (step.test_type || step.test_id)) {
    const testType = step.test_type || "custom_command";
    return getTestIconData(testType);
  }
  return getStepIconData(step.type);
}

// src/components/SkillCatalog.tsx
import { getSkillCategoryIconData } from "@qontinui/workflow-utils";

// src/components/SkillParamForm.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function SkillParamForm({
  parameters,
  values,
  onChange,
  errors
}) {
  if (parameters.length === 0) {
    return /* @__PURE__ */ jsx3("p", { className: "text-sm text-zinc-500 italic py-2", children: "No parameters needed \u2014 this skill is ready to use." });
  }
  return /* @__PURE__ */ jsxs3("div", { className: "space-y-3", children: [
    parameters.map((param) => {
      if (param.depends_on) {
        const depValue = values[param.depends_on.param];
        if (depValue !== param.depends_on.value) {
          return null;
        }
      }
      return /* @__PURE__ */ jsx3(
        SkillParamField,
        {
          param,
          value: values[param.name],
          onChange: (value) => onChange(param.name, value)
        },
        param.name
      );
    }),
    errors && errors.length > 0 && /* @__PURE__ */ jsx3("div", { className: "space-y-1", children: errors.map((err, i) => /* @__PURE__ */ jsx3("p", { className: "text-xs text-red-400", children: err }, i)) })
  ] });
}
function SkillParamField({ param, value, onChange }) {
  const inputClasses = "w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-200 [&>option]:text-black [&>option]:bg-white placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500";
  return /* @__PURE__ */ jsxs3("div", { children: [
    /* @__PURE__ */ jsxs3("label", { className: "flex items-center gap-1 text-sm text-zinc-300 mb-1", children: [
      param.label,
      param.required && /* @__PURE__ */ jsx3("span", { className: "text-red-400", children: "*" })
    ] }),
    param.description && /* @__PURE__ */ jsx3("p", { className: "text-xs text-zinc-500 mb-1.5", children: param.description }),
    param.type === "string" && /* @__PURE__ */ jsxs3(Fragment, { children: [
      /* @__PURE__ */ jsx3(
        "input",
        {
          type: "text",
          className: inputClasses,
          value: value ?? "",
          onChange: (e) => onChange(e.target.value),
          placeholder: param.placeholder
        }
      ),
      param.pattern && /* @__PURE__ */ jsxs3("p", { className: "text-[11px] text-zinc-600 mt-1", children: [
        "Pattern: ",
        /* @__PURE__ */ jsx3("code", { className: "text-zinc-500", children: param.pattern })
      ] })
    ] }),
    param.type === "number" && /* @__PURE__ */ jsxs3(Fragment, { children: [
      /* @__PURE__ */ jsx3(
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
      (param.min != null || param.max != null) && /* @__PURE__ */ jsx3("p", { className: "text-[11px] text-zinc-600 mt-1", children: param.min != null && param.max != null ? `Range: ${param.min} \u2013 ${param.max}` : param.min != null ? `Min: ${param.min}` : `Max: ${param.max}` })
    ] }),
    param.type === "boolean" && /* @__PURE__ */ jsx3(
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
        children: /* @__PURE__ */ jsx3(
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
    param.type === "select" && param.options && /* @__PURE__ */ jsxs3(
      "select",
      {
        className: inputClasses,
        style: { colorScheme: "dark" },
        value: value ?? "",
        onChange: (e) => onChange(e.target.value),
        children: [
          /* @__PURE__ */ jsx3("option", { value: "", children: "Select..." }),
          param.options.map((opt) => /* @__PURE__ */ jsx3("option", { value: opt.value, children: opt.label }, opt.value))
        ]
      }
    )
  ] });
}

// src/components/SkillCatalog.tsx
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
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
var SearchIcon = ({ className }) => /* @__PURE__ */ jsxs4("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ jsx4("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", d: "m21 21-4.35-4.35" })
] });
var ArrowLeftIcon = ({ className }) => /* @__PURE__ */ jsx4("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 12H5m7-7-7 7 7 7" }) });
function SkillCatalogConcrete({
  phase,
  isOpen,
  onAddSteps,
  onClose,
  onSkillUsed,
  resolveIcon
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx4(
    SkillCatalog,
    {
      phase,
      onAddSteps,
      onClose,
      onSkillUsed,
      children: (props) => /* @__PURE__ */ jsx4("div", { className: "flex flex-col h-full max-h-[480px]", children: props.mode === "browse" ? /* @__PURE__ */ jsx4(
        BrowseView,
        {
          ...props,
          phase,
          resolveIcon
        }
      ) : /* @__PURE__ */ jsx4(
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
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsx4("div", { className: "px-3 pt-3 pb-2", children: /* @__PURE__ */ jsxs4("div", { className: "relative", children: [
      /* @__PURE__ */ jsx4(SearchIcon, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" }),
      /* @__PURE__ */ jsx4(
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
    /* @__PURE__ */ jsxs4("div", { className: "px-3 pb-2 flex gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ jsx4(
        CategoryChip,
        {
          label: "All",
          isActive: selectedCategory === null,
          onClick: () => setSelectedCategory(null)
        }
      ),
      categories.map((cat) => /* @__PURE__ */ jsx4(
        CategoryChip,
        {
          label: getCategoryLabel(cat),
          isActive: selectedCategory === cat,
          onClick: () => setSelectedCategory(selectedCategory === cat ? null : cat)
        },
        cat
      ))
    ] }),
    hasNonBuiltinSkills && /* @__PURE__ */ jsxs4("div", { className: "px-3 pb-2 flex gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ jsx4(
        CategoryChip,
        {
          label: "All Sources",
          isActive: selectedSource === null,
          onClick: () => setSelectedSource(null)
        }
      ),
      /* @__PURE__ */ jsx4(
        CategoryChip,
        {
          label: "Built-in",
          isActive: selectedSource === "builtin",
          onClick: () => setSelectedSource(selectedSource === "builtin" ? null : "builtin")
        }
      ),
      /* @__PURE__ */ jsx4(
        CategoryChip,
        {
          label: "Custom",
          isActive: selectedSource === "user",
          onClick: () => setSelectedSource(selectedSource === "user" ? null : "user")
        }
      ),
      /* @__PURE__ */ jsx4(
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
    /* @__PURE__ */ jsx4("div", { className: "flex-1 overflow-y-auto px-3 pb-2 space-y-1", children: filteredSkills.length === 0 ? /* @__PURE__ */ jsx4("p", { className: "text-sm text-zinc-500 py-4 text-center", children: "No skills match your search." }) : filteredSkills.map((skill) => /* @__PURE__ */ jsx4(
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
  const iconData = getSkillCategoryIconData(selectedSkill.category);
  const Icon = resolveIcon(selectedSkill.icon);
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsxs4("div", { className: "px-3 pt-3 pb-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx4(
        "button",
        {
          className: "p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors",
          onClick: onBack,
          title: "Back to catalog",
          children: /* @__PURE__ */ jsx4(ArrowLeftIcon, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx4("div", { className: `p-1.5 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ jsx4(Icon, { className: `w-4 h-4 ${iconData.textClass}` }) }),
      /* @__PURE__ */ jsxs4("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx4("h3", { className: "text-sm font-medium text-zinc-200 truncate", children: selectedSkill.name }),
        /* @__PURE__ */ jsx4("p", { className: "text-xs text-zinc-500 truncate", children: selectedSkill.description })
      ] })
    ] }),
    /* @__PURE__ */ jsx4("div", { className: "flex-1 overflow-y-auto px-3 pb-2", children: /* @__PURE__ */ jsx4(
      SkillParamForm,
      {
        parameters: selectedSkill.parameters,
        values: paramValues,
        onChange: setParamValue,
        errors: validationErrors
      }
    ) }),
    /* @__PURE__ */ jsxs4("div", { className: "px-3 py-2 border-t border-zinc-800 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx4(
        "button",
        {
          className: "px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded",
          onClick: onBack,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx4(
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
  return /* @__PURE__ */ jsx4(
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
  const iconData = getSkillCategoryIconData(skill.category);
  const Icon = resolveIcon(skill.icon);
  return /* @__PURE__ */ jsxs4(
    "button",
    {
      className: "w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-zinc-800/80 transition-colors text-left group",
      onClick,
      children: [
        /* @__PURE__ */ jsx4("div", { className: `shrink-0 p-1.5 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ jsx4(Icon, { className: `w-4 h-4 ${iconData.textClass}` }) }),
        /* @__PURE__ */ jsxs4("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx4("span", { className: "text-sm text-zinc-200 group-hover:text-zinc-100", children: skill.name }),
            skill.source !== "builtin" && /* @__PURE__ */ jsx4("span", { className: `ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${skill.source === "community" ? "bg-purple-900/30 text-purple-400" : "bg-blue-900/30 text-blue-400"}`, children: skill.source === "community" ? "Community" : "Custom" }),
            skill.forked_from && /* @__PURE__ */ jsx4("span", { className: "ml-1.5 text-[10px] text-zinc-600", title: `Forked from ${skill.forked_from}`, children: "(fork)" }),
            skill.version && skill.version !== "1.0.0" && /* @__PURE__ */ jsxs4("span", { className: "ml-1.5 px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-full", children: [
              "v",
              skill.version
            ] }),
            skill.approval_status && /* @__PURE__ */ jsx4("span", { className: `ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${skill.approval_status === "approved" ? "bg-green-900/30 text-green-400" : skill.approval_status === "rejected" ? "bg-red-900/30 text-red-400" : "bg-yellow-900/30 text-yellow-400"}`, children: skill.approval_status === "approved" ? "Approved" : skill.approval_status === "rejected" ? "Rejected" : "Pending" })
          ] }),
          /* @__PURE__ */ jsxs4("p", { className: "text-xs text-zinc-500 truncate", children: [
            skill.description,
            skill.author && /* @__PURE__ */ jsxs4("span", { className: "ml-1 text-zinc-600", children: [
              "\u2014 by ",
              skill.author.name
            ] })
          ] })
        ] }),
        skill.tags.length > 0 && /* @__PURE__ */ jsx4("div", { className: "hidden sm:flex gap-1 shrink-0", children: skill.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsx4(
          "span",
          {
            className: "px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded",
            children: tag
          },
          tag
        )) }),
        skill.usage_count != null && skill.usage_count > 0 && /* @__PURE__ */ jsxs4("span", { className: "shrink-0 text-[10px] text-zinc-600", title: "Times used", children: [
          skill.usage_count,
          "x"
        ] })
      ]
    }
  );
}

// src/components/CompositionSkillBuilder.tsx
import { useState as useState2, useCallback as useCallback2, useMemo } from "react";
import {
  getAllSkills,
  getSkill,
  getSkillCategoryIconData as getSkillCategoryIconData2
} from "@qontinui/workflow-utils";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var ChevronUpIcon = ({ className }) => /* @__PURE__ */ jsx5("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m5 15 7-7 7 7" }) });
var ChevronDownIcon = ({ className }) => /* @__PURE__ */ jsx5("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m19 9-7 7-7-7" }) });
var XMarkIcon = ({ className }) => /* @__PURE__ */ jsx5("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" }) });
var SearchIcon2 = ({ className }) => /* @__PURE__ */ jsxs5("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
  /* @__PURE__ */ jsx5("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", d: "m21 21-4.35-4.35" })
] });
var ChevronRightIcon = ({ className }) => /* @__PURE__ */ jsx5("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m9 5 7 7-7 7" }) });
function resolveRef(ref) {
  const skill = getSkill(ref.skill_id);
  return {
    ...ref,
    _skill: skill
  };
}
function CompositionSkillBuilder({
  initialRefs = [],
  onSave,
  onCancel,
  resolveIcon
}) {
  const [refs, setRefs] = useState2(
    () => initialRefs.map(resolveRef)
  );
  const [showPicker, setShowPicker] = useState2(false);
  const [expandedIndex, setExpandedIndex] = useState2(null);
  const handleAddRef = useCallback2((skill) => {
    const newRef = {
      skill_id: skill.id,
      parameter_overrides: {},
      _skill: skill
    };
    setRefs((prev) => [...prev, newRef]);
    setShowPicker(false);
  }, []);
  const handleRemoveRef = useCallback2((index) => {
    setRefs((prev) => prev.filter((_, i) => i !== index));
    setExpandedIndex((prev) => {
      if (prev === index) return null;
      if (prev !== null && prev > index) return prev - 1;
      return prev;
    });
  }, []);
  const handleMoveUp = useCallback2((index) => {
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
  const handleMoveDown = useCallback2((index) => {
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
  const handleToggleExpand = useCallback2((index) => {
    setExpandedIndex((prev) => prev === index ? null : index);
  }, []);
  const handleParamOverrideChange = useCallback2(
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
  const handleSave = useCallback2(() => {
    const cleanRefs = refs.map(({ _skill, ...rest }) => {
      const clean = { skill_id: rest.skill_id };
      if (rest.parameter_overrides && Object.keys(rest.parameter_overrides).length > 0) {
        clean.parameter_overrides = rest.parameter_overrides;
      }
      return clean;
    });
    onSave(cleanRefs);
  }, [refs, onSave]);
  return /* @__PURE__ */ jsxs5("div", { className: "flex flex-col h-full max-h-[500px]", children: [
    /* @__PURE__ */ jsxs5("div", { className: "px-4 py-3 border-b border-zinc-800", children: [
      /* @__PURE__ */ jsx5("h3", { className: "text-sm font-medium text-zinc-200", children: "Composition Skill Builder" }),
      /* @__PURE__ */ jsx5("p", { className: "text-xs text-zinc-500 mt-0.5", children: "Add skills to compose into a single skill" })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "flex-1 overflow-y-auto px-4 py-2 space-y-2", children: refs.length === 0 ? /* @__PURE__ */ jsx5("p", { className: "text-sm text-zinc-500 py-8 text-center", children: 'No skills added yet. Click "Add Skill" below.' }) : refs.map((ref, index) => /* @__PURE__ */ jsx5(
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
      `${ref.skill_id}-${index}`
    )) }),
    /* @__PURE__ */ jsx5("div", { className: "px-4 py-2 border-t border-zinc-800", children: showPicker ? /* @__PURE__ */ jsx5(
      MiniSkillPicker,
      {
        existingRefIds: refs.map((r) => r.skill_id),
        onSelect: handleAddRef,
        onCancel: () => setShowPicker(false),
        resolveIcon
      }
    ) : /* @__PURE__ */ jsx5(
      "button",
      {
        onClick: () => setShowPicker(true),
        className: "w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-700 rounded hover:border-zinc-500 transition-colors",
        children: "+ Add Skill"
      }
    ) }),
    /* @__PURE__ */ jsxs5("div", { className: "px-4 py-3 border-t border-zinc-800 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: onCancel,
          className: "px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxs5(
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
  const iconData = skill ? getSkillCategoryIconData2(skill.category) : null;
  const Icon = skill ? resolveIcon(skill.icon) : null;
  return /* @__PURE__ */ jsxs5("div", { className: "border border-zinc-700 rounded-md overflow-hidden", children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 px-3 py-2 bg-zinc-800/50", children: [
      /* @__PURE__ */ jsx5("span", { className: "text-xs text-zinc-500 font-mono w-5 text-center shrink-0", children: index + 1 }),
      Icon && iconData && /* @__PURE__ */ jsx5("div", { className: `shrink-0 p-1 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ jsx5(Icon, { className: `w-3.5 h-3.5 ${iconData.textClass}` }) }),
      /* @__PURE__ */ jsxs5("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-sm text-zinc-200 truncate block", children: skill?.name ?? ref_.skill_id }),
        !skill && /* @__PURE__ */ jsx5("span", { className: "text-xs text-red-400", children: "Unknown skill" })
      ] }),
      overrideCount > 0 && /* @__PURE__ */ jsxs5("span", { className: "shrink-0 px-1.5 py-0.5 text-[10px] bg-blue-900/30 text-blue-400 rounded-full", children: [
        overrideCount,
        " override",
        overrideCount !== 1 ? "s" : ""
      ] }),
      hasParams && /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: onToggleExpand,
          className: "shrink-0 p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors",
          title: isExpanded ? "Collapse parameters" : "Configure parameter overrides",
          children: /* @__PURE__ */ jsx5(
            ChevronRightIcon,
            {
              className: `w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs5("div", { className: "shrink-0 flex flex-col", children: [
        /* @__PURE__ */ jsx5(
          "button",
          {
            onClick: onMoveUp,
            disabled: index === 0,
            className: "p-0.5 text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors",
            title: "Move up",
            children: /* @__PURE__ */ jsx5(ChevronUpIcon, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsx5(
          "button",
          {
            onClick: onMoveDown,
            disabled: index === total - 1,
            className: "p-0.5 text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors",
            title: "Move down",
            children: /* @__PURE__ */ jsx5(ChevronDownIcon, { className: "w-3 h-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: onRemove,
          className: "shrink-0 p-1 rounded hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors",
          title: "Remove skill",
          children: /* @__PURE__ */ jsx5(XMarkIcon, { className: "w-3.5 h-3.5" })
        }
      )
    ] }),
    isExpanded && skill && /* @__PURE__ */ jsxs5("div", { className: "px-3 py-2 border-t border-zinc-700/50 bg-zinc-900/30", children: [
      /* @__PURE__ */ jsx5("p", { className: "text-xs text-zinc-500 mb-2", children: "Parameter overrides (leave empty to use defaults)" }),
      /* @__PURE__ */ jsx5(
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
  const [search, setSearch] = useState2("");
  const availableSkills = useMemo(() => {
    const all = getAllSkills();
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
  return /* @__PURE__ */ jsxs5("div", { className: "border border-zinc-700 rounded-md overflow-hidden", children: [
    /* @__PURE__ */ jsxs5("div", { className: "relative px-2 py-2", children: [
      /* @__PURE__ */ jsx5(SearchIcon2, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" }),
      /* @__PURE__ */ jsx5(
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
    /* @__PURE__ */ jsx5("div", { className: "max-h-[200px] overflow-y-auto", children: availableSkills.length === 0 ? /* @__PURE__ */ jsx5("p", { className: "text-xs text-zinc-500 py-4 text-center", children: "No matching skills found." }) : availableSkills.map((skill) => {
      const iconData = getSkillCategoryIconData2(skill.category);
      const Icon = resolveIcon(skill.icon);
      const alreadyAdded = existingRefIds.includes(skill.id);
      return /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: () => onSelect(skill),
          className: "w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800/80 transition-colors text-left",
          children: [
            /* @__PURE__ */ jsx5("div", { className: `shrink-0 p-1 rounded ${iconData.bgClass}`, children: /* @__PURE__ */ jsx5(Icon, { className: `w-3.5 h-3.5 ${iconData.textClass}` }) }),
            /* @__PURE__ */ jsxs5("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-sm text-zinc-200 truncate block", children: skill.name }),
              /* @__PURE__ */ jsx5("span", { className: "text-xs text-zinc-500 truncate block", children: skill.description })
            ] }),
            alreadyAdded && /* @__PURE__ */ jsx5("span", { className: "shrink-0 text-[10px] text-zinc-600", children: "added" })
          ]
        },
        skill.id
      );
    }) }),
    /* @__PURE__ */ jsx5("div", { className: "px-2 py-1.5 border-t border-zinc-700/50 flex justify-end", children: /* @__PURE__ */ jsx5(
      "button",
      {
        onClick: onCancel,
        className: "px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors",
        children: "Cancel"
      }
    ) })
  ] });
}
export {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  CompositionSkillBuilder,
  PhaseSectionConcrete,
  SkillCatalogConcrete,
  SkillParamForm,
  StepItemConcrete,
  WorkflowPreviewPanel
};
//# sourceMappingURL=index.js.map