// src/components/chat/ChatHeader.tsx
import { useState, useCallback, useRef, useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function StateBadge({ state }) {
  const config = {
    ready: {
      classes: "bg-green-900/30 border-green-800/50 text-green-400",
      label: "Ready"
    },
    processing: {
      classes: "bg-amber-900/30 border-amber-800/50 text-amber-400",
      label: "Processing"
    },
    initializing: {
      classes: "bg-blue-900/30 border-blue-800/50 text-blue-400",
      label: "Initializing"
    },
    disconnected: {
      classes: "bg-red-900/30 border-red-800/50 text-red-400",
      label: "Disconnected"
    },
    closed: {
      classes: "bg-zinc-900/30 border-zinc-700/50 text-zinc-400",
      label: "Closed"
    },
    error: {
      classes: "bg-red-900/30 border-red-800/50 text-red-400",
      label: "Error"
    }
  };
  const c = config[state];
  if (!c) return null;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${c.classes}`,
      children: c.label
    }
  );
}
function ChatHeader({
  sessionName,
  sessionState,
  onRename,
  onClose,
  isRunnerConnected
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(sessionName);
  const inputRef = useRef(null);
  useEffect(() => {
    setEditValue(sessionName);
  }, [sessionName]);
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
    (e) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setEditValue(sessionName);
        setIsEditing(false);
      }
    },
    [handleSave, sessionName]
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50 bg-surface-canvas/80 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "size-5 text-purple-400",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
        }
      ),
      isEditing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onKeyDown: handleKeyDown,
            onBlur: handleSave,
            className: "bg-surface-canvas border border-border-subtle/50 rounded px-2 py-0.5 text-sm text-text-primary focus:outline-none focus:border-brand-primary/50",
            maxLength: 60
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSave,
            className: "text-green-400 hover:text-green-300",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          }
        )
      ] }) : /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsEditing(true),
          className: "flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-text-secondary group",
          children: [
            sessionName,
            /* @__PURE__ */ jsxs(
              "svg",
              {
                className: "size-3 opacity-0 group-hover:opacity-60",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ jsx("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                  /* @__PURE__ */ jsx("path", { d: "m15 5 4 4" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(StateBadge, { state: sessionState }),
      isRunnerConnected !== void 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[10px]", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-block size-1.5 rounded-full ${isRunnerConnected ? "bg-green-400" : "bg-red-400"}`
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: isRunnerConnected ? "text-green-400" : "text-red-400",
            children: isRunnerConnected ? "Runner" : "Runner offline"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "h-7 w-7 flex items-center justify-center rounded text-text-muted hover:text-red-400 hover:bg-surface-hover",
        children: /* @__PURE__ */ jsxs(
          "svg",
          {
            className: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ jsx("path", { d: "M18 6 6 18" }),
              /* @__PURE__ */ jsx("path", { d: "m6 6 12 12" })
            ]
          }
        )
      }
    )
  ] });
}

