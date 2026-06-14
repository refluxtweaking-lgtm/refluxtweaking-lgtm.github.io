import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";

const testimonials = [
  {
    quote:
      "Fortnite feels noticeably smoother. Went from 240 FPS average to around 290.",
    author: "Discord User",
    game: "Fortnite",
    stars: 5,
  },
  {
    quote:
      "Applied everything in under 5 minutes. Ping dropped 12ms in Valorant — I actually felt it.",
    author: "Monthly Member",
    game: "Valorant",
    stars: 5,
  },
  {
    quote:
      "Finally a tweaker that doesn't install 50 background services. Clean, fast, reversible.",
    author: "Lifetime Member",
    game: "Apex Legends",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <SectionHeader
        eyebrow="Social Proof"
        title={
          <>
            Gamers <span className="gradient-text">feel the difference</span>
          </>
        }
        subtitle="Real feedback from our Discord community."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <GlowCard key={t.quote} className="relative text-left">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Icon key={i} name="star" size={16} className="fill-reflux-accent/30" />
                ))}
              </span>
              <span className="badge-pill badge-accent text-[10px]">{t.game}</span>
            </div>
            <p className="mb-6 text-[#c8d0dc] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-auto flex items-center gap-3 border-t border-reflux-border/50 pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-reflux-accent to-[#c43d35] text-xs font-bold text-white">
                {t.author.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-reflux-muted">— {t.author}</span>
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
