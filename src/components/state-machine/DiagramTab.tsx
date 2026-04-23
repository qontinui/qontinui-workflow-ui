/**
 * DiagramTab — live Mermaid rendering of the loaded state machine.
 *
 * Renders a Mermaid ``stateDiagram-v2`` (fetched from the runner's
 * ``GET /state-machine/mermaid-diagram`` endpoint) with active-state
 * highlighting baked into the diagram source by ``PathVisualizer``.
 *
 * ``mermaid`` is imported dynamically so this package stays headless —
 * consumers must add ``mermaid`` as a dependency (declared as an optional
 * peer here). If the dynamic import fails, a helpful install hint is shown
 * instead of a blank pane.
 */

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Loader2, Workflow } from "lucide-react";

export interface DiagramTabProps {
  /**
   * Hypothetical active-state IDs the parent used when fetching
   * ``diagramSource``. Passed through for display purposes only — the
   * highlighting is already encoded in ``diagramSource``.
   */
  activeStateIds?: string[];
  /** Mermaid diagram source (``stateDiagram-v2``). */
  diagramSource?: string;
  /** Whether the parent is currently fetching the diagram. */
  isLoading?: boolean;
  /** Optional: manual refresh handler. Shows a refresh button when provided. */
  onRefresh?: () => void;
  /**
   * If set, render this message instead of the diagram. Caller uses this to
   * signal "too large to render" without DiagramTab needing to know about
   * state counts or other domain concepts.
   */
  unavailableReason?: string;
}

export function DiagramTab({
  activeStateIds,
  diagramSource,
  isLoading,
  onRefresh,
  unavailableReason,
}: DiagramTabProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    // Skip rendering when the caller says the diagram is unavailable —
    // protects mermaid from trying to lay out huge graphs.
    if (unavailableReason) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      setRenderError(null);
      return;
    }
    if (!diagramSource || !diagramSource.trim()) {
      // Clear any prior render when source becomes empty
      if (containerRef.current) containerRef.current.innerHTML = "";
      setRenderError(null);
      return;
    }

    // Loose type for the dynamic import result. ``mermaid`` is declared as an
    // optional peer dependency so it may be absent at type-check time in
    // bundler-less consumers — treat it structurally.
    interface MermaidLike {
      initialize: (opts: Record<string, unknown>) => void;
      render: (
        id: string,
        src: string,
      ) => Promise<{ svg: string; bindFunctions?: (el: Element) => void }>;
    }

    let cancelled = false;
    void (async () => {
      // Using a non-literal specifier avoids the TS2307 "cannot find module
      // 'mermaid'" error when the optional peer is not installed for
      // type-checking. Bundlers still resolve this at build time for runner
      // consumers that install ``mermaid``.
      const specifier = "mermaid";
      const mod = (await import(/* @vite-ignore */ specifier).catch(
        (e: unknown) => {
          if (!cancelled) {
            setImportError(
              e instanceof Error ? e.message : "Failed to load `mermaid`",
            );
          }
          return null;
        },
      )) as { default: MermaidLike } | null;
      if (cancelled || !mod) return;
      setImportError(null);

      const mermaid = mod.default;
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
        });
        // Unique ID per render so re-renders don't collide with a stale DOM
        // subtree from an earlier call.
        const id = `qontinui-sm-diagram-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagramSource);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        setRenderError(null);
      } catch (e) {
        if (cancelled) return;
        setRenderError(e instanceof Error ? e.message : String(e));
        if (containerRef.current) {
          // Preserve the source so the user can debug a malformed diagram.
          containerRef.current.innerHTML = "";
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [diagramSource, unavailableReason]);

  const hasSource = !!diagramSource && diagramSource.trim().length > 0;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border-primary bg-surface-primary">
        <div className="flex items-center gap-2">
          <Workflow className="size-4 text-brand-primary" />
          <h2 className="text-sm font-semibold text-text-primary">
            State Machine Diagram
          </h2>
          {activeStateIds && activeStateIds.length > 0 && (
            <span className="text-xs text-text-muted ml-2">
              (highlighting {activeStateIds.length} hypothetical active state
              {activeStateIds.length === 1 ? "" : "s"})
            </span>
          )}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border border-border-primary text-text-primary hover:bg-surface-secondary disabled:opacity-50"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-auto p-6 bg-surface-secondary">
        {unavailableReason && (
          <div className="flex items-center justify-center h-full text-text-muted text-sm text-center px-6">
            {unavailableReason}
          </div>
        )}

        {!unavailableReason && isLoading && (
          <div className="flex items-center justify-center h-full text-text-muted gap-2">
            <Loader2 className="size-4 animate-spin" />
            Loading diagram…
          </div>
        )}

        {!unavailableReason && !isLoading && importError && (
          <div className="max-w-xl mx-auto p-4 border border-border-primary rounded-md bg-surface-primary text-sm text-text-primary">
            <p className="font-semibold mb-1">
              Mermaid is not available in this bundle.
            </p>
            <p className="text-text-muted">
              Install <code className="font-mono">mermaid</code> (e.g.{" "}
              <code className="font-mono">npm install mermaid</code>) to enable
              the Diagram tab.
            </p>
            <p className="text-xs text-text-muted mt-2">
              Import error: {importError}
            </p>
          </div>
        )}

        {!unavailableReason && !isLoading && !importError && !hasSource && (
          <div className="flex items-center justify-center h-full text-text-muted">
            No diagram available
          </div>
        )}

        {!unavailableReason && !isLoading && !importError && hasSource && renderError && (
          <div className="max-w-xl mx-auto p-4 border border-border-primary rounded-md bg-surface-primary text-sm">
            <p className="font-semibold mb-1 text-text-primary">
              Failed to render diagram.
            </p>
            <pre className="text-xs text-text-muted whitespace-pre-wrap">
              {renderError}
            </pre>
          </div>
        )}

        {/* Rendered SVG target (always mounted so the effect can write into
            it once the dynamic import resolves). */}
        <div
          ref={containerRef}
          className="mermaid-diagram flex items-center justify-center"
          style={{
            display: hasSource && !importError && !unavailableReason ? undefined : "none",
          }}
        />
      </div>
    </div>
  );
}

export default DiagramTab;
