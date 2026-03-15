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
var import_react5 = require("react");
var import_react6 = require("@xyflow/react");
var import_lucide_react3 = require("lucide-react");
var import_workflow_utils = require("@qontinui/workflow-utils");

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
                flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border shadow-sm
                transition-all duration-150
                ${isActive ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/20" : "bg-bg-primary/95 text-text-muted border-border-secondary hover:border-brand-primary/40 backdrop-blur-sm"}
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

// src/components/state-machine/StateMachineGraphView.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var nodeTypes = { stateNode: StateMachineStateNode };
var edgeTypes = { transitionEdge: StateMachineTransitionEdge };
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
  const [showShortcuts, setShowShortcuts] = (0, import_react5.useState)(false);
  const reactFlowInstance = (0, import_react6.useReactFlow)();
  const prevStateCountRef = (0, import_react5.useRef)(states.length);
  const highlightedTransitionIds = (0, import_react5.useMemo)(
    () => new Set(highlightedPath?.map((s) => s.transition_id) ?? []),
    [highlightedPath]
  );
  const effectiveInitialStateId = (0, import_react5.useMemo)(() => {
    if (initialStateId) return initialStateId;
    const markedInitial = states.find(
      (s) => s.extra_metadata?.initial === true
    );
    if (markedInitial) return markedInitial.state_id;
    return states[0]?.state_id ?? null;
  }, [states, initialStateId]);
  const transitionCounts = (0, import_react5.useMemo)(() => {
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const t of transitions) {
      for (const from of t.from_states) outgoing.set(from, (outgoing.get(from) ?? 0) + 1);
      for (const to of t.activate_states) incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
    return { outgoing, incoming };
  }, [transitions]);
  const initialNodes = (0, import_react5.useMemo)(
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
  const getSelectionId = (0, import_react5.useCallback)(
    (trans) => {
      if (resolveTransitionSelectionId) return resolveTransitionSelectionId(trans);
      return trans.transition_id;
    },
    [resolveTransitionSelectionId]
  );
  const selectedTransitionSemanticId = (0, import_react5.useMemo)(() => {
    if (!selectedTransitionId) return null;
    const trans = transitions.find((t) => getSelectionId(t) === selectedTransitionId);
    return trans?.transition_id ?? null;
  }, [selectedTransitionId, transitions, getSelectionId]);
  const initialEdges = (0, import_react5.useMemo)(() => {
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
            markerEnd: { type: import_react6.MarkerType.ArrowClosed, width: 15, height: 15 },
            data: {
              transitionId: trans.transition_id,
              name: trans.name,
              pathCost: trans.path_cost,
              actionCount: trans.actions.length,
              actionTypes: trans.actions.map((a) => a.type),
              isHighlighted: highlightedTransitionIds.has(trans.transition_id),
              staysVisible: trans.stays_visible,
              firstActionTarget: trans.actions[0]?.target ?? trans.actions[0]?.url ?? void 0
            }
          });
        }
      }
    }
    return edges2;
  }, [transitions, highlightedTransitionIds, selectedTransitionSemanticId]);
  const layouted = (0, import_react5.useMemo)(() => {
    if (initialNodes.length === 0) return { nodes: [], edges: [] };
    return (0, import_workflow_utils.getLayoutedElements)(dagreLib, initialNodes, initialEdges, import_workflow_utils.STATE_MACHINE_LAYOUT_OPTIONS);
  }, [dagreLib, initialNodes, initialEdges]);
  const [nodes, setNodes, onNodesChange] = (0, import_react6.useNodesState)(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = (0, import_react6.useEdgesState)(layouted.edges);
  (0, import_react5.useEffect)(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [layouted, setNodes, setEdges]);
  (0, import_react5.useEffect)(() => {
    if (states.length > prevStateCountRef.current) {
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }), 100);
    }
    prevStateCountRef.current = states.length;
  }, [states.length, reactFlowInstance]);
  const onSelectionChange = (0, import_react5.useCallback)(
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
  const handleRelayout = (0, import_react5.useCallback)(() => {
    const result = (0, import_workflow_utils.getLayoutedElements)(dagreLib, nodes, edges, import_workflow_utils.STATE_MACHINE_LAYOUT_OPTIONS);
    setNodes(result.nodes);
    setEdges(result.edges);
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }), 50);
  }, [dagreLib, nodes, edges, setNodes, setEdges, reactFlowInstance]);
  (0, import_react5.useEffect)(() => {
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
        reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
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
  const graphStats = (0, import_react5.useMemo)(
    () => ({
      stateCount: states.length,
      transitionCount: transitions.length,
      initialStateName: states.find((s) => s.state_id === effectiveInitialStateId)?.name ?? "None"
    }),
    [states, transitions, effectiveInitialStateId]
  );
  if (states.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: emptyMessage }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "h-full w-full", onDragOver, onDrop, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    import_react6.ReactFlow,
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onSelectionChange,
      nodeTypes,
      edgeTypes,
      fitView: true,
      fitViewOptions: { padding: 0.2 },
      minZoom: 0.05,
      maxZoom: 3,
      deleteKeyCode: null,
      selectNodesOnDrag: false,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.Background, { gap: 20, size: 1, variant: import_react6.BackgroundVariant.Dots }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.Controls, { showInteractive: false }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_react6.MiniMap,
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
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.Panel, { position: "top-right", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "button",
            {
              onClick: () => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }),
              className: "flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded",
              title: "Fit to view (F)",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.Maximize, { className: "size-3.5" }),
                "Fit"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              onClick: () => setShowShortcuts((p) => !p),
              className: "flex items-center justify-center h-7 w-7 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded",
              title: "Keyboard shortcuts (?)",
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.Keyboard, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "button",
            {
              onClick: handleRelayout,
              className: "flex items-center gap-1.5 h-7 px-2 text-xs text-text-secondary hover:text-text-primary border border-border-secondary hover:border-text-muted rounded",
              title: "Re-layout (L)",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.LayoutGrid, { className: "size-3.5" }),
                "Re-layout"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.Panel, { position: "bottom-left", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "text-[10px] text-text-muted/70 bg-bg-primary/80 backdrop-blur-sm px-2.5 py-1.5 rounded border border-border-secondary/50 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
            graphStats.stateCount,
            " states"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-text-muted/30", children: "|" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
            graphStats.transitionCount,
            " transitions"
          ] }),
          graphStats.initialStateName !== "None" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-text-muted/30", children: "|" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "text-yellow-500", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.Play, { className: "size-2 inline mr-0.5 fill-current" }),
              graphStats.initialStateName
            ] })
          ] })
        ] }) }),
        showShortcuts && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.Panel, { position: "bottom-right", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "bg-bg-primary/95 border border-border-secondary rounded-lg p-4 text-xs shadow-lg backdrop-blur-sm min-w-[200px]", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h4", { className: "font-semibold text-text-primary mb-2.5", children: "Keyboard Shortcuts" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "space-y-1.5 text-text-muted", children: [
            [
              ["Deselect all", "Esc"],
              ["Toggle shortcuts", "?"],
              ["Fit to view", "F"],
              ["Re-layout", "L"],
              ["Zoom in/out", "+ / -"]
            ].map(([label, key]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("kbd", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono", children: key })
            ] }, label)),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "border-t border-border-secondary pt-1.5 mt-1.5", children: [
              ["Cycle states", "Tab"],
              ["Jump to initial", "I"],
              ["Delete transition", "Del"],
              ...extraShortcutEntries ?? []
            ].map(([label, key]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("kbd", { className: "px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono", children: key })
            ] }, label)) })
          ] })
        ] }) })
      ]
    }
  ) });
}
function StateMachineGraphView(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StateMachineGraphViewInner, { ...props }) });
}

