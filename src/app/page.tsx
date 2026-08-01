import { NetworkProofSection } from "@/components/sections/NetworkProofSection";
import { StatementBand } from "@/components/sections/StatementBand";
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
      <ScrollReveal sectionLabel="THE PITCH">
        <StatementBand />
      </ScrollReveal>
      <ScrollReveal sectionLabel="FPS PROOF">
        <NetworkProofSection />
      </ScrollReveal>
      <ScrollReveal sectionLabel="FREE APP">
        <AppShowcaseStrip />
      </ScrollReveal>
      <ScrollReveal sectionLabel="PRO">
        <ProSpotlight />
      </ScrollReveal>
      <ScrollReveal sectionLabel="GALLERY">
        <AppGallery />
      </ScrollReveal>
      <ScrollReveal sectionLabel="TRUST">
        <TrustIndicators />
      </ScrollReveal>
      <ScrollReveal sectionLabel="WHY REFLUX">
        <WhyReflux />
      </ScrollReveal>
      <ScrollReveal sectionLabel="RESULTS">
        <RealResults />
      </ScrollReveal>
      <ScrollReveal sectionLabel="SETUP">
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal sectionLabel="REVIEWS">
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal sectionLabel="PRICING">
        <Pricing />
      </ScrollReveal>
      <ScrollReveal sectionLabel="FAQ">
        <FAQ />
      </ScrollReveal>
      <ScrollReveal sectionLabel="DOWNLOAD">
        <CTA />
      </ScrollReveal>
    </SiteShell>
  );
}
