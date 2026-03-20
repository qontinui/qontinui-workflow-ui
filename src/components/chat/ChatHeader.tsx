import { useState, useCallback, useRef, useEffect } from "react";
import type { AiSessionState } from "@qontinui/shared-types";

export interface ChatHeaderProps {
  sessionName: string;
  sessionState: AiSessionState;
  onRename: (name: string) => void;
  onClose: () => void;
  /** Optional: show runner connection status (web only). */
  isRunnerConnected?: boolean;
}

function StateBadge({ state }: { state: AiSessionState }) {
  const config: Record<string, { classes: string; label: string }> = {
    ready: {
      classes: "bg-green-900/30 border-green-800/50 text-green-400",
      label: "Ready",
    },
    processing: {
      classes: "bg-amber-900/30 border-amber-800/50 text-amber-400",
      label: "Processing",
    },
    initializing: {
      classes: "bg-blue-900/30 border-blue-800/50 text-blue-400",
      label: "Initializing",
    },
    disconnected: {
      classes: "bg-red-900/30 border-red-800/50 text-red-400",
      label: "Disconnected",
    },
    closed: {
      classes: "bg-zinc-900/30 border-zinc-700/50 text-zinc-400",
      label: "Closed",
    },
    error: {
      classes: "bg-red-900/30 border-red-800/50 text-red-400",
      label: "Error",
    },
  };
  const c = config[state];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${c.classes}`}
    >
      {c.label}
    </span>
  );
}

export function ChatHeader({
  sessionName,
  sessionState,
  onRename,
  onClose,
  isRunnerConnected,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(sessionName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync editValue when sessionName changes externally (derived state)
  const displayEditValue = isEditing ? editValue : sessionName;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== sessionName) {
      onRename(trimmed);
    }
    setIsEditing(false);
  }, [editValue, sessionName, onRename]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setEditValue(sessionName);
        setIsEditing(false);
      }
    },
    [handleSave, sessionName],
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle/50 bg-surface-canvas/80 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <svg
          className="size-5 text-purple-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>

        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={displayEditValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="bg-surface-canvas border border-border-subtle/50 rounded px-2 py-0.5 text-sm text-text-primary focus:outline-hidden focus:border-brand-primary/50"
              maxLength={60}
            />
            <button
              onClick={handleSave}
              className="text-green-400 hover:text-green-300"
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setEditValue(sessionName); setIsEditing(true); }}
            className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-text-secondary group"
          >
            {sessionName}
            <svg
              className="size-3 opacity-0 group-hover:opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        )}

        <StateBadge state={sessionState} />

        {isRunnerConnected !== undefined && (
          <span className="flex items-center gap-1 text-[10px]">
            <span
              className={`inline-block size-1.5 rounded-full ${isRunnerConnected ? "bg-green-400" : "bg-red-400"}`}
            />
            <span
              className={
                isRunnerConnected ? "text-green-400" : "text-red-400"
              }
            >
              {isRunnerConnected ? "Runner" : "Runner offline"}
            </span>
          </span>
        )}
      </div>

      <button
        onClick={onClose}
        className="h-7 w-7 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-surface-hover"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
