import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const steps: {
  icon: IconName;
  step: string;
  title: string;
  description: string;
  pulse: boolean;
}[] = [
  {
    icon: "download",
    step: "01",
    title: "Download & Run",
    description: "Grab the installer, launch as Administrator. No complex setup.",
    pulse: false,
  },
  {
    icon: "sliders",
    step: "02",
    title: "Choose Tweaks",
    description: `Toggle what you want, or apply all ${PRODUCT_LIMITS.proTweaks} optimizations with one click.`,
    pulse: true,
  },
  {
    icon: "gamepad",
    step: "03",
    title: "Dominate",
    description: "Lower input lag, higher FPS — feel the difference in your next match.",
    pulse: false,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <SectionHeader
        eyebrow="How It Works"
        title={
          <>
            Three steps. <span className="gradient-text">Massive gains.</span>
          </>
        }
        subtitle="No registry diving. No YouTube rabbit holes. Just results."
      />

      <div className="relative">
        <div className="timeline-connector absolute top-[4.5rem] right-[16%] left-[16%] hidden h-px md:block" aria-hidden="true" />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <GlowCard key={step.title} className="relative overflow-hidden text-center">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-reflux-accent/10 to-transparent" />
              <span className="absolute top-5 right-5 text-5xl font-black text-reflux-accent/10">{step.step}</span>

              <span
                className={`icon-chip relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-reflux-accent/30 bg-gradient-to-br from-reflux-accent/20 to-transparent shadow-[0_0_30px_rgba(241,91,80,0.15)] ${step.pulse ? "pulse-anim" : ""}`}
              >
                <Icon name={step.icon} size={34} className="icon-glow-strong" />
              </span>

              <div className="relative mb-2 inline-flex rounded-full border border-reflux-accent/25 bg-reflux-accent/10 px-3 py-1 text-[10px] font-bold tracking-widest text-reflux-accent uppercase">
                Step {step.step}
              </div>
              <h3 className="relative mb-3 text-xl font-bold">{step.title}</h3>
              <p className="relative text-sm leading-relaxed text-reflux-muted">{step.description}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
