import { BackgroundImage } from "./BackgroundImage";
import { AmbientBackground } from "./AmbientBackground";
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
      <Header />
      <main className={`relative z-1 mx-auto max-w-7xl px-5 pb-8 md:pb-12 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
      <PurchasePopups />
    </>
  );
}
