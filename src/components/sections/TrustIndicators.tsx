import { Icon, type IconName } from "@/components/ui/Icon";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const indicators: {
  icon: IconName;
  text: string;
  sub: string;
  color: string;
  span?: string;
}[] = [
  {
    icon: "bolt",
    text: `${PRODUCT_LIMITS.freeTweaks} free tweaks`,
    sub: "No card required",
    color: "from-reflux-accent/25 via-reflux-accent/8 to-transparent",
    span: "md:col-span-2",
  },
  {
    icon: "chat",
    text: "Active Discord",
    sub: "Live support & updates",
    color: "from-reflux-discord/25 via-reflux-discord/8 to-transparent",
  },
  {
    icon: "disk",
    text: "Restore points",
    sub: "Before every change",
    color: "from-reflux-green/25 via-reflux-green/8 to-transparent",
  },
  {
    icon: "undo",
    text: "Fully reversible",
    sub: "Undo any tweak",
    color: "from-reflux-purple/25 via-reflux-purple/8 to-transparent",
  },
  {
    icon: "shield",
    text: "No malware",
    sub: "Open & transparent",
    color: "from-reflux-accent/20 via-transparent to-transparent",
  },
  {
    icon: "sparkle",
    text: "Zero bloat",
    sub: "No background services",
    color: "from-reflux-green/20 via-transparent to-transparent",
    span: "md:col-span-2",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 md:py-16">
      <div className="stagger-children mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {indicators.map((item) => (
          <div
            key={item.text}
            className={`trust-bento-card group rounded-3xl border border-white/8 bg-gradient-to-br ${item.color} p-5 backdrop-blur-md transition-all duration-300 hover:border-reflux-accent/35 hover:shadow-[0_0_40px_rgba(241,91,80,0.14)] ${item.span ?? ""}`}
          >
            <div className="relative flex h-full flex-col gap-4 sm:flex-row sm:items-center">
              <span className="icon-chip flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-reflux-accent/25 bg-black/40 backdrop-blur-sm">
                <Icon name={item.icon} size={26} className="icon-glow-strong" />
              </span>
              <div>
                <div className="text-base font-bold text-white">{item.text}</div>
                <div className="mt-1 text-sm text-reflux-muted">{item.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
