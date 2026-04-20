/**
 * Pathfinding panel for querying paths between states.
 *
 * Provides state selectors for source and target, algorithm selection,
 * and displays the resulting path with step details and costs.
 *
 * Uses the client-side pathfinding from workflow-utils for the graph editor
 * preview. Runtime navigation uses the qontinui Python library.
 */

import { useState, useCallback } from "react";
import type {
  StateMachineState,
  StateMachineTransition,
  PathfindingResult,
} from "@qontinui/shared-types";
import {
  findPath,
  type PathfindingAlgorithm,
} from "@qontinui/workflow-utils";

// =============================================================================
// Props
// =============================================================================

export interface PathfindingPanelProps {
  /** All states in the config */
  states: StateMachineState[];
  /** All transitions in the config */
  transitions: StateMachineTransition[];
  /** Optional: called when a path is found (e.g., to highlight on graph) */
  onPathFound?: (result: PathfindingResult) => void;
  /** Optional: custom pathfinding function (e.g., server-side via API) */
  onFindPath?: (
    fromStates: string[],
    targetStates: string[],
  ) => Promise<PathfindingResult>;
}

// =============================================================================
// Component
// =============================================================================

export function PathfindingPanel({
  states,
  transitions,
  onPathFound,
  onFindPath,
}: PathfindingPanelProps) {
  const [fromStateId, setFromStateId] = useState<string>("");
  const [targetStateId, setTargetStateId] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithm>("dijkstra");
  const [result, setResult] = useState<PathfindingResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleFind = useCallback(async () => {
    if (!fromStateId || !targetStateId) return;
    setIsSearching(true);
    try {
      let pathResult: PathfindingResult;

      if (onFindPath) {
        // Use custom pathfinding (e.g., server-side)
        pathResult = await onFindPath([fromStateId], [targetStateId]);
      } else {
        // Use client-side pathfinding
        pathResult = findPath(
          transitions,
          { from_states: [fromStateId], target_states: [targetStateId] },
          algorithm,
        );
      }

      setResult(pathResult);
      onPathFound?.(pathResult);
    } finally {
      setIsSearching(false);
    }
  }, [
    fromStateId,
    targetStateId,
    algorithm,
    transitions,
    onFindPath,
    onPathFound,
  ]);

  const clearResult = useCallback(() => {
    setResult(null);
    onPathFound?.({ found: false, steps: [], total_cost: 0 });
  }, [onPathFound]);

  // Get state name by state_id
  const stateName = (stateId: string) =>
    states.find((s) => s.state_id === stateId)?.name ?? stateId;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-sm font-semibold text-text-primary">Pathfinding</h3>

      {/* State selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">From</label>
          <select
            value={fromStateId}
            onChange={(e) => setFromStateId(e.target.value)}
            className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
            style={{ colorScheme: "dark" }}
          >
            <option value="">Select state...</option>
            {states.map((s) => (
              <option key={s.state_id} value={s.state_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">To</label>
          <select
            value={targetStateId}
            onChange={(e) => setTargetStateId(e.target.value)}
            className="w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
            style={{ colorScheme: "dark" }}
          >
            <option value="">Select state...</option>
            {states.map((s) => (
              <option key={s.state_id} value={s.state_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Algorithm selector + find button */}
      <div className="flex gap-2">
        {!onFindPath && (
          <select
            value={algorithm}
            onChange={(e) =>
              setAlgorithm(e.target.value as PathfindingAlgorithm)
            }
            className="px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
            style={{ colorScheme: "dark" }}
          >
            <option value="dijkstra">Dijkstra (cheapest)</option>
            <option value="bfs">BFS (shortest)</option>
          </select>
        )}
        <button
          onClick={handleFind}
          disabled={!fromStateId || !targetStateId || isSearching}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          <span>{isSearching ? "Searching..." : "Find Path"}</span>
        </button>
        {result && (
          <button
            onClick={clearResult}
            className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border-secondary rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="border-t border-border-secondary pt-3">
          {result.found ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-400 font-medium">
                  Path found ({result.steps.length} step
                  {result.steps.length !== 1 ? "s" : ""})
                </span>
                <span className="text-xs text-text-secondary">
                  Total cost: {result.total_cost.toFixed(1)}
                </span>
              </div>

              {result.steps.length === 0 ? (
                <p className="text-xs text-text-secondary italic">
                  Already at target state
                </p>
              ) : (
                <div className="space-y-1.5">
                  {result.steps.map((step, i) => (
                    <div
                      key={`${i}-${step.transition_name}`}
                      className="p-2 bg-bg-tertiary border border-border-secondary rounded text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-primary">
                          {i + 1}. {step.transition_name}
                        </span>
                        <span className="text-text-secondary">
                          cost: {step.path_cost.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-text-secondary">
                        {step.from_states.map(stateName).join(", ")}
                        {" → "}
                        {step.activate_states.map(stateName).join(", ")}
                        {step.exit_states.length > 0 && (
                          <span className="text-red-400">
                            {" (exits: "}
                            {step.exit_states.map(stateName).join(", ")}
                            {")"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-red-400">
              {result.error ?? "No path found between the specified states"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
