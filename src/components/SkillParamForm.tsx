/**
 * Skill Parameter Form
 *
 * Renders a form from a skill's SkillParameter[] definition.
 * Supports string, number, boolean, and select parameter types.
 * Shared across both frontends.
 */

import React from "react";
import type { SkillParameter } from "@qontinui/shared-types/workflow";

// =============================================================================
// Types
// =============================================================================

export interface SkillParamFormProps {
  parameters: SkillParameter[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  errors?: string[];
}

// =============================================================================
// Component
// =============================================================================

export function SkillParamForm({
  parameters,
  values,
  onChange,
  errors,
}: SkillParamFormProps) {
  if (parameters.length === 0) {
    return (
      <p className="text-sm text-zinc-500 italic py-2">
        No parameters needed — this skill is ready to use.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {parameters.map((param) => {
        // Conditional visibility: hide if depends_on condition is not met
        if (param.depends_on) {
          const depValue = values[param.depends_on.param];
          if (depValue !== param.depends_on.value) {
            return null;
          }
        }

        return (
          <SkillParamField
            key={param.name}
            param={param}
            value={values[param.name]}
            onChange={(value) => onChange(param.name, value)}
          />
        );
      })}
      {errors && errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-400">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Individual Field
// =============================================================================

interface SkillParamFieldProps {
  param: SkillParameter;
  value: unknown;
  onChange: (value: unknown) => void;
}

function SkillParamField({ param, value, onChange }: SkillParamFieldProps) {
  const inputClasses =
    "w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-200 " +
    "placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500";

  return (
    <div>
      <label className="flex items-center gap-1 text-sm text-zinc-300 mb-1">
        {param.label}
        {param.required && <span className="text-red-400">*</span>}
      </label>
      {param.description && (
        <p className="text-xs text-zinc-500 mb-1.5">{param.description}</p>
      )}

      {param.type === "string" && (
        <>
          <input
            type="text"
            className={inputClasses}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={param.placeholder}
          />
          {param.pattern && (
            <p className="text-[11px] text-zinc-600 mt-1">
              Pattern: <code className="text-zinc-500">{param.pattern}</code>
            </p>
          )}
        </>
      )}

      {param.type === "number" && (
        <>
          <input
            type="number"
            className={inputClasses}
            value={value !== undefined && value !== null ? String(value) : ""}
            onChange={(e) => {
              const num = e.target.value === "" ? undefined : Number(e.target.value);
              onChange(num);
            }}
            placeholder={param.placeholder}
            min={param.min}
            max={param.max}
          />
          {(param.min != null || param.max != null) && (
            <p className="text-[11px] text-zinc-600 mt-1">
              {param.min != null && param.max != null
                ? `Range: ${param.min} – ${param.max}`
                : param.min != null
                  ? `Min: ${param.min}`
                  : `Max: ${param.max}`}
            </p>
          )}
        </>
      )}

      {param.type === "boolean" && (
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          className={`
            relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full
            transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-500
            ${value ? "bg-blue-500" : "bg-zinc-700"}
          `}
          onClick={() => onChange(!value)}
        >
          <span
            className={`
              pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow
              transform transition-transform mt-0.5
              ${value ? "translate-x-5 ml-0.5" : "translate-x-0.5"}
            `}
          />
        </button>
      )}

      {param.type === "select" && param.options && (
        <select
          className={inputClasses}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {param.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
