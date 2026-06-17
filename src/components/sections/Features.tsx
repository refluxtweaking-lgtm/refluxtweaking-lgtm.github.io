import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureSlideshow } from "@/components/features/FeatureSlideshow";

export function Features() {
  return (
    <section id="features" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="What am I actually getting?"
        title={
          <>
            Everything in <span className="gradient-text">REFLUX PRO</span>
          </>
        }
        subtitle="Not a vague feature list — every screen in the app, from live detection to game scanner to one-click optimizers."
      />
      <FeatureSlideshow />
    </section>
  );
}
