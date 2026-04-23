/**
 * Screenshot state view — three-panel results viewer with bounding box overlays.
 *
 * Extracted from StateViewPanel to follow the Single Responsibility Principle.
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Image,
  X,
} from "lucide-react";
import type { StateMachineState } from "@qontinui/shared-types";
import { STATE_COLORS } from "@qontinui/workflow-utils";
import type { FingerprintDetail, CaptureScreenshotMeta } from "./state-view-helpers";
import { getFingerprintHash, resolveElementLabel } from "./state-view-helpers";

// =============================================================================
// Props
// =============================================================================

export interface ScreenshotStateViewProps {
  captureScreenshots: CaptureScreenshotMeta[];
  onLoadScreenshotImage: (screenshotId: string) => Promise<string>;
  states: StateMachineState[];
  selectedStateIds: Set<string>;
  fingerprintDetails?: Record<string, FingerprintDetail>;
  elementThumbnails?: Record<string, string>;
}

// =============================================================================
// Component
// =============================================================================

export function ScreenshotStateView({
  captureScreenshots,
  onLoadScreenshotImage,
  states,
  selectedStateIds,
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
  const [selectedElementHash, setSelectedElementHash] = useState<string | null>(null);
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

  // Collect hashes for all selected states
  const selectedStateHashes = useMemo(() => {
    const hashes = new Set<string>();
    for (const state of states) {
      if (selectedStateIds.has(state.state_id)) {
        for (const eid of state.element_ids) {
          hashes.add(getFingerprintHash(eid));
        }
      }
    }
    return hashes;
  }, [selectedStateIds, states]);

  // Get selected state objects
  const selectedStates = useMemo(
    () => states.filter(s => selectedStateIds.has(s.state_id)),
    [states, selectedStateIds],
  );

  // Map hash → { elementId, state } for label resolution from canvas
  const hashToElement = useMemo(() => {
    const map = new Map<string, { elementId: string; state: StateMachineState }>();
    for (const state of states) {
      for (const eid of state.element_ids) {
        const hash = getFingerprintHash(eid);
        if (!map.has(hash)) {
          map.set(hash, { elementId: eid, state });
        }
      }
    }
    return map;
  }, [states]);

  // Matching screenshot indices: only those containing elements from selected states
  const matchingScreenshotIndices = useMemo(() => {
    if (selectedStateIds.size === 0) return captureScreenshots.map((_, i) => i);
    const indices: number[] = [];
    for (let i = 0; i < captureScreenshots.length; i++) {
      try {
        const hashes = JSON.parse(captureScreenshots[i]!.fingerprintHashesJson) as string[];
        if (hashes.some(h => selectedStateHashes.has(h))) {
          indices.push(i);
        }
      } catch { /* skip */ }
    }
    return indices;
  }, [captureScreenshots, selectedStateIds, selectedStateHashes]);

  // When selected states change, navigate to best capture
  useEffect(() => {
    if (selectedStateIds.size === 0) return;
    let bestIdx = -1;
    let bestOverlap = 0;
    for (let i = 0; i < captureScreenshots.length; i++) {
      try {
        const capHashes = JSON.parse(captureScreenshots[i]!.fingerprintHashesJson) as string[];
        const overlap = capHashes.filter(h => selectedStateHashes.has(h)).length;
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestIdx = i;
        }
      } catch { /* skip */ }
    }
    if (bestIdx >= 0) setCurrentIndex(bestIdx);
  }, [selectedStateIds, selectedStateHashes, captureScreenshots]);

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

  // Draw canvas — always filter to selected state elements only
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

    // Only draw bounding boxes for elements in the selected state(s)
    const allEntries = Object.entries(elementBounds);
    const elementsToDraw = selectedStateIds.size > 0
      ? allEntries.filter(([hash]) => selectedStateHashes.has(hash))
      : allEntries;

    for (const [hash, bounds] of elementsToDraw) {
      const isHovered = hash === hoveredElement;
      const isSelected = hash === selectedElementHash;

      let borderColor: string;
      let fillOpacity: number;
      let lineWidth: number;

      if (isSelected) {
        borderColor = "#3B82F6";
        fillOpacity = 0.2;
        lineWidth = 3;
      } else if (isHovered) {
        borderColor = "#00FF00";
        fillOpacity = 0.15;
        lineWidth = 2;
      } else {
        borderColor = "#F59E0B";
        fillOpacity = 0.1;
        lineWidth = 1;
      }

      const x = offsetX + bounds.x * zoom;
      const y = offsetY + bounds.y * zoom;
      const w = bounds.width * zoom;
      const h = bounds.height * zoom;

      const r = parseInt(borderColor.slice(1, 3), 16);
      const g = parseInt(borderColor.slice(3, 5), 16);
      const b = parseInt(borderColor.slice(5, 7), 16);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(x, y, w, h);

      if (isSelected || isHovered) {
        const entry = hashToElement.get(hash);
        const label = entry
          ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state)
          : resolveElementLabel(hash, fingerprintDetails);
        if (label && label !== hash) {
          ctx.font = "12px sans-serif";
          const textMetrics = ctx.measureText(label);
          const textBgPadding = 2;
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(x, y - 16, textMetrics.width + textBgPadding * 2, 14);
          ctx.fillStyle = borderColor;
          ctx.fillText(label, x + textBgPadding, y - 4);
        }
      }
    }
  }, [canvasSize, capture, zoom, elementBounds, hoveredElement, selectedStateIds, selectedStateHashes, selectedElementHash, fingerprintDetails, hashToElement]);

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
        // Only hit-test elements in selected states
        if (selectedStateIds.size > 0 && !selectedStateHashes.has(hash)) continue;
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
    [capture, zoom, canvasSize, elementBounds, selectedStateIds, selectedStateHashes],
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
      if (!hash) {
        setSelectedElementHash(null);
        return;
      }
      setSelectedElementHash(hash);
    },
    [getElementAtPoint],
  );

  const handlePrev = useCallback(
    () => setCurrentIndex(i => Math.max(0, i - 1)),
    [],
  );
  const handleNext = useCallback(
    () => setCurrentIndex(i => Math.min(captureScreenshots.length - 1, i + 1)),
    [captureScreenshots.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedElementHash(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);

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

  // Get fingerprint info for selected element
  const selectedFp = selectedElementHash ? (fingerprintDetails?.[selectedElementHash] ?? null) : null;

  return (
    <div className="flex h-full">
      {/* Column 2 — Elements for selected state(s) */}
      <div className="w-56 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0">
        {selectedStates.length > 0 ? (
          <div className="flex flex-col">
            {selectedStates.map((state, stateIdx) => {
              const colorIdx = states.indexOf(state);
              const color = STATE_COLORS[colorIdx % STATE_COLORS.length]!;
              return (
                <div key={state.state_id} className={stateIdx > 0 ? "border-t border-border-secondary" : ""}>
                  <div className="p-2 border-b border-border-secondary flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.border }} />
                    <h4 className="text-[10px] font-semibold text-text-primary uppercase tracking-wider truncate">{state.name}</h4>
                    <span className="text-[9px] text-text-muted ml-auto shrink-0">{state.element_ids.length}</span>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {state.element_ids.map(eid => {
                      const hash = getFingerprintHash(eid);
                      const label = resolveElementLabel(eid, fingerprintDetails, state);
                      const thumb = elementThumbnails?.[hash] ?? elementThumbnails?.[eid];
                      const isActive = hash === selectedElementHash;
                      return (
                        <button
                          key={eid}
                          onClick={() => setSelectedElementHash(isActive ? null : hash)}
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
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center px-4">
              <Layers className="size-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Select a state to see its elements</p>
            </div>
          </div>
        )}
      </div>

      {/* Column 3 — Screenshot Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border-secondary bg-bg-primary shrink-0">
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

          <div className="flex-1" />

          {/* Zoom */}
          <div className="flex items-center gap-0.5">
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

          {/* Hover tooltip */}
          {hoveredElement && hoveredElement !== selectedElementHash && (
            <div className="absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md max-w-[280px] pointer-events-none">
              <div className="font-medium text-text-primary truncate">
                {(() => {
                  const entry = hashToElement.get(hoveredElement);
                  return entry
                    ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state)
                    : hoveredElement;
                })()}
              </div>
              {(() => {
                const fp = fingerprintDetails?.[hoveredElement];
                if (!fp) return null;
                return (
                  <div className="text-text-muted mt-0.5">
                    &lt;{fp.tagName}&gt;{fp.role ? ` role="${fp.role}"` : ""}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Selected element detail overlay */}
          {selectedElementHash && (
            <div className="absolute bottom-2 left-2 right-2 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text-primary truncate">
                    {(() => {
                      const entry = hashToElement.get(selectedElementHash);
                      return entry
                        ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state)
                        : selectedElementHash;
                    })()}
                  </div>
                  {selectedFp && (
                    <div className="text-[10px] text-text-muted mt-0.5">
                      &lt;{selectedFp.tagName}&gt;{selectedFp.role ? ` role="${selectedFp.role}"` : ""}
                      {selectedFp.positionZone ? ` · ${selectedFp.positionZone}` : ""}
                    </div>
                  )}
                  {elementBounds[selectedElementHash] && (
                    <div className="text-[10px] text-text-muted mt-0.5">
                      {Math.round(elementBounds[selectedElementHash]!.x)}, {Math.round(elementBounds[selectedElementHash]!.y)} · {Math.round(elementBounds[selectedElementHash]!.width)}×{Math.round(elementBounds[selectedElementHash]!.height)}
                    </div>
                  )}
                </div>
                {elementThumbnails?.[selectedElementHash] && (
                  <img
                    src={elementThumbnails[selectedElementHash]!.startsWith("data:")
                      ? elementThumbnails[selectedElementHash]!
                      : `data:image/png;base64,${elementThumbnails[selectedElementHash]}`}
                    alt="Element thumbnail"
                    className="w-12 h-12 object-cover rounded border border-border-secondary shrink-0"
                  />
                )}
                <button
                  onClick={() => setSelectedElementHash(null)}
                  className="text-text-muted hover:text-text-primary shrink-0"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Element count legend */}
          {!selectedElementHash && (
            <div className="absolute bottom-2 right-2 text-[9px] text-text-muted bg-bg-primary/80 backdrop-blur-xs px-2 py-1 rounded border border-border-secondary/50">
              {selectedStateIds.size > 0
                ? `${Object.keys(elementBounds).filter(h => selectedStateHashes.has(h)).length} / ${Object.keys(elementBounds).length} elements`
                : `${Object.keys(elementBounds).length} elements`}
            </div>
          )}
        </div>
      </div>

      {/* Column 4 — Matching Screenshots */}
      <div className="w-48 border-l border-border-secondary bg-bg-primary overflow-y-auto shrink-0">
        <div className="p-2 border-b border-border-secondary">
          <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Screenshots {selectedStateIds.size > 0 && `(${matchingScreenshotIndices.length})`}
          </h4>
        </div>
        <div className="p-1.5 space-y-1.5">
          {matchingScreenshotIndices.map(idx => {
            const cap = captureScreenshots[idx]!;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={cap.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-full rounded border-2 transition-colors overflow-hidden ${
                  isCurrent
                    ? "border-blue-500"
                    : "border-transparent hover:border-border-secondary"
                }`}
              >
                {thumbnailCache.has(cap.id) ? (
                  <img
                    src={thumbnailCache.get(cap.id)!}
                    alt={`Capture ${cap.captureIndex + 1}`}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: 100 }}
                  />
                ) : (
                  <div className="w-full h-16 bg-bg-tertiary flex items-center justify-center">
                    <Image className="size-4 text-text-muted opacity-30" />
                  </div>
                )}
                <div className="text-[9px] text-text-muted px-1 py-0.5 text-center truncate">
                  #{cap.captureIndex + 1} &middot; {new Date(cap.capturedAt).toLocaleTimeString()}
                </div>
              </button>
            );
          })}
          {matchingScreenshotIndices.length === 0 && (
            <p className="text-[10px] text-text-muted text-center py-4">
              No screenshots match selected state(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
