import type { Metadata } from "next";
import { SuccessView } from "@/components/SuccessView";

export const metadata: Metadata = {
  title: "Оплата принята — Тип Human Design",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessView />;
}
