/**
 * Shared custom ReactFlow node for state machine states.
 *
 * Renders each state as a card with element grid, confidence badge,
 * transition count indicators, and selection/initial state styling.
 *
 * Supports optional drag-and-drop via the `onStartElementDrag` callback
 * on StateNodeData.
 */

import { memo, useMemo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Layers,
  Lock,
  Play,
  MousePointer,
  Type as TypeIcon,
  Globe,
  Hash,
  Box,
  ArrowUpRight,
  ArrowDownLeft,
  Link2,
  GripVertical,
} from "lucide-react";
import type { StateNodeData } from "@qontinui/shared-types";

// Size tiers for dynamic node sizing based on element count
const SIZE_TIERS = {
  small: { cardWidth: 200, gridCols: 3, gridMaxWidth: 170, maxElements: 6, tileSize: 52 },
  medium: { cardWidth: 260, gridCols: 4, gridMaxWidth: 224, maxElements: 12, tileSize: 52 },
  large: { cardWidth: 320, gridCols: 5, gridMaxWidth: 280, maxElements: 20, tileSize: 52 },
  xlarge: { cardWidth: 380, gridCols: 6, gridMaxWidth: 340, maxElements: 30, tileSize: 52 },
};

function getCardSize(elementCount: number) {
  if (elementCount <= 4) return SIZE_TIERS.small;
  if (elementCount <= 10) return SIZE_TIERS.medium;
  if (elementCount <= 18) return SIZE_TIERS.large;
  return SIZE_TIERS.xlarge;
}

/** Element type styling */
const ELEMENT_STYLES: Record<
  string,
  { icon: typeof Hash; color: string; tileBg: string; tileBorder: string; hoverBg: string }
> = {
  testid: { icon: Hash, color: "text-blue-400", tileBg: "bg-blue-500/10", tileBorder: "border-blue-500/20", hoverBg: "hover:bg-blue-500/30" },
  role: { icon: MousePointer, color: "text-green-400", tileBg: "bg-green-500/10", tileBorder: "border-green-500/20", hoverBg: "hover:bg-green-500/30" },
  text: { icon: TypeIcon, color: "text-amber-400", tileBg: "bg-amber-500/10", tileBorder: "border-amber-500/20", hoverBg: "hover:bg-amber-500/30" },
  ui: { icon: Box, color: "text-purple-400", tileBg: "bg-purple-500/10", tileBorder: "border-purple-500/20", hoverBg: "hover:bg-purple-500/30" },
  url: { icon: Globe, color: "text-cyan-400", tileBg: "bg-cyan-500/10", tileBorder: "border-cyan-500/20", hoverBg: "hover:bg-cyan-500/30" },
  nav: { icon: Globe, color: "text-cyan-400", tileBg: "bg-cyan-500/10", tileBorder: "border-cyan-500/20", hoverBg: "hover:bg-cyan-500/30" },
  other: { icon: Layers, color: "text-gray-400", tileBg: "bg-gray-500/10", tileBorder: "border-gray-500/20", hoverBg: "hover:bg-gray-500/30" },
};

export function getElementStyle(elementId: string) {
  const colonIdx = elementId.indexOf(":");
  const prefix = colonIdx > 0 ? elementId.slice(0, colonIdx) : "other";
  const label = colonIdx > 0 ? elementId.slice(colonIdx + 1) : elementId;
  const style = ELEMENT_STYLES[prefix] ?? ELEMENT_STYLES.other!;
  return { ...style, label, prefix };
}

