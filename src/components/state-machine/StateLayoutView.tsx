/**
 * State layout view — shows elements positioned on a viewport representation.
 *
 * Extracted from StateViewPanel to follow the Single Responsibility Principle.
 */

import React, { useState, useMemo } from "react";
import { Layout } from "lucide-react";
import type { StateMachineState } from "@qontinui/shared-types";
import { getElementTypePrefix, getElementLabel } from "@qontinui/workflow-utils";
import type { FingerprintDetail } from "./state-view-helpers";
import {
  ELEMENT_COLORS,
  resolveElementLabel,
  resolveElementPosition,
  resolveElementTag,
} from "./state-view-helpers";

// =============================================================================
// Props
// =============================================================================

export interface StateLayoutViewProps {
  state: StateMachineState;
  elementThumbnails?: Record<string, string>;
  fingerprintDetails?: Record<string, FingerprintDetail>;
}

// =============================================================================
// Component
// =============================================================================

export function StateLayoutView({
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-bg-primary/95 backdrop-blur-xs border border-border-secondary rounded px-2 py-1 shadow-md whitespace-nowrap">
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
