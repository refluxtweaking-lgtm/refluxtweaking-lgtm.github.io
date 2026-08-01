import { SectionHeader } from "@/components/ui/SectionHeader";
import { FlowIn } from "@/components/ui/FlowIn";
import { StepVisual } from "./how-it-works/StepVisual";

const steps = [
  {
    step: "01" as const,
    title: "Download",
    description: "Get FREE or PRO. Run as Administrator. Make a restore point before heavy cleanup.",
  },
  {
    step: "02" as const,
    title: "Open the app",
    description:
      "REFLUX detects your hardware and builds a custom profile automatically. FREE is a lighter cleanup profile. PRO goes deeper.",
  },
  {
    step: "03" as const,
    title: "Play",
    description:
      "Jump into Fortnite, Roblox, Valorant, whatever you grind. Restart after Extreme Process Killer for the cleanest feel.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="How it works"
        title={
          <>
            Open it. <span className="headline-accent">Already optimized.</span>
          </>
        }
        subtitle="No toggle scavenger hunt. Your profile applies on launch. That is how we beat the other tweakers."
      />

      <div className="flow-steps flow-steps--visual grid gap-8 md:grid-cols-3 md:gap-5 lg:gap-6">
        {steps.map((step, index) => (
          <FlowIn key={step.title} delay={index * 100}>
            <article className="hiw-step-card">
              <div className="hiw-step-visual-wrap">
                <span className="hiw-step-index" aria-hidden="true">
                  {step.step}
                </span>
                <StepVisual step={step.step} />
              </div>
              <div className="hiw-step-copy">
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
              </div>
            </article>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
