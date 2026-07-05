import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";

export function CTA() {
  return (
    <section className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <GlowCard className="relative mx-auto max-w-3xl text-center" hover={false}>
        <span className="section-eyebrow mb-5 inline-flex">
          <Icon name="rocket" size={14} />
          One action left
        </span>
        <h2 className="section-title mb-3">
          Still on the fence? <span className="gradient-text-static">Try it free.</span>
        </h2>
        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-reflux-muted">
          {PRODUCT_LIMITS.freeTweaks} real tweaks, full desktop app, no card. If it doesn&apos;t feel faster, delete it. Restore points mean you&apos;re never stuck.
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["Free download", "No subscription", "Discord help"].map((t) => (
            <span key={t} className="badge-pill badge-live text-[11px]">
              <Icon name="check" size={12} strokeWidth={2.5} />
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            variant="primary"
            large
            showIcon
          >
            Get REFLUX FREE
          </Button>
          <Button href="https://discord.gg/refluxtweaks" variant="discord" external large>
            Join Discord
          </Button>
        </div>
      </GlowCard>
    </section>
  );
}
