import React, { createContext, useContext } from "react";
import type { WorkflowDataAdapter } from "./types";

const WorkflowDataContext = createContext<WorkflowDataAdapter | null>(null);

export function WorkflowDataProvider({
  adapter,
  children,
}: {
  adapter: WorkflowDataAdapter;
  children: React.ReactNode;
}) {
  return (
    <WorkflowDataContext.Provider value={adapter}>
      {children}
    </WorkflowDataContext.Provider>
  );
}

export function useWorkflowData(): WorkflowDataAdapter {
  const ctx = useContext(WorkflowDataContext);
  if (!ctx)
    throw new Error(
      "useWorkflowData must be used within WorkflowDataProvider",
    );
  return ctx;
}
