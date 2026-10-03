/**
 * Headless Skill Catalog
 *
 * Provides search, filter, and selection state for browsing skills.
 * App provides all UI via render props.
 *
 * Two views:
 * - Browse mode: search + category filter + skill cards
 * - Configure mode: selected skill parameter form
 */

import { useState, useMemo, useCallback } from "react";
import type {
  SkillDefinition,
  WorkflowPhase,
} from "@qontinui/shared-types/workflow";
import {
  searchSkills,
  getSkillCategories,
  getSkillsByPhase,
  validateSkillParams,
  instantiateSkillSteps,
  skillProducesSteps,
  type SkillSearchFilters,
} from "@qontinui/workflow-utils";
import type { UnifiedStep } from "@qontinui/shared-types/workflow";

/**
 * A skill's category as the catalog holds it: shared-types publishes
 * `SkillCategory` as the known vocabulary, but the field is open (the runner
 * reads categories back from user rows and imports), so key on the field.
 */
type SkillCategory = SkillDefinition["category"];

/**
 * Whether the catalog can turn this skill into workflow steps. Re-exported
 * from workflow-utils, which also checks that every composition ref resolves
 * and itself produces steps, so a composition with a dangling, step-less or
 * cyclic ref is not offered either.
 */
export { skillProducesSteps };

/**
 * Whether the composition builder may offer this skill as a ref: single- and
 * multi-step skills only. A step-less `playbook` or an unknown kind can never
 * expand. `instantiateComposition` does expand nested compositions, refusing
 * a cycle, but the builder is not told which composition it is editing, so it
 * cannot keep a picked composition ref from closing a cycle through it.
 * New nested refs are therefore not offered; a nested ref already in a loaded
 * composition is kept unless the registry proves it cyclic.
 */
export function skillIsComposable(skill: SkillDefinition): boolean {
  const kind = skill.template.kind;
  return kind === "single_step" || kind === "multi_step";
}

// =============================================================================
// Types
// =============================================================================

export interface SkillCatalogRenderProps {
  // View state
  mode: "browse" | "configure";

  // Browse mode
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

  // Configure mode
  selectedSkill: SkillDefinition | null;
  paramValues: Record<string, unknown>;
  setParamValue: (name: string, value: unknown) => void;
  validationErrors: string[];
  onConfirm: () => void;
  onBack: () => void;
}

export interface SkillCatalogProps {
  phase: WorkflowPhase;
  onAddSteps: (steps: UnifiedStep[], phase: WorkflowPhase) => void;
  onClose: () => void;
  /** Called after a skill is successfully instantiated (steps added). */
  onSkillUsed?: (skillId: string) => void;
  children: (props: SkillCatalogRenderProps) => React.ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export function SkillCatalog({
  phase,
  onAddSteps,
  onClose,
  onSkillUsed,
  children,
}: SkillCatalogProps) {
  // Browse state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory | null>(null);
  const [selectedSource, setSelectedSource] = useState<
    "builtin" | "user" | "community" | null
  >(null);

  // Configure state
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(
    null,
  );
  const [paramValues, setParamValues] = useState<Record<string, unknown>>({});
  // Why the last confirm could not instantiate the skill (a missing
  // dependency or referenced skill, say). Cleared whenever the input changes.
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const mode = selectedSkill ? "configure" : "browse";

  // Skills in this phase the catalog can actually add
  const phaseSkills = useMemo(
    () => getSkillsByPhase(phase).filter(skillProducesSteps),
    [phase],
  );

  // Categories available in this phase
  const categories = useMemo(() => {
    const cats = new Set<SkillCategory>();
    for (const skill of phaseSkills) {
      cats.add(skill.category);
    }
    return Array.from(cats);
  }, [phaseSkills]);

  // Check if there are any non-builtin skills
  const hasNonBuiltinSkills = useMemo(
    () => phaseSkills.some((s) => s.source !== "builtin"),
    [phaseSkills],
  );

  // Filtered skills for browse mode
  const filteredSkills = useMemo(() => {
    const filters: SkillSearchFilters = { phase };
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    if (selectedSource) {
      filters.source = selectedSource;
    }
    return searchSkills(searchQuery, filters).filter(skillProducesSteps);
  }, [searchQuery, selectedCategory, selectedSource, phase]);

  // Select a skill to configure
  const onSelectSkill = useCallback(
    (skill: SkillDefinition) => {
      setSelectedSkill(skill);
      setConfirmError(null);

      // Pre-fill defaults
      const defaults: Record<string, unknown> = {};
      for (const param of skill.parameters) {
        if (param.default !== undefined) {
          defaults[param.name] = param.default;
        }
      }
      setParamValues(defaults);
    },
    [],
  );

  // Set a single parameter value
  const setParamValue = useCallback(
    (name: string, value: unknown) => {
      setParamValues((prev) => ({ ...prev, [name]: value }));
      setConfirmError(null);
    },
    [],
  );

  // Validation
  const paramErrors = useMemo(() => {
    if (!selectedSkill) return [];
    return validateSkillParams(selectedSkill, paramValues);
  }, [selectedSkill, paramValues]);

  const validationErrors = useMemo(
    () => (confirmError ? [...paramErrors, confirmError] : paramErrors),
    [paramErrors, confirmError],
  );

  // Confirm: instantiate skill and add steps
  const onConfirm = useCallback(() => {
    if (!selectedSkill || paramErrors.length > 0) return;

    let steps: UnifiedStep[];
    try {
      steps = instantiateSkillSteps(selectedSkill, phase, paramValues);
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : String(err));
      return;
    }
    onAddSteps(steps, phase);
    if (onSkillUsed) {
      onSkillUsed(selectedSkill.id);
    }
    onClose();
  }, [selectedSkill, phase, paramValues, paramErrors, onAddSteps, onSkillUsed, onClose]);

  // Back to browse
  const onBack = useCallback(() => {
    setSelectedSkill(null);
    setParamValues({});
    setConfirmError(null);
  }, []);

  return (
    <>
      {children({
        mode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSource,
        setSelectedSource,
        hasNonBuiltinSkills,
        categories,
        filteredSkills,
        onSelectSkill,
        selectedSkill,
        paramValues,
        setParamValue,
        validationErrors,
        onConfirm,
        onBack,
      })}
    </>
  );
}
