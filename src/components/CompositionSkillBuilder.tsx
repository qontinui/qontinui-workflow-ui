/**
 * Composition Skill Builder
 *
 * A UI component for creating composition skills by selecting skill references,
 * configuring parameter overrides per ref, and reordering refs.
 *
 * Composition skills (template kind "composition") reference other skills via
 * `skill_refs: SkillRef[]` where each ref has `skill_id` and optional
 * `parameter_overrides`.
 */

import React, { useState, useCallback, useMemo } from "react";
import type { SkillDefinition, SkillRef } from "@qontinui/shared-types/workflow";
import {
  getAllSkills,
  getSkill,
  getSkillCategoryIconData,
  type StepIconData,
} from "@qontinui/workflow-utils";
import { SkillParamForm } from "./SkillParamForm";

// =============================================================================
// Types
// =============================================================================

export interface CompositionSkillBuilderProps {
  /** Initial skill refs if editing an existing composition */
  initialRefs?: SkillRef[];
  /** Called when the composition is saved */
  onSave: (refs: SkillRef[]) => void;
  /** Called when canceled */
  onCancel: () => void;
  /** Icon resolver */
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

interface EditableSkillRef extends SkillRef {
  /** Resolved skill definition for display */
  _skill?: SkillDefinition;
}

// =============================================================================
// Inline SVG Icons
// =============================================================================

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 15 7-7 7 7" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
  </svg>
);

// =============================================================================
// Helper: resolve a SkillRef into an EditableSkillRef
// =============================================================================

function resolveRef(ref: SkillRef): EditableSkillRef {
  const skill = getSkill(ref.skill_id);
  return {
    ...ref,
    _skill: skill,
  };
}

// =============================================================================
// Main Component
// =============================================================================

