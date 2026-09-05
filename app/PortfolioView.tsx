"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AboutMeGallery } from "./AboutMeGallery";
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
  { href: "#s4", label: "桌面陪伴" },
  { href: "#s3b", label: "界面" },
  { href: "#s3c", label: "记忆库" },
  { href: "#s5", label: "决策日志" },
  { href: "#s6", label: "工具链" },
  { href: "#s6b", label: "用户验证" },
];

const DOT_SECTIONS = ["s1", "s2", "s3", "s4", "s3b", "s3c", "s5", "s6", "s6b", "s7"];

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

// ── Validation section content ──────────────────────────────────
// Kept data-driven so metrics / findings / evidence can be edited or
// re-ordered without touching markup.

const PUBLIC_METRICS = [
  { value: "25", label: "Inbound DMs · 主动私信" },
  { value: "340+", label: "Likes · 点赞" },
  { value: "120+", label: "Saves · 收藏" },
];

// Social-feedback screenshot slots. Drop a same-named file into
// /public/images to replace a placeholder — no code change needed.
const PUBLIC_SHOTS = [
  { id: "validation-public-01", alt: "小红书用户对 COMI 的兴趣留言截图 1" },
  { id: "validation-public-02", alt: "小红书用户对 COMI 的兴趣留言截图 2" },
];

const TEST_PARTICIPANT_MIX = ["Heavy AI User × 2", "New User × 1", "Casual User × 1"];

const INTRO_FINDINGS = [
  {
    label: "Observed Friction · 需要解释的功能",
    body: '"关于我"存在触达成本；记忆删除路径不够统一；复杂信息结构会增加理解负担。',
  },
  {
    label: "Key Insight · 关键结论",
    body: "用户真正关心的不是“有多少功能”，而是上下文是否连续、记忆是否可信，以及 AI 是否真正理解自己。",
  },
  {
    label: "Design Response · 产品回应",
    body: "将 About You / 关于你与主动记忆机制，从“功能展示”重新组织为围绕长期理解和上下文连续性的体验系统；Shared Context 作为下一步方向，优先验证要共享的 Context 粒度。",
  },
];

const RESEARCH_PARTICIPANTS = [
  { code: "P1", desc: "重度陪伴 + 工作" },
  { code: "P2", desc: "AI 新用户" },
  { code: "P3", desc: "轻度聊天" },
  { code: "P4", desc: "重度多模型生产力" },
];

const TASK_FLOW = [
  { en: "First Impression", zh: "首次理解" },
  { en: "About You", zh: "AI 如何理解我" },
  { en: "Memory Control", zh: "记住了什么" },
  { en: "Shared Context", zh: "模型间共享什么" },
  { en: "Priority", zh: "最想留下什么" },
];

// Evidence screenshots are real crops from actual test-participant chat
// logs (WeChat, 2026-09-05/06) — cropped to the relevant message only,
// not staged or fabricated.
const EVIDENCE = [
  {
    code: "A",
    label: "EVIDENCE A · MEMORY CONTROL",
    img: "/images/validation-evidence-memory.jpg",
    alt: "参与者聊天记录：说明发现记忆有误时，会直接告诉 AI 重新记一次，或去记忆库里手动改",
    body: "用户会主动检查、修改甚至删除 AI 对自己的记忆，因此“可见、可控、可修正”本身就是信任的一部分。",
  },
  {
    code: "B",
    label: "EVIDENCE B · SHARED CONTEXT",
    img: "/images/validation-evidence-context.jpg",
    alt: "参与者聊天记录：说明换模型时只希望带走最终结论和大纲，不需要搬运完整的修改过程",
    body: "用户期待跨模型的不是机械复制完整聊天记录，而是模型能够延续对当前任务和个人背景的理解。",
  },
  {
    code: "C",
    label: "EVIDENCE C · COMPANION EXPERIENCE",
    img: "/images/validation-evidence-companion.jpg",
    alt: "参与者聊天记录：说明喜欢 AI 发表情包、不说长句子，这些细节让对话更像和真人聊天",
    body: "陪伴感并不只来自长篇回复。表情包、语气、微小回应方式等细节也会显著影响用户是否觉得“这个 AI 懂我”。",
  },
];

