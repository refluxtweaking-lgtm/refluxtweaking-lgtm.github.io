import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureSlideshow } from "@/components/features/FeatureSlideshow";

export function Features() {
  return (
    <section id="features" className="section-glow-wrap py-16 md:py-24">
      <SectionHeader
        eyebrow="What You Get"
        title={
          <>
            Everything in <span className="gradient-text">REFLUX PRO</span>
          </>
        }
        subtitle="Tweaks, game scanner, network tools, cleanup, and live benchmarks — the same power as the desktop app."
      />
      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(241,91,80,0.08),transparent_70%)]" aria-hidden="true" />
        <FeatureSlideshow />
      </div>
    </section>
  );
}
