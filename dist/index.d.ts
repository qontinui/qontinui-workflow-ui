import { UnifiedWorkflow, SkillDefinition, UnifiedStep, WorkflowPhase, WorkflowStage, WorkflowFeatures, StepTypeInfo, SkillCategory } from '@qontinui/shared-types/workflow';
import { LibraryItem } from '@qontinui/shared-types/library';
import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';
import { SettingsSection, BooleanSettingDef } from '@qontinui/workflow-utils';
export { BooleanSettingDef, CustomSettingDef, NumberSettingDef, SelectSettingDef, SettingDef, SettingsSection } from '@qontinui/workflow-utils';
export { ChatHeader, ChatHeaderProps, ChatInput, ChatInputProps, ChatMessageArea, ChatMessageAreaProps, WorkflowPreviewPanel, WorkflowPreviewPanelProps } from './components/chat/index.js';
import '@qontinui/shared-types';

interface WorkflowDataAdapter {
    fetchPrompts(): Promise<LibraryItem[]>;
    fetchChecks(): Promise<LibraryItem[]>;
    fetchCheckGroups(): Promise<LibraryItem[]>;
    fetchShellCommands(): Promise<LibraryItem[]>;
    fetchWorkflows(): Promise<UnifiedWorkflow[]>;
    fetchPlaywrightScripts(): Promise<LibraryItem[]>;
    fetchContexts(): Promise<LibraryItem[]>;
    fetchSkills?(): Promise<SkillDefinition[]>;
    saveWorkflow(workflow: UnifiedWorkflow): Promise<UnifiedWorkflow>;
    loadWorkflow(id: string): Promise<UnifiedWorkflow>;
    deleteWorkflow(id: string): Promise<void>;
    listWorkflows(): Promise<UnifiedWorkflow[]>;
    exportWorkflow?(workflow: UnifiedWorkflow): Promise<void>;
    importWorkflow?(file: File): Promise<UnifiedWorkflow>;
}