const SYNTHESIS = [
  {
    no: "01",
    title: "Context should be compressed, not copied",
    body: "不同模型之间需要延续“理解”，而不是原样搬运完整聊天历史。",
  },
  {
    no: "02",
    title: "Memory is both continuity and self-reflection",
    body: "记忆既帮助 AI 保持连续性，也让用户重新看到“AI 如何理解我”。",
  },
  {
    no: "03",
    title: "Correction needs two paths",
    body: "用户既需要直接进入 About You / 记忆库修改，也需要在对话中即时纠正 AI。",
  },
  {
    no: "04",
    title: "Companionship comes from small interaction details",
    body: "表情包、语气和轻量反馈等细节，会明显改变陪伴感与产品人格感知。",
  },
];

const DESIGN_RESPONSE = {
  implemented: [
    '「关于我」入口 →「关于你」',
    "About You / 记忆相关入口重新组织",
    "主动记忆机制",
    "Memory 已实现基础可编辑 / 删除",
    "Sticker / COMI on Desk 等轻陪伴互动探索",
  ],
  next: [
    "Shared Context 优先验证 Goal / Key Decisions / Current State",
    "进一步验证用户希望跨模型共享的 Context 粒度",
    "优化记忆修正入口与交互反馈",
    "继续验证长期记忆与陪伴体验之间的关系",
  ],
};

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

/**
 * Small hub-and-spoke diagram for the "LLM 圆桌" feature card: one shared
 * memory hub in the middle, three model nodes seated around it, each
 * connected back to the hub — a literal "round table" reading rather than
 * a plain list of model names.
 */
function RoundtableDiagram({ className }: { className?: string }) {
  const hub = { x: 52, y: 52 };
  const nodes = [
    { x: 52, y: 16 },
    { x: 83.4, y: 69 },
    { x: 20.6, y: 69 },
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 104 104"
      aria-hidden="true"
    >
      {nodes.map((n, i) => (
        <line
          key={i}
          x1={hub.x}
          y1={hub.y}
          x2={n.x}
          y2={n.y}
          stroke="rgba(240, 168, 138, 0.4)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={9}
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={1.5}
        />
      ))}
      <circle
        cx={hub.x}
        cy={hub.y}
        r={14}
        fill="rgba(240, 168, 138, 0.9)"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth={1.5}
      />
    </svg>
  );
}

/**
 * Social-proof screenshot slot for the Validation section's "public
 * interest signal" column. Reserves its aspect ratio up front (no
 * layout shift either way) and falls back to a labeled placeholder —
 * naming the exact asset id to drop in — if `/images/{id}.jpg` hasn't
 * been supplied yet, instead of showing a broken-image icon.
 */
