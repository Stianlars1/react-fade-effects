/**
 * Animation direction variants for the FadeWords component.
 * - "default": Simple fade with no directional movement
 * - "up": Fade in while moving upward
 * - "down": Fade in while moving downward
 * - "left": Fade in while moving left
 * - "right": Fade in while moving right
 */
export type FadeWordsVariant = "default" | "up" | "down" | "left" | "right";

/**
 * @deprecated Use `FadeWordsVariant` instead. This alias is kept for backward compatibility.
 */
export type FadeWordsVariantType = FadeWordsVariant;

/**
 * Props for the FadeWords component.
 */
export interface FadeWordsProps {
  /** The text to animate - can be a string (auto-split) or array of words */
  words: string | string[];
  /** Optional CSS class name to apply to the wrapper */
  className?: string;
  /** Whether to apply blur effect during fade (default: true) */
  filter?: boolean;
  /** Animation duration in seconds (default: 1) */
  duration?: number;
  /** Delay between each word animation in seconds (default: 0.1) */
  staggerTime?: number;
  /** Initial delay before animation starts in seconds (default: 0.2) */
  delay?: number;
  /** Direction of the fade animation (default: "default") */
  variant?: FadeWordsVariant;
  /** Scale factor for the initial state (optional) */
  scaleSize?: number;
  /** Whether to animate only once when in view (default: true) */
  once?: boolean;
  /** Distance to translate in pixels (default: 15) */
  translateAmount?: number;
  /** Character or regex to split words by (default: " ") */
  splitChar?: string | RegExp;
  /** Whether to include spaces between words (default: true) */
  includeSpaces?: boolean;
}
