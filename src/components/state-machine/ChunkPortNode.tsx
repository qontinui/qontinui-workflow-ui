/**
 * Phantom "port" node for the drilled-chunk view.
 *
 * Represents a cross-chunk entry (input port) or exit (output port) as a
 * clickable placeholder so the user can see where transitions go when a
 * single chunk is isolated. Dashed border + faded colors make these
 * visually distinct from real state nodes.
 *
 * The parent `ChunkedGraphView` wires a click handler via
 * `ChunkPortNodeData.onNavigate` — clicking navigates the chunked view to
 * the adjacent chunk.
 */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface ChunkPortNodeData {
  /** "input" = incoming cross-chunk edge; "output" = outgoing. */
  direction: "input" | "output";
  /** Adjacent chunk id this port represents. */
  adjacentChunkId: string;
  /** Adjacent chunk name (used in the label). */
  adjacentChunkName: string;
  /** Click handler — navigate to `adjacentChunkId`. */
  onNavigate?: (chunkId: string) => void;
}

function ChunkPortNodeInner({ data }: NodeProps) {
  const { direction, adjacentChunkId, adjacentChunkName, onNavigate } =
    data as unknown as ChunkPortNodeData;
  const isInput = direction === "input";
  const label = isInput
    ? `← ${adjacentChunkName}`
    : `${adjacentChunkName} →`;

  return (
    <div
      style={{ width: 160 }}
      onClick={(e) => {
        if (!onNavigate) return;
        e.stopPropagation();
        onNavigate(adjacentChunkId);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!onNavigate) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onNavigate(adjacentChunkId);
        }
      }}
      title={
        isInput
          ? `Incoming from ${adjacentChunkName} - click to navigate`
          : `Outgoing to ${adjacentChunkName} - click to navigate`
      }
      className="cursor-pointer"
    >
      {/* Input ports only need a SOURCE handle (they feed into real states). */}
      {isInput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2 !h-2 !border !border-bg-primary !bg-indigo-400/60"
        />
      )}
      {/* Output ports only need a TARGET handle (real states feed into them). */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !border !border-bg-primary !bg-indigo-400/60"
        />
      )}

      <div
        className={`
          rounded-md border-2 border-dashed px-2 py-1.5
          bg-bg-secondary/40 border-indigo-400/50
          text-indigo-300/80 hover:bg-indigo-500/10 hover:text-indigo-200
          hover:border-indigo-300 transition-colors
          flex items-center gap-1.5
        `}
      >
        {isInput ? (
          <ArrowLeft className="size-3 shrink-0" />
        ) : null}
        <span className="text-[10px] font-medium truncate flex-1">
          {label}
        </span>
        {!isInput ? (
          <ArrowRight className="size-3 shrink-0" />
        ) : null}
      </div>
    </div>
  );
}

export const ChunkPortNode = memo(ChunkPortNodeInner);
