import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { PRODUCT_LIMITS } from "@/data/tweaks";

export function CTA() {
  return (
    <section className="py-20 md:py-24">
      <GlowCard className="relative mx-auto max-w-4xl overflow-hidden text-center" hover={false}>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(241,91,80,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(88,101,242,0.12),transparent_50%)]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
          <div className="grid-overlay h-full w-full" style={{ maskImage: "none" }} />
        </div>

        <div className="relative px-2 py-4 sm:px-6">
          <span className="section-eyebrow mb-6 inline-flex">
            <Icon name="rocket" size={14} />
            Ready to optimize?
          </span>
          <h2 className="section-title mb-4">
            Your rig is <span className="gradient-text">one click away</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-lg text-reflux-muted">
            Download free with {PRODUCT_LIMITS.freeTweaks} tweaks. Upgrade to Pro when you want the full {PRODUCT_LIMITS.proTweaks}-tweak arsenal.
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {["Free download", "No subscription required", "Discord support"].map((t) => (
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
