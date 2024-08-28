export type FadeWordsVariantType = "default" | "up" | "down" | "left" | "right";
export type FadeWordsProps = {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  staggerTime?: number;
  delay?: number;
  variant?: FadeWordsVariantType;
  scaleSize?: number;
  once?: boolean;
  translateAmount?: number;
};
