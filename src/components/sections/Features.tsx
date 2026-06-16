import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureSlideshow } from "@/components/features/FeatureSlideshow";

export function Features() {
  return (
    <section id="features" className="section-glow-wrap py-14 md:py-20">
      <SectionHeader
        eyebrow="What You Get"
        title={
          <>
            Everything in <span className="gradient-text">REFLUX PRO</span>
          </>
        }
        subtitle="Tweaks, game scanner, network tools, cleanup, and benchmarks — same app, same power."
      />
      <FeatureSlideshow />
    </section>
  );
}
