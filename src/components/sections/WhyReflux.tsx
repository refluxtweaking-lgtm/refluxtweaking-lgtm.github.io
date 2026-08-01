import { FlowIn } from "@/components/ui/FlowIn";
import { AppIcon } from "@/components/ui/AppIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import type { AppIconName } from "@/data/app-icons";

const reasons: {
  title: string;
  body: string;
  icon: AppIconName;
}[] = [
  {
    title: "Auto profile on open",
    body: "Competitors make you click Apply on a pile of tweaks. REFLUX builds a custom profile for your CPU and GPU and applies it when you launch.",
    icon: "bolt",
  },
  {
    title: "Cheapest that still hits hard",
    body: "FREE is a real desktop app with a lighter auto profile and file cleanup. PRO unlocks the full stack without forcing a fake premium wall for basics.",
    icon: "optimizer",
  },
  {
    title: "Extreme Process Killer",
    body: "Clears background junk hard. Keeps Microsoft Edge. Warns you it empties Recycle Bin too. Make a restore point, run it, restart for the cleanest result.",
    icon: "processkiller",
  },
  {
    title: "Full suite, not a tiny stub",
    body: "A lot of tools ship at 10 to 50 MB. REFLUX is about 75 MB because the desktop suite, hardware profiles, and safety tools are packed in.",
    icon: "rocket",
  },
];

export function WhyReflux() {
  return (
    <section id="why-reflux" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Why REFLUX wins"
        title={
          <>
            Not another toggle farm. <span className="headline-accent">Yours builds itself.</span>
          </>
        }
        subtitle="We beat the pink, green, and purple tweaker sites by doing the work on open, not by making you babysit every switch."
      />

      <div className="why-win-grid mx-auto mb-12 max-w-5xl">
        {reasons.map((item, i) => (
          <FlowIn key={item.title} delay={i * 70}>
            <article className="why-win-row">
              <span className="why-win-icon" aria-hidden="true">
                <AppIcon name={item.icon} size={22} />
              </span>
              <div>
                <h3 className="why-win-title">{item.title}</h3>
                <p className="why-win-body">{item.body}</p>
              </div>
            </article>
          </FlowIn>
        ))}
      </div>

      <FlowIn delay={100}>
        <div className="versus-wrap mx-auto mb-14 max-w-4xl">
          <table className="versus-table w-full text-left">
            <thead>
              <tr>
                <th className="versus-th versus-th--label" scope="col"></th>
                <th className="versus-th versus-th--us" scope="col">REFLUX</th>
                <th className="versus-th versus-th--them" scope="col">Typical tweaker</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Applying tweaks", "Automatic on open", "You click Apply, forever"],
                ["Tuned to hardware", "Custom CPU + GPU profile", "Same preset for everyone"],
                ["Free version", "Real desktop app", "Demo or locked trial"],
                ["Price", "$0 free · $6.99/mo PRO", "$20-40 one-off packs"],
                ["Safety", "Restore point built in, reversible", "Hope for the best"],
                ["Deep cleanup", "Extreme Process Killer, keeps Edge", "Kills random things you need"],
              ].map(([label, us, them]) => (
                <tr key={label} className="versus-row">
                  <th className="versus-label" scope="row">{label}</th>
                  <td className="versus-us">{us}</td>
                  <td className="versus-them">{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FlowIn>

      <FlowIn delay={120}>
        <div className="why-story mx-auto max-w-3xl text-center">
          <p className="why-story-kicker">sno**** on a laptop</p>
          <p className="why-story-line">
            Went from about <strong>30 FPS</strong> to <strong>75 average</strong>, with a high of{" "}
            <strong>120 FPS</strong>. FREE version. That is the difference between fighting Windows and
            letting REFLUX tune it.
          </p>
          <p className="why-story-note">
            Across low end to high end PCs, players commonly report roughly <strong>20 to 100 FPS</strong>{" "}
            added depending on the rig and game.
          </p>
        </div>
      </FlowIn>

      <FlowIn delay={160} className="mt-10 text-center">
        <p className="mx-auto mb-5 max-w-xl text-sm text-reflux-muted">
          Create a restore point first. Extreme cleanup clears Recycle Bin on FREE and PRO. Restart after
          for the best return.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            href={REFLUX_FREE_DOWNLOAD.href}
            download={REFLUX_FREE_DOWNLOAD.filename}
            variant="primary"
            large
            showIcon
            className="btn-angular"
          >
            Download FREE
          </Button>
          <Button href="/pricing" variant="secondary" large className="btn-angular">
            See PRO pricing
          </Button>
        </div>
      </FlowIn>
    </section>
  );
}
