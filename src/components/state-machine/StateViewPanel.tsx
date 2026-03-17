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
  Image,
  ChevronLeft,
  X,
  Info,
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

type ViewMode = "list" | "spatial" | "screenshot";

/** Fingerprint detail from discovery co-occurrence data. */
export interface FingerprintDetail {
  tagName: string;
  role: string;
  accessibleName?: string;
  positionZone: string;
  relativePosition: { top: number; left: number };
  sizeCategory?: string;
}

/** Metadata for a capture screenshot (without image data). */
export interface CaptureScreenshotMeta {
  id: string;
  configId: string;
  captureIndex: number;
  width: number;
  height: number;
  elementBoundsJson: string;
  fingerprintHashesJson: string;
  capturedAt: string;
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
  /** Optional capture screenshot metadata for screenshot view. */
  captureScreenshots?: CaptureScreenshotMeta[];
  /** Callback to load a screenshot image on demand. Returns data URL. */
  onLoadScreenshotImage?: (screenshotId: string) => Promise<string>;
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
function getFingerprintHash(elementId: string): string {
  const idx = elementId.indexOf(":");
  return idx > 0 ? elementId.slice(idx + 1) : elementId;
}

function resolveElementLabel(
  elementId: string,
  fingerprintDetails?: Record<string, FingerprintDetail>,
  state?: StateMachineState,
): string {
  // Live fingerprint data — keys may be bare hashes while elementId is "prefix:hash"
  const hash = getFingerprintHash(elementId);
  const fp = fingerprintDetails?.[hash] ?? fingerprintDetails?.[elementId];
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
  const hash = getFingerprintHash(elementId);
  const fp = fingerprintDetails?.[hash] ?? fingerprintDetails?.[elementId];
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
  const hash = getFingerprintHash(elementId);
  const fp = fingerprintDetails?.[hash] ?? fingerprintDetails?.[elementId];
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
// Screenshot State View — three-panel results viewer with bounding box overlays
// =============================================================================

type ScreenshotViewMode = "all" | "state" | "selected";
type RightPanelTab = "element" | "state";

interface ScreenshotStateViewProps {
  captureScreenshots: CaptureScreenshotMeta[];
  onLoadScreenshotImage: (screenshotId: string) => Promise<string>;
  states: StateMachineState[];
  selectedStateId: string | null;
  onSelectState: (stateId: string | null) => void;
  fingerprintDetails?: Record<string, FingerprintDetail>;
  elementThumbnails?: Record<string, string>;
}

function ScreenshotStateView({
  captureScreenshots,
  onLoadScreenshotImage,
  states,
  selectedStateId,
  onSelectState,
  fingerprintDetails,
  elementThumbnails,
}: ScreenshotStateViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const thumbnailLoadingRef = useRef<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userZoom, setUserZoom] = useState<number | null>(null);
  const [autoFitZoom, setAutoFitZoom] = useState(1);
  const zoom = userZoom ?? autoFitZoom;
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isLoading, setIsLoading] = useState(false);

  // New state for enhanced features
  const [selectedElementHash, setSelectedElementHash] = useState<string | null>(null);
  const [selectedElementHashes, setSelectedElementHashes] = useState<Set<string>>(new Set());
  const [screenshotViewMode, setScreenshotViewMode] = useState<ScreenshotViewMode>("all");
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>("state");
  const [thumbnailCache, setThumbnailCache] = useState<Map<string, string>>(new Map());

  const capture = captureScreenshots[currentIndex];

  // Parse element bounds from the current capture
  const elementBounds = useMemo(() => {
    if (!capture) return {} as Record<string, { x: number; y: number; width: number; height: number }>;
    try {
      return JSON.parse(capture.elementBoundsJson) as Record<string, { x: number; y: number; width: number; height: number }>;
    } catch {
      return {} as Record<string, { x: number; y: number; width: number; height: number }>;
    }
  }, [capture]);

