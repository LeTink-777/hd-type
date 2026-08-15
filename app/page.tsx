"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Battery,
  Bell,
  Clock,
  Heart,
  Moon,
  Rocket,
  ScanLine,
  Waves,
  Zap,
} from "lucide-react";
import { QUESTIONS, TYPE_ORDER, HD_TYPES, resolveType, type Answer } from "@/lib/humandesign";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ICONS = {
  zap: Zap,
  clock: Clock,
  heart: Heart,
  rocket: Rocket,
  bell: Bell,
  moon: Moon,
  battery: Battery,
  waves: Waves,
} as const;

function HoloOrbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-ring" />
      <div className="orbit-ring orbit-ring--inner" />
      <div className="orbit-ring orbit-ring--core" />

      {TYPE_ORDER.map((typeId, index) => {
        const angle = (index / TYPE_ORDER.length) * 2 * Math.PI - Math.PI / 2;
        const radius = 47;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <span
            key={typeId}
            className="orbit-label"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
          >
            {HD_TYPES[typeId].name}
          </span>
        );
      })}

      <div className="orbit-core">
        <div>
          <ScanLine size={26} style={{ color: "var(--accent-magenta)" }} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(Answer | null)[]>([null, null, null]);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const allAnswered = answers.every((answer) => answer !== null);
  const emailValid = EMAIL_RE.test(email.trim());
  const canSubmit = allAnswered && emailValid;

  function choose(questionIndex: number, answer: Answer) {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = answer;
      return next;
    });
  }

  function submit() {
    setTouched(true);
    if (!canSubmit) return;
    const resolved = resolveType(answers as [Answer, Answer, Answer]);
    try {
      window.sessionStorage.setItem("hd_email", email.trim());
    } catch {
      /* result page asks again */
    }
    router.push(`/result?type=${resolved}`);
  }

  return (
    <main className="shell" style={{ paddingTop: 40, paddingBottom: 20 }}>
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <p className="eyebrow">Human Design / Type Scan</p>
        <h1 style={{ fontSize: "clamp(26px, 5.4vw, 44px)", margin: "14px 0 12px" }}>
          Твой тип Human Design —<br />3 вопроса
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 30px", fontSize: 16 }}>
          Без даты рождения, без времени и города. Три вопроса о том, как вы
          устроены — и определение типа со стратегией.
        </p>
        <HoloOrbit />
      </motion.header>

      <section style={{ marginTop: 44, display: "grid", gap: 34 }}>
        {QUESTIONS.map((question, questionIndex) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 * questionIndex }}
          >
            <p className="eyebrow" style={{ marginBottom: 6 }}>
              Вопрос {questionIndex + 1} / 3
            </p>
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>{question.question}</h2>

            <div className="q-grid">
              {question.options.map((option) => {
                const Icon = ICONS[option.icon];
                const active = answers[questionIndex] === option.answer;
                return (
                  <button
                    key={option.answer}
                    type="button"
                    className="q-card"
                    data-active={active}
                    aria-pressed={active}
                    onClick={() => choose(questionIndex, option.answer)}
                  >
                    <Icon size={28} className="q-icon" strokeWidth={1.6} aria-hidden="true" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </section>

      <section className="panel" style={{ marginTop: 40 }}>
        <label
          htmlFor="email"
          style={{ display: "block", fontSize: 13, marginBottom: 8, color: "var(--text-muted)" }}
        >
          E-mail для результата
        </label>
        <input
          id="email"
          className="field"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setTouched(true)}
        />

        {touched && !allAnswered ? (
          <p style={{ color: "var(--accent-magenta)", fontSize: 13, margin: "8px 0 0" }}>
            Ответьте на все три вопроса.
          </p>
        ) : null}
        {touched && !emailValid ? (
          <p style={{ color: "var(--accent-magenta)", fontSize: 13, margin: "8px 0 0" }}>
            Проверьте адрес — на него придёт отчёт.
          </p>
        ) : null}

        <button type="button" className="btn" style={{ marginTop: 16 }} onClick={submit} disabled={!canSubmit}>
          <ScanLine size={16} aria-hidden="true" />
          Определить тип
        </button>

        <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", margin: "12px 0 0" }}>
          Бесплатно. Тип, стратегия и описание — сразу на экране.
        </p>
      </section>
    </main>
  );
}
