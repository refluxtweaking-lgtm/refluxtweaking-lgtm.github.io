import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

export function Hero() {
  return (
    <section className="relative px-2 py-20 text-center md:py-28 lg:py-32">
      <div className="animate-fade-in-up">
        <span className="section-eyebrow mb-6 inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
          30 Free Tweaks · 100+ Pro
        </span>
      </div>

      <h1 className="animate-fade-in-up mb-6 text-4xl leading-[1.1] font-extrabold tracking-tight md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
        More FPS. Lower Latency.
        <br />
        <span className="gradient-text">Maximum Performance.</span>
      </h1>

      <p className="animate-fade-in-up mx-auto mb-6 max-w-2xl text-lg text-reflux-muted md:text-xl" style={{ animationDelay: "0.2s" }}>
        Skip the thousands of useless tweaks. REFLUX delivers 100+ carefully selected gaming
        optimizations that actually matter. Start free with 30 tweaks and unlock the complete toolkit
        with Pro.
      </p>

      <div className="animate-fade-in-up mb-12 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.25s" }}>
        {["Restore points", "Fully reversible", "No background processes"].map((t) => (
          <span key={t} className="badge-pill badge-accent inline-flex items-center gap-1.5 text-[11px]">
            <Icon name="check" size={13} strokeWidth={2.4} /> {t}
          </span>
        ))}
      </div>

      <div className="animate-fade-in-up flex flex-wrap justify-center gap-4" style={{ animationDelay: "0.3s" }}>
        <Button
          href={REFLUX_FREE_DOWNLOAD.href}
          download={REFLUX_FREE_DOWNLOAD.filename}
          variant="primary"
          large
          showIcon
        >
          Get REFLUX — Free to Try
        </Button>
        <Button href="https://discord.gg/xGpHKY8AAC" variant="discord" external large>
          Join Discord
        </Button>
      </div>

      <div className="animate-fade-in-up mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4" style={{ animationDelay: "0.4s" }}>
        {[
          { val: "30", label: "Free Tweaks" },
          { val: "100+", label: "Pro Tweaks" },
          { val: "5 min", label: "Setup" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card-static rounded-2xl px-4 py-5">
            <div className="text-2xl font-extrabold gradient-text md:text-3xl">{stat.val}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-reflux-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
