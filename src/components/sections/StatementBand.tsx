import { FlowIn } from "@/components/ui/FlowIn";

const bigStats = [
  { value: "+20-100", unit: "FPS", note: "common gains, low to high end" },
  { value: "-30", unit: "ms ping", note: "zen**** on Fortnite" },
  { value: "240", unit: "FPS stable", note: "after the auto profile" },
];

export function StatementBand() {
  return (
    <section className="statement-band" aria-label="REFLUX in numbers">
      <FlowIn>
        <p className="statement-band-kicker">The whole pitch in five words</p>
        <h2 className="statement-band-title">
          <span className="statement-band-solid">Open.</span>
          <span className="statement-band-outline">Already optimized.</span>
        </h2>
      </FlowIn>
      <FlowIn delay={120}>
        <div className="statement-band-stats">
          {bigStats.map((stat, i) => (
            <div key={stat.unit} className="statement-band-stat">
              {i > 0 ? <span className="statement-band-divider" aria-hidden="true" /> : null}
              <div>
                <div className="statement-band-value">
                  {stat.value}
                  <span className="statement-band-unit">{stat.unit}</span>
                </div>
                <div className="statement-band-note">{stat.note}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="statement-band-caption">Numbers pulled from real Discord vouches, not lab benchmarks.</p>
      </FlowIn>
    </section>
  );
}
