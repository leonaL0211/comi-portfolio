"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChatDemo } from "./ChatDemo";
import { MascotFace } from "./MascotFace";
import { PetRotator } from "./PetRotator";
import styles from "./portfolio.module.css";

/**
 * COMI product portfolio / case-study landing page.
 *
 * Ported from the Claude Design handoff bundle (`COMI Portfolio.dc.html`),
 * then given a "playful upgrade" pass referencing Arc.net's visual
 * language (hand-drawn seams between sections, a 3-level color system,
 * glass surfaces, tilted cards with bounce hovers).
 *
 * This is the home page of a standalone, fully public static site (no
 * auth, no middleware) — separate from the COMI chat app repo.
 *
 * Desktop-pet demo GIFs, avatar photo, and resume PDF remain as labeled
 * placeholders until those assets are supplied.
 */

const NAV_LINKS = [
  { href: "#s2", label: "为什么" },
  { href: "#s3", label: "功能" },
  { href: "#s3b", label: "界面" },
  { href: "#s4", label: "桌面陪伴" },
  { href: "#s5", label: "决策日志" },
  { href: "#s6", label: "工具链" },
];

const DOT_SECTIONS = ["s1", "s2", "s3", "s3b", "s4", "s5", "s6", "s7"];

const PRODUCT_SCREENS = [
  {
    key: "welcome",
    title: "欢迎页",
    subtitle: "轻轻开始一次对话",
    light: "/images/app-welcome-light.png",
    dark: "/images/app-welcome-dark.png",
  },
  {
    key: "chat",
    title: "对话页",
    subtitle: "让每句话都能接着说",
    light: "/images/app-chat-light-v2.png",
    dark: "/images/app-chat-dark-v2.png",
  },
  {
    key: "menu",
    title: "更多菜单",
    subtitle: "记忆管理与主题切换，都在这里",
    light: "/images/app-menu-light.png",
    dark: "/images/app-menu-dark.png",
  },
] as const;

const PET_ROWS = [
  { state: "思考中", old: "Loading 菊花", comi: "打字动作" },
  { state: "回答完成", old: "消息推送", comi: "雀跃蹦跳" },
  { state: "API 失败", old: "Error 弹窗", comi: "趴下显示 error" },
];

const DECISIONS = [
  {
    no: "决策一",
    tag: "下线",
    title: '下线"小屋"功能',
    before: "日记 / 手账共写空间",
    after: "对话内自然沉淀",
    body: '初版设想的日记 / 手账空间，用户和 AI 共同书写。上线后发现：用户和 AI 的"共同经历"应该在对话里自然沉淀，而不是靠额外维护一个空间。陪伴不应该让用户变成运营者。',
  },
  {
    no: "决策二",
    tag: "隐身",
    title: '摘要功能"隐身化"',
    before: "前台展示摘要卡片",
    after: "后台静默处理",
    body: "自动摘要是为了节省上下文，初版把摘要显示在前台。后来意识到——能让用户“感受不到”的技术处理，比“看得到”的技术处理更能守护体验。摘要转入后台，功能价值保留，UI 空间释放。",
  },
  {
    no: "决策三",
    tag: "收敛",
    title: "UI 从少女化到中性偏女性化",
    before: "强少女风视觉",
    after: "中性偏女性化",
    body: "初版 UI 偏少女风，符合我的个人审美。但陪伴的需求不分性别，过强的少女化视觉会形成用户筛选，也让产品看起来“承载不了深度对话”。设计者的审美 ≠ 目标用户的审美。",
  },
];

const STACK = [
  { name: "PWA", desc: "跨端可用，降低使用门槛" },
  { name: "Claude API", desc: "核心对话能力" },
  { name: "Claude Code", desc: "主力开发工具" },
  { name: "Figma MCP", desc: "设计到代码的直连" },
  { name: "Clawd on desk", desc: "开源 · 桌面陪伴形态基础" },
  { name: "Codex", desc: "demo 制作 · 视频演示辅助" },
];

