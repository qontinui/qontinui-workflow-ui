"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/state-machine/index.ts
var state_machine_exports = {};
__export(state_machine_exports, {
  ChunkOverviewNode: () => ChunkOverviewNode,
  ChunkPortNode: () => ChunkPortNode,
  ChunkedGraphView: () => ChunkedGraphView,
  DiagramTab: () => DiagramTab,
  PathfindingPanel: () => PathfindingPanel,
  StateDetailPanel: () => StateDetailPanel,
  StateMachineGraphView: () => StateMachineGraphView,
  StateMachineStateNode: () => StateMachineStateNode,
  StateMachineTransitionEdge: () => StateMachineTransitionEdge,
  StateViewPanel: () => StateViewPanel,
  StateViewTable: () => StateViewTable,
  TransitionEditor: () => TransitionEditor,
  TransitionsPanel: () => TransitionsPanel
});
module.exports = __toCommonJS(state_machine_exports);

// src/components/state-machine/StateMachineGraphView.tsx
var import_react11 = require("react");
var import_react12 = require("@xyflow/react");
var import_lucide_react6 = require("lucide-react");
var import_workflow_utils2 = require("@qontinui/workflow-utils");

// src/components/state-machine/StateMachineStateNode.tsx
var import_react = require("react");
var import_react2 = require("@xyflow/react");
var import_lucide_react = require("lucide-react");
var import_jsx_runtime = require("react/jsx-runtime");
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
  testid: { icon: import_lucide_react.Hash, color: "text-blue-400", tileBg: "bg-blue-500/10", tileBorder: "border-blue-500/20", hoverBg: "hover:bg-blue-500/30" },
  role: { icon: import_lucide_react.MousePointer, color: "text-green-400", tileBg: "bg-green-500/10", tileBorder: "border-green-500/20", hoverBg: "hover:bg-green-500/30" },
  text: { icon: import_lucide_react.Type, color: "text-amber-400", tileBg: "bg-amber-500/10", tileBorder: "border-amber-500/20", hoverBg: "hover:bg-amber-500/30" },
  ui: { icon: import_lucide_react.Box, color: "text-purple-400", tileBg: "bg-purple-500/10", tileBorder: "border-purple-500/20", hoverBg: "hover:bg-purple-500/30" },
  url: { icon: import_lucide_react.Globe, color: "text-cyan-400", tileBg: "bg-cyan-500/10", tileBorder: "border-cyan-500/20", hoverBg: "hover:bg-cyan-500/30" },
  nav: { icon: import_lucide_react.Globe, color: "text-cyan-400", tileBg: "bg-cyan-500/10", tileBorder: "border-cyan-500/20", hoverBg: "hover:bg-cyan-500/30" },
  other: { icon: import_lucide_react.Layers, color: "text-gray-400", tileBg: "bg-gray-500/10", tileBorder: "border-gray-500/20", hoverBg: "hover:bg-gray-500/30" }
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
  const elementSummary = (0, import_react.useMemo)(() => summarizeElementTypes(elementIds), [elementIds]);
  const hasConnections = (outgoingCount ?? 0) > 0 || (incomingCount ?? 0) > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: cardSize.cardWidth }, "data-id": stateId, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react2.Handle,
      {
        type: "target",
        position: import_react2.Position.Top,
        className: `!w-3 !h-3 !border-2 !border-bg-primary ${isSelected ? "!bg-brand-primary !shadow-sm !shadow-brand-primary/40" : "!bg-brand-primary"}`
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: `
          rounded-lg border-2 px-3 py-2.5 shadow-md
          transition-all duration-150 relative
          ${isDropTarget ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/40 shadow-green-500/20 shadow-lg" : isSelected ? "border-brand-primary bg-bg-secondary ring-2 ring-brand-primary/30 shadow-brand-primary/20 shadow-lg" : isBlocking ? "border-amber-400 bg-amber-950/20 shadow-amber-500/10" : "border-border-secondary bg-bg-primary hover:border-brand-primary/50 hover:shadow-lg"}
        `,
        children: [
          isDropTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-lg bg-green-500/5 pointer-events-none z-0" }),
          isInitial && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 -left-3 z-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-0.5 bg-[#FFD700] text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-yellow-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Play, { className: "size-2.5 fill-current" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "START" })
          ] }) }),
          (outgoingCount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-2 -right-2 z-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "flex items-center gap-0.5 bg-brand-secondary/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm",
              title: `${outgoingCount} outgoing`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowUpRight, { className: "size-2" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: outgoingCount })
              ]
            }
          ) }),
          (incomingCount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-2 -right-2 z-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "flex items-center gap-0.5 bg-brand-primary/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm",
              title: `${incomingCount} incoming`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowDownLeft, { className: "size-2" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: incomingCount })
              ]
            }
          ) }),
          !hasConnections && elementIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-0.5 bg-bg-secondary/90 text-text-muted text-[7px] px-1.5 py-0.5 rounded-full shadow-sm border border-border-secondary", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Link2, { className: "size-2" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "no links" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mb-1 relative z-[1]", children: [
            isBlocking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { className: "size-3.5 text-amber-500 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Layers, { className: "size-3.5 text-brand-primary shrink-0" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-semibold text-text-primary truncate flex-1", children: name })
          ] }),
          description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-[10px] text-text-muted mb-1.5 line-clamp-2 relative z-[1]", children: description }),
          elementIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
                        thumbnailSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "img",
                          {
                            src: thumbnailSrc,
                            alt: style.label,
                            className: "w-full h-full object-contain rounded-sm",
                            draggable: false
                          }
                        ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col items-center justify-center h-full px-0.5 py-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `size-3.5 ${style.color} shrink-0` }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `text-[7px] ${style.color} truncate w-full text-center mt-0.5 leading-tight`, children: style.label })
                        ] }),
                        onStartElementDrag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "div",
                          {
                            className: "nodrag absolute top-0 right-0 p-0.5 opacity-0 group-hover:opacity-80 transition-opacity z-10",
                            title: "Drag to create transition",
                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.GripVertical, { className: "size-2.5 text-text-muted" })
                          }
                        )
                      ]
                    },
                    elementId
                  );
                }),
                elementIds.length > cardSize.maxElements && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "div",
                  {
                    className: "rounded-md bg-bg-secondary text-text-muted flex items-center justify-center border border-border-secondary",
                    style: { aspectRatio: "1 / 1" },
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[9px] font-medium", children: [
                      "+",
                      elementIds.length - cardSize.maxElements
                    ] })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between text-xs text-text-muted relative z-[1]", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "px-1.5 py-0.5 text-[10px] bg-bg-tertiary rounded border border-border-secondary", children: [
                elementCount,
                " el"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
            elementSummary.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center gap-1", children: elementSummary.slice(0, 4).map(({ prefix, count, color }) => {
              const Icon = getElementStyle(`${prefix}:x`).icon;
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: `flex items-center gap-0.5 text-[8px] ${color}`, title: `${count} ${prefix}`, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-2" }),
                count
              ] }, prefix);
            }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react2.Handle,
      {
        type: "source",
        position: import_react2.Position.Bottom,
        className: `!w-3 !h-3 !border-2 !border-bg-primary ${isSelected ? "!bg-brand-secondary !shadow-sm !shadow-brand-secondary/40" : "!bg-brand-secondary"}`
      }
    )
  ] });
}
var StateMachineStateNode = (0, import_react.memo)(StateMachineStateNodeInner);

// src/components/state-machine/StateMachineTransitionEdge.tsx
var import_react3 = require("react");
var import_react4 = require("@xyflow/react");
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ACTION_ICONS = {
  click: import_lucide_react2.MousePointer,
  type: import_lucide_react2.Type,
  select: import_lucide_react2.ListFilter,
  wait: import_lucide_react2.Clock,
  navigate: import_lucide_react2.Globe
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
  const [edgePath, labelX, labelY] = (0, import_react4.getBezierPath)({
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react4.BaseEdge,
      {
        path: edgePath,
        style: { stroke: "transparent", strokeWidth: 20, cursor: "pointer" }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react4.BaseEdge,
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
    edgeData?.name && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react4.EdgeLabelRenderer, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        className: "nodrag nopan pointer-events-auto cursor-pointer",
        style: {
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            className: `
                flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border shadow-xs
                transition-all duration-150
                ${isActive ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/20" : "bg-bg-primary/95 text-text-muted border-border-secondary hover:border-brand-primary/40 backdrop-blur-xs"}
              `,
            children: [
              uniqueActionTypes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "flex items-center gap-0.5", children: uniqueActionTypes.slice(0, 3).map((actionType) => {
                const Icon = ACTION_ICONS[actionType];
                const colorClass = isActive ? "" : ACTION_COLORS[actionType] ?? "text-gray-400";
                return Icon ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon, { className: `size-3 ${colorClass}` }, actionType) : null;
              }) }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "font-medium max-w-[120px] truncate", children: edgeData.name }),
              edgeData.firstActionTarget && !isActive && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "opacity-50 text-[8px] max-w-[60px] truncate", children: edgeData.firstActionTarget }),
              edgeData.pathCost !== 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "opacity-60 text-[9px]", children: [
                "cost:",
                edgeData.pathCost
              ] }),
              edgeData.actionCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `text-[8px] px-1 rounded-full ${isActive ? "bg-white/20" : "bg-bg-secondary"}`, children: edgeData.actionCount }),
              edgeData.staysVisible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react2.Eye, { className: `size-3 ${isActive ? "text-green-200" : "text-green-400"}` })
            ]
          }
        )
      }
    ) })
  ] });
}
var StateMachineTransitionEdge = (0, import_react3.memo)(StateMachineTransitionEdgeInner);

// src/components/state-machine/ChunkedGraphView.tsx
var import_react9 = require("react");
var import_react10 = require("@xyflow/react");
var import_lucide_react5 = require("lucide-react");
var import_workflow_utils = require("@qontinui/workflow-utils");

// src/components/state-machine/ChunkOverviewNode.tsx
var import_react5 = require("react");
var import_react6 = require("@xyflow/react");
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  const [isEditing, setIsEditing] = (0, import_react5.useState)(false);
  const [draft, setDraft] = (0, import_react5.useState)(effectiveName);
  const inputRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    if (!isEditing) setDraft(effectiveName);
  }, [effectiveName, isEditing]);
  (0, import_react5.useEffect)(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  const handleStartEdit = (0, import_react5.useCallback)(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!showRenameAffordance) return;
      setDraft(effectiveName);
      setIsEditing(true);
    },
    [effectiveName, showRenameAffordance]
  );
  const hasCommittedRef = (0, import_react5.useRef)(false);
  const commit = (0, import_react5.useCallback)(() => {
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
  const cancel = (0, import_react5.useCallback)(() => {
    hasCommittedRef.current = true;
    setDraft(effectiveName);
    setIsEditing(false);
  }, [effectiveName]);
  const handleKeyDown = (0, import_react5.useCallback)(
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
  const handleBlur = (0, import_react5.useCallback)(() => {
    commit();
  }, [commit]);
  const handleInputChange = (0, import_react5.useCallback)(
    (e) => {
      setDraft(e.target.value);
    },
    []
  );
  (0, import_react5.useEffect)(() => {
    if (isEditing) {
      hasCommittedRef.current = false;
    }
  }, [isEditing]);
  const stopPropagation = (0, import_react5.useCallback)((e) => {
    e.stopPropagation();
  }, []);
  const handleToggleClick = (0, import_react5.useCallback)(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onToggleExpand?.(chunk.id);
    },
    [onToggleExpand, chunk.id]
  );
  const handleToggleMouseDown = (0, import_react5.useCallback)((e) => {
    e.stopPropagation();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { "data-chunk-id": chunk.id, style: { width: 200 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_react6.Handle,
      {
        type: "target",
        position: import_react6.Position.Top,
        className: "!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        title: buildTooltip(effectiveName, stateNames),
        className: `
          rounded-lg border-2 px-3 py-2.5 shadow-md
          transition-all duration-150
          ${selected ? "border-indigo-400 bg-indigo-500/15 ring-2 ring-indigo-400/40 shadow-indigo-500/20 shadow-lg" : chunk.containsInitialState ? "border-indigo-400/70 bg-bg-secondary/80 hover:border-indigo-300 hover:shadow-lg" : "border-indigo-500/40 bg-bg-secondary/60 hover:border-indigo-400 hover:shadow-lg"}
        `,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-1.5 mb-1 group", children: [
            chunk.containsInitialState && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_lucide_react3.Play,
              {
                className: "size-3 text-yellow-400 fill-current shrink-0",
                "aria-label": "Contains initial state"
              }
            ),
            chunk.kind === "scc" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_lucide_react3.RefreshCw,
              {
                className: "size-3 text-indigo-300 shrink-0",
                "aria-label": "Strongly-connected component"
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_lucide_react3.ArrowRight,
              {
                className: "size-3 text-indigo-300 shrink-0",
                "aria-label": "Linear chain"
              }
            ),
            isEditing ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
            ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-xs font-medium text-text-primary truncate flex-1", children: effectiveName }),
            !isEditing && showRenameAffordance && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                type: "button",
                onClick: handleStartEdit,
                onMouseDown: stopPropagation,
                className: "shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-300/60 hover:text-indigo-200 transition-colors nodrag opacity-0 group-hover:opacity-100",
                title: "Rename chunk",
                "aria-label": "Rename chunk",
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.Pencil, { className: "size-3" })
              }
            ),
            !isEditing && showExpandToggle && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                type: "button",
                onClick: handleToggleClick,
                onMouseDown: handleToggleMouseDown,
                className: "shrink-0 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-colors nodrag",
                title: isExpanded ? "Collapse chain" : "Expand chain inline",
                "aria-label": isExpanded ? "Collapse chain" : "Expand chain inline",
                children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.ChevronDown, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.ChevronRight, { className: "size-3" })
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "text-[10px] text-text-muted", children: [
            stateCount,
            " state",
            plural,
            matchCount !== void 0 && matchCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "text-brand-primary ml-1", children: [
              "\xB7 ",
              matchCount,
              " match",
              matchPlural
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_react6.Handle,
      {
        type: "source",
        position: import_react6.Position.Bottom,
        className: "!w-2.5 !h-2.5 !border-2 !border-bg-primary !bg-indigo-400"
      }
    )
  ] });
}
var ChunkOverviewNode = (0, import_react5.memo)(ChunkOverviewNodeInner);

