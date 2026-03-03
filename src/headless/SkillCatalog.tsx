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
  SkillCategory,
  WorkflowPhase,
} from "@qontinui/shared-types/workflow";
import {
  searchSkills,
  getSkillCategories,
  getSkillsByPhase,
  validateSkillParams,
  instantiateSkill,
  type SkillSearchFilters,
} from "@qontinui/workflow-utils";
import type { UnifiedStep } from "@qontinui/shared-types/workflow";

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

  const mode = selectedSkill ? "configure" : "browse";

  // Categories available in this phase
  const categories = useMemo(() => {
    const phaseSkills = getSkillsByPhase(phase);
    const cats = new Set<SkillCategory>();
    for (const skill of phaseSkills) {
      cats.add(skill.category);
    }
    return Array.from(cats);
  }, [phase]);

  // Check if there are any non-builtin skills
  const hasNonBuiltinSkills = useMemo(() => {
    const phaseSkills = getSkillsByPhase(phase);
    return phaseSkills.some((s) => s.source !== "builtin");
  }, [phase]);

  // Filtered skills for browse mode
  const filteredSkills = useMemo(() => {
    const filters: SkillSearchFilters = { phase };
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    if (selectedSource) {
      filters.source = selectedSource;
    }
    return searchSkills(searchQuery, filters);
  }, [searchQuery, selectedCategory, selectedSource, phase]);

  // Select a skill to configure
  const onSelectSkill = useCallback(
    (skill: SkillDefinition) => {
      setSelectedSkill(skill);

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
    },
    [],
  );

  // Validation
  const validationErrors = useMemo(() => {
    if (!selectedSkill) return [];
    return validateSkillParams(selectedSkill, paramValues);
  }, [selectedSkill, paramValues]);

  // Confirm: instantiate skill and add steps
  const onConfirm = useCallback(() => {
    if (!selectedSkill || validationErrors.length > 0) return;

    const steps = instantiateSkill(selectedSkill, phase, paramValues);
    onAddSteps(steps, phase);
    if (onSkillUsed) {
      onSkillUsed(selectedSkill.id);
    }
    onClose();
  }, [selectedSkill, phase, paramValues, validationErrors, onAddSteps, onSkillUsed, onClose]);

  // Back to browse
  const onBack = useCallback(() => {
    setSelectedSkill(null);
    setParamValues({});
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
