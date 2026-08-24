import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "COMI — 逗号，意味着无限可能",
  description: "COMI 是一个让所有 AI 记得你的 AI 伴侣产品。产品作品集 · LEONA LIU",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${instrumentSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
