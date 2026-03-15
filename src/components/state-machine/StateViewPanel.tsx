/**
 * State viewer with list and force-directed spatial visualization.
 *
 * Features:
 * - Filterable state list with expandable element details
 * - Dual view mode: list view + force-directed spatial canvas
 * - Element grouping by type with colored badges
 * - Transition mapping (incoming/outgoing per state)
 * - State detail view with elements, transitions, acceptance criteria, domain knowledge
 * - Interactive canvas with zoom controls
 *
 * This is a read-only viewer. For editing states, use StateDetailPanel.
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Layers,
  ChevronRight,
  ChevronDown,
  MousePointer,
  Type as TypeIcon,
  Globe,
  Hash,
  Box,
  CheckCircle,
  ArrowRight,
  Play,
  Lock,
  Eye,
  BookOpen,
  Search,
  BarChart3,
  List,
  ZoomIn,
  ZoomOut,
  Maximize,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Layout,
} from "lucide-react";
import type {
  StateMachineState,
  StateMachineTransition,
  TransitionAction,
} from "@qontinui/shared-types";
import {
  getElementTypePrefix,
  getElementLabel,
  getActionTypeColor,
  STATE_COLORS,
  computeSpatialLayout,
} from "@qontinui/workflow-utils";

// =============================================================================
// Props
// =============================================================================

type ViewMode = "list" | "spatial";

/** Fingerprint detail from discovery co-occurrence data. */
export interface FingerprintDetail {
  tagName: string;
  role: string;
  accessibleName?: string;
  positionZone: string;
  relativePosition: { top: number; left: number };
  sizeCategory?: string;
}

export interface StateViewPanelProps {
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  selectedStateId: string | null;
  onSelectState: (stateId: string | null) => void;
  /** Optional map of element ID (or fingerprint hash) → base64 PNG thumbnail. */
  elementThumbnails?: Record<string, string>;
  /** Optional fingerprint details from discovery. Keys are fingerprint hashes. */
  fingerprintDetails?: Record<string, FingerprintDetail>;
}

// =============================================================================
// Constants
// =============================================================================

const ELEMENT_ICONS: Record<string, typeof Hash> = {
  testid: Hash,
  role: MousePointer,
  text: TypeIcon,
  ui: Box,
  url: Globe,
  nav: Globe,
};

const ELEMENT_COLORS: Record<string, string> = {
  testid: "border-blue-400 bg-blue-500/10 text-blue-300",
  role: "border-green-400 bg-green-500/10 text-green-300",
  text: "border-amber-400 bg-amber-500/10 text-amber-300",
  ui: "border-purple-400 bg-purple-500/10 text-purple-300",
  url: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
  nav: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
};

const ACTION_ICONS: Partial<
  Record<TransitionAction["type"], typeof MousePointer>
> = {
  click: MousePointer,
  type: TypeIcon,
  select: Target,
  wait: Layers,
  navigate: Globe,
};

// =============================================================================
// Element Label Helpers
// =============================================================================

/**
 * Resolve a descriptive label for an element ID.
 *
 * Priority:
 * 1. fingerprintDetails (live discovery data)
 * 2. state extra_metadata.elementLabels (persisted during save)
 * 3. getElementLabel (prefix:label parsing)
 */
function resolveElementLabel(
  elementId: string,
  fingerprintDetails?: Record<string, FingerprintDetail>,
  state?: StateMachineState,
): string {
  // Live fingerprint data
  const fp = fingerprintDetails?.[elementId];
  if (fp) {
    if (fp.accessibleName) return fp.accessibleName;
    const parts = [fp.tagName, fp.role].filter(Boolean);
    if (parts.length > 0) return parts.join(" ");
  }
  // Persisted element labels from extra_metadata
  const labels = state?.extra_metadata?.elementLabels as
    | Record<string, string>
    | undefined;
  if (labels?.[elementId]) return labels[elementId];
  // Fallback to prefix:label parsing
  return getElementLabel(elementId);
}

/**
 * Resolve position for an element on screen (0-1 viewport %).
 */
