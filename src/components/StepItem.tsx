/**
 * Concrete StepItem Component
 *
 * Shared Tailwind component for a single workflow step row.
 * Uses step icon data from workflow-utils and validation from workflow-utils.
 *
 * Accepts render slots for app-specific behavior:
 * - reorderSlot: web provides drag handle, runner provides move buttons
 * - selectionCheckbox: runner provides batch-select checkbox
 */

import React from "react";
import type { UnifiedStep } from "@qontinui/shared-types/workflow";
import {
  getStepSubtitle,
  needsConfig,
  getStepValidationIssues,
  getStepIconData,
  getTestIconData,
  type StepIconData,
} from "@qontinui/workflow-utils";

// =============================================================================
// Types
// =============================================================================

export interface StepItemConcreteProps {
  step: UnifiedStep;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;

  /** Whether the parent phase is in batch selection mode */
  isSelectionMode?: boolean;
  /** Whether this step is selected for batch deletion */
  isSelectedForDelete?: boolean;

  /** Render slot: drag handle (web) or move buttons (runner) */
  reorderSlot?: React.ReactNode;

  /** Render slot: selection checkbox for batch mode */
  selectionCheckbox?: React.ReactNode;

  /** Icon component resolver: maps iconId to a React component */
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

// =============================================================================
// Inline SVG Icons (module-scoped to avoid re-creation each render)
// =============================================================================

const LockIcon = () => (
  <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// =============================================================================
// Component
// =============================================================================

export function StepItemConcrete({
  step,
  isSelected,
  onClick,
  onDelete,
  onDuplicate,
  isSelectionMode = false,
  isSelectedForDelete = false,
  reorderSlot,
  selectionCheckbox,
  resolveIcon,
}: StepItemConcreteProps) {
  const isSummaryStep =
    step.type === "prompt" &&
    (step as { is_summary_step?: boolean }).is_summary_step === true;

  // Resolve icon data
  const iconData = getStepItemIconData(step);
  const Icon = resolveIcon(iconData.iconId);

  // Subtitle
  const subtitle = getStepSubtitle(step);

  // Validation
  const issues = getStepValidationIssues(step);
  const hasErrors = issues.some((i) => i.severity === "error");
  const hasWarnings = issues.some((i) => i.severity === "warning");
  const showNeedsConfig = needsConfig(step);
  const validationTooltip = issues.map((i) => i.message).join("; ");

  return (
    <div
      data-step-type={step.type}
      className={`
        group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all
        ${isSelectionMode && isSelectedForDelete
          ? "border border-red-500/50 status-error"
          : isSelected
            ? "bg-zinc-700/80 ring-1 ring-zinc-500"
            : "hover:bg-zinc-800/60"
        }
      `}
      onClick={onClick}
    >
      {/* Selection checkbox (batch mode) */}
      {isSelectionMode && selectionCheckbox}

      {/* Reorder slot: drag handle or move buttons */}
      {!isSelectionMode && !isSummaryStep && reorderSlot}
      {!isSelectionMode && isSummaryStep && <div className="w-4 shrink-0" />}

      {/* Step Icon */}
      <div className={`relative shrink-0 p-1 rounded ${iconData.bgClass}`}>
        <Icon className={`w-4 h-4 ${iconData.textClass}`} />
        {(hasErrors || hasWarnings) && (
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              hasErrors ? "bg-red-500" : "bg-amber-500"
            }`}
            title={validationTooltip}
          />
        )}
      </div>

      {/* Step Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-200 truncate">{step.name}</span>
          {isSummaryStep && <LockIcon />}
          {showNeedsConfig && !hasErrors && !hasWarnings && (
            <span title="Needs configuration"><AlertIcon /></span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-500 truncate">{subtitle}</p>
        )}
      </div>

      {/* Action Buttons */}
      {!isSummaryStep && !isSelectionMode && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {onDuplicate && (
            <button
              className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicate step"
            >
              <CopyIcon />
            </button>
          )}
          <button
            className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete step"
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Get the icon data for a step, handling test sub-types.
 */
function getStepItemIconData(step: UnifiedStep): StepIconData {
  if (step.type === "command" && (step.test_type || step.test_id)) {
    const testType = step.test_type || "custom_command";
    return getTestIconData(testType);
  }
  return getStepIconData(step.type);
}
