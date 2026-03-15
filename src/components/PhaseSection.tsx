/**
 * Concrete PhaseSection Component
 *
 * Shared Tailwind component for a collapsible workflow phase section.
 * Uses UIProvider's Collapsible for expand/collapse behavior.
 *
 * Accepts render slots for app-specific behavior:
 * - renderStepList: web wraps with DndContext, runner uses plain div
 * - headerActions: app-specific header buttons
 */

import React, { useState, useCallback } from "react";
import type { WorkflowPhase, UnifiedStep } from "@qontinui/shared-types/workflow";
import { PHASE_INFO } from "@qontinui/shared-types/workflow";
import { PHASE_COLORS } from "../config/phase-colors";
import { useUIPrimitives } from "../UIProvider";

// =============================================================================
// Types
// =============================================================================

export interface PhaseSectionConcreteProps {
  phase: WorkflowPhase;
  steps: UnifiedStep[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddStep: (phase: WorkflowPhase) => void;

  /** Whether any step in this phase is currently selected */
  hasSelectedStep?: boolean;

  /** Render the step list — app provides DnD wrapping or plain div */
  renderStepList: (
    steps: UnifiedStep[],
    isSelectionMode: boolean,
    selectedIds: Set<string>,
    onToggleSelect: (id: string) => void,
  ) => React.ReactNode;

  /** Optional actions for the phase header (e.g., quick-add buttons) */
  headerActions?: React.ReactNode;

  /** Called when batch delete is confirmed */
  onBatchDelete?: (stepIds: string[]) => void;
}

// =============================================================================
// Inline SVG Icons (module-scoped to avoid re-creation each render)
// =============================================================================

const ChevronIcon = ({ expanded, colorClass }: { expanded: boolean; colorClass: string }) => (
  <svg
    className={`w-4 h-4 ${colorClass}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    {expanded ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    )}
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

const PhaseTrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// =============================================================================
// Component
// =============================================================================

export function PhaseSectionConcrete({
  phase,
  steps,
  isExpanded,
  onToggle,
  onAddStep,
  hasSelectedStep = false,
  renderStepList,
  headerActions,
  onBatchDelete,
}: PhaseSectionConcreteProps) {
  const { Collapsible, CollapsibleTrigger, CollapsibleContent } = useUIPrimitives();
  const phaseInfo = PHASE_INFO[phase];
  const colors = PHASE_COLORS[phase];
  const isEmpty = steps.length === 0;

  // Batch selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((stepId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleBatchDelete = useCallback(() => {
    if (onBatchDelete && selectedIds.size > 0) {
      onBatchDelete(Array.from(selectedIds));
    }
    exitSelectionMode();
  }, [onBatchDelete, selectedIds, exitSelectionMode]);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div
        data-tutorial-id={`${phase}-phase`}
        data-phase={phase}
        className={`rounded-lg border transition-colors ${colors.border} ${colors.borderHover} ${
          hasSelectedStep ? colors.bg : ""
        }`}
      >
        {/* Phase Header */}
        <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-t-lg ${colors.bgHeader} transition-colors`}>
          <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={onToggle}>
            <ChevronIcon expanded={isExpanded} colorClass={colors.text} />
            <span className={`font-medium ${colors.text}`}>{phaseInfo.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${colors.badge}`}>
              {steps.length}
            </span>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className={`text-xs ${colors.textMuted} hidden sm:block`}>
              {phaseInfo.description}
            </span>
            {headerActions}
            {!isEmpty && onBatchDelete && (
              <button
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) setSelectedIds(new Set());
                }}
                className={`p-1 rounded transition-colors ${
                  isSelectionMode
                    ? "bg-red-500/20 text-red-400"
                    : "text-zinc-400 hover:text-red-400 hover:bg-zinc-700"
                }`}
                title={isSelectionMode ? "Cancel selection" : "Select steps to delete"}
              >
                <PhaseTrashIcon />
              </button>
            )}
          </div>
        </CollapsibleTrigger>

        {/* Collapsed Summary */}
        {!isExpanded && steps.length > 0 && (
          <div className="px-3 pb-2 text-xs text-zinc-500 truncate">
            {steps
              .slice(0, 3)
              .map((s) => s.name)
              .join(" → ")}
            {steps.length > 3 && ` +${steps.length - 3} more`}
          </div>
        )}

        {/* Phase Content */}
        <CollapsibleContent>
          <div className="p-3 space-y-2">
            {/* Selection Mode Header */}
            {isSelectionMode && (
              <div className="flex items-center justify-between px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-md">
                <span className="text-sm text-red-400">{selectedIds.size} selected</span>
                <div className="flex items-center gap-2">
                  {selectedIds.size > 0 && (
                    <button
                      onClick={handleBatchDelete}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={exitSelectionMode}
                    className="px-3 py-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Steps List */}
            {steps.length > 0 ? (
              renderStepList(steps, isSelectionMode, selectedIds, toggleSelect)
            ) : (
              <div className={`text-center py-4 ${colors.textMuted} text-sm`}>
                No {phase} steps yet
              </div>
            )}

            {/* Add Step Button */}
            {!isSelectionMode && (
              <button
                onClick={() => onAddStep(phase)}
                className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-md border border-dashed ${colors.border} ${colors.text} opacity-60 hover:opacity-100 transition-all text-xs`}
                data-testid={`workflow-builder-phase-${phase}-add-step-btn`}
              >
                <PlusIcon />
                <span>Add Step</span>
              </button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
