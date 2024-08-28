"use client";
import {
  motion,
  MotionStyle,
  stagger,
  useAnimate,
  useInView,
} from "framer-motion";
import React, { useEffect, useRef } from "react";
import { FadeWordsProps, FadeWordsVariantType } from "../../types/types";
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
}: FadeWordsProps) => {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const isInViewContainer = useRef<HTMLDivElement>(null);
  const isInView = useInView(isInViewContainer, {
    once: once,
    amount: 0.5,
  });
  let wordsArray = words.split(" ");
  useEffect(() => {
    if (!isInView || !isInViewContainer.current || !scope.current) return;
    if (isInView) {
      setTimeout(() => {
        animate(
          ".singleWord",
          {
            opacity: 1,
            filter: filter ? "blur(0px)" : "none",
            transform: "translateY(0) scale(1)",
          },
          {
            duration: duration,
            delay: stagger(staggerTime),
          }
        );
      }, delay);
    }
  }, [scope.current, isInView]);

  const RenderWords = () => {
    const initialStyleObject: MotionStyle = getInitialStyleObject(
      variant,
      filter,
      scaleSize,
      translateAmount
    );

    const WORD_SPACE = <>&nbsp;</>;
    return (
      <motion.span
        ref={scope}
        className={`${className} ${styles.textEffectWrapper}`}
      >
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`${styles.word} singleWord`}
              style={initialStyleObject}
            >
              {word}
              {WORD_SPACE}
            </motion.span>
          );
        })}
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
  const baseStyle = {
    opacity: 0,
    filter: filter ? "blur(20px)" : "none",
    display: "inline-block",
  };

  if (variant === "up") {
    return {
      ...baseStyle,
      transform: `${
        translateAmount
          ? `translateY(${translateAmount}px)`
          : "translateY(15px)"
      } ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}`,
    };
  }
  if (variant === "down") {
    // -
    return {
      ...baseStyle,
      transform: `${
        translateAmount
          ? `translateY(-${translateAmount}px)`
          : "translateY(-15px)"
      } ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}`,
    };
  }

  if (variant === "left") {
    return {
      ...baseStyle,
      transform: `${
        translateAmount
          ? `translateX(${translateAmount}px)`
          : "translateX(15px)"
      } ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}`,
    };
  }

  if (variant === "right") {
    // -
    return {
      ...baseStyle,
      transform: `${
        translateAmount
          ? `translateX(-${translateAmount}px)`
          : "translateX(-15px)"
      } ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}`,
    };
  }

  return baseStyle;
};
