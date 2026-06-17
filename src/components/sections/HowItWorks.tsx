import { AppIconChip } from "@/components/ui/AppIcon";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FlowIn } from "@/components/ui/FlowIn";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import type { AppIconName } from "@/data/app-icons";

const steps: {
  icon: AppIconName;
  step: string;
  title: string;
  description: string;
}[] = [
  {
    icon: "rocket",
    step: "01",
    title: "Download",
    description: "Get the app, run as admin. That's it — no weird setup.",
  },
  {
    icon: "optimizer",
    step: "02",
    title: "Pick your tweaks",
    description: `Toggle what you want, or apply all ${PRODUCT_LIMITS.totalTweaksLabel} with one click.`,
  },
  {
    icon: "games",
    step: "03",
    title: "Queue up & play",
    description: "Jump into your game and feel smoother frames and snappier inputs.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Too complicated?"
        title={
          <>
            Three steps. <span className="gradient-text">Better games.</span>
          </>
        }
        subtitle="No registry rabbit holes. Download, toggle, queue up — the app handles the scary parts."
      />

      <div className="flow-steps grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <FlowIn key={step.title} delay={index * 100}>
            <GlowCard className="relative h-full overflow-hidden text-center" hover={false}>
            <span className="absolute top-4 right-4 text-4xl font-black text-white/[0.04]">{step.step}</span>

            <AppIconChip name={step.icon} size={24} chipSize={64} className="relative mx-auto mb-4" />

            <div className="relative mb-2 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold tracking-widest text-reflux-muted uppercase">
              Step {step.step}
            </div>
            <h3 className="relative mb-2 text-lg font-bold">{step.title}</h3>
            <p className="relative text-sm leading-relaxed text-reflux-muted">{step.description}</p>
            </GlowCard>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