// src/components/state-machine/TransitionEditor.tsx
var import_react7 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  const [name, setName] = (0, import_react7.useState)("");
  const [fromStates, setFromStates] = (0, import_react7.useState)([]);
  const [activateStates, setActivateStates] = (0, import_react7.useState)([]);
  const [exitStates, setExitStates] = (0, import_react7.useState)([]);
  const [actions, setActions] = (0, import_react7.useState)([]);
  const [pathCost, setPathCost] = (0, import_react7.useState)(1);
  const [staysVisible, setStaysVisible] = (0, import_react7.useState)(false);
  const [isSaving, setIsSaving] = (0, import_react7.useState)(false);
  (0, import_react7.useEffect)(() => {
    if (transition) {
      setName(transition.name);
      setFromStates([...transition.from_states]);
      setActivateStates([...transition.activate_states]);
      setExitStates([...transition.exit_states]);
      setActions([...transition.actions]);
      setPathCost(transition.path_cost);
      setStaysVisible(transition.stays_visible);
    } else {
      setName("");
      setFromStates([]);
      setActivateStates([]);
      setExitStates([]);
      setActions([{ type: "click" }]);
      setPathCost(1);
      setStaysVisible(false);
    }
  }, [transition]);
  const toggleState = (0, import_react7.useCallback)(
    (arr, setter, stateId) => {
      if (arr.includes(stateId)) {
        setter(arr.filter((s) => s !== stateId));
      } else {
        setter([...arr, stateId]);
      }
    },
    []
  );
  const addAction = (0, import_react7.useCallback)(() => {
    setActions((prev) => [...prev, { type: "click" }]);
  }, []);
  const removeAction = (0, import_react7.useCallback)((index) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const updateAction = (0, import_react7.useCallback)(
    (index, updates) => {
      setActions(
        (prev) => prev.map((a, i) => i === index ? { ...a, ...updates } : a)
      );
    },
    []
  );
  const handleSave = (0, import_react7.useCallback)(async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const data = {
        name: name.trim(),
        from_states: fromStates,
        activate_states: activateStates,
        exit_states: exitStates,
        actions,
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
  const handleDelete = (0, import_react7.useCallback)(async () => {
    if (!transition) return;
    setIsSaving(true);
    try {
      await onDelete(transition.id);
    } finally {
      setIsSaving(false);
    }
  }, [transition, onDelete]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: isEditing ? "Edit Transition" : "New Transition" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "button",
        {
          onClick: onClose,
          className: "text-text-secondary hover:text-text-primary text-xs",
          children: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Name" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      StateToggleGroup,
      {
        label: "From States",
        color: "blue",
        states,
        selected: fromStates,
        onToggle: (id) => toggleState(fromStates, setFromStates, id)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      StateToggleGroup,
      {
        label: "Activate States",
        color: "green",
        states,
        selected: activateStates,
        onToggle: (id) => toggleState(activateStates, setActivateStates, id)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      StateToggleGroup,
      {
        label: "Exit States",
        color: "red",
        states,
        selected: exitStates,
        onToggle: (id) => toggleState(exitStates, setExitStates, id)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "text-xs text-text-secondary", children: "Actions" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            onClick: addAction,
            className: "text-xs text-brand-primary hover:text-brand-primary/80",
            children: "+ Add Action"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex flex-col gap-2", children: actions.map((action, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        ActionField,
        {
          action,
          index,
          onUpdate: updateAction,
          onRemove: removeAction,
          canRemove: actions.length > 1
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Path Cost" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex items-end pb-1", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex gap-2 pt-2 border-t border-border-secondary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "button",
        {
          onClick: handleSave,
          disabled: !name.trim() || isSaving,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: isSaving ? "Saving..." : isEditing ? "Update" : "Create"
        }
      ),
      isEditing && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-wrap gap-1", children: [
      states.map((s) => {
        const isActive = selected.includes(s.state_id);
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            onClick: () => onToggle(s.state_id),
            className: `px-2 py-0.5 text-xs border rounded transition-colors ${isActive ? colorClasses[color] : inactiveClass}`,
            children: s.name
          },
          s.state_id
        );
      }),
      states.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-xs text-text-muted italic", children: "No states" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "p-2 bg-bg-tertiary border border-border-secondary rounded", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2 mb-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "select",
        {
          value: action.type,
          onChange: (e) => onUpdate(index, { type: e.target.value }),
          className: "flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary",
          children: ACTION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: t.value, children: t.label }, t.value))
        }
      ),
      canRemove && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "button",
        {
          onClick: () => onRemove(index),
          className: "text-xs text-red-400 hover:text-red-300",
          children: "Remove"
        }
      )
    ] }),
    (action.type === "click" || action.type === "doubleClick" || action.type === "rightClick" || action.type === "hover" || action.type === "focus" || action.type === "blur" || action.type === "check" || action.type === "uncheck" || action.type === "toggle" || action.type === "submit" || action.type === "reset" || action.type === "clear") && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "input",
      {
        type: "text",
        value: action.target ?? "",
        onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
        placeholder: "Target element ID",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    action.type === "type" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          type: "text",
          value: action.text ?? "",
          onChange: (e) => onUpdate(index, { text: e.target.value }),
          placeholder: "Text to type",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "flex items-center gap-1 text-xs text-text-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    action.type === "navigate" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "input",
      {
        type: "text",
        value: action.url ?? "",
        onChange: (e) => onUpdate(index, { url: e.target.value }),
        placeholder: "URL",
        className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    action.type === "wait" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    (action.type === "select" || action.type === "setValue") && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Target element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    action.type === "scroll" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "select",
        {
          value: action.scroll_direction ?? "down",
          onChange: (e) => onUpdate(index, {
            scroll_direction: e.target.value
          }),
          className: "flex-1 px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "up", children: "Up" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "down", children: "Down" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "left", children: "Left" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "right", children: "Right" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
    action.type === "drag" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          type: "text",
          value: action.target ?? "",
          onChange: (e) => onUpdate(index, { target: e.target.value || void 0 }),
          placeholder: "Source element ID",
          className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_react8 = require("react");
var import_lucide_react4 = require("lucide-react");
var import_workflow_utils2 = require("@qontinui/workflow-utils");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ACTION_ICONS2 = {
  click: import_lucide_react4.MousePointer,
  type: import_lucide_react4.Type,
  select: import_lucide_react4.ListFilter,
  wait: import_lucide_react4.Clock,
  navigate: import_lucide_react4.Globe
};
function TransitionsPanel({
  states,
  transitions,
  onSelectTransition
}) {
  const [selectedTransitionId, setSelectedTransitionId] = (0, import_react8.useState)(null);
  const [filterFromState, setFilterFromState] = (0, import_react8.useState)(null);
  const [filterToState, setFilterToState] = (0, import_react8.useState)(null);
  const [searchFilter, setSearchFilter] = (0, import_react8.useState)("");
  const [animation, setAnimation] = (0, import_react8.useState)({
    isPlaying: false,
    currentActionIndex: -1,
    progress: 0,
    speed: 1
  });
  const animationRef = (0, import_react8.useRef)(null);
  const startTimeRef = (0, import_react8.useRef)(0);
  const selectedTransition = (0, import_react8.useMemo)(
    () => transitions.find((t) => t.transition_id === selectedTransitionId),
    [transitions, selectedTransitionId]
  );
  const filteredTransitions = (0, import_react8.useMemo)(() => {
    return transitions.filter((t) => {
      if (filterFromState && !t.from_states.includes(filterFromState))
        return false;
      if (filterToState && !t.activate_states.includes(filterToState))
        return false;
      if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        if (!t.name.toLowerCase().includes(lower)) return false;
      }
      return true;
    });
  }, [transitions, filterFromState, filterToState, searchFilter]);
  const stateNameMap = (0, import_react8.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of states) {
      map.set(s.state_id, s.name);
    }
    return map;
  }, [states]);
  const stopAnimation = (0, import_react8.useCallback)(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setAnimation((prev) => ({ ...prev, isPlaying: false }));
  }, []);
  const animate = (0, import_react8.useCallback)(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0) return;
    const tick = (timestamp) => {
      setAnimation((prev) => {
        if (!prev.isPlaying) return prev;
        const elapsed = timestamp - startTimeRef.current;
        const currentAction = selectedTransition.actions[prev.currentActionIndex];
        if (!currentAction) {
          return { ...prev, isPlaying: false };
        }
        const duration = (0, import_workflow_utils2.computeActionDuration)(currentAction) / prev.speed;
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
  const playAnimation = (0, import_react8.useCallback)(() => {
    setAnimation((prev) => {
      const startIndex = prev.currentActionIndex < 0 ? 0 : prev.currentActionIndex;
      const idx = prev.progress >= 1 && startIndex >= (selectedTransition?.actions.length ?? 0) - 1 ? 0 : startIndex;
      return { ...prev, isPlaying: true, currentActionIndex: idx, progress: 0 };
    });
    setTimeout(animate, 0);
  }, [animate, selectedTransition]);
  const pauseAnimation = (0, import_react8.useCallback)(() => {
    stopAnimation();
  }, [stopAnimation]);
  const resetAnimation = (0, import_react8.useCallback)(() => {
    stopAnimation();
    setAnimation((prev) => ({
      ...prev,
      currentActionIndex: -1,
      progress: 0
    }));
  }, [stopAnimation]);
  const stepForward = (0, import_react8.useCallback)(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex + 1;
      if (!selectedTransition || next >= selectedTransition.actions.length)
        return prev;
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation, selectedTransition]);
  const stepBackward = (0, import_react8.useCallback)(() => {
    stopAnimation();
    setAnimation((prev) => {
      const next = prev.currentActionIndex - 1;
      if (next < 0) return { ...prev, currentActionIndex: -1, progress: 0 };
      return { ...prev, currentActionIndex: next, progress: 1 };
    });
  }, [stopAnimation]);
  (0, import_react8.useEffect)(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  (0, import_react8.useEffect)(() => {
    resetAnimation();
  }, [selectedTransitionId, resetAnimation]);
  const handleSelectTransition = (0, import_react8.useCallback)(
    (tid) => {
      setSelectedTransitionId(tid === selectedTransitionId ? null : tid);
      onSelectTransition(tid === selectedTransitionId ? null : tid);
    },
    [selectedTransitionId, onSelectTransition]
  );
  const overallProgress = (0, import_react8.useMemo)(() => {
    if (!selectedTransition || selectedTransition.actions.length === 0)
      return 0;
    if (animation.currentActionIndex < 0) return 0;
    const completedActions = animation.currentActionIndex;
    const currentProgress = animation.progress;
    return (completedActions + currentProgress) / selectedTransition.actions.length;
  }, [selectedTransition, animation]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "w-80 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "p-3 border-b border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.GitBranch, { className: "size-4 text-brand-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Transitions" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-xs text-text-muted ml-auto", children: filteredTransitions.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "relative mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "select",
            {
              value: filterFromState ?? "",
              onChange: (e) => setFilterFromState(e.target.value || null),
              className: "text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "All from states" }),
                states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "select",
            {
              value: filterToState ?? "",
              onChange: (e) => setFilterToState(e.target.value || null),
              className: "text-[10px] h-6 flex-1 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "All target states" }),
                states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "p-2 space-y-0.5", children: [
        filteredTransitions.map((t) => {
          const isSelected = t.transition_id === selectedTransitionId;
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "button",
            {
              onClick: () => handleSelectTransition(t.transition_id),
              className: `
                  w-full text-left px-3 py-2 rounded-md transition-colors text-sm
                  ${isSelected ? "bg-brand-primary/10 border border-brand-primary/30" : "hover:bg-bg-secondary border border-transparent"}
                `,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "flex items-center gap-0.5", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((type) => {
                    const Icon = ACTION_ICONS2[type];
                    const color = (0, import_workflow_utils2.getActionColorConfig)(type);
                    return Icon ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      Icon,
                      {
                        className: `size-3 ${color.text}`
                      },
                      type
                    ) : null;
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "font-medium text-text-primary truncate flex-1", children: t.name || "Unnamed" }),
                  t.stays_visible && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.Eye, { className: "size-3 text-green-500 shrink-0" }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-[9px] text-text-muted bg-bg-secondary px-1 rounded", children: t.actions.length })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-1 mt-0.5 ml-4 text-[10px] text-text-muted", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "truncate", children: t.from_states.map((s) => stateNameMap.get(s) ?? s).join(", ") }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.ArrowRight, { className: "size-2.5 shrink-0" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "truncate", children: t.activate_states.map((s) => stateNameMap.get(s) ?? s).join(", ") })
                ] })
              ]
            },
            t.transition_id
          );
        }),
        filteredTransitions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-xs text-text-muted text-center py-4", children: "No transitions match filters." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex-1 overflow-y-auto", children: selectedTransition ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: "text-lg font-semibold text-text-primary", children: selectedTransition.name || "Unnamed Transition" }),
          selectedTransition.stays_visible && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-green-500/20 text-green-400 border-green-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.Eye, { className: "size-2.5" }),
            "Visible"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2 mt-2 text-xs text-text-muted flex-wrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            "From:",
            " ",
            selectedTransition.from_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.ArrowRight, { className: "size-3" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            "To:",
            " ",
            selectedTransition.activate_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] }),
          selectedTransition.exit_states.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-red-500/10 text-red-400 border-red-500/30", children: [
            "Exit:",
            " ",
            selectedTransition.exit_states.map((s) => stateNameMap.get(s) ?? s).join(", ")
          ] })
        ] })
      ] }),
      selectedTransition.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rounded-lg border border-border-secondary bg-bg-secondary p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.Zap, { className: "size-3.5 text-brand-primary" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-xs font-medium text-text-primary", children: "Action Playback" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "select",
            {
              value: animation.speed,
              onChange: (e) => setAnimation((prev) => ({
                ...prev,
                speed: parseFloat(e.target.value)
              })),
              className: "text-[10px] h-5 w-16 px-1 bg-bg-tertiary border border-border-secondary rounded text-text-primary",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "0.5", children: "0.5x" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "1", children: "1x" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "1.5", children: "1.5x" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "2", children: "2x" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "4", children: "4x" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "w-full h-1.5 bg-bg-primary rounded-full mb-3 overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "div",
          {
            className: "h-full bg-brand-primary rounded-full transition-all duration-100",
            style: { width: `${overallProgress * 100}%` }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: resetAnimation,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
              title: "Reset",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.RotateCcw, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: stepBackward,
              disabled: animation.currentActionIndex <= 0,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Step back",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.SkipBack, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: animation.isPlaying ? pauseAnimation : playAnimation,
              className: "h-9 w-9 p-0 inline-flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary/90",
              title: animation.isPlaying ? "Pause" : "Play",
              children: animation.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.Play, { className: "size-4 ml-0.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: stepForward,
              disabled: animation.currentActionIndex >= selectedTransition.actions.length - 1,
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Step forward",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.SkipForward, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "mt-3 flex items-center justify-center gap-1", children: selectedTransition.actions.map((action, idx) => {
          const Icon = ACTION_ICONS2[action.type] ?? import_lucide_react4.ChevronRight;
          const isPastAction = animation.currentActionIndex >= 0 && idx < animation.currentActionIndex;
          const isCurrentAction = idx === animation.currentActionIndex;
          const color = (0, import_workflow_utils2.getActionColorConfig)(action.type);
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
                          ${isCurrentAction ? `${color.bg} ${color.border} ${color.text} shadow-sm` : isPastAction ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-bg-primary border-border-secondary text-text-muted hover:border-brand-primary/30"}
                        `,
              title: `${import_workflow_utils2.ACTION_LABELS[action.type] ?? action.type}: ${action.target || action.url || action.text || ""}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { className: "size-2.5" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: idx + 1 })
              ]
            },
            idx
          );
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "mt-1.5 text-center text-[10px] text-text-muted", children: animation.currentActionIndex >= 0 ? `Action ${animation.currentActionIndex + 1} of ${selectedTransition.actions.length}` : "Ready to play" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("h3", { className: "text-sm font-medium text-text-primary mb-3", children: [
          "Actions (",
          selectedTransition.actions.length,
          ")"
        ] }),
        selectedTransition.actions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-xs text-text-muted", children: "No actions defined." }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "space-y-2", children: selectedTransition.actions.map((action, idx) => {
          const Icon = ACTION_ICONS2[action.type] ?? import_lucide_react4.ChevronRight;
          const color = (0, import_workflow_utils2.getActionColorConfig)(action.type);
          const isCurrent = idx === animation.currentActionIndex;
          const isPast = animation.currentActionIndex >= 0 && idx < animation.currentActionIndex;
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "div",
            {
              className: `
                          flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
                          ${isCurrent ? `${color.border} ${color.bg} shadow-sm` : isPast ? "border-green-500/30 bg-green-500/5" : "border-border-secondary bg-bg-secondary"}
                        `,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-[10px] text-text-muted font-mono w-4 text-right", children: idx + 1 }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "div",
                    {
                      className: `p-1.5 rounded-md ${color.bg} ${color.text}`,
                      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { className: "size-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-xs font-medium text-text-primary flex items-center gap-1.5", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: import_workflow_utils2.ACTION_LABELS[action.type] ?? action.type }),
                    isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "span",
                      {
                        className: `animate-pulse ${color.text} text-[10px]`,
                        children: import_workflow_utils2.ACTION_ACTIVE_LABELS[action.type]
                      }
                    )
                  ] }),
                  action.target && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { className: "text-[10px] text-text-muted mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded", children: action.target }),
                  action.text && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-[10px] text-text-muted mt-0.5 font-mono bg-bg-primary/50 px-1 py-0.5 rounded", children: [
                    "\u201C",
                    isCurrent && animation.isPlaying ? action.text.slice(
                      0,
                      Math.floor(
                        action.text.length * animation.progress
                      )
                    ) : action.text,
                    "\u201D",
                    isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "animate-pulse text-brand-primary", children: "|" })
                  ] }),
                  action.url && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { className: "text-[10px] text-cyan-400 mt-0.5 block truncate bg-bg-primary/50 px-1 py-0.5 rounded", children: action.url }),
                  action.delay_ms != null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "text-[10px] text-text-muted mt-0.5 block", children: [
                    action.delay_ms,
                    "ms",
                    isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "ml-1 text-text-muted/70", children: [
                      "(",
                      Math.round(
                        animation.progress * (action.delay_ms ?? 0)
                      ),
                      "ms elapsed)"
                    ] })
                  ] })
                ] }),
                isPast && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-green-500 shrink-0 mt-0.5", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "svg",
                  {
                    className: "size-4",
                    viewBox: "0 0 16 16",
                    fill: "currentColor",
                    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" })
                  }
                ) }),
                isCurrent && animation.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "shrink-0 mt-0.5", children: action.type === "click" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "absolute inset-0 rounded-full bg-blue-500/20 animate-ping" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "w-2 h-2 rounded-full bg-blue-400" })
                ] }) : action.type === "navigate" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  import_lucide_react4.ArrowRight,
                  {
                    className: "size-4 text-cyan-400 animate-bounce",
                    style: { animationDuration: "0.6s" }
                  }
                ) }) : action.type === "type" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "div",
                  {
                    className: "w-0.5 h-3.5 bg-amber-400 animate-pulse",
                    style: { animationDuration: "0.5s" }
                  }
                ) }) : action.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  import_lucide_react4.ChevronRight,
                  {
                    className: "size-3.5 text-purple-400 animate-bounce",
                    style: {
                      animationDuration: "0.8s",
                      transform: "rotate(90deg)"
                    }
                  }
                ) }) : action.type === "wait" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "relative w-5 h-5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "div",
                  {
                    className: "w-4 h-4 rounded-full border-2 border-gray-400/40 border-t-gray-400 animate-spin",
                    style: { animationDuration: "1.5s" }
                  }
                ) }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "div",
                  {
                    className: `w-4 h-4 rounded-full border-2 ${color.text} border-current border-t-transparent animate-spin`
                  }
                ) })
              ]
            },
            idx
          );
        }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
          "Path Cost: ",
          selectedTransition.path_cost
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
          "Stays Visible: ",
          selectedTransition.stays_visible ? "Yes" : "No"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
          "ID:",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { className: "bg-bg-secondary px-1 rounded", children: selectedTransition.transition_id })
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react4.GitBranch, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-sm", children: "Select a transition to view its details" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "text-xs mt-1 text-text-muted/70", children: [
        transitions.length,
        " transition",
        transitions.length !== 1 ? "s" : "",
        " available"
      ] })
    ] }) }) })
  ] });
}

