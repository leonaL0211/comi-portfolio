"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

/**
 * "关于你" memory-card feature deep dive, shown inside an iPhone-sized
 * frame (402×874, matching the phoneFrame aspect used everywhere else on
 * this page). The exported card is taller than one screen, so instead of
 * relying on raw touch/wheel scroll inside a small embedded mock, the
 * overflow is navigated with up/down buttons that step through the card
 * by roughly one viewport at a time.
 *
 * Source: Figma node 2137:2 (COMI_AboutMe, Day) / 2140:2 (COMI_Night
 * AboutMe), exported at 1x (402×1354).
 */
export function AboutMeShowcase({
  dark,
  frameClassName = styles.aboutMePhoneSize,
}: {
  dark: boolean;
  /** Overrides the frame's width constraint (default: the original compact size). */
  frameClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtTop(el.scrollTop <= 4);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  // Snap back to the top when the theme swap changes the image under the
  // reader — the previous scroll offset no longer means anything.
  useEffect(() => {
    trackRef.current?.scrollTo({ top: 0 });
    updateEdges();
  }, [dark, updateEdges]);

  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ top: direction * el.clientHeight * 0.82, behavior: "smooth" });
  };

  return (
    <div className={`${styles.phoneFrame} ${frameClassName}`}>
      <div ref={trackRef} className={styles.aboutMeTrack} onScroll={updateEdges}>
        <img
          src={dark ? "/images/app-aboutme-dark.png" : "/images/app-aboutme-light.png"}
          alt="COMI 关于你卡片：顶部是 AI 对用户的一句话理解，下方分基本信息、偏好与习惯、长期目标、最近在做四类记忆"
          className={styles.aboutMeImg}
        />
      </div>

      <div
        className={`${styles.aboutMeFade} ${styles.aboutMeFadeTop} ${
          dark ? styles.aboutMeFadeDark : ""
        } ${atTop ? styles.aboutMeFadeHidden : ""}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.aboutMeFade} ${styles.aboutMeFadeBottom} ${
          dark ? styles.aboutMeFadeDark : ""
        } ${atBottom ? styles.aboutMeFadeHidden : ""}`}
        aria-hidden="true"
      />

      <div className={`${styles.aboutMeControls} ${dark ? styles.aboutMeControlsDark : ""}`}>
        <button
          type="button"
          className={styles.aboutMeBtn}
          onClick={() => step(-1)}
          disabled={atTop}
          aria-label="向上滚动查看关于你卡片"
        >
          ↑
        </button>
        <button
          type="button"
          className={styles.aboutMeBtn}
          onClick={() => step(1)}
          disabled={atBottom}
          aria-label="向下滚动查看关于你卡片"
        >
          ↓
        </button>
      </div>
    </div>
  );
}
