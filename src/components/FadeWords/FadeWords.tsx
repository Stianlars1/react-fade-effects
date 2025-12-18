"use client";

import { motion, MotionStyle, stagger, useAnimate, useInView } from "framer-motion";
import { CSSProperties, useEffect, useRef } from "react";
import type { FadeWordsProps, FadeWordsVariant } from "./FadeWords.types";

// Inline styles - avoids CSS module bundling issues in npm packages
const wrapperStyles: CSSProperties = {
  display: "block",
  textAlign: "inherit",
  textDecoration: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  fontStyle: "inherit",
  fontFamily: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  color: "inherit",
  backgroundColor: "inherit",
  border: "inherit",
  borderRadius: "inherit",
};

const textEffectWrapperStyles: CSSProperties = {
  display: "inline-block",
  verticalAlign: "inherit",
  textAlign: "inherit",
  textDecoration: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  fontStyle: "inherit",
  fontFamily: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  color: "inherit",
  backgroundColor: "inherit",
  border: "inherit",
  borderRadius: "inherit",
};

const wordBaseStyles: CSSProperties = {
  display: "inline-block",
  verticalAlign: "inherit",
  textAlign: "inherit",
  textDecoration: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  fontStyle: "inherit",
  fontFamily: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  color: "inherit",
  backgroundColor: "inherit",
  border: "inherit",
  borderRadius: "inherit",
  willChange: "auto",
};

/**
 * Get initial style object based on animation variant.
 */
const getInitialStyleObject = (
  variant: FadeWordsVariant,
  filter: boolean,
  scaleSize?: number,
  translateAmount?: number
): MotionStyle => {
  const baseStyle: MotionStyle = {
    ...wordBaseStyles,
    opacity: 0,
    filter: filter ? "blur(20px)" : "none",
  };

  let transformValue = "";
  const distance = translateAmount ?? 15;

  switch (variant) {
    case "up":
      transformValue = `translateY(${distance}px)`;
      break;
    case "down":
      transformValue = `translateY(${-distance}px)`;
      break;
    case "left":
      transformValue = `translateX(${distance}px)`;
      break;
    case "right":
      transformValue = `translateX(${-distance}px)`;
      break;
    default:
      transformValue = "";
  }

  if (scaleSize !== undefined) {
    transformValue += ` scale(${scaleSize})`;
  }

  return {
    ...baseStyle,
    transform: transformValue || undefined,
  };
};

/**
 * Tokenize a string by delimiter, preserving delimiter positions.
 */
const tokenize = (
  str: string,
  delimiterRegex: RegExp
): Array<{ value: string; isDelimiter: boolean }> => {
  const tokens: Array<{ value: string; isDelimiter: boolean }> = [];
  let lastIndex = 0;

  const regex = new RegExp(delimiterRegex, "g");
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        value: str.slice(lastIndex, match.index),
        isDelimiter: false,
      });
    }
    tokens.push({ value: match[0], isDelimiter: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    tokens.push({ value: str.slice(lastIndex), isDelimiter: false });
  }

  return tokens;
};

/**
 * Escape special regex characters in a string.
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * FadeWords - A React component for animating text with fade effects.
 *
 * Supports multiple animation variants (up, down, left, right) and
 * customizable timing options. Works with Next.js App Router (RSC compatible).
 *
 * @example
 * ```tsx
 * <FadeWords words="Hello World" variant="up" />
 * <FadeWords words={["Hello", "World"]} staggerTime={0.2} />
 * ```
 */
export function FadeWords({
  words,
  className,
  filter = true,
  duration = 1,
  staggerTime = 0.1,
  delay = 0.2,
  variant = "default",
  scaleSize,
  once = true,
  translateAmount,
  splitChar = " ",
  includeSpaces = true,
}: FadeWordsProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once,
    amount: 0.5,
  });

  // Parse words into tokens
  const tokensArray = (() => {
    if (Array.isArray(words)) {
      return words.map((word) => ({ value: word, isDelimiter: false }));
    }

    const delimiterRegex =
      splitChar instanceof RegExp
        ? splitChar
        : new RegExp(escapeRegex(splitChar), "g");

    return tokenize(words, delimiterRegex);
  })();

  useEffect(() => {
    if (!isInView || !containerRef.current || !scope.current) return;

    const timeoutId = setTimeout(() => {
      animate(
        ".singleWord",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
          transform: "translateY(0) scale(1)",
        },
        {
          duration,
          delay: stagger(staggerTime),
        }
      );
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [isInView, animate, delay, duration, filter, staggerTime, scope]);

  const initialStyleObject = getInitialStyleObject(
    variant,
    filter,
    scaleSize,
    translateAmount
  );

  return (
    <div ref={containerRef} style={wrapperStyles}>
      <motion.span
        ref={scope}
        className={className}
        style={textEffectWrapperStyles}
      >
        {tokensArray.map((token, idx) => (
          <motion.span
            key={`${token.value}-${idx}`}
            className="singleWord"
            style={initialStyleObject}
          >
            {token.value}
            {includeSpaces &&
            !token.isDelimiter &&
            idx < tokensArray.length - 1 ? (
              <>&nbsp;</>
            ) : null}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
}

/**
 * @deprecated Use `FadeWords` instead. This alias is kept for backward compatibility.
 */
export const FadedWords = FadeWords;