// src/components/state-machine/StateDetailPanel.tsx
var import_react9 = require("react");
var import_workflow_utils3 = require("@qontinui/workflow-utils");
var import_jsx_runtime6 = require("react/jsx-runtime");
function StateDetailPanel({
  state,
  onSave,
  onDelete,
  onClose
}) {
  const [name, setName] = (0, import_react9.useState)(state.name);
  const [description, setDescription] = (0, import_react9.useState)(state.description ?? "");
  const [elementIds, setElementIds] = (0, import_react9.useState)([...state.element_ids]);
  const [acceptanceCriteria, setAcceptanceCriteria] = (0, import_react9.useState)([
    ...state.acceptance_criteria
  ]);
  const [domainKnowledge, setDomainKnowledge] = (0, import_react9.useState)(
    state.domain_knowledge.map((dk) => ({ ...dk, tags: [...dk.tags] }))
  );
  const [isSaving, setIsSaving] = (0, import_react9.useState)(false);
  const [newElementId, setNewElementId] = (0, import_react9.useState)("");
  const [newCriterion, setNewCriterion] = (0, import_react9.useState)("");
  const [showNewDk, setShowNewDk] = (0, import_react9.useState)(false);
  const [newDkTitle, setNewDkTitle] = (0, import_react9.useState)("");
  const [newDkContent, setNewDkContent] = (0, import_react9.useState)("");
  const [newDkTags, setNewDkTags] = (0, import_react9.useState)("");
  const [editingCriterionIdx, setEditingCriterionIdx] = (0, import_react9.useState)(
    null
  );
  const [editingCriterionValue, setEditingCriterionValue] = (0, import_react9.useState)("");
  (0, import_react9.useEffect)(() => {
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
  const handleSave = (0, import_react9.useCallback)(async () => {
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
  const handleDelete = (0, import_react9.useCallback)(async () => {
    if (!onDelete) return;
    setIsSaving(true);
    try {
      await onDelete(state.id);
    } finally {
      setIsSaving(false);
    }
  }, [state.id, onDelete]);
  const handleAddElement = (0, import_react9.useCallback)(() => {
    const trimmed = newElementId.trim();
    if (!trimmed || elementIds.includes(trimmed)) return;
    setElementIds((prev) => [...prev, trimmed]);
    setNewElementId("");
  }, [newElementId, elementIds]);
  const handleRemoveElement = (0, import_react9.useCallback)((eid) => {
    setElementIds((prev) => prev.filter((e) => e !== eid));
  }, []);
  const handleAddCriterion = (0, import_react9.useCallback)(() => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    setAcceptanceCriteria((prev) => [...prev, trimmed]);
    setNewCriterion("");
  }, [newCriterion]);
  const handleRemoveCriterion = (0, import_react9.useCallback)((idx) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== idx));
    setEditingCriterionIdx(null);
  }, []);
  const handleSaveCriterionEdit = (0, import_react9.useCallback)(() => {
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
  const handleAddDk = (0, import_react9.useCallback)(() => {
    const title = newDkTitle.trim();
    const content = newDkContent.trim();
    if (!title || !content) return;
    const tags = newDkTags.split(",").map((t) => t.trim()).filter(Boolean);
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
  const handleRemoveDk = (0, import_react9.useCallback)((dkId) => {
    setDomainKnowledge((prev) => prev.filter((dk) => dk.id !== dkId));
  }, []);
  const confidenceColor = (0, import_workflow_utils3.getConfidenceColor)(state.confidence);
  const confidencePct = Math.round(state.confidence * 100);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "State Details" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          onClick: onClose,
          className: "text-text-secondary hover:text-text-primary text-xs",
          children: "Close"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Name" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "input",
        {
          type: "text",
          value: name,
          onChange: (e) => setName(e.target.value),
          className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "Description" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-text-secondary", children: "State ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("code", { className: "block mt-0.5 px-1.5 py-0.5 bg-bg-tertiary rounded text-text-primary font-mono text-[10px] break-all", children: state.state_id })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-text-secondary", children: "Confidence" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: `block mt-0.5 font-medium ${confidenceColor}`, children: [
          confidencePct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-text-secondary", children: "Elements" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "block mt-0.5 text-text-primary font-medium", children: elementIds.length })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-text-secondary", children: "Renders" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "block mt-0.5 text-text-primary font-medium", children: state.render_ids.length })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: "block text-xs text-text-secondary mb-1.5", children: [
        "Elements (",
        elementIds.length,
        ")"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "max-h-48 overflow-y-auto space-y-0.5", children: elementIds.map((eid) => {
        const style = (0, import_workflow_utils3.getElementTypeStyle)(eid);
        const label = (0, import_workflow_utils3.getElementLabel)(eid);
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "div",
          {
            className: `group flex items-center gap-1 px-2 py-1 text-xs rounded border ${style.bg} ${style.text} ${style.border}`,
            title: eid,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "truncate flex-1", children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-1 mt-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: "block text-xs text-text-secondary mb-1", children: [
        "Acceptance Criteria (",
        acceptanceCriteria.length,
        ")"
      ] }),
      acceptanceCriteria.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("ul", { className: "space-y-0.5 mb-1.5", children: acceptanceCriteria.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("li", { className: "group flex items-start gap-1.5 text-xs", children: editingCriterionIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            onClick: () => handleRemoveCriterion(i),
            className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
            title: "Remove",
            children: "\xD7"
          }
        )
      ] }) }, i)) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: "text-xs text-text-secondary", children: [
          "Domain Knowledge (",
          domainKnowledge.length,
          ")"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            onClick: () => setShowNewDk(true),
            className: "text-xs text-brand-primary hover:text-brand-primary/80",
            children: "+ Add"
          }
        )
      ] }),
      domainKnowledge.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "space-y-1.5", children: domainKnowledge.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          className: "group p-2 bg-bg-tertiary border border-border-secondary rounded",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-start justify-between gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "text-xs font-medium text-text-primary", children: dk.title }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: () => handleRemoveDk(dk.id),
                  className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 transition-opacity",
                  title: "Remove",
                  children: "\xD7"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "text-xs text-text-secondary mt-0.5 line-clamp-2", children: dk.content }),
            dk.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex flex-wrap gap-1 mt-1", children: dk.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      showNewDk && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "mt-1.5 p-2 bg-bg-tertiary border border-border-secondary rounded space-y-1.5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "textarea",
          {
            value: newDkContent,
            onChange: (e) => setNewDkContent(e.target.value),
            placeholder: "Content",
            rows: 2,
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted resize-y"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            type: "text",
            value: newDkTags,
            onChange: (e) => setNewDkTags(e.target.value),
            placeholder: "Tags (comma-separated)",
            className: "w-full px-2 py-1 text-xs bg-bg-secondary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              onClick: handleAddDk,
              disabled: !newDkTitle.trim() || !newDkContent.trim(),
              className: "px-2 py-1 text-xs font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 rounded",
              children: "Add"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-2 pt-2 border-t border-border-secondary", children: [
      hasChanges && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: isSaving ? "Saving..." : "Save Changes"
        }
      ),
      onDelete && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
