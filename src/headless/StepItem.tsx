import type {
  UnifiedStep,
  WorkflowPhase,
} from "@qontinui/shared-types/workflow";

export interface StepItemRenderProps {
  step: UnifiedStep;
  phase: WorkflowPhase;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isSummaryStep: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export interface StepItemProps {
  step: UnifiedStep;
  phase: WorkflowPhase;
  isSelected: boolean;
  index: number;
  totalSteps: number;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children: (props: StepItemRenderProps) => React.ReactNode;
}

export function StepItem({
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
  children,
}: StepItemProps) {
  const isSummaryStep =
    step.type === "prompt" &&
    (step as { is_summary_step?: boolean }).is_summary_step === true;
  const canMoveUp = index > 0 && !isSummaryStep;
  const canMoveDown = index < totalSteps - 1 && !isSummaryStep;

  return (
    <>
      {children({
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
        onDuplicate,
      })}
    </>
  );
}
