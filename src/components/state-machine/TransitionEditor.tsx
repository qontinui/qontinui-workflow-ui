/**
 * Transition editor component for creating/editing state machine transitions.
 *
 * Renders a form with:
 * - Transition name
 * - From/activate/exit state selectors (toggle buttons)
 * - Action list editor with type-specific parameter fields
 * - Path cost and stays-visible options
 *
 * All data is managed locally; parent provides save/update/delete callbacks.
 */

import React, { useState, useEffect, useCallback } from "react";
import type {
  StateMachineTransition,
  StateMachineTransitionCreate,
  StateMachineState,
  TransitionAction,
  StandardActionType,
} from "@qontinui/shared-types";

// =============================================================================
// Props
// =============================================================================

export interface TransitionEditorProps {
  /** Transition to edit (null = create new) */
  transition: StateMachineTransition | null;
  /** All states in the config (for from/activate/exit selectors) */
  states: StateMachineState[];
  /** Called when creating a new transition */
  onSave: (data: StateMachineTransitionCreate) => Promise<void>;
  /** Called when updating an existing transition */
  onUpdate: (
    id: string,
    data: Partial<StateMachineTransitionCreate>,
  ) => Promise<void>;
  /** Called when deleting a transition */
  onDelete: (id: string) => Promise<void>;
  /** Called to close the editor */
  onClose: () => void;
}

// =============================================================================
// Action type options
// =============================================================================

const ACTION_TYPES: { value: StandardActionType; label: string }[] = [
  { value: "click", label: "Click" },
  { value: "doubleClick", label: "Double Click" },
  { value: "rightClick", label: "Right Click" },
  { value: "type", label: "Type" },
  { value: "clear", label: "Clear" },
  { value: "select", label: "Select" },
  { value: "focus", label: "Focus" },
  { value: "blur", label: "Blur" },
  { value: "hover", label: "Hover" },
  { value: "scroll", label: "Scroll" },
  { value: "check", label: "Check" },
  { value: "uncheck", label: "Uncheck" },
  { value: "toggle", label: "Toggle" },
  { value: "setValue", label: "Set Value" },
  { value: "drag", label: "Drag" },
  { value: "submit", label: "Submit" },
  { value: "reset", label: "Reset" },
  { value: "wait", label: "Wait" },
  { value: "navigate", label: "Navigate" },
];

// =============================================================================
// Component
// =============================================================================

