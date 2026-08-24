"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

/**
 * Animated "user types → AI replies" demo overlaid on the chat screenshot
 * in the product showcase section. Ported from a single static Figma frame
 * (COMI_Chat / COMI_Night Chat, node 2018:159 / 2035:459) — Figma only
 * defines the end state, so the typing/thinking/reply choreography here is
 * authored directly against real character/word counts rather than a fixed
 * step count, and only plays while the card is in view.
 */

const USER_TEXT = "I’ve been thinking about redesigning my portfolio lately.";
const AI_WORDS =
  "That sounds like more than a visual update. Are you rethinking how you want your work—and yourself—to be understood?".split(
    " ",
  );

const TYPE_MS_PER_CHAR = 26;
const PAUSE_AFTER_TYPE = 500;
const THINKING_MS = 1100;
const WORD_STAGGER_MS = 42;
const HOLD_MS = 3400;

type Phase = "typing" | "thinking" | "replying" | "done";

export function ChatDemo({ dark }: { dark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      setInView(rect.height > 0 && visible / rect.height >= 0.4);
    };

    check();
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.4),
      { threshold: [0, 0.4, 1] },
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

  return (
    <div
      ref={containerRef}
      className={`${styles.chatDemo} ${dark ? styles.chatDemoDark : ""}`}
      aria-hidden="true"
    >
      <span className={styles.chatDemoBubble} />
      {inView && <ChatTimeline key={cycleKey} onDone={() => setCycleKey((k) => k + 1)} />}
    </div>
  );
}

/**
 * Owns one play-through of the typing → thinking → reply sequence. Remounted
 * (via the `key` on ChatDemo) to restart a cycle, so state always starts
 * fresh from its useState initializers instead of being reset inside an
 * effect body.
 */
function ChatTimeline({ onDone }: { onDone: () => void }) {
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [phase, setPhase] = useState<Phase>(reducedMotion ? "done" : "typing");
  const [charCount, setCharCount] = useState(reducedMotion ? USER_TEXT.length : 0);

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const timers: number[] = [];
    const after = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    };

    let i = 0;
    const typeInterval = window.setInterval(() => {
      if (cancelled) return window.clearInterval(typeInterval);
      i += 1;
      setCharCount(i);
      if (i >= USER_TEXT.length) {
        window.clearInterval(typeInterval);
        after(PAUSE_AFTER_TYPE, () => {
          setPhase("thinking");
          after(THINKING_MS, () => {
            setPhase("replying");
            after(AI_WORDS.length * WORD_STAGGER_MS + 700, () => {
              setPhase("done");
              after(HOLD_MS, onDone);
            });
          });
        });
      }
    }, TYPE_MS_PER_CHAR);

    return () => {
      cancelled = true;
      window.clearInterval(typeInterval);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [reducedMotion, onDone]);

  return (
    <>
      <p className={styles.chatDemoUserText}>
        {USER_TEXT.slice(0, charCount)}
        {phase === "typing" && <span className={styles.chatDemoCaret} />}
      </p>
      {phase === "thinking" && (
        <span className={styles.chatDemoDots}>
          <i />
          <i />
          <i />
        </span>
      )}
      {(phase === "replying" || phase === "done") && (
        <p className={styles.chatDemoAiText}>
          {AI_WORDS.map((word, i) => (
            // The space is a sibling text node, not trailing content inside
            // the span: a space as the last character of an inline-block
            // (needed here so `animationDelay`'s translateY actually
            // applies) sits at the end of that box's own line and gets
            // trimmed by the browser, silently swallowing every word gap.
            <span key={i}>
              <span
                className={styles.chatDemoWord}
                style={{ animationDelay: `${i * WORD_STAGGER_MS}ms` }}
              >
                {word}
              </span>
              {i < AI_WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      )}
    </>
  );
}
