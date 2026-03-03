/**
 * Headless Add Step Dropdown
 *
 * Provides step type selection data via render props.
 * Supports two modes:
 * - Skill catalog (default): browse skills, configure params, add steps
 * - Raw step types (advanced): original direct step type selection
 */

import { useState, useCallback } from "react";
import type {
  WorkflowPhase,
  StepTypeInfo,
  UnifiedStep,
} from "@qontinui/shared-types/workflow";
import { STEP_TYPES } from "@qontinui/shared-types/workflow";

export type AddStepMode = "skills" | "raw";

export interface AddStepDropdownRenderProps {
  isOpen: boolean;
  phase: WorkflowPhase;
  mode: AddStepMode;
  /** Raw step types for the current phase (used in "raw" mode) */
  stepTypes: StepTypeInfo[];
  /** Select a raw step type */
  onSelect: (stepType: StepTypeInfo) => void;
  /** Switch to raw step mode */
  onSwitchToRaw: () => void;
  /** Switch to skill catalog mode */
  onSwitchToSkills: () => void;
  /** Add steps from skill catalog (used in "skills" mode) */
  onAddSteps: (steps: UnifiedStep[], phase: WorkflowPhase) => void;
  onClose: () => void;
}

export interface AddStepDropdownProps {
  isOpen: boolean;
  phase: WorkflowPhase;
  onSelect: (stepType: StepTypeInfo) => void;
  onClose: () => void;
  /** Called when skills are instantiated into steps */
  onAddSteps?: (steps: UnifiedStep[], phase: WorkflowPhase) => void;
  /** Initial mode — defaults to "skills" */
  defaultMode?: AddStepMode;
  customStepTypes?: Record<WorkflowPhase, StepTypeInfo[]>;
  children: (props: AddStepDropdownRenderProps) => React.ReactNode;
}

export function AddStepDropdown({
  isOpen,
  phase,
  onSelect,
  onClose,
  onAddSteps,
  defaultMode = "skills",
  customStepTypes,
  children,
}: AddStepDropdownProps) {
  const [mode, setMode] = useState<AddStepMode>(defaultMode);

  const stepTypes = (customStepTypes ?? STEP_TYPES)[phase] ?? [];

  const onSwitchToRaw = useCallback(() => setMode("raw"), []);
  const onSwitchToSkills = useCallback(() => setMode("skills"), []);

  const handleAddSteps = useCallback(
    (steps: UnifiedStep[], targetPhase: WorkflowPhase) => {
      onAddSteps?.(steps, targetPhase);
      onClose();
    },
    [onAddSteps, onClose],
  );

  // Reset mode when closing
  const handleClose = useCallback(() => {
    setMode(defaultMode);
    onClose();
  }, [defaultMode, onClose]);

  return (
    <>
      {children({
        isOpen,
        phase,
        mode,
        stepTypes,
        onSelect,
        onSwitchToRaw,
        onSwitchToSkills,
        onAddSteps: handleAddSteps,
        onClose: handleClose,
      })}
    </>
  );
}