function ShotSlot({ id, alt }: { id: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.shotFrame}>
      {!failed ? (
        <img src={`/images/${id}.jpg`} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className={styles.shotPlaceholder}>
          小红书反馈截图待补充
          <span className={`${styles.geist}`}>{id}</span>
        </div>
      )}
    </div>
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
                  我长期同时使用好几个 AI，也慢慢发现一个重复出现的问题：每个模型都只认识自己聊天窗口里的我。一换平台，背景、偏好、正在做的项目，都得重新说一遍。
                </p>
              </div>
              <div data-reveal data-dir="right" className={styles.whyCard}>
                <p>
                  我开始意识到，这不只是&ldquo;切换模型麻烦&rdquo;。项目协作可以靠总结文本传递，但&ldquo;我是谁、习惯怎么沟通、最近在做什么&rdquo;，还是被分散存在不同模型里——问题不是聊天窗口不够好，而是我的上下文，从来没有独立存在过。
                </p>
              </div>
              <div data-reveal className={`${styles.whyCard} ${styles.whyCardHighlight}`}>
                <p>COMI 想做的事很简单：让所有 AI 坐在同一张桌子前，看着同一个我。</p>
                <p className={styles.whyCardHighlightSub}>让个人记忆属于用户，而不是属于某一个模型。</p>
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
              <RoundtableDiagram className={styles.featureRoundtable} />
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

      <SeamBand variant={0} prevColor="#fdfaf8" nextColor="#fdfaf8" />

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
              <div data-reveal className={styles.nameConcept}>
                <span className={styles.nameConceptLabel}>NAME CONCEPT · 命名理念</span>
                <p className={`${styles.geist} ${styles.nameConceptEquation}`}>
                  COMI = Comma + I
                </p>
                <p className={styles.nameConceptBody}>
                  AI 对话不是句号，而是逗号。
                  <br />
                  每一次交流都保留一点上下文，让下一次理解从这里继续。
                </p>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.modeToggle} ${isDarkPreview ? styles.modeToggleDark : ""}`}
              aria-pressed={isDarkPreview}
              onClick={() => setIsDarkPreview((value) => !value)}
            >
              <span className={!isDarkPreview ? styles.modeLabelActive : ""}>
                <span aria-hidden="true">☀️</span> 浅色
              </span>
              <span className={styles.modeTrack} aria-hidden="true">
                <span
                  className={`${styles.modeThumb} ${isDarkPreview ? styles.modeThumbDark : ""}`}
                />
              </span>
              <span className={isDarkPreview ? styles.modeLabelActive : ""}>
                <span aria-hidden="true">🌙</span> 深色
              </span>
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

      <SeamBand variant={2} prevColor="#fdfaf8" nextColor="#fdfaf8" />

      {/* ── 03c Memory feature deep dive ── */}
      <section id="s3c" className={`${styles.section} ${styles.memoryDeepDive}`}>
        <div className={styles.memoryDeepDiveInner}>
          <div className={styles.sectionHead}>
            <h2 data-reveal className={styles.sectionTitle}>
              从&ldquo;Memory&rdquo;到&ldquo;关于你&rdquo;
            </h2>
            <span className={styles.eyebrow}>功能详解 · 记忆库</span>
          </div>
          <p data-reveal className={styles.memoryInsight}>
            <span>早期用户测试洞察</span>
            <span className={styles.memoryInsightDivider}>·</span>
            用户认为&ldquo;Memory&rdquo;含义偏技术，更期待 AI 在持续对话中逐渐了解自己。
          </p>
          <p data-reveal className={styles.productIntro}>
            记忆库最早的界面直接叫 Memory——技术上准确，但读起来像在管理一个数据库。COMI
            把它重新设计成&ldquo;关于你&rdquo;：不是一个需要你主动填写的资料页，而是 COMI
            在长期对话里，对你慢慢形成的理解。
          </p>

          <div data-reveal className={styles.memoryPointsRow}>
            <div className={styles.memoryPoint}>
              <span className={`${styles.geist} ${styles.memoryPointNo}`}>01</span>
              <div>
                <h4>AI 主动理解，不是表单</h4>
                <p>COMI 从对话中自动沉淀值得长期记住的信息，你不需要主动整理或填写资料。</p>
              </div>
            </div>
            <div className={styles.memoryPoint}>
              <span className={`${styles.geist} ${styles.memoryPointNo}`}>02</span>
              <div>
                <h4>按用户理解组织记忆，而非按技术结构展示</h4>
                <p>
                  记忆仍分基本信息、偏好与习惯、长期目标、最近在做，但不暴露底层 Memory
                  结构——你感知到的是&ldquo;COMI 了解了什么&rdquo;，而不是&ldquo;系统存了什么字段&rdquo;。
                </p>
              </div>
            </div>
            <div className={styles.memoryPoint}>
              <span className={`${styles.geist} ${styles.memoryPointNo}`}>03</span>
              <div>
                <h4>最终控制权始终是你的</h4>
                <p>每一条记忆都能原地编辑或删除，AI 的理解可能出错，你随时可以纠正它。</p>
              </div>
            </div>
          </div>

          <AboutMeGallery dark={isDarkPreview} />
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
            这套技术与 AI 工具链，让 COMI 从一个真实需求，走向
            <span className={styles.stackClosingAccent}>可运行、可验证的产品形态</span>。
          </p>
        </div>
      </section>

      <SeamBand variant={2} prevColor="#fdfaf8" nextColor="#fdfaf8" />

      {/* ── 06b Validation ── */}
      <section id="s6b" className={`${styles.section} ${styles.validation}`}>
        <div className={styles.validationInner}>
          <div className={styles.sectionHead}>
            <h2 data-reveal className={styles.sectionTitle}>
              产品之外的真实反馈
            </h2>
            <span className={`${styles.eyebrow} ${styles.validationEyebrow}`}>
              VALIDATION · 外部信号与用户验证
            </span>
          </div>
          <p data-reveal className={styles.validationLede}>
            From public interest signals to exploratory usability testing.
          </p>

          {/* 01 · Public signal + usability test summary, side by side */}
          <div className={styles.validationIntro}>
            <div data-reveal data-dir="left">
              <div className={styles.validationColHead}>
                <span className={styles.validationColTitle}>PUBLIC INTEREST SIGNAL</span>
                <span className={styles.validationColTag}>公开兴趣信号</span>
              </div>

              <div className={styles.validationStats}>
                {PUBLIC_METRICS.map((m) => (
                  <div key={m.label} className={styles.statCard}>
                    <span className={`${styles.geist} ${styles.statNumber}`}>{m.value}</span>
                    <span className={styles.statLabel}>{m.label}</span>
                  </div>
                ))}
              </div>

              <p className={styles.validationCopy}>
                COMI 相关内容公开分享后获得持续互动，并有 25
                位用户主动私信询问构建方式。对产品概念与实现路径提供了一层来自真实外部用户的兴趣信号。
              </p>

              <div className={styles.validationShots}>
                {PUBLIC_SHOTS.map((shot) => (
                  <ShotSlot key={shot.id} id={shot.id} alt={shot.alt} />
                ))}
              </div>
            </div>

            <div data-reveal data-dir="right">
              <div className={styles.validationColHead}>
                <span className={styles.validationColTitle}>EXPLORATORY USABILITY TEST</span>
                <span className={styles.validationColTag}>N=4 用户测试</span>
              </div>

              <div className={styles.validationParticipants}>
                {TEST_PARTICIPANT_MIX.map((p) => (
                  <span key={p} className={styles.participantPill}>
                    {p}
                  </span>
                ))}
              </div>

              <div className={styles.validationFindings}>
                {INTRO_FINDINGS.map((f) => (
                  <div key={f.label} className={styles.validationBlock}>
                    <span className={styles.findingLabel}>{f.label}</span>
                    <p className={styles.findingBody}>{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className={styles.validationDivider} />

          {/* 02 · Test setup */}
          <div className={styles.validationStep}>
            <span className={styles.validationStepNo}>02</span>
            <span className={styles.validationStepLabel}>Exploratory Usability Test · N=4</span>
          </div>
          <div data-reveal className={styles.validationSetupHead}>
            <h3 className={styles.sectionTitle} style={{ fontSize: "clamp(21px, 2.2vw, 30px)" }}>
              从&ldquo;能不能用&rdquo;，到&ldquo;用户为什么愿意继续用&rdquo;
            </h3>
            <p className={styles.validationSetupCopy}>
              通过 4
              位不同AI使用深度的参与者，观察COMI在首次理解、长期记忆、跨模型连续性与陪伴体验上的真实反馈。
            </p>
          </div>

          <div data-reveal className={styles.validationParticipants} style={{ marginTop: 20 }}>
            {TEST_PARTICIPANT_MIX.map((p) => (
              <span key={p} className={styles.participantPill}>
                {p}
              </span>
            ))}
          </div>

          <div data-reveal className={styles.validationSetupGrid}>
            <div className={styles.validationBlock}>
              <span className={styles.setupLabel}>Research Objective</span>
              <p className={styles.setupValue}>
                验证不同使用深度的用户是否能理解并使用：长期记忆 / About You / 记忆库 / Shared
                Context / 陪伴式交互
              </p>
            </div>
            <div className={styles.validationBlock}>
              <span className={styles.setupLabel}>Method</span>
              <p className={styles.setupValue}>
                Exploratory Usability Test
                <br />
                n=4 · 15–20 min / participant
              </p>
            </div>
            <div className={styles.validationBlock}>
              <span className={styles.setupLabel}>Participants</span>
              <ul className={styles.participantList}>
                {RESEARCH_PARTICIPANTS.map((p) => (
                  <li key={p.code}>
                    <span className={styles.participantCode}>{p.code}</span>
                    {p.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 03 · Task flow */}
          <div className={`${styles.validationStep} ${styles.validationStepGap}`}>
            <span className={styles.validationStepNo}>03</span>
            <span className={styles.validationStepLabel}>Core Task Flow · 核心任务流程</span>
          </div>
          <div data-reveal className={styles.taskFlow}>
            {TASK_FLOW.map((step, i) => (
              <Fragment key={step.en}>
                <div className={styles.taskFlowStep}>
                  <span className={styles.taskFlowNo}>{i + 1}</span>
                  <span className={styles.taskFlowEn}>{step.en}</span>
                  <span className={styles.taskFlowZh}>{step.zh}</span>
                </div>
                {i < TASK_FLOW.length - 1 ? (
                  <div className={styles.taskFlowArrow} aria-hidden="true">
                    →
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>

          {/* 04 · Evidence from real conversations */}
          <div className={`${styles.validationStep} ${styles.validationStepGap}`}>
            <span className={styles.validationStepNo}>04</span>
            <span className={styles.validationStepLabel}>Evidence From Real Conversations</span>
          </div>
          <p data-reveal className={styles.validationCopy} style={{ maxWidth: "46em" }}>
            以下三段来自真实参与者的原始对话记录（已截取相关片段），而非转述或复述。
          </p>
          <div className={styles.evidenceGrid}>
            {EVIDENCE.map((e, i) => (
              <figure
                key={e.code}
                data-reveal
                data-dir={i === 0 ? "left" : i === 2 ? "right" : undefined}
                className={styles.evidenceItem}
              >
                <div className={styles.evidenceFrame}>
                  <img src={e.img} alt={e.alt} loading="lazy" />
                </div>
                <figcaption>
                  <span className={styles.evidenceLabel}>{e.label}</span>
                  <p className={styles.evidenceBody}>{e.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* 05 · Cross-participant synthesis */}
          <div className={`${styles.validationStep} ${styles.validationStepGap}`}>
            <span className={styles.validationStepNo}>05</span>
            <span className={styles.validationStepLabel}>Cross-Participant Synthesis</span>
          </div>
          <div className={styles.synthesisGrid}>
            {SYNTHESIS.map((s) => (
              <div key={s.no} data-reveal className={styles.synthesisItem}>
                <span className={`${styles.geist} ${styles.synthesisNo}`}>{s.no}</span>
                <h4 className={styles.synthesisTitle}>{s.title}</h4>
                <p className={styles.synthesisBody}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* 06 · Design response */}
          <div className={`${styles.validationStep} ${styles.validationStepGap}`}>
            <span className={styles.validationStepNo}>06</span>
            <span className={styles.validationStepLabel}>Design Response · 产品回应</span>
          </div>
          <div className={styles.responseGrid}>
            <div data-reveal data-dir="left" className={styles.responseCol}>
              <div className={styles.responseColHead}>
                <span className={styles.responseDot} aria-hidden="true" />
                <span className={styles.responseColTitle}>IMPLEMENTED · 已落地</span>
              </div>
              <ul className={styles.responseList}>
                {DESIGN_RESPONSE.implemented.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div data-reveal data-dir="right" className={`${styles.responseCol} ${styles.responseColNext}`}>
              <div className={styles.responseColHead}>
                <span className={styles.responseDot} aria-hidden="true" />
                <span className={styles.responseColTitle}>NEXT ITERATION · 探索中</span>
              </div>
              <ul className={styles.responseList}>
                {DESIGN_RESPONSE.next.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ending statement */}
          <div data-reveal className={styles.validationEnding}>
            <p className={styles.validationEndingText}>
              &ldquo;验证改变的不是某一个按钮，而是我对 COMI
              核心价值的理解：用户真正需要的不是更多 AI 功能，而是一段可以延续的上下文关系。&rdquo;
            </p>
            <p className={styles.validationEndingEn}>
              Validation shifted the question from &ldquo;What should COMI do?&rdquo; to
              &ldquo;What makes users want to continue the relationship?&rdquo;
            </p>
          </div>
        </div>
      </section>

      <SeamBand variant={0} prevColor="#fdfaf8" nextColor="#fdfaf8" />

      {/* ── 07 About ── */}
      <section id="s7" className={`${styles.section} ${styles.about}`}>
        <div className={styles.aboutGlow} />
        <div className={styles.aboutInner}>
          <div className={styles.aboutCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarGlow} />
              <div className={styles.avatarSlot}>
                <img
                  src="/images/头像.jpg"
                  alt="刘力源 Leona Liu 头像照片"
                  className={styles.avatarImg}
                />
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
