import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Orbitron, Exo_2 } from "next/font/google";
import { SITE_URL } from "@/lib/plans";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

// Orbitron ships Latin only. Exo 2 covers Cyrillic in the same futuristic
// register, so Russian headlines keep the intended look.
const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Твой тип Human Design — 3 вопроса и результат",
  description:
    "Узнай свой тип Human Design за 3 вопроса бесплатно. Генератор, Проектор, Манифестор или Рефлектор — стратегия и авторитет мгновенно.",
  keywords: [
    "тип human design",
    "human design тест",
    "определить тип human design",
    "human design онлайн бесплатно",
    "генератор проектор манифестор рефлектор",
    "human design стратегия",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Тип Human Design",
    title: "Твой тип Human Design — 3 вопроса и результат",
    description:
      "Узнай свой тип Human Design за 3 вопроса бесплатно. Генератор, Проектор, Манифестор или Рефлектор — стратегия и авторитет мгновенно.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Твой тип Human Design — 3 вопроса и результат",
    description: "Узнай свой тип Human Design за 3 вопроса бесплатно.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${orbitron.variable} ${exo.variable}`}>
      <body>
        {children}
        <footer className="site-footer">
          <nav>
            <Link href="/">Главная</Link>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/offer">Публичная оферта</Link>
          </nav>
          <p style={{ margin: 0 }}>
            Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый
          </p>
          <p style={{ margin: "4px 0 0" }}>danyavdkmvv3@gmail.com · Telegram @dvdkmv</p>
          <p style={{ margin: "10px 0 0", opacity: 0.6 }}>
            Материалы носят развлекательный характер. 18+
          </p>
        </footer>
      </body>
    </html>
  );
}
