import { AppIconChip } from "@/components/ui/AppIcon";
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
    description: "Get the app, run as Administrator. No weird setup.",
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
    title: "Load in and play",
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
            Three steps. <span className="headline-accent">Better games.</span>
          </>
        }
        subtitle="No registry rabbit holes. Download, toggle, launch your game. The app handles the scary parts."
      />

      <div className="flow-steps grid gap-8 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => (
          <FlowIn key={step.title} delay={index * 100}>
            <div className="relative h-full px-2 text-center md:px-4">
            <span className="absolute top-0 right-2 text-4xl font-black text-white/[0.04] md:right-4">{step.step}</span>

            <AppIconChip name={step.icon} size={24} chipSize={64} className="relative mx-auto mb-4" />

            <h3 className="relative mb-2 text-lg font-bold text-white">{step.title}</h3>
            <p className="relative text-sm leading-relaxed text-reflux-muted">{step.description}</p>
            </div>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
