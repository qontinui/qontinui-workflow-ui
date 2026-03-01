/**
 * Headless Settings Panel
 *
 * Provides render props for a config-driven settings panel. The headless
 * layer handles visibility filtering, default resolution, and invertDisplay
 * logic. Apps provide the actual UI rendering.
 */

import React, { useMemo, useCallback } from "react";
import type { WorkflowFeatures } from "@qontinui/shared-types/workflow";
import {
  type SettingDef,
  type SettingsSection,
  type BooleanSettingDef,
  WORKFLOW_SETTINGS_CONFIG,
  getVisibleSections,
  getBooleanDisplayValue,
  toBooleanStoredValue,
} from "@qontinui/workflow-utils";

// =============================================================================
// Types
// =============================================================================

/**
 * Full workflow settings surface. Covers all fields that can appear in
 * the settings panel. Apps pass their workflow object cast to this shape.
 */
export interface WorkflowSettings {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  max_iterations?: number;
  timeout_seconds?: number | null;
  provider?: string;
  model?: string;
  skip_ai_summary?: boolean;
  log_watch_enabled?: boolean;
  health_check_enabled?: boolean;
  stop_on_failure?: boolean;
  reflection_mode?: boolean;
  log_source_selection?: unknown;
  health_check_urls?: unknown[];
  prompt_template?: string;
  [key: string]: unknown;
}

export interface SettingsPanelRenderProps {
  settings: WorkflowSettings;
  features: WorkflowFeatures;
  onChange: (updates: Partial<WorkflowSettings>) => void;

  /** Visible sections after filtering by workflow features */
  visibleSections: SettingsSection[];

  /** Get the display value for a boolean setting (handles invertDisplay + defaults) */
  getBooleanValue: (def: BooleanSettingDef) => boolean;

  /** Set a boolean setting from its display value (handles invertDisplay) */
  setBooleanValue: (def: BooleanSettingDef, displayValue: boolean) => void;

  /** Get a raw value from settings by key */
  getValue: (key: string) => unknown;

  /** Set a single setting value */
  setValue: (key: string, value: unknown) => void;
}

export interface SettingsPanelProps {
  settings: WorkflowSettings;
  features: WorkflowFeatures;
  onChange: (updates: Partial<WorkflowSettings>) => void;
  /** Override the default section config */
  config?: readonly SettingsSection[];
  children: (props: SettingsPanelRenderProps) => React.ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export function SettingsPanel({
  settings,
  features,
  onChange,
  config,
  children,
}: SettingsPanelProps) {
  const sectionConfig = config ?? WORKFLOW_SETTINGS_CONFIG;

  const visibleSections = useMemo(
    () => getVisibleSections(sectionConfig, features),
    [sectionConfig, features],
  );

  const getBooleanValue = useCallback(
    (def: BooleanSettingDef): boolean => {
      return getBooleanDisplayValue(def, settings[def.key]);
    },
    [settings],
  );

  const setBooleanValue = useCallback(
    (def: BooleanSettingDef, displayValue: boolean): void => {
      onChange({ [def.key]: toBooleanStoredValue(def, displayValue) });
    },
    [onChange],
  );

  const getValue = useCallback(
    (key: string): unknown => settings[key],
    [settings],
  );

  const setValue = useCallback(
    (key: string, value: unknown): void => {
      onChange({ [key]: value });
    },
    [onChange],
  );

  return (
    <>
      {children({
        settings,
        features,
        onChange,
        visibleSections,
        getBooleanValue,
        setBooleanValue,
        getValue,
        setValue,
      })}
    </>
  );
}
