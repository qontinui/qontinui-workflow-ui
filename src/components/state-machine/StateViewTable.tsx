/**
 * Tabular state list with element filtering.
 *
 * Shows all states in a config as a sortable table with:
 * - State name, element count, confidence
 * - Element type breakdown badges
 * - Click-to-select for opening the detail panel
 * - Optional text filter for element IDs
 */

import { useState, useMemo } from "react";
import type { StateMachineState } from "@qontinui/shared-types";
import {
  getElementTypeStyle,
  getElementTypePrefix,
  getConfidenceColor,
} from "@qontinui/workflow-utils";

// =============================================================================
// Props
// =============================================================================

export interface StateViewTableProps {
  /** All states to display */
  states: StateMachineState[];
  /** Currently selected state ID (state_id, not database id) */
  selectedStateId: string | null;
  /** Called when a state is selected */
  onSelectState: (stateId: string | null) => void;
}

// =============================================================================
// Component
// =============================================================================

export function StateViewTable({
  states,
  selectedStateId,
  onSelectState,
}: StateViewTableProps) {
  const [filter, setFilter] = useState("");

  // Filter states by element ID substring
  const filteredStates = useMemo(() => {
    if (!filter.trim()) return states;
    const q = filter.toLowerCase();
    return states.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.element_ids.some((eid) => eid.toLowerCase().includes(q)),
    );
  }, [states, filter]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          States ({states.length})
        </h3>
      </div>

      {/* Filter input */}
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name or element ID..."
        className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      />

      {/* State list */}
      <div className="space-y-1">
        {filteredStates.map((state) => {
          const isSelected = state.state_id === selectedStateId;
          const confidenceColor = getConfidenceColor(state.confidence);
          const confidencePct = Math.round(state.confidence * 100);

          // Count elements by type
          const typeCounts = new Map<string, number>();
          for (const eid of state.element_ids) {
            const prefix = getElementTypePrefix(eid);
            typeCounts.set(prefix, (typeCounts.get(prefix) ?? 0) + 1);
          }
          const sortedTypes = Array.from(typeCounts.entries()).sort(
            (a, b) => b[1] - a[1],
          );

          return (
            <button
              key={state.state_id}
              onClick={() =>
                onSelectState(isSelected ? null : state.state_id)
              }
              className={`w-full text-left p-2.5 rounded border transition-colors ${
                isSelected
                  ? "bg-brand-primary/10 border-brand-primary/30"
                  : "bg-bg-tertiary border-border-secondary hover:border-text-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text-primary truncate">
                  {state.name}
                </span>
                <div className="flex items-center gap-2 text-xs shrink-0 ml-2">
                  <span className="text-text-secondary">
                    {state.element_ids.length} el
                  </span>
                  <span className={confidenceColor}>{confidencePct}%</span>
                </div>
              </div>

              {/* Element type badges */}
              {sortedTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {sortedTypes.slice(0, 5).map(([prefix, count]) => {
                    const style = getElementTypeStyle(`${prefix}:dummy`);
                    return (
                      <span
                        key={prefix}
                        className={`px-1.5 py-0.5 text-[10px] rounded border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {prefix}: {count}
                      </span>
                    );
                  })}
                  {sortedTypes.length > 5 && (
                    <span className="px-1 py-0.5 text-[10px] text-text-muted">
                      +{sortedTypes.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Description preview */}
              {state.description && (
                <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                  {state.description}
                </p>
              )}
            </button>
          );
        })}

        {filteredStates.length === 0 && (
          <p className="text-xs text-text-muted italic text-center py-4">
            {filter ? "No states match the filter" : "No states in this config"}
          </p>
        )}
      </div>
    </div>
  );
}
