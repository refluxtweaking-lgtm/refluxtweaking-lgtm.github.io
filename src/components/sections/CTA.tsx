import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

export function CTA() {
  return (
    <section className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <div className="cta-bare mx-auto max-w-3xl text-center">
        <span className="section-eyebrow mb-5 inline-flex">
          <Icon name="rocket" size={14} />
          Ready when you are
        </span>
        <h2 className="section-title mb-3">
          Stop clicking Apply. <span className="gradient-text-static">Open REFLUX instead.</span>
        </h2>
        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-reflux-muted">
          FREE builds a lighter auto profile and cleans files. PRO goes deeper. Both warn before Recycle Bin
          wipe. Make a restore point, then restart after Extreme Process Killer.
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] font-semibold tracking-wide text-reflux-text-soft uppercase">
          {["Free download", "Auto on open", "Discord help"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
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
            className="btn-angular"
          >
            Get REFLUX FREE
          </Button>
          <Button href="https://discord.gg/refluxtweaks" variant="discord" external large className="btn-angular">
            Join Discord
          </Button>
        </div>
      </div>
    </section>
  );
}
