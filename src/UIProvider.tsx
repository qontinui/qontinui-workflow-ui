/**
 * UI Primitives Provider
 *
 * Provides injectable UI primitives (Collapsible, Dialog, etc.) so that
 * concrete shared components can render structural containers without
 * depending on a specific component library.
 *
 * - Web provides Radix Collapsible, shadcn Dialog, etc.
 * - Runner provides raw div-based expand/collapse.
 * - Default primitives use plain HTML — works without any provider.
 */

import React, { createContext, useContext } from "react";

// =============================================================================
// Primitive Interfaces
// =============================================================================

export interface CollapsibleProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface UIPrimitives {
  Collapsible: React.ComponentType<CollapsibleProps>;
  CollapsibleTrigger: React.ComponentType<CollapsibleTriggerProps>;
  CollapsibleContent: React.ComponentType<CollapsibleContentProps>;
}

// =============================================================================
// Default Primitives (plain HTML with open/close via context)
// =============================================================================

const CollapsibleOpenCtx = createContext<boolean>(true);

function DefaultCollapsible({
  open,
  children,
  className,
}: CollapsibleProps) {
  return (
    <CollapsibleOpenCtx.Provider value={open}>
      <div className={className}>{children}</div>
    </CollapsibleOpenCtx.Provider>
  );
}

function DefaultCollapsibleTrigger({
  children,
  className,
}: CollapsibleTriggerProps) {
  return <div className={className}>{children}</div>;
}

function DefaultCollapsibleContent({
  children,
  className,
}: CollapsibleContentProps) {
  const open = useContext(CollapsibleOpenCtx);
  if (!open) return null;
  return <div className={className}>{children}</div>;
}

const defaultPrimitives: UIPrimitives = {
  Collapsible: DefaultCollapsible,
  CollapsibleTrigger: DefaultCollapsibleTrigger,
  CollapsibleContent: DefaultCollapsibleContent,
};

// =============================================================================
// Context
// =============================================================================

const UIContext = createContext<UIPrimitives>(defaultPrimitives);

export interface UIProviderProps {
  primitives: Partial<UIPrimitives>;
  children: React.ReactNode;
}

/**
 * Provide UI primitives to shared concrete components.
 *
 * ```tsx
 * // Web app (Radix)
 * <UIProvider primitives={{ Collapsible, CollapsibleTrigger, CollapsibleContent }}>
 *   <App />
 * </UIProvider>
 *
 * // Runner app (no provider needed — uses defaults)
 * <App />
 * ```
 */
export function UIProvider({ primitives, children }: UIProviderProps) {
  const merged: UIPrimitives = { ...defaultPrimitives, ...primitives };
  return <UIContext.Provider value={merged}>{children}</UIContext.Provider>;
}

/**
 * Access UI primitives from the nearest UIProvider (or defaults).
 */
export function useUIPrimitives(): UIPrimitives {
  return useContext(UIContext);
}
