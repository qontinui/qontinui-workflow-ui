import { useState, useRef, useCallback, useEffect } from "react";
import type { AiSessionState } from "@qontinui/shared-types";

export interface ChatInputProps {
  sessionState: AiSessionState;
  onSendMessage: (content: string) => void;
  onInterrupt: () => void;
  onGenerateWorkflow: (includeUIBridge: boolean) => void;
  isGeneratingWorkflow: boolean;
  messageCount: number;
  disabled?: boolean;
}

export function ChatInput({
  sessionState,
  onSendMessage,
  onInterrupt,
  onGenerateWorkflow,
  isGeneratingWorkflow,
  messageCount,
  disabled,
}: ChatInputProps) {
  const [message, setMessage] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("chat-draft-message") ?? "";
  });
  const [includeUIBridge, setIncludeUIBridge] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("chat-include-ui-bridge");
    return saved !== null ? saved === "true" : true;
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend =
    !disabled &&
    message.trim().length > 0 &&
    (sessionState === "ready" || sessionState === "processing");

  const canInterrupt = sessionState === "processing";
  const showGenerateWorkflow = messageCount >= 2;

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
    localStorage.removeItem("chat-draft-message");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) {
          handleSend();
        }
      }
    },
    [canSend, handleSend],
  );

  useEffect(() => {
    localStorage.setItem("chat-include-ui-bridge", String(includeUIBridge));
  }, [includeUIBridge]);

  // Persist draft message so it survives page navigation
  useEffect(() => {
    if (message) {
      localStorage.setItem("chat-draft-message", message);
    } else {
      localStorage.removeItem("chat-draft-message");
    }
  }, [message]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }
  }, [message]);

  const stateLabel =
    sessionState === "ready"
      ? "Ready"
      : sessionState === "processing"
        ? "Processing..."
        : sessionState === "initializing"
          ? "Initializing..."
          : sessionState === "connecting"
            ? "Connecting..."
            : sessionState === "disconnected"
              ? "Disconnected"
              : sessionState === "closed"
                ? "Session Closed"
                : "";

  const stateColor =
    sessionState === "ready"
      ? "text-green-400"
      : sessionState === "processing"
        ? "text-amber-400"
        : "text-text-muted";

  return (
    <div className="border-t border-border-subtle/50 p-4">
      {/* State indicator and toolbar */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs ${stateColor}`}>{stateLabel}</span>
        <div className="flex items-center gap-2">
          {showGenerateWorkflow && (
            <>
              <label
                className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none"
                title="Include UI Bridge SDK integration instructions in the generated workflow"
              >
                <input
                  type="checkbox"
                  checked={includeUIBridge}
                  onChange={(e) => setIncludeUIBridge(e.target.checked)}
                  disabled={isGeneratingWorkflow || disabled}
                  className="rounded border-border-subtle accent-purple-500"
                />
                UI Bridge
              </label>
              <button
                onClick={() => onGenerateWorkflow(includeUIBridge)}
                disabled={isGeneratingWorkflow || disabled}
                className="inline-flex items-center gap-1.5 text-xs h-7 px-2.5 rounded-md border border-purple-800/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingWorkflow ? (
                  <svg
                    className="size-3 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg
                    className="size-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                )}
                {isGeneratingWorkflow ? "Generating..." : "Generate Workflow"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            sessionState === "disconnected"
              ? "Disconnected from runner..."
              : sessionState === "closed"
                ? "Session is closed"
                : "Type a message... (Enter to send, Shift+Enter for newline)"
          }
          disabled={
            disabled ||
            sessionState === "disconnected" ||
            sessionState === "closed"
          }
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-surface-canvas px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: "42px", maxHeight: "240px" }}
        />

        {canInterrupt ? (
          <button
            onClick={onInterrupt}
            className="h-[42px] px-3 rounded-md border border-amber-800/50 text-amber-400 hover:bg-amber-900/30 flex items-center justify-center"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="h-[42px] px-3 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
