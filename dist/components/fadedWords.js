"use strict";
"use client";
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
const FadedWords = ({ words, className, filter = true, duration = 1, staggerTime = 0.1, delay = 0.2, variant = "default", scaleSize = undefined, once = true, translateAmount = undefined, }) => {
    const [scope, animate] = (0, framer_motion_1.useAnimate)();
    const isInViewContainer = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(isInViewContainer, {
        once: once,
        amount: 0.5,
    });
    let wordsArray = words.split(" ");
    (0, react_1.useEffect)(() => {
        if (!isInView || !isInViewContainer.current || !scope.current)
            return;
        if (isInView) {
            setTimeout(() => {
                animate(".singleWord", {
                    opacity: 1,
                    filter: filter ? "blur(0px)" : "none",
                    transform: "translateY(0) scale(1)",
                }, {
                    duration: duration,
                    delay: (0, framer_motion_1.stagger)(staggerTime),
                });
            }, delay);
        }
    }, [scope.current, isInView]);
    const RenderWords = () => {
        const initialStyleObject = getInitialStyleObject(variant, filter, scaleSize, translateAmount);
        const WORD_SPACE = react_1.default.createElement(react_1.default.Fragment, null, "\u00A0");
        return (react_1.default.createElement(framer_motion_1.motion.span, { ref: scope, className: `${className} ${fadeEffects_module_css_1.default.textEffectWrapper}` }, wordsArray.map((word, idx) => {
            return (react_1.default.createElement(framer_motion_1.motion.span, { key: word + idx, className: `${fadeEffects_module_css_1.default.word} singleWord`, style: initialStyleObject },
                word,
                WORD_SPACE));
        })));
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
    if (variant === "up") {
        return Object.assign(Object.assign({}, baseStyle), { transform: `${translateAmount
                ? `translateY(${translateAmount}px)`
                : "translateY(15px)"} ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}` });
    }
    if (variant === "down") {
        // -
        return Object.assign(Object.assign({}, baseStyle), { transform: `${translateAmount
                ? `translateY(-${translateAmount}px)`
                : "translateY(-15px)"} ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}` });
    }
    if (variant === "left") {
        return Object.assign(Object.assign({}, baseStyle), { transform: `${translateAmount
                ? `translateX(${translateAmount}px)`
                : "translateX(15px)"} ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}` });
    }
    if (variant === "right") {
        // -
        return Object.assign(Object.assign({}, baseStyle), { transform: `${translateAmount
                ? `translateX(-${translateAmount}px)`
                : "translateX(-15px)"} ${scaleSize ? `scale(${scaleSize})` : "scale(1)"}` });
    }
    return baseStyle;
};