var import_react10 = require("react");
var import_lucide_react5 = require("lucide-react");
var import_workflow_utils4 = require("@qontinui/workflow-utils");
var import_jsx_runtime7 = require("react/jsx-runtime");
var ELEMENT_ICONS = {
  testid: import_lucide_react5.Hash,
  role: import_lucide_react5.MousePointer,
  text: import_lucide_react5.Type,
  ui: import_lucide_react5.Box,
  url: import_lucide_react5.Globe,
  nav: import_lucide_react5.Globe
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
  click: import_lucide_react5.MousePointer,
  type: import_lucide_react5.Type,
  select: import_lucide_react5.Target,
  wait: import_lucide_react5.Layers,
  navigate: import_lucide_react5.Globe
};
function resolveElementLabel(elementId, fingerprintDetails, state) {
  const fp = fingerprintDetails?.[elementId];
  if (fp) {
    if (fp.accessibleName) return fp.accessibleName;
    const parts = [fp.tagName, fp.role].filter(Boolean);
    if (parts.length > 0) return parts.join(" ");
  }
  const labels = state?.extra_metadata?.elementLabels;
  if (labels?.[elementId]) return labels[elementId];
  return (0, import_workflow_utils4.getElementLabel)(elementId);
}
function resolveElementPosition(elementId, fingerprintDetails, state) {
  const fp = fingerprintDetails?.[elementId];
  if (fp?.relativePosition) return fp.relativePosition;
  const positions = state?.extra_metadata?.elementPositions;
  if (positions?.[elementId]) return positions[elementId];
  return null;
}
function resolveElementTag(elementId, fingerprintDetails, state) {
  const fp = fingerprintDetails?.[elementId];
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
function SpatialCanvas({
  states,
  transitions,
  selectedStateId,
  onSelectState
}) {
  const canvasRef = (0, import_react10.useRef)(null);
  const containerRef = (0, import_react10.useRef)(null);
  const [canvasSize, setCanvasSize] = (0, import_react10.useState)({ width: 800, height: 600 });
  const [zoom, setZoom] = (0, import_react10.useState)(1);
  const [hoveredStateId, setHoveredStateId] = (0, import_react10.useState)(null);
  const layout = (0, import_react10.useMemo)(
    () => (0, import_workflow_utils4.computeSpatialLayout)(
      states,
      transitions,
      canvasSize.width,
      canvasSize.height
    ),
    [states, transitions, canvasSize.width, canvasSize.height]
  );
  const sharedElements = (0, import_react10.useMemo)(() => {
    const elementStateMap = /* @__PURE__ */ new Map();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, /* @__PURE__ */ new Set());
        elementStateMap.get(eid).add(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);
  (0, import_react10.useEffect)(() => {
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
  (0, import_react10.useEffect)(() => {
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
      const color = import_workflow_utils4.STATE_COLORS[i % import_workflow_utils4.STATE_COLORS.length];
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
  const getStateAtPoint = (0, import_react10.useCallback)(
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
  const handleMouseMove = (0, import_react10.useCallback)(
    (e) => {
      setHoveredStateId(getStateAtPoint(e.clientX, e.clientY));
    },
    [getStateAtPoint]
  );
  const handleClick = (0, import_react10.useCallback)(
    (e) => {
      const stateId = getStateAtPoint(e.clientX, e.clientY);
      onSelectState(stateId === selectedStateId ? null : stateId);
    },
    [getStateAtPoint, onSelectState, selectedStateId]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      ref: containerRef,
      className: "relative w-full h-full bg-bg-secondary",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "absolute top-3 right-3 flex items-center gap-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary",
              onClick: () => setZoom((z) => Math.min(3, z + 0.25)),
              title: "Zoom in",
              children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ZoomIn, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary",
              onClick: () => setZoom((z) => Math.max(0.5, z - 0.25)),
              title: "Zoom out",
              children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ZoomOut, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              className: "h-7 w-7 p-0 inline-flex items-center justify-center rounded bg-bg-primary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary",
              onClick: () => setZoom(1),
              title: "Reset zoom",
              children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Maximize, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute bottom-3 left-3 text-[10px] text-text-muted bg-bg-primary/80 backdrop-blur-sm px-2.5 py-1.5 rounded border border-border-secondary/50", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
            states.length,
            " states"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
            transitions.length,
            " transitions"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
            "Zoom: ",
            Math.round(zoom * 100),
            "%"
          ] })
        ] }) }),
        hoveredStateId && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "absolute top-3 left-3 text-xs bg-bg-primary/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-border-secondary shadow-md", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "font-medium text-text-primary", children: states.find((s) => s.state_id === hoveredStateId)?.name }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "text-text-muted mt-0.5", children: [
            states.find((s) => s.state_id === hoveredStateId)?.element_ids.length,
            " ",
            "elements"
          ] })
        ] })
      ]
    }
  );
}
function StateLayoutView({
  state,
  elementThumbnails,
  fingerprintDetails
}) {
  const [hoveredElement, setHoveredElement] = (0, import_react10.useState)(null);
  const positionedElements = (0, import_react10.useMemo)(() => {
    const items = [];
    for (const eid of state.element_ids) {
      const pos = resolveElementPosition(eid, fingerprintDetails, state);
      if (!pos) continue;
      const label = resolveElementLabel(eid, fingerprintDetails, state);
      const tag = resolveElementTag(eid, fingerprintDetails, state);
      const prefix = (0, import_workflow_utils4.getElementTypePrefix)(eid);
      const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[(0, import_workflow_utils4.getElementLabel)(eid)];
      items.push({ id: eid, label, tag, position: pos, thumbnail: thumb, prefix });
    }
    return items;
  }, [state, fingerprintDetails, elementThumbnails]);
  const elementsWithoutPosition = state.element_ids.length - positionedElements.length;
  if (positionedElements.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex items-center justify-center h-48 text-text-muted text-xs", children: "No position data available for this state's elements." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("h3", { className: "text-sm font-medium text-text-primary mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Layout, { className: "size-3.5" }),
      "State Layout"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: "relative bg-bg-tertiary border border-border-secondary rounded-lg",
        style: { aspectRatio: "16 / 10" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute top-0 left-0 right-0 h-[10%] border-b border-dashed border-border-secondary/30" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-[10%] border-t border-dashed border-border-secondary/30" })
          ] }),
          positionedElements.map((el) => {
            const isHovered = hoveredElement === el.id;
            const colorClass = ELEMENT_COLORS[el.prefix] ?? "border-gray-400 bg-gray-500/10 text-gray-300";
            const thumbSrc = el.thumbnail ? el.thumbnail.startsWith("data:") ? el.thumbnail : `data:image/png;base64,${el.thumbnail}` : void 0;
            return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                    "div",
                    {
                      className: `
                  rounded border ${colorClass} overflow-hidden
                  transition-all duration-100 cursor-default
                  ${isHovered ? "ring-2 ring-brand-primary/50 shadow-lg z-20 scale-125" : "z-10"}
                `,
                      style: { width: thumbSrc ? 32 : void 0, height: thumbSrc ? 32 : void 0 },
                      children: thumbSrc ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                        "img",
                        {
                          src: thumbSrc,
                          alt: el.label,
                          className: "w-full h-full object-contain"
                        }
                      ) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "px-1 py-0.5 text-[8px] whitespace-nowrap max-w-[80px] truncate", children: el.label })
                    }
                  ),
                  isHovered && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-bg-primary/95 backdrop-blur-sm border border-border-secondary rounded px-2 py-1 shadow-md whitespace-nowrap", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "text-[10px] font-medium text-text-primary", children: el.label }),
                    el.tag && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "text-[9px] text-text-muted", children: [el.tag.tagName && `<${el.tag.tagName}>`, el.tag.role && `role="${el.tag.role}"`, el.tag.zone].filter(Boolean).join(" ") })
                  ] })
                ]
              },
              el.id
            );
          })
        ]
      }
    ),
    elementsWithoutPosition > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "text-[10px] text-text-muted mt-1.5", children: [
      elementsWithoutPosition,
      " element",
      elementsWithoutPosition !== 1 ? "s" : "",
      " without position data"
    ] })
  ] });
}
function StateViewPanel({
  states,
  transitions,
  selectedStateId,
  onSelectState,
  elementThumbnails,
  fingerprintDetails
}) {
  const [expandedStates, setExpandedStates] = (0, import_react10.useState)(/* @__PURE__ */ new Set());
  const [searchFilter, setSearchFilter] = (0, import_react10.useState)("");
  const [viewMode, setViewMode] = (0, import_react10.useState)("list");
  const selectedState = (0, import_react10.useMemo)(
    () => states.find((s) => s.state_id === selectedStateId),
    [states, selectedStateId]
  );
  const transitionMap = (0, import_react10.useMemo)(() => {
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
  const elementGroups = (0, import_react10.useMemo)(() => {
    if (!selectedState) return /* @__PURE__ */ new Map();
    const groups = /* @__PURE__ */ new Map();
    for (const eid of selectedState.element_ids) {
      const prefix = (0, import_workflow_utils4.getElementTypePrefix)(eid);
      if (!groups.has(prefix)) groups.set(prefix, []);
      groups.get(prefix).push(eid);
    }
    return groups;
  }, [selectedState]);
  const sharedElements = (0, import_react10.useMemo)(() => {
    const elementStateMap = /* @__PURE__ */ new Map();
    for (const s of states) {
      for (const eid of s.element_ids) {
        if (!elementStateMap.has(eid)) elementStateMap.set(eid, []);
        elementStateMap.get(eid).push(s.state_id);
      }
    }
    return elementStateMap;
  }, [states]);
  const filteredStates = (0, import_react10.useMemo)(() => {
    if (!searchFilter) return states;
    const lower = searchFilter.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.state_id.toLowerCase().includes(lower) || s.element_ids.some((eid) => eid.toLowerCase().includes(lower))
    );
  }, [states, searchFilter]);
  const toggleExpanded = (stateId) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "w-72 border-r border-border-secondary bg-bg-primary overflow-y-auto shrink-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-3 border-b border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Layers, { className: "size-4 text-brand-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "States" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-xs text-text-muted ml-auto", children: states.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-muted" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center border border-border-secondary rounded overflow-hidden", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "button",
              {
                onClick: () => setViewMode("list"),
                className: `p-1 ${viewMode === "list" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "List view",
                children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.List, { className: "size-3.5" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "button",
              {
                onClick: () => setViewMode("spatial"),
                className: `p-1 ${viewMode === "spatial" ? "bg-brand-primary/20 text-brand-primary" : "text-text-muted hover:text-text-primary"}`,
                title: "Spatial view",
                children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.BarChart3, { className: "size-3.5" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-2 space-y-0.5", children: [
        filteredStates.map((state) => {
          const colorIdx = states.indexOf(state);
          const color = import_workflow_utils4.STATE_COLORS[colorIdx % import_workflow_utils4.STATE_COLORS.length];
          const isSelected = state.state_id === selectedStateId;
          const isExpanded = expandedStates.has(state.state_id);
          const stateOutgoing = transitionMap.outgoing.get(state.state_id) ?? [];
          const stateIncoming = transitionMap.incoming.get(state.state_id) ?? [];
          const isInitial = state.extra_metadata?.initial === true;
          const isBlocking = state.extra_metadata?.blocking === true;
          return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "button",
              {
                onClick: () => {
                  onSelectState(isSelected ? null : state.state_id);
                  if (!isExpanded) toggleExpanded(state.state_id);
                },
                className: `
                    w-full text-left px-3 py-2 rounded-md transition-colors text-sm
                    ${isSelected ? "bg-brand-primary/10 border border-brand-primary/30" : "hover:bg-bg-secondary border border-transparent"}
                  `,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                      "div",
                      {
                        className: "w-2.5 h-2.5 rounded-full shrink-0",
                        style: { backgroundColor: color.border }
                      }
                    ),
                    isInitial && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Play, { className: "size-3 text-yellow-500 fill-yellow-500 shrink-0" }),
                    isBlocking && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Lock, { className: "size-3 text-amber-500 shrink-0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "font-medium text-text-primary truncate flex-1", children: state.name }),
                    isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ChevronDown, { className: "size-3 text-text-muted transition-transform" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ChevronRight, { className: "size-3 text-text-muted transition-transform" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2 mt-1 ml-4.5 text-xs text-text-muted", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
                      state.element_ids.length,
                      " elements"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                      "span",
                      {
                        className: Math.round(state.confidence * 100) >= 80 ? "text-green-400" : Math.round(state.confidence * 100) >= 50 ? "text-amber-400" : "text-red-400",
                        children: [
                          Math.round(state.confidence * 100),
                          "%"
                        ]
                      }
                    ),
                    stateOutgoing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-brand-secondary flex items-center gap-0.5", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ArrowUpRight, { className: "size-2" }),
                      stateOutgoing.length
                    ] }),
                    stateIncoming.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-brand-primary flex items-center gap-0.5", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ArrowDownLeft, { className: "size-2" }),
                      stateIncoming.length
                    ] })
                  ] })
                ]
              }
            ),
            isExpanded && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "ml-5 pl-2 border-l border-border-secondary mt-1 mb-2 space-y-0.5", children: [
              state.element_ids.slice(0, 20).map((eid) => {
                const prefix = (0, import_workflow_utils4.getElementTypePrefix)(eid);
                const label = resolveElementLabel(eid, fingerprintDetails, state);
                const Icon = ELEMENT_ICONS[prefix] ?? import_lucide_react5.Layers;
                const stateCount = sharedElements.get(eid)?.length ?? 1;
                return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                  "div",
                  {
                    className: "text-[10px] text-text-muted flex items-center gap-1 py-0.5 px-1 rounded hover:bg-bg-secondary",
                    title: `${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { className: "size-2.5 shrink-0" }),
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "truncate flex-1", children: label }),
                      stateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-[8px] text-brand-primary bg-brand-primary/10 px-1 rounded-full shrink-0", children: stateCount })
                    ]
                  },
                  eid
                );
              }),
              state.element_ids.length > 20 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "text-[10px] text-text-muted py-0.5 px-1", children: [
                "+",
                state.element_ids.length - 20,
                " more"
              ] })
            ] })
          ] }, state.state_id);
        }),
        filteredStates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-text-muted text-center py-4", children: "No states match filter." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex-1 overflow-hidden", children: viewMode === "spatial" ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      SpatialCanvas,
      {
        states,
        transitions,
        selectedStateId,
        onSelectState
      }
    ) : selectedState ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h2", { className: "text-lg font-semibold text-text-primary", children: selectedState.name }),
          selectedState.extra_metadata?.initial === true && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-yellow-500/20 text-yellow-400 border-yellow-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Play, { className: "size-2.5 fill-current" }),
            "Initial"
          ] }),
          selectedState.extra_metadata?.blocking === true && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border bg-amber-500/20 text-amber-400 border-amber-500/30", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Lock, { className: "size-2.5" }),
            "Blocking"
          ] })
        ] }),
        selectedState.description && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm text-text-muted mt-1", children: selectedState.description }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-3 mt-2 text-xs text-text-muted", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            selectedState.element_ids.length,
            " elements"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border bg-bg-secondary border-border-secondary text-text-muted", children: [
            selectedState.render_ids.length,
            " renders"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-medium text-text-primary mb-3", children: "Elements by Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "space-y-3", children: Array.from(elementGroups.entries()).map(
          ([prefix, elements]) => {
            const Icon = ELEMENT_ICONS[prefix] ?? import_lucide_react5.Layers;
            const colorClass = ELEMENT_COLORS[prefix] ?? "border-gray-400 bg-gray-500/10 text-gray-300";
            return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center gap-2 mb-1.5", children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { className: "size-3.5" }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-xs font-medium text-text-primary capitalize", children: prefix }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-xs text-text-muted", children: [
                  "(",
                  elements.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex flex-wrap gap-1.5", children: elements.map((eid) => {
                const stateCount = sharedElements.get(eid)?.length ?? 1;
                const rawLabel = (0, import_workflow_utils4.getElementLabel)(eid);
                const descriptiveLabel = resolveElementLabel(eid, fingerprintDetails, selectedState);
                const thumb = elementThumbnails?.[eid] ?? elementThumbnails?.[rawLabel];
                return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                  "div",
                  {
                    className: `rounded border ${colorClass} overflow-hidden ${thumb ? "flex flex-col items-center w-16" : "text-[11px] px-2 py-0.5 inline-flex items-center gap-1"}`,
                    title: `${eid}${stateCount > 1 ? ` (shared across ${stateCount} states)` : ""}`,
                    children: thumb ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "relative", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                          "img",
                          {
                            src: thumb.startsWith("data:") ? thumb : `data:image/png;base64,${thumb}`,
                            alt: descriptiveLabel,
                            className: "w-12 h-12 object-cover"
                          }
                        ),
                        stateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "absolute -top-1 -right-1 text-[7px] bg-brand-primary/90 text-white px-1 rounded-full leading-tight", children: [
                          "x",
                          stateCount
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-[8px] text-center px-0.5 py-0.5 truncate w-full leading-tight", children: descriptiveLabel })
                    ] }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
                      descriptiveLabel,
                      stateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-[8px] opacity-70 bg-white/10 px-0.5 rounded", children: [
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
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        StateLayoutView,
        {
          state: selectedState,
          elementThumbnails,
          fingerprintDetails
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-medium text-text-primary mb-3", children: "Transitions" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "space-y-2", children: [
          (transitionMap.outgoing.get(selectedState.state_id) ?? []).map(
            (t) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ArrowRight, { className: "size-3 text-brand-secondary shrink-0" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "font-medium text-text-primary", children: t.name }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "flex items-center gap-0.5 shrink-0", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((actionType) => {
                    const ActionIcon = ACTION_ICONS3[actionType];
                    return ActionIcon ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                      ActionIcon,
                      {
                        className: `size-2.5 ${(0, import_workflow_utils4.getActionTypeColor)(actionType)}`
                      },
                      actionType
                    ) : null;
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ArrowRight, { className: "size-2.5 text-text-muted" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-text-muted truncate", children: t.activate_states.map(
                    (sid) => states.find((s) => s.state_id === sid)?.name ?? sid
                  ).join(", ") }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-text-muted ml-auto text-[10px] shrink-0", children: [
                    t.actions.length,
                    " action",
                    t.actions.length !== 1 ? "s" : ""
                  ] }),
                  t.stays_visible && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Eye, { className: "size-3 text-green-400 shrink-0" })
                ]
              },
              `out-${t.transition_id}`
            )
          ),
          (transitionMap.incoming.get(selectedState.state_id) ?? []).map(
            (t) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-xs p-2.5 rounded-lg bg-bg-secondary border border-border-secondary",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.CheckCircle, { className: "size-3 text-brand-primary shrink-0" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "font-medium text-text-primary", children: t.name }),
                  t.actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "flex items-center gap-0.5 shrink-0", children: [...new Set(t.actions.map((a) => a.type))].slice(0, 3).map((actionType) => {
                    const ActionIcon = ACTION_ICONS3[actionType];
                    return ActionIcon ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                      ActionIcon,
                      {
                        className: `size-2.5 ${(0, import_workflow_utils4.getActionTypeColor)(actionType)}`
                      },
                      actionType
                    ) : null;
                  }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-text-muted truncate", children: [
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
          (transitionMap.outgoing.get(selectedState.state_id) ?? []).length === 0 && (transitionMap.incoming.get(selectedState.state_id) ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-text-muted", children: "No transitions connected." })
        ] })
      ] }),
      selectedState.acceptance_criteria.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-sm font-medium text-text-primary mb-2", children: "Acceptance Criteria" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("ul", { className: "space-y-1", children: selectedState.acceptance_criteria.map((criteria, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "li",
          {
            className: "text-xs text-text-muted flex items-start gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.CheckCircle, { className: "size-3 text-green-500 mt-0.5 shrink-0" }),
              criteria
            ]
          },
          i
        )) })
      ] }),
      selectedState.domain_knowledge.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("h3", { className: "text-sm font-medium text-text-primary mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.BookOpen, { className: "size-3.5 inline mr-1" }),
          "Domain Knowledge"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "space-y-2", children: selectedState.domain_knowledge.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "div",
          {
            className: "p-3 rounded-lg bg-bg-secondary border border-border-secondary",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "text-xs font-medium text-text-primary", children: dk.title }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "text-[10px] text-text-muted mt-1 line-clamp-3", children: dk.content }),
              dk.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex flex-wrap gap-1 mt-1.5", children: dk.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "text-xs text-text-muted space-y-1 pt-3 border-t border-border-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
          "State ID:",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("code", { className: "bg-bg-secondary px-1 rounded", children: selectedState.state_id })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
          "Created:",
          " ",
          new Date(selectedState.created_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
          "Updated:",
          " ",
          new Date(selectedState.updated_at).toLocaleDateString()
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex items-center justify-center h-full text-text-muted", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.Layers, { className: "size-12 mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm", children: "Select a state to view its details" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "text-xs mt-1 text-text-muted/70", children: [
        states.length,
        " state",
        states.length !== 1 ? "s" : "",
        " available"
      ] })
    ] }) }) })
  ] });
}

