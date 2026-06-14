import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const results = [
  {
    label: "Fortnite FPS",
    before: "280",
    after: "332",
    unit: "FPS",
    delta: "+52 FPS",
    color: "text-reflux-accent",
    bar: "from-reflux-accent to-reflux-accent-light",
  },
  {
    label: "Input Latency",
    before: "21",
    after: "15",
    unit: "ms",
    delta: "-6 ms",
    color: "text-reflux-green",
    bar: "from-reflux-green/80 to-reflux-green",
  },
  {
    label: "1% Lows",
    before: "170",
    after: "220",
    unit: "FPS",
    delta: "+50 FPS",
    color: "text-reflux-purple",
    bar: "from-reflux-purple/80 to-reflux-purple",
  },
];

export function RealResults() {
  return (
    <section id="results" className="py-20">
      <SectionHeader
        eyebrow="Real Results"
        title={
          <>
            Measured gains. <span className="gradient-text">Not simulated.</span>
          </>
        }
        subtitle="Benchmarked on a real test rig — the same kind of uplift REFLUX users report."
      />

      <GlowCard className="mx-auto max-w-4xl" hover={false}>
        <div className="mb-8 w-full rounded-2xl border border-reflux-border/80 bg-gradient-to-r from-reflux-card/80 to-transparent p-6 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-reflux-muted uppercase">
            Test System
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {["RTX 4070", "Ryzen 7 7800X3D", "32GB DDR5"].map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-reflux-accent/25 bg-reflux-accent/10 px-5 py-2 text-sm font-semibold text-white"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-3">
          {results.map((r) => (
            <div
              key={r.label}
              className="group relative overflow-hidden rounded-2xl border border-reflux-border bg-[#080a0d] p-6 text-center transition-all hover:border-reflux-accent/40"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-reflux-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative mb-4 text-sm font-semibold text-reflux-muted">{r.label}</p>
              <div className="relative mb-1 text-lg text-[#4a5568] line-through">
                {r.before} {r.unit}
              </div>
              <div className={`relative text-4xl font-extrabold tabular-nums ${r.color}`}>
                {r.after}
                <span className="ml-1 text-lg font-semibold text-reflux-muted">{r.unit}</span>
              </div>
              <p className={`relative mt-2 text-sm font-bold ${r.color}`}>{r.delta}</p>
              <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-reflux-border">
                <div className={`h-full rounded-full bg-gradient-to-r ${r.bar} w-4/5`} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-reflux-muted">
          Results vary by hardware. REFLUX creates a restore point before every change.
        </p>
      </GlowCard>
    </section>
  );
}
