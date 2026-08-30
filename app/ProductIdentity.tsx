import Image from "next/image";
import styles from "./portfolio.module.css";

/**
 * "Product Identity" — sits between the Hero and Why COMI sections.
 *
 * Narrative: 认识 COMI → 看见产品入口 → 打开产品 → 进入 Why COMI. The
 * jelly-bubble mark and its layered card are framed as the everyday
 * entry point into the product's memory/context ideas, not as a
 * standalone logo-design case study — the deeper explanation of those
 * ideas belongs to the sections that follow, not here.
 *
 * Assets are visual prototypes (product photography / mockups), not
 * evidence of an App Store release — captions say so explicitly.
 */
export function ProductIdentity() {
  return (
    <section id="s1b" className={`${styles.section} ${styles.identity}`}>
      <div className={styles.identityInner}>
        <span className={styles.eyebrow}>PRODUCT IDENTITY</span>
        <h2 data-reveal className={`${styles.sectionTitle} ${styles.identityTitle}`}>
          从一个图标，进入持续的对话
        </h2>
        <p data-reveal className={styles.identityBody}>
          COMI 将角色化的对话气泡与层叠的信息卡片组合为产品入口：前者代表持续发生的交流，后者呼应跨模型共享的上下文与长期记忆。柔软的
          jelly-glass 材质延续了产品界面的温度，也让复杂的 AI
          能力先以一个轻盈、熟悉的入口被感知。
        </p>

        <div className={styles.identityGrid}>
          <figure data-reveal data-dir="left" className={`${styles.identityCard} ${styles.identityCardLaunch}`}>
            <Image
              src="/images/comi/comi-launch-experience.png"
              alt="双手持握手机，屏幕展示 COMI 启动页：黄色 jelly 对话气泡图标、COMI 字样与标语 There's always more to say."
              width={1111}
              height={1416}
              className={styles.identityImg}
              sizes="(max-width: 860px) 86vw, 40vw"
              loading="lazy"
            />
            <figcaption className={styles.identityCaption}>LAUNCH EXPERIENCE · VISUAL PROTOTYPE</figcaption>
          </figure>

          <figure data-reveal data-dir="right" className={`${styles.identityCard} ${styles.identityLogoCard}`}>
            <div className={styles.identityLogoImgWrap}>
              <Image
                src="/images/comi/comi-app-icon.png"
                alt="完整的 COMI 应用图标：柔和黄色 jelly 对话气泡与后方层叠的莓红色卡片"
                width={1232}
                height={1254}
                className={styles.identityLogoImg}
                sizes="(max-width: 860px) 62vw, 22vw"
                loading="lazy"
              />
            </div>
            <figcaption className={styles.identityCaption}>APP ICON · JELLY-GLASS SYSTEM</figcaption>
          </figure>

          <figure data-reveal data-dir="right" className={`${styles.identityCard} ${styles.identityHomeCard}`}>
            <Image
              src="/images/comi/comi-home-screen.png"
              alt="COMI 图标出现在真实手机主屏幕上，位于日历、邮件等系统应用旁"
              width={1254}
              height={1254}
              className={styles.identityImg}
              sizes="(max-width: 860px) 62vw, 22vw"
              loading="lazy"
            />
            <figcaption className={styles.identityCaption}>HOME SCREEN · VISUAL PROTOTYPE</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
