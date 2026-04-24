// src/components/state-machine/StateMachineGraphView.tsx
import { useCallback as useCallback3, useMemo as useMemo3, useEffect as useEffect3, useState as useState3, useRef as useRef3 } from "react";
import {
  ReactFlow as ReactFlow2,
  ReactFlowProvider as ReactFlowProvider2,
  Background as Background2,
  Controls as Controls2,
  MiniMap as MiniMap2,
  useNodesState as useNodesState2,
  useEdgesState as useEdgesState2,
  useReactFlow as useReactFlow2,
  MarkerType as MarkerType2,
  Panel as Panel2,
  BackgroundVariant as BackgroundVariant2
} from "@xyflow/react";
import { LayoutGrid, Keyboard, Maximize, Play as Play3 } from "lucide-react";
import {
  firstActionTargetString as firstActionTargetString2,
  getLayoutedElements as getLayoutedElements2,
  STATE_MACHINE_LAYOUT_OPTIONS as STATE_MACHINE_LAYOUT_OPTIONS2
} from "@qontinui/workflow-utils";

// src/components/state-machine/StateMachineStateNode.tsx
import { memo, useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
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
  GripVertical
} from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZE_TIERS = {
  small: { cardWidth: 200, gridCols: 3, gridMaxWidth: 170, maxElements: 6, tileSize: 52 },
  medium: { cardWidth: 260, gridCols: 4, gridMaxWidth: 224, maxElements: 12, tileSize: 52 },
  large: { cardWidth: 320, gridCols: 5, gridMaxWidth: 280, maxElements: 20, tileSize: 52 },
  xlarge: { cardWidth: 380, gridCols: 6, gridMaxWidth: 340, maxElements: 30, tileSize: 52 }
};
function getCardSize(elementCount) {
  if (elementCount <= 4) return SIZE_TIERS.small;
  if (elementCount <= 10) return SIZE_TIERS.medium;
  if (elementCount <= 18) return SIZE_TIERS.large;
  return SIZE_TIERS.xlarge;
}
var ELEMENT_STYLES = {
  testid: { icon: Hash, color: "text-blue-400", tileBg: "bg-blue-500/10", tileBorder: "border-blue-500/20", hoverBg: "hover:bg-blue-500/30" },
  role: { icon: MousePointer, color: "text-green-400", tileBg: "bg-green-500/10", tileBorder: "border-green-500/20", hoverBg: "hover:bg-green-500/30" },
  text: { icon: TypeIcon, color: "text-amber-400", tileBg: "bg-amber-500/10", tileBorder: "border-amber-500/20", hoverBg: "hover:bg-amber-500/30" },
  ui: { icon: Box, color: "text-purple-400", tileBg: "bg-purple-500/10", tileBorder: "border-purple-500/20", hoverBg: "hover:bg-purple-500/30" },
  url: { icon: Globe, color: "text-cyan-400", tileBg: "bg-cyan-500/10", tileBorder: "border-cyan-500/20", hoverBg: "hover:bg-cyan-500/30" },
  nav: { icon: Globe, color: "text-cyan-400", tileBg: "bg-cyan-500/10", tileBorder: "border-cyan-500/20", hoverBg: "hover:bg-cyan-500/30" },
  other: { icon: Layers, color: "text-gray-400", tileBg: "bg-gray-500/10", tileBorder: "border-gray-500/20", hoverBg: "hover:bg-gray-500/30" }
};
function getElementStyle(elementId) {
  const colonIdx = elementId.indexOf(":");
  const prefix = colonIdx > 0 ? elementId.slice(0, colonIdx) : "other";
  const label = colonIdx > 0 ? elementId.slice(colonIdx + 1) : elementId;
  const style = ELEMENT_STYLES[prefix] ?? ELEMENT_STYLES.other;
  return { ...style, label, prefix };
}
function summarizeElementTypes(elementIds) {
  const counts = /* @__PURE__ */ new Map();
  for (const eid of elementIds) {
    const style = getElementStyle(eid);
    counts.set(style.prefix, (counts.get(style.prefix) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([prefix, count]) => ({
    prefix,
    count,
    color: (ELEMENT_STYLES[prefix] ?? ELEMENT_STYLES.other).color
  }));
}
function StateMachineStateNodeInner({ data }) {
  const nodeData = data;
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
    elementThumbnails
  } = nodeData;
  const confidencePercent = Math.round(confidence * 100);
  const cardSize = getCardSize(elementCount);
  const elementSummary = useMemo(() => summarizeElementTypes(elementIds), [elementIds]);
  const hasConnections = (outgoingCount ?? 0) > 0 || (incomingCount ?? 0) > 0;
  return /* @__PURE__ */ jsxs("div", { style: { width: cardSize.cardWidth }, "data-id": stateId, children: [
    /* @__PURE__ */ jsx(
      Handle,
      {
        type: "target",
        position: Position.Top,
        className: `!w-3 !h-3 !border-2 !border-bg-primary ${isSelected ? "!bg-brand-primary !shadow-sm !shadow-brand-primary/40" : "!bg-brand-primary"}`
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
          rounded-lg border-2 px-3 py-2.5 shadow-md
          transition-all duration-150 relative
          ${isDropTarget ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/40 shadow-green-500/20 shadow-lg" : isSelected ? "border-brand-primary bg-bg-secondary ring-2 ring-brand-primary/30 shadow-brand-primary/20 shadow-lg" : isBlocking ? "border-amber-400 bg-amber-950/20 shadow-amber-500/10" : "border-border-secondary bg-bg-primary hover:border-brand-primary/50 hover:shadow-lg"}
        `,
        children: [
          isDropTarget && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-lg bg-green-500/5 pointer-events-none z-0" }),
          isInitial && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 -left-3 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 bg-[#FFD700] text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-yellow-500/30", children: [
            /* @__PURE__ */ jsx(Play, { className: "size-2.5 fill-current" }),
            /* @__PURE__ */ jsx("span", { children: "START" })
          ] }) }),
          (outgoingCount ?? 0) > 0 && /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 z-10", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-0.5 bg-brand-secondary/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm",
              title: `${outgoingCount} outgoing`,
              children: [
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-2" }),
                /* @__PURE__ */ jsx("span", { children: outgoingCount })
              ]
            }
          ) }),
          (incomingCount ?? 0) > 0 && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-2 z-10", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-0.5 bg-brand-primary/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm",
              title: `${incomingCount} incoming`,
              children: [
                /* @__PURE__ */ jsx(ArrowDownLeft, { className: "size-2" }),
                /* @__PURE__ */ jsx("span", { children: incomingCount })
              ]
            }
          ) }),
          !hasConnections && elementIds.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 bg-bg-secondary/90 text-text-muted text-[7px] px-1.5 py-0.5 rounded-full shadow-sm border border-border-secondary", children: [
            /* @__PURE__ */ jsx(Link2, { className: "size-2" }),
            /* @__PURE__ */ jsx("span", { children: "no links" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1 relative z-[1]", children: [
            isBlocking ? /* @__PURE__ */ jsx(Lock, { className: "size-3.5 text-amber-500 shrink-0" }) : /* @__PURE__ */ jsx(Layers, { className: "size-3.5 text-brand-primary shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-text-primary truncate flex-1", children: name })
          ] }),
          description && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-muted mb-1.5 line-clamp-2 relative z-[1]", children: description }),
          elementIds.length > 0 && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid gap-1 mb-2 mx-auto relative z-[1]",
              style: {
                gridTemplateColumns: `repeat(${cardSize.gridCols}, 1fr)`,
                maxWidth: cardSize.gridMaxWidth
              },
              children: [
                elementIds.slice(0, cardSize.maxElements).map((elementId) => {
                  const style = getElementStyle(elementId);
                  const Icon = style.icon;
                  const thumbnail = elementThumbnails?.[elementId] ?? elementThumbnails?.[style.label];
                  const thumbnailSrc = thumbnail ? thumbnail.startsWith("data:") ? thumbnail : `data:image/png;base64,${thumbnail}` : void 0;
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `
                    relative group rounded-md overflow-hidden
                    ${style.tileBg} border ${style.tileBorder}
                    ${style.hoverBg} hover:shadow-md hover:z-10 hover:scale-105
                    ${onStartElementDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
                    transition-all duration-100
                  `,
                      style: { aspectRatio: "1 / 1" },
                      title: onStartElementDrag ? `${elementId}
Drag to create transition` : elementId,
                      draggable: !!onStartElementDrag,
                      onDragStart: (e) => {
                        if (!onStartElementDrag) return;
                        e.stopPropagation();
                        const isMoveOperation = e.altKey;
                        e.dataTransfer.setData(
                          "application/ui-bridge-element-drag",
                          JSON.stringify({
                            sourceStateId: stateId,
                            elementId,
                            isMoveOperation
                          })
                        );
                        e.dataTransfer.effectAllowed = isMoveOperation ? "move" : "link";
                        onStartElementDrag(stateId, elementId);
                      },
                      children: [
                        thumbnailSrc ? /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: thumbnailSrc,
                            alt: style.label,
                            className: "w-full h-full object-contain rounded-sm",
                            draggable: false
                          }
                        ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full px-0.5 py-1", children: [
                          /* @__PURE__ */ jsx(Icon, { className: `size-3.5 ${style.color} shrink-0` }),
                          /* @__PURE__ */ jsx("span", { className: `text-[7px] ${style.color} truncate w-full text-center mt-0.5 leading-tight`, children: style.label })
                        ] }),
                        onStartElementDrag && /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "nodrag absolute top-0 right-0 p-0.5 opacity-0 group-hover:opacity-80 transition-opacity z-10",
                            title: "Drag to create transition",
                            children: /* @__PURE__ */ jsx(GripVertical, { className: "size-2.5 text-text-muted" })
                          }
                        )
                      ]
                    },
                    elementId
                  );
                }),
                elementIds.length > cardSize.maxElements && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "rounded-md bg-bg-secondary text-text-muted flex items-center justify-center border border-border-secondary",
                    style: { aspectRatio: "1 / 1" },
                    children: /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-medium", children: [
                      "+",
                      elementIds.length - cardSize.maxElements
                    ] })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-text-muted relative z-[1]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "px-1.5 py-0.5 text-[10px] bg-bg-tertiary rounded border border-border-secondary", children: [
                elementCount,
                " el"
              ] }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `px-1.5 py-0.5 text-[10px] rounded border ${confidencePercent >= 80 ? "bg-green-500/10 text-green-400 border-green-500/20" : confidencePercent >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`,
                  children: [
                    confidencePercent,
                    "%"
                  ]
                }
              )
            ] }),
            elementSummary.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: elementSummary.slice(0, 4).map(({ prefix, count, color }) => {
              const Icon = getElementStyle(`${prefix}:x`).icon;
              return /* @__PURE__ */ jsxs("span", { className: `flex items-center gap-0.5 text-[8px] ${color}`, title: `${count} ${prefix}`, children: [
                /* @__PURE__ */ jsx(Icon, { className: "size-2" }),
                count
              ] }, prefix);
            }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Handle,
      {
        type: "source",
        position: Position.Bottom,
        className: `!w-3 !h-3 !border-2 !border-bg-primary ${isSelected ? "!bg-brand-secondary !shadow-sm !shadow-brand-secondary/40" : "!bg-brand-secondary"}`
      }
    )
  ] });
}
var StateMachineStateNode = memo(StateMachineStateNodeInner);

// src/components/state-machine/StateMachineTransitionEdge.tsx
import { memo as memo2 } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath
} from "@xyflow/react";
import {
  MousePointer as MousePointer2,
  Type as TypeIcon2,
  ListFilter,
  Clock,
  Globe as Globe2,
  Eye
} from "lucide-react";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ACTION_ICONS = {
  click: MousePointer2,
  type: TypeIcon2,
  select: ListFilter,
  wait: Clock,
  navigate: Globe2
};
var ACTION_COLORS = {
  click: "text-blue-400",
  type: "text-amber-400",
  select: "text-purple-400",
  wait: "text-gray-400",
  navigate: "text-cyan-400"
};
function StateMachineTransitionEdgeInner(props) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
    selected
  } = props;
  const edgeData = data;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const isHighlighted = edgeData?.isHighlighted ?? false;
  const isActive = isHighlighted || selected;
  const actionTypes = edgeData?.actionTypes ?? [];
  const uniqueActionTypes = [...new Set(actionTypes)];
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    /* @__PURE__ */ jsx2(
      BaseEdge,
      {
        path: edgePath,
        style: { stroke: "transparent", strokeWidth: 20, cursor: "pointer" }
      }
    ),
    /* @__PURE__ */ jsx2(
      BaseEdge,
      {
        path: edgePath,
        markerEnd,
        style: {
          stroke: isActive ? "var(--brand-primary)" : "var(--border-secondary)",
          strokeWidth: isActive ? 2.5 : 1.5,
          transition: "stroke 0.15s, stroke-width 0.15s"
        }
      }
    ),
    edgeData?.name && /* @__PURE__ */ jsx2(EdgeLabelRenderer, { children: /* @__PURE__ */ jsx2(
      "div",
      {
        className: "nodrag nopan pointer-events-auto cursor-pointer",
        style: {
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
        },
        children: /* @__PURE__ */ jsxs2(
          "div",
          {
            className: `
                flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border shadow-xs
                transition-all duration-150
                ${isActive ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/20" : "bg-bg-primary/95 text-text-muted border-border-secondary hover:border-brand-primary/40 backdrop-blur-xs"}
              `,
            children: [
              uniqueActionTypes.length > 0 && /* @__PURE__ */ jsx2("span", { className: "flex items-center gap-0.5", children: uniqueActionTypes.slice(0, 3).map((actionType) => {
                const Icon = ACTION_ICONS[actionType];
                const colorClass = isActive ? "" : ACTION_COLORS[actionType] ?? "text-gray-400";
                return Icon ? /* @__PURE__ */ jsx2(Icon, { className: `size-3 ${colorClass}` }, actionType) : null;
              }) }),
              /* @__PURE__ */ jsx2("span", { className: "font-medium max-w-[120px] truncate", children: edgeData.name }),
              edgeData.firstActionTarget && !isActive && /* @__PURE__ */ jsx2("span", { className: "opacity-50 text-[8px] max-w-[60px] truncate", children: edgeData.firstActionTarget }),
              edgeData.pathCost !== 1 && /* @__PURE__ */ jsxs2("span", { className: "opacity-60 text-[9px]", children: [
                "cost:",
                edgeData.pathCost
              ] }),
              edgeData.actionCount > 1 && /* @__PURE__ */ jsx2("span", { className: `text-[8px] px-1 rounded-full ${isActive ? "bg-white/20" : "bg-bg-secondary"}`, children: edgeData.actionCount }),
              edgeData.staysVisible && /* @__PURE__ */ jsx2(Eye, { className: `size-3 ${isActive ? "text-green-200" : "text-green-400"}` })
            ]
          }
        )
      }
    ) })
  ] });
}
var StateMachineTransitionEdge = memo2(StateMachineTransitionEdgeInner);

// src/components/state-machine/ChunkedGraphView.tsx
import {
  useCallback as useCallback2,
  useEffect as useEffect2,
  useMemo as useMemo2,
  useRef as useRef2,
  useState as useState2
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Panel
} from "@xyflow/react";
import { ArrowLeft as ArrowLeft2, Layers as Layers2 } from "lucide-react";
import {
  chunkStateMachine,
  firstActionTargetString,
  getLayoutedElements,
  STATE_MACHINE_LAYOUT_OPTIONS
} from "@qontinui/workflow-utils";

// src/components/state-machine/ChunkOverviewNode.tsx
import { memo as memo3, useCallback, useEffect, useRef, useState } from "react";
import { Handle as Handle2, Position as Position2 } from "@xyflow/react";
import {
  Play as Play2,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Pencil
} from "lucide-react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function buildTooltip(chunkName, stateNames) {
  if (!stateNames || stateNames.length === 0) return chunkName;
  const visible = stateNames.slice(0, 15);
  const overflow = stateNames.length > 15 ? `
\u2026 +${stateNames.length - 15} more` : "";
  return `${chunkName}

${visible.join("\n")}${overflow}`;
}
function ChunkOverviewNodeInner({ data, selected }) {
  const {
    chunk,
    matchCount,
    stateNames,
    isExpanded,
    onToggleExpand,
    userLabel,
    onSaveLabel
  } = data;
  const stateCount = chunk.stateIds.length;
  const plural = stateCount !== 1 ? "s" : "";
  const matchPlural = matchCount !== 1 ? "es" : "";
  const showExpandToggle = chunk.kind === "chain" && typeof onToggleExpand === "function";
  const showRenameAffordance = typeof onSaveLabel === "function";
  const effectiveName = userLabel && userLabel.length > 0 ? userLabel : chunk.name;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(effectiveName);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isEditing) setDraft(effectiveName);
  }, [effectiveName, isEditing]);
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  const handleStartEdit = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!showRenameAffordance) return;
      setDraft(effectiveName);
      setIsEditing(true);
    },
    [effectiveName, showRenameAffordance]
  );
  const hasCommittedRef = useRef(false);
  const commit = useCallback(() => {
    if (!onSaveLabel) {
      setIsEditing(false);
      return;
    }
    if (hasCommittedRef.current) return;
    hasCommittedRef.current = true;
    const trimmed = draft.trim();
    onSaveLabel(chunk.id, trimmed);
    setIsEditing(false);
  }, [draft, chunk.id, onSaveLabel]);
  const cancel = useCallback(() => {
    hasCommittedRef.current = true;
    setDraft(effectiveName);
    setIsEditing(false);
  }, [effectiveName]);
  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    },
    [commit, cancel]
  );
  const handleBlur = useCallback(() => {
    commit();
  }, [commit]);
  const handleInputChange = useCallback(
    (e) => {
      setDraft(e.target.value);
    },
    []
  );
  useEffect(() => {
    if (isEditing) {
      hasCommittedRef.current = false;
    }
  }, [isEditing]);
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  const handleToggleClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onToggleExpand?.(chunk.id);
    },
    [onToggleExpand, chunk.id]
  );
  const handleToggleMouseDown = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return /* @__PURE__ */ jsxs3("div", { "data-chunk-id": chunk.id, style: { width: 200 }, children: [
    /* @__PURE__ */ jsx3(
      Handle2,
      {
        type: "target",
        position: Position2.Top,
        className: "!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      }
    ),
    /* @__PURE__ */ jsxs3(
      "div",
      {
        title: buildTooltip(effectiveName, stateNames),
        className: `
          rounded-lg border-2 px-3 py-2.5 shadow-md
          transition-all duration-150
          ${selected ? "border-indigo-400 bg-indigo-500/15 ring-2 ring-indigo-400/40 shadow-indigo-500/20 shadow-lg" : chunk.containsInitialState ? "border-indigo-400/70 bg-bg-secondary/80 hover:border-indigo-300 hover:shadow-lg" : "border-indigo-500/40 bg-bg-secondary/60 hover:border-indigo-400 hover:shadow-lg"}
        `,
        children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-1.5 mb-1 group", children: [
            chunk.containsInitialState && /* @__PURE__ */ jsx3(
              Play2,
              {
                className: "size-3 text-yellow-400 fill-current shrink-0",
                "aria-label": "Contains initial state"
              }
            ),
            chunk.kind === "scc" ? /* @__PURE__ */ jsx3(
              RefreshCw,
              {
                className: "size-3 text-indigo-300 shrink-0",
                "aria-label": "Strongly-connected component"
              }
            ) : /* @__PURE__ */ jsx3(
              ArrowRight,
              {
                className: "size-3 text-indigo-300 shrink-0",
                "aria-label": "Linear chain"
              }
            ),
            isEditing ? /* @__PURE__ */ jsx3(
              "input",
              {
                ref: inputRef,
                type: "text",
                value: draft,
                onChange: handleInputChange,
                onKeyDown: handleKeyDown,
                onBlur: handleBlur,
                onClick: stopPropagation,
                onMouseDown: stopPropagation,
                className: "flex-1 min-w-0 text-xs font-medium text-text-primary bg-bg-primary border border-indigo-400 rounded px-1 py-0.5 outline-hidden focus:ring-1 focus:ring-indigo-400 nodrag",
                placeholder: chunk.name,
                "aria-label": "Chunk label"
              }
            ) : /* @__PURE__ */ jsx3("span", { className: "text-xs font-medium text-text-primary truncate flex-1", children: effectiveName }),
            !isEditing && showRenameAffordance && /* @__PURE__ */ jsx3(
              "button",
              {
                type: "button",
                onClick: handleStartEdit,
                onMouseDown: stopPropagation,
                className: "shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-300/60 hover:text-indigo-200 transition-colors nodrag opacity-0 group-hover:opacity-100",
                title: "Rename chunk",
                "aria-label": "Rename chunk",
                children: /* @__PURE__ */ jsx3(Pencil, { className: "size-3" })
              }
            ),
            !isEditing && showExpandToggle && /* @__PURE__ */ jsx3(
              "button",
              {
                type: "button",
                onClick: handleToggleClick,
                onMouseDown: handleToggleMouseDown,
                className: "shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-colors nodrag",
                title: isExpanded ? "Collapse chain" : "Expand chain inline",
                "aria-label": isExpanded ? "Collapse chain" : "Expand chain inline",
                children: isExpanded ? /* @__PURE__ */ jsx3(ChevronDown, { className: "size-3" }) : /* @__PURE__ */ jsx3(ChevronRight, { className: "size-3" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "text-[10px] text-text-muted", children: [
            stateCount,
            " state",
            plural,
            matchCount !== void 0 && matchCount > 0 && /* @__PURE__ */ jsxs3("span", { className: "text-brand-primary ml-1", children: [
              "\xB7 ",
              matchCount,
              " match",
              matchPlural
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx3(
      Handle2,
      {
        type: "source",
        position: Position2.Bottom,
        className: "!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      }
    )
  ] });
}
var ChunkOverviewNode = memo3(ChunkOverviewNodeInner);

// src/components/state-machine/ChunkPortNode.tsx
import { memo as memo4 } from "react";
import { Handle as Handle3, Position as Position3 } from "@xyflow/react";
import { ArrowLeft, ArrowRight as ArrowRight2 } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function ChunkPortNodeInner({ data }) {
  const { direction, adjacentChunkId, adjacentChunkName, onNavigate } = data;
  const isInput = direction === "input";
  const label = isInput ? `\u2190 ${adjacentChunkName}` : `${adjacentChunkName} \u2192`;
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      style: { width: 160 },
      onClick: (e) => {
        if (!onNavigate) return;
        e.stopPropagation();
        onNavigate(adjacentChunkId);
      },
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => {
        if (!onNavigate) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onNavigate(adjacentChunkId);
        }
      },
      title: isInput ? `Incoming from ${adjacentChunkName} - click to navigate` : `Outgoing to ${adjacentChunkName} - click to navigate`,
      className: "cursor-pointer",
      children: [
        isInput && /* @__PURE__ */ jsx4(
          Handle3,
          {
            type: "source",
            position: Position3.Bottom,
            className: "!w-2 !h-2 !border !border-bg-primary !bg-indigo-400/60"
          }
        ),
        !isInput && /* @__PURE__ */ jsx4(
          Handle3,
          {
            type: "target",
            position: Position3.Top,
            className: "!w-2 !h-2 !border !border-bg-primary !bg-indigo-400/60"
          }
        ),
        /* @__PURE__ */ jsxs4(
          "div",
          {
            className: `
          rounded-md border-2 border-dashed px-2 py-1.5
          bg-bg-secondary/40 border-indigo-400/50
          text-indigo-300/80 hover:bg-indigo-500/10 hover:text-indigo-200
          hover:border-indigo-300 transition-colors
          flex items-center gap-1.5
        `,
            children: [
              isInput ? /* @__PURE__ */ jsx4(ArrowLeft, { className: "size-3 shrink-0" }) : null,
              /* @__PURE__ */ jsx4("span", { className: "text-[10px] font-medium truncate flex-1", children: label }),
              !isInput ? /* @__PURE__ */ jsx4(ArrowRight2, { className: "size-3 shrink-0" }) : null
            ]
          }
        )
      ]
    }
  );
}
var ChunkPortNode = memo4(ChunkPortNodeInner);

// src/components/state-machine/ChunkedGraphView.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var CHUNK_MAX_NODES = 150;
var FIT_VIEW_OPTIONS = { padding: 0.2, minZoom: 0.3 };
var OVERVIEW_LAYOUT_OPTIONS = {
  direction: "TB",
  nodeWidth: 200,
  nodeHeight: 80,
  nodeSep: 60,
  rankSep: 100
};
var overviewNodeTypes = {
  chunkOverview: ChunkOverviewNode,
  stateNode: StateMachineStateNode
};
var overviewEdgeTypes = { transitionEdge: StateMachineTransitionEdge };
var drilledNodeTypes = {
  stateNode: StateMachineStateNode,
  chunkPort: ChunkPortNode
};
var drilledEdgeTypes = { transitionEdge: StateMachineTransitionEdge };
function OverviewCanvasInner({
  chunkGraph,
  dagreLib,
  onDrillIn,
  stateNamesByChunkId,
  perChunkMatches,
  expandedChainIds,
  onToggleChainExpand,
  chunkLabels,
  onSaveChunkLabel,
  states,
  transitionCounts,
  effectiveInitialStateId,
  selectedStateId,
  onSelectState,
  onSelectTransition,
  elementThumbnails
}) {
  const reactFlowInstance = useReactFlow();
  const stateById = useMemo2(() => {
    const m = /* @__PURE__ */ new Map();
    for (const s of states) m.set(s.state_id, s);
    return m;
  }, [states]);
  const baseNodes = useMemo2(() => {
    const list = [];
    for (const chunk of chunkGraph.chunks) {
      if (perChunkMatches !== null && !perChunkMatches.has(chunk.id)) {
        continue;
      }
      const isExpandedChain = chunk.kind === "chain" && expandedChainIds.has(chunk.id);
      if (isExpandedChain) {
        for (const stateId of chunk.stateIds) {
          const state = stateById.get(stateId);
          if (!state) continue;
          list.push({
            id: stateId,
            type: "stateNode",
            position: { x: 0, y: 0 },
            data: {
              stateId: state.state_id,
              name: state.name,
              elementCount: state.element_ids.length,
              confidence: state.confidence,
              elementIds: state.element_ids,
              description: state.description ?? null,
              isBlocking: state.extra_metadata?.blocking === true,
              isSelected: state.state_id === selectedStateId,
              isInitial: state.state_id === effectiveInitialStateId,
              outgoingCount: transitionCounts.outgoing.get(state.state_id) ?? 0,
              incomingCount: transitionCounts.incoming.get(state.state_id) ?? 0,
              isDropTarget: false,
              onStartElementDrag: void 0,
              elementThumbnails
            }
          });
        }
      } else {
        list.push({
          id: chunk.id,
          type: "chunkOverview",
          position: { x: 0, y: 0 },
          data: {
            chunk,
            matchCount: perChunkMatches?.get(chunk.id),
            stateNames: stateNamesByChunkId.get(chunk.id),
            isExpanded: false,
            onToggleExpand: chunk.kind === "chain" ? onToggleChainExpand : void 0,
            userLabel: chunkLabels?.get(chunk.id),
            onSaveLabel: onSaveChunkLabel
          }
        });
      }
    }
    return list;
  }, [
    chunkGraph.chunks,
    perChunkMatches,
    expandedChainIds,
    stateById,
    selectedStateId,
    effectiveInitialStateId,
    transitionCounts,
    elementThumbnails,
    stateNamesByChunkId,
    onToggleChainExpand,
    chunkLabels,
    onSaveChunkLabel
  ]);
  const expandedEndpointFor = useCallback2(
    (chunkId, role) => {
      if (!expandedChainIds.has(chunkId)) return null;
      const chunk = chunkGraph.chunks.find((c) => c.id === chunkId);
      if (!chunk || chunk.stateIds.length === 0) return null;
      if (role === "source") {
        const tail = chunk.stateIds[chunk.stateIds.length - 1];
        return { id: tail, kind: "chain-tail" };
      }
      const head = chunk.stateIds[0];
      return { id: head, kind: "chain-head" };
    },
    [expandedChainIds, chunkGraph.chunks]
  );
  const baseEdges = useMemo2(() => {
    const list = [];
    for (const e of chunkGraph.edges) {
      if (perChunkMatches !== null) {
        if (!perChunkMatches.has(e.from) || !perChunkMatches.has(e.to)) {
          continue;
        }
      }
      const sourceRemap = expandedEndpointFor(e.from, "source");
      const targetRemap = expandedEndpointFor(e.to, "target");
      const source = sourceRemap?.id ?? e.from;
      const target = targetRemap?.id ?? e.to;
      const thickness = Math.log(Math.max(e.transitionCount, 1)) + 1;
      list.push({
        id: `chunk-edge-${e.from}-${e.to}`,
        source,
        target,
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
        label: String(e.transitionCount),
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
        labelBgStyle: {
          fill: "var(--bg-secondary, #1a1a1a)",
          stroke: "var(--border-secondary, #333)",
          strokeWidth: 1
        },
        labelStyle: {
          fontSize: 10,
          fill: "var(--text-muted, #999)",
          fontWeight: 500
        },
        style: {
          strokeWidth: thickness,
          stroke: "var(--border-secondary, #555)"
        }
      });
    }
    for (const chunkId of expandedChainIds) {
      const chunk = chunkGraph.chunks.find((c) => c.id === chunkId);
      if (!chunk || chunk.kind !== "chain") continue;
      if (perChunkMatches !== null && !perChunkMatches.has(chunkId)) continue;
      for (let i = 0; i < chunk.stateIds.length - 1; i++) {
        const from = chunk.stateIds[i];
        const to = chunk.stateIds[i + 1];
        list.push({
          id: `chain-inline-${chunkId}-${from}-${to}`,
          source: from,
          target: to,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: "var(--indigo-400, #818cf8)",
            strokeWidth: 1.5,
            opacity: 0.7
          }
        });
      }
    }
    return list;
  }, [
    chunkGraph.edges,
    chunkGraph.chunks,
    perChunkMatches,
    expandedEndpointFor,
    expandedChainIds
  ]);
  const layouted = useMemo2(() => {
    if (baseNodes.length === 0) return { nodes: [], edges: [] };
    return getLayoutedElements(
      dagreLib,
      baseNodes,
      baseEdges,
      OVERVIEW_LAYOUT_OPTIONS
    );
  }, [dagreLib, baseNodes, baseEdges]);
  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);
  useEffect2(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  const clearOverviewSelection = useCallback2(() => {
    setNodes(
      (prev) => prev.some((n) => n.selected) ? prev.map((n) => n.selected ? { ...n, selected: false } : n) : prev
    );
  }, [setNodes]);
  const onSelectionChange = useCallback2(
    ({ nodes: selectedNodes }) => {
      const first = selectedNodes[0];
      if (!first) return;
      if (first.type === "chunkOverview") {
        const d = first.data;
        if (!d?.chunk) return;
        onDrillIn(d.chunk.id);
        clearOverviewSelection();
        return;
      }
      if (first.type === "stateNode") {
        const d = first.data;
        onSelectState(d.stateId);
        onSelectTransition(null);
      }
    },
    [onDrillIn, clearOverviewSelection, onSelectState, onSelectTransition]
  );
  const fitView = useCallback2(() => {
    reactFlowInstance.fitView({ ...FIT_VIEW_OPTIONS, duration: 300 });
  }, [reactFlowInstance]);
  useEffect2(() => {
    const id = setTimeout(fitView, 50);
    return () => clearTimeout(id);
  }, []);
  return /* @__PURE__ */ jsxs5(
    ReactFlow,
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onSelectionChange,
      nodeTypes: overviewNodeTypes,
      edgeTypes: overviewEdgeTypes,
      fitView: true,
      fitViewOptions: FIT_VIEW_OPTIONS,
      minZoom: 0.1,
      maxZoom: 3,
      deleteKeyCode: null,
      selectNodesOnDrag: false,
      children: [
        /* @__PURE__ */ jsx5(Background, { gap: 20, size: 1, variant: BackgroundVariant.Dots }),
        /* @__PURE__ */ jsx5(Controls, { showInteractive: false }),
        /* @__PURE__ */ jsx5(
          MiniMap,
          {
            nodeColor: (n) => {
              const d = n.data;
              if (d?.chunk?.containsInitialState) return "#FFD700";
              return "#818cf8";
            },
            maskColor: "rgba(0,0,0,0.15)",
            pannable: true,
            zoomable: true
          }
        ),
        /* @__PURE__ */ jsx5(Panel, { position: "bottom-left", children: /* @__PURE__ */ jsxs5("div", { className: "text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx5(Layers2, { className: "size-3" }),
          /* @__PURE__ */ jsxs5("span", { children: [
            chunkGraph.chunks.length,
            " chunks"
          ] }),
          /* @__PURE__ */ jsx5("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ jsxs5("span", { children: [
            chunkGraph.edges.length,
            " cross-chunk edges"
          ] }),
          /* @__PURE__ */ jsx5("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ jsx5("span", { className: "text-indigo-300/80", children: "Click a chunk to drill in" })
        ] }) })
      ]
    }
  );
}
function OverviewCanvas(props) {
  return /* @__PURE__ */ jsx5(ReactFlowProvider, { children: /* @__PURE__ */ jsx5(OverviewCanvasInner, { ...props }) });
}
function DrilledCanvasInner({
  chunk,
  chunkGraph,
  states,
  transitions,
  dagreLib,
  selectedStateId,
  selectedTransitionId,
  effectiveInitialStateId,
  elementThumbnails,
  chunkLabels,
  highlightedTransitionIds,
  transitionCounts,
  onSelectState,
  onSelectTransition,
  resolveTransitionSelectionId,
  onNavigateToChunk,
  isDragging,
  dropTargetStateId,
  onStartElementDrag
}) {
  const reactFlowInstance = useReactFlow();
  const chunkStateIds = useMemo2(
    () => new Set(chunk.stateIds),
    [chunk.stateIds]
  );
  const chunkStates = useMemo2(
    () => states.filter((s) => chunkStateIds.has(s.state_id)),
    [states, chunkStateIds]
  );
  const { internalTransitions, inboundByAdjChunk, outboundByAdjChunk } = useMemo2(() => {
    const internal = [];
    const inbound = /* @__PURE__ */ new Map();
    const outbound = /* @__PURE__ */ new Map();
    for (const t of transitions) {
      const fromsInChunk = t.from_states.filter((s) => chunkStateIds.has(s));
      const tosInChunk = t.activate_states.filter(
        (s) => chunkStateIds.has(s)
      );
      const fromsOutChunk = t.from_states.filter(
        (s) => !chunkStateIds.has(s) && chunkGraph.stateIndex.has(s)
      );
      const tosOutChunk = t.activate_states.filter(
        (s) => !chunkStateIds.has(s) && chunkGraph.stateIndex.has(s)
      );
      if (fromsOutChunk.length === 0 && tosOutChunk.length === 0) {
        if (fromsInChunk.length > 0 && tosInChunk.length > 0) {
          internal.push(t);
        }
        continue;
      }
      if (fromsOutChunk.length > 0 && tosInChunk.length > 0) {
        for (const extFrom of fromsOutChunk) {
          const extChunkId = chunkGraph.stateIndex.get(extFrom);
          if (!extChunkId || extChunkId === chunk.id) continue;
          const entry = inbound.get(extChunkId) ?? {
            states: /* @__PURE__ */ new Set(),
            transitionIds: /* @__PURE__ */ new Set()
          };
          for (const dst of tosInChunk) entry.states.add(dst);
          entry.transitionIds.add(t.transition_id);
          inbound.set(extChunkId, entry);
        }
      }
      if (fromsInChunk.length > 0 && tosOutChunk.length > 0) {
        for (const extTo of tosOutChunk) {
          const extChunkId = chunkGraph.stateIndex.get(extTo);
          if (!extChunkId || extChunkId === chunk.id) continue;
          const entry = outbound.get(extChunkId) ?? {
            states: /* @__PURE__ */ new Set(),
            transitionIds: /* @__PURE__ */ new Set()
          };
          for (const src of fromsInChunk) entry.states.add(src);
          entry.transitionIds.add(t.transition_id);
          outbound.set(extChunkId, entry);
        }
      }
    }
    return {
      internalTransitions: internal,
      inboundByAdjChunk: inbound,
      outboundByAdjChunk: outbound
    };
  }, [transitions, chunkStateIds, chunkGraph, chunk.id]);
  const chunkNameById = useMemo2(() => {
    const m = /* @__PURE__ */ new Map();
    for (const c of chunkGraph.chunks) {
      const override = chunkLabels?.get(c.id);
      m.set(c.id, override && override.length > 0 ? override : c.name);
    }
    return m;
  }, [chunkGraph.chunks, chunkLabels]);
  const stateNodes = useMemo2(
    () => chunkStates.map((state) => ({
      id: state.state_id,
      type: "stateNode",
      position: { x: 0, y: 0 },
      data: {
        stateId: state.state_id,
        name: state.name,
        elementCount: state.element_ids.length,
        confidence: state.confidence,
        elementIds: state.element_ids,
        description: state.description ?? null,
        isBlocking: state.extra_metadata?.blocking === true,
        isSelected: state.state_id === selectedStateId,
        isInitial: state.state_id === effectiveInitialStateId,
        outgoingCount: transitionCounts.outgoing.get(state.state_id) ?? 0,
        incomingCount: transitionCounts.incoming.get(state.state_id) ?? 0,
        isDropTarget: isDragging && dropTargetStateId === state.state_id,
        onStartElementDrag,
        elementThumbnails
      }
    })),
    [
      chunkStates,
      selectedStateId,
      effectiveInitialStateId,
      transitionCounts,
      isDragging,
      dropTargetStateId,
      onStartElementDrag,
      elementThumbnails
    ]
  );
  const getSelectionId = useCallback2(
    (t) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(t);
      return t.transition_id;
    },
    [resolveTransitionSelectionId]
  );
  const selectedTransitionSemanticId = useMemo2(() => {
    if (!selectedTransitionId) return null;
    const t = transitions.find(
      (tr) => getSelectionId(tr) === selectedTransitionId
    );
    return t?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);
  const stateEdges = useMemo2(() => {
    const list = [];
    for (const t of internalTransitions) {
      const isSelected = t.transition_id === selectedTransitionSemanticId;
      for (const from of t.from_states) {
        if (!chunkStateIds.has(from)) continue;
        for (const to of t.activate_states) {
          if (!chunkStateIds.has(to)) continue;
          list.push({
            id: `${t.transition_id}-${from}-${to}`,
            source: from,
            target: to,
            type: "transitionEdge",
            selected: isSelected,
            markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: t.transition_id,
              name: t.name,
              pathCost: t.path_cost,
              actionCount: t.actions.length,
              actionTypes: t.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(t.transition_id),
              staysVisible: t.stays_visible,
              firstActionTarget: firstActionTargetString(t.actions[0])
            }
          });
        }
      }
    }
    return list;
  }, [
    internalTransitions,
    chunkStateIds,
    selectedTransitionSemanticId,
    highlightedTransitionIds
  ]);
  const portNodes = useMemo2(() => {
    const list = [];
    for (const [adjChunkId] of inboundByAdjChunk) {
      list.push({
        id: `port-in-${adjChunkId}`,
        type: "chunkPort",
        position: { x: 0, y: 0 },
        data: {
          direction: "input",
          adjacentChunkId: adjChunkId,
          adjacentChunkName: chunkNameById.get(adjChunkId) ?? adjChunkId,
          onNavigate: onNavigateToChunk
        }
      });
    }
    for (const [adjChunkId] of outboundByAdjChunk) {
      list.push({
        id: `port-out-${adjChunkId}`,
        type: "chunkPort",
        position: { x: 0, y: 0 },
        data: {
          direction: "output",
          adjacentChunkId: adjChunkId,
          adjacentChunkName: chunkNameById.get(adjChunkId) ?? adjChunkId,
          onNavigate: onNavigateToChunk
        }
      });
    }
    return list;
  }, [inboundByAdjChunk, outboundByAdjChunk, chunkNameById, onNavigateToChunk]);
  const portEdges = useMemo2(() => {
    const list = [];
    for (const [adjChunkId, info] of inboundByAdjChunk) {
      const portId = `port-in-${adjChunkId}`;
      for (const stateId of info.states) {
        list.push({
          id: `port-in-edge-${adjChunkId}-${stateId}`,
          source: portId,
          target: stateId,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: "var(--indigo-400, #818cf8)",
            strokeDasharray: "4 3",
            strokeWidth: 1.5,
            opacity: 0.6
          }
        });
      }
    }
    for (const [adjChunkId, info] of outboundByAdjChunk) {
      const portId = `port-out-${adjChunkId}`;
      for (const stateId of info.states) {
        list.push({
          id: `port-out-edge-${stateId}-${adjChunkId}`,
          source: stateId,
          target: portId,
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: "var(--indigo-400, #818cf8)",
            strokeDasharray: "4 3",
            strokeWidth: 1.5,
            opacity: 0.6
          }
        });
      }
    }
    return list;
  }, [inboundByAdjChunk, outboundByAdjChunk]);
  const layouted = useMemo2(() => {
    const allNodes = [...portNodes, ...stateNodes];
    const allEdges = [...stateEdges, ...portEdges];
    if (allNodes.length === 0) return { nodes: [], edges: [] };
    const result = getLayoutedElements(
      dagreLib,
      allNodes,
      allEdges,
      STATE_MACHINE_LAYOUT_OPTIONS
    );
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of result.nodes) {
      if (n.type === "stateNode") {
        if (n.position.y < minY) minY = n.position.y;
        if (n.position.y > maxY) maxY = n.position.y;
      }
    }
    if (!isFinite(minY) || !isFinite(maxY)) {
      return result;
    }
    const PORT_MARGIN = 100;
    const portTopY = minY - PORT_MARGIN;
    const portBottomY = maxY + PORT_MARGIN + STATE_MACHINE_LAYOUT_OPTIONS.nodeHeight;
    return {
      ...result,
      nodes: result.nodes.map((n) => {
        if (n.type !== "chunkPort") return n;
        const d = n.data;
        return {
          ...n,
          position: {
            x: n.position.x,
            y: d.direction === "input" ? portTopY : portBottomY
          }
        };
      })
    };
  }, [dagreLib, stateNodes, stateEdges, portNodes, portEdges]);
  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);
  useEffect2(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  const onSelectionChange = useCallback2(
    ({ nodes: selectedNodes, edges: selectedEdges }) => {
      const firstNode = selectedNodes[0];
      const firstEdge = selectedEdges[0];
      if (firstNode) {
        if (firstNode.type === "chunkPort") {
          onSelectState(null);
          onSelectTransition(null);
          return;
        }
        const nd = firstNode.data;
        onSelectState(nd.stateId);
        onSelectTransition(null);
      } else if (firstEdge) {
        const ed = firstEdge.data;
        if (!ed?.transitionId) {
          onSelectState(null);
          onSelectTransition(null);
          return;
        }
        const trans = transitions.find(
          (t) => t.transition_id === ed.transitionId
        );
        onSelectTransition(trans ? getSelectionId(trans) : null);
        onSelectState(null);
      } else {
        onSelectState(null);
        onSelectTransition(null);
      }
    },
    [onSelectState, onSelectTransition, transitions, getSelectionId]
  );
  const didFitRef = useRef2(false);
  useEffect2(() => {
    if (didFitRef.current) return;
    if (nodes.length === 0) return;
    didFitRef.current = true;
    const id = setTimeout(() => {
      reactFlowInstance.fitView({ ...FIT_VIEW_OPTIONS, duration: 300 });
    }, 50);
    return () => clearTimeout(id);
  }, [nodes.length, reactFlowInstance]);
  return /* @__PURE__ */ jsxs5(
    ReactFlow,
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onSelectionChange,
      nodeTypes: drilledNodeTypes,
      edgeTypes: drilledEdgeTypes,
      fitView: true,
      fitViewOptions: FIT_VIEW_OPTIONS,
      minZoom: 0.05,
      maxZoom: 3,
      onlyRenderVisibleElements: true,
      deleteKeyCode: null,
      selectNodesOnDrag: false,
      children: [
        /* @__PURE__ */ jsx5(Background, { gap: 20, size: 1, variant: BackgroundVariant.Dots }),
        /* @__PURE__ */ jsx5(Controls, { showInteractive: false }),
        /* @__PURE__ */ jsx5(
          MiniMap,
          {
            nodeColor: (n) => {
              if (n.type === "chunkPort") return "#6366f1";
              const d = n.data;
              if (d?.isInitial) return "#FFD700";
              return d?.isBlocking ? "#f59e0b" : "var(--brand-primary)";
            },
            maskColor: "rgba(0,0,0,0.15)",
            pannable: true,
            zoomable: true
          }
        )
      ]
    }
  );
}
function DrilledCanvas(props) {
  return /* @__PURE__ */ jsx5(ReactFlowProvider, { children: /* @__PURE__ */ jsx5(DrilledCanvasInner, { ...props }) });
}
function GiantChunkPanel({
  chunk,
  states,
  selectedStateId,
  onSelectState
}) {
  const chunkStates = useMemo2(() => {
    const order = new Map(chunk.stateIds.map((id, i) => [id, i]));
    return states.filter((s) => order.has(s.state_id)).sort(
      (a, b) => (order.get(a.state_id) ?? 0) - (order.get(b.state_id) ?? 0)
    );
  }, [chunk.stateIds, states]);
  return /* @__PURE__ */ jsxs5("div", { className: "h-full w-full flex flex-col p-4 gap-3", children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex items-start gap-3 bg-amber-950/20 border border-amber-600/40 rounded px-3 py-2.5", children: [
      /* @__PURE__ */ jsx5(Layers2, { className: "size-4 text-amber-400 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs5("div", { className: "text-xs text-amber-200/90", children: [
        /* @__PURE__ */ jsxs5("p", { className: "font-medium", children: [
          "Chunk too large to render (",
          chunkStates.length,
          " states)."
        ] }),
        /* @__PURE__ */ jsx5("p", { className: "text-amber-200/70 mt-1", children: "This strongly-connected component has too many interconnected cycles to lay out cleanly. Browse states from the list below or switch to the State View tab." })
      ] })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "flex-1 min-h-0 overflow-y-auto max-h-[80vh] border border-border-secondary rounded bg-bg-secondary/40", children: /* @__PURE__ */ jsx5("ul", { className: "divide-y divide-border-secondary/60", children: chunkStates.map((s) => {
      const isSel = s.state_id === selectedStateId;
      return /* @__PURE__ */ jsx5("li", { children: /* @__PURE__ */ jsxs5(
        "button",
        {
          type: "button",
          onClick: () => onSelectState(isSel ? null : s.state_id),
          className: `
                    w-full text-left px-3 py-2 text-xs flex items-center gap-2
                    transition-colors
                    ${isSel ? "bg-brand-primary/20 text-text-primary" : "hover:bg-bg-tertiary text-text-secondary"}
                  `,
          children: [
            /* @__PURE__ */ jsx5(Layers2, { className: "size-3 shrink-0 text-brand-primary/70" }),
            /* @__PURE__ */ jsx5("span", { className: "truncate flex-1 font-medium", children: s.name }),
            /* @__PURE__ */ jsxs5("span", { className: "text-[10px] text-text-muted shrink-0", children: [
              s.element_ids.length,
              " el"
            ] })
          ]
        }
      ) }, s.state_id);
    }) }) })
  ] });
}
function ChunkedGraphViewInner(props) {
  const {
    dagre: dagreLib,
    states,
    transitions,
    selectedStateId,
    selectedTransitionId,
    onSelectState,
    onSelectTransition,
    initialStateId,
    emptyMessage = "No states in this config.",
    highlightedPath,
    elementThumbnails,
    onStartElementDrag,
    onDragOver,
    onDrop,
    isDragging,
    dropTargetStateId,
    resolveTransitionSelectionId,
    searchQuery,
    chunkLabels,
    onSaveChunkLabel
  } = props;
  const effectiveInitialStateId = useMemo2(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => s.extra_metadata?.initial === true
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);
  const chunkGraph = useMemo2(
    () => chunkStateMachine(states, transitions, {
      initialStateId: effectiveInitialStateId
    }),
    [states, transitions, effectiveInitialStateId]
  );
  const chunkById = useMemo2(() => {
    const m = /* @__PURE__ */ new Map();
    for (const c of chunkGraph.chunks) m.set(c.id, c);
    return m;
  }, [chunkGraph.chunks]);
  const transitionCounts = useMemo2(() => {
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const t of transitions) {
      for (const from of t.from_states)
        outgoing.set(from, (outgoing.get(from) ?? 0) + 1);
      for (const to of t.activate_states)
        incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
    return { outgoing, incoming };
  }, [transitions]);
  const highlightedTransitionIds = useMemo2(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath]
  );
  const [viewMode, setViewMode] = useState2({ kind: "overview" });
  const [expandedChainIds, setExpandedChainIds] = useState2(
    () => /* @__PURE__ */ new Set()
  );
  const toggleChainExpand = useCallback2((chunkId) => {
    setExpandedChainIds((prev) => {
      const next = new Set(prev);
      if (next.has(chunkId)) next.delete(chunkId);
      else next.add(chunkId);
      return next;
    });
  }, []);
  const stateNamesByChunkId = useMemo2(() => {
    const nameById = /* @__PURE__ */ new Map();
    for (const s of states) nameById.set(s.state_id, s.name);
    const m = /* @__PURE__ */ new Map();
    for (const c of chunkGraph.chunks) {
      m.set(
        c.id,
        c.stateIds.map((id) => nameById.get(id) ?? id)
      );
    }
    return m;
  }, [chunkGraph.chunks, states]);
  const perChunkMatches = useMemo2(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return null;
    const m = /* @__PURE__ */ new Map();
    for (const s of states) {
      const name = s.name.toLowerCase();
      const desc = (s.description ?? "").toLowerCase();
      if (name.includes(q) || desc.includes(q)) {
        const cid = chunkGraph.stateIndex.get(s.state_id);
        if (cid) m.set(cid, (m.get(cid) ?? 0) + 1);
      }
    }
    return m;
  }, [searchQuery, states, chunkGraph.stateIndex]);
  const currentChunkId = viewMode.kind === "drilled" ? viewMode.chunkId : null;
  useEffect2(() => {
    if (!selectedStateId) return;
    const targetChunkId = chunkGraph.stateIndex.get(selectedStateId);
    if (!targetChunkId) return;
    if (targetChunkId === currentChunkId) return;
    setViewMode({ kind: "drilled", chunkId: targetChunkId });
  }, [selectedStateId, chunkGraph.stateIndex, currentChunkId]);
  useEffect2(() => {
    if (viewMode.kind !== "drilled") return;
    const handler = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Escape") {
        setViewMode({ kind: "overview" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewMode.kind]);
  const goOverview = useCallback2(() => {
    setViewMode({ kind: "overview" });
  }, []);
  const drillInto = useCallback2((chunkId) => {
    setViewMode({ kind: "drilled", chunkId });
  }, []);
  if (states.length === 0) {
    return /* @__PURE__ */ jsx5("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ jsx5("p", { children: emptyMessage }) });
  }
  if (viewMode.kind === "drilled") {
    const chunk = chunkById.get(viewMode.chunkId);
    if (!chunk) {
      return /* @__PURE__ */ jsx5(ChunkedGraphViewFallbackMissingChunk, { onBack: goOverview });
    }
    const isGiant = chunk.stateIds.length > CHUNK_MAX_NODES;
    const drilledName = chunkLabels?.get(chunk.id) || chunk.name;
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        className: "h-full w-full flex flex-col",
        onDragOver,
        onDrop,
        children: [
          /* @__PURE__ */ jsx5(DrilledBreadcrumb, { chunkName: drilledName, onBack: goOverview }),
          /* @__PURE__ */ jsx5("div", { className: "flex-1 min-h-0", children: isGiant ? /* @__PURE__ */ jsx5(
            GiantChunkPanel,
            {
              chunk,
              states,
              selectedStateId,
              onSelectState
            }
          ) : /* @__PURE__ */ jsx5(
            DrilledCanvas,
            {
              chunk,
              chunkGraph,
              states,
              transitions,
              dagreLib,
              selectedStateId,
              selectedTransitionId,
              effectiveInitialStateId,
              elementThumbnails,
              chunkLabels,
              highlightedTransitionIds,
              transitionCounts,
              onSelectState,
              onSelectTransition,
              resolveTransitionSelectionId,
              onNavigateToChunk: drillInto,
              isDragging,
              dropTargetStateId,
              onStartElementDrag
            }
          ) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx5("div", { className: "h-full w-full", onDragOver, onDrop, children: /* @__PURE__ */ jsx5(
    OverviewCanvas,
    {
      chunkGraph,
      dagreLib,
      onDrillIn: drillInto,
      stateNamesByChunkId,
      perChunkMatches,
      expandedChainIds,
      onToggleChainExpand: toggleChainExpand,
      chunkLabels,
      onSaveChunkLabel,
      states,
      transitionCounts,
      effectiveInitialStateId,
      selectedStateId,
      onSelectState,
      onSelectTransition,
      elementThumbnails
    }
  ) });
}
function DrilledBreadcrumb({
  chunkName,
  onBack
}) {
  return /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 px-3 py-2 border-b border-border-secondary bg-bg-secondary/40 shrink-0", children: [
    /* @__PURE__ */ jsxs5(
      "button",
      {
        type: "button",
        onClick: onBack,
        className: "flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded transition-colors",
        title: "Back to overview (Esc)",
        children: [
          /* @__PURE__ */ jsx5(ArrowLeft2, { className: "size-3.5" }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ jsxs5("div", { className: "text-xs text-text-muted flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx5(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "hover:text-text-primary transition-colors",
          children: "All states"
        }
      ),
      /* @__PURE__ */ jsx5("span", { className: "text-text-muted/60", children: ">" }),
      /* @__PURE__ */ jsx5("span", { className: "text-text-primary font-medium truncate max-w-[240px]", children: chunkName })
    ] })
  ] });
}
function ChunkedGraphViewFallbackMissingChunk({
  onBack
}) {
  return /* @__PURE__ */ jsxs5("div", { className: "h-full w-full flex flex-col items-center justify-center gap-3 text-center text-text-muted", children: [
    /* @__PURE__ */ jsx5("p", { className: "text-sm", children: "That chunk no longer exists." }),
    /* @__PURE__ */ jsx5(
      "button",
      {
        type: "button",
        onClick: onBack,
        className: "px-3 py-1.5 text-xs bg-bg-secondary border border-border-secondary rounded hover:bg-bg-tertiary",
        children: "Back to overview"
      }
    )
  ] });
}
function ChunkedGraphView(props) {
  return /* @__PURE__ */ jsx5(ChunkedGraphViewInner, { ...props });
}

// src/components/state-machine/StateMachineGraphView.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var nodeTypes = { stateNode: StateMachineStateNode };
var edgeTypes = { transitionEdge: StateMachineTransitionEdge };
var FIT_VIEW_OPTIONS2 = { padding: 0.2, minZoom: 0.3 };
var FIT_VIEW_OPTIONS_ANIMATED = { ...FIT_VIEW_OPTIONS2, duration: 300 };
var CHUNKED_VIEW_THRESHOLD = 80;
var GRAPH_MAX_NODES = 500;
function StateMachineGraphViewInner({
  dagre: dagreLib,
  states,
  transitions,
  selectedStateId,
  selectedTransitionId,
  onSelectState,
  onSelectTransition,
  onDeleteTransition,
  highlightedPath,
  initialStateId,
  emptyMessage = "No states in this config.",
  onStartElementDrag,
  onDragOver,
  onDrop,
  isDragging,
  dropTargetStateId,
  resolveTransitionSelectionId,
  extraShortcutEntries,
  elementThumbnails
}) {
  const [showShortcuts, setShowShortcuts] = useState3(false);
  const reactFlowInstance = useReactFlow2();
  const prevStateCountRef = useRef3(states.length);
  const highlightedTransitionIds = useMemo3(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath]
  );
  const effectiveInitialStateId = useMemo3(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => s.extra_metadata?.initial === true
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);
  const transitionCounts = useMemo3(() => {
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const t of transitions) {
      for (const from of t.from_states) outgoing.set(from, (outgoing.get(from) ?? 0) + 1);
      for (const to of t.activate_states) incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
    return { outgoing, incoming };
  }, [transitions]);
  const initialNodes = useMemo3(
    () => states.map((state) => ({
      id: state.state_id,
      type: "stateNode",
      position: { x: 0, y: 0 },
      data: {
        stateId: state.state_id,
        name: state.name,
        elementCount: state.element_ids.length,
        confidence: state.confidence,
        elementIds: state.element_ids,
        description: state.description ?? null,
        isBlocking: state.extra_metadata?.blocking === true,
        isSelected: state.state_id === selectedStateId,
        isInitial: state.state_id === effectiveInitialStateId,
        outgoingCount: transitionCounts.outgoing.get(state.state_id) ?? 0,
        incomingCount: transitionCounts.incoming.get(state.state_id) ?? 0,
        isDropTarget: isDragging && dropTargetStateId === state.state_id,
        onStartElementDrag,
        elementThumbnails
      }
    })),
    [states, selectedStateId, effectiveInitialStateId, transitionCounts, isDragging, dropTargetStateId, onStartElementDrag, elementThumbnails]
  );
  const getSelectionId = useCallback3(
    (trans) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(trans);
      return trans.transition_id;
    },
    [resolveTransitionSelectionId]
  );
  const selectedTransitionSemanticId = useMemo3(() => {
    if (!selectedTransitionId) return null;
    const trans = transitions.find((t) => getSelectionId(t) === selectedTransitionId);
    return trans?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);
  const initialEdges = useMemo3(() => {
    const edges2 = [];
    for (const trans of transitions) {
      const isSelected = trans.transition_id === selectedTransitionSemanticId;
      for (const fromState of trans.from_states) {
        for (const toState of trans.activate_states) {
          edges2.push({
            id: `${trans.transition_id}-${fromState}-${toState}`,
            source: fromState,
            target: toState,
            type: "transitionEdge",
            selected: isSelected,
            markerEnd: { type: MarkerType2.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: trans.transition_id,
              name: trans.name,
              pathCost: trans.path_cost,
              actionCount: trans.actions.length,
              actionTypes: trans.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(trans.transition_id),
              staysVisible: trans.stays_visible,
              firstActionTarget: firstActionTargetString2(trans.actions[0])
            }
          });
        }
      }
    }
    return edges2;
  }, [transitions, highlightedTransitionIds, selectedTransitionSemanticId]);
  const layouted = useMemo3(() => {
    if (initialNodes.length === 0) return { nodes: [], edges: [] };
    return getLayoutedElements2(dagreLib, initialNodes, initialEdges, STATE_MACHINE_LAYOUT_OPTIONS2);
  }, [dagreLib, initialNodes, initialEdges]);
  const [nodes, setNodes, onNodesChange] = useNodesState2(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState2(layouted.edges);
  useEffect3(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  useEffect3(() => {
    if (states.length > prevStateCountRef.current) {
      setTimeout(() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED), 100);
    }
    prevStateCountRef.current = states.length;
  }, [states.length, reactFlowInstance]);
  const onSelectionChange = useCallback3(
    ({ nodes: selectedNodes, edges: selectedEdges }) => {
      const firstNode = selectedNodes[0];
      const firstEdge = selectedEdges[0];
      if (firstNode) {
        const nd = firstNode.data;
        onSelectState(nd.stateId);
        onSelectTransition(null);
      } else if (firstEdge) {
        const ed = firstEdge.data;
        const trans = transitions.find((t) => t.transition_id === ed?.transitionId);
        onSelectTransition(trans ? getSelectionId(trans) : null);
        onSelectState(null);
      } else {
        onSelectState(null);
        onSelectTransition(null);
      }
    },
    [onSelectState, onSelectTransition, transitions, getSelectionId]
  );
  const handleRelayout = useCallback3(() => {
    const result = getLayoutedElements2(dagreLib, nodes, edges, STATE_MACHINE_LAYOUT_OPTIONS2);
    setNodes(result.nodes);
    setEdges(result.edges);
    setTimeout(() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED), 50);
  }, [dagreLib, nodes, edges, setNodes, setEdges, reactFlowInstance]);
  useEffect3(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Escape") {
        onSelectState(null);
        onSelectTransition(null);
        setShowShortcuts(false);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) setShowShortcuts((p) => !p);
      if (e.key === "f" && !e.ctrlKey && !e.metaKey && !e.altKey)
        reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED);
      if (e.key === "l" && !e.ctrlKey && !e.metaKey && !e.altKey) handleRelayout();
      if (e.key === "=" || e.key === "+") reactFlowInstance.zoomIn({ duration: 200 });
      if (e.key === "-") reactFlowInstance.zoomOut({ duration: 200 });
      if (e.key === "i" && !e.ctrlKey && !e.metaKey && !e.altKey && effectiveInitialStateId) {
        onSelectState(effectiveInitialStateId);
        onSelectTransition(null);
        const node = reactFlowInstance.getNode(effectiveInitialStateId);
        if (node) {
          reactFlowInstance.setCenter(node.position.x + 130, node.position.y + 60, {
            duration: 300,
            zoom: reactFlowInstance.getZoom()
          });
        }
      }
      if ((e.key === "Delete" || e.key === "Backspace") && !e.ctrlKey && !e.metaKey) {
        const selectedEdge = edges.find((edge) => edge.selected);
        if (selectedEdge && onDeleteTransition) {
          const ed = selectedEdge.data;
          if (ed?.transitionId) {
            const trans = transitions.find((t) => t.transition_id === ed.transitionId);
            if (trans) {
              e.preventDefault();
              onDeleteTransition(getSelectionId(trans));
            }
          }
        }
      }
      if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && states.length > 0) {
        e.preventDefault();
        const currentIndex = states.findIndex(
          (s) => s.state_id === nodes.find((n) => n.selected)?.id
        );
        const nextIndex = e.shiftKey ? currentIndex <= 0 ? states.length - 1 : currentIndex - 1 : (currentIndex + 1) % states.length;
        const nextState = states[nextIndex];
        if (nextState) {
          onSelectState(nextState.state_id);
          onSelectTransition(null);
          const node = reactFlowInstance.getNode(nextState.state_id);
          if (node) {
            reactFlowInstance.setCenter(node.position.x + 130, node.position.y + 60, {
              duration: 300,
              zoom: reactFlowInstance.getZoom()
            });
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onSelectState,
    onSelectTransition,
    reactFlowInstance,
    handleRelayout,
    states,
    nodes,
    edges,
    transitions,
    effectiveInitialStateId,
    onDeleteTransition,
    getSelectionId
  ]);
  const graphStats = useMemo3(
    () => ({
      stateCount: states.length,
      transitionCount: transitions.length,
      initialStateName: states.find((s) => s.state_id === effectiveInitialStateId)?.name ?? "None"
    }),
    [states, transitions, effectiveInitialStateId]
  );
  if (states.length === 0) {
    return /* @__PURE__ */ jsx6("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ jsx6("p", { children: emptyMessage }) });
  }
  if (states.length > GRAPH_MAX_NODES) {
    return /* @__PURE__ */ jsxs6("div", { className: "flex flex-col items-center justify-center h-full gap-3 text-center px-8 text-text-muted", children: [
      /* @__PURE__ */ jsx6(LayoutGrid, { className: "size-10 opacity-40" }),
      /* @__PURE__ */ jsxs6("p", { className: "text-sm font-medium text-text-primary", children: [
        "Graph too large to render (",
        states.length,
        " states, ",
        transitions.length,
        " transitions)."
      ] }),
      /* @__PURE__ */ jsxs6("p", { className: "text-xs max-w-md", children: [
        "Graphs above ",
        GRAPH_MAX_NODES,
        " nodes overwhelm the browser's layout engine. Use the ",
        /* @__PURE__ */ jsx6("span", { className: "text-brand-primary", children: "State View" }),
        " tab to browse all states with search, filter, and detail panels."
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx6("div", { className: "h-full w-full", onDragOver, onDrop, children: /* @__PURE__ */ jsxs6(
    ReactFlow2,
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onSelectionChange,
      nodeTypes,
      edgeTypes,
      fitView: true,
      fitViewOptions: FIT_VIEW_OPTIONS2,
      minZoom: 0.05,
      maxZoom: 3,
      onlyRenderVisibleElements: true,
      deleteKeyCode: null,
      selectNodesOnDrag: false,
      children: [
        /* @__PURE__ */ jsx6(Background2, { gap: 20, size: 1, variant: BackgroundVariant2.Dots }),
        /* @__PURE__ */ jsx6(Controls2, { showInteractive: false }),
        /* @__PURE__ */ jsx6(
          MiniMap2,
          {
            nodeColor: (node) => {
              const d = node.data;
              if (d?.isInitial) return "#FFD700";
              return d?.isBlocking ? "#f59e0b" : "var(--brand-primary)";
            },
            maskColor: "rgba(0,0,0,0.15)",
            pannable: true,
            zoomable: true
          }
        ),
        /* @__PURE__ */ jsx6(Panel2, { position: "top-right", children: /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxs6(
            "button",
            {
              onClick: () => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED),
              className: "flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded",
              title: "Fit to view (F)",
              children: [
                /* @__PURE__ */ jsx6(Maximize, { className: "size-3.5" }),
                "Fit"
              ]
            }
          ),
          /* @__PURE__ */ jsx6(
            "button",
            {
              onClick: () => setShowShortcuts((p) => !p),
              className: "flex items-center justify-center h-7 w-7 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded",
              title: "Keyboard shortcuts (?)",
              children: /* @__PURE__ */ jsx6(Keyboard, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsxs6(
            "button",
            {
              onClick: handleRelayout,
              className: "flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary border border-border-secondary hover:border-text-muted rounded",
              title: "Re-layout (L)",
              children: [
                /* @__PURE__ */ jsx6(LayoutGrid, { className: "size-3.5" }),
                "Re-layout"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx6(Panel2, { position: "bottom-left", children: /* @__PURE__ */ jsxs6("div", { className: "text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs6("span", { children: [
            graphStats.stateCount,
            " states"
          ] }),
          /* @__PURE__ */ jsx6("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ jsxs6("span", { children: [
            graphStats.transitionCount,
            " transitions"
          ] }),
          graphStats.initialStateName !== "None" && /* @__PURE__ */ jsxs6(Fragment2, { children: [
            /* @__PURE__ */ jsx6("span", { className: "text-text-muted/30", children: "|" }),
            /* @__PURE__ */ jsxs6("span", { className: "text-yellow-500", children: [
              /* @__PURE__ */ jsx6(Play3, { className: "size-2 inline mr-0.5 fill-current" }),
              graphStats.initialStateName
            ] })
          ] })
        ] }) }),
        showShortcuts && /* @__PURE__ */ jsx6(Panel2, { position: "bottom-right", children: /* @__PURE__ */ jsxs6("div", { className: "bg-bg-primary/95 border border-border-secondary rounded-lg p-4 text-xs shadow-lg backdrop-blur-xs min-w-[200px]", children: [
          /* @__PURE__ */ jsx6("h4", { className: "font-semibold text-text-primary mb-2.5", children: "Keyboard Shortcuts" }),
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5 text-text-muted", children: [
            [
              ["Deselect all", "Esc"],
              ["Toggle shortcuts", "?"],
              ["Fit to view", "F"],
              ["Re-layout", "L"],
              ["Zoom in/out", "+ / -"]
            ].map(([label, key]) => /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsx6("span", { children: label }),
              /* @__PURE__ */ jsx6("kbd", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono", children: key })
            ] }, label)),
            /* @__PURE__ */ jsx6("div", { className: "border-t border-border-secondary pt-1.5 mt-1.5", children: [
              ["Cycle states", "Tab"],
              ["Jump to initial", "I"],
              ["Delete transition", "Del"],
              ...extraShortcutEntries ?? []
            ].map(([label, key]) => /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsx6("span", { children: label }),
              /* @__PURE__ */ jsx6("kbd", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono", children: key })
            ] }, label)) })
          ] })
        ] }) })
      ]
    }
  ) });
}
function StateMachineGraphView(props) {
  if (props.states.length > CHUNKED_VIEW_THRESHOLD) {
    return /* @__PURE__ */ jsx6(ChunkedGraphView, { ...props });
  }
  return /* @__PURE__ */ jsx6(ReactFlowProvider2, { children: /* @__PURE__ */ jsx6(StateMachineGraphViewInner, { ...props }) });
}

// src/components/state-machine/TransitionEditor.tsx
import { useState as useState4, useEffect as useEffect4, useCallback as useCallback4 } from "react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function makeActionUid() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `act-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function toEditableAction(action) {
  return { ...action, _uid: makeActionUid() };
}
function stripUid({ _uid, ...rest }) {
  return rest;
}
var ACTION_TYPES = [
  { value: "click", label: "Click" },
  { value: "doubleClick", label: "Double Click" },
  { value: "rightClick", label: "Right Click" },
  { value: "type", label: "Type" },
  { value: "clear", label: "Clear" },
  { value: "select", label: "Select" },
  { value: "focus", label: "Focus" },
  { value: "blur", label: "Blur" },
  { value: "hover", label: "Hover" },
  { value: "scroll", label: "Scroll" },
  { value: "check", label: "Check" },
  { value: "uncheck", label: "Uncheck" },
  { value: "toggle", label: "Toggle" },
  { value: "setValue", label: "Set Value" },
  { value: "drag", label: "Drag" },
  { value: "submit", label: "Submit" },
  { value: "reset", label: "Reset" },
  { value: "wait", label: "Wait" },
  { value: "navigate", label: "Navigate" }
];
function TransitionEditor({
  transition,
  states,
  onSave,
  onUpdate,
  onDelete,
  onClose
}) {
  const isEditing = !!transition;
  const [name, setName] = useState4("");
  const [fromStates, setFromStates] = useState4([]);
  const [activateStates, setActivateStates] = useState4([]);
  const [exitStates, setExitStates] = useState4([]);
  const [actions, setActions] = useState4([]);
  const [pathCost, setPathCost] = useState4(1);
  const [staysVisible, setStaysVisible] = useState4(false);
  const [isSaving, setIsSaving] = useState4(false);
  useEffect4(() => {
    if (transition) {
      setName(transition.name);
      setFromStates([...transition.from_states]);
      setActivateStates([...transition.activate_states]);
      setExitStates([...transition.exit_states]);
      setActions(transition.actions.map(toEditableAction));
      setPathCost(transition.path_cost);
      setStaysVisible(transition.stays_visible);
    } else {
      setName("");
      setFromStates([]);
      setActivateStates([]);
      setExitStates([]);
      setActions([toEditableAction({ type: "click" })]);
      setPathCost(1);
      setStaysVisible(false);
    }
  }, [transition]);
  const toggleState = useCallback4(
    (arr, setter, stateId) => {
      if (arr.includes(stateId)) {
        setter(arr.filter((s) => s !== stateId));
      } else {
        setter([...arr, stateId]);
      }
    },
    []
  );
  const addAction = useCallback4(() => {
    setActions((prev) => [...prev, toEditableAction({ type: "click" })]);
  }, []);
  const removeAction = useCallback4((index) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const updateAction = useCallback4(
    (index, updates) => {
      setActions(
        (prev) => prev.map((a, i) => i === index ? { ...a, ...updates } : a)
      );
    },
    []
  );
  const handleSave = useCallback4(async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const data = {
        name: name.trim(),
        from_states: fromStates,
        activate_states: activateStates,
        exit_states: exitStates,
        actions: actions.map(stripUid),
        path_cost: pathCost,
        stays_visible: staysVisible
      };
      if (isEditing && transition) {
        await onUpdate(transition.id, data);
      } else {
        await onSave(data);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    name,
    fromStates,
    activateStates,
    exitStates,
    actions,
    pathCost,
    staysVisible,
    isEditing,
    transition,
    onSave,
    onUpdate
  ]);
  const handleDelete = useCallback4(async () => {
    if (!transition) return;
    setIsSaving(true);
    try {
      await onDelete(transition.id);
    } finally {
      setIsSaving(false);
    }
  }, [transition, onDelete]);
  return /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx7("h3", { className: "text-sm font-semibold text-text-primary", children: isEditing ? "Edit Transition" : "New Transition" }),
      /* @__PURE__ */ jsx7(
        "button",
        {
          onClick: onClose,
          className: "text-text-secondary hover:text-text-primary text-xs",
          children: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx7("label", { className: "block text-xs text-text-secondary mb-1", children: "Name" }),
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: name,
          onChange: (e) => setName(e.target.value),
          placeholder: "Transition name",
          className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      )
    ] }),
    /* @__PURE__ */ jsx7(
      StateToggleGroup,
      {
        label: "From States",
        color: "blue",
        states,
        selected: fromStates,
        onToggle: (id) => toggleState(fromStates, setFromStates, id)
      }
    ),
    /* @__PURE__ */ jsx7(
      StateToggleGroup,
      {
        label: "Activate States",
        color: "green",
        states,
        selected: activateStates,
        onToggle: (id) => toggleState(activateStates, setActivateStates, id)
      }
    ),
    /* @__PURE__ */ jsx7(
      StateToggleGroup,
      {
        label: "Exit States",
        color: "red",
        states,
        selected: exitStates,
        onToggle: (id) => toggleState(exitStates, setExitStates, id)
      }
    ),
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx7("label", { className: "text-xs text-text-secondary", children: "Actions" }),
        /* @__PURE__ */ jsx7(
          "button",
          {
            onClick: addAction,
            className: "text-xs text-brand-primary hover:text-brand-primary/80",
            children: "+ Add Action"
          }
        )
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "flex flex-col gap-2", children: actions.map((action, index) => /* @__PURE__ */ jsx7(
        ActionField,
        {
          action,
          index,
          onUpdate: updateAction,
          onRemove: removeAction,
          canRemove: actions.length > 1
        },
        action._uid
      )) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx7("label", { className: "block text-xs text-text-secondary mb-1", children: "Path Cost" }),
        /* @__PURE__ */ jsx7(
          "input",
          {
            type: "number",
            min: 0,
            step: 0.1,
            value: pathCost,
            onChange: (e) => setPathCost(parseFloat(e.target.value) || 1),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "flex items-end pb-1", children: /* @__PURE__ */ jsxs7("label", { className: "flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ jsx7(
          "input",
          {
            type: "checkbox",
            checked: staysVisible,
            onChange: (e) => setStaysVisible(e.target.checked),
            className: "rounded"
          }
        ),
        "Stays Visible"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "flex gap-2 pt-2 border-t border-border-secondary", children: [
      /* @__PURE__ */ jsx7(
        "button",
        {
          onClick: handleSave,
          disabled: !name.trim() || isSaving,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: isSaving ? "Saving..." : isEditing ? "Update" : "Create"
        }
      ),
      isEditing && /* @__PURE__ */ jsx7(
        "button",
        {
          onClick: handleDelete,
          disabled: isSaving,
          className: "px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded",
          children: "Delete"
        }
      )
    ] })
  ] });
}
function StateToggleGroup({
  label,
  color,
  states,
  selected,
  onToggle
}) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    green: "bg-green-500/20 text-green-300 border-green-500/50",
    red: "bg-red-500/20 text-red-300 border-red-500/50"
  };
  const inactiveClass = "bg-bg-tertiary text-text-secondary border-border-secondary hover:border-text-muted";
  return /* @__PURE__ */ jsxs7("div", { children: [
    /* @__PURE__ */ jsx7("label", { className: "block text-xs text-text-secondary mb-1", children: label }),
    /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap gap-1", children: [
      states.map((s) => {
        const isActive = selected.includes(s.state_id);
        return /* @__PURE__ */ jsx7(
          "button",
          {
            onClick: () => onToggle(s.state_id),
            className: `px-2 py-0.5 text-xs border rounded transition-colors ${isActive ? colorClasses[color] : inactiveClass}`,
            children: s.name
          },
          s.state_id
        );
      }),
      states.length === 0 && /* @__PURE__ */ jsx7("span", { className: "text-xs text-text-muted italic", children: "No states" })
    ] })
  ] });
}
function ActionField({
  action,
  index,
  onUpdate,
  onRemove,
  canRemove
}) {
  return /* @__PURE__ */ jsxs7("div", { className: "p-2 bg-bg-tertiary border border-border-secondary rounded", children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 mb-1.5", children: [
      /* @__PURE__ */ jsx7(
        "select",
        {
          value: action.type,
          onChange: (e) => onUpdate(index, { type: e.target.value }),
          className: "flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
          style: { colorScheme: "dark" },
          children: ACTION_TYPES.map((t) => /* @__PURE__ */ jsx7("option", { value: t.value, children: t.label }, t.value))
        }
      ),
      canRemove && /* @__PURE__ */ jsx7(
        "button",
        {
          onClick: () => onRemove(index),
          className: "text-xs text-red-400 hover:text-red-300",
          children: "Remove"
        }
      )
    ] }),
    (action.type === "click" || action.type === "doubleClick" || action.type === "rightClick" || action.type === "hover" || action.type === "focus" || action.type === "blur" || action.type === "check" || action.type === "uncheck" || action.type === "toggle" || action.type === "submit" || action.type === "reset" || action.type === "clear") && /* @__PURE__ */ jsx7(
      "input",
      {
        type: "text",
        value: action.target ?? "",
        onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
        placeholder: "Target element ID",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    action.type === "type" && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: action.text ?? "",
          onChange: (e) => onUpdate(index, { text: e.target.value }),
          placeholder: "Text to type",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ jsxs7("label", { className: "flex items-center gap-1 text-xs text-text-secondary", children: [
        /* @__PURE__ */ jsx7(
          "input",
          {
            type: "checkbox",
            checked: action.clear_first ?? false,
            onChange: (e) => onUpdate(index, { clear_first: e.target.checked }),
            className: "rounded"
          }
        ),
        "Clear first"
      ] })
    ] }),
    action.type === "navigate" && /* @__PURE__ */ jsx7(
      "input",
      {
        type: "text",
        value: action.url ?? "",
        onChange: (e) => onUpdate(index, { url: e.target.value }),
        placeholder: "URL",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    action.type === "wait" && /* @__PURE__ */ jsx7(
      "input",
      {
        type: "number",
        min: 0,
        value: action.delay_ms ?? 1e3,
        onChange: (e) => onUpdate(index, { delay_ms: parseInt(e.target.value) || 1e3 }),
        placeholder: "Delay (ms)",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    (action.type === "select" || action.type === "setValue") && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: Array.isArray(action.value) ? action.value.join(", ") : action.value ?? "",
          onChange: (e) => onUpdate(index, { value: e.target.value }),
          placeholder: "Value",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      )
    ] }),
    action.type === "scroll" && /* @__PURE__ */ jsxs7("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs7(
        "select",
        {
          value: action.scroll_direction ?? "down",
          onChange: (e) => onUpdate(index, {
            scroll_direction: e.target.value
          }),
          className: "flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
          style: { colorScheme: "dark" },
          children: [
            /* @__PURE__ */ jsx7("option", { value: "up", children: "Up" }),
            /* @__PURE__ */ jsx7("option", { value: "down", children: "Down" }),
            /* @__PURE__ */ jsx7("option", { value: "left", children: "Left" }),
            /* @__PURE__ */ jsx7("option", { value: "right", children: "Right" })
          ]
        }
      ),
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "number",
          min: 0,
          value: action.scroll_amount ?? 300,
          onChange: (e) => onUpdate(index, {
            scroll_amount: parseInt(e.target.value) || 300
          }),
          placeholder: "Amount (px)",
          className: "w-24 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      )
    ] }),
    action.type === "drag" && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Source element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ jsx7(
        "input",
        {
          type: "text",
          value: action.drag_target ?? "",
          onChange: (e) => onUpdate(index, { drag_target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      )
    ] })
  ] });
}

