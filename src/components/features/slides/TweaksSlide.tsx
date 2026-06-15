import { GlowCard } from "@/components/ui/GlowCard";
import { TweakCardMini } from "../TweakCardMini";
import { SlideHeading } from "./SlideHeading";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const tweaks = [
  {
    title: "Disable Nagle's Algorithm",
    description: "Reduces network latency",
  },
  {
    title: "High Performance Power Plan",
    description: "CPU runs at maximum frequency",
  },
  {
    title: "Disable Core Parking",
    description: "All cores active",
  },
  {
    title: "Flush DNS Cache",
    description: "Instant DNS refresh",
  },
  {
    title: "Disable Fullscreen Optimizations",
    description: "Lower input lag",
  },
];

import type { SlideProps } from "./types";

export function TweaksSlide(_props: SlideProps) {
  return (
    <GlowCard>
      <SlideHeading icon="bolt" title={`${PRODUCT_LIMITS.totalTweaksLabel} Tweaks`} />
      <p className="mb-3 text-sm text-reflux-muted sm:mb-4">
        Pre‑configured optimizations ready to fire.
      </p>
      <div className="space-y-2">
        {tweaks.map((tweak) => (
          <TweakCardMini key={tweak.title} {...tweak} />
        ))}
      </div>
    </GlowCard>
  );
}