function resolveElementPosition(
  elementId: string,
  fingerprintDetails?: Record<string, FingerprintDetail>,
  state?: StateMachineState,
): { top: number; left: number } | null {
  const fp = fingerprintDetails?.[elementId];
  if (fp?.relativePosition) return fp.relativePosition;
  const positions = state?.extra_metadata?.elementPositions as
    | Record<string, { top: number; left: number }>
    | undefined;
  if (positions?.[elementId]) return positions[elementId];
  return null;
}

/**
 * Resolve tag metadata for an element.
 */
function resolveElementTag(
  elementId: string,
  fingerprintDetails?: Record<string, FingerprintDetail>,
  state?: StateMachineState,
): { tagName: string; role: string; zone: string } | null {
  const fp = fingerprintDetails?.[elementId];
  if (fp) {
    return {
      tagName: fp.tagName || "",
      role: fp.role || "",
      zone: fp.positionZone || "",
    };
  }
  const tags = state?.extra_metadata?.elementTags as
    | Record<string, { tagName: string; role: string; zone: string }>
    | undefined;
  if (tags?.[elementId]) return tags[elementId];
  return null;
}

// =============================================================================
// Spatial Visualization Canvas
// =============================================================================

interface SpatialCanvasProps {
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  selectedStateId: string | null;
  onSelectState: (stateId: string | null) => void;
}