// src/components/state-machine/PathfindingPanel.tsx
var import_react11 = require("react");
var import_workflow_utils5 = require("@qontinui/workflow-utils");
var import_jsx_runtime8 = require("react/jsx-runtime");
function PathfindingPanel({
  states,
  transitions,
  onPathFound,
  onFindPath
}) {
  const [fromStateId, setFromStateId] = (0, import_react11.useState)("");
  const [targetStateId, setTargetStateId] = (0, import_react11.useState)("");
  const [algorithm, setAlgorithm] = (0, import_react11.useState)("dijkstra");
  const [result, setResult] = (0, import_react11.useState)(null);
  const [isSearching, setIsSearching] = (0, import_react11.useState)(false);
  const handleFind = (0, import_react11.useCallback)(async () => {
    if (!fromStateId || !targetStateId) return;
    setIsSearching(true);
    try {
      let pathResult;
      if (onFindPath) {
        pathResult = await onFindPath([fromStateId], [targetStateId]);
      } else {
        pathResult = (0, import_workflow_utils5.findPath)(
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
  const clearResult = (0, import_react11.useCallback)(() => {
    setResult(null);
    onPathFound?.({ found: false, steps: [], total_cost: 0 });
  }, [onPathFound]);
  const stateName = (stateId) => states.find((s) => s.state_id === stateId)?.name ?? stateId;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Pathfinding" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "From" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "select",
          {
            value: fromStateId,
            onChange: (e) => setFromStateId(e.target.value),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: "Select state..." }),
              states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("label", { className: "block text-xs text-text-secondary mb-1", children: "To" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "select",
          {
            value: targetStateId,
            onChange: (e) => setTargetStateId(e.target.value),
            className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "", children: "Select state..." }),
              states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: s.state_id, children: s.name }, s.state_id))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex gap-2", children: [
      !onFindPath && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "select",
        {
          value: algorithm,
          onChange: (e) => setAlgorithm(e.target.value),
          className: "px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "dijkstra", children: "Dijkstra (cheapest)" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: "bfs", children: "BFS (shortest)" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "button",
        {
          onClick: handleFind,
          disabled: !fromStateId || !targetStateId || isSearching,
          className: "flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded",
          children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: isSearching ? "Searching..." : "Find Path" })
        }
      ),
      result && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "button",
        {
          onClick: clearResult,
          className: "px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border-secondary rounded",
          children: "Clear"
        }
      )
    ] }),
    result && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "border-t border-border-secondary pt-3", children: result.found ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "text-xs text-green-400 font-medium", children: [
          "Path found (",
          result.steps.length,
          " step",
          result.steps.length !== 1 ? "s" : "",
          ")"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "text-xs text-text-secondary", children: [
          "Total cost: ",
          result.total_cost.toFixed(1)
        ] })
      ] }),
      result.steps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-xs text-text-secondary italic", children: "Already at target state" }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "space-y-1.5", children: result.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "div",
        {
          className: "p-2 bg-bg-tertiary border border-border-secondary rounded text-xs",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "font-medium text-text-primary", children: [
                i + 1,
                ". ",
                step.transition_name
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "text-text-secondary", children: [
                "cost: ",
                step.path_cost.toFixed(1)
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mt-1 text-text-secondary", children: [
              step.from_states.map(stateName).join(", "),
              " \u2192 ",
              step.activate_states.map(stateName).join(", "),
              step.exit_states.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "text-red-400", children: [
                " (exits: ",
                step.exit_states.map(stateName).join(", "),
                ")"
              ] })
            ] })
          ]
        },
        i
      )) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "text-xs text-red-400", children: result.error ?? "No path found between the specified states" }) })
  ] });
}

