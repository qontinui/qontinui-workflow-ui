// src/headless/SkillCatalog.tsx
import { useState, useMemo, useCallback } from "react";
import {
  searchSkills,
  getSkillsByPhase,
  validateSkillParams,
  instantiateSkill
} from "@qontinui/workflow-utils";
import { Fragment, jsx } from "react/jsx-runtime";
function SkillCatalog({
  phase,
  onAddSteps,
  onClose,
  onSkillUsed,
  children
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(
    null
  );
  const [paramValues, setParamValues] = useState({});
  const mode = selectedSkill ? "configure" : "browse";
  const categories = useMemo(() => {
    const phaseSkills = getSkillsByPhase(phase);
    const cats = /* @__PURE__ */ new Set();
    for (const skill of phaseSkills) {
      cats.add(skill.category);
    }
    return Array.from(cats);
  }, [phase]);
  const hasNonBuiltinSkills = useMemo(() => {
    const phaseSkills = getSkillsByPhase(phase);
    return phaseSkills.some((s) => s.source !== "builtin");
  }, [phase]);
  const filteredSkills = useMemo(() => {
    const filters = { phase };
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    if (selectedSource) {
      filters.source = selectedSource;
    }
    return searchSkills(searchQuery, filters);
  }, [searchQuery, selectedCategory, selectedSource, phase]);
  const onSelectSkill = useCallback(
    (skill) => {
      setSelectedSkill(skill);
      const defaults = {};
      for (const param of skill.parameters) {
        if (param.default !== void 0) {
          defaults[param.name] = param.default;
        }
      }
      setParamValues(defaults);
    },
    []
  );
  const setParamValue = useCallback(
    (name, value) => {
      setParamValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const validationErrors = useMemo(() => {
    if (!selectedSkill) return [];
    return validateSkillParams(selectedSkill, paramValues);
  }, [selectedSkill, paramValues]);
  const onConfirm = useCallback(() => {
    if (!selectedSkill || validationErrors.length > 0) return;
    const steps = instantiateSkill(selectedSkill, phase, paramValues);
    onAddSteps(steps, phase);
    if (onSkillUsed) {
      onSkillUsed(selectedSkill.id);
    }
    onClose();
  }, [selectedSkill, phase, paramValues, validationErrors, onAddSteps, onSkillUsed, onClose]);
  const onBack = useCallback(() => {
    setSelectedSkill(null);
    setParamValues({});
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children: children({
    mode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    hasNonBuiltinSkills,
    categories,
    filteredSkills,
    onSelectSkill,
    selectedSkill,
    paramValues,
    setParamValue,
    validationErrors,
    onConfirm,
    onBack
  }) });
}

// src/UIProvider.tsx
import { createContext, useContext } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var CollapsibleOpenCtx = createContext(true);
function DefaultCollapsible({
  open,
  children,
  className
}) {
  return /* @__PURE__ */ jsx2(CollapsibleOpenCtx.Provider, { value: open, children: /* @__PURE__ */ jsx2("div", { className, children }) });
}
function DefaultCollapsibleTrigger({
  children,
  className
}) {
  return /* @__PURE__ */ jsx2("div", { className, children });
}
function DefaultCollapsibleContent({
  children,
  className
}) {
  const open = useContext(CollapsibleOpenCtx);
  if (!open) return null;
  return /* @__PURE__ */ jsx2("div", { className, children });
}
var defaultPrimitives = {
  Collapsible: DefaultCollapsible,
  CollapsibleTrigger: DefaultCollapsibleTrigger,
  CollapsibleContent: DefaultCollapsibleContent
};
var UIContext = createContext(defaultPrimitives);
function UIProvider({ primitives, children }) {
  const merged = { ...defaultPrimitives, ...primitives };
  return /* @__PURE__ */ jsx2(UIContext.Provider, { value: merged, children });
}
function useUIPrimitives() {
  return useContext(UIContext);
}

export {
  SkillCatalog,
  UIProvider,
  useUIPrimitives
};
//# sourceMappingURL=chunk-7BR6KOI7.js.map