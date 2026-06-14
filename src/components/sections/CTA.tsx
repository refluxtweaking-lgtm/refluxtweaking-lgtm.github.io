import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

export function CTA() {
  return (
    <section className="py-20">
      <GlowCard className="relative mx-auto max-w-3xl overflow-hidden text-center" hover={false}>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-reflux-accent/10 via-transparent to-reflux-discord/10"
          aria-hidden="true"
        />
        <div className="relative">
          <span className="section-eyebrow mb-6 inline-flex">Ready?</span>
          <h2 className="section-title mb-4">
            Take control of your <span className="gradient-text">rig</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-reflux-muted">
            Join hundreds of gamers who trust REFLUX TWEAKS. Download free, upgrade when you&apos;re hooked.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              href={REFLUX_FREE_DOWNLOAD.href}
              download={REFLUX_FREE_DOWNLOAD.filename}
              variant="primary"
              large
              showIcon
            >
              Get REFLUX TWEAKS
            </Button>
            <Button href="https://discord.gg/xGpHKY8AAC" variant="discord" external large>
              Join Discord
            </Button>
          </div>
        </div>
      </GlowCard>
    </section>
  );
}
