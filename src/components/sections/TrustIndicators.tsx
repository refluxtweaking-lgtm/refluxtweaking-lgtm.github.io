import { Icon, type IconName } from "@/components/ui/Icon";

const indicators: { icon: IconName; text: string; color: string }[] = [
  { icon: "bolt", text: "Hundreds of tweaks applied", color: "from-reflux-accent/20 to-reflux-accent/5" },
  { icon: "chat", text: "Active Discord community", color: "from-reflux-discord/20 to-reflux-discord/5" },
  { icon: "disk", text: "Safe restore points", color: "from-reflux-green/20 to-reflux-green/5" },
  { icon: "undo", text: "Fully reversible", color: "from-reflux-purple/20 to-reflux-purple/5" },
  { icon: "shield", text: "No malware", color: "from-reflux-accent/20 to-reflux-accent/5" },
  { icon: "sparkle", text: "No background processes", color: "from-reflux-green/20 to-reflux-green/5" },
];

export function TrustIndicators() {
  return (
    <section className="py-10">
      <div className="stagger-children mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {indicators.map((item) => (
          <div
            key={item.text}
            className={`group flex items-center gap-3 rounded-2xl border border-white/5 bg-gradient-to-br ${item.color} p-4 backdrop-blur-sm transition-all duration-300 hover:border-reflux-accent/30 hover:shadow-[0_0_24px_rgba(241,91,80,0.12)]`}
          >
            <span className="icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/25 bg-black/30 backdrop-blur-sm">
              <Icon name={item.icon} size={22} />
            </span>
            <span className="text-sm font-semibold text-[#d8dee8]">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
