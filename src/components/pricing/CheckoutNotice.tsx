"use client";

import { useSearchParams } from "next/navigation";

const MESSAGES: Record<string, { title: string; body: string; tone: "success" | "error" | "info" }> = {
  success: {
    title: "Payment successful",
    body: "Thanks for upgrading to REFLUX PRO. Your license details will arrive by email shortly.",
    tone: "success",
  },
  failed: {
    title: "Payment failed",
    body: "Your card was not charged. Please try again or use a different payment method.",
    tone: "error",
  },
  cancelled: {
    title: "Checkout cancelled",
    body: "No charge was made. Pick a plan below whenever you're ready.",
    tone: "info",
  },
  error: {
    title: "Checkout unavailable",
    body: "We're finishing payment setup. Please try again in a few minutes or message us on Discord.",
    tone: "error",
  },
};

const toneStyles = {
  success: "border-reflux-green/40 bg-reflux-green/10 text-reflux-green",
  error: "border-reflux-accent/40 bg-reflux-accent/10 text-reflux-accent",
  info: "border-reflux-border bg-white/5 text-reflux-muted",
};

export function CheckoutNotice() {
  const params = useSearchParams();
  const status = params.get("checkout");
  if (!status || !MESSAGES[status]) return null;

  const message = MESSAGES[status];
  const plan = params.get("plan");

  return (
    <div
      className={`mx-auto mb-8 max-w-2xl rounded-2xl border px-6 py-4 text-center ${toneStyles[message.tone]}`}
      role="status"
    >
      <p className="font-bold text-white">{message.title}</p>
      <p className="mt-1 text-sm leading-relaxed">{message.body}</p>
      {plan && status === "success" ? (
        <p className="mt-2 text-xs uppercase tracking-wide opacity-80">Plan: {plan}</p>
      ) : null}
    </div>
  );
}