function summarizeElementTypes(elementIds: string[]) {
  const counts = new Map<string, number>();
  for (const eid of elementIds) {
    const style = getElementStyle(eid);
    counts.set(style.prefix, (counts.get(style.prefix) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([prefix, count]) => ({
      prefix,
      count,
      color: (ELEMENT_STYLES[prefix] ?? ELEMENT_STYLES.other!).color,
    }));
}

function StateMachineStateNodeInner({ data }: NodeProps) {
  const nodeData = data as unknown as StateNodeData;
  const {
    stateId,
    name,
    elementCount,
    confidence,
    elementIds,
    description,
    isBlocking,
    isSelected,
    isInitial,
    isDropTarget,
    onStartElementDrag,
    outgoingCount,
    incomingCount,
    elementThumbnails,
  } = nodeData;

  const confidencePercent = Math.round(confidence * 100);
  const cardSize = getCardSize(elementCount);
  const elementSummary = useMemo(() => summarizeElementTypes(elementIds), [elementIds]);
  const hasConnections = (outgoingCount ?? 0) > 0 || (incomingCount ?? 0) > 0;


  return (
    <div style={{ width: cardSize.cardWidth }} data-id={stateId}>
      <Handle
        type="target"
        position={Position.Top}
        className={`!w-3 !h-3 !border-2 !border-bg-primary ${
          isSelected ? "!bg-brand-primary !shadow-sm !shadow-brand-primary/40" : "!bg-brand-primary"
        }`}
      />

      <div
        className={`
          rounded-lg border-2 px-3 py-2.5 shadow-md
          transition-all duration-150 relative
          ${
            isDropTarget
              ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/40 shadow-green-500/20 shadow-lg"
              : isSelected
                ? "border-brand-primary bg-bg-secondary ring-2 ring-brand-primary/30 shadow-brand-primary/20 shadow-lg"
                : isBlocking
                  ? "border-amber-400 bg-amber-950/20 shadow-amber-500/10"
                  : "border-border-secondary bg-bg-primary hover:border-brand-primary/50 hover:shadow-lg"
          }
        `}
      >
        {/* Drop target overlay */}
        {isDropTarget && (
          <div className="absolute inset-0 rounded-lg bg-green-500/5 pointer-events-none z-0" />
        )}

        {/* Initial state badge */}
        {isInitial && (
          <div className="absolute -top-3 -left-3 z-10">
            <div className="flex items-center gap-0.5 bg-[#FFD700] text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-yellow-500/30">
              <Play className="size-2.5 fill-current" />
              <span>START</span>
            </div>
          </div>
        )}

        {/* Transition count badges */}
        {(outgoingCount ?? 0) > 0 && (
          <div className="absolute -top-2 -right-2 z-10">
            <div
              className="flex items-center gap-0.5 bg-brand-secondary/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm"
              title={`${outgoingCount} outgoing`}
            >
              <ArrowUpRight className="size-2" />
              <span>{outgoingCount}</span>
            </div>
          </div>
        )}
        {(incomingCount ?? 0) > 0 && (
          <div className="absolute -bottom-2 -right-2 z-10">
            <div
              className="flex items-center gap-0.5 bg-brand-primary/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm"
              title={`${incomingCount} incoming`}
            >
              <ArrowDownLeft className="size-2" />
              <span>{incomingCount}</span>
            </div>
          </div>
        )}

        {/* No connections indicator */}
        {!hasConnections && elementIds.length > 0 && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-0.5 bg-bg-secondary/90 text-text-muted text-[7px] px-1.5 py-0.5 rounded-full shadow-sm border border-border-secondary">
              <Link2 className="size-2" />
              <span>no links</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-1 relative z-[1]">
          {isBlocking ? (
            <Lock className="size-3.5 text-amber-500 shrink-0" />
          ) : (
            <Layers className="size-3.5 text-brand-primary shrink-0" />
          )}
          <span className="text-sm font-semibold text-text-primary truncate flex-1">
            {name}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[10px] text-text-muted mb-1.5 line-clamp-2 relative z-[1]">
            {description}
          </p>
        )}

        {/* Element grid */}
        {elementIds.length > 0 && (
          <div
            className="grid gap-1 mb-2 mx-auto relative z-[1]"
            style={{
              gridTemplateColumns: `repeat(${cardSize.gridCols}, 1fr)`,
              maxWidth: cardSize.gridMaxWidth,
            }}
          >
            {elementIds.slice(0, cardSize.maxElements).map((elementId) => {
              const style = getElementStyle(elementId);
              const Icon = style.icon;
              const thumbnail = elementThumbnails?.[elementId] ?? elementThumbnails?.[style.label];
              const thumbnailSrc = thumbnail
                ? thumbnail.startsWith("data:") ? thumbnail : `data:image/png;base64,${thumbnail}`
                : undefined;
              return (
                <div
                  key={elementId}
                  className={`
                    relative group rounded-md overflow-hidden
                    ${style.tileBg} border ${style.tileBorder}
                    ${style.hoverBg} hover:shadow-md hover:z-10 hover:scale-105
                    ${onStartElementDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
                    transition-all duration-100
                  `}
                  style={{ aspectRatio: "1 / 1" }}
                  title={onStartElementDrag ? `${elementId}\nDrag to create transition` : elementId}
                  draggable={!!onStartElementDrag}
                  onDragStart={(e) => {
                    if (!onStartElementDrag) return;
                    e.stopPropagation();
                    const isMoveOperation = e.altKey;
                    e.dataTransfer.setData(
                      "application/ui-bridge-element-drag",
                      JSON.stringify({
                        sourceStateId: stateId,
                        elementId,
                        isMoveOperation,
                      }),
                    );
                    e.dataTransfer.effectAllowed = isMoveOperation ? "move" : "link";
                    onStartElementDrag(stateId, elementId);
                  }}
                >
                  {thumbnailSrc ? (
                    <img
                      src={thumbnailSrc}
                      alt={style.label}
                      className="w-full h-full object-cover rounded-sm"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full px-0.5 py-1">
                      <Icon className={`size-3.5 ${style.color} shrink-0`} />
                      <span className={`text-[7px] ${style.color} truncate w-full text-center mt-0.5 leading-tight`}>
                        {style.label}
                      </span>
                    </div>
                  )}

                  {/* Drag handle indicator - appears on hover */}
                  {onStartElementDrag && (
                    <div
                      className="nodrag absolute top-0 right-0 p-0.5 opacity-0 group-hover:opacity-80 transition-opacity z-10"
                      title="Drag to create transition"
                    >
                      <GripVertical className="size-2.5 text-text-muted" />
                    </div>
                  )}
                </div>
              );
            })}
            {elementIds.length > cardSize.maxElements && (
              <div
                className="rounded-md bg-bg-secondary text-text-muted flex items-center justify-center border border-border-secondary"
                style={{ aspectRatio: "1 / 1" }}
              >
                <span className="text-[9px] font-medium">
                  +{elementIds.length - cardSize.maxElements}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-text-muted relative z-[1]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 text-[10px] bg-bg-tertiary rounded border border-border-secondary">
              {elementCount} el
            </span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded border ${
                confidencePercent >= 80
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : confidencePercent >= 50
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {confidencePercent}%
            </span>
          </div>
          {elementSummary.length > 1 && (
            <div className="flex items-center gap-1">
              {elementSummary.slice(0, 4).map(({ prefix, count, color }) => {
                const Icon = getElementStyle(`${prefix}:x`).icon;
                return (
                  <span key={prefix} className={`flex items-center gap-0.5 text-[8px] ${color}`} title={`${count} ${prefix}`}>
                    <Icon className="size-2" />
                    {count}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`!w-3 !h-3 !border-2 !border-bg-primary ${
          isSelected ? "!bg-brand-secondary !shadow-sm !shadow-brand-secondary/40" : "!bg-brand-secondary"
        }`}
      />
    </div>
  );
}

export const StateMachineStateNode = memo(StateMachineStateNodeInner);
