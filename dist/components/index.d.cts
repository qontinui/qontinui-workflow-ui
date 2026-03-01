import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { WorkflowPhase, UnifiedStep } from '@qontinui/shared-types/workflow';
export { ChatHeader, ChatHeaderProps, ChatInput, ChatInputProps, ChatMessageArea, ChatMessageAreaProps, WorkflowPreviewPanel, WorkflowPreviewPanelProps } from './chat/index.cjs';
import '@qontinui/shared-types';

interface PhaseSectionConcreteProps {
    phase: WorkflowPhase;
    steps: UnifiedStep[];
    isExpanded: boolean;
    onToggle: () => void;
    onAddStep: (phase: WorkflowPhase) => void;
    /** Whether any step in this phase is currently selected */
    hasSelectedStep?: boolean;
    /** Render the step list — app provides DnD wrapping or plain div */
    renderStepList: (steps: UnifiedStep[], isSelectionMode: boolean, selectedIds: Set<string>, onToggleSelect: (id: string) => void) => React.ReactNode;
    /** Optional actions for the phase header (e.g., quick-add buttons) */
    headerActions?: React.ReactNode;
    /** Called when batch delete is confirmed */
    onBatchDelete?: (stepIds: string[]) => void;
}
declare function PhaseSectionConcrete({ phase, steps, isExpanded, onToggle, onAddStep, hasSelectedStep, renderStepList, headerActions, onBatchDelete, }: PhaseSectionConcreteProps): react_jsx_runtime.JSX.Element;

interface StepItemConcreteProps {
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
    resolveIcon: (iconId: string) => React.ComponentType<{
        className?: string;
    }>;
}
declare function StepItemConcrete({ step, isSelected, onClick, onDelete, onDuplicate, isSelectionMode, isSelectedForDelete, reorderSlot, selectionCheckbox, resolveIcon, }: StepItemConcreteProps): react_jsx_runtime.JSX.Element;

export { PhaseSectionConcrete, type PhaseSectionConcreteProps, StepItemConcrete, type StepItemConcreteProps };
