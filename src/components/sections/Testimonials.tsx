import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonials = [
  {
    quote:
      "ngl i wasnt expecting much but my frames shot up. went from like 240 avg to almost 290. been telling my whole squad to get it",
    author: "jayden",
    game: "Fortnite",
    rating: 5,
  },
  {
    quote:
      "applied everything in like 5 mins and my ping dropped 12ms. i can actually feel it in gunfights now, way snappier",
    author: "marcus",
    game: "Valorant",
    rating: 4.8,
  },
  {
    quote:
      "finally a tweaker that doesnt install 50 sketchy background services lol. super clean and i can undo anything. happy customer fr",
    author: "devon r.",
    game: "Apex Legends",
    rating: 4.9,
  },
  {
    quote:
      "the stutters are basically gone. didnt think software could fix it but here we are. honestly money well spent",
    author: "tyler",
    game: "Warzone",
    rating: 5,
  },
  {
    quote:
      "my 1% lows got so much better, no more random drops mid round. wish i found this sooner tbh",
    author: "kai",
    game: "CS2",
    rating: 4.7,
  },
  {
    quote:
      "ran it on my kinda potato laptop and it still made a real difference. dead simple to use and didnt break a single thing",
    author: "noah",
    game: "Rocket League",
    rating: 5,
  },
];

const STAR_PATH =
  "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.8 6.7 19.4l1.2-6L3.4 9.3l6-.7z";

function Star({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span
              key={i}
              className="relative inline-block"
              style={{ width: size, height: size }}
            >
              <Star size={size} className="absolute inset-0 text-reflux-accent/20" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={size} className="text-reflux-accent" />
              </span>
            </span>
          );
        })}
      </span>
      <span className="text-xs font-bold text-reflux-accent">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

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
              <StarRating rating={t.rating} />
              <span className="badge-pill badge-accent text-[10px]">{t.game}</span>
            </div>
            <p className="mb-6 leading-relaxed text-[#c8d0dc]">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-auto flex items-center gap-3 border-t border-reflux-border/50 pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-reflux-accent to-[#c43d35] text-xs font-bold text-white">
                {t.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-reflux-muted">{t.author}</span>
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