// src/components/state-machine/ChunkPortNode.tsx
var import_react7 = require("react");
var import_react8 = require("@xyflow/react");
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function ChunkPortNodeInner({ data }) {
  const { direction, adjacentChunkId, adjacentChunkName, onNavigate } = data;
  const isInput = direction === "input";
  const label = isInput ? `\u2190 ${adjacentChunkName}` : `${adjacentChunkName} \u2192`;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
        isInput && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          import_react8.Handle,
          {
            type: "source",
            position: import_react8.Position.Bottom,
            className: "!w-2 !h-2 !border !border-bg-primary !bg-indigo-400/60"
          }
        ),
        !isInput && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          import_react8.Handle,
          {
            type: "target",
            position: import_react8.Position.Top,
            className: "!w-2 !h-2 !border !border-bg-primary !bg-indigo-400/60"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
              isInput ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react4.ArrowLeft, { className: "size-3 shrink-0" }) : null,
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-[10px] font-medium truncate flex-1", children: label }),
              !isInput ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react4.ArrowRight, { className: "size-3 shrink-0" }) : null
            ]
          }
        )
      ]
    }
  );
}
var ChunkPortNode = (0, import_react7.memo)(ChunkPortNodeInner);

// src/components/state-machine/ChunkedGraphView.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
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
  const reactFlowInstance = (0, import_react10.useReactFlow)();
  const stateById = (0, import_react9.useMemo)(() => {
    const m = /* @__PURE__ */ new Map();
    for (const s of states) m.set(s.state_id, s);
    return m;
  }, [states]);
  const baseNodes = (0, import_react9.useMemo)(() => {
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
  const expandedEndpointFor = (0, import_react9.useCallback)(
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
  const baseEdges = (0, import_react9.useMemo)(() => {
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
        markerEnd: { type: import_react10.MarkerType.ArrowClosed, width: 15, height: 15 },
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
          markerEnd: { type: import_react10.MarkerType.ArrowClosed, width: 12, height: 12 },
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
  const layouted = (0, import_react9.useMemo)(() => {
    if (baseNodes.length === 0) return { nodes: [], edges: [] };
    return (0, import_workflow_utils.getLayoutedElements)(
      dagreLib,
      baseNodes,
      baseEdges,
      OVERVIEW_LAYOUT_OPTIONS
    );
  }, [dagreLib, baseNodes, baseEdges]);
  const [nodes, setNodes, onNodesChange] = (0, import_react10.useNodesState)(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = (0, import_react10.useEdgesState)(layouted.edges);
  (0, import_react9.useEffect)(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  const clearOverviewSelection = (0, import_react9.useCallback)(() => {
    setNodes(
      (prev) => prev.some((n) => n.selected) ? prev.map((n) => n.selected ? { ...n, selected: false } : n) : prev
    );
  }, [setNodes]);
  const onSelectionChange = (0, import_react9.useCallback)(
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
  const fitView = (0, import_react9.useCallback)(() => {
    reactFlowInstance.fitView({ ...FIT_VIEW_OPTIONS, duration: 300 });
  }, [reactFlowInstance]);
  (0, import_react9.useEffect)(() => {
    const id = setTimeout(fitView, 50);
    return () => clearTimeout(id);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    import_react10.ReactFlow,
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.Background, { gap: 20, size: 1, variant: import_react10.BackgroundVariant.Dots }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.Controls, { showInteractive: false }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          import_react10.MiniMap,
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.Panel, { position: "bottom-left", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react5.Layers, { className: "size-3" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            chunkGraph.chunks.length,
            " chunks"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            chunkGraph.edges.length,
            " cross-chunk edges"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-indigo-300/80", children: "Click a chunk to drill in" })
        ] }) })
      ]
    }
  );
}
function OverviewCanvas(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(OverviewCanvasInner, { ...props }) });
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
  const reactFlowInstance = (0, import_react10.useReactFlow)();
  const chunkStateIds = (0, import_react9.useMemo)(
    () => new Set(chunk.stateIds),
    [chunk.stateIds]
  );
  const chunkStates = (0, import_react9.useMemo)(
    () => states.filter((s) => chunkStateIds.has(s.state_id)),
    [states, chunkStateIds]
  );
  const { internalTransitions, inboundByAdjChunk, outboundByAdjChunk } = (0, import_react9.useMemo)(() => {
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
  const chunkNameById = (0, import_react9.useMemo)(() => {
    const m = /* @__PURE__ */ new Map();
    for (const c of chunkGraph.chunks) {
      const override = chunkLabels?.get(c.id);
      m.set(c.id, override && override.length > 0 ? override : c.name);
    }
    return m;
  }, [chunkGraph.chunks, chunkLabels]);
  const stateNodes = (0, import_react9.useMemo)(
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
  const getSelectionId = (0, import_react9.useCallback)(
    (t) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(t);
      return t.transition_id;
    },
    [resolveTransitionSelectionId]
  );
  const selectedTransitionSemanticId = (0, import_react9.useMemo)(() => {
    if (!selectedTransitionId) return null;
    const t = transitions.find(
      (tr) => getSelectionId(tr) === selectedTransitionId
    );
    return t?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);
  const stateEdges = (0, import_react9.useMemo)(() => {
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
            markerEnd: { type: import_react10.MarkerType.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: t.transition_id,
              name: t.name,
              pathCost: t.path_cost,
              actionCount: t.actions.length,
              actionTypes: t.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(t.transition_id),
              staysVisible: t.stays_visible,
              firstActionTarget: (0, import_workflow_utils.firstActionTargetString)(t.actions[0])
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
  const portNodes = (0, import_react9.useMemo)(() => {
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
  const portEdges = (0, import_react9.useMemo)(() => {
    const list = [];
    for (const [adjChunkId, info] of inboundByAdjChunk) {
      const portId = `port-in-${adjChunkId}`;
      for (const stateId of info.states) {
        list.push({
          id: `port-in-edge-${adjChunkId}-${stateId}`,
          source: portId,
          target: stateId,
          markerEnd: { type: import_react10.MarkerType.ArrowClosed, width: 12, height: 12 },
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
          markerEnd: { type: import_react10.MarkerType.ArrowClosed, width: 12, height: 12 },
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
  const layouted = (0, import_react9.useMemo)(() => {
    const allNodes = [...portNodes, ...stateNodes];
    const allEdges = [...stateEdges, ...portEdges];
    if (allNodes.length === 0) return { nodes: [], edges: [] };
    const result = (0, import_workflow_utils.getLayoutedElements)(
      dagreLib,
      allNodes,
      allEdges,
      import_workflow_utils.STATE_MACHINE_LAYOUT_OPTIONS
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
    const portBottomY = maxY + PORT_MARGIN + import_workflow_utils.STATE_MACHINE_LAYOUT_OPTIONS.nodeHeight;
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
  const [nodes, setNodes, onNodesChange] = (0, import_react10.useNodesState)(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = (0, import_react10.useEdgesState)(layouted.edges);
  (0, import_react9.useEffect)(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  const onSelectionChange = (0, import_react9.useCallback)(
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
  const didFitRef = (0, import_react9.useRef)(false);
  (0, import_react9.useEffect)(() => {
    if (didFitRef.current) return;
    if (nodes.length === 0) return;
    didFitRef.current = true;
    const id = setTimeout(() => {
      reactFlowInstance.fitView({ ...FIT_VIEW_OPTIONS, duration: 300 });
    }, 50);
    return () => clearTimeout(id);
  }, [nodes.length, reactFlowInstance]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    import_react10.ReactFlow,
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.Background, { gap: 20, size: 1, variant: import_react10.BackgroundVariant.Dots }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.Controls, { showInteractive: false }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          import_react10.MiniMap,
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react10.ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DrilledCanvasInner, { ...props }) });
}
function GiantChunkPanel({
  chunk,
  states,
  selectedStateId,
  onSelectState
}) {
  const chunkStates = (0, import_react9.useMemo)(() => {
    const order = new Map(chunk.stateIds.map((id, i) => [id, i]));
    return states.filter((s) => order.has(s.state_id)).sort(
      (a, b) => (order.get(a.state_id) ?? 0) - (order.get(b.state_id) ?? 0)
    );
  }, [chunk.stateIds, states]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "h-full w-full flex flex-col p-4 gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-start gap-3 bg-amber-950/20 border border-amber-600/40 rounded px-3 py-2.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react5.Layers, { className: "size-4 text-amber-400 shrink-0 mt-0.5" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-xs text-amber-200/90", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "font-medium", children: [
          "Chunk too large to render (",
          chunkStates.length,
          " states)."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-amber-200/70 mt-1", children: "This strongly-connected component has too many interconnected cycles to lay out cleanly. Browse states from the list below or switch to the State View tab." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex-1 min-h-0 overflow-y-auto max-h-[80vh] border border-border-secondary rounded bg-bg-secondary/40", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { className: "divide-y divide-border-secondary/60", children: chunkStates.map((s) => {
      const isSel = s.state_id === selectedStateId;
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react5.Layers, { className: "size-3 shrink-0 text-brand-primary/70" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "truncate flex-1 font-medium", children: s.name }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "text-[10px] text-text-muted shrink-0", children: [
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
  const effectiveInitialStateId = (0, import_react9.useMemo)(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => s.extra_metadata?.initial === true
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);
  const chunkGraph = (0, import_react9.useMemo)(
    () => (0, import_workflow_utils.chunkStateMachine)(states, transitions, {
      initialStateId: effectiveInitialStateId
    }),
    [states, transitions, effectiveInitialStateId]
  );
  const chunkById = (0, import_react9.useMemo)(() => {
    const m = /* @__PURE__ */ new Map();
    for (const c of chunkGraph.chunks) m.set(c.id, c);
    return m;
  }, [chunkGraph.chunks]);
  const transitionCounts = (0, import_react9.useMemo)(() => {
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
  const highlightedTransitionIds = (0, import_react9.useMemo)(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath]
  );
  const [viewMode, setViewMode] = (0, import_react9.useState)({ kind: "overview" });
  const [expandedChainIds, setExpandedChainIds] = (0, import_react9.useState)(
    () => /* @__PURE__ */ new Set()
  );
  const toggleChainExpand = (0, import_react9.useCallback)((chunkId) => {
    setExpandedChainIds((prev) => {
      const next = new Set(prev);
      if (next.has(chunkId)) next.delete(chunkId);
      else next.add(chunkId);
      return next;
    });
  }, []);
  const stateNamesByChunkId = (0, import_react9.useMemo)(() => {
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
  const perChunkMatches = (0, import_react9.useMemo)(() => {
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
  (0, import_react9.useEffect)(() => {
    if (!selectedStateId) return;
    const targetChunkId = chunkGraph.stateIndex.get(selectedStateId);
    if (!targetChunkId) return;
    if (targetChunkId === currentChunkId) return;
    setViewMode({ kind: "drilled", chunkId: targetChunkId });
  }, [selectedStateId, chunkGraph.stateIndex, currentChunkId]);
  (0, import_react9.useEffect)(() => {
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
  const goOverview = (0, import_react9.useCallback)(() => {
    setViewMode({ kind: "overview" });
  }, []);
  const drillInto = (0, import_react9.useCallback)((chunkId) => {
    setViewMode({ kind: "drilled", chunkId });
  }, []);
  if (states.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { children: emptyMessage }) });
  }
  if (viewMode.kind === "drilled") {
    const chunk = chunkById.get(viewMode.chunkId);
    if (!chunk) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ChunkedGraphViewFallbackMissingChunk, { onBack: goOverview });
    }
    const isGiant = chunk.stateIds.length > CHUNK_MAX_NODES;
    const drilledName = chunkLabels?.get(chunk.id) || chunk.name;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        className: "h-full w-full flex flex-col",
        onDragOver,
        onDrop,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DrilledBreadcrumb, { chunkName: drilledName, onBack: goOverview }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex-1 min-h-0", children: isGiant ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            GiantChunkPanel,
            {
              chunk,
              states,
              selectedStateId,
              onSelectState
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "h-full w-full", onDragOver, onDrop, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2 px-3 py-2 border-b border-border-secondary bg-bg-secondary/40 shrink-0", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        type: "button",
        onClick: onBack,
        className: "flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded transition-colors",
        title: "Back to overview (Esc)",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react5.ArrowLeft, { className: "size-3.5" }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-xs text-text-muted flex items-center gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          type: "button",
          onClick: onBack,
          className: "hover:text-text-primary transition-colors",
          children: "All states"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-text-muted/60", children: ">" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-text-primary font-medium truncate max-w-[240px]", children: chunkName })
    ] })
  ] });
}
function ChunkedGraphViewFallbackMissingChunk({
  onBack
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "h-full w-full flex flex-col items-center justify-center gap-3 text-center text-text-muted", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-sm", children: "That chunk no longer exists." }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ChunkedGraphViewInner, { ...props });
}

// src/components/state-machine/StateMachineGraphView.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const [showShortcuts, setShowShortcuts] = (0, import_react11.useState)(false);
  const reactFlowInstance = (0, import_react12.useReactFlow)();
  const prevStateCountRef = (0, import_react11.useRef)(states.length);
  const highlightedTransitionIds = (0, import_react11.useMemo)(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath]
  );
  const effectiveInitialStateId = (0, import_react11.useMemo)(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => s.extra_metadata?.initial === true
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);
  const transitionCounts = (0, import_react11.useMemo)(() => {
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const t of transitions) {
      for (const from of t.from_states) outgoing.set(from, (outgoing.get(from) ?? 0) + 1);
      for (const to of t.activate_states) incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
    return { outgoing, incoming };
  }, [transitions]);
  const initialNodes = (0, import_react11.useMemo)(
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
  const getSelectionId = (0, import_react11.useCallback)(
    (trans) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(trans);
      return trans.transition_id;
    },
    [resolveTransitionSelectionId]
  );
  const selectedTransitionSemanticId = (0, import_react11.useMemo)(() => {
    if (!selectedTransitionId) return null;
    const trans = transitions.find((t) => getSelectionId(t) === selectedTransitionId);
    return trans?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);
  const initialEdges = (0, import_react11.useMemo)(() => {
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
            markerEnd: { type: import_react12.MarkerType.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: trans.transition_id,
              name: trans.name,
              pathCost: trans.path_cost,
              actionCount: trans.actions.length,
              actionTypes: trans.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(trans.transition_id),
              staysVisible: trans.stays_visible,
              firstActionTarget: (0, import_workflow_utils2.firstActionTargetString)(trans.actions[0])
            }
          });
        }
      }
    }
    return edges2;
  }, [transitions, highlightedTransitionIds, selectedTransitionSemanticId]);
  const layouted = (0, import_react11.useMemo)(() => {
    if (initialNodes.length === 0) return { nodes: [], edges: [] };
    return (0, import_workflow_utils2.getLayoutedElements)(dagreLib, initialNodes, initialEdges, import_workflow_utils2.STATE_MACHINE_LAYOUT_OPTIONS);
  }, [dagreLib, initialNodes, initialEdges]);
  const [nodes, setNodes, onNodesChange] = (0, import_react12.useNodesState)(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = (0, import_react12.useEdgesState)(layouted.edges);
  (0, import_react11.useEffect)(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  (0, import_react11.useEffect)(() => {
    if (states.length > prevStateCountRef.current) {
      setTimeout(() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED), 100);
    }
    prevStateCountRef.current = states.length;
  }, [states.length, reactFlowInstance]);
  const onSelectionChange = (0, import_react11.useCallback)(
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
  const handleRelayout = (0, import_react11.useCallback)(() => {
    const result = (0, import_workflow_utils2.getLayoutedElements)(dagreLib, nodes, edges, import_workflow_utils2.STATE_MACHINE_LAYOUT_OPTIONS);
    setNodes(result.nodes);
    setEdges(result.edges);
    setTimeout(() => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED), 50);
  }, [dagreLib, nodes, edges, setNodes, setEdges, reactFlowInstance]);
  (0, import_react11.useEffect)(() => {
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
  const graphStats = (0, import_react11.useMemo)(
    () => ({
      stateCount: states.length,
      transitionCount: transitions.length,
      initialStateName: states.find((s) => s.state_id === effectiveInitialStateId)?.name ?? "None"
    }),
    [states, transitions, effectiveInitialStateId]
  );
  if (states.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: emptyMessage }) });
  }
  if (states.length > GRAPH_MAX_NODES) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex flex-col items-center justify-center h-full gap-3 text-center px-8 text-text-muted", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react6.LayoutGrid, { className: "size-10 opacity-40" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { className: "text-sm font-medium text-text-primary", children: [
        "Graph too large to render (",
        states.length,
        " states, ",
        transitions.length,
        " transitions)."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { className: "text-xs max-w-md", children: [
        "Graphs above ",
        GRAPH_MAX_NODES,
        " nodes overwhelm the browser's layout engine. Use the ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-brand-primary", children: "State View" }),
        " tab to browse all states with search, filter, and detail panels."
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "h-full w-full", onDragOver, onDrop, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    import_react12.ReactFlow,
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react12.Background, { gap: 20, size: 1, variant: import_react12.BackgroundVariant.Dots }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react12.Controls, { showInteractive: false }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          import_react12.MiniMap,
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react12.Panel, { position: "top-right", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              onClick: () => reactFlowInstance.fitView(FIT_VIEW_OPTIONS_ANIMATED),
              className: "flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded",
              title: "Fit to view (F)",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react6.Maximize, { className: "size-3.5" }),
                "Fit"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              onClick: () => setShowShortcuts((p) => !p),
              className: "flex items-center justify-center h-7 w-7 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded",
              title: "Keyboard shortcuts (?)",
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react6.Keyboard, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              onClick: handleRelayout,
              className: "flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary border border-border-secondary hover:border-text-muted rounded",
              title: "Re-layout (L)",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react6.LayoutGrid, { className: "size-3.5" }),
                "Re-layout"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react12.Panel, { position: "bottom-left", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            graphStats.stateCount,
            " states"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            graphStats.transitionCount,
            " transitions"
          ] }),
          graphStats.initialStateName !== "None" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-text-muted/30", children: "|" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "text-yellow-500", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react6.Play, { className: "size-2 inline mr-0.5 fill-current" }),
              graphStats.initialStateName
            ] })
          ] })
        ] }) }),
        showShortcuts && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react12.Panel, { position: "bottom-right", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "bg-bg-primary/95 border border-border-secondary rounded-lg p-4 text-xs shadow-lg backdrop-blur-xs min-w-[200px]", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h4", { className: "font-semibold text-text-primary mb-2.5", children: "Keyboard Shortcuts" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "space-y-1.5 text-text-muted", children: [
            [
              ["Deselect all", "Esc"],
              ["Toggle shortcuts", "?"],
              ["Fit to view", "F"],
              ["Re-layout", "L"],
              ["Zoom in/out", "+ / -"]
            ].map(([label, key]) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("kbd", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono", children: key })
            ] }, label)),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "border-t border-border-secondary pt-1.5 mt-1.5", children: [
              ["Cycle states", "Tab"],
              ["Jump to initial", "I"],
              ["Delete transition", "Del"],
              ...extraShortcutEntries ?? []
            ].map(([label, key]) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("kbd", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono", children: key })
            ] }, label)) })
          ] })
        ] }) })
      ]
    }
  ) });
}
function StateMachineGraphView(props) {
  if (props.states.length > CHUNKED_VIEW_THRESHOLD) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ChunkedGraphView, { ...props });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react12.ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(StateMachineGraphViewInner, { ...props }) });
}

