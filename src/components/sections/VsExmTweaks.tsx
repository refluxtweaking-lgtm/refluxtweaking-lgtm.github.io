import { FlowIn } from "@/components/ui/FlowIn";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import {
  EXM_COMPETITOR,
  comparisonRows,
  refluxAdvantages,
} from "@/data/competitor-comparison";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

function WinnerBadge({ winner }: { winner?: "reflux" | "exm" | "tie" }) {
  if (winner === "reflux") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-reflux-green/10 px-2 py-0.5 text-[10px] font-bold text-reflux-green">
        <Icon name="check" size={10} />
        REFLUX
      </span>
    );
  }
  if (winner === "tie") {
    return <span className="text-[10px] font-semibold text-reflux-muted">Both</span>;
  }
  return null;
}

export function VsExmTweaks() {
  return (
    <section id="why-reflux" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Why REFLUX"
        title={
          <>
            Better than <span className="gradient-text">{EXM_COMPETITOR.name}</span>?
          </>
        }
        subtitle="More tweaks, smarter hardware matching, zero background bloat — and a free tier you can actually use."
      />

      <div className="mx-auto mb-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {refluxAdvantages.map((item, i) => (
          <FlowIn key={item.title} delay={i * 60}>
            <GlowCard className="h-full p-5">
              <span className="icon-chip mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-reflux-accent/25 bg-reflux-accent/10">
                <Icon name={item.icon} size={20} glow />
              </span>
              <h3 className="mb-2 text-base font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-reflux-muted">{item.body}</p>
            </GlowCard>
          </FlowIn>
        ))}
      </div>

      <FlowIn delay={100}>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-reflux-accent/20 bg-[#0a0c10]/90 shadow-[0_0_50px_rgba(241,91,80,0.08)]">
          <div className="border-b border-reflux-border/60 bg-gradient-to-r from-reflux-accent/10 to-transparent px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold tracking-wider text-reflux-accent uppercase">Head-to-head</div>
                <h3 className="text-lg font-extrabold text-white sm:text-xl">REFLUX vs {EXM_COMPETITOR.name}</h3>
              </div>
              <WinnerBadge winner="reflux" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="vs-exm-table w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-reflux-border/50 text-[11px] font-bold tracking-wider text-reflux-muted uppercase">
                  <th className="px-5 py-3.5 sm:px-6">Feature</th>
                  <th className="px-5 py-3.5 text-reflux-accent sm:px-6">REFLUX</th>
                  <th className="px-5 py-3.5 sm:px-6">{EXM_COMPETITOR.name}</th>
                  <th className="hidden px-5 py-3.5 sm:table-cell sm:px-6">Edge</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-reflux-border/30 transition-colors hover:bg-white/[0.02] ${
                      row.highlight ? "bg-reflux-accent/[0.04]" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-semibold text-white sm:px-6">{row.feature}</td>
                    <td className="px-5 py-4 text-[#dce3ee] sm:px-6">{row.reflux}</td>
                    <td className="px-5 py-4 text-reflux-muted sm:px-6">{row.exm}</td>
                    <td className="hidden px-5 py-4 sm:table-cell sm:px-6">
                      <WinnerBadge winner={row.winner} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FlowIn>

      <FlowIn delay={140} className="mt-10 text-center">
        <p className="mx-auto mb-5 max-w-xl text-sm text-reflux-muted">
          Stop paying for generic tweak lists. Download REFLUX free, see your hardware detected live, and upgrade only when you want the full {comparisonRows[1]?.reflux?.split(" ")[0] ?? "129"}-tweak arsenal.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            variant="primary"
            large
            showIcon
          >
            Download Free
          </Button>
          <Button href="#pricing" variant="secondary" large>
            Compare plans
          </Button>
        </div>
      </FlowIn>
    </section>
  );
}
