import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const results = [
  {
    label: "Fortnite FPS",
    before: 280,
    after: 332,
    unit: "FPS",
    delta: "+52 FPS",
    color: "text-reflux-accent",
    bar: "from-reflux-accent to-reflux-accent-light",
    width: "82%",
  },
  {
    label: "Input Latency",
    before: 21,
    after: 15,
    unit: "ms",
    delta: "-6 ms",
    color: "text-reflux-green",
    bar: "from-reflux-green/80 to-reflux-green",
    width: "71%",
  },
  {
    label: "1% Lows",
    before: 170,
    after: 220,
    unit: "FPS",
    delta: "+50 FPS",
    color: "text-reflux-purple",
    bar: "from-reflux-purple/80 to-reflux-purple",
    width: "78%",
  },
];

export function RealResults() {
  return (
    <section id="results" className="section-glow-wrap py-20 md:py-24">
      <SectionHeader
        eyebrow="Real Results"
        title={
          <>
            Measured gains. <span className="gradient-text">Not simulated.</span>
          </>
        }
        subtitle="Benchmarked on a real test rig — the same kind of uplift REFLUX users report."
      />

      <GlowCard className="mx-auto max-w-5xl overflow-hidden" hover={false}>
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-reflux-border/60 bg-gradient-to-r from-[#0c0e12] via-reflux-card/50 to-transparent p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-reflux-muted uppercase">Test System</p>
            <p className="text-sm text-reflux-muted">Same hardware, before & after REFLUX Pro</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["RTX 4070", "Ryzen 7 7800X3D", "32GB DDR5"].map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-reflux-accent/30 bg-reflux-accent/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(241,91,80,0.1)]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="grid w-full gap-5 lg:grid-cols-3">
          {results.map((r, i) => (
            <div
              key={r.label}
              className="group relative overflow-hidden rounded-2xl border border-reflux-border/80 bg-[#080a0d] p-6 transition-all hover:border-reflux-accent/40 hover:shadow-[0_0_32px_rgba(241,91,80,0.1)]"
            >
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-reflux-accent/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <p className="relative mb-5 text-sm font-bold tracking-wide text-reflux-muted uppercase">{r.label}</p>

              <div className="relative mb-6 flex items-end justify-center gap-6">
                <div className="text-center">
                  <div className="mb-2 text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Before</div>
                  <div className="flex h-28 w-16 items-end justify-center rounded-t-xl border border-reflux-border/60 bg-reflux-border/20">
                    <div
                      className="w-full rounded-t-lg bg-reflux-border/80"
                      style={{ height: `${(r.before / r.after) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#5a6578] line-through">
                    {r.before} {r.unit}
                  </div>
                </div>

                <div className="pb-6 text-2xl font-black text-reflux-accent/60">→</div>

                <div className="text-center">
                  <div className="mb-2 text-[10px] font-bold tracking-wider text-reflux-accent uppercase">After</div>
                  <div className="flex h-28 w-16 items-end justify-center rounded-t-xl border border-reflux-accent/30 bg-reflux-accent/5 shadow-[0_0_24px_rgba(241,91,80,0.15)]">
                    <div
                      className={`w-full rounded-t-lg bg-gradient-to-t ${r.bar} shadow-[0_0_16px_rgba(241,91,80,0.35)]`}
                      style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
                    />
                  </div>
                  <div className={`mt-2 text-lg font-extrabold tabular-nums ${r.color}`}>
                    {r.after} <span className="text-xs font-semibold text-reflux-muted">{r.unit}</span>
                  </div>
                </div>
              </div>

              <p className={`relative text-center text-sm font-bold ${r.color}`}>{r.delta}</p>
              <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-reflux-border">
                <div
                  className={`result-bar-fill h-full rounded-full bg-gradient-to-r ${r.bar}`}
                  style={{ width: r.width, animationDelay: `${0.2 + i * 0.12}s` }}
                />
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
