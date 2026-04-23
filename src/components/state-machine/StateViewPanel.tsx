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
 *
 * View sub-components are extracted into separate files:
 * - SpatialCanvas.tsx: Force-directed graph visualization
 * - StateLayoutView.tsx: Viewport-positioned element view
 * - ScreenshotStateView.tsx: Screenshot gallery with bounding box overlays
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  List as VirtualList,
  useListRef,
  useDynamicRowHeight,
  type RowComponentProps,
} from "react-window";
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Play,
  Lock,
  Eye,
  BookOpen,
  Search,
  BarChart3,
  List,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  CheckCircle,
  Image,
} from "lucide-react";
import type {
  StateMachineState,
  StateMachineTransition,
} from "@qontinui/shared-types";
import {
  getElementTypePrefix,
  getElementLabel,
  getActionTypeColor,
  STATE_COLORS,
} from "@qontinui/workflow-utils";

import type { FingerprintDetail, CaptureScreenshotMeta } from "./state-view-helpers";
import {
  ELEMENT_ICONS,
  ELEMENT_COLORS,
  ACTION_ICONS,
  resolveElementLabel,
} from "./state-view-helpers";
import { SpatialCanvas } from "./SpatialCanvas";
import { StateLayoutView } from "./StateLayoutView";
import { ScreenshotStateView } from "./ScreenshotStateView";

// Re-export types for consumers
export type { FingerprintDetail, CaptureScreenshotMeta } from "./state-view-helpers";

// =============================================================================
// Props
// =============================================================================

type ViewMode = "list" | "spatial" | "screenshot";

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
// StateRow — extracted so react-window can virtualize rendering
// =============================================================================

type StateRowProps = {
  filteredStates: StateMachineState[];
  states: StateMachineState[];
  transitionMap: {
    outgoing: Map<string, StateMachineTransition[]>;
    incoming: Map<string, StateMachineTransition[]>;
  };
  sharedElements: Map<string, string[]>;
  fingerprintDetails?: Record<string, FingerprintDetail>;
  expandedStates: Set<string>;
  effectiveSelectedStateId: string | null;
  viewMode: ViewMode;
  selectedStateIds: Set<string>;
  onRowClick: (state: StateMachineState, e: React.MouseEvent) => void;
};

// react-window's <List> auto-observes its container's children when rowHeight
// is a DynamicRowHeight (see useDynamicRowHeight), so each row only needs to
// accept the style/ariaAttributes props — no manual observer registration.

