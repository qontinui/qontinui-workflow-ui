/**
 * State detail panel for viewing and editing state machine states.
 *
 * Displays state metadata (name, description, elements, confidence)
 * and provides inline editing for:
 * - Name and description
 * - Element IDs (add/remove)
 * - Acceptance criteria (add/remove/edit)
 * - Domain knowledge (add/remove/edit)
 *
 * Element list shows type-colored badges with element IDs.
 */

import { useState, useEffect, useCallback } from "react";
import type {
  StateMachineState,
  StateMachineStateUpdate,
  DomainKnowledge,
} from "@qontinui/shared-types";
import {
  getElementTypeStyle,
  getElementTypePrefix,
  getElementLabel,
  getConfidenceColor,
} from "@qontinui/workflow-utils";

// =============================================================================
// Utilities
// =============================================================================

/** Structural deep equality check. Avoids JSON.stringify allocation on every render. */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) =>
    deepEqual(
      (a as Record<string, unknown>)[k],
      (b as Record<string, unknown>)[k],
    ),
  );
}

// =============================================================================
// Props
// =============================================================================

export interface StateDetailPanelProps {
  /** The state to display/edit */
  state: StateMachineState;
  /** Called when saving changes. Receives state.id and the update payload. */
  onSave: (
    stateId: string,
    updates: StateMachineStateUpdate,
  ) => Promise<void>;
  /** Called when deleting the state */
  onDelete?: (stateId: string) => Promise<void>;
  /** Called to close the panel */
  onClose: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function StateDetailPanel({
  state,
  onSave,
  onDelete,
  onClose,
}: StateDetailPanelProps) {
  const [name, setName] = useState(state.name);
  const [description, setDescription] = useState(state.description ?? "");
  const [elementIds, setElementIds] = useState<string[]>([...state.element_ids]);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([
    ...state.acceptance_criteria,
  ]);
  const [domainKnowledge, setDomainKnowledge] = useState<DomainKnowledge[]>(
    state.domain_knowledge.map((dk) => ({ ...dk, tags: [...dk.tags] })),
  );
  const [isSaving, setIsSaving] = useState(false);

  // Inline add inputs
  const [newElementId, setNewElementId] = useState("");
  const [newCriterion, setNewCriterion] = useState("");
  const [showNewDk, setShowNewDk] = useState(false);
  const [newDkTitle, setNewDkTitle] = useState("");
  const [newDkContent, setNewDkContent] = useState("");
  const [newDkTags, setNewDkTags] = useState("");
  const [editingCriterionIdx, setEditingCriterionIdx] = useState<number | null>(
    null,
  );
  const [editingCriterionValue, setEditingCriterionValue] = useState("");

  // Sync from prop
  useEffect(() => {
    setName(state.name);
    setDescription(state.description ?? "");
    setElementIds([...state.element_ids]);
    setAcceptanceCriteria([...state.acceptance_criteria]);
    setDomainKnowledge(
      state.domain_knowledge.map((dk) => ({ ...dk, tags: [...dk.tags] })),
    );
    setNewElementId("");
    setNewCriterion("");
    setShowNewDk(false);
    setEditingCriterionIdx(null);
  }, [state]);

  const hasChanges =
    name !== state.name ||
    description !== (state.description ?? "") ||
    !deepEqual(elementIds, state.element_ids) ||
    !deepEqual(acceptanceCriteria, state.acceptance_criteria) ||
    !deepEqual(domainKnowledge, state.domain_knowledge);

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      const updates: StateMachineStateUpdate = {};
      if (name.trim() !== state.name) updates.name = name.trim();
      if (description.trim() !== (state.description ?? ""))
        updates.description = description.trim() || undefined;
      if (!deepEqual(elementIds, state.element_ids))
        updates.element_ids = elementIds;
      if (!deepEqual(acceptanceCriteria, state.acceptance_criteria))
        updates.acceptance_criteria = acceptanceCriteria;
      if (!deepEqual(domainKnowledge, state.domain_knowledge))
        updates.domain_knowledge = domainKnowledge;

      await onSave(state.id, updates);
    } finally {
      setIsSaving(false);
    }
  }, [
    state,
    name,
    description,
    elementIds,
    acceptanceCriteria,
    domainKnowledge,
    hasChanges,
    onSave,
  ]);

  const handleDelete = useCallback(async () => {
    if (!onDelete) return;
    setIsSaving(true);
    try {
      await onDelete(state.id);
    } finally {
      setIsSaving(false);
    }
  }, [state.id, onDelete]);

  // Element helpers
  const handleAddElement = useCallback(() => {
    const trimmed = newElementId.trim();
    if (!trimmed || elementIds.includes(trimmed)) return;
    setElementIds((prev) => [...prev, trimmed]);
    setNewElementId("");
  }, [newElementId, elementIds]);

  const handleRemoveElement = useCallback((eid: string) => {
    setElementIds((prev) => prev.filter((e) => e !== eid));
  }, []);

  // Acceptance criteria helpers
  const handleAddCriterion = useCallback(() => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    setAcceptanceCriteria((prev) => [...prev, trimmed]);
    setNewCriterion("");
  }, [newCriterion]);

  const handleRemoveCriterion = useCallback((idx: number) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== idx));
    setEditingCriterionIdx(null);
  }, []);

  const handleSaveCriterionEdit = useCallback(() => {
    if (editingCriterionIdx === null) return;
    const trimmed = editingCriterionValue.trim();
    if (!trimmed) {
      handleRemoveCriterion(editingCriterionIdx);
      return;
    }
    setAcceptanceCriteria((prev) =>
      prev.map((c, i) => (i === editingCriterionIdx ? trimmed : c)),
    );
    setEditingCriterionIdx(null);
  }, [editingCriterionIdx, editingCriterionValue, handleRemoveCriterion]);

  // Domain knowledge helpers
  const handleAddDk = useCallback(() => {
    const title = newDkTitle.trim();
    const content = newDkContent.trim();
    if (!title || !content) return;
    const tags = newDkTags.split(",").flatMap((t) => {
      const trimmed = t.trim();
      return trimmed ? [trimmed] : [];
    });
    setDomainKnowledge((prev) => [
      ...prev,
      {
        id: `dk-${Date.now()}`,
        title,
        content,
        tags,
      },
    ]);
    setNewDkTitle("");
    setNewDkContent("");
    setNewDkTags("");
    setShowNewDk(false);
  }, [newDkTitle, newDkContent, newDkTags]);

  const handleRemoveDk = useCallback((dkId: string) => {
    setDomainKnowledge((prev) => prev.filter((dk) => dk.id !== dkId));
  }, []);

  const confidenceColor = getConfidenceColor(state.confidence);
  const confidencePct = Math.round(state.confidence * 100);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          State Details
        </h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-xs"
        >
          Close
        </button>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs text-text-secondary mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional description"
          className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted resize-y"
        />
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-text-secondary">State ID</span>
          <code className="block mt-0.5 px-1.5 py-0.5 bg-bg-tertiary rounded text-text-primary font-mono text-[10px] break-all">
            {state.state_id}
          </code>
        </div>
        <div>
          <span className="text-text-secondary">Confidence</span>
          <span className={`block mt-0.5 font-medium ${confidenceColor}`}>
            {confidencePct}%
          </span>
        </div>
        <div>
          <span className="text-text-secondary">Elements</span>
          <span className="block mt-0.5 text-text-primary font-medium">
            {elementIds.length}
          </span>
        </div>
        <div>
          <span className="text-text-secondary">Renders</span>
          <span className="block mt-0.5 text-text-primary font-medium">
            {state.render_ids.length}
          </span>
        </div>
      </div>

      {/* Elements list — editable */}
      <div>
        <label className="block text-xs text-text-secondary mb-1.5">
          Elements ({elementIds.length})
        </label>
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {elementIds.map((eid) => {
            const style = getElementTypeStyle(eid);
            const label = getElementLabel(eid);
            return (
              <div
                key={eid}
                className={`group flex items-center gap-1 px-2 py-1 text-xs rounded border ${style.bg} ${style.text} ${style.border}`}
                title={eid}
              >
                <span className="truncate flex-1">{label}</span>
                <button
                  onClick={() => handleRemoveElement(eid)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity"
                  title="Remove element"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
        {/* Add element */}
        <div className="flex gap-1 mt-1.5">
          <input
            type="text"
            value={newElementId}
            onChange={(e) => setNewElementId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddElement();
            }}
            placeholder="type:element-id"
            className="flex-1 px-2 py-1 text-xs bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
          <button
            onClick={handleAddElement}
            disabled={!newElementId.trim()}
            className="px-2 py-1 text-xs text-brand-primary hover:text-brand-primary/80 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Acceptance criteria — editable */}
      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Acceptance Criteria ({acceptanceCriteria.length})
        </label>
        {acceptanceCriteria.length > 0 && (
          <ul className="space-y-0.5 mb-1.5">
            {acceptanceCriteria.map((c, i) => (
              <li key={`${i}-${c}`} className="group flex items-start gap-1.5 text-xs">
                {editingCriterionIdx === i ? (
                  <input
                    type="text"
                    value={editingCriterionValue}
                    onChange={(e) => setEditingCriterionValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCriterionEdit();
                      if (e.key === "Escape") setEditingCriterionIdx(null);
                    }}
                    onBlur={handleSaveCriterionEdit}
                    autoFocus
                    className="flex-1 px-1.5 py-0.5 text-xs bg-bg-tertiary border border-border-secondary rounded text-text-primary"
                  />
                ) : (
                  <>
                    <span
                      className="flex-1 text-text-primary cursor-pointer hover:text-brand-primary"
                      onClick={() => {
                        setEditingCriterionIdx(i);
                        setEditingCriterionValue(c);
                      }}
                      title="Click to edit"
                    >
                      {c}
                    </span>
                    <button
                      onClick={() => handleRemoveCriterion(i)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {/* Add criterion */}
        <div className="flex gap-1">
          <input
            type="text"
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCriterion();
            }}
            placeholder="Add acceptance criterion..."
            className="flex-1 px-2 py-1 text-xs bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
          <button
            onClick={handleAddCriterion}
            disabled={!newCriterion.trim()}
            className="px-2 py-1 text-xs text-brand-primary hover:text-brand-primary/80 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Domain knowledge — editable */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-text-secondary">
            Domain Knowledge ({domainKnowledge.length})
          </label>
          <button
            onClick={() => setShowNewDk(true)}
            className="text-xs text-brand-primary hover:text-brand-primary/80"
          >
            + Add
          </button>
        </div>
        {domainKnowledge.length > 0 && (
          <div className="space-y-1.5">
            {domainKnowledge.map((dk) => (
              <div
                key={dk.id}
                className="group p-2 bg-bg-tertiary border border-border-secondary rounded"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="text-xs font-medium text-text-primary">
                    {dk.title}
                  </div>
                  <button
                    onClick={() => handleRemoveDk(dk.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
                <div className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                  {dk.content}
                </div>
                {dk.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dk.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1 py-0.5 text-[10px] bg-bg-secondary rounded text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add domain knowledge form */}
        {showNewDk && (
          <div className="mt-1.5 p-2 bg-bg-tertiary border border-border-secondary rounded space-y-1.5">
            <input
              type="text"
              value={newDkTitle}
              onChange={(e) => setNewDkTitle(e.target.value)}
              placeholder="Title"
              autoFocus
              className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
            />
            <textarea
              value={newDkContent}
              onChange={(e) => setNewDkContent(e.target.value)}
              placeholder="Content"
              rows={2}
              className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted resize-y"
            />
            <input
              type="text"
              value={newDkTags}
              onChange={(e) => setNewDkTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleAddDk}
                disabled={!newDkTitle.trim() || !newDkContent.trim()}
                className="px-2 py-1 text-xs font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowNewDk(false);
                  setNewDkTitle("");
                  setNewDkContent("");
                  setNewDkTags("");
                }}
                className="px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2 border-t border-border-secondary">
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded"
          >
            Delete State
          </button>
        )}
      </div>
    </div>
  );
}
