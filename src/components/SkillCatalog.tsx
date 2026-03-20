/**
 * Concrete Skill Catalog Component
 *
 * A full Tailwind UI for browsing and adding skills to a workflow phase.
 * Category tabs, search, skill cards, and parameter configuration.
 *
 * Uses the headless SkillCatalog for state management.
 */

import React from "react";
import type {
  SkillDefinition,
  SkillCategory,
  WorkflowPhase,
  UnifiedStep,
} from "@qontinui/shared-types/workflow";
import { getSkillCategoryIconData, type StepIconData } from "@qontinui/workflow-utils";
import { SkillCatalog as HeadlessSkillCatalog } from "../headless/SkillCatalog";
import { SkillParamForm } from "./SkillParamForm";

// =============================================================================
// Types
// =============================================================================

export interface SkillCatalogConcreteProps {
  phase: WorkflowPhase;
  isOpen: boolean;
  onAddSteps: (steps: UnifiedStep[], phase: WorkflowPhase) => void;
  onClose: () => void;
  /** Called after a skill is successfully instantiated (steps added). */
  onSkillUsed?: (skillId: string) => void;
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

// =============================================================================
// Category Labels
// =============================================================================

const CATEGORY_LABELS: Record<string, string> = {
  "code-quality": "Code Quality",
  testing: "Testing",
  monitoring: "Monitoring",
  "ai-task": "AI Task",
  deployment: "Deployment",
  composition: "Composition",
  custom: "Custom",
};

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

// =============================================================================
// Inline SVG Icons
// =============================================================================

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" />
  </svg>
);

// =============================================================================
// Component
// =============================================================================

export function SkillCatalogConcrete({
  phase,
  isOpen,
  onAddSteps,
  onClose,
  onSkillUsed,
  resolveIcon,
}: SkillCatalogConcreteProps) {
  if (!isOpen) return null;

  return (
    <HeadlessSkillCatalog
      phase={phase}
      onAddSteps={onAddSteps}
      onClose={onClose}
      onSkillUsed={onSkillUsed}
    >
      {(props) => (
        <div className="flex flex-col h-full max-h-[480px]">
          {props.mode === "browse" ? (
            <BrowseView
              {...props}
              phase={phase}
              resolveIcon={resolveIcon}
            />
          ) : (
            <ConfigureView
              {...props}
              resolveIcon={resolveIcon}
            />
          )}
        </div>
      )}
    </HeadlessSkillCatalog>
  );
}

// =============================================================================
// Browse View
// =============================================================================

interface BrowseViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: SkillCategory | null;
  setSelectedCategory: (c: SkillCategory | null) => void;
  selectedSource: "builtin" | "user" | "community" | null;
  setSelectedSource: (source: "builtin" | "user" | "community" | null) => void;
  hasNonBuiltinSkills: boolean;
  categories: SkillCategory[];
  filteredSkills: SkillDefinition[];
  onSelectSkill: (skill: SkillDefinition) => void;
  phase: WorkflowPhase;
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

