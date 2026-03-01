import type {
  WorkflowPhase,
  StepTypeInfo,
} from "@qontinui/shared-types/workflow";
import { STEP_TYPES } from "@qontinui/shared-types/workflow";

export interface AddStepDropdownRenderProps {
  isOpen: boolean;
  phase: WorkflowPhase;
  stepTypes: StepTypeInfo[];
  onSelect: (stepType: StepTypeInfo) => void;
  onClose: () => void;
}

export interface AddStepDropdownProps {
  isOpen: boolean;
  phase: WorkflowPhase;
  onSelect: (stepType: StepTypeInfo) => void;
  onClose: () => void;
  customStepTypes?: Record<WorkflowPhase, StepTypeInfo[]>;
  children: (props: AddStepDropdownRenderProps) => React.ReactNode;
}

export function AddStepDropdown({
  isOpen,
  phase,
  onSelect,
  onClose,
  customStepTypes,
  children,
}: AddStepDropdownProps) {
  const stepTypes = (customStepTypes ?? STEP_TYPES)[phase] ?? [];
  return (
    <>
      {children({
        isOpen,
        phase,
        stepTypes,
        onSelect,
        onClose,
      })}
    </>
  );
}
