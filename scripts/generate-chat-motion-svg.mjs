import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, "..");
const publicImagesDir = resolve(projectDir, "public", "images");
const designAssetsDir = resolve(projectDir, "design-assets");

mkdirSync(publicImagesDir, { recursive: true });
mkdirSync(designAssetsDir, { recursive: true });

const fontPath = resolve(projectDir, ".next", "static", "media", "2270dad856f816fe-s.p.1l242s87wfmg2.woff2");
const fontData = readFileSync(fontPath).toString("base64");

const themes = {
  light: {
    baseFile: "app-chat-motion-base-light.png", screen: "#fffdf8", composer: "#fffdf8",
    bubble: "#ffede9", bubbleBorder: "rgba(255,255,255,0.6)", text: "#817773",
    placeholder: "#b9b0ac", thinking: "#fff0ed", dot: "#c95f62",
    bubbleShadow: "#dca79a", mask: "#fffdf8",
  },
  dark: {
    baseFile: "app-chat-motion-base-dark.png", screen: "#171217", composer: "#181318",
    bubble: "url(#darkBubble)", bubbleBorder: "rgba(216,183,207,0.2)", text: "#f0e7ee",
    placeholder: "#5d535b", thinking: "#3a2a37", dot: "#e6a9ca",
    bubbleShadow: "#080508", mask: "#171217",
  },
};

