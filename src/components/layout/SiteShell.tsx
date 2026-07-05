import { BackgroundImage } from "./BackgroundImage";
import { AmbientBackground } from "./AmbientBackground";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PurchasePopups } from "@/components/ui/PurchasePopups";
import { ScrollRevealBoot } from "@/components/ui/ScrollRevealBoot";
import { ScrollSweepLines } from "@/components/ui/ScrollSweepLines";

interface SiteShellProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export function SiteShell({ children, mainClassName = "" }: SiteShellProps) {
  return (
    <>
      <ScrollRevealBoot />
      <ScrollSweepLines />
      <BackgroundImage />
      <AmbientBackground />
      <Header />
      <main className={`relative z-1 mx-auto w-full max-w-[min(100%,1800px)] px-4 pb-8 sm:px-6 md:px-8 lg:px-10 md:pb-12 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
      <PurchasePopups />
    </>
  );
}