declare function WorkflowDataProvider({ adapter, children, }: {
    adapter: WorkflowDataAdapter;
    children: React$1.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useWorkflowData(): WorkflowDataAdapter;

interface WorkflowBuilderState {
    workflow: UnifiedWorkflow;
    originalWorkflow: UnifiedWorkflow | null;
    selectedStepId: string | null;
    currentStageIndex: number;
    expandedPhases: Record<WorkflowPhase, boolean>;
    isAddStepOpen: boolean;
    addStepPhase: WorkflowPhase | null;
}
type WorkflowBuilderAction = {
    type: "SET_WORKFLOW";
    workflow: UnifiedWorkflow;
} | {
    type: "SET_ORIGINAL_WORKFLOW";
    workflow: UnifiedWorkflow | null;
} | {
    type: "UPDATE_WORKFLOW";
    updates: Partial<UnifiedWorkflow>;
} | {
    type: "ADD_STEP";
    step: UnifiedStep;
    phase: WorkflowPhase;
} | {
    type: "REMOVE_STEP";
    stepId: string;
    phase: WorkflowPhase;
} | {
    type: "UPDATE_STEP";
    stepId: string;
    updates: Partial<UnifiedStep>;
} | {
    type: "MOVE_STEP";
    stepId: string;
    phase: WorkflowPhase;
    direction: "up" | "down";
} | {
    type: "REORDER_STEPS";
    phase: WorkflowPhase;
    steps: UnifiedStep[];
} | {
    type: "DUPLICATE_STEP";
    stepId: string;
    phase: WorkflowPhase;
} | {
    type: "SELECT_STEP";
    stepId: string | null;
} | {
    type: "TOGGLE_PHASE";
    phase: WorkflowPhase;
} | {
    type: "OPEN_ADD_STEP";
    phase: WorkflowPhase;
} | {
    type: "CLOSE_ADD_STEP";
} | {
    type: "SET_STAGE_INDEX";
    index: number;
} | {
    type: "ADD_STAGE";
    stage: WorkflowStage;
} | {
    type: "REMOVE_STAGE";
    stageIndex: number;
} | {
    type: "UPDATE_STAGE";
    stageIndex: number;
    updates: Partial<WorkflowStage>;
} | {
    type: "ENABLE_STAGES";
} | {
    type: "DISABLE_STAGES";
} | {
    type: "RESET";
};
interface WorkflowBuilderContextValue {
    state: WorkflowBuilderState;
    dispatch: React$1.Dispatch<WorkflowBuilderAction>;
    features: WorkflowFeatures;
    isEmpty: boolean;
    totalStepCount: number;
    hasUnsavedChanges: boolean;
    selectedStep: UnifiedStep | null;
    currentPhaseSteps: (phase: WorkflowPhase) => UnifiedStep[];
}
declare function WorkflowBuilderProvider({ children, initialWorkflow, }: {
    children: React$1.ReactNode;
    initialWorkflow?: UnifiedWorkflow;
}): react_jsx_runtime.JSX.Element;
declare function useWorkflowBuilder(): WorkflowBuilderContextValue;

interface UseLibraryItemsResult<T extends LibraryItem = LibraryItem> {
    items: T[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}
declare function useLibraryItems<T extends LibraryItem = LibraryItem>(fetcher: () => Promise<T[]>): UseLibraryItemsResult<T>;

declare function useWorkflowPersistence(storageKey: string, workflow: UnifiedWorkflow, setWorkflow: (wf: UnifiedWorkflow) => void): void;
declare function clearWorkflowDraft(storageKey: string): void;

interface LibraryPickerRenderProps<T extends LibraryItem = LibraryItem> {
    isOpen: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filteredItems: T[];
    isLoading: boolean;
    onSelect: (item: T) => void;
    onClose: () => void;
}
interface LibraryPickerBaseProps<T extends LibraryItem = LibraryItem> {
    items: T[];
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: T) => void;
    filterFn?: (item: T, query: string) => boolean;
    children: (props: LibraryPickerRenderProps<T>) => React.ReactNode;
}
declare function LibraryPickerBase<T extends LibraryItem = LibraryItem>({ items, isLoading, isOpen, onClose, onSelect, filterFn, children, }: LibraryPickerBaseProps<T>): react_jsx_runtime.JSX.Element;

interface PhaseSectionRenderProps {
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
interface PhaseSectionProps {
    phase: WorkflowPhase;
    steps: UnifiedStep[];
    isExpanded: boolean;
    onToggle: () => void;
    onAddStep: () => void;
    children: (props: PhaseSectionRenderProps) => React.ReactNode;
}
declare function PhaseSection({ phase, steps, isExpanded, onToggle, onAddStep, children, }: PhaseSectionProps): react_jsx_runtime.JSX.Element;

interface StepItemRenderProps {
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
interface StepItemProps {
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
declare function StepItem({ step, phase, isSelected, index, totalSteps, onSelect, onMoveUp, onMoveDown, onDelete, onDuplicate, children, }: StepItemProps): react_jsx_runtime.JSX.Element;

type AddStepMode = "skills" | "raw";
interface AddStepDropdownRenderProps {
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
interface AddStepDropdownProps {
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
declare function AddStepDropdown({ isOpen, phase, onSelect, onClose, onAddSteps, defaultMode, customStepTypes, children, }: AddStepDropdownProps): react_jsx_runtime.JSX.Element;

interface SkillCatalogRenderProps {
    mode: "browse" | "configure";
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: SkillCategory | null;
    setSelectedCategory: (category: SkillCategory | null) => void;
    selectedSource: "builtin" | "user" | "community" | null;
    setSelectedSource: (source: "builtin" | "user" | "community" | null) => void;
    hasNonBuiltinSkills: boolean;
    categories: SkillCategory[];
    filteredSkills: SkillDefinition[];
    onSelectSkill: (skill: SkillDefinition) => void;
    selectedSkill: SkillDefinition | null;
    paramValues: Record<string, unknown>;
    setParamValue: (name: string, value: unknown) => void;
    validationErrors: string[];
    onConfirm: () => void;
    onBack: () => void;
}
interface SkillCatalogProps {
    phase: WorkflowPhase;
    onAddSteps: (steps: UnifiedStep[], phase: WorkflowPhase) => void;
    onClose: () => void;
    /** Called after a skill is successfully instantiated (steps added). */
    onSkillUsed?: (skillId: string) => void;
    children: (props: SkillCatalogRenderProps) => React.ReactNode;
}
declare function SkillCatalog({ phase, onAddSteps, onClose, onSkillUsed, children, }: SkillCatalogProps): react_jsx_runtime.JSX.Element;

/**
 * Full workflow settings surface. Covers all fields that can appear in
 * the settings panel. Apps pass their workflow object cast to this shape.
 */
interface WorkflowSettings {
    name?: string;
    description?: string;
    category?: string;
    tags?: string[];
    max_iterations?: number;
    timeout_seconds?: number | null;
    provider?: string;
    model?: string;
    skip_ai_summary?: boolean;
    log_watch_enabled?: boolean;
    health_check_enabled?: boolean;
    stop_on_failure?: boolean;
    reflection_mode?: boolean;
    log_source_selection?: unknown;
    health_check_urls?: unknown[];
    prompt_template?: string;
    [key: string]: unknown;
}
interface SettingsPanelRenderProps {
    settings: WorkflowSettings;
    features: WorkflowFeatures;
    onChange: (updates: Partial<WorkflowSettings>) => void;
    /** Visible sections after filtering by workflow features */
    visibleSections: SettingsSection[];
    /** Get the display value for a boolean setting (handles invertDisplay + defaults) */
    getBooleanValue: (def: BooleanSettingDef) => boolean;
    /** Set a boolean setting from its display value (handles invertDisplay) */
    setBooleanValue: (def: BooleanSettingDef, displayValue: boolean) => void;
    /** Get a raw value from settings by key */
    getValue: (key: string) => unknown;
    /** Set a single setting value */
    setValue: (key: string, value: unknown) => void;
}
interface SettingsPanelProps {
    settings: WorkflowSettings;
    features: WorkflowFeatures;
    onChange: (updates: Partial<WorkflowSettings>) => void;
    /** Override the default section config */
    config?: readonly SettingsSection[];
    children: (props: SettingsPanelRenderProps) => React$1.ReactNode;
}
declare function SettingsPanel({ settings, features, onChange, config, children, }: SettingsPanelProps): react_jsx_runtime.JSX.Element;

interface CollapsibleProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    children: React$1.ReactNode;
    className?: string;
}
interface CollapsibleTriggerProps {
    children: React$1.ReactNode;
    className?: string;
    asChild?: boolean;
}
interface CollapsibleContentProps {
    children: React$1.ReactNode;
    className?: string;
}
interface UIPrimitives {
    Collapsible: React$1.ComponentType<CollapsibleProps>;
    CollapsibleTrigger: React$1.ComponentType<CollapsibleTriggerProps>;
    CollapsibleContent: React$1.ComponentType<CollapsibleContentProps>;
}
interface UIProviderProps {
    primitives: Partial<UIPrimitives>;
    children: React$1.ReactNode;
}
/**
 * Provide UI primitives to shared concrete components.
 *
 * ```tsx
 * // Web app (Radix)
 * <UIProvider primitives={{ Collapsible, CollapsibleTrigger, CollapsibleContent }}>
 *   <App />
 * </UIProvider>
 *
 * // Runner app (no provider needed — uses defaults)
 * <App />
 * ```
 */
declare function UIProvider({ primitives, children }: UIProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Access UI primitives from the nearest UIProvider (or defaults).
 */
declare function useUIPrimitives(): UIPrimitives;

export { AddStepDropdown, type AddStepDropdownProps, type AddStepDropdownRenderProps, type AddStepMode, type CollapsibleContentProps, type CollapsibleProps, type CollapsibleTriggerProps, LibraryPickerBase, type LibraryPickerBaseProps, type LibraryPickerRenderProps, PhaseSection, type PhaseSectionProps, type PhaseSectionRenderProps, SettingsPanel, type SettingsPanelProps, type SettingsPanelRenderProps, SkillCatalog, type SkillCatalogProps, type SkillCatalogRenderProps, StepItem, type StepItemProps, type StepItemRenderProps, type UIPrimitives, UIProvider, type UIProviderProps, type UseLibraryItemsResult, type WorkflowBuilderAction, type WorkflowBuilderContextValue, WorkflowBuilderProvider, type WorkflowBuilderState, type WorkflowDataAdapter, WorkflowDataProvider, type WorkflowSettings, clearWorkflowDraft, useLibraryItems, useUIPrimitives, useWorkflowBuilder, useWorkflowData, useWorkflowPersistence };
