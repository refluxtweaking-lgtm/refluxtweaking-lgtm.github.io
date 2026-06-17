import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";

export function CTA() {
  return (
    <section className="section-flow section-band">
      <div className="section-flow-divider" aria-hidden="true" />
      <GlowCard className="cta-flow-card relative mx-auto max-w-4xl overflow-hidden text-center !p-0" hover={false}>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,91,0.15),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-reflux-calm/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative px-6 py-12 sm:px-10 sm:py-14">
          <span className="section-eyebrow mb-6 inline-flex">
            <Icon name="rocket" size={14} />
            Ready when you are
          </span>
          <h2 className="section-title mb-4">
            Your best games are <span className="gradient-text">one download away</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-reflux-muted md:text-lg">
            Free gets you {PRODUCT_LIMITS.freeTweaks} tweaks. Pro unlocks {PRODUCT_LIMITS.totalTweaksLabel} when you want the full setup.
          </p>

          <div className="mb-9 flex flex-wrap justify-center gap-3">
            {["Free download", "No subscription", "Discord help"].map((t) => (
              <span key={t} className="badge-pill badge-live text-[11px]">
                <Icon name="check" size={12} strokeWidth={2.5} />
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              href={REFLUX_FREE_DOWNLOAD.href}
              download={REFLUX_FREE_DOWNLOAD.filename}
              variant="primary"
              large
              showIcon
            >
              Get REFLUX FREE
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
