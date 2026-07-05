import { Icon } from "@/components/ui/Icon";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const proUnlocks = [
  {
    icon: "bolt" as const,
    title: `${PRODUCT_LIMITS.totalTweaksLabel} full tweaks`,
    detail: "Everything that fixed FPS dips and background bloat",
  },
  {
    icon: "globe" as const,
    title: "Advanced network pack",
    detail: "TCP tuning + latency profiles — how ping went from 158–773 ms to 30–38",
  },
  {
    icon: "gamepad" as const,
    title: "Per-game optimizer",
    detail: "Fortnite, Apex, Valorant & more — auto-detected on launch",
  },
  {
    icon: "shield" as const,
    title: "Restore anytime",
    detail: "Backup before every batch. One click to revert.",
  },
];

export function PricingValueStack() {
  return (
    <section className="pricing-value-stack" aria-label="Why PRO is worth it">
      <div className="pricing-value-stack-inner">
        {proUnlocks.map((item) => (
          <div key={item.title} className="pricing-value-card">
            <span className="pricing-value-icon" aria-hidden="true">
              <Icon name={item.icon} size={20} strokeWidth={2.2} glow />
            </span>
            <div>
              <h3 className="pricing-value-title">{item.title}</h3>
              <p className="pricing-value-detail">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