export function CompositionSkillBuilder({
  initialRefs = [],
  onSave,
  onCancel,
  resolveIcon,
}: CompositionSkillBuilderProps) {
  const [refs, setRefs] = useState<EditableSkillRef[]>(() =>
    initialRefs.map(resolveRef)
  );
  const [showPicker, setShowPicker] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // ---- Handlers ----

  const handleAddRef = useCallback((skill: SkillDefinition) => {
    const newRef: EditableSkillRef = {
      skill_id: skill.id,
      parameter_overrides: {},
      _skill: skill,
    };
    setRefs((prev) => [...prev, newRef]);
    setShowPicker(false);
  }, []);

  const handleRemoveRef = useCallback((index: number) => {
    setRefs((prev) => prev.filter((_, i) => i !== index));
    setExpandedIndex((prev) => {
      if (prev === index) return null;
      if (prev !== null && prev > index) return prev - 1;
      return prev;
    });
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    setRefs((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setExpandedIndex((prev) => {
      if (prev === index) return index - 1;
      if (prev === index - 1) return index;
      return prev;
    });
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setRefs((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setExpandedIndex((prev) => {
      if (prev === index) return index + 1;
      if (prev === index + 1) return index;
      return prev;
    });
  }, []);

  const handleToggleExpand = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleParamOverrideChange = useCallback(
    (index: number, paramName: string, value: unknown) => {
      setRefs((prev) =>
        prev.map((ref, i) => {
          if (i !== index) return ref;
          const overrides = { ...ref.parameter_overrides };
          if (value === undefined || value === "" || value === null) {
            delete overrides[paramName];
          } else {
            overrides[paramName] = value;
          }
          return { ...ref, parameter_overrides: overrides };
        })
      );
    },
    []
  );

  const handleSave = useCallback(() => {
    // Strip internal fields before saving
    const cleanRefs: SkillRef[] = refs.map(({ _skill, ...rest }) => {
      const clean: SkillRef = { skill_id: rest.skill_id };
      if (
        rest.parameter_overrides &&
        Object.keys(rest.parameter_overrides).length > 0
      ) {
        clean.parameter_overrides = rest.parameter_overrides;
      }
      return clean;
    });
    onSave(cleanRefs);
  }, [refs, onSave]);

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-200">
          Composition Skill Builder
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Add skills to compose into a single skill
        </p>
      </div>

      {/* Skill Refs List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {refs.length === 0 ? (
          <p className="text-sm text-zinc-500 py-8 text-center">
            No skills added yet. Click &quot;Add Skill&quot; below.
          </p>
        ) : (
          refs.map((ref, index) => (
            <SkillRefItem
              key={`${ref.skill_id}-${index}`}
              ref_={ref}
              index={index}
              total={refs.length}
              isExpanded={expandedIndex === index}
              onToggleExpand={() => handleToggleExpand(index)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onRemove={() => handleRemoveRef(index)}
              onParamChange={(name, value) =>
                handleParamOverrideChange(index, name, value)
              }
              resolveIcon={resolveIcon}
            />
          ))
        )}
      </div>

      {/* Add Skill Button / Picker */}
      <div className="px-4 py-2 border-t border-zinc-800">
        {showPicker ? (
          <MiniSkillPicker
            existingRefIds={refs.map((r) => r.skill_id)}
            onSelect={handleAddRef}
            onCancel={() => setShowPicker(false)}
            resolveIcon={resolveIcon}
          />
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-700 rounded hover:border-zinc-500 transition-colors"
          >
            + Add Skill
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={refs.length === 0}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Composition ({refs.length} skill{refs.length !== 1 ? "s" : ""})
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Skill Ref Item
// =============================================================================

interface SkillRefItemProps {
  ref_: EditableSkillRef;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onParamChange: (name: string, value: unknown) => void;
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

function SkillRefItem({
  ref_,
  index,
  total,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onRemove,
  onParamChange,
  resolveIcon,
}: SkillRefItemProps) {
  const skill = ref_._skill;
  const hasParams = skill != null && skill.parameters.length > 0;
  const overrideCount = ref_.parameter_overrides
    ? Object.keys(ref_.parameter_overrides).length
    : 0;

  // Resolve icon data
  const iconData: StepIconData | null = skill
    ? getSkillCategoryIconData(skill.category)
    : null;
  const Icon = skill ? resolveIcon(skill.icon) : null;

  return (
    <div className="border border-zinc-700 rounded-md overflow-hidden">
      {/* Row header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50">
        {/* Order number */}
        <span className="text-xs text-zinc-500 font-mono w-5 text-center shrink-0">
          {index + 1}
        </span>

        {/* Icon */}
        {Icon && iconData && (
          <div className={`shrink-0 p-1 rounded ${iconData.bgClass}`}>
            <Icon className={`w-3.5 h-3.5 ${iconData.textClass}`} />
          </div>
        )}

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <span className="text-sm text-zinc-200 truncate block">
            {skill?.name ?? ref_.skill_id}
          </span>
          {!skill && (
            <span className="text-xs text-red-400">Unknown skill</span>
          )}
        </div>

        {/* Override badge */}
        {overrideCount > 0 && (
          <span className="shrink-0 px-1.5 py-0.5 text-[10px] bg-blue-900/30 text-blue-400 rounded-full">
            {overrideCount} override{overrideCount !== 1 ? "s" : ""}
          </span>
        )}

        {/* Expand button (only if skill has params) */}
        {hasParams && (
          <button
            onClick={onToggleExpand}
            className="shrink-0 p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isExpanded ? "Collapse parameters" : "Configure parameter overrides"}
          >
            <ChevronRightIcon
              className={`w-3.5 h-3.5 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        )}

        {/* Reorder buttons */}
        <div className="shrink-0 flex flex-col">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-0.5 text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
            title="Move up"
          >
            <ChevronUpIcon className="w-3 h-3" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-0.5 text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
            title="Move down"
          >
            <ChevronDownIcon className="w-3 h-3" />
          </button>
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="shrink-0 p-1 rounded hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors"
          title="Remove skill"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded parameter overrides */}
      {isExpanded && skill && (
        <div className="px-3 py-2 border-t border-zinc-700/50 bg-zinc-900/30">
          <p className="text-xs text-zinc-500 mb-2">
            Parameter overrides (leave empty to use defaults)
          </p>
          <SkillParamForm
            parameters={skill.parameters.map((p) => ({
              ...p,
              // Mark all as optional in override context
              required: false,
            }))}
            values={ref_.parameter_overrides ?? {}}
            onChange={onParamChange}
          />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Mini Skill Picker
// =============================================================================

interface MiniSkillPickerProps {
  existingRefIds: string[];
  onSelect: (skill: SkillDefinition) => void;
  onCancel: () => void;
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

function MiniSkillPicker({
  existingRefIds,
  onSelect,
  onCancel,
  resolveIcon,
}: MiniSkillPickerProps) {
  const [search, setSearch] = useState("");

  const availableSkills = useMemo(() => {
    const all = getAllSkills();
    // Filter out composition skills to prevent circular refs
    let filtered = all.filter((s) => s.template.kind !== "composition");

    // Apply search filter
    const trimmed = search.trim().toLowerCase();
    if (trimmed) {
      const words = trimmed.split(/\s+/);
      filtered = filtered.filter((skill) => {
        const haystack = [
          skill.name.toLowerCase(),
          skill.description.toLowerCase(),
          skill.slug.toLowerCase(),
          ...skill.tags.map((t) => t.toLowerCase()),
        ].join(" ");
        return words.every((word) => haystack.includes(word));
      });
    }

    return filtered;
  }, [search]);

  return (
    <div className="border border-zinc-700 rounded-md overflow-hidden">
      {/* Search input */}
      <div className="relative px-2 py-2">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded pl-7 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          autoFocus
        />
      </div>

      {/* Skill list */}
      <div className="max-h-[200px] overflow-y-auto">
        {availableSkills.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            No matching skills found.
          </p>
        ) : (
          availableSkills.map((skill) => {
            const iconData = getSkillCategoryIconData(skill.category);
            const Icon = resolveIcon(skill.icon);
            const alreadyAdded = existingRefIds.includes(skill.id);

            return (
              <button
                key={skill.id}
                onClick={() => onSelect(skill)}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800/80 transition-colors text-left"
              >
                <div className={`shrink-0 p-1 rounded ${iconData.bgClass}`}>
                  <Icon className={`w-3.5 h-3.5 ${iconData.textClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-zinc-200 truncate block">
                    {skill.name}
                  </span>
                  <span className="text-xs text-zinc-500 truncate block">
                    {skill.description}
                  </span>
                </div>
                {alreadyAdded && (
                  <span className="shrink-0 text-[10px] text-zinc-600">
                    added
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Cancel */}
      <div className="px-2 py-1.5 border-t border-zinc-700/50 flex justify-end">
        <button
          onClick={onCancel}
          className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
