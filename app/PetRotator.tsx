"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

/**
 * Cycles through the desk pet's idle-pool GIFs to actually demonstrate the
 * "random action rotation" the card next to it describes, instead of
 * showing one static frame. All frames stay mounted and cross-fade via
 * opacity so swapping never restarts a GIF mid-loop with a visible jump cut.
 */
const ROTATION = [
  { src: "/images/pet/idle.gif", alt: "COMI 桌宠 idle 动作" },
  { src: "/images/pet/coffee-break.gif", alt: "COMI 桌宠喝咖啡动作" },
  { src: "/images/pet/peek.gif", alt: "COMI 桌宠探头张望动作" },
  { src: "/images/pet/bounce.gif", alt: "COMI 桌宠弹跳动作" },
  { src: "/images/pet/sleepy.gif", alt: "COMI 桌宠犯困动作" },
];

export function PetRotator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [index, setIndex] = useState(0);

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

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ROTATION.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={containerRef} className={styles.petRotator}>
      {ROTATION.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          className={`${styles.petRotatorFrame} ${i === index ? styles.petRotatorFrameActive : ""}`}
        />
      ))}
    </div>
  );
}
