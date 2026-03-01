// Types
export type { WorkflowDataAdapter } from "./types";

// Data provider
export { WorkflowDataProvider, useWorkflowData } from "./WorkflowDataProvider";

// Builder state management
export {
  WorkflowBuilderProvider,
  useWorkflowBuilder,
} from "./WorkflowBuilderProvider";
export type {
  WorkflowBuilderState,
  WorkflowBuilderAction,
  WorkflowBuilderContextValue,
} from "./WorkflowBuilderProvider";

// Hooks
export { useLibraryItems } from "./useLibraryItems";
export type { UseLibraryItemsResult } from "./useLibraryItems";

export { useWorkflowPersistence, clearWorkflowDraft } from "./useWorkflowPersistence";

// Headless components
export { LibraryPickerBase } from "./headless/LibraryPickerBase";
export type {
  LibraryPickerRenderProps,
  LibraryPickerBaseProps,
} from "./headless/LibraryPickerBase";

export { PhaseSection } from "./headless/PhaseSection";
export type {
  PhaseSectionRenderProps,
  PhaseSectionProps,
} from "./headless/PhaseSection";

export { StepItem } from "./headless/StepItem";
export type {
  StepItemRenderProps,
  StepItemProps,
} from "./headless/StepItem";

export { AddStepDropdown } from "./headless/AddStepDropdown";
export type {
  AddStepDropdownRenderProps,
  AddStepDropdownProps,
} from "./headless/AddStepDropdown";

export { SettingsPanel } from "./headless/SettingsPanel";
export type {
  WorkflowSettings,
  SettingsPanelRenderProps,
  SettingsPanelProps,
} from "./headless/SettingsPanel";

// Re-export setting types from workflow-utils for convenience
export type {
  SettingDef,
  BooleanSettingDef,
  NumberSettingDef,
  SelectSettingDef,
  CustomSettingDef,
  SettingsSection,
} from "@qontinui/workflow-utils";

// Chat components
export {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  WorkflowPreviewPanel,
} from "./components/chat";
export type {
  ChatHeaderProps,
  ChatInputProps,
  ChatMessageAreaProps,
  WorkflowPreviewPanelProps,
} from "./components/chat";

// UI Primitives Provider
export { UIProvider, useUIPrimitives } from "./UIProvider";
export type {
  UIPrimitives,
  UIProviderProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "./UIProvider";