function makeSvg(themeName, theme) {
  const imageData = readFileSync(resolve(publicImagesDir, theme.baseFile)).toString("base64");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="402" height="874" viewBox="0 0 402 874" role="img" aria-labelledby="title desc">
  <title id="title">COMI Chat ${themeName} mode animation</title>
  <desc id="desc">User types a message, sends it, and COMI replies after a thinking animation.</desc>
  <defs>
    <style><![CDATA[
      @font-face { font-family: "Instrument Sans Embedded"; src: url(data:font/woff2;base64,${fontData}) format("woff2"); font-style: normal; font-weight: 400; }
      .copy { font-family: "Instrument Sans Embedded", "Instrument Sans", sans-serif; font-size: 15px; font-style: normal; font-weight: 400; letter-spacing: 0; }
      .composer-placeholder { opacity: 1; animation: placeholderCycle 7.5s linear infinite; }
      .composer-typed { opacity: 0; clip-path: inset(0 100% 0 0); animation: composerType 7.5s steps(40, end) infinite; }
      .send-pulse { transform-box: fill-box; transform-origin: center; animation: sendPulse 7.5s cubic-bezier(.34, 1.56, .64, 1) infinite; }
      .pre-bubble-cover { opacity: 0; animation: preBubbleCover 7.5s ease infinite; }
      .user-message { opacity: 1; transform-box: fill-box; transform-origin: center; animation: userMessage 7.5s cubic-bezier(.22, 1, .36, 1) infinite; }
      .ai-avatar { opacity: 1; animation: aiAvatar 7.5s ease infinite; }
      .thinking { opacity: 0; animation: thinkingCycle 7.5s ease infinite; }
      .thinking-dot { transform-box: fill-box; transform-origin: center; animation: dotBounce .72s ease-in-out infinite; }
      .thinking-dot:nth-child(2) { animation-delay: .12s; }
      .thinking-dot:nth-child(3) { animation-delay: .24s; }
      .ai-reply { opacity: 1; animation: aiReply 7.5s cubic-bezier(.22, 1, .36, 1) infinite; }
      @keyframes placeholderCycle { 0%, 2% { opacity: 1; } 5%, 28% { opacity: 0; } 32%, 100% { opacity: 1; } }
      @keyframes composerType { 0%, 4% { opacity: 0; clip-path: inset(0 100% 0 0); } 6% { opacity: 1; clip-path: inset(0 100% 0 0); } 25% { opacity: 1; clip-path: inset(0 0 0 0); } 29%, 100% { opacity: 0; clip-path: inset(0 0 0 0); } }
      @keyframes sendPulse { 0%, 24%, 34%, 100% { transform: scale(1); } 28% { transform: scale(1.12); } 31% { transform: scale(.97); } }
      @keyframes preBubbleCover { 0%, 28% { opacity: 1; } 34%, 100% { opacity: 0; } }
      @keyframes userMessage { 0%, 28% { opacity: 0; transform: translateY(7px) scale(.985); } 35%, 94% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(0) scale(1); } }
      @keyframes aiAvatar { 0%, 39% { opacity: 0; } 44%, 94% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes thinkingCycle { 0%, 40%, 58%, 100% { opacity: 0; transform: translateY(4px); } 45%, 54% { opacity: 1; transform: translateY(0); } }
      @keyframes dotBounce { 0%, 100% { opacity: .35; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
      @keyframes aiReply { 0%, 56% { opacity: 0; transform: translateY(7px); } 64%, 94% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) {
        .composer-placeholder, .user-message, .ai-avatar, .ai-reply { animation: none; opacity: 1; transform: none; }
        .composer-typed, .thinking, .pre-bubble-cover { animation: none; opacity: 0; }
      }
    ]]></style>
    <linearGradient id="darkBubble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3c3138"/><stop offset="0.48" stop-color="#2b2028"/><stop offset="1" stop-color="#1d151c"/></linearGradient>
    <filter id="bubbleShadow" x="-20%" y="-35%" width="140%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="${theme.bubbleShadow}" flood-opacity="${themeName === "light" ? "0.12" : "0.32"}"/></filter>
    <filter id="typingShadow" x="-20%" y="-80%" width="140%" height="260%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${theme.bubbleShadow}" flood-opacity="0.16"/></filter>
  </defs>
  <rect width="402" height="874" fill="${theme.screen}"/>
  <image href="data:image/png;base64,${imageData}" x="0" y="0" width="402" height="874" preserveAspectRatio="none"/>
  <rect x="8" y="214" width="386" height="94" rx="10" fill="${theme.mask}"/>
  <rect x="70" y="135" width="326" height="88" rx="40" fill="${theme.screen}"/>
  <g class="user-message" opacity="1">
    <rect x="79" y="145" width="308" height="67" rx="32" fill="${theme.bubble}" stroke="${theme.bubbleBorder}" filter="url(#bubbleShadow)"/>
    <text class="copy" fill="${theme.text}"><tspan x="96" y="162">I’ve been thinking about redesigning my</tspan><tspan x="96" y="184">portfolio lately.</tspan></text>
  </g>
  <rect class="pre-bubble-cover" x="70" y="135" width="326" height="88" rx="40" fill="${theme.screen}" opacity="0"/>
  <g class="ai-avatar" opacity="1"><svg x="15" y="218" width="28" height="28" viewBox="15 105 28 28" overflow="hidden"><image href="data:image/png;base64,${imageData}" x="0" y="0" width="402" height="874" preserveAspectRatio="none"/></svg></g>
  <g class="thinking" opacity="0"><rect x="52" y="218" width="54" height="28" rx="14" fill="${theme.thinking}" filter="url(#typingShadow)"/><circle class="thinking-dot" cx="69" cy="232" r="3" fill="${theme.dot}"/><circle class="thinking-dot" cx="79" cy="232" r="3" fill="${theme.dot}"/><circle class="thinking-dot" cx="89" cy="232" r="3" fill="${theme.dot}"/></g>
  <g class="ai-reply" opacity="1"><text class="copy" fill="${theme.text}"><tspan x="52" y="234">That sounds like more than a visual update. Are</tspan><tspan x="52" y="257">you rethinking how you want your work—and</tspan><tspan x="52" y="280">yourself—to be understood?</tspan></text></g>
  <rect x="28" y="773" width="292" height="28" rx="9" fill="${theme.composer}"/>
  <text class="copy composer-placeholder" x="32" y="793" fill="${theme.placeholder}" opacity="1">Share what’s on your mind...</text>
  <text class="copy composer-typed" x="32" y="793" fill="${theme.text}" opacity="0">I’ve been thinking about redesigning my portfolio...</text>
  <g class="send-pulse">
    <svg x="334" y="804" width="48" height="48" viewBox="334 804 48 48" overflow="visible">
      <image href="data:image/png;base64,${imageData}" x="0" y="0" width="402" height="874" preserveAspectRatio="none"/>
    </svg>
  </g>
</svg>`;
}

for (const [themeName, theme] of Object.entries(themes)) {
  const svg = makeSvg(themeName, theme);
  const fileName = `comi-chat-motion-${themeName}.svg`;
  const figmaSvg = svg.replace(
    "</svg>",
    `<style><![CDATA[
      .composer-placeholder, .user-message, .ai-avatar, .ai-reply { animation: none !important; opacity: 1 !important; transform: none !important; }
      .composer-typed, .thinking, .pre-bubble-cover { animation: none !important; opacity: 0 !important; }
      .send-pulse, .thinking-dot { animation: none !important; transform: none !important; }
    ]]></style></svg>`,
  );
  writeFileSync(resolve(publicImagesDir, fileName), svg, "utf8");
  writeFileSync(resolve(designAssetsDir, fileName), svg, "utf8");
  writeFileSync(resolve(designAssetsDir, `comi-chat-motion-${themeName}-figma.svg`), figmaSvg, "utf8");
}

const previewHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>COMI Chat Motion Preview</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#efe9e5;font-family:sans-serif}main{display:flex;align-items:center;gap:48px;padding:48px;overflow-x:auto;max-width:100%}figure{margin:0;text-align:center;color:#554b47}object{display:block;width:min(402px,78vw);height:auto;aspect-ratio:402/874;border-radius:42px;box-shadow:0 24px 70px rgba(68,46,40,.2)}figcaption{margin-top:16px;font-size:14px}@media(max-width:900px){main{align-items:stretch;flex-direction:column}}</style></head><body><main><figure><object data="./comi-chat-motion-light.svg" type="image/svg+xml"></object><figcaption>Light</figcaption></figure><figure><object data="./comi-chat-motion-dark.svg" type="image/svg+xml"></object><figcaption>Dark</figcaption></figure></main></body></html>`;
writeFileSync(resolve(designAssetsDir, "comi-chat-motion-preview.html"), previewHtml, "utf8");
console.log("Generated COMI chat motion SVGs and preview HTML.");