function StateRow({
  index,
  style,
  ariaAttributes,
  filteredStates,
  states,
  transitionMap,
  sharedElements,
  fingerprintDetails,
  expandedStates,
  effectiveSelectedStateId,
  viewMode,
  selectedStateIds,
  onRowClick,
}: RowComponentProps<StateRowProps>) {
  const state = filteredStates[index]!;
  const colorIdx = states.indexOf(state);
  const color = STATE_COLORS[colorIdx % STATE_COLORS.length]!;
  const isSelected =
    viewMode === "screenshot"
      ? selectedStateIds.has(state.state_id)
      : state.state_id === effectiveSelectedStateId;
  const isExpanded = expandedStates.has(state.state_id);
  const stateOutgoing = transitionMap.outgoing.get(state.state_id) ?? [];
  const stateIncoming = transitionMap.incoming.get(state.state_id) ?? [];
  const isInitial = state.extra_metadata?.initial === true;
  const isBlocking = state.extra_metadata?.blocking === true;

  return (
    <div style={style} {...ariaAttributes}>
      <button
        data-ui-id={`state-item-${state.state_id}`}
        onClick={(e) => onRowClick(state, e)}
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
  const [viewMode, setViewMode] = useState<ViewMode>(
    captureScreenshots && captureScreenshots.length > 0 ? "screenshot" : "list",
  );

  // Auto-switch to screenshot view when captures become available after mount
  const [hasAutoSwitched, setHasAutoSwitched] = useState(
    () => !!(captureScreenshots && captureScreenshots.length > 0),
  );
  useEffect(() => {
    if (!hasAutoSwitched && captureScreenshots && captureScreenshots.length > 0) {
      setViewMode("screenshot");
      setHasAutoSwitched(true);
    }
  }, [captureScreenshots, hasAutoSwitched]);

  // Multi-select support for screenshot mode — this IS local because it's a
  // mode-specific UI concern, not part of the page's single-selection model.
  const [selectedStateIds, setSelectedStateIds] = useState<Set<string>>(new Set());

  // Single selection is fully controlled by the parent via `selectedStateId` /
  // `onSelectState`. The parent is responsible for filtering spurious events
  // from hidden tabs (see activeTab gate in UIBridgeStateMachinePage).
  const effectiveSelectedStateId = selectedStateId;

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

  const toggleExpanded = useCallback((stateId: string) => {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(stateId)) {
        next.delete(stateId);
      } else {
        next.add(stateId);
      }
      return next;
    });
  }, []);

  const listRef = useListRef(null);
  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: 60 });

  const handleRowClick = useCallback(
    (state: StateMachineState, e: React.MouseEvent) => {
      const isSelected =
        viewMode === "screenshot"
          ? selectedStateIds.has(state.state_id)
          : state.state_id === effectiveSelectedStateId;
      const isExpanded = expandedStates.has(state.state_id);
      if (viewMode === "screenshot" && (e.ctrlKey || e.metaKey)) {
        setSelectedStateIds((prev) => {
          const next = new Set(prev);
          if (next.has(state.state_id)) {
            next.delete(state.state_id);
          } else {
            next.add(state.state_id);
          }
          return next;
        });
      } else if (viewMode === "screenshot") {
        setSelectedStateIds(
          isSelected ? new Set() : new Set([state.state_id]),
        );
        onSelectState(isSelected ? null : state.state_id);
      } else {
        onSelectState(isSelected ? null : state.state_id);
      }
      if (!isExpanded) toggleExpanded(state.state_id);
    },
    [viewMode, selectedStateIds, effectiveSelectedStateId, expandedStates, toggleExpanded, onSelectState],
  );

  // Scroll the list to the selected state when it changes from outside.
  useEffect(() => {
    if (!effectiveSelectedStateId) return;
    const idx = filteredStates.findIndex(
      (s) => s.state_id === effectiveSelectedStateId,
    );
    if (idx >= 0) {
      listRef.current?.scrollToRow({
        index: idx,
        align: "smart",
        behavior: "smooth",
      });
    }
  }, [effectiveSelectedStateId, filteredStates, listRef]);

  return (
    <div className="flex flex-1 h-full min-w-0">
      {/* Left Panel: State List */}
      <div className="w-72 border-r border-border-secondary bg-bg-primary shrink-0 flex flex-col min-h-0">
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

        <div className="flex-1 min-h-0 p-2">
          {filteredStates.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">
              No states match filter.
            </p>
          ) : (
            <VirtualList
              listRef={listRef}
              rowCount={filteredStates.length}
              rowHeight={dynamicRowHeight}
              rowComponent={StateRow}
              rowProps={{
                filteredStates,
                states,
                transitionMap,
                sharedElements,
                fingerprintDetails,
                expandedStates,
                effectiveSelectedStateId,
                viewMode,
                selectedStateIds,
                onRowClick: handleRowClick,
              }}
              overscanCount={5}
              style={{ width: "100%", height: "100%" }}
            />
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
            selectedStateIds={selectedStateIds}
            fingerprintDetails={fingerprintDetails}
            elementThumbnails={elementThumbnails}
          />
        ) : viewMode === "spatial" ? (
          <SpatialCanvas
            states={states}
            transitions={transitions}
            selectedStateId={effectiveSelectedStateId}
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
                      key={`${i}-${criteria}`}
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
