"use strict";
// components/FadedWords.tsx
"use client";
// components/FadedWords.tsx
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadedWords = void 0;
const framer_motion_1 = require("framer-motion");
const react_1 = __importStar(require("react"));
const fadeEffects_module_css_1 = __importDefault(require("../css/fadeEffects.module.css"));
const FadedWords = ({ words, className, filter = true, duration = 1, staggerTime = 0.1, delay = 0.2, variant = "default", scaleSize = undefined, once = true, translateAmount = undefined, splitChar = " ", // Default to space
includeSpaces = true, }) => {
    const [scope, animate] = (0, framer_motion_1.useAnimate)();
    const isInViewContainer = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(isInViewContainer, {
        once,
        amount: 0.5,
    });
    // Adjusted splitting logic
    let tokensArray;
    if (Array.isArray(words)) {
        // If words is an array, map it to tokens
        tokensArray = words.map((word) => ({ value: word, isDelimiter: false }));
    }
    else {
        // If words is a string, tokenize it
        let delimiterRegex;
        if (splitChar instanceof RegExp) {
            delimiterRegex = splitChar;
        }
        else {
            // Escape any special regex characters in splitChar
            delimiterRegex = new RegExp(escapeRegex(splitChar), "g");
        }
        tokensArray = tokenize(words, delimiterRegex);
    }
    (0, react_1.useEffect)(() => {
        if (!isInView || !isInViewContainer.current || !scope.current)
            return;
        setTimeout(() => {
            animate(".singleWord", {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
                transform: "translateY(0) scale(1)",
            }, {
                duration,
                delay: (0, framer_motion_1.stagger)(staggerTime),
            });
        }, delay * 1000); // Convert delay to milliseconds
    }, [isInView, animate, delay, duration, filter, staggerTime]);
    const RenderWords = () => {
        const initialStyleObject = getInitialStyleObject(variant, filter, scaleSize, translateAmount);
        return (react_1.default.createElement(framer_motion_1.motion.span, { ref: scope, className: `${className || ""} ${fadeEffects_module_css_1.default.textEffectWrapper}` }, tokensArray.map((token, idx) => (react_1.default.createElement(framer_motion_1.motion.span, { key: token.value + idx, className: `${fadeEffects_module_css_1.default.word} singleWord`, style: initialStyleObject },
            token.value,
            includeSpaces &&
                !token.isDelimiter &&
                idx < tokensArray.length - 1 ? (react_1.default.createElement(react_1.default.Fragment, null, "\u00A0")) : null)))));
    };
    return (react_1.default.createElement("div", { ref: isInViewContainer, className: fadeEffects_module_css_1.default.renderWordsWrapper },
        react_1.default.createElement(RenderWords, null)));
};
exports.FadedWords = FadedWords;
const getInitialStyleObject = (variant, filter, scaleSize, translateAmount) => {
    const baseStyle = {
        opacity: 0,
        filter: filter ? "blur(20px)" : "none",
        display: "inline-block",
    };
    let transformValue = "";
    switch (variant) {
        case "up":
            transformValue = `translateY(${translateAmount !== undefined ? translateAmount : 15}px)`;
            break;
        case "down":
            transformValue = `translateY(${translateAmount !== undefined ? -translateAmount : -15}px)`;
            break;
        case "left":
            transformValue = `translateX(${translateAmount !== undefined ? translateAmount : 15}px)`;
            break;
        case "right":
            transformValue = `translateX(${translateAmount !== undefined ? -translateAmount : -15}px)`;
            break;
        default:
            transformValue = "";
    }
    if (scaleSize !== undefined) {
        transformValue += ` scale(${scaleSize})`;
    }
    return Object.assign(Object.assign({}, baseStyle), { transform: transformValue || undefined });
};
const tokenize = (str, delimiterRegex) => {
    const tokens = [];
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
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
