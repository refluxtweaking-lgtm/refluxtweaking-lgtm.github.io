import { BackgroundImage } from "./BackgroundImage";
import { AmbientBackground } from "./AmbientBackground";
import { ParticlesCanvas } from "./ParticlesCanvas";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PurchasePopups } from "@/components/ui/PurchasePopups";

interface SiteShellProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export function SiteShell({ children, mainClassName = "" }: SiteShellProps) {
  return (
    <>
      <BackgroundImage />
      <AmbientBackground />
      <ParticlesCanvas />
      <Header />
      <main className={`relative z-1 mx-auto max-w-[1200px] px-5 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
      <PurchasePopups />
    </>
  );
}
