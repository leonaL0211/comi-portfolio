import styles from "./portfolio.module.css";
import caseStyles from "./case-study.module.css";

const STAGES = [
  { status: "01 · IMPLEMENTED", title: "Long-term Understanding / Memory", what: "自动记忆、用户修正与跨模型延续。", why: "让下一次对话不必从重新介绍自己开始。", href: "#memory-formation" },
  { status: "02 · DESIGNED", title: "Shared Context / File Context", what: "将个人记忆、文件与当前任务放进共同语境。", why: "减少用户在资料与 AI 之间反复交接信息。", href: "#shared-context" },
  { status: "03 · EXPLORATION", title: "LLM Roundtable / COMI on Desk", what: "探索多模型讨论与桌面陪伴形态。", why: "理解能够延续后，探索它如何参与日常。", href: "#s4" },
];

export function ProductEvolution() {
  return (
    <div className={caseStyles.evolution}>
      <span className={styles.eyebrow}>PRODUCT EVOLUTION</span>
      <h3 className={caseStyles.subheading}>From a companion interface to a context-aware AI system</h3>
      <div className={caseStyles.threeColumns}>
        {STAGES.map((stage) => (
          <a key={stage.status} href={stage.href} className={caseStyles.stage}>
            <span className={caseStyles.label}>{stage.status}</span>
            <h4>{stage.title}</h4>
            <p>{stage.what}</p>
            <p className={caseStyles.why}><strong>Why</strong> · {stage.why}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

const STEPS = ["User Message", "Read Existing Memory", "Assemble Memory into System Context", "Model Response", "Memory Extraction", "Create / Update / Ignore", "Memory Store"];

export function MemoryFormation() {
  return (
    <section id="memory-formation" className={`${styles.section} ${styles.memoryDeepDive}`}>
      <div className={styles.memoryDeepDiveInner}>
        <div className={styles.sectionHead}>
          <h2 data-reveal className={styles.sectionTitle}>什么值得被 COMI 长期记住？</h2>
          <span className={styles.statusPill}>IMPLEMENTED · MEMORY FORMATION</span>
        </div>
        <p data-reveal className={caseStyles.thesis}>Memory is treated as a product decision layer, not simply conversation history.</p>
        <ol data-reveal className={caseStyles.memoryFlow} aria-label="Implemented memory formation flow">
          {STEPS.map((step, index) => (
            <li key={step}><span className={caseStyles.label}>0{index + 1}</span><strong>{step}</strong></li>
          ))}
        </ol>
        <p className={caseStyles.note}>回复生成并保存后，再提取长期信息。Create / Update 写入记忆库；Ignore 不写入。提取失败保留已完成的对话。</p>
        <div data-reveal className={caseStyles.threeColumns}>
          <div className={caseStyles.decision}><h3>Create</h3><p>用户明确表达、可长期复用的新信息。</p></div>
          <div className={caseStyles.decision}><h3>Update</h3><p>用户纠正已有事实，且能匹配具体记忆。</p></div>
          <div className={caseStyles.decision}><h3>Ignore</h3><p>临时情绪、一次性任务、重复或无法确认的信息。</p></div>
        </div>
        <div data-reveal className={caseStyles.fields} aria-label="Implemented memory fields and checks">
          {["category", "importance 1–5", "duplicate checking", "source: auto / manual", "pinned"].map((field) => <span key={field}>{field}</span>)}
        </div>
        <p className={caseStyles.note}>每轮最多一个记忆动作；创建前按规范化后的标题或内容检查重复。用户可以手动编辑、删除与置顶。</p>

        <div data-reveal className={caseStyles.contextBlock}>
          <h3 className={caseStyles.subheading}>Memory / Context / Retrieval</h3>
          <dl className={caseStyles.threeColumns}>
            <div><dt>Memory</dt><dd>What should persist about the user over time?</dd></div>
            <div><dt>Context</dt><dd>What information should the model see for this interaction?</dd></div>
            <div><dt>Retrieval / RAG</dt><dd>What external information should be retrieved when needed?</dd></div>
          </dl>
          <p className={caseStyles.body}>当前选择：直接将记忆文本注入 system context，按置顶、重要性、更新时间排序，最多 12 条 / 4,000 字符。模型在本轮判断哪些信息相关；没有语义检索或动态相关性排名。</p>
          <p className={caseStyles.note}>At the current scale, direct memory injection keeps the design simple. Full injection is possible within these limits; as memory grows, retrieval and relevance-based prioritization will need to be evaluated.</p>
        </div>

        <div id="shared-context" data-reveal className={caseStyles.sharedContext}>
          <div className={styles.sectionHead}>
            <h3 className={caseStyles.subheading}>Shared Context · 让理解继续流动</h3>
            <span className={`${styles.statusPill} ${styles.statusPillExploration}`}>DESIGNED</span>
          </div>
          <p className={caseStyles.body}>Shared Context is designed to reduce repeated information handoff between the user, files and AI interactions.</p>
          <div className={caseStyles.contextSources}>
            <div><strong>User Memory</strong><span>IMPLEMENTED</span></div>
            <b aria-hidden="true">+</b>
            <div><strong>Files / Knowledge</strong><span>DESIGNED</span></div>
            <b aria-hidden="true">+</b>
            <div><strong>Current Conversation</strong><span>IMPLEMENTED</span></div>
          </div>
          <div className={caseStyles.contextDestination}><span aria-hidden="true">↓</span><strong>Shared Context · DESIGNED</strong><span aria-hidden="true">↓</span><strong>AI Interaction</strong></div>
          <p className={caseStyles.note}>上图是目标体验：个人记忆与当前对话已进入模型上下文；跨文件的统一语境仍在设计中。下一步验证 Goal / Key Decisions / Current State 的共享粒度，而不是搬运全部历史。</p>
        </div>
      </div>
    </section>
  );
}
