import * as react_jsx_runtime from 'react/jsx-runtime';
import { AiSessionState, AiMessage, UnifiedWorkflow } from '@qontinui/shared-types';

interface ChatHeaderProps {
    sessionName: string;
    sessionState: AiSessionState;
    onRename: (name: string) => void;
    onClose: () => void;
    /** Optional: show runner connection status (web only). */
    isRunnerConnected?: boolean;
}
declare function ChatHeader({ sessionName, sessionState, onRename, onClose, isRunnerConnected, }: ChatHeaderProps): react_jsx_runtime.JSX.Element;

interface ChatInputProps {
    sessionState: AiSessionState;
    onSendMessage: (content: string) => void;
    onInterrupt: () => void;
    onGenerateWorkflow: (includeUIBridge: boolean) => void;
    isGeneratingWorkflow: boolean;
    messageCount: number;
    disabled?: boolean;
}
declare function ChatInput({ sessionState, onSendMessage, onInterrupt, onGenerateWorkflow, isGeneratingWorkflow, messageCount, disabled, }: ChatInputProps): react_jsx_runtime.JSX.Element;

interface ChatMessageAreaProps {
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
declare function ChatMessageArea({ messages, streamingContent, isStreaming, renderMarkdown, onCreateWorkflowFromMessage, toolActivity, }: ChatMessageAreaProps): react_jsx_runtime.JSX.Element;

interface WorkflowPreviewPanelProps {
    workflow: UnifiedWorkflow | null;
    isLoading: boolean;
    error?: string;
    onExecute: () => void;
    onEditInBuilder: () => void;
    onRegenerate: () => void;
    onSave: () => void;
    onClose: () => void;
}
declare function WorkflowPreviewPanel({ workflow, isLoading, error, onExecute, onEditInBuilder, onRegenerate, onSave, onClose, }: WorkflowPreviewPanelProps): react_jsx_runtime.JSX.Element;

export { ChatHeader, type ChatHeaderProps, ChatInput, type ChatInputProps, ChatMessageArea, type ChatMessageAreaProps, WorkflowPreviewPanel, type WorkflowPreviewPanelProps };
