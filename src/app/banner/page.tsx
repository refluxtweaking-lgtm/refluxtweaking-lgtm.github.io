import Image from "next/image";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { REFLUX_BRAND_BANNER } from "@/data/downloads";

export const metadata = {
  title: "Download Banner – REFLUX TWEAKS",
  description: "Download the official REFLUX TWEAKS channel banner (2048×1152) for YouTube and social media.",
};

export default function BannerPage() {
  return (
    <SiteShell mainClassName="pt-8 pb-10">
      <SectionHeader
        eyebrow="Brand assets"
        title="Official REFLUX Banner"
        subtitle="2048 × 1152 pixels · ~1 MB · Perfect for YouTube channel art, Twitter/X headers, and Discord."
      />

      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-reflux-border bg-reflux-card/60 shadow-[0_0_40px_rgba(241,91,80,0.08)]">
          <Image
            src={REFLUX_BRAND_BANNER.href}
            alt="REFLUX TWEAKS official banner"
            width={REFLUX_BRAND_BANNER.width}
            height={REFLUX_BRAND_BANNER.height}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            href={REFLUX_BRAND_BANNER.downloadHref}
            download={REFLUX_BRAND_BANNER.filename}
            variant="primary"
            large
            showIcon
          >
            Download Banner
          </Button>
          <Button href={REFLUX_BRAND_BANNER.href} variant="secondary" large external>
            Open Full Image
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-reflux-muted">
          File: <span className="text-reflux-text">{REFLUX_BRAND_BANNER.filename}</span>
        </p>
      </div>
    </SiteShell>
  );
}
