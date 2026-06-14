import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/sections/CTA";
import { Icon, type IconName } from "@/components/ui/Icon";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

export const metadata = {
  title: "The App – REFLUX TWEAKS",
  description: "See the REFLUX TWEAKS Windows app — tweaks, scanner, network, cleanup, benchmarks.",
};

const features: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "bolt",
    title: "One-click tweak batches",
    desc: "Toggle individual optimizations or apply all 130+ at once. Restore points created automatically.",
  },
  {
    icon: "gamepad",
    title: "Game scanner",
    desc: "Detects Fortnite, Apex, Cyberpunk, and more across Steam, Epic, and Ubisoft.",
  },
  {
    icon: "globe",
    title: "Network dashboard",
    desc: "Live latency readout with before/after comparison.",
  },
  {
    icon: "broom",
    title: "Disk cleanup",
    desc: "Automated Windows cleanup — temp files, shader cache, update junk.",
  },
  {
    icon: "chart",
    title: "Live benchmarks",
    desc: "GPU FPS, CPU load, and free RAM updating in real time.",
  },
  {
    icon: "blackhole",
    title: "Process killer",
    desc: "Black hole mode — crush background resource hogs before you queue.",
  },
];

export default function AppPreviewPage() {
  return (
    <SiteShell mainClassName="pt-8 pb-10">
      <section className="mb-12 pt-8 text-center">
        <SectionHeader
          eyebrow="Windows Desktop App"
          title={
            <>
              Meet <span className="gradient-text">REFLUX PRO</span>
            </>
          }
          subtitle="The actual app your tweaks run in — built for gamers who want results, not 1000 settings to dig through."
        />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            large
            showIcon
          >
            Download REFLUX
          </Button>
          <Button href="/compare" variant="ghost" large>
            Compare plans
          </Button>
        </div>
      </section>

      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-reflux-accent/20 via-transparent to-reflux-discord/20 blur-2xl"
          aria-hidden="true"
        />
        <AppPreviewMock />
      </div>

      <section className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass-card group rounded-2xl p-6 transition-all hover:border-reflux-accent/30"
          >
            <span className="icon-chip mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-reflux-accent/25 bg-gradient-to-br from-reflux-accent/20 to-transparent transition-transform group-hover:scale-110">
              <Icon name={f.icon} size={24} />
            </span>
            <h3 className="font-bold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-reflux-muted">{f.desc}</p>
          </div>
        ))}
      </section>

      <CTA />
    </SiteShell>
  );
}
