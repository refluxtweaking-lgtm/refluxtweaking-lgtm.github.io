import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { VouchMarquee } from "./VouchMarquee";

export function Testimonials() {
  return (
    <section className="section-flow vouch-section">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Discord vouches"
        title={
          <>
            Real players. <span className="headline-accent">Real FPS.</span>
          </>
        }
        subtitle="Names shortened. Quotes scroll left to right. Low end to high end, people report about 20 to 100 FPS added."
      />
      <VouchMarquee />
      <p className="mt-10 text-center">
        <Link
          href="/reviews"
          className="reflux-glow-interactive inline-flex items-center gap-2 px-2 py-2 text-sm font-semibold text-reflux-accent hover:text-white"
        >
          See all reviews
          <Icon name="arrowRight" size={16} strokeWidth={2.2} glow={false} />
        </Link>
      </p>
    </section>
  );
}
