import Link from "next/link";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingCards } from "@/components/pricing/PricingCards";
import { CheckoutNotice } from "@/components/pricing/CheckoutNotice";
import { CTA } from "@/components/sections/CTA";
import { plans } from "@/data/plans";
import { displayTweakCountForPlan, PRODUCT_LIMITS } from "@/data/tweaks";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "Pricing – REFLUX TWEAKS",
  description: "Compare REFLUX TWEAKS plans. Start Monthly at $6.99/mo or go Lifetime.",
};

const faqs = [
  {
    q: "Can I cancel Monthly anytime?",
    a: "Yes. Monthly is no-contract — cancel whenever. You keep access until the period ends.",
  },
  {
    q: "What's the difference between Monthly and Lifetime?",
    a: "Same tweaks, same features. Lifetime is one payment — every future update included.",
  },
  {
    q: "Is the Free plan useful?",
    a: `Yes. ${PRODUCT_LIMITS.freeTweaks} core tweaks, 2 power plans, and basic network optimizations — enough to feel the difference.`,
  },
  {
    q: "Are tweaks safe?",
    a: "Every batch creates a restore point. One-click revert anytime.",
  },
];

export default function PricingPage() {
  return (
    <SiteShell mainClassName="pt-8 pb-10">
      <section className="mb-16 pt-8 text-center">
        <SectionHeader
          eyebrow="Simple, honest pricing"
          title={
            <>
              Pick your <span className="gradient-text">power level</span>
            </>
          }
          subtitle="Monthly gives you everything for less than a coffee a week. Lifetime pays for itself in under 2 years."
        />
      </section>

      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>

      <PricingCards />

      <section className="mt-20">
        <GlowTable />
      </section>

      <section className="mt-20">
        <SectionHeader eyebrow="FAQ" title="Common questions" centered />
        <div className="mx-auto grid max-w-3xl gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card-static rounded-2xl p-6">
              <h3 className="font-bold text-white">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-reflux-muted">{faq.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/compare"
            className="font-semibold text-reflux-accent underline-offset-4 hover:underline"
          >
            <span className="inline-flex items-center gap-1.5">
              See all tweaks compared
              <Icon name="arrowRight" size={16} strokeWidth={2.2} glow={false} />
            </span>
          </Link>
        </p>
      </section>

      <CTA />
    </SiteShell>
  );
}

function GlowTable() {
  return (
    <div className="glass-card-static overflow-hidden rounded-3xl p-8">
      <h2 className="mb-8 text-center text-2xl font-bold">Quick comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-reflux-border text-reflux-muted">
              <th className="py-3 text-left font-semibold">Feature</th>
              {plans.map((p) => (
                <th key={p.id} className="px-3 py-3 text-center font-bold text-white">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-reflux-border/40">
              <td className="py-4 font-medium">Total tweaks</td>
              {plans.map((p) => (
                <td key={p.id} className="px-3 py-4 text-center text-lg font-extrabold text-reflux-accent">
                  {displayTweakCountForPlan(p.id)}
                </td>
              ))}
            </tr>
            {[
              "Automatic game scanner",
              "Advanced network pack",
              "System cleanup automation",
              "Live benchmarks",
              "Priority support",
              "Lifetime updates",
            ].map((row) => (
              <tr key={row} className="border-b border-reflux-border/30">
                <td className="py-3.5 text-reflux-muted">{row}</td>
                {plans.map((p) => {
                  const has =
                    (row === "Automatic game scanner" && p.id !== "free") ||
                    (row === "Advanced network pack" && p.id !== "free") ||
                    (row === "System cleanup automation" && p.id !== "free") ||
                    (row === "Live benchmarks" && p.id !== "free") ||
                    (row === "Priority support" && p.id !== "free") ||
                    (row === "Lifetime updates" && (p.id === "lifetime" || p.id === "yearly"));
                  return (
                    <td key={p.id} className="px-3 py-3.5 text-center">
                      {has ? (
                        <Icon
                          name="check"
                          size={18}
                          strokeWidth={2.6}
                          glow={false}
                          className="mx-auto text-reflux-green"
                        />
                      ) : (
                        <span className="text-reflux-muted/40">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
