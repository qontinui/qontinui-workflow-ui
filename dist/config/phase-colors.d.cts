import { WorkflowPhase } from '@qontinui/shared-types/workflow';

/**
 * Shared Phase Color Palette
 *
 * Consistent Tailwind color classes for workflow phases across both apps.
 */

interface PhaseColorPalette {
    bg: string;
    bgHeader: string;
    border: string;
    borderHover: string;
    text: string;
    textMuted: string;
    badge: string;
    button: string;
}
declare const PHASE_COLORS: Record<WorkflowPhase, PhaseColorPalette>;

export { PHASE_COLORS, type PhaseColorPalette };