// src/components/state-machine/StateViewTable.tsx
var import_react12 = require("react");
var import_workflow_utils6 = require("@qontinui/workflow-utils");
var import_jsx_runtime9 = require("react/jsx-runtime");
function StateViewTable({
  states,
  selectedStateId,
  onSelectState
}) {
  const [filter, setFilter] = (0, import_react12.useState)("");
  const filteredStates = (0, import_react12.useMemo)(() => {
    if (!filter.trim()) return states;
    const q = filter.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(q) || s.element_ids.some((eid) => eid.toLowerCase().includes(q))
    );
  }, [states, filter]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-col gap-3 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("h3", { className: "text-sm font-semibold text-text-primary", children: [
      "States (",
      states.length,
      ")"
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "input",
      {
        type: "text",
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        placeholder: "Filter by name or element ID...",
        className: "w-full px-2 py-1.5 text-sm bg-bg-tertiary border border-border-secondary rounded text-text-primary placeholder:text-text-muted"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-1", children: [
      filteredStates.map((state) => {
        const isSelected = state.state_id === selectedStateId;
        const confidenceColor = (0, import_workflow_utils6.getConfidenceColor)(state.confidence);
        const confidencePct = Math.round(state.confidence * 100);
        const typeCounts = /* @__PURE__ */ new Map();
        for (const eid of state.element_ids) {
          const prefix = (0, import_workflow_utils6.getElementTypePrefix)(eid);
          typeCounts.set(prefix, (typeCounts.get(prefix) ?? 0) + 1);
        }
        const sortedTypes = Array.from(typeCounts.entries()).sort(
          (a, b) => b[1] - a[1]
        );
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "button",
          {
            onClick: () => onSelectState(isSelected ? null : state.state_id),
            className: `w-full text-left p-2.5 rounded border transition-colors ${isSelected ? "bg-brand-primary/10 border-brand-primary/30" : "bg-bg-tertiary border-border-secondary hover:border-text-muted"}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-sm font-medium text-text-primary truncate", children: state.name }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-2 text-xs shrink-0 ml-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "text-text-secondary", children: [
                    state.element_ids.length,
                    " el"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: confidenceColor, children: [
                    confidencePct,
                    "%"
                  ] })
                ] })
              ] }),
              sortedTypes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                sortedTypes.slice(0, 5).map(([prefix, count]) => {
                  const style = (0, import_workflow_utils6.getElementTypeStyle)(`${prefix}:dummy`);
                  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
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
                sortedTypes.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "px-1 py-0.5 text-[10px] text-text-muted", children: [
                  "+",
                  sortedTypes.length - 5,
                  " more"
                ] })
              ] }),
              state.description && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-xs text-text-secondary mt-1 line-clamp-1", children: state.description })
            ]
          },
          state.state_id
        );
      }),
      filteredStates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-xs text-text-muted italic text-center py-4", children: filter ? "No states match the filter" : "No states in this config" })
    ] })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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