import type {
  WorkflowPhase,
  UnifiedStep,
} from "@qontinui/shared-types/workflow";
import { PHASE_INFO } from "@qontinui/shared-types/workflow";

export interface PhaseSectionRenderProps {
  phase: WorkflowPhase;
  label: string;
  description: string;
  color: string;
  isExpanded: boolean;
  stepCount: number;
  steps: UnifiedStep[];
  onToggle: () => void;
  onAddStep: () => void;
}

export interface PhaseSectionProps {
  phase: WorkflowPhase;
  steps: UnifiedStep[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddStep: () => void;
  children: (props: PhaseSectionRenderProps) => React.ReactNode;
}

export function PhaseSection({
  phase,
  steps,
  isExpanded,
  onToggle,
  onAddStep,
  children,
}: PhaseSectionProps) {
  const info = PHASE_INFO[phase];
  return (
    <>
      {children({
        phase,
        label: info.label,
        description: info.description,
        color: info.color,
        isExpanded,
        stepCount: steps.length,
        steps,
        onToggle,
        onAddStep,
      })}
    </>
  );
}
