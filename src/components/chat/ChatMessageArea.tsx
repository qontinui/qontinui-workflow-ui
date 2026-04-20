import { useEffect, useRef, useState, useCallback } from "react";
import type { AiMessage } from "@qontinui/shared-types";

export interface ChatMessageAreaProps {
  messages: AiMessage[];
  streamingContent: string;
  isStreaming: boolean;
  /** Render markdown content. Falls back to plain text if not provided. */
  renderMarkdown?: (content: string) => React.ReactNode;
  /** Called when user clicks "Create Workflow" on an AI message. */
  onCreateWorkflowFromMessage?: (messageIndex: number, content: string) => void;
  /** Current tool activity description (e.g., "Reading file...", "Running command...") */
  toolActivity?: string | null;
}

export function ChatMessageArea({
  messages,
  streamingContent,
  isStreaming,
  renderMarkdown,
  onCreateWorkflowFromMessage,
  toolActivity,
}: ChatMessageAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const prevLenRef = useRef(0);

  useEffect(() => {
    const totalLen = messages.length + streamingContent.length;
    if (autoScroll && totalLen !== prevLenRef.current) {
      prevLenRef.current = totalLen;
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    }
  }, [messages, streamingContent, autoScroll]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    setAutoScroll(true);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const renderContent = (content: string) => {
    if (renderMarkdown) return renderMarkdown(content);
    return (
      <p className="text-sm text-text-primary whitespace-pre-wrap wrap-break-word">
        {content}
      </p>
    );
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 py-4"
    >
      {messages.length === 0 && !streamingContent && (
        <div className="flex flex-col items-center justify-center h-full text-text-muted">
          <svg
            className="size-12 mb-3 opacity-30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
          <p className="text-sm">Start a conversation with AI</p>
          <p className="text-xs mt-1 opacity-60">
            Discuss features, plan workflows, then generate them
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble
          key={`${msg.timestamp ?? i}-${msg.role}`}
          message={msg}
          index={i}
          renderContent={renderContent}
          onCreateWorkflow={onCreateWorkflowFromMessage}
        />
      ))}

      {/* Streaming indicator with content */}
      {isStreaming && streamingContent && (
        <div className="flex gap-3 items-start">
          <div className="shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center">
            <AiBotIcon />
          </div>
          <div className="max-w-[85%]">
            <div
              className="rounded-lg px-4 py-3 border border-border-subtle/30"
              style={{ background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" }}
            >
              <div className="max-w-none text-sm">
                {renderContent(streamingContent)}
              </div>
              <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Streaming with no content yet — show tool activity or bouncing dots */}
      {isStreaming && !streamingContent && (
        <div className="flex gap-3 items-start">
          <div className="shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center">
            <AiBotIcon />
          </div>
          <div
            className="rounded-lg px-4 py-3 border border-border-subtle/30"
            style={{ background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" }}
          >
            {toolActivity ? (
              <div className="flex items-center gap-2">
                <svg className="size-3.5 text-purple-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="m4.93 4.93 2.83 2.83" />
                  <path d="m16.24 16.24 2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="m4.93 19.07 2.83-2.83" />
                  <path d="m16.24 7.76 2.83-2.83" />
                </svg>
                <span className="text-xs text-purple-300/80">{toolActivity}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool activity while streaming content (shown below the streaming bubble) */}
      {isStreaming && streamingContent && toolActivity && (
        <div className="flex gap-3 items-center ml-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-raised/20">
            <svg className="size-3 text-purple-400/60 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="m4.93 4.93 2.83 2.83" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="m4.93 19.07 2.83-2.83" />
              <path d="m16.24 7.76 2.83-2.83" />
            </svg>
            <span className="text-xs text-text-muted">{toolActivity}</span>
          </div>
        </div>
      )}

      {/* Scroll to bottom button */}
      {!autoScroll && (
        <button
          onClick={scrollToBottom}
          className="sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle/50 text-text-secondary text-xs hover:bg-surface-hover flex items-center gap-1.5 shadow-lg"
        >
          <svg
            className="size-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          Scroll to bottom
        </button>
      )}
    </div>
  );
}

function AiBotIcon() {
  return (
    <svg
      className="size-4 text-purple-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="size-4 text-brand-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MessageBubble({
  message,
  index,
  renderContent,
  onCreateWorkflow,
}: {
  message: AiMessage;
  index: number;
  renderContent: (content: string) => React.ReactNode;
  onCreateWorkflow?: (messageIndex: number, content: string) => void;
}) {
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  if (message.role === "system") {
    return (
      <div className="flex justify-center py-1">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-raised/40 border border-border-subtle/20">
          <svg
            className="size-3.5 text-text-muted/70 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span className="text-xs text-text-muted/80">{message.content}</span>
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex gap-3 items-start justify-end">
        <div className="max-w-[85%]">
          <div
            className="rounded-lg px-4 py-3 border border-brand-primary/30"
            style={{ background: "color-mix(in srgb, var(--qontinui-brand-primary, #4a90d9) 10%, var(--qontinui-surface-canvas, #111115))" }}
          >
            <div className="text-sm text-text-primary">
              {renderContent(message.content)}
            </div>
          </div>
          {formattedTime && (
            <div className="text-[10px] text-text-muted/60 mt-1 text-right">{formattedTime}</div>
          )}
        </div>
        <div className="shrink-0 w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <UserIcon />
        </div>
      </div>
    );
  }

  return (
    <div className="group/msg flex gap-3 items-start">
      <div className="shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center">
        <AiBotIcon />
      </div>
      <div className="max-w-[85%]">
        <div
          className="rounded-lg px-4 py-3 border border-border-subtle/30"
          style={{ background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" }}
        >
          <div className="max-w-none text-sm">
            {renderContent(message.content)}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {formattedTime && (
            <span className="text-[10px] text-text-muted/60">{formattedTime}</span>
          )}
          {onCreateWorkflow && (
            <button
              onClick={() => onCreateWorkflow(index, message.content)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-muted hover:text-purple-300 hover:bg-purple-900/20 transition-colors opacity-0 group-hover/msg:opacity-100"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
              Create Workflow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