function BrowseView({
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
  resolveIcon,
}: BrowseViewProps) {
  return (
    <>
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-zinc-500"
            autoFocus
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
        <CategoryChip
          label="All"
          isActive={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={getCategoryLabel(cat)}
            isActive={selectedCategory === cat}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
          />
        ))}
      </div>

      {/* Source Filter (only shown when non-builtin skills exist) */}
      {hasNonBuiltinSkills && (
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
          <CategoryChip
            label="All Sources"
            isActive={selectedSource === null}
            onClick={() => setSelectedSource(null)}
          />
          <CategoryChip
            label="Built-in"
            isActive={selectedSource === "builtin"}
            onClick={() =>
              setSelectedSource(selectedSource === "builtin" ? null : "builtin")
            }
          />
          <CategoryChip
            label="Custom"
            isActive={selectedSource === "user"}
            onClick={() =>
              setSelectedSource(selectedSource === "user" ? null : "user")
            }
          />
          <CategoryChip
            label="Community"
            isActive={selectedSource === "community"}
            onClick={() =>
              setSelectedSource(
                selectedSource === "community" ? null : "community"
              )
            }
          />
        </div>
      )}

      {/* Skill Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-1">
        {filteredSkills.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">
            No skills match your search.
          </p>
        ) : (
          filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={() => {
                if (skill.parameters.length === 0) {
                  // No params — skip configure, add directly
                  onSelectSkill(skill);
                  // The headless component will transition to configure mode,
                  // but since there are no params we want to auto-confirm.
                  // We handle this case in the parent via the paramless path.
                  return;
                }
                onSelectSkill(skill);
              }}
              resolveIcon={resolveIcon}
            />
          ))
        )}
      </div>

    </>
  );
}

// =============================================================================
// Configure View
// =============================================================================

interface ConfigureViewProps {
  selectedSkill: SkillDefinition | null;
  paramValues: Record<string, unknown>;
  setParamValue: (name: string, value: unknown) => void;
  validationErrors: string[];
  onConfirm: () => void;
  onBack: () => void;
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}

function ConfigureView({
  selectedSkill,
  paramValues,
  setParamValue,
  validationErrors,
  onConfirm,
  onBack,
  resolveIcon,
}: ConfigureViewProps) {
  if (!selectedSkill) return null;

  const iconData = getSkillCategoryIconData(selectedSkill.category);
  const Icon = resolveIcon(selectedSkill.icon);

  return (
    <>
      {/* Header */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        <button
          className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
          onClick={onBack}
          title="Back to catalog"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <div className={`p-1.5 rounded ${iconData.bgClass}`}>
          <Icon className={`w-4 h-4 ${iconData.textClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-zinc-200 truncate">
            {selectedSkill.name}
          </h3>
          <p className="text-xs text-zinc-500 truncate">
            {selectedSkill.description}
          </p>
        </div>
      </div>

      {/* Parameter Form */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <SkillParamForm
          parameters={selectedSkill.parameters}
          values={paramValues}
          onChange={setParamValue}
          errors={validationErrors}
        />
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-zinc-800 flex justify-end gap-2">
        <button
          className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors rounded"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={onConfirm}
          disabled={validationErrors.length > 0}
        >
          Add to Phase
        </button>
      </div>
    </>
  );
}

// =============================================================================
// Sub-Components
// =============================================================================

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`
        px-2 py-0.5 text-xs rounded-full transition-colors
        ${
          isActive
            ? "bg-zinc-600 text-zinc-100"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
        }
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function SkillCard({
  skill,
  onClick,
  resolveIcon,
}: {
  skill: SkillDefinition;
  onClick: () => void;
  resolveIcon: (iconId: string) => React.ComponentType<{ className?: string }>;
}) {
  const iconData: StepIconData = getSkillCategoryIconData(skill.category);
  const Icon = resolveIcon(skill.icon);

  return (
    <button
      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-zinc-800/80 transition-colors text-left group"
      onClick={onClick}
    >
      <div className={`shrink-0 p-1.5 rounded ${iconData.bgClass}`}>
        <Icon className={`w-4 h-4 ${iconData.textClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="text-sm text-zinc-200 group-hover:text-zinc-100">
            {skill.name}
          </span>
          {skill.source !== "builtin" && (
            <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${
              skill.source === "community"
                ? "bg-purple-900/30 text-purple-400"
                : "bg-blue-900/30 text-blue-400"
            }`}>
              {skill.source === "community" ? "Community" : "Custom"}
            </span>
          )}
          {skill.forked_from && (
            <span className="ml-1.5 text-[10px] text-zinc-600" title={`Forked from ${skill.forked_from}`}>
              (fork)
            </span>
          )}
          {skill.version && skill.version !== "1.0.0" && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-full">
              v{skill.version}
            </span>
          )}
          {skill.approval_status && (
            <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${
              skill.approval_status === "approved"
                ? "bg-green-900/30 text-green-400"
                : skill.approval_status === "rejected"
                  ? "bg-red-900/30 text-red-400"
                  : "bg-yellow-900/30 text-yellow-400"
            }`}>
              {skill.approval_status === "approved" ? "Approved" : skill.approval_status === "rejected" ? "Rejected" : "Pending"}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 truncate">
          {skill.description}
          {skill.author && (
            <span className="ml-1 text-zinc-600">
              — by {skill.author.name}
            </span>
          )}
        </p>
      </div>
      {skill.tags.length > 0 && (
        <div className="hidden sm:flex gap-1 shrink-0">
          {skill.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {skill.usage_count != null && skill.usage_count > 0 && (
        <span className="shrink-0 text-[10px] text-zinc-600" title="Times used">
          {skill.usage_count}x
        </span>
      )}
    </button>
  );
}