// Three irregular wave paths (viewBox 0 0 1200 64) — deliberately
// non-periodic amplitudes/spacing so the seam reads as hand-drawn
// rather than a mechanical sine curve.
const WAVE_PATHS = [
  "M0,30 C55,10 95,46 150,26 C210,4 255,50 320,28 C390,8 430,44 500,24 C560,4 610,46 680,26 C740,6 790,42 860,22 C920,2 970,44 1040,24 C1090,8 1140,36 1200,20",
  "M0,22 C60,42 100,4 160,24 C220,44 270,6 340,26 C410,44 460,6 530,28 C600,46 650,8 720,24 C780,42 830,6 900,26 C960,44 1010,8 1080,24 C1130,36 1170,12 1200,28",
  "M0,26 C50,6 100,44 165,22 C225,2 270,48 335,26 C400,4 445,42 515,24 C575,2 625,46 695,26 C755,6 805,40 875,22 C935,2 985,44 1055,24 C1115,6 1155,32 1200,18",
];

/**
 * Hand-drawn seam between two sections. A flat strip in the previous
 * section's tone sits behind an irregular wave filled in the next
 * section's tone (a torn-paper reveal wherever the tones differ), with
 * the same wobble traced on top as a hand-inked accent stroke.
 */
function SeamBand({
  variant,
  prevColor,
  nextColor,
}: {
  variant: 0 | 1 | 2;
  prevColor: string;
  nextColor: string;
}) {
  const d = WAVE_PATHS[variant];
  return (
    <div className={styles.seamBand} aria-hidden="true">
      <div className={styles.seamPrev} style={{ background: prevColor }} />
      <svg
        className={styles.seamSvg}
        viewBox="0 0 1200 64"
        preserveAspectRatio="none"
      >
        <path d={`${d} L1200,64 L0,64 Z`} fill={nextColor} />
        <path
          d={d}
          fill="none"
          stroke="#e89b7b"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/** Hand-drawn wobbly underline, used behind a highlighted keyword. */
function HandUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2,13 C 20,20 32,5 48,13 C 64,21 78,7 94,14 C 104,19 112,12 118,14"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn wobbly circle, used to loop around a highlighted keyword. */
function HandCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 176 72"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M88,7 C128,3 166,19 164,37 C162,57 126,65 88,63 C47,61 11,53 9,35 C7,17 45,5 88,7 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn wobbly rounded box, used behind a small numbered tag. */
function HandBox({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M9,6 C 34,3 62,2 89,7 C 92,16 91,25 90,34 C 62,38 32,37 7,33 C 4,24 5,14 9,6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PortfolioView() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top > window.innerHeight * 0.92) {
        node.classList.add(styles.hidden);
      }
    });

    const show = (node: Element) => node.classList.remove(styles.hidden);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => io.observe(node));

    const sweep = () => {
      nodes.forEach((node) => {
        if (
          node.classList.contains(styles.hidden) &&
          node.getBoundingClientRect().top < window.innerHeight
        ) {
          show(node);
          io.unobserve(node);
        }
      });
    };
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", sweep);
      window.removeEventListener("resize", sweep);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <a href="#s1" className={styles.logo}>
          <span className={`${styles.logoMark} ${styles.geist}`}>COMI</span>
          <span className={styles.logoTag}>AI 陪伴产品</span>
        </a>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
          <a href="#s7" className={`${styles.navLink} ${styles.navCta}`}>
            关于我
          </a>
        </nav>
      </header>

      <nav className={styles.dotNav} aria-label="章节导航">
        {DOT_SECTIONS.map((id) => (
          <a key={id} href={`#${id}`} className={styles.dot} aria-label={id} />
        ))}
      </nav>

      {/* ── 01 Hero ── */}
      <section id="s1" className={styles.hero}>
        <div className={styles.heroGlowA} />
        <div className={styles.heroGlowB} />

        <div className={styles.heroBody}>
          <div data-reveal className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>产品作品集 · LEONA LIU · 2026</span>
          </div>
          <h1 data-reveal className={styles.heroTitle}>
            逗号<span className={styles.heroCommaBig}>，</span>意味着
            <br />
            无限可能
          </h1>
          <p data-reveal className={styles.heroSubtitle}>
            COMI 是一个拥有长期记忆、可以跨模型延续对话的 AI 陪伴产品。
            <br />
            无论今天选择哪一个模型，都可以接着之前的话继续说。
          </p>
          <div data-reveal className={styles.heroCtas}>
            <a href="#s2" className={styles.heroCtaPrimary}>
              了解 COMI 的诞生 <span>↓</span>
            </a>
            <span className={styles.heroReadTime}>3 分钟读完</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroOrb}>
            <div className={styles.heroOrbGlow} />
            <div className={styles.heroMascotWrap}>
              <MascotFace />
            </div>
          </div>
        </div>
      </section>

      <SeamBand variant={0} prevColor="#fdfaf8" nextColor="#fdfaf8" />

      {/* ── 02 Why COMI ── */}
      <section id="s2" className={`${styles.section} ${styles.why}`}>
        <div className={styles.whyInner}>
          <div className={styles.eyebrow}>为什么做 COMI</div>
          <div>
            <h2 data-reveal className={styles.whyTitle}>
              AI 会完成任务，
              <br />
              却还不会
              <span className={styles.keywordWrap}>
                <span className={styles.keyword}>持续理解</span>
                <HandUnderline className={styles.underlineSvg} />
              </span>
              一个人。
            </h2>
            <div className={styles.whyCards}>
              <div data-reveal data-dir="left" className={styles.whyCard}>
                <p>
                  2026 年 7 月 1 日晚上，我常用的 AI 账号突然坏了。第二天有面试，我只能自学前端，接入
                  Claude API，搭出一个 PWA 救急。这个&ldquo;急就章&rdquo;后来成了 COMI。
                </p>
              </div>
              <div data-reveal data-dir="right" className={styles.whyCard}>
                <p>
                  用得越久越发现一个问题：我在 Claude 聊过的思路，切换到 GPT
                  就得重新解释一遍。项目协作可以靠总结文本传递，但陪伴不行——陪伴的本质是&ldquo;不需要重新解释自己&rdquo;。
                </p>
              </div>
              <div data-reveal className={`${styles.whyCard} ${styles.whyCardHighlight}`}>
                <p>COMI 想做的事很简单：让所有 AI 坐在同一张桌子前，看着同一个我。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeamBand variant={1} prevColor="#faf4f2" nextColor="#faf4f2" />

      {/* ── 03 Core features ── */}
      <section id="s3" className={`${styles.section} ${styles.features}`}>
        <div className={styles.featuresInner}>
          <div className={styles.sectionHead}>
            <h2 data-reveal className={styles.sectionTitle}>
              三个功能，一个关于陪伴的答案
            </h2>
            <span className={styles.eyebrow}>核心功能</span>
          </div>
          <p data-reveal className={styles.productIntro}>
            真正的陪伴，是每次回来，都能接着上次继续。
          </p>
          <div className={styles.featureGrid}>
            <div data-reveal className={styles.featureCard}>
              <div className={styles.featureIcon} />
              <h3 className={styles.featureTitle}>记忆库</h3>
              <p className={styles.featureDesc}>
                让 AI 记得你说过的每一件重要的事。不是关键词匹配，是长程的、结构化的、可以被你自己管理的记忆。
              </p>
            </div>
            <div data-reveal className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconFiles}`} />
              <h3 className={styles.featureTitle}>文件库</h3>
              <p className={styles.featureDesc}>
                共同经历的沉淀空间。你分享过的资料、创作、灵感，都会成为 AI 理解你的一部分。
              </p>
            </div>
            <div data-reveal className={`${styles.featureCard} ${styles.featureCardDark}`}>
              <div className={`${styles.featureIcon} ${styles.featureIconRoundtable}`} />
              <h3 className={styles.featureTitle}>
                LLM 圆桌 <span className={`${styles.geist} ${styles.featureVersion}`}>1.0</span>
              </h3>
              <p className={styles.featureDesc}>
                一份记忆，多个模型共享。你可以随时切换和不同 AI
                对话，但每个 AI 都记得你完整的故事——就像你有几个懂你的朋友，选择今天想找谁说话，但不需要重新自我介绍。
              </p>
              <div className={styles.featureTagRow}>
                <span className={`${styles.geist} ${styles.featureTagPill}`}>Claude</span>
                <span className={`${styles.geist} ${styles.featureTagPill}`}>GPT</span>
                <span className={`${styles.geist} ${styles.featureTagPill}`}>Gemini</span>
                <span className={styles.featureTagPillAccent}>同一份记忆</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeamBand variant={2} prevColor="#fdfaf8" nextColor="#faf4f2" />

      {/* ── 03b Product interface showcase ── */}
      <section id="s3b" className={`${styles.section} ${styles.productShowcase}`}>
        <div className={styles.productInner}>
          <div className={styles.productHead}>
            <div>
              <span className={styles.eyebrow}>产品界面</span>
              <h2 data-reveal className={styles.sectionTitle}>
                COMI 的样子
              </h2>
              <p data-reveal className={styles.productIntro}>
                温柔不是装饰，而是让每一次打开、输入和等待都更自然。
              </p>
            </div>
            <button
              type="button"
              className={`${styles.modeToggle} ${isDarkPreview ? styles.modeToggleDark : ""}`}
              aria-pressed={isDarkPreview}
              onClick={() => setIsDarkPreview((value) => !value)}
            >
              <span className={!isDarkPreview ? styles.modeLabelActive : ""}>浅色</span>
              <span className={styles.modeTrack} aria-hidden="true">
                <span
                  className={`${styles.modeThumb} ${isDarkPreview ? styles.modeThumbDark : ""}`}
                />
              </span>
              <span className={isDarkPreview ? styles.modeLabelActive : ""}>深色</span>
            </button>
          </div>

          <div className={styles.productGrid}>
            {PRODUCT_SCREENS.map((screen, index) => (
              <figure
                data-reveal
                key={screen.key}
                className={`${styles.productCard} ${index === 1 ? styles.productCardFeatured : ""}`}
              >
                <div className={styles.phoneFrame}>
                  <Image
                    className={`${styles.screenImage} ${isDarkPreview ? styles.screenImageHidden : styles.screenImageVisible}`}
                    src={screen.light}
                    alt={`COMI ${screen.title}浅色模式界面`}
                    width={804}
                    height={1748}
                    sizes="(max-width: 760px) 76vw, 26vw"
                  />
                  <Image
                    className={`${styles.screenImage} ${styles.screenImageDark} ${isDarkPreview ? styles.screenImageVisible : styles.screenImageHidden}`}
                    src={screen.dark}
                    alt={`COMI ${screen.title}深色模式界面`}
                    width={804}
                    height={1748}
                    sizes="(max-width: 760px) 76vw, 26vw"
                  />
                  {screen.key === "chat" ? <ChatDemo dark={isDarkPreview} /> : null}
                </div>
                <figcaption className={styles.productCaption}>
                  <strong>{screen.title}</strong>
                  <span>{screen.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SeamBand variant={0} prevColor="#faf4f2" nextColor="#fdfaf8" />

      {/* ── 04 Desktop companion ── */}
      <section id="s4" className={`${styles.section} ${styles.pet}`}>
        <div className={styles.petGlow} />
        <div className={styles.petInner}>
          <div className={styles.sectionHead}>
            <h2 data-reveal className={`${styles.sectionTitle} ${styles.petLeadTitle}`}>
              让 AI 的存在，成为一种<span className={styles.accentText}>视觉上的陪伴</span>
            </h2>
            <span className={styles.eyebrow}>桌面陪伴形态</span>
          </div>
          <p data-reveal className={styles.petIntro}>
            基于开源项目 <span className={styles.geist}>Clawd on desk</span>{" "}
            集成，COMI 在此之上做了三层设计——把桌宠从静态装饰变成 AI 状态的实时具身化载体。
          </p>

          <div className={styles.petGrid}>
            <div data-reveal data-dir="left" className={styles.petCard}>
              <div className={styles.petSlot}>
                <img
                  src="/images/pet/bounce.gif"
                  alt="COMI 桌宠在桌面上弹跳漫游"
                  className={styles.petSlotImg}
                />
              </div>
              <div className={styles.petCardBody}>
                <h4>满屏漫游</h4>
                <p>突破角落停留，让陪伴感占据整个桌面。</p>
              </div>
            </div>
            <div data-reveal className={styles.petCard}>
              <div className={`${styles.petSlot} ${styles.petSlotAlt}`}>
                <PetRotator />
              </div>
              <div className={styles.petCardBody}>
                <h4>随机动作轮换</h4>
                <p>陪伴产品的核心悖论：可预测的 AI 是工具，不可预测的 AI 才像伙伴。</p>
              </div>
            </div>
            <div data-reveal data-dir="right" className={styles.petCard}>
              <div className={styles.petTripleGrid}>
                <div className={styles.petMiniSlot}>
                  <img src="/images/pet/typing.gif" alt="COMI 打字动作" className={styles.petMiniSlotImg} />
                  <span>打字</span>
                </div>
                <div className={`${styles.petMiniSlot} ${styles.petMiniSlotB}`}>
                  <img
                    src="/images/pet/celebrate.gif"
                    alt="COMI 雀跃动作"
                    className={styles.petMiniSlotImg}
                  />
                  <span>雀跃</span>
                </div>
                <div className={`${styles.petMiniSlot} ${styles.petMiniSlotC}`}>
                  <img
                    src="/images/pet/melt-error.gif"
                    alt="COMI 趴下显示 error 动作"
                    className={styles.petMiniSlotImg}
                  />
                  <span>趴下</span>
                </div>
              </div>
              <div className={styles.petCardBody}>
                <h4>AI 状态的具身化翻译</h4>
                <p>
                  传统 UI 用 loading 和 error 提醒你&ldquo;这是机器&rdquo;，COMI
                  用身体语言让你觉得&ldquo;它是一个伙伴&rdquo;。
                </p>
              </div>
            </div>
          </div>

          <div data-reveal className={styles.petTable}>
            <div className={styles.petTableHead}>
              <span>AI 后端状态</span>
              <span>传统 UI</span>
              <span>COMI 桌宠</span>
            </div>
            {PET_ROWS.map((row) => (
              <div key={row.state} className={styles.petRow}>
                <span className={styles.petRowState}>{row.state}</span>
                <span className={styles.petRowOld}>{row.old}</span>
                <span className={styles.petRowComi}>{row.comi}</span>
              </div>
            ))}
            <div className={styles.petQuote}>
              <p>陪伴产品最脆弱的时刻，是用户意识到自己在跟机器打交道的瞬间。</p>
            </div>
          </div>
        </div>
      </section>

      <SeamBand variant={0} prevColor="#fdfaf8" nextColor="#2a2320" />

      {/* ── 05 Decision log ── */}
      <section id="s5" className={`${styles.section} ${styles.decisions}`}>
        <div className={styles.decisionsInner}>
          <div className={styles.sectionHead}>
            <h2 data-reveal className={`${styles.sectionTitle} ${styles.decisionsTitle}`}>
              三个决策，一种哲学
              <br />
              ——陪伴产品的
              <span className={styles.circleWrap}>
                <span className={styles.keyword}>减法</span>
                <HandCircle className={styles.circleSvg} />
              </span>
            </h2>
            <span className={styles.eyebrow}>产品决策日志</span>
          </div>
          <p data-reveal className={styles.decisionsIntro}>
            COMI 这 2 个月里，最重要的三个决策都是&ldquo;减法&rdquo;而非&ldquo;加法&rdquo;。
          </p>

          <div className={styles.decisionList}>
            {DECISIONS.map((d, i) => (
              <div
                key={d.no}
                data-reveal
                data-dir={i % 2 === 0 ? "left" : "right"}
                className={styles.decisionCard}
              >
                <div>
                  <div className={styles.decisionMeta}>
                    <span className={styles.decisionNoWrap}>
                      <HandBox className={styles.decisionNoSvg} />
                      <span className={`${styles.geist} ${styles.decisionNo}`}>{d.no}</span>
                    </span>
                    <span className={styles.decisionTag}>{d.tag}</span>
                  </div>
                  <h3 className={styles.decisionTitle}>{d.title}</h3>
                  <p className={styles.decisionBody}>{d.body}</p>
                </div>
                <div className={styles.decisionCompare}>
                  <div>
                    <div className={styles.compareLabel}>原来</div>
                    <div className={styles.compareBefore}>{d.before}</div>
                  </div>
                  <div>
                    <div className={`${styles.compareLabel} ${styles.compareLabelNow}`}>现在</div>
                    <div className={styles.compareAfter}>{d.after}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className={styles.principleBox}>
            <div className={styles.principleLabel}>底层原则</div>
            <p className={styles.principleText}>
              每一次迭代，都在问同一个问题——这个功能，是让用户离 AI{" "}
              <span className={styles.principleNear}>更近</span>了，还是
              <span className={styles.principleFar}>更远</span>了？
            </p>
          </div>
        </div>
      </section>

      <SeamBand variant={1} prevColor="#1f1916" nextColor="#faf4f2" />

      {/* ── 06 Tech stack ── */}
      <section id="s6" className={`${styles.section} ${styles.stack}`}>
        <div className={styles.stackInner}>
          <div className={styles.sectionHead}>
            <h2 data-reveal className={`${styles.sectionTitle} ${styles.stackTitle}`}>
              一个人 <span className={styles.accentText}>×</span> 一套 AI 工具链{" "}
              <span className={styles.accentText}>=</span> 一个可用的产品
            </h2>
            <span className={styles.eyebrow}>技术栈与工具链</span>
          </div>
          <div className={styles.stackGrid}>
            {STACK.map((t) => (
              <div key={t.name} data-reveal className={styles.stackCard}>
                <div className={styles.stackIcon} />
                <span className={`${styles.geist} ${styles.stackName}`}>{t.name}</span>
                <span className={styles.stackDesc}>{t.desc}</span>
              </div>
            ))}
          </div>
          <p data-reveal className={styles.stackClosing}>
            AI 产品经理不需要从 0 手搓每一行代码，但需要知道每一个模块
            <span className={styles.stackClosingAccent}>为什么这样搭</span>。
          </p>
        </div>
      </section>

      <SeamBand variant={2} prevColor="#fdfaf8" nextColor="#fdfaf8" />

      {/* ── 07 About ── */}
      <section id="s7" className={`${styles.section} ${styles.about}`}>
        <div className={styles.aboutGlow} />
        <div className={styles.aboutInner}>
          <div className={styles.aboutCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarGlow} />
              <div className={styles.avatarSlot}>
                <span>照片 · 头像</span>
              </div>
            </div>
            <div>
              <span className={styles.eyebrow}>关于我</span>
              <h2 data-reveal className={styles.aboutName}>
                刘力源 <span className={`${styles.geist} ${styles.aboutNameEn}`}>LEONA LIU</span>
              </h2>
              <p data-reveal className={styles.aboutBio}>
                四川美术学院硕士在读，从原创 IP 孵化、品牌内容运营到 AI
                产品设计，擅长从用户真实需求出发定义产品，并通过 Vibe Coding
                独立完成从原型到落地的全流程。兼具视觉创作力与数据思维，能在 AI 产品与内容策略之间建立连接。
              </p>
              <p data-reveal className={styles.aboutBioStrong}>
                COMI 是我第一个从 0 到 1 的 AI 产品，也是我理解&ldquo;AI 与人的关系&rdquo;的一次完整实验。
              </p>
              <div className={styles.aboutContacts}>
                <a href="tel:17623068416" className={`${styles.geist} ${styles.contactLink}`}>
                  176 2306 8416
                </a>
                <a
                  href="mailto:badyuanzi416@gmail.com"
                  className={`${styles.geist} ${styles.contactLink}`}
                >
                  badyuanzi416@gmail.com
                </a>
                {/* Resume PDF asset not yet supplied — placeholder, non-interactive. */}
                <span
                  className={styles.contactCta}
                  title="简历文件待补充"
                  aria-disabled="true"
                >
                  简历下载 PDF ↓
                </span>
              </div>
            </div>
          </div>

          <div className={styles.aboutFooter}>
            <span>开源致谢 · Clawd on desk</span>
            <span>最后更新 2026.08.25</span>
            <span>Made with Claude Code</span>
          </div>
        </div>
      </section>
    </div>
  );
}
