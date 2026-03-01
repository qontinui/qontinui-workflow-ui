// src/UIProvider.tsx
import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";
var CollapsibleOpenCtx = createContext(true);
function DefaultCollapsible({
  open,
  children,
  className
}) {
  return /* @__PURE__ */ jsx(CollapsibleOpenCtx.Provider, { value: open, children: /* @__PURE__ */ jsx("div", { className, children }) });
}
function DefaultCollapsibleTrigger({
  children,
  className
}) {
  return /* @__PURE__ */ jsx("div", { className, children });
}
function DefaultCollapsibleContent({
  children,
  className
}) {
  const open = useContext(CollapsibleOpenCtx);
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className, children });
}
var defaultPrimitives = {
  Collapsible: DefaultCollapsible,
  CollapsibleTrigger: DefaultCollapsibleTrigger,
  CollapsibleContent: DefaultCollapsibleContent
};
var UIContext = createContext(defaultPrimitives);
function UIProvider({ primitives, children }) {
  const merged = { ...defaultPrimitives, ...primitives };
  return /* @__PURE__ */ jsx(UIContext.Provider, { value: merged, children });
}
function useUIPrimitives() {
  return useContext(UIContext);
}

export {
  UIProvider,
  useUIPrimitives
};
//# sourceMappingURL=chunk-2RKBTL3R.js.map