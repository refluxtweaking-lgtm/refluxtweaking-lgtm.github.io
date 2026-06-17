import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureSlideshow } from "@/components/features/FeatureSlideshow";

export function Features() {
  return (
    <section id="features" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="What You Get"
        title={
          <>
            Everything in <span className="gradient-text">REFLUX PRO</span>
          </>
        }
        subtitle="Tweaks, game scanner, network tools, cleanup, and benchmarks — explore every screen below."
      />
      <FeatureSlideshow />
    </section>
  );
}
