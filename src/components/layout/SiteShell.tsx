import { BackgroundImage } from "./BackgroundImage";
import { AmbientBackground } from "./AmbientBackground";
import { NoiseTexture } from "./NoiseTexture";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PurchasePopups } from "@/components/ui/PurchasePopups";
import { ScrollRevealBoot } from "@/components/ui/ScrollRevealBoot";

interface SiteShellProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export function SiteShell({ children, mainClassName = "" }: SiteShellProps) {
  return (
    <>
      <ScrollRevealBoot />
      <BackgroundImage />
      <AmbientBackground />
      <NoiseTexture />
      <Header />
      <main className={`relative z-1 mx-auto w-full max-w-[1600px] px-5 pb-8 sm:px-8 md:px-10 lg:px-12 md:pb-12 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
      <PurchasePopups />
    </>
  );
}
