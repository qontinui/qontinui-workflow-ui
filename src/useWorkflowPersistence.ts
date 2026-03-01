import { useEffect, useRef } from "react";
import type { UnifiedWorkflow } from "@qontinui/shared-types/workflow";

export function useWorkflowPersistence(
  storageKey: string,
  workflow: UnifiedWorkflow,
  setWorkflow: (wf: UnifiedWorkflow) => void,
) {
  const isInitialLoad = useRef(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (!isInitialLoad.current) return;
    isInitialLoad.current = false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as UnifiedWorkflow;
        if (parsed && parsed.id !== undefined) {
          setWorkflow(parsed);
        }
      }
    } catch {
      /* ignore parse errors */
    }
  }, [storageKey, setWorkflow]);

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (isInitialLoad.current) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(workflow));
      } catch {
        /* ignore quota errors */
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [storageKey, workflow]);
}

export function clearWorkflowDraft(storageKey: string): void {
  localStorage.removeItem(storageKey);
}
