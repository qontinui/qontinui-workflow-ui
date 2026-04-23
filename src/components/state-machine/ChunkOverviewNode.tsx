/**
 * Custom ReactFlow node for a chunk in the chunked-graph overview.
 *
 * Rendered at the top level when a state machine is too large for the
 * single-view renderer. Clicking a chunk drills into it; see
 * `ChunkedGraphView` for the drill-in behavior.
 *
 * Visually distinct from `StateMachineStateNode` (smaller, different
 * accent color, icon per chunk kind) so the user knows they are at the
 * overview level, not looking at individual states.
 */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Play, RefreshCw, ArrowRight } from "lucide-react";
import type { Chunk } from "@qontinui/workflow-utils";

export interface ChunkNodeData {
  chunk: Chunk;
  matchCount?: number;
}

function ChunkOverviewNodeInner({ data, selected }: NodeProps) {
  const { chunk, matchCount } = data as unknown as ChunkNodeData;
  const stateCount = chunk.stateIds.length;
  const plural = stateCount !== 1 ? "s" : "";
  const matchPlural = matchCount !== 1 ? "es" : "";

  return (
    <div data-chunk-id={chunk.id} style={{ width: 200 }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      />

      <div
        className={`
          rounded-lg border-2 px-3 py-2.5 shadow-md
          transition-all duration-150
          ${
            selected
              ? "border-indigo-400 bg-indigo-500/15 ring-2 ring-indigo-400/40 shadow-indigo-500/20 shadow-lg"
              : chunk.containsInitialState
                ? "border-indigo-400/70 bg-bg-secondary/80 hover:border-indigo-300 hover:shadow-lg"
                : "border-indigo-500/40 bg-bg-secondary/60 hover:border-indigo-400 hover:shadow-lg"
          }
        `}
      >
        {/* Header: initial-state badge + kind icon + name */}
        <div className="flex items-center gap-1.5 mb-1">
          {chunk.containsInitialState && (
            <Play
              className="size-3 text-yellow-400 fill-current shrink-0"
              aria-label="Contains initial state"
            />
          )}
          {chunk.kind === "scc" ? (
            <RefreshCw
              className="size-3 text-indigo-300 shrink-0"
              aria-label="Strongly-connected component"
            />
          ) : (
            <ArrowRight
              className="size-3 text-indigo-300 shrink-0"
              aria-label="Linear chain"
            />
          )}
          <span className="text-xs font-medium text-text-primary truncate flex-1">
            {chunk.name}
          </span>
        </div>

        {/* Footer: state count + optional match badge */}
        <div className="text-[10px] text-text-muted">
          {stateCount} state{plural}
          {matchCount !== undefined && matchCount > 0 && (
            <span className="text-brand-primary ml-1">
              &middot; {matchCount} match{matchPlural}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      />
    </div>
  );
}

export const ChunkOverviewNode = memo(ChunkOverviewNodeInner);