  // Build map: hash → state IDs
  const hashToStates = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const state of states) {
      for (const eid of state.element_ids) {
        const hash = getFingerprintHash(eid);
        if (!map.has(hash)) map.set(hash, []);
        map.get(hash)!.push(state.state_id);
      }
    }
    return map;
  }, [states]);

  // Build map: hash → capture indices where the element appears
  const hashToCaptures = useMemo(() => {
    const map = new Map<string, number[]>();
    for (let i = 0; i < captureScreenshots.length; i++) {
      try {
        const hashes = JSON.parse(captureScreenshots[i]!.fingerprintHashesJson) as string[];
        for (const h of hashes) {
          if (!map.has(h)) map.set(h, []);
          map.get(h)!.push(i);
        }
      } catch { /* skip */ }
    }
    return map;
  }, [captureScreenshots]);

  // Selected state hashes helper
  const selectedStateHashes = useMemo(() => {
    if (!selectedStateId) return new Set<string>();
    const state = states.find(s => s.state_id === selectedStateId);
    if (!state) return new Set<string>();
    return new Set(state.element_ids.map(eid => getFingerprintHash(eid)));
  }, [selectedStateId, states]);

  // When selectedStateId changes, navigate to the best capture and switch view mode
  useEffect(() => {
    if (!selectedStateId) return;
    setScreenshotViewMode("state");
    setRightPanelTab("state");
    const selectedState = states.find(s => s.state_id === selectedStateId);
    if (!selectedState) return;
    const hashes = new Set(selectedState.element_ids.map(eid => getFingerprintHash(eid)));
    let bestIdx = -1;
    let bestOverlap = 0;
    for (let i = 0; i < captureScreenshots.length; i++) {
      try {
        const capHashes = JSON.parse(captureScreenshots[i]!.fingerprintHashesJson) as string[];
        const overlap = capHashes.filter(h => hashes.has(h)).length;
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestIdx = i;
        }
      } catch { /* skip */ }
    }
    if (bestIdx >= 0) setCurrentIndex(bestIdx);
  }, [selectedStateId, states, captureScreenshots]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
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

  // Load screenshot thumbnails lazily
  useEffect(() => {
    for (const cap of captureScreenshots) {
      if (thumbnailLoadingRef.current.has(cap.id)) continue;
      thumbnailLoadingRef.current.add(cap.id);
      onLoadScreenshotImage(cap.id).then(dataUrl => {
        setThumbnailCache(prev => {
          const next = new Map(prev);
          next.set(cap.id, dataUrl);
          return next;
        });
      }).catch(() => { /* skip */ });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureScreenshots, onLoadScreenshotImage]);

  // Load and cache image on demand
  useEffect(() => {
    if (!capture) return;
    const cached = imageCache.current.get(capture.id);
    if (cached) {
      const fitZoom = Math.min(canvasSize.width / cached.width, canvasSize.height / cached.height, 1);
      setAutoFitZoom(fitZoom);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    onLoadScreenshotImage(capture.id).then(dataUrl => {
      if (cancelled) return;
      const img = new window.Image();
      img.onload = () => {
        if (!cancelled) {
          imageCache.current.set(capture.id, img);
          const fitZoom = Math.min(canvasSize.width / img.width, canvasSize.height / img.height, 1);
          setAutoFitZoom(fitZoom);
          setUserZoom(null);
          setIsLoading(false);
        }
      };
      img.onerror = () => { if (!cancelled) setIsLoading(false); };
      img.src = dataUrl;
    }).catch(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [capture, onLoadScreenshotImage, canvasSize.width, canvasSize.height]);

  // Determine visible hashes based on view mode
  const visibleHashes = useMemo(() => {
    if (screenshotViewMode === "all") return null; // null = show all
    if (screenshotViewMode === "selected") {
      return selectedElementHashes.size > 0 ? selectedElementHashes : new Set<string>();
    }
    // "state" mode
    if (!selectedStateId) return null;
    return selectedStateHashes;
  }, [screenshotViewMode, selectedStateId, selectedStateHashes, selectedElementHashes]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !capture) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const img = imageCache.current.get(capture.id);
    if (!img) return;

    const drawWidth = img.width * zoom;
    const drawHeight = img.height * zoom;
    const offsetX = Math.max(0, (canvasSize.width - drawWidth) / 2);
    const offsetY = Math.max(0, (canvasSize.height - drawHeight) / 2);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Filter elements to draw based on view mode
    const allEntries = Object.entries(elementBounds);
    const elementsToDraw = visibleHashes
      ? allEntries.filter(([hash]) => visibleHashes.has(hash))
      : allEntries;

    for (const [hash, bounds] of elementsToDraw) {
      const isHovered = hash === hoveredElement;
      const isSelected = hash === selectedElementHash;
      const isMultiSelected = selectedElementHashes.has(hash);
      const isStateHighlighted = selectedStateId && selectedStateHashes.has(hash);

      // Determine colors per spec
      let borderColor: string;
      let fillOpacity: number;
      let lineWidth: number;

      if (isSelected) {
        borderColor = "#3B82F6"; // blue
        fillOpacity = 0.2;
        lineWidth = 3;
      } else if (isHovered) {
        borderColor = "#00FF00"; // bright green
        fillOpacity = 0.15;
        lineWidth = 2;
      } else if (isMultiSelected) {
        borderColor = "#10B981"; // green
        fillOpacity = 0.2;
        lineWidth = 2;
      } else if (isStateHighlighted) {
        borderColor = "#F59E0B"; // amber
        fillOpacity = 0.25;
        lineWidth = 3;
      } else {
        // Default: color by state membership
        const stateIds = hashToStates.get(hash) ?? [];
        const stateIdx = stateIds.length > 0
          ? states.findIndex(s => s.state_id === stateIds[0])
          : -1;
        borderColor = stateIdx >= 0
          ? STATE_COLORS[stateIdx % STATE_COLORS.length]!.border
          : "#22C55E";
        fillOpacity = 0.1;
        lineWidth = 1;
      }

      const x = offsetX + bounds.x * zoom;
      const y = offsetY + bounds.y * zoom;
      const w = bounds.width * zoom;
      const h = bounds.height * zoom;

      // Fill
      const r = parseInt(borderColor.slice(1, 3), 16);
      const g = parseInt(borderColor.slice(3, 5), 16);
      const b = parseInt(borderColor.slice(5, 7), 16);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
      ctx.fillRect(x, y, w, h);

      // Border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(x, y, w, h);

      // Element label on selected/hovered elements
      if (isSelected || isHovered) {
        const label = resolveElementLabel(hash, fingerprintDetails);
        if (label && label !== hash) {
          ctx.font = "12px sans-serif";
          ctx.fillStyle = borderColor;
          const textMetrics = ctx.measureText(label);
          const textBgPadding = 2;
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(
            x,
            y - 16,
            textMetrics.width + textBgPadding * 2,
            14
          );
          ctx.fillStyle = borderColor;
          ctx.fillText(label, x + textBgPadding, y - 4);
        }
      }
    }
  }, [canvasSize, capture, zoom, elementBounds, hoveredElement, selectedStateId, states, hashToStates, selectedElementHash, selectedElementHashes, screenshotViewMode, visibleHashes, selectedStateHashes, fingerprintDetails]);

  // Hit-test: return the topmost (smallest area) element under the cursor
  const getElementAtPoint = useCallback(
    (clientX: number, clientY: number): string | null => {
      const canvas = canvasRef.current;
      if (!canvas || !capture) return null;
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      const img = imageCache.current.get(capture.id);
      if (!img) return null;

      const drawWidth = img.width * zoom;
      const drawHeight = img.height * zoom;
      const offsetX = Math.max(0, (canvasSize.width - drawWidth) / 2);
      const offsetY = Math.max(0, (canvasSize.height - drawHeight) / 2);

      let bestHash: string | null = null;
      let bestArea = Infinity;

      for (const [hash, bounds] of Object.entries(elementBounds)) {
        if (visibleHashes && !visibleHashes.has(hash)) continue;
        const x = offsetX + bounds.x * zoom;
        const y = offsetY + bounds.y * zoom;
        const w = bounds.width * zoom;
        const h = bounds.height * zoom;
        if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
          const area = w * h;
          if (area < bestArea) {
            bestArea = area;
            bestHash = hash;
          }
        }
      }
      return bestHash;
    },
    [capture, zoom, canvasSize, elementBounds, visibleHashes],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setHoveredElement(getElementAtPoint(e.clientX, e.clientY));
    },
    [getElementAtPoint],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const hash = getElementAtPoint(e.clientX, e.clientY);
      const isCtrl = e.ctrlKey || e.metaKey;

      if (!hash) {
        // Click empty area — deselect
        if (!isCtrl) {
          setSelectedElementHash(null);
        }
        return;
      }

      if (isCtrl) {
        // Multi-selection toggle
        setSelectedElementHashes(prev => {
          const next = new Set(prev);
          if (next.has(hash)) {
            next.delete(hash);
          } else {
            next.add(hash);
          }
          return next;
        });
      } else {
        // Single selection
        setSelectedElementHash(hash);
        setRightPanelTab("element");
      }
    },
    [getElementAtPoint],
  );

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(captureScreenshots.length - 1, i + 1));

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") {
        setSelectedElementHash(null);
        setSelectedElementHashes(new Set());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [captureScreenshots.length]);

  if (captureScreenshots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        <div className="text-center">
          <Image className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No capture screenshots available</p>
          <p className="text-xs mt-1 text-text-muted/70">
            Run a state discovery to capture screenshots
          </p>
        </div>
      </div>
    );
  }

  // Get selected state for right panel
  const currentSelectedState = states.find(s => s.state_id === selectedStateId);
  // Get fingerprint info for selected element
  const selectedFp = selectedElementHash ? (fingerprintDetails?.[selectedElementHash] ?? null) : null;

  return (
    <div className="flex h-full">
      {/* Left panel — Screenshot Navigator + State List */}
      <div className="w-64 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0 flex flex-col">
        {/* Filmstrip */}
        <div className="shrink-0">
          <div className="p-2 border-b border-border-secondary">
            <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Screenshots</h4>
          </div>
          <div className="p-1.5 flex gap-1.5 overflow-x-auto">
            {captureScreenshots.map((cap, idx) => (
              <button
                key={cap.id}
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 w-[100px] rounded border-2 transition-colors overflow-hidden ${
                  idx === currentIndex
                    ? "border-blue-500"
                    : "border-transparent hover:border-border-secondary"
                }`}
              >
                {thumbnailCache.has(cap.id) ? (
                  <img
                    src={thumbnailCache.get(cap.id)}
                    alt={`Capture ${cap.captureIndex + 1}`}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: 60 }}
                  />
                ) : (
                  <div className="w-full h-12 bg-bg-tertiary flex items-center justify-center">
                    <Image className="size-4 text-text-muted opacity-30" />
                  </div>
                )}
                <div className="text-[9px] text-text-muted px-1 py-0.5 text-center truncate">
                  #{cap.captureIndex + 1} &middot; {new Date(cap.capturedAt).toLocaleTimeString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* State List */}
        <div className="flex-1 overflow-y-auto border-t border-border-secondary">
          <div className="p-2 border-b border-border-secondary">
            <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">States</h4>
          </div>
          <div className="p-1.5 space-y-0.5">
            {states.map((state, stateIdx) => {
              const color = STATE_COLORS[stateIdx % STATE_COLORS.length]!;
              const isActive = state.state_id === selectedStateId;
              const elementCount = state.element_ids.length;
              return (
                <button
                  key={state.state_id}
                  onClick={() => onSelectState(isActive ? null : state.state_id)}
                  className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded text-[11px] transition-colors ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-text-primary hover:bg-bg-secondary"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color.border }}
                  />
                  <span className="truncate flex-1">{state.name}</span>
                  <span className="text-[9px] text-text-muted shrink-0">{elementCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center panel — Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border-secondary bg-bg-primary shrink-0">
          {/* View mode tabs */}
          <div className="flex items-center border border-border-secondary rounded overflow-hidden text-[10px]">
            {(["all", "state", "selected"] as ScreenshotViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setScreenshotViewMode(mode)}
                className={`px-2 py-1 capitalize ${
                  screenshotViewMode === mode
                    ? "bg-brand-primary/20 text-brand-primary font-medium"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Multi-selection badge */}
          {selectedElementHashes.size > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              <span>{selectedElementHashes.size} selected</span>
              <button
                onClick={() => setSelectedElementHashes(new Set())}
                className="hover:text-emerald-300"
                title="Clear selection"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          <div className="flex-1" />

          {/* Navigation */}
          <button
            className="h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary disabled:opacity-30"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            title="Previous capture"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-[10px] text-text-primary min-w-[70px] text-center">
            {currentIndex + 1} / {captureScreenshots.length}
          </span>
          <button
            className="h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary disabled:opacity-30"
            onClick={handleNext}
            disabled={currentIndex === captureScreenshots.length - 1}
            title="Next capture"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-0.5 ml-2">
            <button
              className="h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary"
              onClick={() => setUserZoom(Math.max(0.1, zoom - 0.25))}
              title="Zoom out"
            >
              <ZoomOut className="size-3" />
            </button>
            <span className="text-[10px] text-text-muted w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button
              className="h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary"
              onClick={() => setUserZoom(Math.min(3, zoom + 0.25))}
              title="Zoom in"
            >
              <ZoomIn className="size-3" />
            </button>
            <button
              className="h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary"
              onClick={() => setUserZoom(null)}
              title="Fit to view"
            >
              <Maximize className="size-3" />
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div ref={containerRef} className="relative flex-1 bg-bg-secondary overflow-hidden">
          <canvas
            ref={canvasRef}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              cursor: hoveredElement ? "pointer" : "default",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={handleCanvasClick}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/50">
              <div className="animate-spin size-6 border-2 border-brand-primary border-t-transparent rounded-full" />
            </div>
          )}

          {/* Rich hover tooltip */}
          {hoveredElement && hoveredElement !== selectedElementHash && (
            <div className="absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-border-secondary shadow-md max-w-[280px] pointer-events-none">
              <div className="font-medium text-text-primary truncate">
                {resolveElementLabel(hoveredElement, fingerprintDetails) || hoveredElement}
              </div>
              {(() => {
                const fp = fingerprintDetails?.[hoveredElement];
                if (!fp) return null;
                return (
                  <>
                    <div className="text-text-muted mt-0.5">
                      &lt;{fp.tagName}&gt;{fp.role ? ` role="${fp.role}"` : ""}
                    </div>
                    {fp.positionZone && (
                      <div className="text-text-muted">Zone: {fp.positionZone}</div>
                    )}
                  </>
                );
              })()}
              {hashToStates.get(hoveredElement) && (
                <div className="text-text-muted mt-0.5">
                  States: {hashToStates.get(hoveredElement)!.map(sid =>
                    states.find(s => s.state_id === sid)?.name ?? sid
                  ).join(", ")}
                </div>
              )}
              {(() => {
                const stateIds = hashToStates.get(hoveredElement) ?? [];
                if (stateIds.length === 0) return null;
                const confidences = stateIds.map(sid => {
                  const s = states.find(st => st.state_id === sid);
                  return s ? Math.round(s.confidence * 100) : 0;
                }).filter(c => c > 0);
                if (confidences.length === 0) return null;
                const avg = Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);
                return <div className="text-text-muted">Confidence: {avg}%</div>;
              })()}
            </div>
          )}

          {/* Element count legend */}
          <div className="absolute bottom-2 right-2 text-[9px] text-text-muted bg-bg-primary/80 backdrop-blur-sm px-2 py-1 rounded border border-border-secondary/50">
            {visibleHashes
              ? `${Object.keys(elementBounds).filter(h => visibleHashes.has(h)).length} / ${Object.keys(elementBounds).length} elements`
              : `${Object.keys(elementBounds).length} elements`}
          </div>
        </div>
      </div>

      {/* Right panel — Details */}
      <div className="w-80 border-l border-border-secondary bg-bg-primary overflow-y-auto shrink-0">
        {/* Tab header */}
        <div className="flex border-b border-border-secondary">
          <button
            onClick={() => setRightPanelTab("state")}
            className={`flex-1 text-[10px] py-2 font-medium ${
              rightPanelTab === "state"
                ? "text-brand-primary border-b-2 border-brand-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            State Details
          </button>
          <button
            onClick={() => setRightPanelTab("element")}
            className={`flex-1 text-[10px] py-2 font-medium ${
              rightPanelTab === "element"
                ? "text-brand-primary border-b-2 border-brand-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Element Details
          </button>
        </div>

        <div className="p-3">
          {rightPanelTab === "element" && selectedElementHash ? (
            /* Element Details Tab */
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  {resolveElementLabel(selectedElementHash, fingerprintDetails) || selectedElementHash}
                </h4>
                {selectedFp && (
                  <div className="text-[10px] text-text-muted mt-0.5">
                    &lt;{selectedFp.tagName}&gt;{selectedFp.role ? ` role="${selectedFp.role}"` : ""}
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              {elementThumbnails?.[selectedElementHash] && (
                <div>
                  <img
                    src={elementThumbnails[selectedElementHash]!.startsWith("data:")
                      ? elementThumbnails[selectedElementHash]!
                      : `data:image/png;base64,${elementThumbnails[selectedElementHash]}`}
                    alt="Element thumbnail"
                    className="w-full rounded border border-border-secondary"
                  />
                </div>
              )}

              {/* Position */}
              {elementBounds[selectedElementHash] && (
                <div>
                  <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Position</h5>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="bg-bg-secondary rounded px-2 py-1">
                      <span className="text-text-muted">x:</span>{" "}
                      <span className="text-text-primary">{Math.round(elementBounds[selectedElementHash]!.x)}</span>
                    </div>
                    <div className="bg-bg-secondary rounded px-2 py-1">
                      <span className="text-text-muted">y:</span>{" "}
                      <span className="text-text-primary">{Math.round(elementBounds[selectedElementHash]!.y)}</span>
                    </div>
                    <div className="bg-bg-secondary rounded px-2 py-1">
                      <span className="text-text-muted">w:</span>{" "}
                      <span className="text-text-primary">{Math.round(elementBounds[selectedElementHash]!.width)}</span>
                    </div>
                    <div className="bg-bg-secondary rounded px-2 py-1">
                      <span className="text-text-muted">h:</span>{" "}
                      <span className="text-text-primary">{Math.round(elementBounds[selectedElementHash]!.height)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fingerprint info */}
              {selectedFp && (
                <div>
                  <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Fingerprint</h5>
                  <div className="space-y-1 text-[10px]">
                    <div className="bg-bg-secondary rounded px-2 py-1">
                      <span className="text-text-muted">Hash:</span>{" "}
                      <code className="text-text-primary font-mono text-[9px]">{selectedElementHash.slice(0, 16)}...</code>
                    </div>
                    {selectedFp.positionZone && (
                      <div className="bg-bg-secondary rounded px-2 py-1">
                        <span className="text-text-muted">Zone:</span>{" "}
                        <span className="text-text-primary">{selectedFp.positionZone}</span>
                      </div>
                    )}
                    {selectedFp.sizeCategory && (
                      <div className="bg-bg-secondary rounded px-2 py-1">
                        <span className="text-text-muted">Size:</span>{" "}
                        <span className="text-text-primary">{selectedFp.sizeCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* States membership */}
              {hashToStates.get(selectedElementHash) && (
                <div>
                  <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">States Membership</h5>
                  <div className="space-y-1">
                    {hashToStates.get(selectedElementHash)!.map(sid => {
                      const s = states.find(st => st.state_id === sid);
                      if (!s) return null;
                      const colorIdx = states.indexOf(s);
                      const color = STATE_COLORS[colorIdx % STATE_COLORS.length]!;
                      return (
                        <button
                          key={sid}
                          onClick={() => { onSelectState(sid); setRightPanelTab("state"); }}
                          className="w-full flex items-center gap-2 text-[10px] px-2 py-1 rounded bg-bg-secondary hover:bg-bg-tertiary text-left"
                        >
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.border }} />
                          <span className="text-text-primary truncate">{s.name}</span>
                          <span className={`ml-auto shrink-0 ${
                            Math.round(s.confidence * 100) >= 80 ? "text-green-400" : "text-amber-400"
                          }`}>
                            {Math.round(s.confidence * 100)}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Screenshot presence */}
              {hashToCaptures.get(selectedElementHash) && (
                <div>
                  <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Screenshot Presence</h5>
                  <div className="flex flex-wrap gap-1">
                    {captureScreenshots.map((cap, idx) => {
                      const present = hashToCaptures.get(selectedElementHash)?.includes(idx);
                      return (
                        <button
                          key={cap.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            present
                              ? idx === currentIndex
                                ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30"
                                : "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-bg-secondary text-text-muted border border-border-secondary opacity-50"
                          }`}
                        >
                          #{idx + 1} {present ? "\u2713" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : rightPanelTab === "element" ? (
            <div className="text-center text-text-muted py-8">
              <Info className="size-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Click an element on the canvas to inspect it</p>
            </div>
          ) : currentSelectedState ? (
            /* State Details Tab */
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-text-primary truncate">{currentSelectedState.name}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                    Math.round(currentSelectedState.confidence * 100) >= 80
                      ? "bg-green-500/10 text-green-400 border border-green-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}>
                    {Math.round(currentSelectedState.confidence * 100)}%
                  </span>
                </div>
                {currentSelectedState.description && (
                  <p className="text-[10px] text-text-muted mt-1">{currentSelectedState.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-text-muted">
                  <span>{currentSelectedState.element_ids.length} elements</span>
                  <span>&middot;</span>
                  <span>{currentSelectedState.render_ids.length} renders</span>
                </div>
              </div>

              {/* Elements list */}
              <div>
                <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Elements</h5>
                <div className="space-y-0.5 max-h-60 overflow-y-auto">
                  {currentSelectedState.element_ids.map(eid => {
                    const hash = getFingerprintHash(eid);
                    const label = resolveElementLabel(eid, fingerprintDetails, currentSelectedState);
                    const thumb = elementThumbnails?.[hash] ?? elementThumbnails?.[eid];
                    const isActive = hash === selectedElementHash;
                    return (
                      <button
                        key={eid}
                        onClick={() => {
                          setSelectedElementHash(hash);
                          setRightPanelTab("element");
                        }}
                        className={`w-full flex items-center gap-1.5 text-[10px] px-2 py-1 rounded text-left ${
                          isActive ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-bg-secondary text-text-primary"
                        }`}
                      >
                        {thumb ? (
                          <img
                            src={thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`}
                            alt={label}
                            className="w-5 h-5 object-cover rounded shrink-0"
                          />
                        ) : (
                          <Layers className="size-3 text-text-muted shrink-0" />
                        )}
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Screenshots containing this state */}
              <div>
                <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Screenshots</h5>
                <div className="flex flex-wrap gap-1">
                  {captureScreenshots.map((cap, idx) => {
                    let hasElements = false;
                    try {
                      const hashes = JSON.parse(cap.fingerprintHashesJson) as string[];
                      hasElements = hashes.some(h => selectedStateHashes.has(h));
                    } catch { /* skip */ }
                    if (!hasElements) return null;
                    return (
                      <button
                        key={cap.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${
                          idx === currentIndex
                            ? "bg-brand-primary/20 text-brand-primary border-brand-primary/30"
                            : "bg-bg-secondary text-text-muted border-border-secondary hover:border-text-muted"
                        }`}
                      >
                        Capture #{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Acceptance criteria */}
              {currentSelectedState.acceptance_criteria.length > 0 && (
                <div>
                  <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Acceptance Criteria</h5>
                  <ul className="space-y-0.5">
                    {currentSelectedState.acceptance_criteria.map((ac, i) => (
                      <li key={i} className="flex items-start gap-1 text-[10px] text-text-muted">
                        <CheckCircle className="size-3 text-green-500 mt-0.5 shrink-0" />
                        <span>{ac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Domain knowledge */}
              {currentSelectedState.domain_knowledge.length > 0 && (
                <div>
                  <h5 className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">Domain Knowledge</h5>
                  <div className="space-y-1.5">
                    {currentSelectedState.domain_knowledge.map(dk => (
                      <div key={dk.id} className="p-2 rounded bg-bg-secondary border border-border-secondary">
                        <div className="text-[10px] font-medium text-text-primary">{dk.title}</div>
                        <div className="text-[9px] text-text-muted mt-0.5 line-clamp-3">{dk.content}</div>
                        {dk.tags.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1">
                            {dk.tags.map(tag => (
                              <span key={tag} className="text-[8px] px-1 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
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
            </div>
          ) : (
            <div className="text-center text-text-muted py-8">
              <Layers className="size-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Select a state to view details</p>
            </div>
          )}
        </div>
      </div>
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
  captureScreenshots,
  onLoadScreenshotImage,
}: StateViewPanelProps) {
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Local selection state — the page-level selectedStateId gets clobbered by the
  // ReactFlow graph component in a hidden tab (fires onSelectionChange → null).
  // We maintain our own selection that only changes from user clicks in this panel.
  const [localSelectedStateId, setLocalSelectedStateId] = useState<string | null>(
    selectedStateId,
  );

  // Use local selection for everything in this component
  const effectiveSelectedStateId = localSelectedStateId;

  const selectedState = useMemo(
    () => states.find((s) => s.state_id === effectiveSelectedStateId),
    [states, effectiveSelectedStateId],
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
              <button
                onClick={() => setViewMode("screenshot")}
                className={`p-1 ${viewMode === "screenshot" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`}
                title="Screenshot view"
                disabled={!captureScreenshots || captureScreenshots.length === 0}
              >
                <Image className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-2 space-y-0.5">
          {filteredStates.map((state) => {
            const colorIdx = states.indexOf(state);
            const color = STATE_COLORS[colorIdx % STATE_COLORS.length]!;
            const isSelected = state.state_id === effectiveSelectedStateId;
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
                  data-ui-id={`state-item-${state.state_id}`}
                  onClick={() => {
                    setLocalSelectedStateId(isSelected ? null : state.state_id);
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

      {/* Right Panel: Screenshot / Spatial Canvas / State Details */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "screenshot" && captureScreenshots && onLoadScreenshotImage ? (
          <ScreenshotStateView
            captureScreenshots={captureScreenshots}
            onLoadScreenshotImage={onLoadScreenshotImage}
            states={states}
            selectedStateId={effectiveSelectedStateId}
            onSelectState={setLocalSelectedStateId}
            fingerprintDetails={fingerprintDetails}
            elementThumbnails={elementThumbnails}
          />
        ) : viewMode === "spatial" ? (
          <SpatialCanvas
            states={states}
            transitions={transitions}
            selectedStateId={effectiveSelectedStateId}
            onSelectState={setLocalSelectedStateId}
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
