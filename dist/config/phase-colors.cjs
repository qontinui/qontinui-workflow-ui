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

// src/config/phase-colors.ts
var phase_colors_exports = {};
__export(phase_colors_exports, {
  PHASE_COLORS: () => PHASE_COLORS
});
module.exports = __toCommonJS(phase_colors_exports);
var PHASE_COLORS = {
  setup: {
    bg: "bg-blue-500/5",
    bgHeader: "bg-blue-500/10",
    border: "border-blue-500/30",
    borderHover: "hover:border-blue-500/50",
    text: "text-blue-400",
    textMuted: "text-blue-400/60",
    badge: "bg-blue-900/50 text-blue-300",
    button: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
  },
  verification: {
    bg: "bg-green-500/5",
    bgHeader: "bg-green-500/10",
    border: "border-green-500/30",
    borderHover: "hover:border-green-500/50",
    text: "text-green-400",
    textMuted: "text-green-400/60",
    badge: "bg-green-900/50 text-green-300",
    button: "bg-green-500/10 hover:bg-green-500/20 text-green-400"
  },
  agentic: {
    bg: "bg-amber-500/5",
    bgHeader: "bg-amber-500/10",
    border: "border-amber-500/30",
    borderHover: "hover:border-amber-500/50",
    text: "text-amber-400",
    textMuted: "text-amber-400/60",
    badge: "bg-amber-900/50 text-amber-300",
    button: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
  },
  completion: {
    bg: "bg-purple-500/5",
    bgHeader: "bg-purple-500/10",
    border: "border-purple-500/30",
    borderHover: "hover:border-purple-500/50",
    text: "text-purple-400",
    textMuted: "text-purple-400/60",
    badge: "bg-purple-900/50 text-purple-300",
    button: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PHASE_COLORS
});
//# sourceMappingURL=phase-colors.cjs.map