// src/components/state-machine/TransitionEditor.tsx
var import_react13 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  const [name, setName] = (0, import_react13.useState)("");
  const [fromStates, setFromStates] = (0, import_react13.useState)([]);
  const [activateStates, setActivateStates] = (0, import_react13.useState)([]);
  const [exitStates, setExitStates] = (0, import_react13.useState)([]);
  const [actions, setActions] = (0, import_react13.useState)([]);
  const [pathCost, setPathCost] = (0, import_react13.useState)(1);
  const [staysVisible, setStaysVisible] = (0, import_react13.useState)(false);
  const [isSaving, setIsSaving] = (0, import_react13.useState)(false);
  (0, import_react13.useEffect)(() => {
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
  const toggleState = (0, import_react13.useCallback)(
    (arr, setter, stateId) => {
      if (arr.includes(stateId)) {
        setter(arr.filter((s) => s !== stateId));
      } else {
        setter([...arr, stateId]);
      }
    },
    []
  );
  const addAction = (0, import_react13.useCallback)(() => {
    setActions((prev) => [...prev, toEditableAction({ type: "click" })]);
  }, []);
  const removeAction = (0, import_react13.useCallback)((index) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const updateAction = (0, import_react13.useCallback)(
    (index, updates) => {
      setActions(
        (prev) => prev.map((a, i) => i === index ? { ...a, ...updates } : a)
      );
    },
    []
  );
  const handleSave = (0, import_react13.useCallback)(async () => {
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
  const handleDelete = (0, import_react13.useCallback)(async () => {
    if (!transition) return;
    setIsSaving(true);
    try {
      await onDelete(transition.id);
    } finally {
      setIsSaving(false);
    }
  }, [transition, onDelete]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: isEditing ? "Edit Transition" : "New Transition" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: onClose,
          className: "text-text-secondary hover:text-text-primary text-xs",
          children: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Name" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      StateToggleGroup,
      {
        label: "From States",
        color: "blue",
        states,
        selected: fromStates,
        onToggle: (id) => toggleState(fromStates, setFromStates, id)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      StateToggleGroup,
      {
        label: "Activate States",
        color: "green",
        states,
        selected: activateStates,
        onToggle: (id) => toggleState(activateStates, setActivateStates, id)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      StateToggleGroup,
      {
        label: "Exit States",
        color: "red",
        states,
        selected: exitStates,
        onToggle: (id) => toggleState(exitStates, setExitStates, id)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { className: "text-xs text-text-secondary", children: "Actions" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            onClick: addAction,
            className: "text-xs text-brand-primary hover:text-brand-primary/80",
            children: "+ Add Action"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex flex-col gap-2", children: actions.map((action, index) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Path Cost" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex items-end pb-1", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { className: "flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex gap-2 pt-2 border-t border-border-secondary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: handleSave,
          disabled: !name.trim() || isSaving,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: isSaving ? "Saving..." : isEditing ? "Update" : "Create"
        }
      ),
      isEditing && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-wrap gap-1", children: [
      states.map((s) => {
        const isActive = selected.includes(s.state_id);
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            onClick: () => onToggle(s.state_id),
            className: `px-2 py-0.5 text-xs border rounded transition-colors ${isActive ? colorClasses[color] : inactiveClass}`,
            children: s.name
          },
          s.state_id
        );
      }),
      states.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-xs text-text-muted italic", children: "No states" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-2 bg-bg-tertiary border border-border-secondary rounded", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2 mb-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "select",
        {
          value: action.type,
          onChange: (e) => onUpdate(index, { type: e.target.value }),
          className: "flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
          style: { colorScheme: "dark" },
          children: ACTION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("option", { value: t.value, children: t.label }, t.value))
        }
      ),
      canRemove && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          onClick: () => onRemove(index),
          className: "text-xs text-red-400 hover:text-red-300",
          children: "Remove"
        }
      )
    ] }),
    (action.type === "click" || action.type === "doubleClick" || action.type === "rightClick" || action.type === "hover" || action.type === "focus" || action.type === "blur" || action.type === "check" || action.type === "uncheck" || action.type === "toggle" || action.type === "submit" || action.type === "reset" || action.type === "clear") && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "input",
      {
        type: "text",
        value: action.target ?? "",
        onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
        placeholder: "Target element ID",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    action.type === "type" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "text",
          value: action.text ?? "",
          onChange: (e) => onUpdate(index, { text: e.target.value }),
          placeholder: "Text to type",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { className: "flex items-center gap-1 text-xs text-text-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    action.type === "navigate" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "input",
      {
        type: "text",
        value: action.url ?? "",
        onChange: (e) => onUpdate(index, { url: e.target.value }),
        placeholder: "URL",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    action.type === "wait" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    (action.type === "select" || action.type === "setValue") && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    action.type === "scroll" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "select",
        {
          value: action.scroll_direction ?? "down",
          onChange: (e) => onUpdate(index, {
            scroll_direction: e.target.value
          }),
          className: "flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
          style: { colorScheme: "dark" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("option", { value: "up", children: "Up" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("option", { value: "down", children: "Down" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("option", { value: "left", children: "Left" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("option", { value: "right", children: "Right" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    action.type === "drag" && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Source element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
var import_react14 = require("react");
var import_lucide_react7 = require("lucide-react");
var import_workflow_utils3 = require("@qontinui/workflow-utils");
var import_jsx_runtime8 = require("react/jsx-runtime");
var ACTION_ICONS2 = {
  click: import_lucide_react7.MousePointer,
  type: import_lucide_react7.Type,
  select: import_lucide_react7.ListFilter,
  wait: import_lucide_react7.Clock,
  navigate: import_lucide_react7.Globe
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
  const [filterFromState, setFilterFromState] = (0, import_react14.useState)(null);
  const [filterToState, setFilterToState] = (0, import_react14.useState)(null);
  const [searchFilter, setSearchFilter] = (0, import_react14.useState)("");
  const [permittedOnly, setPermittedOnly] = (0, import_react14.useState)(false);
  const [animation, setAnimation] = (0, import_react14.useState)({
    isPlaying: false,
    currentActionIndex: -1,
    progress: 0,
    speed: 1
  });
  const permittedIds = (0, import_react14.useMemo)(
    () => new Set((permittedTriggers ?? []).map((p) => p.transition_id)),
    [permittedTriggers]
  );
  const blockedReasonById = (0, import_react14.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const b of blockedTriggers ?? []) {
      map.set(b.transition_id, b.reason);
    }
    return map;
  }, [blockedTriggers]);
  const hasIntrospectionData = (permittedTriggers?.length ?? 0) > 0 || (blockedTriggers?.length ?? 0) > 0 || (activeStateIds?.length ?? 0) > 0;
  const animationRef = (0, import_react14.useRef)(null);
  const startTimeRef = (0, import_react14.useRef)(0);
  const selectedTransition = (0, import_react14.useMemo)(
    () => transitions.find((t) => t.transition_id === selectedTransitionId),
    [transitions, selectedTransitionId]
  );
  const filteredTransitions = (0, import_react14.useMemo)(() => {
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
  const stateNameMap = (0, import_react14.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of states) {
      map.set(s.state_id, s.name);
    }
    return map;
  }, [states]);
  const stopAnimation = (0, import_react14.useCallback)(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setAnimation((prev) => ({ ...prev, isPlaying: false }));
  }, []);
  const animate = (0, import_react14.useCallback)(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0) return;
    const tick = (timestamp) => {
      setAnimation((prev) => {
        if (!prev.isPlaying) return prev;
        const elapsed = timestamp - startTimeRef.current;
        const currentAction = selectedTransition.actions[prev.currentActionIndex];
        if (!currentAction) {
          return { ...prev, isPlaying: false };
        }
        const duration = (0, import_workflow_utils3.computeActionDuration)(currentAction) / prev.speed;
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
  const playAnimation = (0, import_react14.useCallback)(() => {
    setAnimation((prev) => {
      const startIndex = prev.currentActionIndex < 0 ? 0 : prev.currentActionIndex;
      const idx = prev.progress >= 1 && startIndex >= (selectedTransition?.actions.length ?? 0) - 1 ? 0 : startIndex;
      return { ...prev, isPlaying: true, currentActionIndex: idx, progress: 0 };
    });
    setTimeout(animate, 0);
  }, [animate, selectedTransition]);
  const pauseAnimation = (0, import_react14.useCallback)(() => {
    stopAnimation();
  }, [stopAnimation]);
  const resetAnimation = (0, import_react14.useCallback)(() => {
    stopAnimation();
    setAnimation((prev) => ({
      ...prev,
      currentActionIndex: -1,
      progress: 0
    }));
  }, [stopAnimation]);
  const stepForward = (0, import_react14.useCallback)(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex + 1;
      if (!selectedTransition || next >= selectedTransition.actions.length)
        return prev;
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation, selectedTransition]);
  const stepBackward = (0, import_react14.useCallback)(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex - 1;
      if (next < 0) return { ...prev, currentActionIndex: -1, progress: 0 };
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation]);
  (0, import_react14.useEffect)(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  (0, import_react14.useEffect)(() => {
    resetAnimation();
  }, [selectedTransitionId, resetAnimation]);
  const handleSelectTransition = (0, import_react14.useCallback)(
    (tid) => {
      onSelectTransition(tid === selectedTransitionId ? null : tid);
    },
    [selectedTransitionId, onSelectTransition]
  );
  const overallProgress = (0, import_react14.useMemo)(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0)
      return 0;
    if (animation.currentActionIndex < 0) return 0;
    const completedActions = animation.currentActionIndex;
    const currentProgress = animation.progress;
    return (completedActions + currentProgress) / selectedTransition.actions.length;
  }, [selectedTransition, animation]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "w-80 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "p-3 border-b border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.GitBranch, { className: "size-4 text-brand-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Transitions" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-xs text-text-muted ml-auto", children: filteredTransitions.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "relative mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
            "select",
            {
              value: filterFromState ?? "",
              onChange: (e) => setFilterFromState(e.target.value || null),
              className: "text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
              style: { colorScheme: "dark" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: "All from states" }),
                states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
            "select",
            {
              value: filterToState ?? "",
              onChange: (e) => setFilterToState(e.target.value || null),
              className: "text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
              style: { colorScheme: "dark" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: "All target states" }),
                states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "label",
          {
            className: `flex items-center gap-2 mt-2 text-[10px] select-none ${hasIntrospectionData ? "text-text-secondary cursor-pointer" : "text-text-muted/50 cursor-not-allowed"}`,
            title: hasIntrospectionData ? "Show only transitions currently permitted from the active state set" : "No active-state introspection data available",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "input",
                {
                  type: "checkbox",
                  checked: permittedOnly && hasIntrospectionData,
                  disabled: !hasIntrospectionData,
                  onChange: (e) => setPermittedOnly(e.target.checked),
                  className: "accent-brand-primary"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "Permitted from active states" }),
              hasIntrospectionData && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "ml-auto text-[9px] text-text-muted", children: [
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
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "p-2 space-y-0.5", children: [
        filteredTransitions.map((t) => {
          const isSelected = t.transition_id === selectedTransitionId;
          const isPermitted = permittedIds.has(t.transition_id);
          const blockedReason = blockedReasonById.get(t.transition_id);
          return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
            "button",
            {
              onClick: () => handleSelectTransition(t.transition_id),
              title: blockedReason ? `Blocked: ${blockedReason}` : isPermitted ? "Permitted from active states" : void 0,
              className: `
                  w-full text-left px-3 py-2 rounded-md transition-colors text-sm
                  ${isSelected ? "bg-brand-primary/10 border border-brand-primary/30" : "hover:bg-bg-secondary border border-transparent"}
                `,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                  hasIntrospectionData && isPermitted && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                    "span",
                    {
                      "aria-label": "Permitted",
                      className: "shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "flex items-center gap-0.5", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((type) => {
                    const Icon = ACTION_ICONS2[type];
                    const color = (0, import_workflow_utils3.getActionColorConfig)(type);
                    return Icon ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                      Icon,
                      {
                        className: `size-3 ${color.text}`
                      },
                      type
                    ) : null;
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "font-medium text-text-primary truncate flex-1", children: t.name || "Unnamed" }),
                  t.stays_visible && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.Eye, { className: "size-3 text-green-500 shrink-0" }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-[9px] text-text-muted bg-bg-secondary px-1 rounded", children: t.actions.length })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-1 mt-0.5 ml-4 text-[10px] text-text-muted", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "truncate", children: t.from_states.map((s) => stateNameMap.get(s) ?? s).join(", ") }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.ArrowRight, { className: "size-2.5 shrink-0" }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "truncate", children: t.activate_states.map((s) => stateNameMap.get(s) ?? s).join(", ") })
                ] }),
                blockedReason && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "mt-1 ml-4", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
        filteredTransitions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-xs text-text-muted text-center py-4", children: "No transitions match filters." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "flex-1 overflow-y-auto", children: selectedTransition ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { className: "text-lg font-semibold text-text-primary", children: selectedTransition.name || "Unnamed Transition" }),
          selectedTransition.stays_visible && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-green-500/20 text-green-400 border-green-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.Eye, { className: "size-2.5" }),
            "Visible"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-2 mt-2 text-xs text-text-muted flex-wrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            "From:",
            " ",
            selectedTransition.from_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.ArrowRight, { className: "size-3" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            "To:",
            " ",
            selectedTransition.activate_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] }),
          selectedTransition.exit_states.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border status-error text-red-400 border-red-500/30", children: [
            "Exit:",
            " ",
            selectedTransition.exit_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] })
        ] })
      ] }),
      selectedTransition.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "rounded-lg border border-border-secondary bg-bg-secondary p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.Zap, { className: "size-3.5 text-brand-primary" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-xs font-medium text-text-primary", children: "Action Playback" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "0.5", children: "0.5x" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "1", children: "1x" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "1.5", children: "1.5x" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "2", children: "2x" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "4", children: "4x" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-full h-1.5 bg-bg-primary rounded-full mb-3 overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "div",
          {
            className: "h-full bg-brand-primary rounded-full transition-all duration-100",
            style: { width: `${overallProgress * 100}%` }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              onClick: resetAnimation,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
              title: "Reset",
              children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.RotateCcw, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              onClick: stepBackward,
              disabled: animation.currentActionIndex <= 0,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Step back",
              children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.SkipBack, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              onClick: animation.isPlaying ? pauseAnimation : playAnimation,
              className: "h-9 w-9 p-0 inline-flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary/90",
              title: animation.isPlaying ? "Pause" : "Play",
              children: animation.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.Play, { className: "size-4 ml-0.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              onClick: stepForward,
              disabled: animation.currentActionIndex >= selectedTransition.actions.length - 1,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Step forward",
              children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.SkipForward, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "mt-3 flex items-center justify-center gap-1", children: selectedTransition.actions.map((action, idx) => {
          const Icon = ACTION_ICONS2[action.type] ?? import_lucide_react7.ChevronRight;
          const isPastAction = animation.currentActionIndex >= 0 && idx < animation.currentActionIndex;
          const isCurrentAction = idx === animation.currentActionIndex;
          const color = (0, import_workflow_utils3.getActionColorConfig)(action.type);
          return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
              title: `${import_workflow_utils3.ACTION_LABELS[action.type] ?? action.type}: ${action.target || action.url || action.text || ""}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { className: "size-2.5" }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: idx + 1 })
              ]
            },
            `${idx}-${action.type}`
          );
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "mt-1.5 text-center text-[10px] text-text-muted", children: animation.currentActionIndex >= 0 ? `Action ${animation.currentActionIndex + 1} of ${selectedTransition.actions.length}` : "Ready to play" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("h3", { className: "text-sm font-medium text-text-primary mb-3", children: [
          "Actions (",
          selectedTransition.actions.length,
          ")"
        ] }),
        selectedTransition.actions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-xs text-text-muted", children: "No actions defined." }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "space-y-2", children: selectedTransition.actions.map((action, idx) => {
          const Icon = ACTION_ICONS2[action.type] ?? import_lucide_react7.ChevronRight;
          const color = (0, import_workflow_utils3.getActionColorConfig)(action.type);
          const isCurrent = idx === animation.currentActionIndex;
          const isPast = animation.currentActionIndex >= 0 && idx < animation.currentActionIndex;
          return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
            "div",
            {
              className: `
                          flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
                          ${isCurrent ? `${color.border} ${color.bg} shadow-xs` : isPast ? "border-green-500/30 bg-green-500/5" : "border-border-secondary bg-bg-secondary"}
                        `,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-[10px] text-text-muted font-mono w-4 text-right", children: idx + 1 }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                    "div",
                    {
                      className: `p-1.5 rounded-md ${color.bg} ${color.text}`,
                      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { className: "size-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "text-xs font-medium text-text-primary flex items-center gap-1.5", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: import_workflow_utils3.ACTION_LABELS[action.type] ?? action.type }),
                    isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                      "span",
                      {
                        className: `animate-pulse ${color.text} text-[10px]`,
                        children: import_workflow_utils3.ACTION_ACTIVE_LABELS[action.type]
                      }
                    )
                  ] }),
                  action.target && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("code", { className: "text-[10px] text-text-muted mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded", children: action.target }),
                  action.text && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "text-[10px] text-text-muted mt-0.5 font-mono bg-bg-primary/50 px-1 py-0.5 rounded", children: [
                    "\u201C",
                    isCurrent && animation.isPlaying ? action.text.slice(
                      0,
                      Math.floor(
                        action.text.length * animation.progress
                      )
                    ) : action.text,
                    "\u201D",
                    isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "animate-pulse text-brand-primary", children: "|" })
                  ] }),
                  action.url && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("code", { className: "text-[10px] text-cyan-400 mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded", children: action.url }),
                  action.delay_ms != null && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "text-[10px] text-text-muted mt-0.5 block", children: [
                    action.delay_ms,
                    "ms",
                    isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "ml-1 text-text-muted/70", children: [
                      "(",
                      Math.round(
                        animation.progress * (action.delay_ms ?? 0)
                      ),
                      "ms elapsed)"
                    ] })
                  ] })
                ] }),
                isPast && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "text-green-500 shrink-0 mt-0.5", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  "svg",
                  {
                    className: "size-4",
                    viewBox: "0 0 16 16",
                    fill: "currentColor",
                    children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" })
                  }
                ) }),
                isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "shrink-0 mt-0.5", children: action.type === "click" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "absolute inset-0 rounded-full bg-blue-500/20 animate-ping" }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-2 h-2 rounded-full bg-blue-400" })
                ] }) : action.type === "navigate" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  import_lucide_react7.ArrowRight,
                  {
                    className: "size-4 text-cyan-400 animate-bounce",
                    style: { animationDuration: "0.6s" }
                  }
                ) }) : action.type === "type" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  "div",
                  {
                    className: "w-0.5 h-3.5 bg-amber-400 animate-pulse",
                    style: { animationDuration: "0.5s" }
                  }
                ) }) : action.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  import_lucide_react7.ChevronRight,
                  {
                    className: "size-3.5 text-purple-400 animate-bounce",
                    style: {
                      animationDuration: "0.8s",
                      transform: "rotate(90deg)"
                    }
                  }
                ) }) : action.type === "wait" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  "div",
                  {
                    className: "w-4 h-4 rounded-full border-2 border-gray-400/40 border-t-gray-400 animate-spin",
                    style: { animationDuration: "1.5s" }
                  }
                ) }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
          "Path Cost: ",
          selectedTransition.path_cost
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
          "Stays Visible: ",
          selectedTransition.stays_visible ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
          "ID:",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("code", { className: "bg-bg-secondary px-1 rounded", children: selectedTransition.transition_id })
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react7.GitBranch, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm", children: "Select a transition to view its details" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "text-xs mt-1 text-text-muted/70", children: [
        transitions.length,
        " transition",
        transitions.length !== 1 ? "s" : "",
        " available"
      ] })
    ] }) }) })
  ] });
}

// src/components/state-machine/StateDetailPanel.tsx
var import_react15 = require("react");
var import_workflow_utils4 = require("@qontinui/workflow-utils");
var import_jsx_runtime9 = require("react/jsx-runtime");
function StateDetailPanel({
  state,
  onSave,
  onDelete,
  onClose
}) {
  const [name, setName] = (0, import_react15.useState)(state.name);
  const [description, setDescription] = (0, import_react15.useState)(state.description ?? "");
  const [elementIds, setElementIds] = (0, import_react15.useState)([...state.element_ids]);
  const [acceptanceCriteria, setAcceptanceCriteria] = (0, import_react15.useState)([
    ...state.acceptance_criteria
  ]);
  const [domainKnowledge, setDomainKnowledge] = (0, import_react15.useState)(
    state.domain_knowledge.map((dk) => ({ ...dk, tags: [...dk.tags] }))
  );
  const [isSaving, setIsSaving] = (0, import_react15.useState)(false);
  const [newElementId, setNewElementId] = (0, import_react15.useState)("");
  const [newCriterion, setNewCriterion] = (0, import_react15.useState)("");
  const [showNewDk, setShowNewDk] = (0, import_react15.useState)(false);
  const [newDkTitle, setNewDkTitle] = (0, import_react15.useState)("");
  const [newDkContent, setNewDkContent] = (0, import_react15.useState)("");
  const [newDkTags, setNewDkTags] = (0, import_react15.useState)("");
  const [editingCriterionIdx, setEditingCriterionIdx] = (0, import_react15.useState)(
    null
  );
  const [editingCriterionValue, setEditingCriterionValue] = (0, import_react15.useState)("");
  (0, import_react15.useEffect)(() => {
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
  const handleSave = (0, import_react15.useCallback)(async () => {
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
  const handleDelete = (0, import_react15.useCallback)(async () => {
    if (!onDelete) return;
    setIsSaving(true);
    try {
      await onDelete(state.id);
    } finally {
      setIsSaving(false);
    }
  }, [state.id, onDelete]);
  const handleAddElement = (0, import_react15.useCallback)(() => {
    const trimmed = newElementId.trim();
    if (!trimmed || elementIds.includes(trimmed)) return;
    setElementIds((prev) => [...prev, trimmed]);
    setNewElementId("");
  }, [newElementId, elementIds]);
  const handleRemoveElement = (0, import_react15.useCallback)((eid) => {
    setElementIds((prev) => prev.filter((e) => e !== eid));
  }, []);
  const handleAddCriterion = (0, import_react15.useCallback)(() => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    setAcceptanceCriteria((prev) => [...prev, trimmed]);
    setNewCriterion("");
  }, [newCriterion]);
  const handleRemoveCriterion = (0, import_react15.useCallback)((idx) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== idx));
    setEditingCriterionIdx(null);
  }, []);
  const handleSaveCriterionEdit = (0, import_react15.useCallback)(() => {
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
  const handleAddDk = (0, import_react15.useCallback)(() => {
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
  const handleRemoveDk = (0, import_react15.useCallback)((dkId) => {
    setDomainKnowledge((prev) => prev.filter((dk) => dk.id !== dkId));
  }, []);
  const confidenceColor = (0, import_workflow_utils4.getConfidenceColor)(state.confidence);
  const confidencePct = Math.round(state.confidence * 100);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "State Details" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          onClick: onClose,
          className: "text-text-secondary hover:text-text-primary text-xs",
          children: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Name" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          type: "text",
          value: name,
          onChange: (e) => setName(e.target.value),
          className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Description" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-text-secondary", children: "State ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("code", { className: "block mt-0.5 px-1.5 py-0.5 bg-bg-tertiary rounded text-text-primary font-mono text-[10px] break-all", children: state.state_id })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-text-secondary", children: "Confidence" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: `block mt-0.5 font-medium ${confidenceColor}`, children: [
          confidencePct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-text-secondary", children: "Elements" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "block mt-0.5 text-text-primary font-medium", children: elementIds.length })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-text-secondary", children: "Renders" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "block mt-0.5 text-text-primary font-medium", children: state.render_ids.length })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "block text-xs text-text-secondary mb-1.5", children: [
        "Elements (",
        elementIds.length,
        ")"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "max-h-48 overflow-y-auto space-y-0.5", children: elementIds.map((eid) => {
        const style = (0, import_workflow_utils4.getElementTypeStyle)(eid);
        const label = (0, import_workflow_utils4.getElementLabel)(eid);
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "div",
          {
            className: `group flex items-center gap-1 px-2 py-1 text-xs rounded border ${style.bg} ${style.text} ${style.border}`,
            title: eid,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "truncate flex-1", children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-1 mt-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "block text-xs text-text-secondary mb-1", children: [
        "Acceptance Criteria (",
        acceptanceCriteria.length,
        ")"
      ] }),
      acceptanceCriteria.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { className: "space-y-0.5 mb-1.5", children: acceptanceCriteria.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { className: "group flex items-start gap-1.5 text-xs", children: editingCriterionIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            onClick: () => handleRemoveCriterion(i),
            className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
            title: "Remove",
            children: "\xD7"
          }
        )
      ] }) }, `${i}-${c}`)) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "text-xs text-text-secondary", children: [
          "Domain Knowledge (",
          domainKnowledge.length,
          ")"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            onClick: () => setShowNewDk(true),
            className: "text-xs text-brand-primary hover:text-brand-primary/80",
            children: "+ Add"
          }
        )
      ] }),
      domainKnowledge.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "space-y-1.5", children: domainKnowledge.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        "div",
        {
          className: "group p-2 bg-bg-tertiary border border-border-secondary rounded",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-start justify-between gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-xs font-medium text-text-primary", children: dk.title }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                "button",
                {
                  onClick: () => handleRemoveDk(dk.id),
                  className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
                  title: "Remove",
                  children: "\xD7"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-xs text-text-secondary mt-0.5 line-clamp-2", children: dk.content }),
            dk.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex flex-wrap gap-1 mt-1", children: dk.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      showNewDk && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "mt-1.5 p-2 bg-bg-tertiary border border-border-secondary rounded space-y-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "textarea",
          {
            value: newDkContent,
            onChange: (e) => setNewDkContent(e.target.value),
            placeholder: "Content",
            rows: 2,
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted resize-y"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "input",
          {
            type: "text",
            value: newDkTags,
            onChange: (e) => setNewDkTags(e.target.value),
            placeholder: "Tags (comma-separated)",
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "button",
            {
              onClick: handleAddDk,
              disabled: !newDkTitle.trim() || !newDkContent.trim(),
              className: "px-2 py-1 text-xs font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 rounded",
              children: "Add"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-2 pt-2 border-t border-border-secondary", children: [
      hasChanges && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "button",
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: isSaving ? "Saving..." : "Save Changes"
        }
      ),
      onDelete && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_react19 = require("react");
var import_react_window = require("react-window");
var import_lucide_react12 = require("lucide-react");
var import_workflow_utils9 = require("@qontinui/workflow-utils");

// src/components/state-machine/state-view-helpers.ts
var import_lucide_react8 = require("lucide-react");
var import_workflow_utils5 = require("@qontinui/workflow-utils");
var ELEMENT_ICONS = {
  testid: import_lucide_react8.Hash,
  role: import_lucide_react8.MousePointer,
  text: import_lucide_react8.Type,
  ui: import_lucide_react8.Box,
  url: import_lucide_react8.Globe,
  nav: import_lucide_react8.Globe
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
  click: import_lucide_react8.MousePointer,
  type: import_lucide_react8.Type,
  select: import_lucide_react8.Target,
  wait: import_lucide_react8.Layers,
  navigate: import_lucide_react8.Globe
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
  return (0, import_workflow_utils5.getElementLabel)(elementId);
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
var import_react16 = require("react");
var import_lucide_react9 = require("lucide-react");
var import_workflow_utils6 = require("@qontinui/workflow-utils");
var import_jsx_runtime10 = require("react/jsx-runtime");
function SpatialCanvas({
  states,
  transitions,
  selectedStateId,
  onSelectState
}) {
  const canvasRef = (0, import_react16.useRef)(null);
  const containerRef = (0, import_react16.useRef)(null);
  const [canvasSize, setCanvasSize] = (0, import_react16.useState)({ width: 800, height: 600 });
  const [zoom, setZoom] = (0, import_react16.useState)(1);
  const [hoveredStateId, setHoveredStateId] = (0, import_react16.useState)(null);
  const layout = (0, import_react16.useMemo)(
    () => (0, import_workflow_utils6.computeSpatialLayout)(
      states,
      transitions,
      canvasSize.width,
      canvasSize.height
    ),
    [states, transitions, canvasSize.width, canvasSize.height]
  );
  const sharedElements = (0, import_react16.useMemo)(() => {
    const elementStateMap = /* @__PURE__ */ new Map();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, /* @__PURE__ */ new Set());
        elementStateMap.get(eid).add(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);
  (0, import_react16.useEffect)(() => {
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
  (0, import_react16.useEffect)(() => {
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
      const color = import_workflow_utils6.STATE_COLORS[i % import_workflow_utils6.STATE_COLORS.length];
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
  const getStateAtPoint = (0, import_react16.useCallback)(
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
  const handleMouseMove = (0, import_react16.useCallback)(
    (e) => {
      setHoveredStateId(getStateAtPoint(e.clientX, e.clientY));
    },
    [getStateAtPoint]
  );
  const handleClick = (0, import_react16.useCallback)(
    (e) => {
      const stateId = getStateAtPoint(e.clientX, e.clientY);
      onSelectState(stateId === selectedStateId ? null : stateId);
    },
    [getStateAtPoint, onSelectState, selectedStateId]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      ref: containerRef,
      className: "relative w-full h-full bg-bg-secondary",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "absolute top-3 right-3 flex items-center gap-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary",
              onClick: () => setZoom((z) => Math.min(3, z + 0.25)),
              title: "Zoom in",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react9.ZoomIn, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary",
              onClick: () => setZoom((z) => Math.max(0.5, z - 0.25)),
              title: "Zoom out",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react9.ZoomOut, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-xs text-text-secondary hover:text-text-primary",
              onClick: () => setZoom(1),
              title: "Reset zoom",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react9.Maximize, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "absolute bottom-3 left-3 text-[10px] text-text-muted bg-bg-primary/80 backdrop-blur-xs px-2.5 py-1.5 rounded border border-border-secondary/50", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { children: [
            states.length,
            " states"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { children: [
            transitions.length,
            " transitions"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { children: [
            "Zoom: ",
            Math.round(zoom * 100),
            "%"
          ] })
        ] }) }),
        hoveredStateId && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "font-medium text-text-primary", children: states.find((s) => s.state_id === hoveredStateId)?.name }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "text-text-muted mt-0.5", children: [
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
var import_react17 = require("react");
var import_lucide_react10 = require("lucide-react");
var import_workflow_utils7 = require("@qontinui/workflow-utils");
var import_jsx_runtime11 = require("react/jsx-runtime");
function StateLayoutView({
  state,
  elementThumbnails,
  fingerprintDetails
}) {
  const [hoveredElement, setHoveredElement] = (0, import_react17.useState)(null);
  const positionedElements = (0, import_react17.useMemo)(() => {
    const items = [];
    for (const eid of state.element_ids) {
      const pos = resolveElementPosition(eid, fingerprintDetails, state);
      if (!pos) continue;
      const label = resolveElementLabel(eid, fingerprintDetails, state);
      const tag = resolveElementTag(eid, fingerprintDetails, state);
      const prefix = (0, import_workflow_utils7.getElementTypePrefix)(eid);
      const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[(0, import_workflow_utils7.getElementLabel)(eid)];
      items.push({ id: eid, label, tag, position: pos, thumbnail: thumb, prefix });
    }
    return items;
  }, [state, fingerprintDetails, elementThumbnails]);
  const elementsWithoutPosition = state.element_ids.length - positionedElements.length;
  if (positionedElements.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex items-center justify-center h-48 text-text-muted text-xs", children: "No position data available for this state's elements." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("h3", { className: "text-sm font-medium text-text-primary mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react10.Layout, { className: "size-3.5" }),
      "State Layout"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      "div",
      {
        className: "relative bg-bg-tertiary border border-border-secondary rounded-lg",
        style: { aspectRatio: "16 / 10" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "absolute top-0 left-0 right-0 h-[10%] border-b border-dashed border-border-secondary/30" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-[10%] border-t border-dashed border-border-secondary/30" })
          ] }),
          positionedElements.map((el) => {
            const isHovered = hoveredElement === el.id;
            const colorClass = ELEMENT_COLORS[el.prefix] ?? "border-gray-400 bg-gray-500/10 text-gray-300";
            const thumbSrc = el.thumbnail ? el.thumbnail.startsWith("data:") ? el.thumbnail : `data:image/png;base64,${el.thumbnail}` : void 0;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                    "div",
                    {
                      className: `
                  rounded border ${colorClass} overflow-hidden
                  transition-all duration-100 cursor-default
                  ${isHovered ? "ring-2 ring-brand-primary/50 shadow-lg z-20 scale-125" : "z-10"}
                `,
                      style: { width: thumbSrc ? 32 : void 0, height: thumbSrc ? 32 : void 0 },
                      children: thumbSrc ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                        "img",
                        {
                          src: thumbSrc,
                          alt: el.label,
                          className: "w-full h-full object-contain"
                        }
                      ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "px-1 py-0.5 text-[8px] whitespace-nowrap max-w-[80px] truncate", children: el.label })
                    }
                  ),
                  isHovered && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-bg-primary/95 backdrop-blur-xs border border-border-secondary rounded px-2 py-1 shadow-md whitespace-nowrap", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "text-[10px] font-medium text-text-primary", children: el.label }),
                    el.tag && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "text-[9px] text-text-muted", children: [el.tag.tagName && `<${el.tag.tagName}>`, el.tag.role && `role="${el.tag.role}"`, el.tag.zone].filter(Boolean).join(" ") })
                  ] })
                ]
              },
              el.id
            );
          })
        ]
      }
    ),
    elementsWithoutPosition > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "text-[10px] text-text-muted mt-1.5", children: [
      elementsWithoutPosition,
      " element",
      elementsWithoutPosition !== 1 ? "s" : "",
      " without position data"
    ] })
  ] });
}

// src/components/state-machine/ScreenshotStateView.tsx
var import_react18 = require("react");
var import_lucide_react11 = require("lucide-react");
var import_workflow_utils8 = require("@qontinui/workflow-utils");
var import_jsx_runtime12 = require("react/jsx-runtime");
function ScreenshotStateView({
  captureScreenshots,
  onLoadScreenshotImage,
  states,
  selectedStateIds,
  fingerprintDetails,
  elementThumbnails
}) {
  const canvasRef = (0, import_react18.useRef)(null);
  const containerRef = (0, import_react18.useRef)(null);
  const imageCache = (0, import_react18.useRef)(/* @__PURE__ */ new Map());
  const thumbnailLoadingRef = (0, import_react18.useRef)(/* @__PURE__ */ new Set());
  const [currentIndex, setCurrentIndex] = (0, import_react18.useState)(0);
  const [userZoom, setUserZoom] = (0, import_react18.useState)(null);
  const [autoFitZoom, setAutoFitZoom] = (0, import_react18.useState)(1);
  const zoom = userZoom ?? autoFitZoom;
  const [hoveredElement, setHoveredElement] = (0, import_react18.useState)(null);
  const [canvasSize, setCanvasSize] = (0, import_react18.useState)({ width: 800, height: 600 });
  const [isLoading, setIsLoading] = (0, import_react18.useState)(false);
  const [selectedElementHash, setSelectedElementHash] = (0, import_react18.useState)(null);
  const [thumbnailCache, setThumbnailCache] = (0, import_react18.useState)(/* @__PURE__ */ new Map());
  const capture = captureScreenshots[currentIndex];
  const elementBounds = (0, import_react18.useMemo)(() => {
    if (!capture) return {};
    try {
      return JSON.parse(capture.elementBoundsJson);
    } catch {
      return {};
    }
  }, [capture]);
  const selectedStateHashes = (0, import_react18.useMemo)(() => {
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
  const selectedStates = (0, import_react18.useMemo)(
    () => states.filter((s) => selectedStateIds.has(s.state_id)),
    [states, selectedStateIds]
  );
  const hashToElement = (0, import_react18.useMemo)(() => {
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
  const matchingScreenshotIndices = (0, import_react18.useMemo)(() => {
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
  (0, import_react18.useEffect)(() => {
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
  (0, import_react18.useEffect)(() => {
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
  (0, import_react18.useEffect)(() => {
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
  (0, import_react18.useEffect)(() => {
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
  (0, import_react18.useEffect)(() => {
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
  const getElementAtPoint = (0, import_react18.useCallback)(
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
  const handleMouseMove = (0, import_react18.useCallback)(
    (e) => {
      setHoveredElement(getElementAtPoint(e.clientX, e.clientY));
    },
    [getElementAtPoint]
  );
  const handleCanvasClick = (0, import_react18.useCallback)(
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
  const handlePrev = (0, import_react18.useCallback)(
    () => setCurrentIndex((i) => Math.max(0, i - 1)),
    []
  );
  const handleNext = (0, import_react18.useCallback)(
    () => setCurrentIndex((i) => Math.min(captureScreenshots.length - 1, i + 1)),
    [captureScreenshots.length]
  );
  (0, import_react18.useEffect)(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedElementHash(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);
  if (captureScreenshots.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.Image, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-sm", children: "No capture screenshots available" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-xs mt-1 text-text-muted/70", children: "Run a state discovery to capture screenshots" })
    ] }) });
  }
  const selectedFp = selectedElementHash ? fingerprintDetails?.[selectedElementHash] ?? null : null;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "w-56 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: selectedStates.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex flex-col", children: selectedStates.map((state, stateIdx) => {
      const colorIdx = states.indexOf(state);
      const color = import_workflow_utils8.STATE_COLORS[colorIdx % import_workflow_utils8.STATE_COLORS.length];
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: stateIdx > 0 ? "border-t border-border-secondary" : "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "p-2 border-b border-border-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "w-2 h-2 rounded-full shrink-0", style: { backgroundColor: color.border } }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h4", { className: "text-[10px] font-semibold text-text-primary uppercase tracking-wider truncate", children: state.name }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "text-[9px] text-text-muted ml-auto shrink-0", children: state.element_ids.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "p-1.5 space-y-0.5", children: state.element_ids.map((eid) => {
          const hash = getFingerprintHash(eid);
          const label = resolveElementLabel(eid, fingerprintDetails, state);
          const thumb = elementThumbnails?.[hash] ?? elementThumbnails?.[eid];
          const isActive = hash === selectedElementHash;
          return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            "button",
            {
              onClick: () => setSelectedElementHash(isActive ? null : hash),
              className: `w-full flex items-center gap-1.5 text-[10px] px-2 py-1 rounded text-left ${isActive ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-bg-secondary text-text-primary"}`,
              children: [
                thumb ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "img",
                  {
                    src: thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`,
                    alt: label,
                    className: "w-5 h-5 object-cover rounded shrink-0"
                  }
                ) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.Layers, { className: "size-3 text-text-muted shrink-0" }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "truncate", children: label })
              ]
            },
            eid
          );
        }) })
      ] }, state.state_id);
    }) }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "text-center px-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.Layers, { className: "size-8 mx-auto mb-2 opacity-30" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-xs", children: "Select a state to see its elements" })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-2 px-3 py-1.5 border-b border-border-secondary bg-bg-primary shrink-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "button",
          {
            className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary disabled:opacity-30",
            onClick: handlePrev,
            disabled: currentIndex === 0,
            title: "Previous capture",
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.ChevronLeft, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: "text-[10px] text-text-primary min-w-[70px] text-center", children: [
          currentIndex + 1,
          " / ",
          captureScreenshots.length
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "button",
          {
            className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary disabled:opacity-30",
            onClick: handleNext,
            disabled: currentIndex === captureScreenshots.length - 1,
            title: "Next capture",
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.ChevronRight, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex-1" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-0.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary",
              onClick: () => setUserZoom(Math.max(0.1, zoom - 0.25)),
              title: "Zoom out",
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.ZoomOut, { className: "size-3" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: "text-[10px] text-text-muted w-8 text-center", children: [
            Math.round(zoom * 100),
            "%"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary",
              onClick: () => setUserZoom(Math.min(3, zoom + 0.25)),
              title: "Zoom in",
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.ZoomIn, { className: "size-3" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              className: "h-6 w-6 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary",
              onClick: () => setUserZoom(null),
              title: "Fit to view",
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.Maximize, { className: "size-3" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { ref: containerRef, className: "relative flex-1 bg-bg-secondary overflow-hidden", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
        isLoading && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-bg-secondary/50", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "animate-spin size-6 border-2 border-brand-primary border-t-transparent rounded-full" }) }),
        hoveredElement && hoveredElement !== selectedElementHash && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md max-w-[280px] pointer-events-none", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "font-medium text-text-primary truncate", children: (() => {
            const entry = hashToElement.get(hoveredElement);
            return entry ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state) : hoveredElement;
          })() }),
          (() => {
            const fp = fingerprintDetails?.[hoveredElement];
            if (!fp) return null;
            return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "text-text-muted mt-0.5", children: [
              "<",
              fp.tagName,
              ">",
              fp.role ? ` role="${fp.role}"` : ""
            ] });
          })()
        ] }),
        selectedElementHash && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "absolute bottom-2 left-2 right-2 text-xs bg-bg-primary/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-border-secondary shadow-md", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "font-medium text-text-primary truncate", children: (() => {
              const entry = hashToElement.get(selectedElementHash);
              return entry ? resolveElementLabel(entry.elementId, fingerprintDetails, entry.state) : selectedElementHash;
            })() }),
            selectedFp && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "text-[10px] text-text-muted mt-0.5", children: [
              "<",
              selectedFp.tagName,
              ">",
              selectedFp.role ? ` role="${selectedFp.role}"` : "",
              selectedFp.positionZone ? ` \xB7 ${selectedFp.positionZone}` : ""
            ] }),
            elementBounds[selectedElementHash] && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "text-[10px] text-text-muted mt-0.5", children: [
              Math.round(elementBounds[selectedElementHash].x),
              ", ",
              Math.round(elementBounds[selectedElementHash].y),
              " \xB7 ",
              Math.round(elementBounds[selectedElementHash].width),
              "\xD7",
              Math.round(elementBounds[selectedElementHash].height)
            ] })
          ] }),
          elementThumbnails?.[selectedElementHash] && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "img",
            {
              src: elementThumbnails[selectedElementHash].startsWith("data:") ? elementThumbnails[selectedElementHash] : `data:image/png;base64,${elementThumbnails[selectedElementHash]}`,
              alt: "Element thumbnail",
              className: "w-12 h-12 object-cover rounded border border-border-secondary shrink-0"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "button",
            {
              onClick: () => setSelectedElementHash(null),
              className: "text-text-muted hover:text-text-primary shrink-0",
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.X, { className: "size-3.5" })
            }
          )
        ] }) }),
        !selectedElementHash && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "absolute bottom-2 right-2 text-[9px] text-text-muted bg-bg-primary/80 backdrop-blur-xs px-2 py-1 rounded border border-border-secondary/50", children: selectedStateIds.size > 0 ? `${Object.keys(elementBounds).filter((h) => selectedStateHashes.has(h)).length} / ${Object.keys(elementBounds).length} elements` : `${Object.keys(elementBounds).length} elements` })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "w-48 border-l border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "p-2 border-b border-border-secondary", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("h4", { className: "text-[10px] font-semibold text-text-muted uppercase tracking-wider", children: [
        "Screenshots ",
        selectedStateIds.size > 0 && `(${matchingScreenshotIndices.length})`
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "p-1.5 space-y-1.5", children: [
        matchingScreenshotIndices.map((idx) => {
          const cap = captureScreenshots[idx];
          const isCurrent = idx === currentIndex;
          return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            "button",
            {
              onClick: () => setCurrentIndex(idx),
              className: `w-full rounded border-2 transition-colors overflow-hidden ${isCurrent ? "border-blue-500" : "border-transparent hover:border-border-secondary"}`,
              children: [
                thumbnailCache.has(cap.id) ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "img",
                  {
                    src: thumbnailCache.get(cap.id),
                    alt: `Capture ${cap.captureIndex + 1}`,
                    className: "w-full h-auto object-cover",
                    style: { maxHeight: 100 }
                  }
                ) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "w-full h-16 bg-bg-tertiary flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react11.Image, { className: "size-4 text-text-muted opacity-30" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "text-[9px] text-text-muted px-1 py-0.5 text-center truncate", children: [
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
        matchingScreenshotIndices.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-[10px] text-text-muted text-center py-4", children: "No screenshots match selected state(s)" })
      ] })
    ] })
  ] });
}

// src/components/state-machine/StateViewPanel.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
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
  const color = import_workflow_utils9.STATE_COLORS[colorIdx % import_workflow_utils9.STATE_COLORS.length];
  const isSelected = viewMode === "screenshot" ? selectedStateIds.has(state.state_id) : state.state_id === effectiveSelectedStateId;
  const isExpanded = expandedStates.has(state.state_id);
  const stateOutgoing = transitionMap.outgoing.get(state.state_id) ?? [];
  const stateIncoming = transitionMap.incoming.get(state.state_id) ?? [];
  const isInitial = state.extra_metadata?.initial === true;
  const isBlocking = state.extra_metadata?.blocking === true;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style, ...ariaAttributes, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
      "button",
      {
        "data-ui-id": `state-item-${state.state_id}`,
        onClick: (e) => onRowClick(state, e),
        className: `
          w-full text-left px-3 py-2 rounded-md transition-colors text-sm
          ${isSelected ? "bg-brand-primary/10 border border-brand-primary/30" : "hover:bg-bg-secondary border border-transparent"}
        `,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "div",
              {
                className: "w-2.5 h-2.5 rounded-full shrink-0",
                style: { backgroundColor: color.border }
              }
            ),
            isInitial && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Play, { className: "size-3 text-yellow-500 fill-yellow-500 shrink-0" }),
            isBlocking && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Lock, { className: "size-3 text-amber-500 shrink-0" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "font-medium text-text-primary truncate flex-1", children: state.name }),
            isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.ChevronDown, { className: "size-3 text-text-muted transition-transform" }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.ChevronRight, { className: "size-3 text-text-muted transition-transform" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2 mt-1 ml-4.5 text-xs text-text-muted", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { children: [
              state.element_ids.length,
              " elements"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
              "span",
              {
                className: Math.round(state.confidence * 100) >= 80 ? "text-green-400" : Math.round(state.confidence * 100) >= 50 ? "text-amber-400" : "text-red-400",
                children: [
                  Math.round(state.confidence * 100),
                  "%"
                ]
              }
            ),
            stateOutgoing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-brand-secondary flex items-center gap-0.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.ArrowUpRight, { className: "size-2" }),
              stateOutgoing.length
            ] }),
            stateIncoming.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-brand-primary flex items-center gap-0.5", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.ArrowDownLeft, { className: "size-2" }),
              stateIncoming.length
            ] })
          ] })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "ml-5 pl-2 border-l border-border-secondary mt-1 mb-2 space-y-0.5", children: [
      state.element_ids.slice(0, 20).map((eid) => {
        const prefix = (0, import_workflow_utils9.getElementTypePrefix)(eid);
        const label = resolveElementLabel(eid, fingerprintDetails, state);
        const Icon = ELEMENT_ICONS[prefix] ?? import_lucide_react12.Layers;
        const stateCount = sharedElements.get(eid)?.length ?? 1;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "div",
          {
            className: "text-[10px] text-text-muted flex items-center gap-1 py-0.5 px-1 rounded hover:bg-bg-secondary",
            title: `${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { className: "size-2.5 shrink-0" }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "truncate flex-1", children: label }),
              stateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-[8px] text-brand-primary bg-brand-primary/10 px-1 rounded-full shrink-0", children: stateCount })
            ]
          },
          eid
        );
      }),
      state.element_ids.length > 20 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "text-[10px] text-text-muted py-0.5 px-1", children: [
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
  const [expandedStates, setExpandedStates] = (0, import_react19.useState)(/* @__PURE__ */ new Set());
  const [searchFilter, setSearchFilter] = (0, import_react19.useState)("");
  const [viewMode, setViewMode] = (0, import_react19.useState)(
    captureScreenshots && captureScreenshots.length > 0 ? "screenshot" : "list"
  );
  const [hasAutoSwitched, setHasAutoSwitched] = (0, import_react19.useState)(
    () => !!(captureScreenshots && captureScreenshots.length > 0)
  );
  (0, import_react19.useEffect)(() => {
    if (!hasAutoSwitched && captureScreenshots && captureScreenshots.length > 0) {
      setViewMode("screenshot");
      setHasAutoSwitched(true);
    }
  }, [captureScreenshots, hasAutoSwitched]);
  const [selectedStateIds, setSelectedStateIds] = (0, import_react19.useState)(/* @__PURE__ */ new Set());
  const effectiveSelectedStateId = selectedStateId;
  const selectedState = (0, import_react19.useMemo)(
    () => states.find((s) => s.state_id === effectiveSelectedStateId),
    [states, effectiveSelectedStateId]
  );
  const transitionMap = (0, import_react19.useMemo)(() => {
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
  const elementGroups = (0, import_react19.useMemo)(() => {
    if (!selectedState) return /* @__PURE__ */ new Map();
    const groups = /* @__PURE__ */ new Map();
    for (const eid of selectedState.element_ids) {
      const prefix = (0, import_workflow_utils9.getElementTypePrefix)(eid);
      if (!groups.has(prefix)) groups.set(prefix, []);
      groups.get(prefix).push(eid);
    }
    return groups;
  }, [selectedState]);
  const sharedElements = (0, import_react19.useMemo)(() => {
    const elementStateMap = /* @__PURE__ */ new Map();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, []);
        elementStateMap.get(eid).push(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);
  const filteredStates = (0, import_react19.useMemo)(() => {
    if (!searchFilter) return states;
    const lower = searchFilter.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.state_id.toLowerCase().includes(lower) || s.element_ids.some((eid) => eid.toLowerCase().includes(lower))
    );
  }, [states, searchFilter]);
  const toggleExpanded = (0, import_react19.useCallback)((stateId) => {
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
  const listRef = (0, import_react_window.useListRef)(null);
  const dynamicRowHeight = (0, import_react_window.useDynamicRowHeight)({ defaultRowHeight: 60 });
  const handleRowClick = (0, import_react19.useCallback)(
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
  (0, import_react19.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex flex-1 h-full min-w-0", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "w-72 border-r border-border-secondary bg-bg-primary shrink-0 flex flex-col min-h-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "p-3 border-b border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Layers, { className: "size-4 text-brand-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "States" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-xs text-text-muted ml-auto", children: states.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center border border-border-secondary rounded overflow-hidden", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "button",
              {
                onClick: () => setViewMode("list"),
                className: `p-1 ${viewMode === "list" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "List view",
                children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.List, { className: "size-3.5" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "button",
              {
                onClick: () => setViewMode("spatial"),
                className: `p-1 ${viewMode === "spatial" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "Spatial view",
                children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.BarChart3, { className: "size-3.5" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "button",
              {
                onClick: () => setViewMode("screenshot"),
                className: `p-1 ${viewMode === "screenshot" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "Screenshot view",
                disabled: !captureScreenshots || captureScreenshots.length === 0,
                children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Image, { className: "size-3.5" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex-1 min-h-0 p-2", children: filteredStates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-xs text-text-muted text-center py-4", children: "No states match filter." }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        import_react_window.List,
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
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex-1 overflow-hidden", children: viewMode === "screenshot" && captureScreenshots && onLoadScreenshotImage ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ScreenshotStateView,
      {
        captureScreenshots,
        onLoadScreenshotImage,
        states,
        selectedStateIds,
        fingerprintDetails,
        elementThumbnails
      }
    ) : viewMode === "spatial" ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      SpatialCanvas,
      {
        states,
        transitions,
        selectedStateId: effectiveSelectedStateId,
        onSelectState
      }
    ) : selectedState ? /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h2", { className: "text-lg font-semibold text-text-primary", children: selectedState.name }),
          selectedState.extra_metadata?.initial === true && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-yellow-500/20 text-yellow-400 border-yellow-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Play, { className: "size-2.5 fill-current" }),
            "Initial"
          ] }),
          selectedState.extra_metadata?.blocking === true && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-amber-500/20 text-amber-400 border-amber-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Lock, { className: "size-2.5" }),
            "Blocking"
          ] })
        ] }),
        selectedState.description && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-sm text-text-muted mt-1", children: selectedState.description }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-3 mt-2 text-xs text-text-muted", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            selectedState.element_ids.length,
            " elements"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            selectedState.render_ids.length,
            " renders"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h3", { className: "text-sm font-medium text-text-primary mb-3", children: "Elements by Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "space-y-3", children: Array.from(elementGroups.entries()).map(
          ([prefix, elements]) => {
            const Icon = ELEMENT_ICONS[prefix] ?? import_lucide_react12.Layers;
            const colorClass = ELEMENT_COLORS[prefix] ?? "border-gray-400 bg-gray-500/10 text-gray-300";
            return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-2 mb-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { className: "size-3.5" }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-xs font-medium text-text-primary capitalize", children: prefix }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-xs text-text-muted", children: [
                  "(",
                  elements.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex flex-wrap gap-1.5", children: elements.map((eid) => {
                const stateCount = sharedElements.get(eid)?.length ?? 1;
                const rawLabel = (0, import_workflow_utils9.getElementLabel)(eid);
                const descriptiveLabel = resolveElementLabel(eid, fingerprintDetails, selectedState);
                const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[rawLabel];
                return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  "div",
                  {
                    className: `rounded border ${colorClass} overflow-hidden ${thumb ? "flex flex-col items-center w-16" : "text-[11px] px-2 py-0.5 inline-flex items-center gap-1"}`,
                    title: `${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`,
                    children: thumb ? /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "relative", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                          "img",
                          {
                            src: thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`,
                            alt: descriptiveLabel,
                            className: "w-12 h-12 object-cover"
                          }
                        ),
                        stateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "absolute -top-1 -right-1 text-[7px] bg-brand-primary/90 text-white px-1 rounded-full leading-tight", children: [
                          "x",
                          stateCount
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-[8px] text-center px-0.5 py-0.5 truncate w-full leading-tight", children: descriptiveLabel })
                    ] }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
                      descriptiveLabel,
                      stateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-[8px] opacity-70 bg-white/10 px-0.5 rounded", children: [
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
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        StateLayoutView,
        {
          state: selectedState,
          elementThumbnails,
          fingerprintDetails
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h3", { className: "text-sm font-medium text-text-primary mb-3", children: "Transitions" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-2", children: [
          (transitionMap.outgoing.get(selectedState.state_id) ?? []).map(
            (t) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.ArrowRight, { className: "size-3 text-brand-secondary shrink-0" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "font-medium text-text-primary", children: t.name }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "flex items-center gap-0.5 shrink-0", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((actionType) => {
                    const ActionIcon = ACTION_ICONS3[actionType];
                    return ActionIcon ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                      ActionIcon,
                      {
                        className: `size-2.5 ${(0, import_workflow_utils9.getActionTypeColor)(actionType)}`
                      },
                      actionType
                    ) : null;
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.ArrowRight, { className: "size-2.5 text-text-muted" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-text-muted truncate", children: t.activate_states.map(
                    (sid) => states.find((s) => s.state_id === sid)?.name ?? sid
                  ).join(", ") }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-text-muted ml-auto text-[10px] shrink-0", children: [
                    t.actions.length,
                    " action",
                    t.actions.length !== 1 ? "s" : ""
                  ] }),
                  t.stays_visible && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Eye, { className: "size-3 text-green-400 shrink-0" })
                ]
              },
              `out-${t.transition_id}`
            )
          ),
          (transitionMap.incoming.get(selectedState.state_id) ?? []).map(
            (t) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.CheckCircle, { className: "size-3 text-brand-primary shrink-0" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "font-medium text-text-primary", children: t.name }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "flex items-center gap-0.5 shrink-0", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((actionType) => {
                    const ActionIcon = ACTION_ICONS3[actionType];
                    return ActionIcon ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                      ActionIcon,
                      {
                        className: `size-2.5 ${(0, import_workflow_utils9.getActionTypeColor)(actionType)}`
                      },
                      actionType
                    ) : null;
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-text-muted truncate", children: [
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
          (transitionMap.outgoing.get(selectedState.state_id) ?? []).length === 0 && (transitionMap.incoming.get(selectedState.state_id) ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-xs text-text-muted", children: "No transitions connected." })
        ] })
      ] }),
      selectedState.acceptance_criteria.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h3", { className: "text-sm font-medium text-text-primary mb-2", children: "Acceptance Criteria" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("ul", { className: "space-y-1", children: selectedState.acceptance_criteria.map((criteria, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "li",
          {
            className: "text-xs text-text-muted flex items-start gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.CheckCircle, { className: "size-3 text-green-500 mt-0.5 shrink-0" }),
              criteria
            ]
          },
          `${i}-${criteria}`
        )) })
      ] }),
      selectedState.domain_knowledge.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("h3", { className: "text-sm font-medium text-text-primary mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.BookOpen, { className: "size-3.5 inline mr-1" }),
          "Domain Knowledge"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "space-y-2", children: selectedState.domain_knowledge.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "div",
          {
            className: "p-3 rounded-lg bg-bg-secondary border border-border-secondary",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "text-xs font-medium text-text-primary", children: dk.title }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "text-[10px] text-text-muted mt-1 line-clamp-3", children: dk.content }),
              dk.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex flex-wrap gap-1 mt-1.5", children: dk.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
          "State ID:",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("code", { className: "bg-bg-secondary px-1 rounded", children: selectedState.state_id })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
          "Created:",
          " ",
          new Date(selectedState.created_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { children: [
          "Updated:",
          " ",
          new Date(selectedState.updated_at).toLocaleDateString()
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react12.Layers, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-sm", children: "Select a state to view its details" }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("p", { className: "text-xs mt-1 text-text-muted/70", children: [
        states.length,
        " state",
        states.length !== 1 ? "s" : "",
        " available"
      ] })
    ] }) }) })
  ] });
}

