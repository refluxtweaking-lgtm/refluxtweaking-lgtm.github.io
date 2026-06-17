import { LiveStatsStrip } from "@/components/sections/LiveStatsStrip";
import { FpsProofSection } from "@/components/sections/FpsProofSection";
import { NetworkProofSection } from "@/components/sections/NetworkProofSection";
import { AppShowcaseStrip } from "@/components/sections/AppShowcaseStrip";
import { ProSpotlight } from "@/components/sections/ProSpotlight";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { AppModules } from "@/components/sections/AppModules";
import { AppGallery } from "@/components/sections/AppGallery";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { Features } from "@/components/sections/Features";
import { WhyReflux } from "@/components/sections/WhyReflux";
import { RealResults } from "@/components/sections/RealResults";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <LiveStatsStrip />
      <FpsProofSection />
      <NetworkProofSection />
      <AppShowcaseStrip />
      <ProSpotlight />
      <AppModules />
      <AppGallery />
      <TrustIndicators />
      <Features />
      <WhyReflux />
      <RealResults />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </SiteShell>
  );
}
