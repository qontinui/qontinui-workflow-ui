/**
 * Transition viewer with action playback animation.
 *
 * Features:
 * - Filterable transition list with state-based filters
 * - Action playback engine with play/pause, step, speed control
 * - Action-specific visual animations (click ripple, type cursor, etc.)
 * - Interactive timeline dots
 *
 * This is a read-only viewer. For editing transitions, use TransitionEditor.
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  GitBranch,
  MousePointer,
  Type as TypeIcon,
  ListFilter,
  Clock,
  Globe,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  ChevronRight,
  Eye,
  ArrowRight,
  Search,
  Zap,
} from "lucide-react";
import type {
  StateMachineState,
  StateMachineTransition,
  TransitionAction,
} from "@qontinui/shared-types";
import type { PermittedTrigger, BlockedTrigger } from "../../types";
import {
  ACTION_LABELS,
  ACTION_ACTIVE_LABELS,
  getActionColorConfig,
  computeActionDuration,
} from "@qontinui/workflow-utils";

// =============================================================================
// Props
// =============================================================================

export interface TransitionsPanelProps {
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  onSelectTransition: (id: string | null) => void;
  /**
   * Active-state IDs for the "permitted from active states" filter. When
   * omitted, the filter toggle has no effect (the filter is still visible
   * but disabled).
   */
  activeStateIds?: string[];
  /**
   * Permitted triggers computed from the current active state set. Usually
   * fetched by the parent via ``useWorkflowData().getPermittedTriggers``.
   */
  permittedTriggers?: PermittedTrigger[];
  /**
   * Blocked triggers (with reasons) computed from the current active state
   * set.
   */
  blockedTriggers?: BlockedTrigger[];
}

// =============================================================================
// Constants
// =============================================================================

const ACTION_ICONS: Partial<
  Record<TransitionAction["type"], typeof MousePointer>
> = {
  click: MousePointer,
  type: TypeIcon,
  select: ListFilter,
  wait: Clock,
  navigate: Globe,
};

// =============================================================================
// Animation State
// =============================================================================

interface AnimationState {
  isPlaying: boolean;
  currentActionIndex: number;
  progress: number; // 0-1 within current action
  speed: number;
}

// =============================================================================
// Blocked-reason helpers
// =============================================================================

/**
 * Render a structured ``reason`` prefix as short human-readable text for a
 * pill badge. Long reasons should be shown in the tooltip (``title`` attr),
 * not the pill.
 *
 * Known prefixes:
 *  - ``required_state_inactive:{id}`` → "Blocked: needs {id}"
 *  - ``guard_failed:{name}`` → "Blocked: guard {name}"
 *  - ``guard_error:{name}:{exc}`` → "Blocked: guard {name} error"
 *  - ``executor_refused`` → "Blocked: refused"
 */
function shortBlockedLabel(reason: string): string {
  if (!reason) return "Blocked";
  const [prefix, ...rest] = reason.split(":");
  const tail = rest.join(":");
  switch (prefix) {
    case "required_state_inactive":
      return tail ? `Blocked: needs ${tail}` : "Blocked: missing state";
    case "guard_failed":
      return tail ? `Blocked: guard ${tail}` : "Blocked: guard failed";
    case "guard_error": {
      const guardName = rest[0] ?? "";
      return guardName
        ? `Blocked: guard ${guardName} error`
        : "Blocked: guard error";
    }
    case "executor_refused":
      return "Blocked: refused";
    default:
      return `Blocked: ${reason}`;
  }
}

// =============================================================================
// Component
// =============================================================================

