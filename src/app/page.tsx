import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { TrustIndicators } from "@/components/sections/TrustIndicators";
import { AppGallery } from "@/components/sections/AppGallery";
import { Features } from "@/components/sections/Features";
import { VsExmTweaks } from "@/components/sections/VsExmTweaks";
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
      <TrustIndicators />
      <AppGallery />
      <Features />
      <VsExmTweaks />
      <RealResults />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </SiteShell>
  );
}
