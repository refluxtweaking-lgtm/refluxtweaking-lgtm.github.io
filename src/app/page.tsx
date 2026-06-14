import { SiteShell } from "@/components/layout/SiteShell";
import { DesktopPowerBleed } from "@/components/effects/DesktopPowerBleed";
import { Hero } from "@/components/sections/Hero";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { Features } from "@/components/sections/Features";
import { RealResults } from "@/components/sections/RealResults";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <SiteShell>
      <DesktopPowerBleed />
      <Hero />
      <TrustIndicators />
      <Features />
      <RealResults />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </SiteShell>
  );
}
