import { SectionHeader } from "@/components/ui/SectionHeader";
import { FlowIn } from "@/components/ui/FlowIn";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { StepVisual } from "./how-it-works/StepVisual";

const steps = [
  {
    step: "01" as const,
    title: "Download",
    description: "Get the app, run as Administrator. No weird setup.",
  },
  {
    step: "02" as const,
    title: "Pick your tweaks",
    description: `Toggle what you want, or apply all ${PRODUCT_LIMITS.totalTweaksLabel} with one click.`,
  },
  {
    step: "03" as const,
    title: "Load in and play",
    description: "Jump into Fortnite — or any title — and feel smoother frames and snappier ping.",
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
