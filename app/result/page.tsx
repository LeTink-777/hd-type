"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, CreditCard, Lock, ScanLine } from "lucide-react";
import { HD_TYPES, LOCKED_KEYS, isHdTypeId } from "@/lib/humandesign";
import { PLANS, PLAN_ORDER, formatPrice, type PlanId } from "@/lib/plans";
import { startCheckout } from "@/lib/checkout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PANEL_FEATURES: Record<PlanId, string[]> = {
  basic: [
    "Тип и стратегия с расширенным описанием",
    "Внутренний авторитет: как принимать решения",
    "Тема не-себя и как её распознать",
    "PDF на почту сразу после оплаты",
  ],
  full: [
    "Всё из тарифа «Базовый»",
    "Профиль и роль в контакте с миром",
    "Отношения: что вам нужно от партнёра",
    "Карьера и деньги: подходящие и разрушающие роли",
    "План адаптации на 30 дней",
  ],
  premium: [
    "Всё из тарифа «Полный»",
    "Аудиоразбор вашего типа, 25 минут",
    "Разбор совместимости с одним человеком",
    "Ответ на один личный вопрос по e-mail",
  ],
};

function ResultInner() {
  const params = useSearchParams();
  const raw = params.get("type");
  const typeId = isHdTypeId(raw) ? raw : "generator";
  const type = HD_TYPES[typeId];

  const [open, setOpen] = useState<PlanId | null>("full");
  const [selected, setSelected] = useState<PlanId>("full");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("hd_email");
      if (saved) setEmail(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  async function pay(plan: PlanId) {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Укажите корректный e-mail — на него придут отчёт и чек.");
      return;
    }
    setSelected(plan);
    setPending(true);
    setError(null);
    const failure = await startCheckout(plan, trimmed, { type: typeId });
    if (failure) {
      setError(failure);
      setPending(false);
    }
  }

  return (
    <main className="shell" style={{ paddingTop: 34, paddingBottom: 20 }}>
      <Link href="/" className="legal-back">
        <ArrowLeft size={15} aria-hidden="true" />
        <span>Пройти заново</span>
      </Link>

      <motion.section
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55 }}
        style={{ textAlign: "center" }}
      >
        <p className="eyebrow">Тип определён</p>

        <div style={{ margin: "20px 0 6px" }}>
          <div className="badge">
            <ScanLine size={22} style={{ color: "var(--accent-magenta)", marginBottom: 10 }} aria-hidden="true" />
            <h1
              style={{
                fontSize: "clamp(24px, 5.6vw, 44px)",
                color: "var(--accent-cyan)",
                margin: 0,
              }}
            >
              {type.name}
            </h1>
            <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
              {type.short} · {type.population}
            </p>
          </div>
        </div>

        <p
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 14,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-magenta)",
            marginTop: 20,
          }}
        >
          Стратегия: {type.strategy}
        </p>
      </motion.section>

      <section className="panel" style={{ marginTop: 30 }}>
        <p style={{ margin: 0, fontSize: 16 }}>{type.description}</p>
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 17, marginBottom: 8, color: "var(--accent-cyan)" }}>
            Как работает стратегия
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 15 }}>
            {type.strategyExplained}
          </p>
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14 }}>Закрытые модули отчёта</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {LOCKED_KEYS.map((item) => (
            <div key={item.key} className="panel">
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                <Lock size={14} style={{ color: "var(--accent-cyan)" }} aria-hidden="true" />
                <h3 style={{ fontSize: 15, margin: 0 }}>{item.title}</h3>
              </div>
              <p className="locked-body" style={{ margin: 0, fontSize: 14 }}>
                {type[item.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 46 }} id="pricing">
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <p className="eyebrow">Доступ к полному отчёту</p>
          <h2 style={{ fontSize: 24, margin: "10px 0 0" }}>Выберите уровень</h2>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {PLAN_ORDER.map((planId, index) => {
            const plan = PLANS[planId];
            const featured = planId === "full";
            const isOpen = open === planId;
            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, x: 70 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                <div className="holo" data-featured={featured} data-open={isOpen}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : planId)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 14,
                      flexWrap: "wrap",
                      width: "100%",
                      padding: 0,
                      background: "none",
                      border: "none",
                      color: "inherit",
                      textAlign: "left",
                      font: "inherit",
                    }}
                  >
                    <div>
                      {featured ? (
                        <p className="eyebrow" style={{ marginBottom: 4 }}>
                          Рекомендуется
                        </p>
                      ) : null}
                      <h3 style={{ fontSize: featured ? 22 : 19, margin: 0 }}>{plan.title}</h3>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                        {plan.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            textDecoration: "line-through",
                            color: "var(--text-muted)",
                            fontSize: 13,
                          }}
                        >
                          {formatPrice(plan.oldPrice)}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 700,
                            fontSize: featured ? 25 : 21,
                            color: "var(--accent-cyan)",
                          }}
                        >
                          {formatPrice(plan.price)}
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        style={{
                          color: "var(--text-muted)",
                          transform: isOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.25s",
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isOpen ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ overflow: "hidden" }}
                    >
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "18px 0 0",
                          display: "grid",
                          gap: 8,
                          borderTop: "1px solid var(--border)",
                          paddingTop: 16,
                        }}
                      >
                        {PANEL_FEATURES[planId].map((feature) => (
                          <li key={feature} style={{ display: "flex", gap: 9, fontSize: 14 }}>
                            <Check
                              size={15}
                              style={{ color: "var(--accent-cyan)", flexShrink: 0, marginTop: 4 }}
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className="btn"
                        style={{ marginTop: 18 }}
                        disabled={pending}
                        onClick={() => void pay(planId)}
                      >
                        <CreditCard size={16} aria-hidden="true" />
                        {pending && selected === planId
                          ? "Готовим оплату..."
                          : `Оплатить ${formatPrice(plan.price)}`}
                      </button>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="panel" style={{ marginTop: 22, maxWidth: 460, marginInline: "auto" }}>
          <label
            htmlFor="pay-email"
            style={{ display: "block", fontSize: 13, marginBottom: 8, color: "var(--text-muted)" }}
          >
            E-mail для отчёта и чека
          </label>
          <input
            id="pay-email"
            className="field"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {error ? (
            <p style={{ color: "var(--accent-magenta)", fontSize: 13, margin: "10px 0 0" }}>{error}</p>
          ) : null}
          <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", margin: "12px 0 0" }}>
            Оплата через ЮKassa. Доступны все способы оплаты, подключённые к магазину.
            Оплачивая, вы принимаете <Link href="/offer">оферту</Link> и{" "}
            <Link href="/privacy">политику конфиденциальности</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="shell" style={{ paddingTop: 90, textAlign: "center" }}>
          <p className="eyebrow">Сканирование...</p>
        </main>
      }
    >
      <ResultInner />
    </Suspense>
  );
}