function SpatialCanvas({
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
          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary"
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          title="Zoom in"
        >
          <ZoomIn className="size-3.5" />
        </button>
        <button
          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary"
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          title="Zoom out"
        >
          <ZoomOut className="size-3.5" />
        </button>
        <button
          className="h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary"
          onClick={() => setZoom(1)}
          title="Reset zoom"
        >
          <Maximize className="size-3.5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 text-[10px] text-text-muted bg-bg-primary/80 backdrop-blur-sm px-2.5 py-1.5 rounded border border-border-secondary/50">
        <div className="flex items-center gap-3">
          <span>{states.length} states</span>
          <span>{transitions.length} transitions</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Hovered state tooltip */}
      {hoveredStateId && (
        <div className="absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-border-secondary shadow-md">
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

// =============================================================================
// State Layout View — shows elements positioned on a viewport representation
// =============================================================================

interface StateLayoutViewProps {
  state: StateMachineState;
  elementThumbnails?: Record<string, string>;
  fingerprintDetails?: Record<string, FingerprintDetail>;
}

function StateLayoutView({
  state,
  elementThumbnails,
  fingerprintDetails,
}: StateLayoutViewProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Collect elements with positions
  const positionedElements = useMemo(() => {
    const items: Array<{
      id: string;
      label: string;
      tag: { tagName: string; role: string; zone: string } | null;
      position: { top: number; left: number };
      thumbnail?: string;
      prefix: string;
    }> = [];

    for (const eid of state.element_ids) {
      const pos = resolveElementPosition(eid, fingerprintDetails, state);
      if (!pos) continue;
      const label = resolveElementLabel(eid, fingerprintDetails, state);
      const tag = resolveElementTag(eid, fingerprintDetails, state);
      const prefix = getElementTypePrefix(eid);
      const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[getElementLabel(eid)];
      items.push({ id: eid, label, tag, position: pos, thumbnail: thumb, prefix });
    }
    return items;
  }, [state, fingerprintDetails, elementThumbnails]);

  const elementsWithoutPosition = state.element_ids.length - positionedElements.length;

  if (positionedElements.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-xs">
        No position data available for this state's elements.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
        <Layout className="size-3.5" />
        State Layout
      </h3>
      {/* Viewport representation */}
      <div
        className="relative bg-bg-tertiary border border-border-secondary rounded-lg"
        style={{ aspectRatio: "16 / 10" }}
      >
        {/* Viewport zones overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[10%] border-b border-dashed border-border-secondary/30" />
          <div className="absolute bottom-0 left-0 right-0 h-[10%] border-t border-dashed border-border-secondary/30" />
        </div>

        {/* Elements plotted at their positions */}
        {positionedElements.map((el) => {
          const isHovered = hoveredElement === el.id;
          const colorClass =
            ELEMENT_COLORS[el.prefix] ??
            "border-gray-400 bg-gray-500/10 text-gray-300";
          const thumbSrc = el.thumbnail
            ? el.thumbnail.startsWith("data:")
              ? el.thumbnail
              : `data:image/png;base64,${el.thumbnail}`
            : undefined;

          return (
            <div
              key={el.id}
              className="absolute group"
              style={{
                top: `${el.position.top * 100}%`,
                left: `${el.position.left * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredElement(el.id)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {/* Element marker */}
              <div
                className={`
                  rounded border ${colorClass} overflow-hidden
                  transition-all duration-100 cursor-default
                  ${isHovered ? "ring-2 ring-brand-primary/50 shadow-lg z-20 scale-125" : "z-10"}
                `}
                style={{ width: thumbSrc ? 32 : undefined, height: thumbSrc ? 32 : undefined }}
              >
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={el.label}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="px-1 py-0.5 text-[8px] whitespace-nowrap max-w-[80px] truncate">
                    {el.label}
                  </div>
                )}
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-bg-primary/95 backdrop-blur-sm border border-border-secondary rounded px-2 py-1 shadow-md whitespace-nowrap">
                  <div className="text-[10px] font-medium text-text-primary">
                    {el.label}
                  </div>
                  {el.tag && (
                    <div className="text-[9px] text-text-muted">
                      {[el.tag.tagName && `<${el.tag.tagName}>`, el.tag.role && `role="${el.tag.role}"`, el.tag.zone].filter(Boolean).join(" ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {elementsWithoutPosition > 0 && (
        <p className="text-[10px] text-text-muted mt-1.5">
          {elementsWithoutPosition} element{elementsWithoutPosition !== 1 ? "s" : ""} without position data
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function StateViewPanel({
  states,
  transitions,
  selectedStateId,
  onSelectState,
  elementThumbnails,
  fingerprintDetails,
}: StateViewPanelProps) {
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const selectedState = useMemo(
    () => states.find((s) => s.state_id === selectedStateId),
    [states, selectedStateId],
  );

  // Build outgoing/incoming transition map
  const transitionMap = useMemo(() => {
    const outgoing = new Map<string, StateMachineTransition[]>();
    const incoming = new Map<string, StateMachineTransition[]>();

    for (const t of transitions) {
      for (const from of t.from_states) {
        if (!outgoing.has(from)) outgoing.set(from, []);
        outgoing.get(from)!.push(t);
      }
      for (const to of t.activate_states) {
        if (!incoming.has(to)) incoming.set(to, []);
        incoming.get(to)!.push(t);
      }
    }
    return { outgoing, incoming };
  }, [transitions]);

  // Group elements by type prefix for the detail view
  const elementGroups = useMemo(() => {
    if (!selectedState) return new Map<string, string[]>();
    const groups = new Map<string, string[]>();
    for (const eid of selectedState.element_ids) {
      const prefix = getElementTypePrefix(eid);
      if (!groups.has(prefix)) groups.set(prefix, []);
      groups.get(prefix)!.push(eid);
    }
    return groups;
  }, [selectedState]);

  // Shared elements between states
  const sharedElements = useMemo(() => {
    const elementStateMap = new Map<string, string[]>();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, []);
        elementStateMap.get(eid)!.push(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);

  // Filter states by search
  const filteredStates = useMemo(() => {
    if (!searchFilter) return states;
    const lower = searchFilter.toLowerCase();
    return states.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.state_id.toLowerCase().includes(lower) ||
        s.element_ids.some((eid) => eid.toLowerCase().includes(lower)),
    );
  }, [states, searchFilter]);

  const toggleExpanded = (stateId: string) => {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(stateId)) {
        next.delete(stateId);
      } else {
        next.add(stateId);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full">
      {/* Left Panel: State List */}
      <div className="w-72 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0">
        <div className="p-3 border-b border-border-secondary">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="size-4 text-brand-primary" />
            <h3 className="text-sm font-semibold text-text-primary">States</h3>
            <span className="text-xs text-text-muted ml-auto">
              {states.length}
            </span>
          </div>

          {/* View mode toggle + search */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter states..."
                aria-label="Filter states..."
                className="w-full text-xs h-7 pl-7 px-2 bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div className="flex items-center border border-border-secondary rounded overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 ${viewMode === "list" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`}
                title="List view"
              >
                <List className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode("spatial")}
                className={`p-1 ${viewMode === "spatial" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`}
                title="Spatial view"
              >
                <BarChart3 className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-2 space-y-0.5">
          {filteredStates.map((state) => {
            const colorIdx = states.indexOf(state);
            const color = STATE_COLORS[colorIdx % STATE_COLORS.length]!;
            const isSelected = state.state_id === selectedStateId;
            const isExpanded = expandedStates.has(state.state_id);
            const stateOutgoing =
              transitionMap.outgoing.get(state.state_id) ?? [];
            const stateIncoming =
              transitionMap.incoming.get(state.state_id) ?? [];
            const isInitial = state.extra_metadata?.initial === true;
            const isBlocking = state.extra_metadata?.blocking === true;

            return (
              <div key={state.state_id}>
                <button
                  onClick={() => {
                    onSelectState(isSelected ? null : state.state_id);
                    if (!isExpanded) toggleExpanded(state.state_id);
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-md transition-colors text-sm
                    ${
                      isSelected
                        ? "bg-brand-primary/10 border border-brand-primary/30"
                        : "hover:bg-bg-secondary border border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color.border }}
                    />
                    {isInitial && (
                      <Play className="size-3 text-yellow-500 fill-yellow-500 shrink-0" />
                    )}
                    {isBlocking && (
                      <Lock className="size-3 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-text-primary truncate flex-1">
                      {state.name}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="size-3 text-text-muted transition-transform" />
                    ) : (
                      <ChevronRight className="size-3 text-text-muted transition-transform" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-4.5 text-xs text-text-muted">
                    <span>{state.element_ids.length} elements</span>
                    <span
                      className={
                        Math.round(state.confidence * 100) >= 80
                          ? "text-green-400"
                          : Math.round(state.confidence * 100) >= 50
                            ? "text-amber-400"
                            : "text-red-400"
                      }
                    >
                      {Math.round(state.confidence * 100)}%
                    </span>
                    {stateOutgoing.length > 0 && (
                      <span className="text-brand-secondary flex items-center gap-0.5">
                        <ArrowUpRight className="size-2" />
                        {stateOutgoing.length}
                      </span>
                    )}
                    {stateIncoming.length > 0 && (
                      <span className="text-brand-primary flex items-center gap-0.5">
                        <ArrowDownLeft className="size-2" />
                        {stateIncoming.length}
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded element list */}
                {isExpanded && (
                  <div className="ml-5 pl-2 border-l border-border-secondary mt-1 mb-2 space-y-0.5">
                    {state.element_ids.slice(0, 20).map((eid) => {
                      const prefix = getElementTypePrefix(eid);
                      const label = resolveElementLabel(eid, fingerprintDetails, state);
                      const Icon = ELEMENT_ICONS[prefix] ?? Layers;
                      const stateCount = sharedElements.get(eid)?.length ?? 1;
                      return (
                        <div
                          key={eid}
                          className="text-[10px] text-text-muted flex items-center gap-1 py-0.5 px-1 rounded hover:bg-bg-secondary"
                          title={`${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`}
                        >
                          <Icon className="size-2.5 shrink-0" />
                          <span className="truncate flex-1">{label}</span>
                          {stateCount > 1 && (
                            <span className="text-[8px] text-brand-primary bg-brand-primary/10 px-1 rounded-full shrink-0">
                              {stateCount}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {state.element_ids.length > 20 && (
                      <div className="text-[10px] text-text-muted py-0.5 px-1">
                        +{state.element_ids.length - 20} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredStates.length === 0 && (
            <p className="text-xs text-text-muted text-center py-4">
              No states match filter.
            </p>
          )}
        </div>
      </div>

      {/* Right Panel: Spatial Canvas or State Details */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "spatial" ? (
          <SpatialCanvas
            states={states}
            transitions={transitions}
            selectedStateId={selectedStateId}
            onSelectState={onSelectState}
          />
        ) : selectedState ? (
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            {/* State header */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  {selectedState.name}
                </h2>
                {selectedState.extra_metadata?.initial === true && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Play className="size-2.5 fill-current" />
                    Initial
                  </span>
                )}
                {selectedState.extra_metadata?.blocking === true && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Lock className="size-2.5" />
                    Blocking
                  </span>
                )}
              </div>
              {selectedState.description && (
                <p className="text-sm text-text-muted mt-1">
                  {selectedState.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted">
                  {selectedState.element_ids.length} elements
                </span>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted">
                  {selectedState.render_ids.length} renders
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border ${
                    Math.round(selectedState.confidence * 100) >= 80
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {Math.round(selectedState.confidence * 100)}% confidence
                </span>
              </div>
            </div>

            {/* Element groups */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">
                Elements by Type
              </h3>
              <div className="space-y-3">
                {Array.from(elementGroups.entries()).map(
                  ([prefix, elements]) => {
                    const Icon = ELEMENT_ICONS[prefix] ?? Layers;
                    const colorClass =
                      ELEMENT_COLORS[prefix] ??
                      "border-gray-400 bg-gray-500/10 text-gray-300";

                    return (
                      <div key={prefix}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="size-3.5" />
                          <span className="text-xs font-medium text-text-primary capitalize">
                            {prefix}
                          </span>
                          <span className="text-xs text-text-muted">
                            ({elements.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {elements.map((eid) => {
                            const stateCount =
                              sharedElements.get(eid)?.length ?? 1;
                            const rawLabel = getElementLabel(eid);
                            const descriptiveLabel = resolveElementLabel(eid, fingerprintDetails, selectedState);
                            // Look up thumbnail by full ID or by label (which is the hash suffix)
                            const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[rawLabel];
                            return (
                              <div
                                key={eid}
                                className={`rounded border ${colorClass} overflow-hidden ${thumb ? "flex flex-col items-center w-16" : "text-[11px] px-2 py-0.5 inline-flex items-center gap-1"}`}
                                title={`${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`}
                              >
                                {thumb ? (
                                  <>
                                    <div className="relative">
                                      <img
                                        src={thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`}
                                        alt={descriptiveLabel}
                                        className="w-12 h-12 object-cover"
                                      />
                                      {stateCount > 1 && (
                                        <span className="absolute -top-1 -right-1 text-[7px] bg-brand-primary/90 text-white px-1 rounded-full leading-tight">
                                          x{stateCount}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[8px] text-center px-0.5 py-0.5 truncate w-full leading-tight">
                                      {descriptiveLabel}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {descriptiveLabel}
                                    {stateCount > 1 && (
                                      <span className="text-[8px] opacity-70 bg-white/10 px-0.5 rounded">
                                        x{stateCount}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* State Layout — positional view of elements */}
            <StateLayoutView
              state={selectedState}
              elementThumbnails={elementThumbnails}
              fingerprintDetails={fingerprintDetails}
            />

            {/* Transitions from/to this state */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">
                Transitions
              </h3>
              <div className="space-y-2">
                {(transitionMap.outgoing.get(selectedState.state_id) ?? []).map(
                  (t) => (
                    <div
                      key={`out-${t.transition_id}`}
                      className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary"
                    >
                      <ArrowRight className="size-3 text-brand-secondary shrink-0" />
                      <span className="font-medium text-text-primary">
                        {t.name}
                      </span>
                      {t.actions.length > 0 && (
                        <span className="flex items-center gap-0.5 shrink-0">
                          {[...new Set(t.actions.map((a) => a.type))]
                            .slice(0, 3)
                            .map((actionType) => {
                              const ActionIcon = ACTION_ICONS[actionType];
                              return ActionIcon ? (
                                <ActionIcon
                                  key={actionType}
                                  className={`size-2.5 ${getActionTypeColor(actionType)}`}
                                />
                              ) : null;
                            })}
                        </span>
                      )}
                      <ArrowRight className="size-2.5 text-text-muted" />
                      <span className="text-text-muted truncate">
                        {t.activate_states
                          .map(
                            (sid) =>
                              states.find((s) => s.state_id === sid)?.name ??
                              sid,
                          )
                          .join(", ")}
                      </span>
                      {t.actions.length > 0 && (
                        <span className="text-text-muted ml-auto text-[10px] shrink-0">
                          {t.actions.length} action
                          {t.actions.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {t.stays_visible && (
                        <Eye className="size-3 text-green-400 shrink-0" />
                      )}
                    </div>
                  ),
                )}
                {(transitionMap.incoming.get(selectedState.state_id) ?? []).map(
                  (t) => (
                    <div
                      key={`in-${t.transition_id}`}
                      className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary"
                    >
                      <CheckCircle className="size-3 text-brand-primary shrink-0" />
                      <span className="font-medium text-text-primary">
                        {t.name}
                      </span>
                      {t.actions.length > 0 && (
                        <span className="flex items-center gap-0.5 shrink-0">
                          {[...new Set(t.actions.map((a) => a.type))]
                            .slice(0, 3)
                            .map((actionType) => {
                              const ActionIcon = ACTION_ICONS[actionType];
                              return ActionIcon ? (
                                <ActionIcon
                                  key={actionType}
                                  className={`size-2.5 ${getActionTypeColor(actionType)}`}
                                />
                              ) : null;
                            })}
                        </span>
                      )}
                      <span className="text-text-muted truncate">
                        from{" "}
                        {t.from_states
                          .map(
                            (sid) =>
                              states.find((s) => s.state_id === sid)?.name ??
                              sid,
                          )
                          .join(", ")}
                      </span>
                    </div>
                  ),
                )}
                {(transitionMap.outgoing.get(selectedState.state_id) ?? [])
                  .length === 0 &&
                  (transitionMap.incoming.get(selectedState.state_id) ?? [])
                    .length === 0 && (
                    <p className="text-xs text-text-muted">
                      No transitions connected.
                    </p>
                  )}
              </div>
            </div>

            {/* Acceptance criteria */}
            {selectedState.acceptance_criteria.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Acceptance Criteria
                </h3>
                <ul className="space-y-1">
                  {selectedState.acceptance_criteria.map((criteria, i) => (
                    <li
                      key={i}
                      className="text-xs text-text-muted flex items-start gap-1.5"
                    >
                      <CheckCircle className="size-3 text-green-500 mt-0.5 shrink-0" />
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Domain knowledge */}
            {selectedState.domain_knowledge.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  <BookOpen className="size-3.5 inline mr-1" />
                  Domain Knowledge
                </h3>
                <div className="space-y-2">
                  {selectedState.domain_knowledge.map((dk) => (
                    <div
                      key={dk.id}
                      className="p-3 rounded-lg bg-bg-secondary border border-border-secondary"
                    >
                      <div className="text-xs font-medium text-text-primary">
                        {dk.title}
                      </div>
                      <div className="text-[10px] text-text-muted mt-1 line-clamp-3">
                        {dk.content}
                      </div>
                      {dk.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {dk.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary">
              <div>
                State ID:{" "}
                <code className="bg-bg-secondary px-1 rounded">
                  {selectedState.state_id}
                </code>
              </div>
              <div>
                Created:{" "}
                {new Date(selectedState.created_at).toLocaleDateString()}
              </div>
              <div>
                Updated:{" "}
                {new Date(selectedState.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
              <Layers className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a state to view its details</p>
              <p className="text-xs mt-1 text-text-muted/70">
                {states.length} state{states.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
