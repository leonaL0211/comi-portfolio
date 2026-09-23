import styles from "./portfolio.module.css";
import caseStyles from "./case-study.module.css";

const STAGES = [
  { status: "01 · 已实现", title: "长期理解与记忆", what: "自动沉淀记忆，支持用户修正与跨模型延续。", why: "让下一次对话不必从重新介绍自己开始。", href: "#memory-formation" },
  { status: "02 · 已设计", title: "共享上下文与文件信息", what: "将个人记忆、文件与当前任务组织到共同语境中。", why: "减少用户反复补充背景、传递资料。", href: "#shared-context" },
  { status: "03 · 探索中", title: "多模型圆桌与桌面陪伴", what: "探索多模型交叉验证，以及对话之外的陪伴形态。", why: "让理解的延续支持更可信的判断与更自然的陪伴。", href: "#s4" },
];

export function ProductEvolution() {
  return (
    <div className={caseStyles.evolution}>
      <span className={styles.eyebrow}>产品演进</span>
      <h3 className={caseStyles.subheading}>从记住一个人，到让理解持续延续</h3>
      <div className={caseStyles.threeColumns}>
        {STAGES.map((stage) => (
          <a key={stage.status} href={stage.href} className={caseStyles.stage}>
            <span className={caseStyles.label}>{stage.status}</span>
            <h4>{stage.title}</h4>
            <p>{stage.what}</p>
            <p className={caseStyles.why}><strong>为什么</strong> · {stage.why}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

const STEPS = ["用户消息", "读取已有记忆", "组装系统上下文", "生成回复", "提取长期信息", "判断创建、更新或忽略", "记忆库"];

export function MemoryFormation() {
  return (
    <section id="memory-formation" className={`${styles.section} ${styles.memoryDeepDive}`}>
      <div className={styles.memoryDeepDiveInner}>
        <div className={styles.sectionHead}>
          <h2 data-reveal className={styles.sectionTitle}>什么值得被 COMI 长期记住？</h2>
          <span className={styles.statusPill}>已实现 · 记忆如何形成</span>
        </div>
        <p data-reveal className={caseStyles.thesis}>COMI 不只保存对话，更要判断：什么值得成为长期记忆。</p>
        <ol data-reveal className={caseStyles.memoryFlow} aria-label="Implemented memory formation flow">
          {STEPS.map((step, index) => (
            <li key={step}><span className={caseStyles.label}>0{index + 1}</span><strong>{step}</strong></li>
          ))}
        </ol>
        <p className={caseStyles.note}>回复生成并保存后，再提取长期信息。创建与更新会写入记忆库；忽略则不写入。提取失败保留已完成的对话。</p>
        <div data-reveal className={caseStyles.threeColumns}>
          <div className={caseStyles.decision}><h3>创建</h3><p>用户明确表达、可长期复用的新信息。</p></div>
          <div className={caseStyles.decision}><h3>更新</h3><p>用户纠正已有事实，且能匹配具体记忆。</p></div>
          <div className={caseStyles.decision}><h3>忽略</h3><p>临时情绪、一次性任务、重复或无法确认的信息。</p></div>
        </div>
        <div data-reveal className={caseStyles.fields} aria-label="Implemented memory fields and checks">
          {["分类", "重要性 1–5", "重复检查", "来源：自动 / 手动", "置顶"].map((field) => <span key={field}>{field}</span>)}
        </div>
        <p className={caseStyles.note}>每轮最多一个记忆动作；创建前按规范化后的标题或内容检查重复。用户可以手动编辑、删除与置顶。</p>

        <div data-reveal className={caseStyles.contextBlock}>
          <h3 className={caseStyles.subheading}>记忆 / 上下文 / 检索</h3>
          <dl className={caseStyles.threeColumns}>
            <div><dt>记忆（Memory）</dt><dd>关于用户的哪些信息，值得长期保留？</dd></div>
            <div><dt>上下文（Context）</dt><dd>在这一次交互中，模型应该看到哪些信息？</dd></div>
            <div><dt>检索</dt><dd>需要时，应该检索哪些外部信息？</dd></div>
          </dl>
          <p className={caseStyles.body}>当前选择：直接将记忆文本注入 系统上下文，按置顶、重要性、更新时间排序，最多 12 条 / 4,000 字符。模型在本轮判断哪些信息相关；没有语义检索或动态相关性排名。</p>
          <p className={caseStyles.note}>在当前规模下，直接注入记忆让设计保持简单。在上述限制内，可以注入全部记忆；随着记忆增长，需要进一步评估检索与基于相关性的优先级选择。</p>
        </div>

        <div id="shared-context" data-reveal className={caseStyles.sharedContext}>
          <div className={styles.sectionHead}>
            <h3 className={caseStyles.subheading}>共享上下文（Shared Context）· 让理解继续流动</h3>
            <span className={`${styles.statusPill} ${styles.statusPillExploration}`}>已设计</span>
          </div>
          <p className={caseStyles.body}>共享上下文旨在减少用户、文件与 AI 交互之间反复传递背景信息的负担。</p>
          <div className={caseStyles.contextSources}>
            <div><strong>用户记忆</strong><span>已实现</span></div>
            <b aria-hidden="true">+</b>
            <div><strong>文件 / 知识</strong><span>已设计</span></div>
            <b aria-hidden="true">+</b>
            <div><strong>当前对话</strong><span>已实现</span></div>
          </div>
          <div className={caseStyles.contextDestination}><span aria-hidden="true">↓</span><strong>共享上下文 · 已设计</strong><span aria-hidden="true">↓</span><strong>AI 交互</strong></div>
          <p className={caseStyles.note}>上图是目标体验：个人记忆与当前对话已进入模型上下文；跨文件的统一语境仍在设计中。下一步验证 目标 / 关键决策 / 当前状态 的共享粒度，而不是搬运全部历史。</p>
        </div>
      </div>
    </section>
  );
}
