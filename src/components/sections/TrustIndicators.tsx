import { Icon, type IconName } from "@/components/ui/Icon";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const indicators: {
  icon: IconName;
  text: string;
  sub: string;
  color: string;
}[] = [
  {
    icon: "bolt",
    text: `${PRODUCT_LIMITS.freeTweaks} free tweaks`,
    sub: "No card required",
    color: "from-reflux-accent/20 via-reflux-accent/6 to-transparent",
  },
  {
    icon: "chat",
    text: "Active Discord",
    sub: "Live support & updates",
    color: "from-reflux-discord/20 via-reflux-discord/6 to-transparent",
  },
  {
    icon: "disk",
    text: "Restore points",
    sub: "Before every change",
    color: "from-reflux-green/20 via-reflux-green/6 to-transparent",
  },
  {
    icon: "undo",
    text: "Fully reversible",
    sub: "Undo any tweak",
    color: "from-reflux-purple/20 via-reflux-purple/6 to-transparent",
  },
  {
    icon: "shield",
    text: "No malware",
    sub: "Open & transparent",
    color: "from-reflux-accent/15 via-transparent to-transparent",
  },
  {
    icon: "sparkle",
    text: "Zero bloat",
    sub: "No background services",
    color: "from-reflux-green/15 via-transparent to-transparent",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 md:py-16">
      <div className="stagger-children mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((item) => (
          <div
            key={item.text}
            className={`trust-bento-card group flex items-center gap-4 rounded-2xl border border-white/8 bg-gradient-to-br ${item.color} p-4 backdrop-blur-md transition-all duration-300 hover:border-reflux-accent/30 hover:shadow-[0_0_32px_rgba(241,91,80,0.1)] sm:p-5`}
          >
            <span className="icon-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-reflux-accent/25 bg-black/40 backdrop-blur-sm">
              <Icon name={item.icon} size={22} className="icon-glow-strong" />
            </span>
            <div className="min-w-0">
              <div className="font-bold text-white">{item.text}</div>
              <div className="mt-0.5 text-sm text-reflux-muted">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