export function TransitionEditor({
  transition,
  states,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}: TransitionEditorProps) {
  const isEditing = !!transition;

  // Local form state
  const [name, setName] = useState("");
  const [fromStates, setFromStates] = useState<string[]>([]);
  const [activateStates, setActivateStates] = useState<string[]>([]);
  const [exitStates, setExitStates] = useState<string[]>([]);
  const [actions, setActions] = useState<TransitionAction[]>([]);
  const [pathCost, setPathCost] = useState(1.0);
  const [staysVisible, setStaysVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync from prop
  useEffect(() => {
    if (transition) {
      setName(transition.name);
      setFromStates([...transition.from_states]);
      setActivateStates([...transition.activate_states]);
      setExitStates([...transition.exit_states]);
      setActions([...transition.actions]);
      setPathCost(transition.path_cost);
      setStaysVisible(transition.stays_visible);
    } else {
      setName("");
      setFromStates([]);
      setActivateStates([]);
      setExitStates([]);
      setActions([{ type: "click" }]);
      setPathCost(1.0);
      setStaysVisible(false);
    }
  }, [transition]);

  // Toggle a state in an array
  const toggleState = useCallback(
    (
      arr: string[],
      setter: React.Dispatch<React.SetStateAction<string[]>>,
      stateId: string,
    ) => {
      if (arr.includes(stateId)) {
        setter(arr.filter((s) => s !== stateId));
      } else {
        setter([...arr, stateId]);
      }
    },
    [],
  );

  // Action helpers
  const addAction = useCallback(() => {
    setActions((prev) => [...prev, { type: "click" }]);
  }, []);

  const removeAction = useCallback((index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateAction = useCallback(
    (index: number, updates: Partial<TransitionAction>) => {
      setActions((prev) =>
        prev.map((a, i) => (i === index ? { ...a, ...updates } : a)),
      );
    },
    [],
  );

  // Save handler
  const handleSave = useCallback(async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const data: StateMachineTransitionCreate = {
        name: name.trim(),
        from_states: fromStates,
        activate_states: activateStates,
        exit_states: exitStates,
        actions,
        path_cost: pathCost,
        stays_visible: staysVisible,
      };
      if (isEditing && transition) {
        await onUpdate(transition.id, data);
      } else {
        await onSave(data);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    name,
    fromStates,
    activateStates,
    exitStates,
    actions,
    pathCost,
    staysVisible,
    isEditing,
    transition,
    onSave,
    onUpdate,
  ]);

  // Delete handler
  const handleDelete = useCallback(async () => {
    if (!transition) return;
    setIsSaving(true);
    try {
      await onDelete(transition.id);
    } finally {
      setIsSaving(false);
    }
  }, [transition, onDelete]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          {isEditing ? "Edit Transition" : "New Transition"}
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
          placeholder="Transition name"
          className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        />
      </div>

      {/* State selectors */}
      <StateToggleGroup
        label="From States"
        color="blue"
        states={states}
        selected={fromStates}
        onToggle={(id) => toggleState(fromStates, setFromStates, id)}
      />
      <StateToggleGroup
        label="Activate States"
        color="green"
        states={states}
        selected={activateStates}
        onToggle={(id) => toggleState(activateStates, setActivateStates, id)}
      />
      <StateToggleGroup
        label="Exit States"
        color="red"
        states={states}
        selected={exitStates}
        onToggle={(id) => toggleState(exitStates, setExitStates, id)}
      />

      {/* Actions */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-text-secondary">Actions</label>
          <button
            onClick={addAction}
            className="text-xs text-brand-primary hover:text-brand-primary/80"
          >
            + Add Action
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <ActionField
              key={index}
              action={action}
              index={index}
              onUpdate={updateAction}
              onRemove={removeAction}
              canRemove={actions.length > 1}
            />
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs text-text-secondary mb-1">
            Path Cost
          </label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={pathCost}
            onChange={(e) => setPathCost(parseFloat(e.target.value) || 1.0)}
            className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={staysVisible}
              onChange={(e) => setStaysVisible(e.target.checked)}
              className="rounded"
            />
            Stays Visible
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2 border-t border-border-secondary">
        <button
          onClick={handleSave}
          disabled={!name.trim() || isSaving}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
        {isEditing && (
          <button
            onClick={handleDelete}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function StateToggleGroup({
  label,
  color,
  states,
  selected,
  onToggle,
}: {
  label: string;
  color: "blue" | "green" | "red";
  states: StateMachineState[];
  selected: string[];
  onToggle: (stateId: string) => void;
}) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    green: "bg-green-500/20 text-green-300 border-green-500/50",
    red: "bg-red-500/20 text-red-300 border-red-500/50",
  };
  const inactiveClass =
    "bg-bg-tertiary text-text-secondary border-border-secondary hover:border-text-muted";

  return (
    <div>
      <label className="block text-xs text-text-secondary mb-1">{label}</label>
      <div className="flex flex-wrap gap-1">
        {states.map((s) => {
          const isActive = selected.includes(s.state_id);
          return (
            <button
              key={s.state_id}
              onClick={() => onToggle(s.state_id)}
              className={`px-2 py-0.5 text-xs border rounded transition-colors ${
                isActive ? colorClasses[color] : inactiveClass
              }`}
            >
              {s.name}
            </button>
          );
        })}
        {states.length === 0 && (
          <span className="text-xs text-text-muted italic">No states</span>
        )}
      </div>
    </div>
  );
}

function ActionField({
  action,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  action: TransitionAction;
  index: number;
  onUpdate: (index: number, updates: Partial<TransitionAction>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  return (
    <div className="p-2 bg-bg-tertiary border border-border-secondary rounded">
      <div className="flex items-center gap-2 mb-1.5">
        <select
          value={action.type}
          onChange={(e) =>
            onUpdate(index, { type: e.target.value as StandardActionType })
          }
          className="flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
          style={{ colorScheme: "dark" }}
        >
          {ACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        )}
      </div>

      {/* Conditional parameter fields */}
      {(action.type === "click" ||
        action.type === "doubleClick" ||
        action.type === "rightClick" ||
        action.type === "hover" ||
        action.type === "focus" ||
        action.type === "blur" ||
        action.type === "check" ||
        action.type === "uncheck" ||
        action.type === "toggle" ||
        action.type === "submit" ||
        action.type === "reset" ||
        action.type === "clear") && (
        <input
          type="text"
          value={action.target ?? ""}
          onChange={(e) => onUpdate(index, { target: e.target.value || undefined })}
          placeholder="Target element ID"
          className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        />
      )}

      {action.type === "type" && (
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            value={action.target ?? ""}
            onChange={(e) =>
              onUpdate(index, { target: e.target.value || undefined })
            }
            placeholder="Target element ID"
            className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
          <input
            type="text"
            value={action.text ?? ""}
            onChange={(e) => onUpdate(index, { text: e.target.value })}
            placeholder="Text to type"
            className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
          <label className="flex items-center gap-1 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={action.clear_first ?? false}
              onChange={(e) => onUpdate(index, { clear_first: e.target.checked })}
              className="rounded"
            />
            Clear first
          </label>
        </div>
      )}

      {action.type === "navigate" && (
        <input
          type="text"
          value={action.url ?? ""}
          onChange={(e) => onUpdate(index, { url: e.target.value })}
          placeholder="URL"
          className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        />
      )}

      {action.type === "wait" && (
        <input
          type="number"
          min={0}
          value={action.delay_ms ?? 1000}
          onChange={(e) =>
            onUpdate(index, { delay_ms: parseInt(e.target.value) || 1000 })
          }
          placeholder="Delay (ms)"
          className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        />
      )}

      {(action.type === "select" || action.type === "setValue") && (
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            value={action.target ?? ""}
            onChange={(e) =>
              onUpdate(index, { target: e.target.value || undefined })
            }
            placeholder="Target element ID"
            className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
          <input
            type="text"
            value={
              Array.isArray(action.value)
                ? action.value.join(", ")
                : (action.value ?? "")
            }
            onChange={(e) => onUpdate(index, { value: e.target.value })}
            placeholder="Value"
            className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
        </div>
      )}

      {action.type === "scroll" && (
        <div className="flex gap-2">
          <select
            value={action.scroll_direction ?? "down"}
            onChange={(e) =>
              onUpdate(index, {
                scroll_direction: e.target.value as
                  | "up"
                  | "down"
                  | "left"
                  | "right",
              })
            }
            className="flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
            style={{ colorScheme: "dark" }}
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
          <input
            type="number"
            min={0}
            value={action.scroll_amount ?? 300}
            onChange={(e) =>
              onUpdate(index, {
                scroll_amount: parseInt(e.target.value) || 300,
              })
            }
            placeholder="Amount (px)"
            className="w-24 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
        </div>
      )}

      {action.type === "drag" && (
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            value={action.target ?? ""}
            onChange={(e) =>
              onUpdate(index, { target: e.target.value || undefined })
            }
            placeholder="Source element ID"
            className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
          <input
            type="text"
            value={action.drag_target ?? ""}
            onChange={(e) =>
              onUpdate(index, { drag_target: e.target.value || undefined })
            }
            placeholder="Target element ID"
            className="w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          />
        </div>
      )}
    </div>
  );
}