// src/components/state-machine/PathfindingPanel.tsx
var import_react20 = require("react");
var import_workflow_utils10 = require("@qontinui/workflow-utils");
var import_jsx_runtime14 = require("react/jsx-runtime");
function PathfindingPanel({
  states,
  transitions,
  onPathFound,
  onFindPath
}) {
  const [fromStateId, setFromStateId] = (0, import_react20.useState)("");
  const [targetStateId, setTargetStateId] = (0, import_react20.useState)("");
  const [algorithm, setAlgorithm] = (0, import_react20.useState)("dijkstra");
  const [result, setResult] = (0, import_react20.useState)(null);
  const [isSearching, setIsSearching] = (0, import_react20.useState)(false);
  const handleFind = (0, import_react20.useCallback)(async () => {
    if (!fromStateId || !targetStateId) return;
    setIsSearching(true);
    try {
      let pathResult;
      if (onFindPath) {
        pathResult = await onFindPath([fromStateId], [targetStateId]);
      } else {
        pathResult = (0, import_workflow_utils10.findPath)(
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
  const clearResult = (0, import_react20.useCallback)(() => {
    setResult(null);
    onPathFound?.({ found: false, steps: [], total_cost: 0 });
  }, [onPathFound]);
  const stateName = (stateId) => states.find((s) => s.state_id === stateId)?.name ?? stateId;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Pathfinding" }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "From" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          "select",
          {
            value: fromStateId,
            onChange: (e) => setFromStateId(e.target.value),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
            style: { colorScheme: "dark" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "", children: "Select state..." }),
              states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "To" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          "select",
          {
            value: targetStateId,
            onChange: (e) => setTargetStateId(e.target.value),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
            style: { colorScheme: "dark" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "", children: "Select state..." }),
              states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex gap-2", children: [
      !onFindPath && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        "select",
        {
          value: algorithm,
          onChange: (e) => setAlgorithm(e.target.value),
          className: "px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary [&>option]:text-black [&>option]:bg-white",
          style: { colorScheme: "dark" },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "dijkstra", children: "Dijkstra (cheapest)" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "bfs", children: "BFS (shortest)" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "button",
        {
          onClick: handleFind,
          disabled: !fromStateId || !targetStateId || isSearching,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: isSearching ? "Searching..." : "Find Path" })
        }
      ),
      result && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "button",
        {
          onClick: clearResult,
          className: "px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border-secondary rounded",
          children: "Clear"
        }
      )
    ] }),
    result && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "border-t border-border-secondary pt-3", children: result.found ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "text-xs text-green-400 font-medium", children: [
          "Path found (",
          result.steps.length,
          " step",
          result.steps.length !== 1 ? "s" : "",
          ")"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "text-xs text-text-secondary", children: [
          "Total cost: ",
          result.total_cost.toFixed(1)
        ] })
      ] }),
      result.steps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-xs text-text-secondary italic", children: "Already at target state" }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "space-y-1.5", children: result.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        "div",
        {
          className: "p-2 bg-bg-tertiary border border-border-secondary rounded text-xs",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "font-medium text-text-primary", children: [
                i + 1,
                ". ",
                step.transition_name
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "text-text-secondary", children: [
                "cost: ",
                step.path_cost.toFixed(1)
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mt-1 text-text-secondary", children: [
              step.from_states.map(stateName).join(", "),
              " \u2192 ",
              step.activate_states.map(stateName).join(", "),
              step.exit_states.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "text-red-400", children: [
                " (exits: ",
                step.exit_states.map(stateName).join(", "),
                ")"
              ] })
            ] })
          ]
        },
        `${i}-${step.transition_name}`
      )) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "text-xs text-red-400", children: result.error ?? "No path found between the specified states" }) })
  ] });
}

