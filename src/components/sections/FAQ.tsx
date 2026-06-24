"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const faqs = [
  {
    q: "What makes REFLUX different from other optimizers?",
    a: `REFLUX detects your exact CPU and GPU (Intel, AMD, NVIDIA) and surfaces vendor-matched tweak pages automatically. You get ${PRODUCT_LIMITS.freeTweaks} free tweaks with no card, built-in restore points, zero background processes, and a lifetime Pro option — all in one clean desktop app.`,
  },
  {
    q: "Is REFLUX safe to use?",
    a: "Yes. Every tweak batch creates a Windows restore point first. You can revert everything with one click. No malware, no hidden background processes.",
  },
  {
    q: "Will this actually improve my FPS and ping?",
    a: `For most gaming PCs, yes. We focus on ${PRODUCT_LIMITS.totalTweaksLabel} proven tweaks — network stack tuning, power plans, GPU scheduling, and bloat removal.`,
  },
  {
    q: "What's the difference between Free and paid plans?",
    a: `Free gives you ${PRODUCT_LIMITS.freeTweaks} core tweaks and 2 power plans. Paid unlocks ${PRODUCT_LIMITS.totalTweaksLabel} pro optimizations, automatic game scanner, advanced network tools, and priority support.`,
  },
  {
    q: "Can I cancel Monthly anytime?",
    a: "Absolutely. Monthly has no contract. Email refluxtweaking@gmail.com to cancel before your next billing date — you keep access until the current period ends.",
  },
  {
    q: "Does REFLUX work with my games?",
    a: "Any Windows game. The scanner detects titles from Steam, Epic, Ubisoft, and more — with per-game profiles for Fortnite, Apex, Cyberpunk, and others.",
  },
  {
    q: "Do I need to be tech-savvy?",
    a: "No. Download, run as Administrator, hit Apply. REFLUX handles registry and system changes for you.",
  },
  {
    q: "Is Lifetime worth it?",
    a: "If you game regularly, yes. Lifetime pays for itself in under two years vs Monthly, with every future update included.",
  },
  {
    q: "How do I get support?",
    a: "Join our Discord. Paid members get priority support in dedicated channels.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="FAQ"
        title="Got questions?"
        subtitle="Everything you need to know before you tweak."
      />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className={`faq-item reflux-glow-interactive ${open === i ? "faq-item-open reflux-glow-interactive-active" : "hover:-translate-y-0.5"}`}
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-white transition-colors hover:text-reflux-accent"
            >
              {faq.q}
              <span
                className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg reflux-glow-interactive text-reflux-accent transition-all duration-300 ${
                  open === i ? "rotate-45 reflux-glow-interactive-active" : ""
                }`}
              >
                +
              </span>
            </button>
            {open === i && (
              <div className="border-t border-reflux-border/40 px-6 py-5 text-sm leading-relaxed text-reflux-muted">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
