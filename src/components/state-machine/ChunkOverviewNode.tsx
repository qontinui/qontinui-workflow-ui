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

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Play,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Pencil,
} from "lucide-react";
import type { Chunk } from "@qontinui/workflow-utils";

export interface ChunkNodeData {
  chunk: Chunk;
  matchCount?: number;
  /**
   * Names of the states contained in this chunk, used to populate the
   * hover tooltip. Supplied by the chunk node builder; if absent the
   * tooltip degrades to showing only the chunk name.
   */
  stateNames?: string[];
  /**
   * True when this chain chunk is currently expanded inline in the
   * overview (so that the chevron renders rotated). Ignored for
   * non-chain chunks.
   */
  isExpanded?: boolean;
  /**
   * Toggle inline-expansion of a chain chunk. When provided AND the
   * chunk is a chain, a chevron toggle button is rendered on the card
   * header. Clicking the toggle calls this (and swallows the event so
   * the body click — which drills in — doesn't also fire).
   */
  onToggleExpand?: (chunkId: string) => void;
  /**
   * User-chosen label override. If set and non-empty, takes precedence
   * over `chunk.name` in the rendered card header and tooltip.
   */
  userLabel?: string;
  /**
   * Called when the user saves a new label. Passing an empty string
   * removes the override (the view reverts to the auto-derived name).
   * When this prop is absent the rename affordance (pencil icon) is not
   * rendered — the library is effectively read-only for renames.
   */
  onSaveLabel?: (chunkId: string, label: string) => void;
}

/** Build the `title` tooltip string for a chunk card. */
function buildTooltip(chunkName: string, stateNames: string[] | undefined): string {
  if (!stateNames || stateNames.length === 0) return chunkName;
  const visible = stateNames.slice(0, 15);
  const overflow = stateNames.length > 15
    ? `\n… +${stateNames.length - 15} more`
    : "";
  return `${chunkName}\n\n${visible.join("\n")}${overflow}`;
}

function ChunkOverviewNodeInner({ data, selected }: NodeProps) {
  const {
    chunk,
    matchCount,
    stateNames,
    isExpanded,
    onToggleExpand,
    userLabel,
    onSaveLabel,
  } = data as unknown as ChunkNodeData;
  const stateCount = chunk.stateIds.length;
  const plural = stateCount !== 1 ? "s" : "";
  const matchPlural = matchCount !== 1 ? "es" : "";
  const showExpandToggle = chunk.kind === "chain" && typeof onToggleExpand === "function";
  const showRenameAffordance = typeof onSaveLabel === "function";

  const effectiveName = userLabel && userLabel.length > 0 ? userLabel : chunk.name;

  // --- Inline rename state ---
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(effectiveName);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep draft in sync when the effective name changes while NOT editing.
  // If we're actively editing, don't clobber the user's in-flight input.
  useEffect(() => {
    if (!isEditing) setDraft(effectiveName);
  }, [effectiveName, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!showRenameAffordance) return;
      setDraft(effectiveName);
      setIsEditing(true);
    },
    [effectiveName, showRenameAffordance],
  );

  // Reentrancy guard: both blur and Enter/keydown can fire a commit;
  // swallow the second call to avoid double-save.
  const hasCommittedRef = useRef(false);

  const commit = useCallback(() => {
    if (!onSaveLabel) {
      setIsEditing(false);
      return;
    }
    if (hasCommittedRef.current) return;
    hasCommittedRef.current = true;
    const trimmed = draft.trim();
    // Empty string signals delete/revert-to-auto. If the draft equals the
    // existing override, still send it so callers have a chance to persist
    // identical values if they want.
    onSaveLabel(chunk.id, trimmed);
    setIsEditing(false);
  }, [draft, chunk.id, onSaveLabel]);

  const cancel = useCallback(() => {
    hasCommittedRef.current = true;
    setDraft(effectiveName);
    setIsEditing(false);
  }, [effectiveName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    },
    [commit, cancel],
  );

  const handleBlur = useCallback(() => {
    commit();
  }, [commit]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(e.target.value);
    },
    [],
  );

  // Reset the reentrancy guard whenever we (re-)enter edit mode.
  useEffect(() => {
    if (isEditing) {
      hasCommittedRef.current = false;
    }
  }, [isEditing]);

  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const handleToggleClick = useCallback(
    (e: React.MouseEvent) => {
      // Prevent the toggle click from bubbling to the card body, which
      // would otherwise trigger drill-in via ReactFlow node selection.
      e.stopPropagation();
      e.preventDefault();
      onToggleExpand?.(chunk.id);
    },
    [onToggleExpand, chunk.id],
  );

  const handleToggleMouseDown = useCallback((e: React.MouseEvent) => {
    // ReactFlow begins selection on mousedown — stop it here too so the
    // toggle doesn't race with drill-in selection.
    e.stopPropagation();
  }, []);

  return (
    <div data-chunk-id={chunk.id} style={{ width: 200 }}>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      />

      <div
        title={buildTooltip(effectiveName, stateNames)}
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
        {/* Header: initial-state badge + kind icon + name (+ optional rename + optional expand toggle) */}
        <div className="flex items-center gap-1.5 mb-1 group">
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
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              className="flex-1 min-w-0 text-xs font-medium text-text-primary bg-bg-primary border border-indigo-400 rounded px-1 py-0.5 outline-hidden focus:ring-1 focus:ring-indigo-400 nodrag"
              placeholder={chunk.name}
              aria-label="Chunk label"
            />
          ) : (
            <span className="text-xs font-medium text-text-primary truncate flex-1">
              {effectiveName}
            </span>
          )}
          {!isEditing && showRenameAffordance && (
            <button
              type="button"
              onClick={handleStartEdit}
              onMouseDown={stopPropagation}
              className="shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-300/60 hover:text-indigo-200 transition-colors nodrag opacity-0 group-hover:opacity-100"
              title="Rename chunk"
              aria-label="Rename chunk"
            >
              <Pencil className="size-3" />
            </button>
          )}
          {!isEditing && showExpandToggle && (
            <button
              type="button"
              onClick={handleToggleClick}
              onMouseDown={handleToggleMouseDown}
              className="shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-colors nodrag"
              title={isExpanded ? "Collapse chain" : "Expand chain inline"}
              aria-label={isExpanded ? "Collapse chain" : "Expand chain inline"}
            >
              {isExpanded ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>
          )}
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
