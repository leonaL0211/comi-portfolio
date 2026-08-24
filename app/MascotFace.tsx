"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./portfolio.module.css";

/**
 * COMI's hero mascot with a small set of eye expressions that idle-cycle
 * on their own, in the spirit of Grok's animated bot icon — but scoped to
 * just the eyes rather than morphing the whole silhouette: this blob's
 * body is a rendered illustration (not a vector shape), and the tail +
 * gloss make a full shape-morph read as broken rather than playful, so
 * the eyes are real DOM pills layered over a version of the artwork with
 * its baked-in eyes patched out (see scripts/_tmp-patch-eyes.mjs).
 */

type Expression =
  | "idle"
  | "blink"
  | "lookLeft"
  | "lookRight"
  | "lookUp"
  | "lookDown"
  | "lookUpLeft"
  | "lookUpRight"
  | "lookDownLeft"
  | "lookDownRight"
  | "winkLeft"
  | "winkRight";

const GESTURES: { expression: Expression; holdMs: number; weight: number }[] = [
  { expression: "blink", holdMs: 150, weight: 4 },
  { expression: "lookLeft", holdMs: 420, weight: 2 },
  { expression: "lookRight", holdMs: 420, weight: 2 },
  { expression: "lookUp", holdMs: 380, weight: 1 },
  { expression: "lookDown", holdMs: 380, weight: 1 },
  { expression: "lookUpLeft", holdMs: 420, weight: 2 },
  { expression: "lookUpRight", holdMs: 420, weight: 2 },
  { expression: "lookDownLeft", holdMs: 420, weight: 2 },
  { expression: "lookDownRight", holdMs: 420, weight: 2 },
  { expression: "winkLeft", holdMs: 340, weight: 1 },
  { expression: "winkRight", holdMs: 340, weight: 1 },
];
const GESTURE_WEIGHT_TOTAL = GESTURES.reduce((sum, g) => sum + g.weight, 0);

function pickGesture() {
  let roll = Math.random() * GESTURE_WEIGHT_TOTAL;
  for (const gesture of GESTURES) {
    roll -= gesture.weight;
    if (roll <= 0) return gesture;
  }
  return GESTURES[0];
}

const LOOK_X = 15;
const LOOK_Y = 9;

function eyeTransform(expression: Expression, side: "left" | "right") {
  switch (expression) {
    case "blink":
      return "scaleY(0.14)";
    case "lookLeft":
      return `translateX(-${LOOK_X}%)`;
    case "lookRight":
      return `translateX(${LOOK_X}%)`;
    case "lookUp":
      return `translateY(-${LOOK_Y}%)`;
    case "lookDown":
      return `translateY(${LOOK_Y}%)`;
    case "lookUpLeft":
      return `translate(-${LOOK_X}%, -${LOOK_Y}%)`;
    case "lookUpRight":
      return `translate(${LOOK_X}%, -${LOOK_Y}%)`;
    case "lookDownLeft":
      return `translate(-${LOOK_X}%, ${LOOK_Y}%)`;
    case "lookDownRight":
      return `translate(${LOOK_X}%, ${LOOK_Y}%)`;
    case "winkLeft":
      return side === "left" ? "scaleY(0.14)" : "none";
    case "winkRight":
      return side === "right" ? "scaleY(0.14)" : "none";
    default:
      return "none";
  }
}

export function MascotFace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [expression, setExpression] = useState<Expression>("idle");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      setInView(rect.height > 0 && visible / rect.height >= 0.3);
    };

    check();
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.3),
      { threshold: [0, 0.3, 1] },
    );
    io.observe(el);

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!inView || reducedMotion) return;

    let cancelled = false;
    const timers: number[] = [];
    const after = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    };

    const loop = () => {
      after(700 + Math.random() * 1300, () => {
        const gesture = pickGesture();
        setExpression(gesture.expression);
        after(gesture.holdMs, () => {
          setExpression("idle");
          loop();
        });
      });
    };
    loop();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [inView]);

  return (
    <div ref={containerRef} className={styles.mascotFace}>
      <Image
        className={styles.heroMascot}
        src="/images/mascot-comi-body-v2.png"
        alt="黄色胖逗号 COMI 小精灵"
        width={1004}
        height={922}
        sizes="(max-width: 860px) 60vw, 42vw"
        priority
      />
      <div className={styles.mascotEyes} aria-hidden="true">
        <span
          className={`${styles.mascotEye} ${styles.mascotEyeLeft}`}
          style={{ transform: eyeTransform(expression, "left") }}
        />
        <span
          className={`${styles.mascotEye} ${styles.mascotEyeRight}`}
          style={{ transform: eyeTransform(expression, "right") }}
        />
      </div>
    </div>
  );
}
