import { useState } from "react";
import type {
  UnifiedWorkflow,
  UnifiedStep,
  WorkflowPhase,
} from "@qontinui/shared-types";

export interface WorkflowPreviewPanelProps {
  workflow: UnifiedWorkflow | null;
  isLoading: boolean;
  error?: string;
  onExecute: () => void;
  onEditInBuilder: () => void;
  onRegenerate: () => void;
  onSave: () => void;
  onClose: () => void;
}

const PHASE_COLORS: Record<
  string,
  { bg: string; border: string; text: string; badge: string }
> = {
  setup: {
    bg: "bg-blue-950/30",
    border: "border-blue-800/50",
    text: "text-blue-400",
    badge: "bg-blue-900/50 text-blue-300",
  },
  verification: {
    bg: "bg-green-950/30",
    border: "border-green-800/50",
    text: "text-green-400",
    badge: "bg-green-900/50 text-green-300",
  },
  agentic: {
    bg: "bg-amber-950/30",
    border: "border-amber-800/50",
    text: "text-amber-400",
    badge: "bg-amber-900/50 text-amber-300",
  },
  completion: {
    bg: "bg-purple-950/30",
    border: "border-purple-800/50",
    text: "text-purple-400",
    badge: "bg-purple-900/50 text-purple-300",
  },
};

export function WorkflowPreviewPanel({
  workflow,
  isLoading,
  error,
  onExecute,
  onEditInBuilder,
  onRegenerate,
  onSave,
  onClose,
}: WorkflowPreviewPanelProps) {
  return (
    <div className="flex flex-col h-full border-l border-border-subtle/50 bg-surface-canvas/95">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle/50">
        <h3 className="text-sm font-semibold text-text-primary">
          Generated Workflow
        </h3>
        <button
          onClick={onClose}
          className="h-6 w-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover"
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48 text-text-muted">
            <svg
              className="size-8 animate-spin mb-3 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="text-sm">Generating workflow...</p>
            <p className="text-xs mt-1 opacity-60">This may take a minute</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-48 text-red-400">
            <svg
              className="size-8 mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <p className="text-sm font-medium">Generation Failed</p>
            <p className="text-xs mt-1 opacity-60 text-center max-w-[250px]">
              {error}
            </p>
          </div>
        )}

        {workflow && !isLoading && (
          <div className="space-y-3">
            {/* Workflow name and description */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-primary">
                {workflow.name}
              </h4>
              {workflow.description && (
                <p className="text-xs text-text-muted mt-1">
                  {workflow.description}
                </p>
              )}
              {workflow.tags && workflow.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {workflow.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-border-subtle/50 px-1.5 py-0 text-[10px] text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Phases */}
            {(["setup", "verification", "agentic", "completion"] as const).map(
              (phase) => {
                const steps = getStepsForPhase(workflow, phase);
                if (steps.length === 0) return null;
                return (
                  <PreviewPhaseSection
                    key={phase}
                    phase={phase}
                    steps={steps}
                  />
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {workflow && !isLoading && (
        <div className="border-t border-border-subtle/50 p-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onExecute}
              className="flex-1 h-8 rounded-md bg-green-700 hover:bg-green-600 text-white text-sm flex items-center justify-center gap-1.5"
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Execute
            </button>
            <button
              onClick={onEditInBuilder}
              className="flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-sm hover:bg-surface-hover flex items-center justify-center gap-1.5"
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit in Builder
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRegenerate}
              className="flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5"
            >
              <svg
                className="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              Regenerate
            </button>
            <button
              onClick={onSave}
              title="Save workflow to library"
              aria-label="Save workflow to library"
              className="flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5"
            >
              <svg
                className="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewPhaseSection({
  phase,
  steps,
}: {
  phase: WorkflowPhase;
  steps: UnifiedStep[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS["setup"]!;

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-3 py-2 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-3.5 h-3.5 transition-transform ${colors.text} ${isExpanded ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}
          >
            {phase}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`}
          >
            {steps.length}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-2 pb-2 space-y-1">
          {steps.map((rawStep, i) => {
            // UnifiedStep's fallback arm collapses fields to `unknown`; narrow
            // to the common canonical shape used in preview rendering.
            const step = rawStep as {
              id?: string;
              name?: string;
              type: string;
            };
            return (
            <div
              key={step.id || i}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/20"
            >
              <StepTypeIcon type={step.type} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-200 truncate">
                  {step.name}
                </div>
              </div>
              <svg
                className="w-3 h-3 text-zinc-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StepTypeIcon({ type }: { type: string }) {
  if (type === "command") {
    return (
      <svg
        className="w-3.5 h-3.5 text-zinc-400 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" x2="20" y1="19" y2="19" />
      </svg>
    );
  }
  if (type === "ui_bridge") {
    return (
      <svg
        className="w-3.5 h-3.5 text-zinc-400 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    );
  }
  // prompt / default
  return (
    <svg
      className="w-3.5 h-3.5 text-zinc-400 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function getStepsForPhase(
  workflow: UnifiedWorkflow,
  phase: WorkflowPhase,
): UnifiedStep[] {
  switch (phase) {
    case "setup":
      return (workflow.setupSteps as UnifiedStep[]) || [];
    case "verification":
      return (workflow.verificationSteps as UnifiedStep[]) || [];
    case "agentic":
      return (workflow.agenticSteps as UnifiedStep[]) || [];
    case "completion":
      return (workflow.completionSteps as UnifiedStep[]) || [];
    default:
      return [];
  }
}
