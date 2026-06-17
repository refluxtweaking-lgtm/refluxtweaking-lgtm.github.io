import { Button } from "@/components/ui/Button";
import { FlowIn } from "@/components/ui/FlowIn";
import { AmbientFpsGraph } from "@/components/charts/AmbientChart";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

export function FpsProofSection() {
  return (
    <section id="fps-proof" className="proof-section fps-proof-section relative overflow-hidden py-16 md:py-24">
      <div className="proof-section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4">
        <FlowIn className="relative z-10 mb-8 max-w-xl md:mb-12">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Boost your FPS.
            <br />
            <span className="gradient-text">Eliminate stutters.</span>
          </h2>
          <p className="mb-6 text-base leading-relaxed text-reflux-muted md:text-lg">
            Stabilize frame times and keep performance consistent mid-fight — not just on the menu screen.
          </p>
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            variant="secondary"
            large
            showIcon
          >
            Download for free
          </Button>
        </FlowIn>

        <FlowIn delay={120} className="relative">
          <AmbientFpsGraph active className="min-h-[180px] md:min-h-[260px] lg:min-h-[320px]" />
        </FlowIn>
      </div>
    </section>
  );
}
