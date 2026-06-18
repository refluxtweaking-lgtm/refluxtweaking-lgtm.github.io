import { FlowIn } from "@/components/ui/FlowIn";
import { GlowCard } from "@/components/ui/GlowCard";
import { AppIcon } from "@/components/ui/AppIcon";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { refluxAdvantages, refluxFeatures } from "@/data/reflux-highlights";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import type { AppIconName } from "@/data/app-icons";

const advantageIcons: Record<string, AppIconName> = {
  search: "cpu",
  download: "home",
  shield: "shield",
  sparkle: "optimizer",
};

export function WhyReflux() {
  return (
    <section id="why-reflux" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Still deciding?"
        title={
          <>
            Four doubts. <span className="gradient-text">Four shutdowns.</span>
          </>
        }
        subtitle="We designed REFLUX around the questions people actually ask before installing a PC tweaker."
      />

      <div className="mx-auto mb-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {refluxAdvantages.map((item, i) => (
          <FlowIn key={item.title} delay={i * 60}>
            <GlowCard className="h-full p-5 transition-transform hover:-translate-y-0.5">
              <span className="mb-2 inline-block rounded-full reflux-glow-readable px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-reflux-accent uppercase">
                {item.objection}
              </span>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-reflux-accent/25 bg-reflux-accent/10">
                <AppIcon name={advantageIcons[item.icon] ?? "bolt"} size={20} />
              </span>
              <h3 className="mb-2 text-base font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-reflux-muted">{item.body}</p>
            </GlowCard>
          </FlowIn>
        ))}
      </div>

      <FlowIn delay={100}>
        <div className="reflux-glow-box mx-auto max-w-4xl overflow-hidden rounded-2xl">
          <div className="px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold tracking-wider text-reflux-accent uppercase">What you get</div>
                <h3 className="text-lg font-extrabold text-white sm:text-xl">Everything in REFLUX</h3>
              </div>
              <span className="reflux-glow-readable inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-reflux-green">
                <Icon name="check" size={12} />
                {PRODUCT_LIMITS.totalTweaksLabel} pro tweaks
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="reflux-features-table w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-reflux-border/50 text-[11px] font-bold tracking-wider text-reflux-muted uppercase">
                  <th className="px-5 py-3.5 sm:px-6">Feature</th>
                  <th className="px-5 py-3.5 text-reflux-accent sm:px-6">REFLUX</th>
                </tr>
              </thead>
              <tbody>
                {refluxFeatures.map((row) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-reflux-border/30 transition-colors hover:bg-white/[0.02] ${
                      row.highlight ? "bg-reflux-accent/[0.04]" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-semibold text-white sm:px-6">{row.feature}</td>
                    <td className="px-5 py-4 text-[#dce3ee] sm:px-6">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FlowIn>

      <FlowIn delay={140} className="mt-10 text-center">
        <p className="mx-auto mb-5 max-w-xl text-sm text-reflux-muted">
          Download REFLUX free, see your hardware detected live, and upgrade only when you want the full {PRODUCT_LIMITS.totalTweaksLabel} tweak arsenal.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            variant="primary"
            large
            showIcon
          >
            Download Free
          </Button>
          <Button href="#pricing" variant="secondary" large>
            View pricing
          </Button>
        </div>
      </FlowIn>
    </section>
  );
}
