import { NetworkProofSection } from "@/components/sections/NetworkProofSection";
import { AppShowcaseStrip } from "@/components/sections/AppShowcaseStrip";
import { ProSpotlight } from "@/components/sections/ProSpotlight";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { AppGallery } from "@/components/sections/AppGallery";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { WhyReflux } from "@/components/sections/WhyReflux";
import { RealResults } from "@/components/sections/RealResults";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <ScrollReveal>
        <NetworkProofSection />
      </ScrollReveal>
      <ScrollReveal>
        <AppShowcaseStrip />
      </ScrollReveal>
      <ScrollReveal>
        <ProSpotlight />
      </ScrollReveal>
      <ScrollReveal>
        <AppGallery />
      </ScrollReveal>
      <ScrollReveal>
        <TrustIndicators />
      </ScrollReveal>
      <ScrollReveal>
        <WhyReflux />
      </ScrollReveal>
      <ScrollReveal>
        <RealResults />
      </ScrollReveal>
      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal>
        <Pricing />
      </ScrollReveal>
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
      <ScrollReveal>
        <CTA />
      </ScrollReveal>
    </SiteShell>
  );
}