export function TransitionsPanel({
  states,
  transitions,
  onSelectTransition,
  activeStateIds,
  permittedTriggers,
  blockedTriggers,
}: TransitionsPanelProps) {
  const [selectedTransitionId, setSelectedTransitionId] = useState<
    string | null
  >(null);
  const [filterFromState, setFilterFromState] = useState<string | null>(null);
  const [filterToState, setFilterToState] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [permittedOnly, setPermittedOnly] = useState(false);
  const [animation, setAnimation] = useState<AnimationState>({
    isPlaying: false,
    currentActionIndex: -1,
    progress: 0,
    speed: 1,
  });

  // Fast-lookup sets/maps over the introspection props.
  const permittedIds = useMemo(
    () => new Set((permittedTriggers ?? []).map((p) => p.transition_id)),
    [permittedTriggers],
  );
  const blockedReasonById = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of blockedTriggers ?? []) {
      map.set(b.transition_id, b.reason);
    }
    return map;
  }, [blockedTriggers]);

  // The permitted-only filter only makes sense when we have introspection
  // data. Otherwise the toggle is visible but disabled.
  const hasIntrospectionData =
    (permittedTriggers?.length ?? 0) > 0 ||
    (blockedTriggers?.length ?? 0) > 0 ||
    (activeStateIds?.length ?? 0) > 0;

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const selectedTransition = useMemo(
    () => transitions.find((t) => t.transition_id === selectedTransitionId),
    [transitions, selectedTransitionId],
  );

  // Filter transitions
  const filteredTransitions = useMemo(() => {
    return transitions.filter((t) => {
      if (filterFromState && !t.from_states.includes(filterFromState))
        return false;
      if (filterToState && !t.activate_states.includes(filterToState))
        return false;
      if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        if (!t.name.toLowerCase().includes(lower)) return false;
      }
      if (permittedOnly && hasIntrospectionData) {
        if (!permittedIds.has(t.transition_id)) return false;
      }
      return true;
    });
  }, [
    transitions,
    filterFromState,
    filterToState,
    searchFilter,
    permittedOnly,
    hasIntrospectionData,
    permittedIds,
  ]);

  const stateNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of states) {
      map.set(s.state_id, s.name);
    }
    return map;
  }, [states]);

  // Animation functions
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setAnimation((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const animate = useCallback(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0) return;

    const tick = (timestamp: number) => {
      setAnimation((prev) => {
        if (!prev.isPlaying) return prev;

        const elapsed = timestamp - startTimeRef.current;
        const currentAction =
          selectedTransition.actions[prev.currentActionIndex];
        if (!currentAction) {
          return { ...prev, isPlaying: false };
        }

        const duration = computeActionDuration(currentAction) / prev.speed;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          // Move to next action
          const nextIndex = prev.currentActionIndex + 1;
          if (nextIndex >= selectedTransition.actions.length) {
            return { ...prev, isPlaying: false, progress: 1 };
          }
          startTimeRef.current = timestamp;
          return { ...prev, currentActionIndex: nextIndex, progress: 0 };
        }

        return { ...prev, progress };
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    startTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(tick);
  }, [selectedTransition]);

  const playAnimation = useCallback(() => {
    setAnimation((prev) => {
      const startIndex =
        prev.currentActionIndex < 0 ? 0 : prev.currentActionIndex;
      // If completed, restart from beginning
      const idx =
        prev.progress >= 1 &&
        startIndex >= (selectedTransition?.actions.length ?? 0) - 1
          ? 0
          : startIndex;
      return { ...prev, isPlaying: true, currentActionIndex: idx, progress: 0 };
    });
    setTimeout(animate, 0);
  }, [animate, selectedTransition]);

  const pauseAnimation = useCallback(() => {
    stopAnimation();
  }, [stopAnimation]);

  const resetAnimation = useCallback(() => {
    stopAnimation();
    setAnimation((prev) => ({
      ...prev,
      currentActionIndex: -1,
      progress: 0,
    }));
  }, [stopAnimation]);

  const stepForward = useCallback(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex + 1;
      if (!selectedTransition || next >= selectedTransition.actions.length)
        return prev;
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation, selectedTransition]);

  const stepBackward = useCallback(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex - 1;
      if (next < 0) return { ...prev, currentActionIndex: -1, progress: 0 };
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Reset animation when transition changes
  useEffect(() => {
    resetAnimation();
  }, [selectedTransitionId, resetAnimation]);

  const handleSelectTransition = useCallback(
    (tid: string) => {
      setSelectedTransitionId(tid === selectedTransitionId ? null : tid);
      onSelectTransition(tid === selectedTransitionId ? null : tid);
    },
    [selectedTransitionId, onSelectTransition],
  );

  // Calculate overall progress for the progress bar
  const overallProgress = useMemo(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0)
      return 0;
    if (animation.currentActionIndex < 0) return 0;
    const completedActions = animation.currentActionIndex;
    const currentProgress = animation.progress;
    return (
      (completedActions + currentProgress) / selectedTransition.actions.length
    );
  }, [selectedTransition, animation]);

  return (
    <div className="flex h-full">
      {/* Left: Transition List */}
      <div className="w-80 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0">
        <div className="p-3 border-b border-border-secondary">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="size-4 text-brand-primary" />
            <h3 className="text-sm font-semibold text-text-primary">
              Transitions
            </h3>
            <span className="text-xs text-text-muted ml-auto">
              {filteredTransitions.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search transitions..."
              aria-label="Search transitions..."
              className="w-full text-[10px] h-6 pl-7 px-2 bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterFromState ?? ""}
              onChange={(e) => setFilterFromState(e.target.value || null)}
              className="text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
              style={{ colorScheme: "dark" }}
            >
              <option value="">All from states</option>
              {states.map((s) => (
                <option key={s.state_id} value={s.state_id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={filterToState ?? ""}
              onChange={(e) => setFilterToState(e.target.value || null)}
              className="text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
              style={{ colorScheme: "dark" }}
            >
              <option value="">All target states</option>
              {states.map((s) => (
                <option key={s.state_id} value={s.state_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Permitted-from-active-states toggle */}
          <label
            className={`flex items-center gap-2 mt-2 text-[10px] select-none ${
              hasIntrospectionData
                ? "text-text-secondary cursor-pointer"
                : "text-text-muted/50 cursor-not-allowed"
            }`}
            title={
              hasIntrospectionData
                ? "Show only transitions currently permitted from the active state set"
                : "No active-state introspection data available"
            }
          >
            <input
              type="checkbox"
              checked={permittedOnly && hasIntrospectionData}
              disabled={!hasIntrospectionData}
              onChange={(e) => setPermittedOnly(e.target.checked)}
              className="accent-brand-primary"
            />
            <span>Permitted from active states</span>
            {hasIntrospectionData && (
              <span className="ml-auto text-[9px] text-text-muted">
                {permittedIds.size} permitted / {blockedReasonById.size}{" "}
                blocked
              </span>
            )}
          </label>
        </div>

        <div className="p-2 space-y-0.5">
          {filteredTransitions.map((t) => {
            const isSelected = t.transition_id === selectedTransitionId;
            const isPermitted = permittedIds.has(t.transition_id);
            const blockedReason = blockedReasonById.get(t.transition_id);
            return (
              <button
                key={t.transition_id}
                onClick={() => handleSelectTransition(t.transition_id)}
                title={
                  blockedReason
                    ? `Blocked: ${blockedReason}`
                    : isPermitted
                      ? "Permitted from active states"
                      : undefined
                }
                className={`
                  w-full text-left px-3 py-2 rounded-md transition-colors text-sm
                  ${
                    isSelected
                      ? "bg-brand-primary/10 border border-brand-primary/30"
                      : "hover:bg-bg-secondary border border-transparent"
                  }
                `}
              >
                <div className="flex items-center gap-1.5">
                  {/* Permitted marker dot — only when introspection data is available */}
                  {hasIntrospectionData && isPermitted && (
                    <span
                      aria-label="Permitted"
                      className="shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"
                    />
                  )}
                  {/* Action type icons */}
                  <span className="flex items-center gap-0.5">
                    {[...new Set(t.actions.map((a) => a.type))]
                      .slice(0, 3)
                      .map((type) => {
                        const Icon = ACTION_ICONS[type];
                        const color = getActionColorConfig(type);
                        return Icon ? (
                          <Icon
                            key={type}
                            className={`size-3 ${color.text}`}
                          />
                        ) : null;
                      })}
                  </span>
                  <span className="font-medium text-text-primary truncate flex-1">
                    {t.name || "Unnamed"}
                  </span>
                  {t.stays_visible && (
                    <Eye className="size-3 text-green-500 shrink-0" />
                  )}
                  {t.actions.length > 0 && (
                    <span className="text-[9px] text-text-muted bg-bg-secondary px-1 rounded">
                      {t.actions.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5 ml-4 text-[10px] text-text-muted">
                  <span className="truncate">
                    {t.from_states
                      .map((s) => stateNameMap.get(s) ?? s)
                      .join(", ")}
                  </span>
                  <ArrowRight className="size-2.5 shrink-0" />
                  <span className="truncate">
                    {t.activate_states
                      .map((s) => stateNameMap.get(s) ?? s)
                      .join(", ")}
                  </span>
                </div>
                {/* Blocked reason pill */}
                {blockedReason && (
                  <div className="mt-1 ml-4">
                    <span
                      title={blockedReason}
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-gray-500/20 text-gray-400 border-gray-500/30"
                    >
                      {shortBlockedLabel(blockedReason)}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
          {filteredTransitions.length === 0 && (
            <p className="text-xs text-text-muted text-center py-4">
              No transitions match filters.
            </p>
          )}
        </div>
      </div>

      {/* Right: Transition Detail + Animation */}
      <div className="flex-1 overflow-y-auto">
        {selectedTransition ? (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  {selectedTransition.name || "Unnamed Transition"}
                </h2>
                {selectedTransition.stays_visible && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-green-500/20 text-green-400 border-green-500/30">
                    <Eye className="size-2.5" />
                    Visible
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-text-muted flex-wrap">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted">
                  From:{" "}
                  {selectedTransition.from_states
                    .map((s) => stateNameMap.get(s) ?? s)
                    .join(", ")}
                </span>
                <ArrowRight className="size-3" />
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted">
                  To:{" "}
                  {selectedTransition.activate_states
                    .map((s) => stateNameMap.get(s) ?? s)
                    .join(", ")}
                </span>
                {selectedTransition.exit_states.length > 0 && (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border status-error text-red-400 border-red-500/30">
                    Exit:{" "}
                    {selectedTransition.exit_states
                      .map((s) => stateNameMap.get(s) ?? s)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            {selectedTransition.actions.length > 0 && (
              <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-3.5 text-brand-primary" />
                    <span className="text-xs font-medium text-text-primary">
                      Action Playback
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={animation.speed}
                      onChange={(e) =>
                        setAnimation((prev) => ({
                          ...prev,
                          speed: parseFloat(e.target.value),
                        }))
                      }
                      className="text-[10px] h-5 w-16 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                      <option value="4">4x</option>
                    </select>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-bg-primary rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-100"
                    style={{ width: `${overallProgress * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={resetAnimation}
                    className="h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                    title="Reset"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                  <button
                    onClick={stepBackward}
                    disabled={animation.currentActionIndex <= 0}
                    className="h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step back"
                  >
                    <SkipBack className="size-3.5" />
                  </button>
                  <button
                    onClick={
                      animation.isPlaying ? pauseAnimation : playAnimation
                    }
                    className="h-9 w-9 p-0 inline-flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary/90"
                    title={animation.isPlaying ? "Pause" : "Play"}
                  >
                    {animation.isPlaying ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={stepForward}
                    disabled={
                      animation.currentActionIndex >=
                      selectedTransition.actions.length - 1
                    }
                    className="h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step forward"
                  >
                    <SkipForward className="size-3.5" />
                  </button>
                </div>

                {/* Action timeline dots */}
                <div className="mt-3 flex items-center justify-center gap-1">
                  {selectedTransition.actions.map((action, idx) => {
                    const Icon = ACTION_ICONS[action.type] ?? ChevronRight;
                    const isPastAction =
                      animation.currentActionIndex >= 0 &&
                      idx < animation.currentActionIndex;
                    const isCurrentAction =
                      idx === animation.currentActionIndex;
                    const color = getActionColorConfig(action.type);
                    return (
                      <button
                        key={`${idx}-${action.type}`}
                        onClick={() => {
                          stopAnimation();
                          setAnimation((prev) => ({
                            ...prev,
                            currentActionIndex: idx,
                            progress: 0,
                          }));
                        }}
                        className={`
                          flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] border transition-all
                          ${
                            isCurrentAction
                              ? `${color.bg} ${color.border} ${color.text} shadow-xs`
                              : isPastAction
                                ? "bg-green-500/10 border-green-500/30 text-green-400"
                                : "bg-bg-primary border-border-secondary text-text-muted hover:border-brand-primary/30"
                          }
                        `}
                        title={`${ACTION_LABELS[action.type] ?? action.type}: ${action.target || action.url || action.text || ""}`}
                      >
                        <Icon className="size-2.5" />
                        <span>{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Progress indicator text */}
                <div className="mt-1.5 text-center text-[10px] text-text-muted">
                  {animation.currentActionIndex >= 0
                    ? `Action ${animation.currentActionIndex + 1} of ${selectedTransition.actions.length}`
                    : "Ready to play"}
                </div>
              </div>
            )}

            {/* Action sequence */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">
                Actions ({selectedTransition.actions.length})
              </h3>

              {selectedTransition.actions.length === 0 ? (
                <p className="text-xs text-text-muted">No actions defined.</p>
              ) : (
                <div className="space-y-2">
                  {selectedTransition.actions.map((action, idx) => {
                    const Icon = ACTION_ICONS[action.type] ?? ChevronRight;
                    const color = getActionColorConfig(action.type);
                    const isCurrent = idx === animation.currentActionIndex;
                    const isPast =
                      animation.currentActionIndex >= 0 &&
                      idx < animation.currentActionIndex;

                    return (
                      <div
                        key={`${idx}-${action.type}`}
                        className={`
                          flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
                          ${
                            isCurrent
                              ? `${color.border} ${color.bg} shadow-xs`
                              : isPast
                                ? "border-green-500/30 bg-green-500/5"
                                : "border-border-secondary bg-bg-secondary"
                          }
                        `}
                      >
                        {/* Action index + icon */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-text-muted font-mono w-4 text-right">
                            {idx + 1}
                          </span>
                          <div
                            className={`p-1.5 rounded-md ${color.bg} ${color.text}`}
                          >
                            <Icon className="size-3.5" />
                          </div>
                        </div>

                        {/* Action details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-text-primary flex items-center gap-1.5">
                            <span>
                              {ACTION_LABELS[action.type] ?? action.type}
                            </span>
                            {isCurrent && animation.isPlaying && (
                              <span
                                className={`animate-pulse ${color.text} text-[10px]`}
                              >
                                {ACTION_ACTIVE_LABELS[action.type]}
                              </span>
                            )}
                          </div>

                          {/* Action target details */}
                          {action.target && (
                            <code className="text-[10px] text-text-muted mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded">
                              {action.target}
                            </code>
                          )}
                          {action.text && (
                            <div className="text-[10px] text-text-muted mt-0.5 font-mono bg-bg-primary/50 px-1 py-0.5 rounded">
                              &ldquo;
                              {isCurrent && animation.isPlaying
                                ? action.text.slice(
                                    0,
                                    Math.floor(
                                      action.text.length * animation.progress,
                                    ),
                                  )
                                : action.text}
                              &rdquo;
                              {isCurrent && animation.isPlaying && (
                                <span className="animate-pulse text-brand-primary">
                                  |
                                </span>
                              )}
                            </div>
                          )}
                          {action.url && (
                            <code className="text-[10px] text-cyan-400 mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded">
                              {action.url}
                            </code>
                          )}
                          {action.delay_ms != null && (
                            <span className="text-[10px] text-text-muted mt-0.5 block">
                              {action.delay_ms}ms
                              {isCurrent && animation.isPlaying && (
                                <span className="ml-1 text-text-muted/70">
                                  (
                                  {Math.round(
                                    animation.progress * (action.delay_ms ?? 0),
                                  )}
                                  ms elapsed)
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Status indicator with action-specific animation */}
                        {isPast && (
                          <div className="text-green-500 shrink-0 mt-0.5">
                            <svg
                              className="size-4"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                            </svg>
                          </div>
                        )}
                        {isCurrent && animation.isPlaying && (
                          <div className="shrink-0 mt-0.5">
                            {action.type === "click" ? (
                              <div className="relative w-5 h-5 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                              </div>
                            ) : action.type === "navigate" ? (
                              <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                                <ArrowRight
                                  className="size-4 text-cyan-400 animate-bounce"
                                  style={{ animationDuration: "0.6s" }}
                                />
                              </div>
                            ) : action.type === "type" ? (
                              <div className="relative w-5 h-5 flex items-center justify-center">
                                <div
                                  className="w-0.5 h-3.5 bg-amber-400 animate-pulse"
                                  style={{ animationDuration: "0.5s" }}
                                />
                              </div>
                            ) : action.type === "select" ? (
                              <div className="relative w-5 h-5 flex items-center justify-center">
                                <ChevronRight
                                  className="size-3.5 text-purple-400 animate-bounce"
                                  style={{
                                    animationDuration: "0.8s",
                                    transform: "rotate(90deg)",
                                  }}
                                />
                              </div>
                            ) : action.type === "wait" ? (
                              <div className="relative w-5 h-5 flex items-center justify-center">
                                <div
                                  className="w-4 h-4 rounded-full border-2 border-gray-400/40 border-t-gray-400 animate-spin"
                                  style={{ animationDuration: "1.5s" }}
                                />
                              </div>
                            ) : (
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${color.text} border-current border-t-transparent animate-spin`}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary">
              <div>Path Cost: {selectedTransition.path_cost}</div>
              <div>
                Stays Visible: {selectedTransition.stays_visible ? "Yes" : "No"}
              </div>
              <div>
                ID:{" "}
                <code className="bg-bg-secondary px-1 rounded">
                  {selectedTransition.transition_id}
                </code>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
              <GitBranch className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a transition to view its details</p>
              <p className="text-xs mt-1 text-text-muted/70">
                {transitions.length} transition
                {transitions.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
