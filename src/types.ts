import type {
  UnifiedWorkflow,
  UnifiedStep,
  SkillDefinition,
} from "@qontinui/shared-types/workflow";
import type { LibraryItem } from "@qontinui/shared-types/library";

/**
 * Wire format for a transition that is currently permitted from the active
 * state set.
 *
 * Field names match the Python dataclass
 * (``multistate.core.trigger_introspection.PermittedTrigger``) and the JSON
 * returned by ``GET /state-machine/permitted-triggers``. Keep snake_case to
 * avoid an extra adapter layer.
 */
export interface PermittedTrigger {
  transition_id: string;
  from_states: string[];
  to_states: string[];
  is_available: boolean;
  guards: string[];
  path_cost: number | null;
}

/**
 * Wire format for a transition that is currently blocked. ``reason`` carries
 * a structured prefix such as ``required_state_inactive:{id}``,
 * ``guard_failed:{name}``, ``guard_error:{name}:{exc}``, or
 * ``executor_refused``.
 */
export interface BlockedTrigger {
  transition_id: string;
  from_states: string[];
  to_states: string[];
  is_available: boolean;
  guards: string[];
  path_cost: number | null;
  reason: string;
}

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

  // State machine introspection
  /**
   * Return transitions currently permitted from the given active state set.
   * When ``activeStateIds`` is empty, the runtime's current active states
   * are used.
   */
  getPermittedTriggers?(activeStateIds: string[]): Promise<PermittedTrigger[]>;
  /**
   * Return transitions currently blocked, each annotated with a reason.
   */
  getBlockedTriggers?(activeStateIds: string[]): Promise<BlockedTrigger[]>;
  /**
   * Return a Mermaid ``stateDiagram-v2`` source for the loaded state machine.
   * When ``activeStateIds`` is empty, the runtime's current active states are
   * highlighted; otherwise the specified hypothetical set is used.
   */
  getMermaidDiagram?(activeStateIds?: string[]): Promise<string>;
}
