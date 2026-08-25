"use client";

import styles from "./portfolio.module.css";
import { AboutMeShowcase } from "./AboutMeShowcase";

/**
 * Full "关于我" gallery for the memory-feature deep dive: three
 * roughly-equal columns, left to right — main page (scrollable) / empty
 * state / edit state + chat toast stacked together — mirroring the
 * phoneFrame sizing and card-tilt language already used by the
 * "产品界面" showcase above it.
 *
 * Sources (Figma): 2137:2 / 2140:2 (main), 2144:2 / 2146:2 (empty),
 * 2149:2 / 2150:2 (edit state), 2149:28 / 2150:28 (chat toast).
 */
export function AboutMeGallery({ dark }: { dark: boolean }) {
  return (
    <div className={styles.memoryGallery}>
      <figure data-reveal data-dir="left" className={styles.memoryGalleryCol}>
        <AboutMeShowcase dark={dark} frameClassName={styles.memoryEqualFrame} />
        <figcaption className={styles.memoryCaption}>
          <span className={styles.memoryCaptionStep}>01 · 进入</span>
          <strong>关于我 · 主页</strong>
          <span>四类记忆一次看全，用右下角按钮翻看完整卡片</span>
        </figcaption>
      </figure>

      <figure data-reveal className={styles.memoryGalleryCol}>
        <div className={`${styles.phoneFrame} ${styles.memoryEqualFrame}`}>
          <img
            src={dark ? "/images/app-aboutme-empty-dark.png" : "/images/app-aboutme-empty-light.png"}
            alt="COMI 关于我空状态：中央写着'我们还在慢慢认识'，配一个 COMI 小角色"
            className={styles.aboutMeImg}
          />
        </div>
        <figcaption className={styles.memoryCaption}>
          <span className={styles.memoryCaptionStep}>02 · 空状态</span>
          <strong>还没有记忆</strong>
          <span>大留白 + 一句轻描述，不写&ldquo;暂无数据&rdquo;</span>
        </figcaption>
      </figure>

      <div data-reveal data-dir="right" className={styles.memoryGalleryStack}>
        <figure>
          <div className={styles.memoryCardFrame}>
            <img
              src={dark ? "/images/app-aboutme-edit-dark.png" : "/images/app-aboutme-edit-light.png"}
              alt="COMI 关于我编辑状态：卡片原地展开为可编辑文本框，底部是取消与保存按钮"
            />
          </div>
          <figcaption className={styles.memoryCaption}>
            <span className={styles.memoryCaptionStep}>03 · 编辑</span>
            <strong>编辑状态</strong>
            <span>用户可以直接修正 AI 的理解，并保存为正式记忆</span>
          </figcaption>
        </figure>

        <figure>
          <div className={styles.memoryCardFrame}>
            <img
              src={dark ? "/images/app-aboutme-toast-dark.png" : "/images/app-aboutme-toast-light.png"}
              alt="聊天内轻反馈气泡：COMI 记住了一点关于你的事，悬浮在输入框上方"
            />
          </div>
          <figcaption className={styles.memoryCaption}>
            <span className={styles.memoryCaptionStep}>04 · 自动沉淀</span>
            <strong>自动记忆反馈</strong>
            <span>COMI 完成记忆沉淀后，用轻量提示告知用户，不打断聊天</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
