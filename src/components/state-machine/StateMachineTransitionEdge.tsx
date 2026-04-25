/**
 * Shared custom ReactFlow edge for state machine transitions.
 *
 * Renders a bezier curve with an inline label showing transition name,
 * action type icons, path cost, and action count.
 */

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import {
  MousePointer,
  Type as TypeIcon,
  ListFilter,
  Clock,
  Globe,
  Eye,
} from "lucide-react";
import type { TransitionEdgeData, StandardActionType } from "@qontinui/shared-types";

const ACTION_ICONS: Partial<Record<StandardActionType, typeof MousePointer>> = {
  click: MousePointer,
  type: TypeIcon,
  select: ListFilter,
  wait: Clock,
  navigate: Globe,
};

const ACTION_COLORS: Partial<Record<StandardActionType, string>> = {
  click: "text-blue-400",
  type: "text-amber-400",
  select: "text-purple-400",
  wait: "text-gray-400",
  navigate: "text-cyan-400",
};

function StateMachineTransitionEdgeInner(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
    selected,
  } = props;

  // Local superset of the schema-generated shape: ChunkedGraphView's
  // nested-leaf path passes an extra `isWeakBridge` flag via `data` to
  // request the amber choke-point accent (Phase 3 of the giant-SCC plan).
  // Kept as an inline cast rather than a shared-types change because
  // TransitionEdgeData is auto-generated from Rust and the flag is purely
  // a UI hint with no backing field on the transition.
  const edgeData = data as unknown as TransitionEdgeData & { isWeakBridge?: boolean };

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHighlighted = edgeData?.isHighlighted ?? false;
  const isActive = isHighlighted || selected;
  const isWeakBridge = edgeData?.isWeakBridge === true;
  const actionTypes = edgeData?.actionTypes ?? [];
  const uniqueActionTypes = [...new Set(actionTypes)];

  // Stroke priority: active (selection / highlighted path) wins over the
  // weak-bridge accent so users can still see what they have selected.
  const strokeColor = isActive
    ? "var(--brand-primary)"
    : isWeakBridge
      ? "var(--amber-400, #fbbf24)"
      : "var(--border-secondary)";
  const strokeWidth = isActive ? 2.5 : isWeakBridge ? 3 : 1.5;

  return (
    <>
      {/* Invisible wider path for easy clicking */}
      <BaseEdge
        path={edgePath}
        style={{ stroke: "transparent", strokeWidth: 20, cursor: "pointer" }}
      />
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          transition: "stroke 0.15s, stroke-width 0.15s",
        }}
      />
      {edgeData?.name && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto cursor-pointer"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            title={isWeakBridge ? "Choke point — unique path" : undefined}
          >
            <div
              className={`
                flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border shadow-xs
                transition-all duration-150
                ${
                  isActive
                    ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/20"
                    : "bg-bg-primary/95 text-text-muted border-border-secondary hover:border-brand-primary/40 backdrop-blur-xs"
                }
              `}
            >
              {/* Action type icons */}
              {uniqueActionTypes.length > 0 && (
                <span className="flex items-center gap-0.5">
                  {uniqueActionTypes.slice(0, 3).map((actionType) => {
                    const Icon = ACTION_ICONS[actionType];
                    const colorClass = isActive ? "" : (ACTION_COLORS[actionType] ?? "text-gray-400");
                    return Icon ? (
                      <Icon key={actionType} className={`size-3 ${colorClass}`} />
                    ) : null;
                  })}
                </span>
              )}
              <span className="font-medium max-w-[120px] truncate">
                {edgeData.name}
              </span>
              {edgeData.firstActionTarget && !isActive && (
                <span className="opacity-50 text-[8px] max-w-[60px] truncate">
                  {edgeData.firstActionTarget}
                </span>
              )}
              {edgeData.pathCost !== 1.0 && (
                <span className="opacity-60 text-[9px]">
                  cost:{edgeData.pathCost}
                </span>
              )}
              {edgeData.actionCount > 1 && (
                <span className={`text-[8px] px-1 rounded-full ${isActive ? "bg-white/20" : "bg-bg-secondary"}`}>
                  {edgeData.actionCount}
                </span>
              )}
              {edgeData.staysVisible && (
                <Eye className={`size-3 ${isActive ? "text-green-200" : "text-green-400"}`} />
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const StateMachineTransitionEdge = memo(StateMachineTransitionEdgeInner);