// src/components/chat/ChatInput.tsx
import { useState as useState2, useRef as useRef2, useCallback as useCallback2, useEffect as useEffect2 } from "react";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function ChatInput({
  sessionState,
  onSendMessage,
  onInterrupt,
  onGenerateWorkflow,
  isGeneratingWorkflow,
  messageCount,
  disabled
}) {
  const [message, setMessage] = useState2(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("chat-draft-message") ?? "";
  });
  const [includeUIBridge, setIncludeUIBridge] = useState2(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("chat-include-ui-bridge");
    return saved !== null ? saved === "true" : true;
  });
  const textareaRef = useRef2(null);
  const canSend = !disabled && message.trim().length > 0 && (sessionState === "ready" || sessionState === "processing");
  const canInterrupt = sessionState === "processing";
  const showGenerateWorkflow = messageCount >= 2;
  const handleSend = useCallback2(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage("");
    localStorage.removeItem("chat-draft-message");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, onSendMessage]);
  const handleKeyDown = useCallback2(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) {
          handleSend();
        }
      }
    },
    [canSend, handleSend]
  );
  useEffect2(() => {
    localStorage.setItem("chat-include-ui-bridge", String(includeUIBridge));
  }, [includeUIBridge]);
  useEffect2(() => {
    if (message) {
      localStorage.setItem("chat-draft-message", message);
    } else {
      localStorage.removeItem("chat-draft-message");
    }
  }, [message]);
  useEffect2(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }
  }, [message]);
  const stateLabel = sessionState === "ready" ? "Ready" : sessionState === "processing" ? "Processing..." : sessionState === "initializing" ? "Initializing..." : sessionState === "connecting" ? "Connecting..." : sessionState === "disconnected" ? "Disconnected" : sessionState === "closed" ? "Session Closed" : "";
  const stateColor = sessionState === "ready" ? "text-green-400" : sessionState === "processing" ? "text-amber-400" : "text-text-muted";
  return /* @__PURE__ */ jsxs2("div", { className: "border-t border-border-subtle/50 p-4", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsx2("span", { className: `text-xs ${stateColor}`, children: stateLabel }),
      /* @__PURE__ */ jsx2("div", { className: "flex items-center gap-2", children: showGenerateWorkflow && /* @__PURE__ */ jsxs2(Fragment, { children: [
        /* @__PURE__ */ jsxs2(
          "label",
          {
            className: "flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none",
            title: "Include UI Bridge SDK integration instructions in the generated workflow",
            children: [
              /* @__PURE__ */ jsx2(
                "input",
                {
                  type: "checkbox",
                  checked: includeUIBridge,
                  onChange: (e) => setIncludeUIBridge(e.target.checked),
                  disabled: isGeneratingWorkflow || disabled,
                  className: "rounded border-border-subtle accent-purple-500"
                }
              ),
              "UI Bridge"
            ]
          }
        ),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            onClick: () => onGenerateWorkflow(includeUIBridge),
            disabled: isGeneratingWorkflow || disabled,
            className: "inline-flex items-center gap-1.5 text-xs h-7 px-2.5 rounded-md border border-purple-800/50 text-purple-300 hover:bg-purple-900/30 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              isGeneratingWorkflow ? /* @__PURE__ */ jsx2(
                "svg",
                {
                  className: "size-3 animate-spin",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ jsx2("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
                }
              ) : /* @__PURE__ */ jsx2(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ jsx2("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" })
                }
              ),
              isGeneratingWorkflow ? "Generating..." : "Generate Workflow"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ jsx2(
        "textarea",
        {
          ref: textareaRef,
          value: message,
          onChange: (e) => setMessage(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: sessionState === "disconnected" ? "Disconnected from runner..." : sessionState === "closed" ? "Session is closed" : "Type a message... (Enter to send, Shift+Enter for newline)",
          disabled: disabled || sessionState === "disconnected" || sessionState === "closed",
          rows: 1,
          className: "flex-1 resize-none rounded-lg border border-border bg-surface-canvas px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed",
          style: { minHeight: "42px", maxHeight: "240px" }
        }
      ),
      canInterrupt ? /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: onInterrupt,
          className: "h-[42px] px-3 rounded-md border border-amber-800/50 text-amber-400 hover:bg-amber-900/30 flex items-center justify-center",
          children: /* @__PURE__ */ jsx2(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx2("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" })
            }
          )
        }
      ) : /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: handleSend,
          disabled: !canSend,
          className: "h-[42px] px-3 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center",
          children: /* @__PURE__ */ jsxs2(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ jsx2("path", { d: "m22 2-7 20-4-9-9-4Z" }),
                /* @__PURE__ */ jsx2("path", { d: "M22 2 11 13" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/chat/ChatMessageArea.tsx
import { useEffect as useEffect3, useRef as useRef3, useState as useState3, useCallback as useCallback3 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function ChatMessageArea({
  messages,
  streamingContent,
  isStreaming,
  renderMarkdown,
  onCreateWorkflowFromMessage,
  toolActivity
}) {
  const scrollRef = useRef3(null);
  const [autoScroll, setAutoScroll] = useState3(true);
  const prevLenRef = useRef3(0);
  useEffect3(() => {
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
  const handleScroll = useCallback3(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  }, []);
  const scrollToBottom = useCallback3(() => {
    setAutoScroll(true);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  const renderContent = (content) => {
    if (renderMarkdown) return renderMarkdown(content);
    return /* @__PURE__ */ jsx3("p", { className: "text-sm text-text-primary whitespace-pre-wrap break-words", children: content });
  };
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      ref: scrollRef,
      onScroll: handleScroll,
      className: "flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 py-4",
      children: [
        messages.length === 0 && !streamingContent && /* @__PURE__ */ jsxs3("div", { className: "flex flex-col items-center justify-center h-full text-text-muted", children: [
          /* @__PURE__ */ jsxs3(
            "svg",
            {
              className: "size-12 mb-3 opacity-30",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.5",
              children: [
                /* @__PURE__ */ jsx3("path", { d: "M12 8V4H8" }),
                /* @__PURE__ */ jsx3("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
                /* @__PURE__ */ jsx3("path", { d: "M2 14h2" }),
                /* @__PURE__ */ jsx3("path", { d: "M20 14h2" }),
                /* @__PURE__ */ jsx3("path", { d: "M15 13v2" }),
                /* @__PURE__ */ jsx3("path", { d: "M9 13v2" })
              ]
            }
          ),
          /* @__PURE__ */ jsx3("p", { className: "text-sm", children: "Start a conversation with AI" }),
          /* @__PURE__ */ jsx3("p", { className: "text-xs mt-1 opacity-60", children: "Discuss features, plan workflows, then generate them" })
        ] }),
        messages.map((msg, i) => /* @__PURE__ */ jsx3(
          MessageBubble,
          {
            message: msg,
            index: i,
            renderContent,
            onCreateWorkflow: onCreateWorkflowFromMessage
          },
          i
        )),
        isStreaming && streamingContent && /* @__PURE__ */ jsxs3("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsx3("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ jsx3(AiBotIcon, {}) }),
          /* @__PURE__ */ jsx3("div", { className: "max-w-[85%]", children: /* @__PURE__ */ jsxs3(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: [
                /* @__PURE__ */ jsx3("div", { className: "max-w-none text-sm", children: renderContent(streamingContent) }),
                /* @__PURE__ */ jsx3("span", { className: "inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" })
              ]
            }
          ) })
        ] }),
        isStreaming && !streamingContent && /* @__PURE__ */ jsxs3("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsx3("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ jsx3(AiBotIcon, {}) }),
          /* @__PURE__ */ jsx3(
            "div",
            {
              className: "rounded-lg px-4 py-3 border border-border-subtle/30",
              style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
              children: toolActivity ? /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs3("svg", { className: "size-3.5 text-purple-400 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ jsx3("path", { d: "M12 2v4" }),
                  /* @__PURE__ */ jsx3("path", { d: "M12 18v4" }),
                  /* @__PURE__ */ jsx3("path", { d: "m4.93 4.93 2.83 2.83" }),
                  /* @__PURE__ */ jsx3("path", { d: "m16.24 16.24 2.83 2.83" }),
                  /* @__PURE__ */ jsx3("path", { d: "M2 12h4" }),
                  /* @__PURE__ */ jsx3("path", { d: "M18 12h4" }),
                  /* @__PURE__ */ jsx3("path", { d: "m4.93 19.07 2.83-2.83" }),
                  /* @__PURE__ */ jsx3("path", { d: "m16.24 7.76 2.83-2.83" })
                ] }),
                /* @__PURE__ */ jsx3("span", { className: "text-xs text-purple-300/80", children: toolActivity })
              ] }) : /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx3("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" }),
                /* @__PURE__ */ jsx3("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" }),
                /* @__PURE__ */ jsx3("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" })
              ] })
            }
          )
        ] }),
        isStreaming && streamingContent && toolActivity && /* @__PURE__ */ jsx3("div", { className: "flex gap-3 items-center ml-10", children: /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-raised/20", children: [
          /* @__PURE__ */ jsxs3("svg", { className: "size-3 text-purple-400/60 animate-spin", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx3("path", { d: "M12 2v4" }),
            /* @__PURE__ */ jsx3("path", { d: "M12 18v4" }),
            /* @__PURE__ */ jsx3("path", { d: "m4.93 4.93 2.83 2.83" }),
            /* @__PURE__ */ jsx3("path", { d: "m16.24 16.24 2.83 2.83" }),
            /* @__PURE__ */ jsx3("path", { d: "M2 12h4" }),
            /* @__PURE__ */ jsx3("path", { d: "M18 12h4" }),
            /* @__PURE__ */ jsx3("path", { d: "m4.93 19.07 2.83-2.83" }),
            /* @__PURE__ */ jsx3("path", { d: "m16.24 7.76 2.83-2.83" })
          ] }),
          /* @__PURE__ */ jsx3("span", { className: "text-xs text-text-muted", children: toolActivity })
        ] }) }),
        !autoScroll && /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: scrollToBottom,
            className: "sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle/50 text-text-secondary text-xs hover:bg-surface-hover flex items-center gap-1.5 shadow-lg",
            children: [
              /* @__PURE__ */ jsxs3(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ jsx3("path", { d: "M12 5v14" }),
                    /* @__PURE__ */ jsx3("path", { d: "m19 12-7 7-7-7" })
                  ]
                }
              ),
              "Scroll to bottom"
            ]
          }
        )
      ]
    }
  );
}
function AiBotIcon() {
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      className: "size-4 text-purple-400",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ jsx3("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ jsx3("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ jsx3("path", { d: "M2 14h2" }),
        /* @__PURE__ */ jsx3("path", { d: "M20 14h2" }),
        /* @__PURE__ */ jsx3("path", { d: "M15 13v2" }),
        /* @__PURE__ */ jsx3("path", { d: "M9 13v2" })
      ]
    }
  );
}
function UserIcon() {
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      className: "size-4 text-brand-primary",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ jsx3("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ jsx3("circle", { cx: "12", cy: "7", r: "4" })
      ]
    }
  );
}
function MessageBubble({
  message,
  index,
  renderContent,
  onCreateWorkflow
}) {
  const formattedTime = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : void 0;
  if (message.role === "system") {
    return /* @__PURE__ */ jsx3("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ jsxs3("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-raised/40 border border-border-subtle/20", children: [
      /* @__PURE__ */ jsxs3(
        "svg",
        {
          className: "size-3.5 text-text-muted/70 shrink-0",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ jsx3("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx3("path", { d: "M12 16v-4" }),
            /* @__PURE__ */ jsx3("path", { d: "M12 8h.01" })
          ]
        }
      ),
      /* @__PURE__ */ jsx3("span", { className: "text-xs text-text-muted/80", children: message.content })
    ] }) });
  }
  if (message.role === "user") {
    return /* @__PURE__ */ jsxs3("div", { className: "flex gap-3 items-start justify-end", children: [
      /* @__PURE__ */ jsxs3("div", { className: "max-w-[85%]", children: [
        /* @__PURE__ */ jsx3(
          "div",
          {
            className: "rounded-lg px-4 py-3 border border-brand-primary/30",
            style: { background: "color-mix(in srgb, var(--qontinui-brand-primary, #4a90d9) 10%, var(--qontinui-surface-canvas, #111115))" },
            children: /* @__PURE__ */ jsx3("div", { className: "text-sm text-text-primary", children: renderContent(message.content) })
          }
        ),
        formattedTime && /* @__PURE__ */ jsx3("div", { className: "text-[10px] text-text-muted/60 mt-1 text-right", children: formattedTime })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "shrink-0 w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsx3(UserIcon, {}) })
    ] });
  }
  return /* @__PURE__ */ jsxs3("div", { className: "group/msg flex gap-3 items-start", children: [
    /* @__PURE__ */ jsx3("div", { className: "shrink-0 w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center", children: /* @__PURE__ */ jsx3(AiBotIcon, {}) }),
    /* @__PURE__ */ jsxs3("div", { className: "max-w-[85%]", children: [
      /* @__PURE__ */ jsx3(
        "div",
        {
          className: "rounded-lg px-4 py-3 border border-border-subtle/30",
          style: { background: "color-mix(in srgb, var(--qontinui-surface-raised, #1e1e22) 30%, var(--qontinui-surface-canvas, #111115))" },
          children: /* @__PURE__ */ jsx3("div", { className: "max-w-none text-sm", children: renderContent(message.content) })
        }
      ),
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 mt-1", children: [
        formattedTime && /* @__PURE__ */ jsx3("span", { className: "text-[10px] text-text-muted/60", children: formattedTime }),
        onCreateWorkflow && /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: () => onCreateWorkflow(index, message.content),
            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-muted hover:text-purple-300 hover:bg-purple-900/20 transition-colors opacity-0 group-hover/msg:opacity-100",
            children: [
              /* @__PURE__ */ jsx3("svg", { className: "size-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx3("path", { d: "M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" }) }),
              "Create Workflow"
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/components/chat/WorkflowPreviewPanel.tsx
import { useState as useState4 } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var PHASE_COLORS = {
  setup: {
    bg: "bg-blue-950/30",
    border: "border-blue-800/50",
    text: "text-blue-400",
    badge: "bg-blue-900/50 text-blue-300"
  },
  verification: {
    bg: "bg-green-950/30",
    border: "border-green-800/50",
    text: "text-green-400",
    badge: "bg-green-900/50 text-green-300"
  },
  agentic: {
    bg: "bg-amber-950/30",
    border: "border-amber-800/50",
    text: "text-amber-400",
    badge: "bg-amber-900/50 text-amber-300"
  },
  completion: {
    bg: "bg-purple-950/30",
    border: "border-purple-800/50",
    text: "text-purple-400",
    badge: "bg-purple-900/50 text-purple-300"
  }
};
function WorkflowPreviewPanel({
  workflow,
  isLoading,
  error,
  onExecute,
  onEditInBuilder,
  onRegenerate,
  onSave,
  onClose
}) {
  return /* @__PURE__ */ jsxs4("div", { className: "flex flex-col h-full border-l border-border-subtle/50 bg-surface-canvas/95", children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-subtle/50", children: [
      /* @__PURE__ */ jsx4("h3", { className: "text-sm font-semibold text-text-primary", children: "Generated Workflow" }),
      /* @__PURE__ */ jsx4(
        "button",
        {
          onClick: onClose,
          className: "h-6 w-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover",
          children: /* @__PURE__ */ jsxs4(
            "svg",
            {
              className: "size-3.5",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ jsx4("path", { d: "M18 6 6 18" }),
                /* @__PURE__ */ jsx4("path", { d: "m6 6 12 12" })
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "flex-1 overflow-y-auto p-4", children: [
      isLoading && /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center justify-center h-48 text-text-muted", children: [
        /* @__PURE__ */ jsx4(
          "svg",
          {
            className: "size-8 animate-spin mb-3 text-purple-400",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /* @__PURE__ */ jsx4("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
          }
        ),
        /* @__PURE__ */ jsx4("p", { className: "text-sm", children: "Generating workflow..." }),
        /* @__PURE__ */ jsx4("p", { className: "text-xs mt-1 opacity-60", children: "This may take a minute" })
      ] }),
      error && !isLoading && /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center justify-center h-48 text-red-400", children: [
        /* @__PURE__ */ jsxs4(
          "svg",
          {
            className: "size-8 mb-3",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ jsx4("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx4("path", { d: "m15 9-6 6" }),
              /* @__PURE__ */ jsx4("path", { d: "m9 9 6 6" })
            ]
          }
        ),
        /* @__PURE__ */ jsx4("p", { className: "text-sm font-medium", children: "Generation Failed" }),
        /* @__PURE__ */ jsx4("p", { className: "text-xs mt-1 opacity-60 text-center max-w-[250px]", children: error })
      ] }),
      workflow && !isLoading && /* @__PURE__ */ jsxs4("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs4("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx4("h4", { className: "text-sm font-medium text-text-primary", children: workflow.name }),
          workflow.description && /* @__PURE__ */ jsx4("p", { className: "text-xs text-text-muted mt-1", children: workflow.description }),
          workflow.tags && workflow.tags.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex gap-1 mt-2 flex-wrap", children: workflow.tags.map((tag) => /* @__PURE__ */ jsx4(
            "span",
            {
              className: "inline-flex items-center rounded-full border border-border-subtle/50 px-1.5 py-0 text-[10px] text-text-muted",
              children: tag
            },
            tag
          )) })
        ] }),
        ["setup", "verification", "agentic", "completion"].map(
          (phase) => {
            const steps = getStepsForPhase(workflow, phase);
            if (steps.length === 0) return null;
            return /* @__PURE__ */ jsx4(
              PreviewPhaseSection,
              {
                phase,
                steps
              },
              phase
            );
          }
        )
      ] })
    ] }),
    workflow && !isLoading && /* @__PURE__ */ jsxs4("div", { className: "border-t border-border-subtle/50 p-4 space-y-2", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: onExecute,
            className: "flex-1 h-8 rounded-md bg-green-700 hover:bg-green-600 text-white text-sm flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ jsx4(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ jsx4("polygon", { points: "5 3 19 12 5 21 5 3" })
                }
              ),
              "Execute"
            ]
          }
        ),
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: onEditInBuilder,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-sm hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxs4(
                "svg",
                {
                  className: "size-3.5",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ jsx4("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                    /* @__PURE__ */ jsx4("path", { d: "m15 5 4 4" })
                  ]
                }
              ),
              "Edit in Builder"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: onRegenerate,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxs4(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ jsx4("path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                    /* @__PURE__ */ jsx4("path", { d: "M3 3v5h5" }),
                    /* @__PURE__ */ jsx4("path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }),
                    /* @__PURE__ */ jsx4("path", { d: "M16 16h5v5" })
                  ]
                }
              ),
              "Regenerate"
            ]
          }
        ),
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: onSave,
            className: "flex-1 h-8 rounded-md border border-border-subtle/50 text-text-primary text-xs hover:bg-surface-hover flex items-center justify-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxs4(
                "svg",
                {
                  className: "size-3",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ jsx4("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                    /* @__PURE__ */ jsx4("polyline", { points: "17 21 17 13 7 13 7 21" }),
                    /* @__PURE__ */ jsx4("polyline", { points: "7 3 7 8 15 8" })
                  ]
                }
              ),
              "Save to Library"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function PreviewPhaseSection({
  phase,
  steps
}) {
  const [isExpanded, setIsExpanded] = useState4(true);
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS["setup"];
  return /* @__PURE__ */ jsxs4("div", { className: `rounded-lg border ${colors.border} ${colors.bg}`, children: [
    /* @__PURE__ */ jsx4(
      "button",
      {
        onClick: () => setIsExpanded(!isExpanded),
        className: "flex items-center justify-between w-full px-3 py-2 cursor-pointer",
        children: /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx4(
            "svg",
            {
              className: `w-3.5 h-3.5 transition-transform ${colors.text} ${isExpanded ? "rotate-90" : ""}`,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ jsx4("path", { d: "m9 18 6-6-6-6" })
            }
          ),
          /* @__PURE__ */ jsx4(
            "span",
            {
              className: `text-xs font-semibold uppercase tracking-wider ${colors.text}`,
              children: phase
            }
          ),
          /* @__PURE__ */ jsx4(
            "span",
            {
              className: `text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`,
              children: steps.length
            }
          )
        ] })
      }
    ),
    isExpanded && /* @__PURE__ */ jsx4("div", { className: "px-2 pb-2 space-y-1", children: steps.map((step, i) => /* @__PURE__ */ jsxs4(
      "div",
      {
        className: "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/20",
        children: [
          /* @__PURE__ */ jsx4(StepTypeIcon, { type: step.type }),
          /* @__PURE__ */ jsx4("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx4("div", { className: "text-xs text-zinc-200 truncate", children: step.name }) }),
          /* @__PURE__ */ jsxs4(
            "svg",
            {
              className: "w-3 h-3 text-zinc-600",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ jsx4("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                /* @__PURE__ */ jsx4("polyline", { points: "22 4 12 14.01 9 11.01" })
              ]
            }
          )
        ]
      },
      step.id || i
    )) })
  ] });
}
function StepTypeIcon({ type }) {
  if (type === "command") {
    return /* @__PURE__ */ jsxs4(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ jsx4("polyline", { points: "4 17 10 11 4 5" }),
          /* @__PURE__ */ jsx4("line", { x1: "12", x2: "20", y1: "19", y2: "19" })
        ]
      }
    );
  }
  if (type === "ui_bridge") {
    return /* @__PURE__ */ jsxs4(
      "svg",
      {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ jsx4("rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }),
          /* @__PURE__ */ jsx4("line", { x1: "8", x2: "16", y1: "21", y2: "21" }),
          /* @__PURE__ */ jsx4("line", { x1: "12", x2: "12", y1: "17", y2: "21" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs4(
    "svg",
    {
      className: "w-3.5 h-3.5 text-zinc-400 shrink-0",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ jsx4("path", { d: "M12 8V4H8" }),
        /* @__PURE__ */ jsx4("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
        /* @__PURE__ */ jsx4("path", { d: "M2 14h2" }),
        /* @__PURE__ */ jsx4("path", { d: "M20 14h2" }),
        /* @__PURE__ */ jsx4("path", { d: "M15 13v2" }),
        /* @__PURE__ */ jsx4("path", { d: "M9 13v2" })
      ]
    }
  );
}
function getStepsForPhase(workflow, phase) {
  switch (phase) {
    case "setup":
      return workflow.setup_steps || [];
    case "verification":
      return workflow.verification_steps || [];
    case "agentic":
      return workflow.agentic_steps || [];
    case "completion":
      return workflow.completion_steps || [];
    default:
      return [];
  }
}

export {
  ChatHeader,
  ChatInput,
  ChatMessageArea,
  WorkflowPreviewPanel
};
//# sourceMappingURL=chunk-CDLZ5R4Z.js.map