// src/components/state-machine/TransitionsPanel.tsx
import { useState as useState5, useMemo as useMemo4, useCallback as useCallback5, useRef as useRef4, useEffect as useEffect5 } from "react";
import {
  GitBranch,
  MousePointer as MousePointer3,
  Type as TypeIcon3,
  ListFilter as ListFilter2,
  Clock as Clock2,
  Globe as Globe3,
  Play as Play4,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  ChevronRight as ChevronRight2,
  Eye as Eye2,
  ArrowRight as ArrowRight3,
  Search,
  Zap
} from "lucide-react";
import {
  ACTION_LABELS,
  ACTION_ACTIVE_LABELS,
  getActionColorConfig,
  computeActionDuration
} from "@qontinui/workflow-utils";
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var ACTION_ICONS2 = {
  click: MousePointer3,
  type: TypeIcon3,
  select: ListFilter2,
  wait: Clock2,
  navigate: Globe3
};
function shortBlockedLabel(reason) {
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
      return guardName ? `Blocked: guard ${guardName} error` : "Blocked: guard error";
    }
    case "executor_refused":
      return "Blocked: refused";
    default:
      return `Blocked: ${reason}`;
  }
}
function TransitionsPanel({
  states,
  transitions,
  selectedTransitionId,
  onSelectTransition,
  activeStateIds,
  permittedTriggers,
  blockedTriggers
}) {
  const [filterFromState, setFilterFromState] = useState5(null);
  const [filterToState, setFilterToState] = useState5(null);
  const [searchFilter, setSearchFilter] = useState5("");
  const [permittedOnly, setPermittedOnly] = useState5(false);
  const [animation, setAnimation] = useState5({
    isPlaying: false,
    currentActionIndex: -1,
    progress: 0,
    speed: 1
  });
  const permittedIds = useMemo4(
    () => new Set((permittedTriggers ?? []).map((p) => p.transition_id)),
    [permittedTriggers]
  );
  const blockedReasonById = useMemo4(() => {
    const map = /* @__PURE__ */ new Map();
    for (const b of blockedTriggers ?? []) {
      map.set(b.transition_id, b.reason);
    }
    return map;
  }, [blockedTriggers]);
  const hasIntrospectionData = (permittedTriggers?.length ?? 0) > 0 || (blockedTriggers?.length ?? 0) > 0 || (activeStateIds?.length ?? 0) > 0;
  const animationRef = useRef4(null);
  const startTimeRef = useRef4(0);
  const selectedTransition = useMemo4(
    () => transitions.find((t) => t.transition_id === selectedTransitionId),
    [transitions, selectedTransitionId]
  );
  const filteredTransitions = useMemo4(() => {
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
    permittedIds
  ]);
  const stateNameMap = useMemo4(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of states) {
      map.set(s.state_id, s.name);
    }
    return map;
  }, [states]);
  const stopAnimation = useCallback5(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setAnimation((prev) => ({ ...prev, isPlaying: false }));
  }, []);
  const animate = useCallback5(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0) return;
    const tick = (timestamp) => {
      setAnimation((prev) => {
        if (!prev.isPlaying) return prev;
        const elapsed = timestamp - startTimeRef.current;
        const currentAction = selectedTransition.actions[prev.currentActionIndex];
        if (!currentAction) {
          return { ...prev, isPlaying: false };
        }
        const duration = computeActionDuration(currentAction) / prev.speed;
        const progress = Math.min(elapsed / duration, 1);
        if (progress >= 1) {
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
  const playAnimation = useCallback5(() => {
    setAnimation((prev) => {
      const startIndex = prev.currentActionIndex < 0 ? 0 : prev.currentActionIndex;
      const idx = prev.progress >= 1 && startIndex >= (selectedTransition?.actions.length ?? 0) - 1 ? 0 : startIndex;
      return { ...prev, isPlaying: true, currentActionIndex: idx, progress: 0 };
    });
    setTimeout(animate, 0);
  }, [animate, selectedTransition]);
  const pauseAnimation = useCallback5(() => {
    stopAnimation();
  }, [stopAnimation]);
  const resetAnimation = useCallback5(() => {
    stopAnimation();
    setAnimation((prev) => ({
      ...prev,
      currentActionIndex: -1,
      progress: 0
    }));
  }, [stopAnimation]);
  const stepForward = useCallback5(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex + 1;
      if (!selectedTransition || next >= selectedTransition.actions.length)
        return prev;
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation, selectedTransition]);
  const stepBackward = useCallback5(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex - 1;
      if (next < 0) return { ...prev, currentActionIndex: -1, progress: 0 };
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation]);
  useEffect5(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  useEffect5(() => {
    resetAnimation();
  }, [selectedTransitionId, resetAnimation]);
  const handleSelectTransition = useCallback5(
    (tid) => {
      onSelectTransition(tid === selectedTransitionId ? null : tid);
    },
    [selectedTransitionId, onSelectTransition]
  );
  const overallProgress = useMemo4(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0)
      return 0;
    if (animation.currentActionIndex < 0) return 0;
    const completedActions = animation.currentActionIndex;
    const currentProgress = animation.progress;
    return (completedActions + currentProgress) / selectedTransition.actions.length;
  }, [selectedTransition, animation]);
  return /* @__PURE__ */ jsxs8("div", { className: "flex h-full", children: [
    /* @__PURE__ */ jsxs8("div", { className: "w-80 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: [
      /* @__PURE__ */ jsxs8("div", { className: "p-3 border-b border-border-secondary", children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx8(GitBranch, { className: "size-4 text-brand-primary" }),
          /* @__PURE__ */ jsx8("h3", { className: "text-sm font-semibold text-text-primary", children: "Transitions" }),
          /* @__PURE__ */ jsx8("span", { className: "text-xs text-text-muted ml-auto", children: filteredTransitions.length })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "relative mb-2", children: [
          /* @__PURE__ */ jsx8(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "text",
              value: searchFilter,
              onChange: (e) => setSearchFilter(e.target.value),
              placeholder: "Search transitions...",
              "aria-label": "Search transitions...",
              className: "w-full text-[10px] h-6 pl-7 px-2 bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs8(
            "select",
            {
              value: filterFromState ?? "",
              onChange: (e) => setFilterFromState(e.target.value || null),
              className: "text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
              style: { colorScheme: "dark" },
              children: [
                /* @__PURE__ */ jsx8("option", { value: "", children: "All from states" }),
                states.map((s) => /* @__PURE__ */ jsx8("option", { value: s.state_id, children: s.name }, s.state_id))
              ]
            }
          ),
          /* @__PURE__ */ jsxs8(
            "select",
            {
              value: filterToState ?? "",
              onChange: (e) => setFilterToState(e.target.value || null),
              className: "text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
              style: { colorScheme: "dark" },
              children: [
                /* @__PURE__ */ jsx8("option", { value: "", children: "All target states" }),
                states.map((s) => /* @__PURE__ */ jsx8("option", { value: s.state_id, children: s.name }, s.state_id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs8(
          "label",
          {
            className: `flex items-center gap-2 mt-2 text-[10px] select-none ${hasIntrospectionData ? "text-text-secondary cursor-pointer" : "text-text-muted/50 cursor-not-allowed"}`,
            title: hasIntrospectionData ? "Show only transitions currently permitted from the active state set" : "No active-state introspection data available",
            children: [
              /* @__PURE__ */ jsx8(
                "input",
                {
                  type: "checkbox",
                  checked: permittedOnly && hasIntrospectionData,
                  disabled: !hasIntrospectionData,
                  onChange: (e) => setPermittedOnly(e.target.checked),
                  className: "accent-brand-primary"
                }
              ),
              /* @__PURE__ */ jsx8("span", { children: "Permitted from active states" }),
              hasIntrospectionData && /* @__PURE__ */ jsxs8("span", { className: "ml-auto text-[9px] text-text-muted", children: [
                permittedIds.size,
                " permitted / ",
                blockedReasonById.size,
                " ",
                "blocked"
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "p-2 space-y-0.5", children: [
        filteredTransitions.map((t) => {
          const isSelected = t.transition_id === selectedTransitionId;
          const isPermitted = permittedIds.has(t.transition_id);
          const blockedReason = blockedReasonById.get(t.transition_id);
          return /* @__PURE__ */ jsxs8(
            "button",
            {
              onClick: () => handleSelectTransition(t.transition_id),
              title: blockedReason ? `Blocked: ${blockedReason}` : isPermitted ? "Permitted from active states" : void 0,
              className: `
                  w-full text-left px-3 py-2 rounded-md transition-colors text-sm
                  ${isSelected ? "bg-brand-primary/10 border border-brand-primary/30" : "hover:bg-bg-secondary border border-transparent"}
                `,
              children: [
                /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-1.5", children: [
                  hasIntrospectionData && isPermitted && /* @__PURE__ */ jsx8(
                    "span",
                    {
                      "aria-label": "Permitted",
                      className: "shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"
                    }
                  ),
                  /* @__PURE__ */ jsx8("span", { className: "flex items-center gap-0.5", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((type) => {
                    const Icon = ACTION_ICONS2[type];
                    const color = getActionColorConfig(type);
                    return Icon ? /* @__PURE__ */ jsx8(
                      Icon,
                      {
                        className: `size-3 ${color.text}`
                      },
                      type
                    ) : null;
                  }) }),
                  /* @__PURE__ */ jsx8("span", { className: "font-medium text-text-primary truncate flex-1", children: t.name || "Unnamed" }),
                  t.stays_visible && /* @__PURE__ */ jsx8(Eye2, { className: "size-3 text-green-500 shrink-0" }),
                  t.actions.length > 0 && /* @__PURE__ */ jsx8("span", { className: "text-[9px] text-text-muted bg-bg-secondary px-1 rounded", children: t.actions.length })
                ] }),
                /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-1 mt-0.5 ml-4 text-[10px] text-text-muted", children: [
                  /* @__PURE__ */ jsx8("span", { className: "truncate", children: t.from_states.map((s) => stateNameMap.get(s) ?? s).join(", ") }),
                  /* @__PURE__ */ jsx8(ArrowRight3, { className: "size-2.5 shrink-0" }),
                  /* @__PURE__ */ jsx8("span", { className: "truncate", children: t.activate_states.map((s) => stateNameMap.get(s) ?? s).join(", ") })
                ] }),
                blockedReason && /* @__PURE__ */ jsx8("div", { className: "mt-1 ml-4", children: /* @__PURE__ */ jsx8(
                  "span",
                  {
                    title: blockedReason,
                    className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-gray-500/20 text-gray-400 border-gray-500/30",
                    children: shortBlockedLabel(blockedReason)
                  }
                ) })
              ]
            },
            t.transition_id
          );
        }),
        filteredTransitions.length === 0 && /* @__PURE__ */ jsx8("p", { className: "text-xs text-text-muted text-center py-4", children: "No transitions match filters." })
      ] })
    ] }),
    /* @__PURE__ */ jsx8("div", { className: "flex-1 overflow-y-auto", children: selectedTransition ? /* @__PURE__ */ jsxs8("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx8("h2", { className: "text-lg font-semibold text-text-primary", children: selectedTransition.name || "Unnamed Transition" }),
          selectedTransition.stays_visible && /* @__PURE__ */ jsxs8("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-green-500/20 text-green-400 border-green-500/30", children: [
            /* @__PURE__ */ jsx8(Eye2, { className: "size-2.5" }),
            "Visible"
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 mt-2 text-xs text-text-muted flex-wrap", children: [
          /* @__PURE__ */ jsxs8("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            "From:",
            " ",
            selectedTransition.from_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] }),
          /* @__PURE__ */ jsx8(ArrowRight3, { className: "size-3" }),
          /* @__PURE__ */ jsxs8("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            "To:",
            " ",
            selectedTransition.activate_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] }),
          selectedTransition.exit_states.length > 0 && /* @__PURE__ */ jsxs8("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border status-error text-red-400 border-red-500/30", children: [
            "Exit:",
            " ",
            selectedTransition.exit_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] })
        ] })
      ] }),
      selectedTransition.actions.length > 0 && /* @__PURE__ */ jsxs8("div", { className: "rounded-lg border border-border-secondary bg-bg-secondary p-4", children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx8(Zap, { className: "size-3.5 text-brand-primary" }),
            /* @__PURE__ */ jsx8("span", { className: "text-xs font-medium text-text-primary", children: "Action Playback" })
          ] }),
          /* @__PURE__ */ jsx8("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs8(
            "select",
            {
              value: animation.speed,
              onChange: (e) => setAnimation((prev) => ({
                ...prev,
                speed: parseFloat(e.target.value)
              })),
              className: "text-[10px] h-5 w-16 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
              style: { colorScheme: "dark" },
              children: [
                /* @__PURE__ */ jsx8("option", { value: "0.5", children: "0.5x" }),
                /* @__PURE__ */ jsx8("option", { value: "1", children: "1x" }),
                /* @__PURE__ */ jsx8("option", { value: "1.5", children: "1.5x" }),
                /* @__PURE__ */ jsx8("option", { value: "2", children: "2x" }),
                /* @__PURE__ */ jsx8("option", { value: "4", children: "4x" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx8("div", { className: "w-full h-1.5 bg-bg-primary rounded-full mb-3 overflow-hidden", children: /* @__PURE__ */ jsx8(
          "div",
          {
            className: "h-full bg-brand-primary rounded-full transition-all duration-100",
            style: { width: `${overallProgress * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: resetAnimation,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
              title: "Reset",
              children: /* @__PURE__ */ jsx8(RotateCcw, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: stepBackward,
              disabled: animation.currentActionIndex <= 0,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Step back",
              children: /* @__PURE__ */ jsx8(SkipBack, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: animation.isPlaying ? pauseAnimation : playAnimation,
              className: "h-9 w-9 p-0 inline-flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary/90",
              title: animation.isPlaying ? "Pause" : "Play",
              children: animation.isPlaying ? /* @__PURE__ */ jsx8(Pause, { className: "size-4" }) : /* @__PURE__ */ jsx8(Play4, { className: "size-4 ml-0.5" })
            }
          ),
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: stepForward,
              disabled: animation.currentActionIndex >= selectedTransition.actions.length - 1,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Step forward",
              children: /* @__PURE__ */ jsx8(SkipForward, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx8("div", { className: "mt-3 flex items-center justify-center gap-1", children: selectedTransition.actions.map((action, idx) => {
          const Icon = ACTION_ICONS2[action.type] ?? ChevronRight2;
          const isPastAction = animation.currentActionIndex >= 0 && idx < animation.currentActionIndex;
          const isCurrentAction = idx === animation.currentActionIndex;
          const color = getActionColorConfig(action.type);
          return /* @__PURE__ */ jsxs8(
            "button",
            {
              onClick: () => {
                stopAnimation();
                setAnimation((prev) => ({
                  ...prev,
                  currentActionIndex: idx,
                  progress: 0
                }));
              },
              className: `
                          flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] border transition-all
                          ${isCurrentAction ? `${color.bg} ${color.border} ${color.text} shadow-xs` : isPastAction ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-bg-primary border-border-secondary text-text-muted hover:border-brand-primary/30"}
                        `,
              title: `${ACTION_LABELS[action.type] ?? action.type}: ${action.target || action.url || action.text || ""}`,
              children: [
                /* @__PURE__ */ jsx8(Icon, { className: "size-2.5" }),
                /* @__PURE__ */ jsx8("span", { children: idx + 1 })
              ]
            },
            `${idx}-${action.type}`
          );
        }) }),
        /* @__PURE__ */ jsx8("div", { className: "mt-1.5 text-center text-[10px] text-text-muted", children: animation.currentActionIndex >= 0 ? `Action ${animation.currentActionIndex + 1} of ${selectedTransition.actions.length}` : "Ready to play" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsxs8("h3", { className: "text-sm font-medium text-text-primary mb-3", children: [
          "Actions (",
          selectedTransition.actions.length,
          ")"
        ] }),
        selectedTransition.actions.length === 0 ? /* @__PURE__ */ jsx8("p", { className: "text-xs text-text-muted", children: "No actions defined." }) : /* @__PURE__ */ jsx8("div", { className: "space-y-2", children: selectedTransition.actions.map((action, idx) => {
          const Icon = ACTION_ICONS2[action.type] ?? ChevronRight2;
          const color = getActionColorConfig(action.type);
          const isCurrent = idx === animation.currentActionIndex;
          const isPast = animation.currentActionIndex >= 0 && idx < animation.currentActionIndex;
          return /* @__PURE__ */ jsxs8(
            "div",
            {
              className: `
                          flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
                          ${isCurrent ? `${color.border} ${color.bg} shadow-xs` : isPast ? "border-green-500/30 bg-green-500/5" : "border-border-secondary bg-bg-secondary"}
                        `,
              children: [
                /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsx8("span", { className: "text-[10px] text-text-muted font-mono w-4 text-right", children: idx + 1 }),
                  /* @__PURE__ */ jsx8(
                    "div",
                    {
                      className: `p-1.5 rounded-md ${color.bg} ${color.text}`,
                      children: /* @__PURE__ */ jsx8(Icon, { className: "size-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs8("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs8("div", { className: "text-xs font-medium text-text-primary flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx8("span", { children: ACTION_LABELS[action.type] ?? action.type }),
                    isCurrent && animation.isPlaying && /* @__PURE__ */ jsx8(
                      "span",
                      {
                        className: `animate-pulse ${color.text} text-[10px]`,
                        children: ACTION_ACTIVE_LABELS[action.type]
                      }
                    )
                  ] }),
                  action.target && /* @__PURE__ */ jsx8("code", { className: "text-[10px] text-text-muted mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded", children: action.target }),
                  action.text && /* @__PURE__ */ jsxs8("div", { className: "text-[10px] text-text-muted mt-0.5 font-mono bg-bg-primary/50 px-1 py-0.5 rounded", children: [
                    "\u201C",
                    isCurrent && animation.isPlaying ? action.text.slice(
                      0,
                      Math.floor(
                        action.text.length * animation.progress
                      )
                    ) : action.text,
                    "\u201D",
                    isCurrent && animation.isPlaying && /* @__PURE__ */ jsx8("span", { className: "animate-pulse text-brand-primary", children: "|" })
                  ] }),
                  action.url && /* @__PURE__ */ jsx8("code", { className: "text-[10px] text-cyan-400 mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded", children: action.url }),
                  action.delay_ms != null && /* @__PURE__ */ jsxs8("span", { className: "text-[10px] text-text-muted mt-0.5 block", children: [
                    action.delay_ms,
                    "ms",
                    isCurrent && animation.isPlaying && /* @__PURE__ */ jsxs8("span", { className: "ml-1 text-text-muted/70", children: [
                      "(",
                      Math.round(
                        animation.progress * (action.delay_ms ?? 0)
                      ),
                      "ms elapsed)"
                    ] })
                  ] })
                ] }),
                isPast && /* @__PURE__ */ jsx8("div", { className: "text-green-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsx8(
                  "svg",
                  {
                    className: "size-4",
                    viewBox: "0 0 16 16",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx8("path", { d: "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" })
                  }
                ) }),
                isCurrent && animation.isPlaying && /* @__PURE__ */ jsx8("div", { className: "shrink-0 mt-0.5", children: action.type === "click" ? /* @__PURE__ */ jsxs8("div", { className: "relative w-5 h-5 flex items-center justify-center", children: [
                  /* @__PURE__ */ jsx8("div", { className: "absolute inset-0 rounded-full bg-blue-500/20 animate-ping" }),
                  /* @__PURE__ */ jsx8("div", { className: "w-2 h-2 rounded-full bg-blue-400" })
                ] }) : action.type === "navigate" ? /* @__PURE__ */ jsx8("div", { className: "relative w-5 h-5 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx8(
                  ArrowRight3,
                  {
                    className: "size-4 text-cyan-400 animate-bounce",
                    style: { animationDuration: "0.6s" }
                  }
                ) }) : action.type === "type" ? /* @__PURE__ */ jsx8("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx8(
                  "div",
                  {
                    className: "w-0.5 h-3.5 bg-amber-400 animate-pulse",
                    style: { animationDuration: "0.5s" }
                  }
                ) }) : action.type === "select" ? /* @__PURE__ */ jsx8("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx8(
                  ChevronRight2,
                  {
                    className: "size-3.5 text-purple-400 animate-bounce",
                    style: {
                      animationDuration: "0.8s",
                      transform: "rotate(90deg)"
                    }
                  }
                ) }) : action.type === "wait" ? /* @__PURE__ */ jsx8("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ jsx8(
                  "div",
                  {
                    className: "w-4 h-4 rounded-full border-2 border-gray-400/40 border-t-gray-400 animate-spin",
                    style: { animationDuration: "1.5s" }
                  }
                ) }) : /* @__PURE__ */ jsx8(
                  "div",
                  {
                    className: `w-4 h-4 rounded-full border-2 ${color.text} border-current border-t-transparent animate-spin`
                  }
                ) })
              ]
            },
            `${idx}-${action.type}`
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary", children: [
        /* @__PURE__ */ jsxs8("div", { children: [
          "Path Cost: ",
          selectedTransition.path_cost
        ] }),
        /* @__PURE__ */ jsxs8("div", { children: [
          "Stays Visible: ",
          selectedTransition.stays_visible ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ jsxs8("div", { children: [
          "ID:",
          " ",
          /* @__PURE__ */ jsx8("code", { className: "bg-bg-secondary px-1 rounded", children: selectedTransition.transition_id })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsx8("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ jsxs8("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx8(GitBranch, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsx8("p", { className: "text-sm", children: "Select a transition to view its details" }),
      /* @__PURE__ */ jsxs8("p", { className: "text-xs mt-1 text-text-muted/70", children: [
        transitions.length,
        " transition",
        transitions.length !== 1 ? "s" : "",
        " available"
      ] })
    ] }) }) })
  ] });
}

// src/components/state-machine/StateDetailPanel.tsx
import { useState as useState6, useEffect as useEffect6, useCallback as useCallback6 } from "react";
import {
  getElementTypeStyle,
  getElementLabel,
  getConfidenceColor
} from "@qontinui/workflow-utils";
import { Fragment as Fragment3, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function StateDetailPanel({
  state,
  onSave,
  onDelete,
  onClose
}) {
  const [name, setName] = useState6(state.name);
  const [description, setDescription] = useState6(state.description ?? "");
  const [elementIds, setElementIds] = useState6([...state.element_ids]);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState6([
    ...state.acceptance_criteria
  ]);
  const [domainKnowledge, setDomainKnowledge] = useState6(
    state.domain_knowledge.map((dk) => ({ ...dk, tags: [...dk.tags] }))
  );
  const [isSaving, setIsSaving] = useState6(false);
  const [newElementId, setNewElementId] = useState6("");
  const [newCriterion, setNewCriterion] = useState6("");
  const [showNewDk, setShowNewDk] = useState6(false);
  const [newDkTitle, setNewDkTitle] = useState6("");
  const [newDkContent, setNewDkContent] = useState6("");
  const [newDkTags, setNewDkTags] = useState6("");
  const [editingCriterionIdx, setEditingCriterionIdx] = useState6(
    null
  );
  const [editingCriterionValue, setEditingCriterionValue] = useState6("");
  useEffect6(() => {
    setName(state.name);
    setDescription(state.description ?? "");
    setElementIds([...state.element_ids]);
    setAcceptanceCriteria([...state.acceptance_criteria]);
    setDomainKnowledge(
      state.domain_knowledge.map((dk) => ({ ...dk, tags: [...dk.tags] }))
    );
    setNewElementId("");
    setNewCriterion("");
    setShowNewDk(false);
    setEditingCriterionIdx(null);
  }, [state]);
  const hasChanges = name !== state.name || description !== (state.description ?? "") || JSON.stringify(elementIds) !== JSON.stringify(state.element_ids) || JSON.stringify(acceptanceCriteria) !== JSON.stringify(state.acceptance_criteria) || JSON.stringify(domainKnowledge) !== JSON.stringify(state.domain_knowledge);
  const handleSave = useCallback6(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      const updates = {};
      if (name.trim() !== state.name) updates.name = name.trim();
      if (description.trim() !== (state.description ?? ""))
        updates.description = description.trim() || void 0;
      if (JSON.stringify(elementIds) !== JSON.stringify(state.element_ids))
        updates.element_ids = elementIds;
      if (JSON.stringify(acceptanceCriteria) !== JSON.stringify(state.acceptance_criteria))
        updates.acceptance_criteria = acceptanceCriteria;
      if (JSON.stringify(domainKnowledge) !== JSON.stringify(state.domain_knowledge))
        updates.domain_knowledge = domainKnowledge;
      await onSave(state.id, updates);
    } finally {
      setIsSaving(false);
    }
  }, [
    state,
    name,
    description,
    elementIds,
    acceptanceCriteria,
    domainKnowledge,
    hasChanges,
    onSave
  ]);
  const handleDelete = useCallback6(async () => {
    if (!onDelete) return;
    setIsSaving(true);
    try {
      await onDelete(state.id);
    } finally {
      setIsSaving(false);
    }
  }, [state.id, onDelete]);
  const handleAddElement = useCallback6(() => {
    const trimmed = newElementId.trim();
    if (!trimmed || elementIds.includes(trimmed)) return;
    setElementIds((prev) => [...prev, trimmed]);
    setNewElementId("");
  }, [newElementId, elementIds]);
  const handleRemoveElement = useCallback6((eid) => {
    setElementIds((prev) => prev.filter((e) => e !== eid));
  }, []);
  const handleAddCriterion = useCallback6(() => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    setAcceptanceCriteria((prev) => [...prev, trimmed]);
    setNewCriterion("");
  }, [newCriterion]);
  const handleRemoveCriterion = useCallback6((idx) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== idx));
    setEditingCriterionIdx(null);
  }, []);
  const handleSaveCriterionEdit = useCallback6(() => {
    if (editingCriterionIdx === null) return;
    const trimmed = editingCriterionValue.trim();
    if (!trimmed) {
      handleRemoveCriterion(editingCriterionIdx);
      return;
    }
    setAcceptanceCriteria(
      (prev) => prev.map((c, i) => i === editingCriterionIdx ? trimmed : c)
    );
    setEditingCriterionIdx(null);
  }, [editingCriterionIdx, editingCriterionValue, handleRemoveCriterion]);
  const handleAddDk = useCallback6(() => {
    const title = newDkTitle.trim();
    const content = newDkContent.trim();
    if (!title || !content) return;
    const tags = newDkTags.split(",").flatMap((t) => {
      const trimmed = t.trim();
      return trimmed ? [trimmed] : [];
    });
    setDomainKnowledge((prev) => [
      ...prev,
      {
        id: `dk-${Date.now()}`,
        title,
        content,
        tags
      }
    ]);
    setNewDkTitle("");
    setNewDkContent("");
    setNewDkTags("");
    setShowNewDk(false);
  }, [newDkTitle, newDkContent, newDkTags]);
  const handleRemoveDk = useCallback6((dkId) => {
    setDomainKnowledge((prev) => prev.filter((dk) => dk.id !== dkId));
  }, []);
  const confidenceColor = getConfidenceColor(state.confidence);
  const confidencePct = Math.round(state.confidence * 100);
  return /* @__PURE__ */ jsxs9("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx9("h3", { className: "text-sm font-semibold text-text-primary", children: "State Details" }),
      /* @__PURE__ */ jsx9(
        "button",
        {
          onClick: onClose,
          className: "text-text-secondary hover:text-text-primary text-xs",
          children: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsx9("label", { className: "block text-xs text-text-secondary mb-1", children: "Name" }),
      /* @__PURE__ */ jsx9(
        "input",
        {
          type: "text",
          value: name,
          onChange: (e) => setName(e.target.value),
          className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsx9("label", { className: "block text-xs text-text-secondary mb-1", children: "Description" }),
      /* @__PURE__ */ jsx9(
        "textarea",
        {
          value: description,
          onChange: (e) => setDescription(e.target.value),
          rows: 3,
          placeholder: "Optional description",
          className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted resize-y"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx9("span", { className: "text-text-secondary", children: "State ID" }),
        /* @__PURE__ */ jsx9("code", { className: "block mt-0.5 px-1.5 py-0.5 bg-bg-tertiary rounded text-text-primary font-mono text-[10px] break-all", children: state.state_id })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx9("span", { className: "text-text-secondary", children: "Confidence" }),
        /* @__PURE__ */ jsxs9("span", { className: `block mt-0.5 font-medium ${confidenceColor}`, children: [
          confidencePct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx9("span", { className: "text-text-secondary", children: "Elements" }),
        /* @__PURE__ */ jsx9("span", { className: "block mt-0.5 text-text-primary font-medium", children: elementIds.length })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx9("span", { className: "text-text-secondary", children: "Renders" }),
        /* @__PURE__ */ jsx9("span", { className: "block mt-0.5 text-text-primary font-medium", children: state.render_ids.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsxs9("label", { className: "block text-xs text-text-secondary mb-1.5", children: [
        "Elements (",
        elementIds.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx9("div", { className: "max-h-48 overflow-y-auto space-y-0.5", children: elementIds.map((eid) => {
        const style = getElementTypeStyle(eid);
        const label = getElementLabel(eid);
        return /* @__PURE__ */ jsxs9(
          "div",
          {
            className: `group flex items-center gap-1 px-2 py-1 text-xs rounded border ${style.bg} ${style.text} ${style.border}`,
            title: eid,
            children: [
              /* @__PURE__ */ jsx9("span", { className: "truncate flex-1", children: label }),
              /* @__PURE__ */ jsx9(
                "button",
                {
                  onClick: () => handleRemoveElement(eid),
                  className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
                  title: "Remove element",
                  children: "\xD7"
                }
              )
            ]
          },
          eid
        );
      }) }),
      /* @__PURE__ */ jsxs9("div", { className: "flex gap-1 mt-1.5", children: [
        /* @__PURE__ */ jsx9(
          "input",
          {
            type: "text",
            value: newElementId,
            onChange: (e) => setNewElementId(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleAddElement();
            },
            placeholder: "type:element-id",
            className: "flex-1 px-2 py-1 text-xs bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          }
        ),
        /* @__PURE__ */ jsx9(
          "button",
          {
            onClick: handleAddElement,
            disabled: !newElementId.trim(),
            className: "px-2 py-1 text-xs text-brand-primary hover:text-brand-primary/80 disabled:opacity-50",
            children: "Add"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsxs9("label", { className: "block text-xs text-text-secondary mb-1", children: [
        "Acceptance Criteria (",
        acceptanceCriteria.length,
        ")"
      ] }),
      acceptanceCriteria.length > 0 && /* @__PURE__ */ jsx9("ul", { className: "space-y-0.5 mb-1.5", children: acceptanceCriteria.map((c, i) => /* @__PURE__ */ jsx9("li", { className: "group flex items-start gap-1.5 text-xs", children: editingCriterionIdx === i ? /* @__PURE__ */ jsx9(
        "input",
        {
          type: "text",
          value: editingCriterionValue,
          onChange: (e) => setEditingCriterionValue(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") handleSaveCriterionEdit();
            if (e.key === "Escape") setEditingCriterionIdx(null);
          },
          onBlur: handleSaveCriterionEdit,
          autoFocus: true,
          className: "flex-1 px-1.5 py-0.5 text-xs bg-bg-tertiary border border-border-secondary rounded text-text-primary"
        }
      ) : /* @__PURE__ */ jsxs9(Fragment3, { children: [
        /* @__PURE__ */ jsx9(
          "span",
          {
            className: "flex-1 text-text-primary cursor-pointer hover:text-brand-primary",
            onClick: () => {
              setEditingCriterionIdx(i);
              setEditingCriterionValue(c);
            },
            title: "Click to edit",
            children: c
          }
        ),
        /* @__PURE__ */ jsx9(
          "button",
          {
            onClick: () => handleRemoveCriterion(i),
            className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
            title: "Remove",
            children: "\xD7"
          }
        )
      ] }) }, `${i}-${c}`)) }),
      /* @__PURE__ */ jsxs9("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx9(
          "input",
          {
            type: "text",
            value: newCriterion,
            onChange: (e) => setNewCriterion(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleAddCriterion();
            },
            placeholder: "Add acceptance criterion...",
            className: "flex-1 px-2 py-1 text-xs bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          }
        ),
        /* @__PURE__ */ jsx9(
          "button",
          {
            onClick: handleAddCriterion,
            disabled: !newCriterion.trim(),
            className: "px-2 py-1 text-xs text-brand-primary hover:text-brand-primary/80 disabled:opacity-50",
            children: "Add"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsxs9("label", { className: "text-xs text-text-secondary", children: [
          "Domain Knowledge (",
          domainKnowledge.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx9(
          "button",
          {
            onClick: () => setShowNewDk(true),
            className: "text-xs text-brand-primary hover:text-brand-primary/80",
            children: "+ Add"
          }
        )
      ] }),
      domainKnowledge.length > 0 && /* @__PURE__ */ jsx9("div", { className: "space-y-1.5", children: domainKnowledge.map((dk) => /* @__PURE__ */ jsxs9(
        "div",
        {
          className: "group p-2 bg-bg-tertiary border border-border-secondary rounded",
          children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex items-start justify-between gap-1", children: [
              /* @__PURE__ */ jsx9("div", { className: "text-xs font-medium text-text-primary", children: dk.title }),
              /* @__PURE__ */ jsx9(
                "button",
                {
                  onClick: () => handleRemoveDk(dk.id),
                  className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
                  title: "Remove",
                  children: "\xD7"
                }
              )
            ] }),
            /* @__PURE__ */ jsx9("div", { className: "text-xs text-text-secondary mt-0.5 line-clamp-2", children: dk.content }),
            dk.tags.length > 0 && /* @__PURE__ */ jsx9("div", { className: "flex flex-wrap gap-1 mt-1", children: dk.tags.map((tag) => /* @__PURE__ */ jsx9(
              "span",
              {
                className: "px-1 py-0.5 text-[10px] bg-bg-secondary rounded text-text-secondary",
                children: tag
              },
              tag
            )) })
          ]
        },
        dk.id
      )) }),
      showNewDk && /* @__PURE__ */ jsxs9("div", { className: "mt-1.5 p-2 bg-bg-tertiary border border-border-secondary rounded space-y-1.5", children: [
        /* @__PURE__ */ jsx9(
          "input",
          {
            type: "text",
            value: newDkTitle,
            onChange: (e) => setNewDkTitle(e.target.value),
            placeholder: "Title",
            autoFocus: true,
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          }
        ),
        /* @__PURE__ */ jsx9(
          "textarea",
          {
            value: newDkContent,
            onChange: (e) => setNewDkContent(e.target.value),
            placeholder: "Content",
            rows: 2,
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted resize-y"
          }
        ),
        /* @__PURE__ */ jsx9(
          "input",
          {
            type: "text",
            value: newDkTags,
            onChange: (e) => setNewDkTags(e.target.value),
            placeholder: "Tags (comma-separated)",
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          }
        ),
        /* @__PURE__ */ jsxs9("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsx9(
            "button",
            {
              onClick: handleAddDk,
              disabled: !newDkTitle.trim() || !newDkContent.trim(),
              className: "px-2 py-1 text-xs font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 rounded",
              children: "Add"
            }
          ),
          /* @__PURE__ */ jsx9(
            "button",
            {
              onClick: () => {
                setShowNewDk(false);
                setNewDkTitle("");
                setNewDkContent("");
                setNewDkTags("");
              },
              className: "px-2 py-1 text-xs text-text-secondary hover:text-text-primary",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "flex gap-2 pt-2 border-t border-border-secondary", children: [
      hasChanges && /* @__PURE__ */ jsx9(
        "button",
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: isSaving ? "Saving..." : "Save Changes"
        }
      ),
      onDelete && /* @__PURE__ */ jsx9(
        "button",
        {
          onClick: handleDelete,
          disabled: isSaving,
          className: "px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded",
          children: "Delete State"
        }
      )
    ] })
  ] });
}

// src/components/state-machine/StateViewPanel.tsx
import { useState as useState10, useMemo as useMemo8, useEffect as useEffect9, useCallback as useCallback9 } from "react";
import {
  List as VirtualList,
  useListRef,
  useDynamicRowHeight
} from "react-window";
import {
  Layers as Layers5,
  ChevronRight as ChevronRight4,
  ChevronDown as ChevronDown2,
  Play as Play5,
  Lock as Lock2,
  Eye as Eye3,
  BookOpen,
  Search as Search2,
  BarChart3,
  List,
  ArrowUpRight as ArrowUpRight2,
  ArrowDownLeft as ArrowDownLeft2,
  ArrowRight as ArrowRight4,
  CheckCircle,
  Image as Image2
} from "lucide-react";
import {
  getElementTypePrefix as getElementTypePrefix3,
  getElementLabel as getElementLabel4,
  getActionTypeColor,
  STATE_COLORS as STATE_COLORS3
} from "@qontinui/workflow-utils";

// src/components/state-machine/state-view-helpers.ts
import {
  MousePointer as MousePointer4,
  Type as TypeIcon4,
  Globe as Globe4,
  Hash as Hash2,
  Box as Box2,
  Layers as Layers3,
  Target
} from "lucide-react";
import {
  getElementLabel as getElementLabel2
} from "@qontinui/workflow-utils";
var ELEMENT_ICONS = {
  testid: Hash2,
  role: MousePointer4,
  text: TypeIcon4,
  ui: Box2,
  url: Globe4,
  nav: Globe4
};
var ELEMENT_COLORS = {
  testid: "border-blue-400 bg-blue-500/10 text-blue-300",
  role: "border-green-400 bg-green-500/10 text-green-300",
  text: "border-amber-400 bg-amber-500/10 text-amber-300",
  ui: "border-purple-400 bg-purple-500/10 text-purple-300",
  url: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
  nav: "border-cyan-400 bg-cyan-500/10 text-cyan-300"
};
var ACTION_ICONS3 = {
  click: MousePointer4,
  type: TypeIcon4,
  select: Target,
  wait: Layers3,
  navigate: Globe4
};
function getFingerprintHash(elementId) {
  const idx = elementId.indexOf(":");
  return idx > 0 ? elementId.slice(idx + 1) : elementId;
}
function resolveElementLabel(elementId, fingerprintDetails, state) {
  const hash = getFingerprintHash(elementId);
  const fp = fingerprintDetails?.[hash] ?? fingerprintDetails?.[elementId];
  if (fp) {
    if (fp.accessibleName) return fp.accessibleName;
    const parts = [fp.tagName, fp.role].filter(Boolean);
    if (parts.length > 0) return parts.join(" ");
  }
  const labels = state?.extra_metadata?.elementLabels;
  if (labels?.[elementId]) return labels[elementId];
  return getElementLabel2(elementId);
}
function resolveElementPosition(elementId, fingerprintDetails, state) {
  const hash = getFingerprintHash(elementId);
  const fp = fingerprintDetails?.[hash] ?? fingerprintDetails?.[elementId];
  if (fp?.relativePosition) return fp.relativePosition;
  const positions = state?.extra_metadata?.elementPositions;
  if (positions?.[elementId]) return positions[elementId];
  return null;
}
function resolveElementTag(elementId, fingerprintDetails, state) {
  const hash = getFingerprintHash(elementId);
  const fp = fingerprintDetails?.[hash] ?? fingerprintDetails?.[elementId];
  if (fp) {
    return {
      tagName: fp.tagName || "",
      role: fp.role || "",
      zone: fp.positionZone || ""
    };
  }
  const tags = state?.extra_metadata?.elementTags;
  if (tags?.[elementId]) return tags[elementId];
  return null;
}

// src/components/state-machine/SpatialCanvas.tsx
import { useState as useState7, useMemo as useMemo5, useRef as useRef5, useEffect as useEffect7, useCallback as useCallback7 } from "react";
import { ZoomIn, ZoomOut, Maximize as Maximize2 } from "lucide-react";
import { STATE_COLORS, computeSpatialLayout } from "@qontinui/workflow-utils";
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
function SpatialCanvas({
  states,
  transitions,
  selectedStateId,
  onSelectState
}) {
  const canvasRef = useRef5(null);
  const containerRef = useRef5(null);
  const [canvasSize, setCanvasSize] = useState7({ width: 800, height: 600 });
  const [zoom, setZoom] = useState7(1);
  const [hoveredStateId, setHoveredStateId] = useState7(null);
  const layout = useMemo5(
    () => computeSpatialLayout(
      states,
      transitions,
      canvasSize.width,
      canvasSize.height
    ),
    [states, transitions, canvasSize.width, canvasSize.height]
  );
  const sharedElements = useMemo5(() => {
    const elementStateMap = /* @__PURE__ */ new Map();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, /* @__PURE__ */ new Set());
        elementStateMap.get(eid).add(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);
  useEffect7(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCanvasSize({
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height)
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  useEffect7(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr * zoom, dpr * zoom);
    ctx.clearRect(0, 0, canvasSize.width / zoom, canvasSize.height / zoom);
    for (const [, stateIds] of sharedElements) {
      if (stateIds.size < 2) continue;
      const ids = Array.from(stateIds);
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const p1 = layout.get(ids[i]);
          const p2 = layout.get(ids[j]);
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
    for (const t of transitions) {
      for (const from of t.from_states) {
        for (const to of t.activate_states) {
          const p1 = layout.get(from);
          const p2 = layout.get(to);
          if (!p1 || !p2) continue;
          const isHighlighted = from === selectedStateId || to === selectedStateId || from === hoveredStateId || to === hoveredStateId;
          ctx.beginPath();
          ctx.strokeStyle = isHighlighted ? "#6366f1" : "rgba(128, 128, 128, 0.2)";
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
          const angle = Math.atan2(endY - cpy, endX - cpx);
          const arrowSize = 6;
          ctx.beginPath();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
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
    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      const pos = layout.get(state.state_id);
      if (!pos) continue;
      const color = STATE_COLORS[i % STATE_COLORS.length];
      const isSelected = state.state_id === selectedStateId;
      const isHovered = state.state_id === hoveredStateId;
      const isInitial = state.extra_metadata?.initial === true;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected || isHovered ? color.bgSolid : color.bg;
      ctx.fill();
      ctx.strokeStyle = color.border;
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1.5;
      ctx.stroke();
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = color.border;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (isInitial) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - pos.radius - 8, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.fillStyle = isSelected || isHovered ? "#fff" : "rgba(255, 255, 255, 0.85)";
      ctx.font = `${isSelected ? "bold " : ""}${Math.max(9, Math.min(12, pos.radius / 3))}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let displayName = state.name;
      const maxWidth = pos.radius * 1.6;
      while (ctx.measureText(displayName).width > maxWidth && displayName.length > 3) {
        displayName = displayName.slice(0, -2) + "\u2026";
      }
      ctx.fillText(displayName, pos.x, pos.y);
      ctx.font = "9px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(
        `${state.element_ids.length} el`,
        pos.x,
        pos.y + pos.radius + 12
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
    zoom
  ]);
  const getStateAtPoint = useCallback7(
    (clientX, clientY) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / zoom;
      const y = (clientY - rect.top) / zoom;
      for (let i = states.length - 1; i >= 0; i--) {
        const state = states[i];
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
    [states, layout, zoom]
  );
  const handleMouseMove = useCallback7(
    (e) => {
      setHoveredStateId(getStateAtPoint(e.clientX, e.clientY));
    },
    [getStateAtPoint]
  );
  const handleClick = useCallback7(
    (e) => {
      const stateId = getStateAtPoint(e.clientX, e.clientY);
      onSelectState(stateId === selectedStateId ? null : stateId);
    },
    [getStateAtPoint, onSelectState, selectedStateId]
  );
  return /* @__PURE__ */ jsxs10(
    "div",
    {
      ref: containerRef,
      className: "relative w-full h-full bg-bg-secondary",
      children: [
        /* @__PURE__ */ jsx10(
          "canvas",
          {
            ref: canvasRef,
            style: {
              width: canvasSize.width,
              height: canvasSize.height,
              cursor: hoveredStateId ? "pointer" : "default"
            },
            onMouseMove: handleMouseMove,
            onClick: handleClick,
            onMouseLeave: () => setHoveredStateId(null)
          }
        ),
        /* @__PURE__ */ jsxs10("div", { className: "absolute top-3 right-3 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx10(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary",
              onClick: () => setZoom((z) => Math.min(3, z + 0.25)),
              title: "Zoom in",
              children: /* @__PURE__ */ jsx10(ZoomIn, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsx10(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary",
              onClick: () => setZoom((z) => Math.max(0.5, z - 0.25)),
              title: "Zoom out",
              children: /* @__PURE__ */ jsx10(ZoomOut, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsx10(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary",
              onClick: () => setZoom(1),
              title: "Reset zoom",
              children: /* @__PURE__ */ jsx10(Maximize2, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx10("div", { className: "absolute bottom-3 left-3 text-[10px] text-text-muted bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50", children: /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs10("span", { children: [
            states.length,
            " states"
          ] }),
          /* @__PURE__ */ jsxs10("span", { children: [
            transitions.length,
            " transitions"
          ] }),
          /* @__PURE__ */ jsxs10("span", { children: [
            "Zoom: ",
            Math.round(zoom * 100),
            "%"
          ] })
        ] }) }),
        hoveredStateId && /* @__PURE__ */ jsxs10("div", { className: "absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md", children: [
          /* @__PURE__ */ jsx10("div", { className: "font-medium text-text-primary", children: states.find((s) => s.state_id === hoveredStateId)?.name }),
          /* @__PURE__ */ jsxs10("div", { className: "text-text-muted mt-0.5", children: [
            states.find((s) => s.state_id === hoveredStateId)?.element_ids.length,
            " ",
            "elements"
          ] })
        ] })
      ]
    }
  );
}

// src/components/state-machine/StateLayoutView.tsx
import { useState as useState8, useMemo as useMemo6 } from "react";
import { Layout } from "lucide-react";
import { getElementTypePrefix as getElementTypePrefix2, getElementLabel as getElementLabel3 } from "@qontinui/workflow-utils";
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
function StateLayoutView({
  state,
  elementThumbnails,
  fingerprintDetails
}) {
  const [hoveredElement, setHoveredElement] = useState8(null);
  const positionedElements = useMemo6(() => {
    const items = [];
    for (const eid of state.element_ids) {
      const pos = resolveElementPosition(eid, fingerprintDetails, state);
      if (!pos) continue;
      const label = resolveElementLabel(eid, fingerprintDetails, state);
      const tag = resolveElementTag(eid, fingerprintDetails, state);
      const prefix = getElementTypePrefix2(eid);
      const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[getElementLabel3(eid)];
      items.push({ id: eid, label, tag, position: pos, thumbnail: thumb, prefix });
    }
    return items;
  }, [state, fingerprintDetails, elementThumbnails]);
  const elementsWithoutPosition = state.element_ids.length - positionedElements.length;
  if (positionedElements.length === 0) {
    return /* @__PURE__ */ jsx11("div", { className: "flex items-center justify-center h-48 text-text-muted text-xs", children: "No position data available for this state's elements." });
  }
  return /* @__PURE__ */ jsxs11("div", { children: [
    /* @__PURE__ */ jsxs11("h3", { className: "text-sm font-medium text-text-primary mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx11(Layout, { className: "size-3.5" }),
      "State Layout"
    ] }),
    /* @__PURE__ */ jsxs11(
      "div",
      {
        className: "relative bg-bg-tertiary border border-border-secondary rounded-lg",
        style: { aspectRatio: "16 / 10" },
        children: [
          /* @__PURE__ */ jsxs11("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ jsx11("div", { className: "absolute top-0 left-0 right-0 h-[10%] border-b border-dashed border-border-secondary/30" }),
            /* @__PURE__ */ jsx11("div", { className: "absolute bottom-0 left-0 right-0 h-[10%] border-t border-dashed border-border-secondary/30" })
          ] }),
          positionedElements.map((el) => {
            const isHovered = hoveredElement === el.id;
            const colorClass = ELEMENT_COLORS[el.prefix] ?? "border-gray-400 bg-gray-500/10 text-gray-300";
            const thumbSrc = el.thumbnail ? el.thumbnail.startsWith("data:") ? el.thumbnail : `data:image/png;base64,${el.thumbnail}` : void 0;
            return /* @__PURE__ */ jsxs11(
              "div",
              {
                className: "absolute group",
                style: {
                  top: `${el.position.top * 100}%`,
                  left: `${el.position.left * 100}%`,
                  transform: "translate(-50%, -50%)"
                },
                onMouseEnter: () => setHoveredElement(el.id),
                onMouseLeave: () => setHoveredElement(null),
                children: [
                  /* @__PURE__ */ jsx11(
                    "div",
                    {
                      className: `
                  rounded border ${colorClass} overflow-hidden
                  transition-all duration-100 cursor-default
                  ${isHovered ? "ring-2 ring-brand-primary/50 shadow-lg z-20 scale-125" : "z-10"}
                `,
                      style: { width: thumbSrc ? 32 : void 0, height: thumbSrc ? 32 : void 0 },
                      children: thumbSrc ? /* @__PURE__ */ jsx11(
                        "img",
                        {
                          src: thumbSrc,
                          alt: el.label,
                          className: "w-full h-full object-contain"
                        }
                      ) : /* @__PURE__ */ jsx11("div", { className: "px-1 py-0.5 text-[8px] whitespace-nowrap max-w-[80px] truncate", children: el.label })
                    }
                  ),
                  isHovered && /* @__PURE__ */ jsxs11("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-bg-primary/95 backdrop-blur-xs border border-border-secondary rounded px-2 py-1 shadow-md whitespace-nowrap", children: [
                    /* @__PURE__ */ jsx11("div", { className: "text-[10px] font-medium text-text-primary", children: el.label }),
                    el.tag && /* @__PURE__ */ jsx11("div", { className: "text-[9px] text-text-muted", children: [el.tag.tagName && `<${el.tag.tagName}>`, el.tag.role && `role="${el.tag.role}"`, el.tag.zone].filter(Boolean).join(" ") })
                  ] })
                ]
              },
              el.id
            );
          })
        ]
      }
    ),
    elementsWithoutPosition > 0 && /* @__PURE__ */ jsxs11("p", { className: "text-[10px] text-text-muted mt-1.5", children: [
      elementsWithoutPosition,
      " element",
      elementsWithoutPosition !== 1 ? "s" : "",
      " without position data"
    ] })
  ] });
}

// src/components/state-machine/ScreenshotStateView.tsx
import { useState as useState9, useMemo as useMemo7, useRef as useRef6, useEffect as useEffect8, useCallback as useCallback8 } from "react";
import {
  Layers as Layers4,
  ChevronLeft,
  ChevronRight as ChevronRight3,
  ZoomIn as ZoomIn2,
  ZoomOut as ZoomOut2,
  Maximize as Maximize3,
  Image,
  X
} from "lucide-react";
import { STATE_COLORS as STATE_COLORS2 } from "@qontinui/workflow-utils";
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
function ScreenshotStateView({
  captureScreenshots,
  onLoadScreenshotImage,
  states,
  selectedStateIds,
  fingerprintDetails,
  elementThumbnails
}) {
  const canvasRef = useRef6(null);
  const containerRef = useRef6(null);
  const imageCache = useRef6(/* @__PURE__ */ new Map());
  const thumbnailLoadingRef = useRef6(/* @__PURE__ */ new Set());
  const [currentIndex, setCurrentIndex] = useState9(0);
  const [userZoom, setUserZoom] = useState9(null);
  const [autoFitZoom, setAutoFitZoom] = useState9(1);
  const zoom = userZoom ?? autoFitZoom;
  const [hoveredElement, setHoveredElement] = useState9(null);
  const [canvasSize, setCanvasSize] = useState9({ width: 800, height: 600 });
  const [isLoading, setIsLoading] = useState9(false);
  const [selectedElementHash, setSelectedElementHash] = useState9(null);
  const [thumbnailCache, setThumbnailCache] = useState9(/* @__PURE__ */ new Map());
  const capture = captureScreenshots[currentIndex];
  const elementBounds = useMemo7(() => {
    if (!capture) return {};
    try {
      return JSON.parse(capture.elementBoundsJson);
    } catch {
      return {};
    }
  }, [capture]);
  const selectedStateHashes = useMemo7(() => {
    const hashes = /* @__PURE__ */ new Set();
    for (const state of states) {
      if (selectedStateIds.has(state.state_id)) {
        for (const eid of state.element_ids) {
          hashes.add(getFingerprintHash(eid));
        }
      }
    }
    return hashes;
  }, [selectedStateIds, states]);
  const selectedStates = useMemo7(
    () => states.filter((s) => selectedStateIds.has(s.state_id)),
    [states, selectedStateIds]
  );
  const hashToElement = useMemo7(() => {
    const map = /* @__PURE__ */ new Map();
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
  const matchingScreenshotIndices = useMemo7(() => {
    if (selectedStateIds.size === 0) return captureScreenshots.map((_, i) => i);
    const indices = [];
    for (let i = 0; i < captureScreenshots.length; i++) {
      try {
        const hashes = JSON.parse(captureScreenshots[i].fingerprintHashesJson);
        if (hashes.some((h) => selectedStateHashes.has(h))) {
          indices.push(i);
        }
      } catch {
      }
    }
    return indices;
  }, [captureScreenshots, selectedStateIds, selectedStateHashes]);
  useEffect8(() => {
    if (selectedStateIds.size === 0) return;
    let bestIdx = -1;
    let bestOverlap = 0;
    for (let i = 0; i < captureScreenshots.length; i++) {
      try {
        const capHashes = JSON.parse(captureScreenshots[i].fingerprintHashesJson);
        const overlap = capHashes.filter((h) => selectedStateHashes.has(h)).length;
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestIdx = i;
        }
      } catch {
      }
    }
    if (bestIdx >= 0) setCurrentIndex(bestIdx);
  }, [selectedStateIds, selectedStateHashes, captureScreenshots]);
  useEffect8(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCanvasSize({
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height)
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  useEffect8(() => {
    for (const cap of captureScreenshots) {
      if (thumbnailLoadingRef.current.has(cap.id)) continue;
      thumbnailLoadingRef.current.add(cap.id);
      onLoadScreenshotImage(cap.id).then((dataUrl) => {
        setThumbnailCache((prev) => {
          const next = new Map(prev);
          next.set(cap.id, dataUrl);
          return next;
        });
      }).catch(() => {
      });
    }
  }, [captureScreenshots, onLoadScreenshotImage]);
  useEffect8(() => {
    if (!capture) return;
    const cached = imageCache.current.get(capture.id);
    if (cached) {
      const fitZoom = Math.min(canvasSize.width / cached.width, canvasSize.height / cached.height, 1);
      setAutoFitZoom(fitZoom);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    onLoadScreenshotImage(capture.id).then((dataUrl) => {
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
      img.onerror = () => {
        if (!cancelled) setIsLoading(false);
      };
      img.src = dataUrl;
    }).catch(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [capture, onLoadScreenshotImage, canvasSize.width, canvasSize.height]);
  useEffect8(() => {
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
    const allEntries = Object.entries(elementBounds);
    const elementsToDraw = selectedStateIds.size > 0 ? allEntries.filter(([hash]) => selectedStateHashes.has(hash)) : allEntries;
    for (const [hash, bounds] of elementsToDraw) {
      const isHovered = hash === hoveredElement;
      const isSelected = hash === selectedElementHash;
      let borderColor;
      let fillOpacity;
      let lineWidth;
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
        const label = entry ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state) : resolveElementLabel(hash, fingerprintDetails);
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
  const getElementAtPoint = useCallback8(
    (clientX, clientY) => {
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
      let bestHash = null;
      let bestArea = Infinity;
      for (const [hash, bounds] of Object.entries(elementBounds)) {
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
    [capture, zoom, canvasSize, elementBounds, selectedStateIds, selectedStateHashes]
  );
  const handleMouseMove = useCallback8(
    (e) => {
      setHoveredElement(getElementAtPoint(e.clientX, e.clientY));
    },
    [getElementAtPoint]
  );
  const handleCanvasClick = useCallback8(
    (e) => {
      const hash = getElementAtPoint(e.clientX, e.clientY);
      if (!hash) {
        setSelectedElementHash(null);
        return;
      }
      setSelectedElementHash(hash);
    },
    [getElementAtPoint]
  );
  const handlePrev = useCallback8(
    () => setCurrentIndex((i) => Math.max(0, i - 1)),
    []
  );
  const handleNext = useCallback8(
    () => setCurrentIndex((i) => Math.min(captureScreenshots.length - 1, i + 1)),
    [captureScreenshots.length]
  );
  useEffect8(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedElementHash(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);
  if (captureScreenshots.length === 0) {
    return /* @__PURE__ */ jsx12("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx12(Image, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsx12("p", { className: "text-sm", children: "No capture screenshots available" }),
      /* @__PURE__ */ jsx12("p", { className: "text-xs mt-1 text-text-muted/70", children: "Run a state discovery to capture screenshots" })
    ] }) });
  }
  const selectedFp = selectedElementHash ? fingerprintDetails?.[selectedElementHash] ?? null : null;
  return /* @__PURE__ */ jsxs12("div", { className: "flex h-full", children: [
    /* @__PURE__ */ jsx12("div", { className: "w-56 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: selectedStates.length > 0 ? /* @__PURE__ */ jsx12("div", { className: "flex flex-col", children: selectedStates.map((state, stateIdx) => {
      const colorIdx = states.indexOf(state);
      const color = STATE_COLORS2[colorIdx % STATE_COLORS2.length];
      return /* @__PURE__ */ jsxs12("div", { className: stateIdx > 0 ? "border-t border-border-secondary" : "", children: [
        /* @__PURE__ */ jsxs12("div", { className: "p-2 border-b border-border-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx12("div", { className: "w-2 h-2 rounded-full shrink-0", style: { backgroundColor: color.border } }),
          /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-semibold text-text-primary uppercase tracking-wider truncate", children: state.name }),
          /* @__PURE__ */ jsx12("span", { className: "text-[9px] text-text-muted ml-auto shrink-0", children: state.element_ids.length })
        ] }),
        /* @__PURE__ */ jsx12("div", { className: "p-1.5 space-y-0.5", children: state.element_ids.map((eid) => {
          const hash = getFingerprintHash(eid);
          const label = resolveElementLabel(eid, fingerprintDetails, state);
          const thumb = elementThumbnails?.[hash] ?? elementThumbnails?.[eid];
          const isActive = hash === selectedElementHash;
          return /* @__PURE__ */ jsxs12(
            "button",
            {
              onClick: () => setSelectedElementHash(isActive ? null : hash),
              className: `w-full flex items-center gap-1.5 text-[10px] px-2 py-1 rounded text-left ${isActive ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-bg-secondary text-text-primary"}`,
              children: [
                thumb ? /* @__PURE__ */ jsx12(
                  "img",
                  {
                    src: thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`,
                    alt: label,
                    className: "w-5 h-5 object-cover rounded shrink-0"
                  }
                ) : /* @__PURE__ */ jsx12(Layers4, { className: "size-3 text-text-muted shrink-0" }),
                /* @__PURE__ */ jsx12("span", { className: "truncate", children: label })
              ]
            },
            eid
          );
        }) })
      ] }, state.state_id);
    }) }) : /* @__PURE__ */ jsx12("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ jsxs12("div", { className: "text-center px-4", children: [
      /* @__PURE__ */ jsx12(Layers4, { className: "size-8 mx-auto mb-2 opacity-30" }),
      /* @__PURE__ */ jsx12("p", { className: "text-xs", children: "Select a state to see its elements" })
    ] }) }) }),
    /* @__PURE__ */ jsxs12("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2 px-3 py-1.5 border-b border-border-secondary bg-bg-primary shrink-0", children: [
        /* @__PURE__ */ jsx12(
          "button",
          {
            className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary disabled:opacity-30",
            onClick: handlePrev,
            disabled: currentIndex === 0,
            title: "Previous capture",
            children: /* @__PURE__ */ jsx12(ChevronLeft, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsxs12("span", { className: "text-[10px] text-text-primary min-w-[70px] text-center", children: [
          currentIndex + 1,
          " / ",
          captureScreenshots.length
        ] }),
        /* @__PURE__ */ jsx12(
          "button",
          {
            className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary disabled:opacity-30",
            onClick: handleNext,
            disabled: currentIndex === captureScreenshots.length - 1,
            title: "Next capture",
            children: /* @__PURE__ */ jsx12(ChevronRight3, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsx12("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsx12(
            "button",
            {
              className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary",
              onClick: () => setUserZoom(Math.max(0.1, zoom - 0.25)),
              title: "Zoom out",
              children: /* @__PURE__ */ jsx12(ZoomOut2, { className: "size-3" })
            }
          ),
          /* @__PURE__ */ jsxs12("span", { className: "text-[10px] text-text-muted w-8 text-center", children: [
            Math.round(zoom * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsx12(
            "button",
            {
              className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary",
              onClick: () => setUserZoom(Math.min(3, zoom + 0.25)),
              title: "Zoom in",
              children: /* @__PURE__ */ jsx12(ZoomIn2, { className: "size-3" })
            }
          ),
          /* @__PURE__ */ jsx12(
            "button",
            {
              className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary",
              onClick: () => setUserZoom(null),
              title: "Fit to view",
              children: /* @__PURE__ */ jsx12(Maximize3, { className: "size-3" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs12("div", { ref: containerRef, className: "relative flex-1 bg-bg-secondary overflow-hidden", children: [
        /* @__PURE__ */ jsx12(
          "canvas",
          {
            ref: canvasRef,
            style: {
              width: canvasSize.width,
              height: canvasSize.height,
              cursor: hoveredElement ? "pointer" : "default"
            },
            onMouseMove: handleMouseMove,
            onMouseLeave: () => setHoveredElement(null),
            onClick: handleCanvasClick
          }
        ),
        isLoading && /* @__PURE__ */ jsx12("div", { className: "absolute inset-0 flex items-center justify-center bg-bg-secondary/50", children: /* @__PURE__ */ jsx12("div", { className: "animate-spin size-6 border-2 border-brand-primary border-t-transparent rounded-full" }) }),
        hoveredElement && hoveredElement !== selectedElementHash && /* @__PURE__ */ jsxs12("div", { className: "absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md max-w-[280px] pointer-events-none", children: [
          /* @__PURE__ */ jsx12("div", { className: "font-medium text-text-primary truncate", children: (() => {
            const entry = hashToElement.get(hoveredElement);
            return entry ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state) : hoveredElement;
          })() }),
          (() => {
            const fp = fingerprintDetails?.[hoveredElement];
            if (!fp) return null;
            return /* @__PURE__ */ jsxs12("div", { className: "text-text-muted mt-0.5", children: [
              "<",
              fp.tagName,
              ">",
              fp.role ? ` role="${fp.role}"` : ""
            ] });
          })()
        ] }),
        selectedElementHash && /* @__PURE__ */ jsx12("div", { className: "absolute bottom-2 left-2 right-2 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md", children: /* @__PURE__ */ jsxs12("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxs12("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx12("div", { className: "font-medium text-text-primary truncate", children: (() => {
              const entry = hashToElement.get(selectedElementHash);
              return entry ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state) : selectedElementHash;
            })() }),
            selectedFp && /* @__PURE__ */ jsxs12("div", { className: "text-[10px] text-text-muted mt-0.5", children: [
              "<",
              selectedFp.tagName,
              ">",
              selectedFp.role ? ` role="${selectedFp.role}"` : "",
              selectedFp.positionZone ? ` \xB7 ${selectedFp.positionZone}` : ""
            ] }),
            elementBounds[selectedElementHash] && /* @__PURE__ */ jsxs12("div", { className: "text-[10px] text-text-muted mt-0.5", children: [
              Math.round(elementBounds[selectedElementHash].x),
              ", ",
              Math.round(elementBounds[selectedElementHash].y),
              " \xB7 ",
              Math.round(elementBounds[selectedElementHash].width),
              "\xD7",
              Math.round(elementBounds[selectedElementHash].height)
            ] })
          ] }),
          elementThumbnails?.[selectedElementHash] && /* @__PURE__ */ jsx12(
            "img",
            {
              src: elementThumbnails[selectedElementHash].startsWith("data:") ? elementThumbnails[selectedElementHash] : `data:image/png;base64,${elementThumbnails[selectedElementHash]}`,
              alt: "Element thumbnail",
              className: "w-12 h-12 object-cover rounded border border-border-secondary shrink-0"
            }
          ),
          /* @__PURE__ */ jsx12(
            "button",
            {
              onClick: () => setSelectedElementHash(null),
              className: "text-text-muted hover:text-text-primary shrink-0",
              children: /* @__PURE__ */ jsx12(X, { className: "size-3.5" })
            }
          )
        ] }) }),
        !selectedElementHash && /* @__PURE__ */ jsx12("div", { className: "absolute bottom-2 right-2 text-[9px] text-text-muted bg-bg-primary/80 backdrop-blur-xs px-2 py-1 rounded border border-border-secondary/50", children: selectedStateIds.size > 0 ? `${Object.keys(elementBounds).filter((h) => selectedStateHashes.has(h)).length} / ${Object.keys(elementBounds).length} elements` : `${Object.keys(elementBounds).length} elements` })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { className: "w-48 border-l border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: [
      /* @__PURE__ */ jsx12("div", { className: "p-2 border-b border-border-secondary", children: /* @__PURE__ */ jsxs12("h4", { className: "text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: [
        "Screenshots ",
        selectedStateIds.size > 0 && `(${matchingScreenshotIndices.length})`
      ] }) }),
      /* @__PURE__ */ jsxs12("div", { className: "p-1.5 space-y-1.5", children: [
        matchingScreenshotIndices.map((idx) => {
          const cap = captureScreenshots[idx];
          const isCurrent = idx === currentIndex;
          return /* @__PURE__ */ jsxs12(
            "button",
            {
              onClick: () => setCurrentIndex(idx),
              className: `w-full rounded border-2 transition-colors overflow-hidden ${isCurrent ? "border-blue-500" : "border-transparent hover:border-border-secondary"}`,
              children: [
                thumbnailCache.has(cap.id) ? /* @__PURE__ */ jsx12(
                  "img",
                  {
                    src: thumbnailCache.get(cap.id),
                    alt: `Capture ${cap.captureIndex + 1}`,
                    className: "w-full h-auto object-cover",
                    style: { maxHeight: 100 }
                  }
                ) : /* @__PURE__ */ jsx12("div", { className: "w-full h-16 bg-bg-tertiary flex items-center justify-center", children: /* @__PURE__ */ jsx12(Image, { className: "size-4 text-text-muted opacity-30" }) }),
                /* @__PURE__ */ jsxs12("div", { className: "text-[9px] text-text-muted px-1 py-0.5 text-center truncate", children: [
                  "#",
                  cap.captureIndex + 1,
                  " \xB7 ",
                  new Date(cap.capturedAt).toLocaleTimeString()
                ] })
              ]
            },
            cap.id
          );
        }),
        matchingScreenshotIndices.length === 0 && /* @__PURE__ */ jsx12("p", { className: "text-[10px] text-text-muted text-center py-4", children: "No screenshots match selected state(s)" })
      ] })
    ] })
  ] });
}

// src/components/state-machine/StateViewPanel.tsx
import { Fragment as Fragment4, jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
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
  onRowClick
}) {
  const state = filteredStates[index];
  const colorIdx = states.indexOf(state);
  const color = STATE_COLORS3[colorIdx % STATE_COLORS3.length];
  const isSelected = viewMode === "screenshot" ? selectedStateIds.has(state.state_id) : state.state_id === effectiveSelectedStateId;
  const isExpanded = expandedStates.has(state.state_id);
  const stateOutgoing = transitionMap.outgoing.get(state.state_id) ?? [];
  const stateIncoming = transitionMap.incoming.get(state.state_id) ?? [];
  const isInitial = state.extra_metadata?.initial === true;
  const isBlocking = state.extra_metadata?.blocking === true;
  return /* @__PURE__ */ jsxs13("div", { style, ...ariaAttributes, children: [
    /* @__PURE__ */ jsxs13(
      "button",
      {
        "data-ui-id": `state-item-${state.state_id}`,
        onClick: (e) => onRowClick(state, e),
        className: `
          w-full text-left px-3 py-2 rounded-md transition-colors text-sm
          ${isSelected ? "bg-brand-primary/10 border border-brand-primary/30" : "hover:bg-bg-secondary border border-transparent"}
        `,
        children: [
          /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx13(
              "div",
              {
                className: "w-2.5 h-2.5 rounded-full shrink-0",
                style: { backgroundColor: color.border }
              }
            ),
            isInitial && /* @__PURE__ */ jsx13(Play5, { className: "size-3 text-yellow-500 fill-yellow-500 shrink-0" }),
            isBlocking && /* @__PURE__ */ jsx13(Lock2, { className: "size-3 text-amber-500 shrink-0" }),
            /* @__PURE__ */ jsx13("span", { className: "font-medium text-text-primary truncate flex-1", children: state.name }),
            isExpanded ? /* @__PURE__ */ jsx13(ChevronDown2, { className: "size-3 text-text-muted transition-transform" }) : /* @__PURE__ */ jsx13(ChevronRight4, { className: "size-3 text-text-muted transition-transform" })
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mt-1 ml-4.5 text-xs text-text-muted", children: [
            /* @__PURE__ */ jsxs13("span", { children: [
              state.element_ids.length,
              " elements"
            ] }),
            /* @__PURE__ */ jsxs13(
              "span",
              {
                className: Math.round(state.confidence * 100) >= 80 ? "text-green-400" : Math.round(state.confidence * 100) >= 50 ? "text-amber-400" : "text-red-400",
                children: [
                  Math.round(state.confidence * 100),
                  "%"
                ]
              }
            ),
            stateOutgoing.length > 0 && /* @__PURE__ */ jsxs13("span", { className: "text-brand-secondary flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsx13(ArrowUpRight2, { className: "size-2" }),
              stateOutgoing.length
            ] }),
            stateIncoming.length > 0 && /* @__PURE__ */ jsxs13("span", { className: "text-brand-primary flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsx13(ArrowDownLeft2, { className: "size-2" }),
              stateIncoming.length
            ] })
          ] })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxs13("div", { className: "ml-5 pl-2 border-l border-border-secondary mt-1 mb-2 space-y-0.5", children: [
      state.element_ids.slice(0, 20).map((eid) => {
        const prefix = getElementTypePrefix3(eid);
        const label = resolveElementLabel(eid, fingerprintDetails, state);
        const Icon = ELEMENT_ICONS[prefix] ?? Layers5;
        const stateCount = sharedElements.get(eid)?.length ?? 1;
        return /* @__PURE__ */ jsxs13(
          "div",
          {
            className: "text-[10px] text-text-muted flex items-center gap-1 py-0.5 px-1 rounded hover:bg-bg-secondary",
            title: `${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`,
            children: [
              /* @__PURE__ */ jsx13(Icon, { className: "size-2.5 shrink-0" }),
              /* @__PURE__ */ jsx13("span", { className: "truncate flex-1", children: label }),
              stateCount > 1 && /* @__PURE__ */ jsx13("span", { className: "text-[8px] text-brand-primary bg-brand-primary/10 px-1 rounded-full shrink-0", children: stateCount })
            ]
          },
          eid
        );
      }),
      state.element_ids.length > 20 && /* @__PURE__ */ jsxs13("div", { className: "text-[10px] text-text-muted py-0.5 px-1", children: [
        "+",
        state.element_ids.length - 20,
        " more"
      ] })
    ] })
  ] });
}
function StateViewPanel({
  states,
  transitions,
  selectedStateId,
  onSelectState,
  elementThumbnails,
  fingerprintDetails,
  captureScreenshots,
  onLoadScreenshotImage
}) {
  const [expandedStates, setExpandedStates] = useState10(/* @__PURE__ */ new Set());
  const [searchFilter, setSearchFilter] = useState10("");
  const [viewMode, setViewMode] = useState10(
    captureScreenshots && captureScreenshots.length > 0 ? "screenshot" : "list"
  );
  const [hasAutoSwitched, setHasAutoSwitched] = useState10(
    () => !!(captureScreenshots && captureScreenshots.length > 0)
  );
  useEffect9(() => {
    if (!hasAutoSwitched && captureScreenshots && captureScreenshots.length > 0) {
      setViewMode("screenshot");
      setHasAutoSwitched(true);
    }
  }, [captureScreenshots, hasAutoSwitched]);
  const [selectedStateIds, setSelectedStateIds] = useState10(/* @__PURE__ */ new Set());
  const effectiveSelectedStateId = selectedStateId;
  const selectedState = useMemo8(
    () => states.find((s) => s.state_id === effectiveSelectedStateId),
    [states, effectiveSelectedStateId]
  );
  const transitionMap = useMemo8(() => {
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const t of transitions) {
      for (const from of t.from_states) {
        if (!outgoing.has(from)) outgoing.set(from, []);
        outgoing.get(from).push(t);
      }
      for (const to of t.activate_states) {
        if (!incoming.has(to)) incoming.set(to, []);
        incoming.get(to).push(t);
      }
    }
    return { outgoing, incoming };
  }, [transitions]);
  const elementGroups = useMemo8(() => {
    if (!selectedState) return /* @__PURE__ */ new Map();
    const groups = /* @__PURE__ */ new Map();
    for (const eid of selectedState.element_ids) {
      const prefix = getElementTypePrefix3(eid);
      if (!groups.has(prefix)) groups.set(prefix, []);
      groups.get(prefix).push(eid);
    }
    return groups;
  }, [selectedState]);
  const sharedElements = useMemo8(() => {
    const elementStateMap = /* @__PURE__ */ new Map();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, []);
        elementStateMap.get(eid).push(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);
  const filteredStates = useMemo8(() => {
    if (!searchFilter) return states;
    const lower = searchFilter.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.state_id.toLowerCase().includes(lower) || s.element_ids.some((eid) => eid.toLowerCase().includes(lower))
    );
  }, [states, searchFilter]);
  const toggleExpanded = useCallback9((stateId) => {
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
  const handleRowClick = useCallback9(
    (state, e) => {
      const isSelected = viewMode === "screenshot" ? selectedStateIds.has(state.state_id) : state.state_id === effectiveSelectedStateId;
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
          isSelected ? /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set([state.state_id])
        );
        onSelectState(isSelected ? null : state.state_id);
      } else {
        onSelectState(isSelected ? null : state.state_id);
      }
      if (!isExpanded) toggleExpanded(state.state_id);
    },
    [viewMode, selectedStateIds, effectiveSelectedStateId, expandedStates, toggleExpanded, onSelectState]
  );
  useEffect9(() => {
    if (!effectiveSelectedStateId) return;
    const idx = filteredStates.findIndex(
      (s) => s.state_id === effectiveSelectedStateId
    );
    if (idx >= 0) {
      listRef.current?.scrollToRow({
        index: idx,
        align: "smart",
        behavior: "smooth"
      });
    }
  }, [effectiveSelectedStateId, filteredStates, listRef]);
  return /* @__PURE__ */ jsxs13("div", { className: "flex flex-1 h-full min-w-0", children: [
    /* @__PURE__ */ jsxs13("div", { className: "w-72 border-r border-border-secondary bg-bg-primary shrink-0 flex flex-col min-h-0", children: [
      /* @__PURE__ */ jsxs13("div", { className: "p-3 border-b border-border-secondary", children: [
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx13(Layers5, { className: "size-4 text-brand-primary" }),
          /* @__PURE__ */ jsx13("h3", { className: "text-sm font-semibold text-text-primary", children: "States" }),
          /* @__PURE__ */ jsx13("span", { className: "text-xs text-text-muted ml-auto", children: states.length })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxs13("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx13(Search2, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" }),
            /* @__PURE__ */ jsx13(
              "input",
              {
                type: "text",
                value: searchFilter,
                onChange: (e) => setSearchFilter(e.target.value),
                placeholder: "Filter states...",
                "aria-label": "Filter states...",
                className: "w-full text-xs h-7 pl-7 px-2 bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: "flex items-center border border-border-secondary rounded overflow-hidden", children: [
            /* @__PURE__ */ jsx13(
              "button",
              {
                onClick: () => setViewMode("list"),
                className: `p-1 ${viewMode === "list" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "List view",
                children: /* @__PURE__ */ jsx13(List, { className: "size-3.5" })
              }
            ),
            /* @__PURE__ */ jsx13(
              "button",
              {
                onClick: () => setViewMode("spatial"),
                className: `p-1 ${viewMode === "spatial" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "Spatial view",
                children: /* @__PURE__ */ jsx13(BarChart3, { className: "size-3.5" })
              }
            ),
            /* @__PURE__ */ jsx13(
              "button",
              {
                onClick: () => setViewMode("screenshot"),
                className: `p-1 ${viewMode === "screenshot" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "Screenshot view",
                disabled: !captureScreenshots || captureScreenshots.length === 0,
                children: /* @__PURE__ */ jsx13(Image2, { className: "size-3.5" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "flex-1 min-h-0 p-2", children: filteredStates.length === 0 ? /* @__PURE__ */ jsx13("p", { className: "text-xs text-text-muted text-center py-4", children: "No states match filter." }) : /* @__PURE__ */ jsx13(
        VirtualList,
        {
          listRef,
          rowCount: filteredStates.length,
          rowHeight: dynamicRowHeight,
          rowComponent: StateRow,
          rowProps: {
            filteredStates,
            states,
            transitionMap,
            sharedElements,
            fingerprintDetails,
            expandedStates,
            effectiveSelectedStateId,
            viewMode,
            selectedStateIds,
            onRowClick: handleRowClick
          },
          overscanCount: 5,
          style: { width: "100%", height: "100%" }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx13("div", { className: "flex-1 overflow-hidden", children: viewMode === "screenshot" && captureScreenshots && onLoadScreenshotImage ? /* @__PURE__ */ jsx13(
      ScreenshotStateView,
      {
        captureScreenshots,
        onLoadScreenshotImage,
        states,
        selectedStateIds,
        fingerprintDetails,
        elementThumbnails
      }
    ) : viewMode === "spatial" ? /* @__PURE__ */ jsx13(
      SpatialCanvas,
      {
        states,
        transitions,
        selectedStateId: effectiveSelectedStateId,
        onSelectState
      }
    ) : selectedState ? /* @__PURE__ */ jsxs13("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
      /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx13("h2", { className: "text-lg font-semibold text-text-primary", children: selectedState.name }),
          selectedState.extra_metadata?.initial === true && /* @__PURE__ */ jsxs13("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-yellow-500/20 text-yellow-400 border-yellow-500/30", children: [
            /* @__PURE__ */ jsx13(Play5, { className: "size-2.5 fill-current" }),
            "Initial"
          ] }),
          selectedState.extra_metadata?.blocking === true && /* @__PURE__ */ jsxs13("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-amber-500/20 text-amber-400 border-amber-500/30", children: [
            /* @__PURE__ */ jsx13(Lock2, { className: "size-2.5" }),
            "Blocking"
          ] })
        ] }),
        selectedState.description && /* @__PURE__ */ jsx13("p", { className: "text-sm text-text-muted mt-1", children: selectedState.description }),
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-3 mt-2 text-xs text-text-muted", children: [
          /* @__PURE__ */ jsxs13("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            selectedState.element_ids.length,
            " elements"
          ] }),
          /* @__PURE__ */ jsxs13("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            selectedState.render_ids.length,
            " renders"
          ] }),
          /* @__PURE__ */ jsxs13(
            "span",
            {
              className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border ${Math.round(selectedState.confidence * 100) >= 80 ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`,
              children: [
                Math.round(selectedState.confidence * 100),
                "% confidence"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsx13("h3", { className: "text-sm font-medium text-text-primary mb-3", children: "Elements by Type" }),
        /* @__PURE__ */ jsx13("div", { className: "space-y-3", children: Array.from(elementGroups.entries()).map(
          ([prefix, elements]) => {
            const Icon = ELEMENT_ICONS[prefix] ?? Layers5;
            const colorClass = ELEMENT_COLORS[prefix] ?? "border-gray-400 bg-gray-500/10 text-gray-300";
            return /* @__PURE__ */ jsxs13("div", { children: [
              /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mb-1.5", children: [
                /* @__PURE__ */ jsx13(Icon, { className: "size-3.5" }),
                /* @__PURE__ */ jsx13("span", { className: "text-xs font-medium text-text-primary capitalize", children: prefix }),
                /* @__PURE__ */ jsxs13("span", { className: "text-xs text-text-muted", children: [
                  "(",
                  elements.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx13("div", { className: "flex flex-wrap gap-1.5", children: elements.map((eid) => {
                const stateCount = sharedElements.get(eid)?.length ?? 1;
                const rawLabel = getElementLabel4(eid);
                const descriptiveLabel = resolveElementLabel(eid, fingerprintDetails, selectedState);
                const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[rawLabel];
                return /* @__PURE__ */ jsx13(
                  "div",
                  {
                    className: `rounded border ${colorClass} overflow-hidden ${thumb ? "flex flex-col items-center w-16" : "text-[11px] px-2 py-0.5 inline-flex items-center gap-1"}`,
                    title: `${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`,
                    children: thumb ? /* @__PURE__ */ jsxs13(Fragment4, { children: [
                      /* @__PURE__ */ jsxs13("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx13(
                          "img",
                          {
                            src: thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`,
                            alt: descriptiveLabel,
                            className: "w-12 h-12 object-cover"
                          }
                        ),
                        stateCount > 1 && /* @__PURE__ */ jsxs13("span", { className: "absolute -top-1 -right-1 text-[7px] bg-brand-primary/90 text-white px-1 rounded-full leading-tight", children: [
                          "x",
                          stateCount
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx13("span", { className: "text-[8px] text-center px-0.5 py-0.5 truncate w-full leading-tight", children: descriptiveLabel })
                    ] }) : /* @__PURE__ */ jsxs13(Fragment4, { children: [
                      descriptiveLabel,
                      stateCount > 1 && /* @__PURE__ */ jsxs13("span", { className: "text-[8px] opacity-70 bg-white/10 px-0.5 rounded", children: [
                        "x",
                        stateCount
                      ] })
                    ] })
                  },
                  eid
                );
              }) })
            ] }, prefix);
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx13(
        StateLayoutView,
        {
          state: selectedState,
          elementThumbnails,
          fingerprintDetails
        }
      ),
      /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsx13("h3", { className: "text-sm font-medium text-text-primary mb-3", children: "Transitions" }),
        /* @__PURE__ */ jsxs13("div", { className: "space-y-2", children: [
          (transitionMap.outgoing.get(selectedState.state_id) ?? []).map(
            (t) => /* @__PURE__ */ jsxs13(
              "div",
              {
                className: "flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary",
                children: [
                  /* @__PURE__ */ jsx13(ArrowRight4, { className: "size-3 text-brand-secondary shrink-0" }),
                  /* @__PURE__ */ jsx13("span", { className: "font-medium text-text-primary", children: t.name }),
                  t.actions.length > 0 && /* @__PURE__ */ jsx13("span", { className: "flex items-center gap-0.5 shrink-0", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((actionType) => {
                    const ActionIcon = ACTION_ICONS3[actionType];
                    return ActionIcon ? /* @__PURE__ */ jsx13(
                      ActionIcon,
                      {
                        className: `size-2.5 ${getActionTypeColor(actionType)}`
                      },
                      actionType
                    ) : null;
                  }) }),
                  /* @__PURE__ */ jsx13(ArrowRight4, { className: "size-2.5 text-text-muted" }),
                  /* @__PURE__ */ jsx13("span", { className: "text-text-muted truncate", children: t.activate_states.map(
                    (sid) => states.find((s) => s.state_id === sid)?.name ?? sid
                  ).join(", ") }),
                  t.actions.length > 0 && /* @__PURE__ */ jsxs13("span", { className: "text-text-muted ml-auto text-[10px] shrink-0", children: [
                    t.actions.length,
                    " action",
                    t.actions.length !== 1 ? "s" : ""
                  ] }),
                  t.stays_visible && /* @__PURE__ */ jsx13(Eye3, { className: "size-3 text-green-400 shrink-0" })
                ]
              },
              `out-${t.transition_id}`
            )
          ),
          (transitionMap.incoming.get(selectedState.state_id) ?? []).map(
            (t) => /* @__PURE__ */ jsxs13(
              "div",
              {
                className: "flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary",
                children: [
                  /* @__PURE__ */ jsx13(CheckCircle, { className: "size-3 text-brand-primary shrink-0" }),
                  /* @__PURE__ */ jsx13("span", { className: "font-medium text-text-primary", children: t.name }),
                  t.actions.length > 0 && /* @__PURE__ */ jsx13("span", { className: "flex items-center gap-0.5 shrink-0", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((actionType) => {
                    const ActionIcon = ACTION_ICONS3[actionType];
                    return ActionIcon ? /* @__PURE__ */ jsx13(
                      ActionIcon,
                      {
                        className: `size-2.5 ${getActionTypeColor(actionType)}`
                      },
                      actionType
                    ) : null;
                  }) }),
                  /* @__PURE__ */ jsxs13("span", { className: "text-text-muted truncate", children: [
                    "from",
                    " ",
                    t.from_states.map(
                      (sid) => states.find((s) => s.state_id === sid)?.name ?? sid
                    ).join(", ")
                  ] })
                ]
              },
              `in-${t.transition_id}`
            )
          ),
          (transitionMap.outgoing.get(selectedState.state_id) ?? []).length === 0 && (transitionMap.incoming.get(selectedState.state_id) ?? []).length === 0 && /* @__PURE__ */ jsx13("p", { className: "text-xs text-text-muted", children: "No transitions connected." })
        ] })
      ] }),
      selectedState.acceptance_criteria.length > 0 && /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsx13("h3", { className: "text-sm font-medium text-text-primary mb-2", children: "Acceptance Criteria" }),
        /* @__PURE__ */ jsx13("ul", { className: "space-y-1", children: selectedState.acceptance_criteria.map((criteria, i) => /* @__PURE__ */ jsxs13(
          "li",
          {
            className: "text-xs text-text-muted flex items-start gap-1.5",
            children: [
              /* @__PURE__ */ jsx13(CheckCircle, { className: "size-3 text-green-500 mt-0.5 shrink-0" }),
              criteria
            ]
          },
          `${i}-${criteria}`
        )) })
      ] }),
      selectedState.domain_knowledge.length > 0 && /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsxs13("h3", { className: "text-sm font-medium text-text-primary mb-2", children: [
          /* @__PURE__ */ jsx13(BookOpen, { className: "size-3.5 inline mr-1" }),
          "Domain Knowledge"
        ] }),
        /* @__PURE__ */ jsx13("div", { className: "space-y-2", children: selectedState.domain_knowledge.map((dk) => /* @__PURE__ */ jsxs13(
          "div",
          {
            className: "p-3 rounded-lg bg-bg-secondary border border-border-secondary",
            children: [
              /* @__PURE__ */ jsx13("div", { className: "text-xs font-medium text-text-primary", children: dk.title }),
              /* @__PURE__ */ jsx13("div", { className: "text-[10px] text-text-muted mt-1 line-clamp-3", children: dk.content }),
              dk.tags.length > 0 && /* @__PURE__ */ jsx13("div", { className: "flex flex-wrap gap-1 mt-1.5", children: dk.tags.map((tag) => /* @__PURE__ */ jsx13(
                "span",
                {
                  className: "text-[9px] px-1.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary",
                  children: tag
                },
                tag
              )) })
            ]
          },
          dk.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs13("div", { className: "text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary", children: [
        /* @__PURE__ */ jsxs13("div", { children: [
          "State ID:",
          " ",
          /* @__PURE__ */ jsx13("code", { className: "bg-bg-secondary px-1 rounded", children: selectedState.state_id })
        ] }),
        /* @__PURE__ */ jsxs13("div", { children: [
          "Created:",
          " ",
          new Date(selectedState.created_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxs13("div", { children: [
          "Updated:",
          " ",
          new Date(selectedState.updated_at).toLocaleDateString()
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsx13("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ jsxs13("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx13(Layers5, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsx13("p", { className: "text-sm", children: "Select a state to view its details" }),
      /* @__PURE__ */ jsxs13("p", { className: "text-xs mt-1 text-text-muted/70", children: [
        states.length,
        " state",
        states.length !== 1 ? "s" : "",
        " available"
      ] })
    ] }) }) })
  ] });
}

// src/components/state-machine/PathfindingPanel.tsx
import { useState as useState11, useCallback as useCallback10 } from "react";
import {
  findPath
} from "@qontinui/workflow-utils";
import { Fragment as Fragment5, jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
function PathfindingPanel({
  states,
  transitions,
  onPathFound,
  onFindPath
}) {
  const [fromStateId, setFromStateId] = useState11("");
  const [targetStateId, setTargetStateId] = useState11("");
  const [algorithm, setAlgorithm] = useState11("dijkstra");
  const [result, setResult] = useState11(null);
  const [isSearching, setIsSearching] = useState11(false);
  const handleFind = useCallback10(async () => {
    if (!fromStateId || !targetStateId) return;
    setIsSearching(true);
    try {
      let pathResult;
      if (onFindPath) {
        pathResult = await onFindPath([fromStateId], [targetStateId]);
      } else {
        pathResult = findPath(
          transitions,
          { from_states: [fromStateId], target_states: [targetStateId] },
          algorithm
        );
      }
      setResult(pathResult);
      onPathFound?.(pathResult);
    } finally {
      setIsSearching(false);
    }
  }, [
    fromStateId,
    targetStateId,
    algorithm,
    transitions,
    onFindPath,
    onPathFound
  ]);
  const clearResult = useCallback10(() => {
    setResult(null);
    onPathFound?.({ found: false, steps: [], total_cost: 0 });
  }, [onPathFound]);
  const stateName = (stateId) => states.find((s) => s.state_id === stateId)?.name ?? stateId;
  return /* @__PURE__ */ jsxs14("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsx14("h3", { className: "text-sm font-semibold text-text-primary", children: "Pathfinding" }),
    /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("label", { className: "block text-xs text-text-secondary mb-1", children: "From" }),
        /* @__PURE__ */ jsxs14(
          "select",
          {
            value: fromStateId,
            onChange: (e) => setFromStateId(e.target.value),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
            style: { colorScheme: "dark" },
            children: [
              /* @__PURE__ */ jsx14("option", { value: "", children: "Select state..." }),
              states.map((s) => /* @__PURE__ */ jsx14("option", { value: s.state_id, children: s.name }, s.state_id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("label", { className: "block text-xs text-text-secondary mb-1", children: "To" }),
        /* @__PURE__ */ jsxs14(
          "select",
          {
            value: targetStateId,
            onChange: (e) => setTargetStateId(e.target.value),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
            style: { colorScheme: "dark" },
            children: [
              /* @__PURE__ */ jsx14("option", { value: "", children: "Select state..." }),
              states.map((s) => /* @__PURE__ */ jsx14("option", { value: s.state_id, children: s.name }, s.state_id))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs14("div", { className: "flex gap-2", children: [
      !onFindPath && /* @__PURE__ */ jsxs14(
        "select",
        {
          value: algorithm,
          onChange: (e) => setAlgorithm(e.target.value),
          className: "px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
          style: { colorScheme: "dark" },
          children: [
            /* @__PURE__ */ jsx14("option", { value: "dijkstra", children: "Dijkstra (cheapest)" }),
            /* @__PURE__ */ jsx14("option", { value: "bfs", children: "BFS (shortest)" })
          ]
        }
      ),
      /* @__PURE__ */ jsx14(
        "button",
        {
          onClick: handleFind,
          disabled: !fromStateId || !targetStateId || isSearching,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: /* @__PURE__ */ jsx14("span", { children: isSearching ? "Searching..." : "Find Path" })
        }
      ),
      result && /* @__PURE__ */ jsx14(
        "button",
        {
          onClick: clearResult,
          className: "px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border-secondary rounded",
          children: "Clear"
        }
      )
    ] }),
    result && /* @__PURE__ */ jsx14("div", { className: "border-t border-border-secondary pt-3", children: result.found ? /* @__PURE__ */ jsxs14(Fragment5, { children: [
      /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs14("span", { className: "text-xs text-green-400 font-medium", children: [
          "Path found (",
          result.steps.length,
          " step",
          result.steps.length !== 1 ? "s" : "",
          ")"
        ] }),
        /* @__PURE__ */ jsxs14("span", { className: "text-xs text-text-secondary", children: [
          "Total cost: ",
          result.total_cost.toFixed(1)
        ] })
      ] }),
      result.steps.length === 0 ? /* @__PURE__ */ jsx14("p", { className: "text-xs text-text-secondary italic", children: "Already at target state" }) : /* @__PURE__ */ jsx14("div", { className: "space-y-1.5", children: result.steps.map((step, i) => /* @__PURE__ */ jsxs14(
        "div",
        {
          className: "p-2 bg-bg-tertiary border border-border-secondary rounded text-xs",
          children: [
            /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs14("span", { className: "font-medium text-text-primary", children: [
                i + 1,
                ". ",
                step.transition_name
              ] }),
              /* @__PURE__ */ jsxs14("span", { className: "text-text-secondary", children: [
                "cost: ",
                step.path_cost.toFixed(1)
              ] })
            ] }),
            /* @__PURE__ */ jsxs14("div", { className: "mt-1 text-text-secondary", children: [
              step.from_states.map(stateName).join(", "),
              " \u2192 ",
              step.activate_states.map(stateName).join(", "),
              step.exit_states.length > 0 && /* @__PURE__ */ jsxs14("span", { className: "text-red-400", children: [
                " (exits: ",
                step.exit_states.map(stateName).join(", "),
                ")"
              ] })
            ] })
          ]
        },
        `${i}-${step.transition_name}`
      )) })
    ] }) : /* @__PURE__ */ jsx14("div", { className: "text-xs text-red-400", children: result.error ?? "No path found between the specified states" }) })
  ] });
}

// src/components/state-machine/StateViewTable.tsx
import { useState as useState12, useMemo as useMemo9 } from "react";
import {
  getElementTypeStyle as getElementTypeStyle2,
  getElementTypePrefix as getElementTypePrefix4,
  getConfidenceColor as getConfidenceColor2
} from "@qontinui/workflow-utils";
import { jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
function StateViewTable({
  states,
  selectedStateId,
  onSelectState
}) {
  const [filter, setFilter] = useState12("");
  const filteredStates = useMemo9(() => {
    if (!filter.trim()) return states;
    const q = filter.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(q) || s.element_ids.some((eid) => eid.toLowerCase().includes(q))
    );
  }, [states, filter]);
  return /* @__PURE__ */ jsxs15("div", { className: "flex flex-col gap-3 p-4", children: [
    /* @__PURE__ */ jsx15("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs15("h3", { className: "text-sm font-semibold text-text-primary", children: [
      "States (",
      states.length,
      ")"
    ] }) }),
    /* @__PURE__ */ jsx15(
      "input",
      {
        type: "text",
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        placeholder: "Filter by name or element ID...",
        className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1", children: [
      filteredStates.map((state) => {
        const isSelected = state.state_id === selectedStateId;
        const confidenceColor = getConfidenceColor2(state.confidence);
        const confidencePct = Math.round(state.confidence * 100);
        const typeCounts = /* @__PURE__ */ new Map();
        for (const eid of state.element_ids) {
          const prefix = getElementTypePrefix4(eid);
          typeCounts.set(prefix, (typeCounts.get(prefix) ?? 0) + 1);
        }
        const sortedTypes = Array.from(typeCounts.entries()).sort(
          (a, b) => b[1] - a[1]
        );
        return /* @__PURE__ */ jsxs15(
          "button",
          {
            onClick: () => onSelectState(isSelected ? null : state.state_id),
            className: `w-full text-left p-2.5 rounded border transition-colors ${isSelected ? "bg-brand-primary/10 border-brand-primary/30" : "bg-bg-tertiary border-border-secondary hover:border-text-muted"}`,
            children: [
              /* @__PURE__ */ jsxs15("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsx15("span", { className: "text-sm font-medium text-text-primary truncate", children: state.name }),
                /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2 text-xs shrink-0 ml-2", children: [
                  /* @__PURE__ */ jsxs15("span", { className: "text-text-secondary", children: [
                    state.element_ids.length,
                    " el"
                  ] }),
                  /* @__PURE__ */ jsxs15("span", { className: confidenceColor, children: [
                    confidencePct,
                    "%"
                  ] })
                ] })
              ] }),
              sortedTypes.length > 0 && /* @__PURE__ */ jsxs15("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                sortedTypes.slice(0, 5).map(([prefix, count]) => {
                  const style = getElementTypeStyle2(`${prefix}:dummy`);
                  return /* @__PURE__ */ jsxs15(
                    "span",
                    {
                      className: `px-1.5 py-0.5 text-[10px] rounded border ${style.bg} ${style.text} ${style.border}`,
                      children: [
                        prefix,
                        ": ",
                        count
                      ]
                    },
                    prefix
                  );
                }),
                sortedTypes.length > 5 && /* @__PURE__ */ jsxs15("span", { className: "px-1 py-0.5 text-[10px] text-text-muted", children: [
                  "+",
                  sortedTypes.length - 5,
                  " more"
                ] })
              ] }),
              state.description && /* @__PURE__ */ jsx15("p", { className: "text-xs text-text-secondary mt-1 line-clamp-1", children: state.description })
            ]
          },
          state.state_id
        );
      }),
      filteredStates.length === 0 && /* @__PURE__ */ jsx15("p", { className: "text-xs text-text-muted italic text-center py-4", children: filter ? "No states match the filter" : "No states in this config" })
    ] })
  ] });
}

// src/components/state-machine/DiagramTab.tsx
import { useEffect as useEffect10, useRef as useRef7, useState as useState13 } from "react";
import { RefreshCw as RefreshCw2, Loader2, Workflow } from "lucide-react";
import { jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
function DiagramTab({
  activeStateIds,
  diagramSource,
  isLoading,
  onRefresh,
  unavailableReason
}) {
  const containerRef = useRef7(null);
  const [importError, setImportError] = useState13(null);
  const [renderError, setRenderError] = useState13(null);
  useEffect10(() => {
    if (unavailableReason) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      setRenderError(null);
      return;
    }
    if (!diagramSource || !diagramSource.trim()) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      setRenderError(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const specifier = "mermaid";
      const mod = await import(
        /* @vite-ignore */
        specifier
      ).catch(
        (e) => {
          if (!cancelled) {
            setImportError(
              e instanceof Error ? e.message : "Failed to load `mermaid`"
            );
          }
          return null;
        }
      );
      if (cancelled || !mod) return;
      setImportError(null);
      const mermaid = mod.default;
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict"
        });
        const id = `qontinui-sm-diagram-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagramSource);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        setRenderError(null);
      } catch (e) {
        if (cancelled) return;
        setRenderError(e instanceof Error ? e.message : String(e));
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diagramSource, unavailableReason]);
  const hasSource = !!diagramSource && diagramSource.trim().length > 0;
  return /* @__PURE__ */ jsxs16("div", { className: "flex flex-col h-full w-full", children: [
    /* @__PURE__ */ jsxs16("div", { className: "flex items-center justify-between px-6 py-3 border-b border-border-primary bg-surface-primary", children: [
      /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx16(Workflow, { className: "size-4 text-brand-primary" }),
        /* @__PURE__ */ jsx16("h2", { className: "text-sm font-semibold text-text-primary", children: "State Machine Diagram" }),
        activeStateIds && activeStateIds.length > 0 && /* @__PURE__ */ jsxs16("span", { className: "text-xs text-text-muted ml-2", children: [
          "(highlighting ",
          activeStateIds.length,
          " hypothetical active state",
          activeStateIds.length === 1 ? "" : "s",
          ")"
        ] })
      ] }),
      onRefresh && /* @__PURE__ */ jsxs16(
        "button",
        {
          type: "button",
          onClick: onRefresh,
          disabled: isLoading,
          className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border border-border-primary text-text-primary hover:bg-surface-secondary disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx16(
              RefreshCw2,
              {
                className: `size-3.5 ${isLoading ? "animate-spin" : ""}`
              }
            ),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs16("div", { className: "flex-1 min-h-0 overflow-auto p-6 bg-surface-secondary", children: [
      unavailableReason && /* @__PURE__ */ jsx16("div", { className: "flex items-center justify-center h-full text-text-muted text-sm text-center px-6", children: unavailableReason }),
      !unavailableReason && isLoading && /* @__PURE__ */ jsxs16("div", { className: "flex items-center justify-center h-full text-text-muted gap-2", children: [
        /* @__PURE__ */ jsx16(Loader2, { className: "size-4 animate-spin" }),
        "Loading diagram\u2026"
      ] }),
      !unavailableReason && !isLoading && importError && /* @__PURE__ */ jsxs16("div", { className: "max-w-xl mx-auto p-4 border border-border-primary rounded-md bg-surface-primary text-sm text-text-primary", children: [
        /* @__PURE__ */ jsx16("p", { className: "font-semibold mb-1", children: "Mermaid is not available in this bundle." }),
        /* @__PURE__ */ jsxs16("p", { className: "text-text-muted", children: [
          "Install ",
          /* @__PURE__ */ jsx16("code", { className: "font-mono", children: "mermaid" }),
          " (e.g.",
          " ",
          /* @__PURE__ */ jsx16("code", { className: "font-mono", children: "npm install mermaid" }),
          ") to enable the Diagram tab."
        ] }),
        /* @__PURE__ */ jsxs16("p", { className: "text-xs text-text-muted mt-2", children: [
          "Import error: ",
          importError
        ] })
      ] }),
      !unavailableReason && !isLoading && !importError && !hasSource && /* @__PURE__ */ jsx16("div", { className: "flex items-center justify-center h-full text-text-muted", children: "No diagram available" }),
      !unavailableReason && !isLoading && !importError && hasSource && renderError && /* @__PURE__ */ jsxs16("div", { className: "max-w-xl mx-auto p-4 border border-border-primary rounded-md bg-surface-primary text-sm", children: [
        /* @__PURE__ */ jsx16("p", { className: "font-semibold mb-1 text-text-primary", children: "Failed to render diagram." }),
        /* @__PURE__ */ jsx16("pre", { className: "text-xs text-text-muted whitespace-pre-wrap", children: renderError })
      ] }),
      /* @__PURE__ */ jsx16(
        "div",
        {
          ref: containerRef,
          className: "mermaid-diagram flex items-center justify-center",
          style: {
            display: hasSource && !importError && !unavailableReason ? void 0 : "none"
          }
        }
      )
    ] })
  ] });
}
export {
  ChunkOverviewNode,
  ChunkPortNode,
  ChunkedGraphView,
  DiagramTab,
  PathfindingPanel,
  StateDetailPanel,
  StateMachineGraphView,
  StateMachineStateNode,
  StateMachineTransitionEdge,
  StateViewPanel,
  StateViewTable,
  TransitionEditor,
  TransitionsPanel
};
//# sourceMappingURL=index.js.map