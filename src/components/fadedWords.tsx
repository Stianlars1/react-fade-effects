"use client";
import {
  motion,
  MotionStyle,
  stagger,
  useAnimate,
  useInView,
} from "framer-motion";
import React, { useEffect, useRef } from "react";
import { FadeWordsProps, FadeWordsVariantType } from "../../types";

import styles from "../css/fadeEffects.module.css";

export const FadedWords = ({
  words,
  className,
  filter = true,
  duration = 1,
  staggerTime = 0.1,
  delay = 0.2,
  variant = "default",
  scaleSize = undefined,
  once = true,
  translateAmount = undefined,
  splitChar = " ", // Default to space
  includeSpaces = true,
}: FadeWordsProps) => {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const isInViewContainer = useRef<HTMLDivElement>(null);
  const isInView = useInView(isInViewContainer, {
    once,
    amount: 0.5,
  });

  // Adjusted splitting logic
  let tokensArray: Array<{ value: string; isDelimiter: boolean }>;

  if (Array.isArray(words)) {
    // If words is an array, map it to tokens
    tokensArray = words.map((word) => ({ value: word, isDelimiter: false }));
  } else {
    // If words is a string, tokenize it
    let delimiterRegex: RegExp;

    if (splitChar instanceof RegExp) {
      delimiterRegex = splitChar;
    } else {
      // Escape any special regex characters in splitChar
      delimiterRegex = new RegExp(escapeRegex(splitChar), "g");
    }

    tokensArray = tokenize(words, delimiterRegex);
  }

  useEffect(() => {
    if (!isInView || !isInViewContainer.current || !scope.current) return;

    setTimeout(() => {
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
    }, delay * 1000); // Convert delay to milliseconds
  }, [isInView, animate, delay, duration, filter, staggerTime]);

  const RenderWords = () => {
    const initialStyleObject: MotionStyle = getInitialStyleObject(
      variant,
      filter,
      scaleSize,
      translateAmount
    );

    return (
      <motion.span
        ref={scope}
        className={`${className || ""} ${styles.textEffectWrapper}`}
      >
        {tokensArray.map((token, idx) => (
          <motion.span
            key={token.value + idx}
            className={`${styles.word} singleWord`}
            style={initialStyleObject}
          >
            {token.value}
            {/* Conditionally include space after words but not after delimiters */}
            {includeSpaces &&
            !token.isDelimiter &&
            idx < tokensArray.length - 1 ? (
              <>&nbsp;</>
            ) : null}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <div ref={isInViewContainer} className={styles.renderWordsWrapper}>
      <RenderWords />
    </div>
  );
};

const getInitialStyleObject = (
  variant: FadeWordsVariantType,
  filter: boolean,
  scaleSize?: number,
  translateAmount?: number
) => {
  const baseStyle: MotionStyle = {
    opacity: 0,
    filter: filter ? "blur(20px)" : "none",
    display: "inline-block",
  };

  let transformValue = "";

  switch (variant) {
    case "up":
      transformValue = `translateY(${
        translateAmount !== undefined ? translateAmount : 15
      }px)`;
      break;
    case "down":
      transformValue = `translateY(${
        translateAmount !== undefined ? -translateAmount : -15
      }px)`;
      break;
    case "left":
      transformValue = `translateX(${
        translateAmount !== undefined ? translateAmount : 15
      }px)`;
      break;
    case "right":
      transformValue = `translateX(${
        translateAmount !== undefined ? -translateAmount : -15
      }px)`;
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

const escapeRegex = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
