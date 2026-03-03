import type {
  UnifiedWorkflow,
  UnifiedStep,
  SkillDefinition,
} from "@qontinui/shared-types/workflow";
import type { LibraryItem } from "@qontinui/shared-types/library";

export interface WorkflowDataAdapter {
  // Library fetchers
  fetchPrompts(): Promise<LibraryItem[]>;
  fetchChecks(): Promise<LibraryItem[]>;
  fetchCheckGroups(): Promise<LibraryItem[]>;
  fetchShellCommands(): Promise<LibraryItem[]>;
  fetchWorkflows(): Promise<UnifiedWorkflow[]>;
  fetchPlaywrightScripts(): Promise<LibraryItem[]>;
  fetchContexts(): Promise<LibraryItem[]>;

  // Skills (user-created skill definitions)
  fetchSkills?(): Promise<SkillDefinition[]>;

  // Workflow CRUD
  saveWorkflow(workflow: UnifiedWorkflow): Promise<UnifiedWorkflow>;
  loadWorkflow(id: string): Promise<UnifiedWorkflow>;
  deleteWorkflow(id: string): Promise<void>;
  listWorkflows(): Promise<UnifiedWorkflow[]>;

  // Export/Import
  exportWorkflow?(workflow: UnifiedWorkflow): Promise<void>;
  importWorkflow?(file: File): Promise<UnifiedWorkflow>;
}
