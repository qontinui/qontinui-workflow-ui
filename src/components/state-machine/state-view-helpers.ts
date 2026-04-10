/**
 * Shared constants and helper functions for StateViewPanel sub-components.
 */

import {
  MousePointer,
  Type as TypeIcon,
  Globe,
  Hash,
  Box,
  Layers,
  Target,
} from "lucide-react";
import type {
  StateMachineState,
  TransitionAction,
} from "@qontinui/shared-types";
import {
  getElementLabel,
} from "@qontinui/workflow-utils";

// =============================================================================
// Types
// =============================================================================

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

// =============================================================================
// Constants
// =============================================================================

export const ELEMENT_ICONS: Record<string, typeof Hash> = {
  testid: Hash,
  role: MousePointer,
  text: TypeIcon,
  ui: Box,
  url: Globe,
  nav: Globe,
};

export const ELEMENT_COLORS: Record<string, string> = {
  testid: "border-blue-400 bg-blue-500/10 text-blue-300",
  role: "border-green-400 bg-green-500/10 text-green-300",
  text: "border-amber-400 bg-amber-500/10 text-amber-300",
  ui: "border-purple-400 bg-purple-500/10 text-purple-300",
  url: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
  nav: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
};

export const ACTION_ICONS: Partial<
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

export function getFingerprintHash(elementId: string): string {
  const idx = elementId.indexOf(":");
  return idx > 0 ? elementId.slice(idx + 1) : elementId;
}

export function resolveElementLabel(
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

export function resolveElementPosition(
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

export function resolveElementTag(
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
