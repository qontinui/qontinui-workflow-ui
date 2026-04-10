/**
 * Force-directed spatial visualization of states as circles on a canvas.
 *
 * Extracted from StateViewPanel to follow the Single Responsibility Principle.
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import type {
  StateMachineState,
  StateMachineTransition,
} from "@qontinui/shared-types";
import { STATE_COLORS, computeSpatialLayout } from "@qontinui/workflow-utils";

// =============================================================================
// Props
// =============================================================================

export interface SpatialCanvasProps {
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  selectedStateId: string | null;
  onSelectState: (stateId: string | null) => void;
}

// =============================================================================
// Component
// =============================================================================

export function SpatialCanvas({
  states,
  transitions,
  selectedStateId,
  onSelectState,
}: SpatialCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

  const layout = useMemo(
    () =>
      computeSpatialLayout(
        states,
        transitions,
        canvasSize.width,
        canvasSize.height,
      ),
    [states, transitions, canvasSize.width, canvasSize.height],
  );

  // Build shared element data
  const sharedElements = useMemo(() => {
    const elementStateMap = new Map<string, Set<string>>();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, new Set());
        elementStateMap.get(eid)!.add(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCanvasSize({
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height),
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr * zoom, dpr * zoom);

    ctx.clearRect(0, 0, canvasSize.width / zoom, canvasSize.height / zoom);

    // Draw shared element connections (thin dashed lines)
    for (const [, stateIds] of sharedElements) {
      if (stateIds.size < 2) continue;
      const ids = Array.from(stateIds);
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const p1 = layout.get(ids[i]!);
          const p2 = layout.get(ids[j]!);
          if (!p1 || !p2) continue;

          ctx.beginPath();
          ctx.strokeStyle = "rgba(128, 128, 128, 0.06)";
          ctx.lineWidth = 0.5;
          ctx.setLineDash([4, 4]);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Draw transition arrows
    for (const t of transitions) {
      for (const from of t.from_states) {
        for (const to of t.activate_states) {
          const p1 = layout.get(from);
          const p2 = layout.get(to);
          if (!p1 || !p2) continue;

          const isHighlighted =
            from === selectedStateId ||
            to === selectedStateId ||
            from === hoveredStateId ||
            to === hoveredStateId;

          ctx.beginPath();
          ctx.strokeStyle = isHighlighted
            ? "#6366f1"
            : "rgba(128, 128, 128, 0.2)";
          ctx.lineWidth = isHighlighted ? 2 : 1;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const nx = dx / dist;
          const ny = dy / dist;
          const startX = p1.x + nx * p1.radius;
          const startY = p1.y + ny * p1.radius;
          const endX = p2.x - nx * p2.radius;
          const endY = p2.y - ny * p2.radius;

          const cpx = (startX + endX) / 2 - ny * 20;
          const cpy = (startY + endY) / 2 + nx * 20;

          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(cpx, cpy, endX, endY);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(endY - cpy, endX - cpx);
          const arrowSize = 6;
          ctx.beginPath();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6),
          );
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6),
          );
          ctx.closePath();
          ctx.fill();

          // Draw transition label at midpoint if highlighted
          if (isHighlighted) {
            const labelX = (startX + endX) / 2 - ny * 10;
            const labelY = (startY + endY) / 2 + nx * 10;
            ctx.font = "9px system-ui, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(t.name, labelX, labelY);
          }
        }
      }
    }

    // Draw state circles
    for (let i = 0; i < states.length; i++) {
      const state = states[i]!;
      const pos = layout.get(state.state_id);
      if (!pos) continue;

      const color = STATE_COLORS[i % STATE_COLORS.length]!;
      const isSelected = state.state_id === selectedStateId;
      const isHovered = state.state_id === hoveredStateId;
      const isInitial = state.extra_metadata?.initial === true;

      // Circle background
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected || isHovered ? color.bgSolid : color.bg;
      ctx.fill();
      ctx.strokeStyle = color.border;
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1.5;
      ctx.stroke();

      // Selection ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = color.border;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Initial state indicator
      if (isInitial) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - pos.radius - 8, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // State name label
      ctx.fillStyle =
        isSelected || isHovered ? "#fff" : "rgba(255, 255, 255, 0.85)";
      ctx.font = `${isSelected ? "bold " : ""}${Math.max(9, Math.min(12, pos.radius / 3))}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let displayName = state.name;
      const maxWidth = pos.radius * 1.6;
      while (
        ctx.measureText(displayName).width > maxWidth &&
        displayName.length > 3
      ) {
        displayName = displayName.slice(0, -2) + "\u2026";
      }
      ctx.fillText(displayName, pos.x, pos.y);

      // Element count below
      ctx.font = "9px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(
        `${state.element_ids.length} el`,
        pos.x,
        pos.y + pos.radius + 12,
      );
    }
  }, [
    canvasSize,
    states,
    transitions,
    layout,
    selectedStateId,
    hoveredStateId,
    sharedElements,
    zoom,
  ]);

  const getStateAtPoint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / zoom;
      const y = (clientY - rect.top) / zoom;

      for (let i = states.length - 1; i >= 0; i--) {
        const state = states[i]!;
        const pos = layout.get(state.state_id);
        if (!pos) continue;
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (dx * dx + dy * dy <= pos.radius * pos.radius) {
          return state.state_id;
        }
      }
      return null;
    },
    [states, layout, zoom],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setHoveredStateId(getStateAtPoint(e.clientX, e.clientY));
    },
    [getStateAtPoint],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const stateId = getStateAtPoint(e.clientX, e.clientY);
      onSelectState(stateId === selectedStateId ? null : stateId);
    },
    [getStateAtPoint, onSelectState, selectedStateId],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-bg-secondary"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          cursor: hoveredStateId ? "pointer" : "default",
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredStateId(null)}
      />

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary"
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          title="Zoom in"
        >
          <ZoomIn className="size-3.5" />
        </button>
        <button
          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary"
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          title="Zoom out"
        >
          <ZoomOut className="size-3.5" />
        </button>
        <button
          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary"
          onClick={() => setZoom(1)}
          title="Reset zoom"
        >
          <Maximize className="size-3.5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 text-[10px] text-text-muted bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50">
        <div className="flex items-center gap-3">
          <span>{states.length} states</span>
          <span>{transitions.length} transitions</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Hovered state tooltip */}
      {hoveredStateId && (
        <div className="absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md">
          <div className="font-medium text-text-primary">
            {states.find((s) => s.state_id === hoveredStateId)?.name}
          </div>
          <div className="text-text-muted mt-0.5">
            {
              states.find((s) => s.state_id === hoveredStateId)?.element_ids
                .length
            }{" "}
            elements
          </div>
        </div>
      )}
    </div>
  );
}