// src/components/state-machine/StateViewTable.tsx
var import_react21 = require("react");
var import_workflow_utils11 = require("@qontinui/workflow-utils");
var import_jsx_runtime15 = require("react/jsx-runtime");
function StateViewTable({
  states,
  selectedStateId,
  onSelectState
}) {
  const [filter, setFilter] = (0, import_react21.useState)("");
  const filteredStates = (0, import_react21.useMemo)(() => {
    if (!filter.trim()) return states;
    const q = filter.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(q) || s.element_ids.some((eid) => eid.toLowerCase().includes(q))
    );
  }, [states, filter]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex flex-col gap-3 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("h3", { className: "text-sm font-semibold text-text-primary", children: [
      "States (",
      states.length,
      ")"
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "input",
      {
        type: "text",
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        placeholder: "Filter by name or element ID...",
        className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "space-y-1", children: [
      filteredStates.map((state) => {
        const isSelected = state.state_id === selectedStateId;
        const confidenceColor = (0, import_workflow_utils11.getConfidenceColor)(state.confidence);
        const confidencePct = Math.round(state.confidence * 100);
        const typeCounts = /* @__PURE__ */ new Map();
        for (const eid of state.element_ids) {
          const prefix = (0, import_workflow_utils11.getElementTypePrefix)(eid);
          typeCounts.set(prefix, (typeCounts.get(prefix) ?? 0) + 1);
        }
        const sortedTypes = Array.from(typeCounts.entries()).sort(
          (a, b) => b[1] - a[1]
        );
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
          "button",
          {
            onClick: () => onSelectState(isSelected ? null : state.state_id),
            className: `w-full text-left p-2.5 rounded border transition-colors ${isSelected ? "bg-brand-primary/10 border-brand-primary/30" : "bg-bg-tertiary border-border-secondary hover:border-text-muted"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-sm font-medium text-text-primary truncate", children: state.name }),
                /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center gap-2 text-xs shrink-0 ml-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "text-text-secondary", children: [
                    state.element_ids.length,
                    " el"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: confidenceColor, children: [
                    confidencePct,
                    "%"
                  ] })
                ] })
              ] }),
              sortedTypes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                sortedTypes.slice(0, 5).map(([prefix, count]) => {
                  const style = (0, import_workflow_utils11.getElementTypeStyle)(`${prefix}:dummy`);
                  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
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
                sortedTypes.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "px-1 py-0.5 text-[10px] text-text-muted", children: [
                  "+",
                  sortedTypes.length - 5,
                  " more"
                ] })
              ] }),
              state.description && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-xs text-text-secondary mt-1 line-clamp-1", children: state.description })
            ]
          },
          state.state_id
        );
      }),
      filteredStates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-xs text-text-muted italic text-center py-4", children: filter ? "No states match the filter" : "No states in this config" })
    ] })
  ] });
}

// src/components/state-machine/DiagramTab.tsx
var import_react22 = require("react");
var import_lucide_react13 = require("lucide-react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function DiagramTab({
  activeStateIds,
  diagramSource,
  isLoading,
  onRefresh,
  unavailableReason
}) {
  const containerRef = (0, import_react22.useRef)(null);
  const [importError, setImportError] = (0, import_react22.useState)(null);
  const [renderError, setRenderError] = (0, import_react22.useState)(null);
  (0, import_react22.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex flex-col h-full w-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-center justify-between px-6 py-3 border-b border-border-primary bg-surface-primary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react13.Workflow, { className: "size-4 text-brand-primary" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h2", { className: "text-sm font-semibold text-text-primary", children: "State Machine Diagram" }),
        activeStateIds && activeStateIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("span", { className: "text-xs text-text-muted ml-2", children: [
          "(highlighting ",
          activeStateIds.length,
          " hypothetical active state",
          activeStateIds.length === 1 ? "" : "s",
          ")"
        ] })
      ] }),
      onRefresh && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
        "button",
        {
          type: "button",
          onClick: onRefresh,
          disabled: isLoading,
          className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border border-border-primary text-text-primary hover:bg-surface-secondary disabled:opacity-50",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
              import_lucide_react13.RefreshCw,
              {
                className: `size-3.5 ${isLoading ? "animate-spin" : ""}`
              }
            ),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex-1 min-h-0 overflow-auto p-6 bg-surface-secondary", children: [
      unavailableReason && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted text-sm text-center px-6", children: unavailableReason }),
      !unavailableReason && isLoading && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex items-center justify-center h-full text-text-muted gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react13.Loader2, { className: "size-4 animate-spin" }),
        "Loading diagram\u2026"
      ] }),
      !unavailableReason && !isLoading && importError && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "max-w-xl mx-auto p-4 border border-border-primary rounded-md bg-surface-primary text-sm text-text-primary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "font-semibold mb-1", children: "Mermaid is not available in this bundle." }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("p", { className: "text-text-muted", children: [
          "Install ",
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("code", { className: "font-mono", children: "mermaid" }),
          " (e.g.",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("code", { className: "font-mono", children: "npm install mermaid" }),
          ") to enable the Diagram tab."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("p", { className: "text-xs text-text-muted mt-2", children: [
          "Import error: ",
          importError
        ] })
      ] }),
      !unavailableReason && !isLoading && !importError && !hasSource && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: "No diagram available" }),
      !unavailableReason && !isLoading && !importError && hasSource && renderError && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "max-w-xl mx-auto p-4 border border-border-primary rounded-md bg-surface-primary text-sm", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "font-semibold mb-1 text-text-primary", children: "Failed to render diagram." }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("pre", { className: "text-xs text-text-muted whitespace-pre-wrap", children: renderError })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map