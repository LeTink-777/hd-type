import { HD_TYPES, isHdTypeId, type HdTypeId } from "@/lib/humandesign";
import { isPlanId, type PlanId } from "@/lib/plans";
import type { PdfSection } from "@/lib/pdf-generator";

/**
 * Собирает разделы разбора для PDF в письме, PDF по кнопке и открытого
 * результата на /success — чтобы все три источника совпадали.
 *
 * Тип и его описание берутся из lib/humandesign.ts, то есть из того же
 * справочника, который показывает бесплатная страница результата.
 */

export type HdInput = {
  type: HdTypeId;
};

/**
 * Базовый тариф открывает тип и стратегию; полный и премиум добавляют
 * авторитет, тему не-себя, профиль, отношения и карьеру — это ровно
 * LOCKED_KEYS из lib/humandesign.ts.
 */
function sectionCountForPlan(plan: PlanId): number {
  return plan === "basic" ? 2 : 7;
}

export function generateResultSections(
  input: HdInput,
  plan: string | null | undefined
): PdfSection[] {
  const type = HD_TYPES[input.type];
  if (!type) return [];

  const resolvedPlan: PlanId = isPlanId(plan) ? plan : "full";

  const all: PdfSection[] = [
    {
      title: `Ваш тип — ${type.name}. ${type.short}`,
      content: `${type.description}\n\nВ мире таких людей ${type.population}.`,
    },
    {
      title: `Стратегия — ${type.strategy}`,
      content: type.strategyExplained,
    },
    {
      title: "Внутренний авторитет",
      content: type.authority,
    },
    {
      title: "Тема не-себя",
      content: type.notSelf,
    },
    {
      title: "Профиль",
      content: type.profile,
    },
    {
      title: "Отношения",
      content: type.relationships,
    },
    {
      title: "Карьера и деньги",
      content: type.career,
    },
  ];

  return all.slice(0, sectionCountForPlan(resolvedPlan));
}

/** Читает тип из metadata ЮKassa — там всё приходит строками. */
export function inputFromMetadata(
  metadata: Record<string, string>
): HdInput | null {
  return isHdTypeId(metadata.type) ? { type: metadata.type } : null;
}

/** Строка под заголовком отчёта: название типа. */
export function buildSubtitle(input: HdInput): string {
  return HD_TYPES[input.type]?.name ?? input.type;
}
