import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon, type IconName } from "@/components/ui/Icon";

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
    description: "Toggle what you want, or apply all 100+ optimizations with one click.",
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
    <section id="how-it-works" className="py-20">
      <SectionHeader
        eyebrow="How It Works"
        title={
          <>
            Three steps. <span className="gradient-text">Massive gains.</span>
          </>
        }
        subtitle="No registry diving. No YouTube rabbit holes. Just results."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <GlowCard key={step.title} className="relative text-center">
            <span className="absolute top-6 right-6 text-4xl font-black text-reflux-accent/15">
              {step.step}
            </span>
            {i < steps.length - 1 && (
              <div className="absolute top-1/2 -right-3 hidden h-0.5 w-6 bg-gradient-to-r from-reflux-accent/50 to-transparent md:block" />
            )}
            <span
              className={`icon-chip mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-reflux-accent/25 bg-gradient-to-br from-reflux-accent/15 to-transparent ${step.pulse ? "pulse-anim" : ""}`}
            >
              <Icon name={step.icon} size={30} className="icon-glow-strong" />
            </span>
            <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-reflux-muted">{step.description}</p>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
