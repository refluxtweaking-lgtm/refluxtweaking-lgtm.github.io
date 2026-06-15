import { REFLUX_FREE_DOWNLOAD, proCheckoutUrl } from "./downloads";
import { PRODUCT_LIMITS } from "./tweaks";

export type PlanId = "free" | "monthly" | "yearly" | "lifetime";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  displayPrice: string;
  suffix: string;
  originalPrice?: string;
  badge?: string;
  highlighted?: boolean;
  popular?: boolean;
  cta: string;
  ctaHref: string;
  /** When set, the CTA triggers a direct file download instead of opening an external app URL. */
  downloadFilename?: string;
  tagline: string;
  highlights: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    displayPrice: "$0",
    suffix: "",
    tagline: "Try the essentials — no card required",
    cta: "Download Free",
    ctaHref: REFLUX_FREE_DOWNLOAD.href,
    downloadFilename: REFLUX_FREE_DOWNLOAD.filename,
    highlights: [
      `${PRODUCT_LIMITS.freeTweaks} core tweaks`,
      "2 power plans",
      "Manual game scanner",
      "Basic network optimizations",
      "Community Discord support",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 6.99,
    displayPrice: "$6.99",
    originalPrice: "$9.99",
    suffix: "/mo",
    badge: "BEST TO START",
    highlighted: true,
    tagline: "Full power, low commitment — cancel anytime",
    cta: "Start Monthly",
    ctaHref: proCheckoutUrl("monthly"),
    highlights: [
      `${PRODUCT_LIMITS.totalTweaksLabel} full tweaks unlocked`,
      "Automatic game scanner",
      "Advanced network & latency pack",
      "Live benchmarks dashboard",
      "System cleanup automation",
      "Priority Discord support",
      "New tweaks added monthly",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 54.99,
    displayPrice: "$54.99",
    originalPrice: "$83.88",
    suffix: "/yr",
    badge: "SAVE 34%",
    tagline: "Pay once a year, save vs monthly",
    cta: "Go Yearly",
    ctaHref: proCheckoutUrl("yearly"),
    highlights: [
      "Everything in Monthly",
      "Save over $28 per year",
      "Early access to new tweaks",
      "Seasonal optimization profiles",
      "VIP support queue",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 89.99,
    displayPrice: "$89.99",
    originalPrice: "$119.99",
    suffix: " once",
    badge: "MOST POPULAR",
    popular: true,
    tagline: "One payment. Every tweak. Forever.",
    cta: "Get Lifetime",
    ctaHref: proCheckoutUrl("lifetime"),
    highlights: [
      "Everything in Yearly",
      "Lifetime updates — no renewals",
      "VIP Discord role & channel",
      "Beta feature access",
      "One-time payment, forever access",
    ],
  },
];

export const planOrder: PlanId[] = ["free", "monthly", "yearly", "lifetime"];

export function planHasTweak(plan: PlanId, availability: Record<PlanId, boolean>): boolean {
  return availability[plan];
}
