import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TweakComparisonTable } from "@/components/pricing/TweakComparisonTable";
import { PricingCards } from "@/components/pricing/PricingCards";
import { tweaks } from "@/data/tweaks";

export const metadata = {
  title: "Compare Tweaks – REFLUX TWEAKS",
  description: "Full breakdown of every REFLUX tweak and which plan includes it.",
};

export default function ComparePage() {
  return (
    <SiteShell mainClassName="pt-8 pb-10">
      <section className="mb-12 pt-8">
        <SectionHeader
          eyebrow="Full breakdown"
          title={
            <>
              Every tweak. <span className="gradient-text">Every plan.</span>
            </>
          }
          subtitle={`No guesswork — all ${tweaks.length} tweaks in one searchable table.`}
        />
      </section>

      <TweakComparisonTable />

      <section className="mt-24">
        <SectionHeader
          eyebrow="Upgrade"
          title="Ready to unlock more?"
          subtitle="Pick the plan that fits how you game."
        />
        <PricingCards compact />
      </section>
    </SiteShell>
  );
}
