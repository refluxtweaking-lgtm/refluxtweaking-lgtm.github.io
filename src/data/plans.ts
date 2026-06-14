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
    ctaHref: "https://app.refluxtweaks.com?plan=free",
    highlights: [
      "30 core tweaks",
      "Manual game scanner",
      "Basic network optimizations",
      "Community Discord support",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 4.99,
    displayPrice: "$4.99",
    originalPrice: "$7.99",
    suffix: "/mo",
    badge: "BEST TO START",
    highlighted: true,
    tagline: "Full power, low commitment — cancel anytime",
    cta: "Start Monthly",
    ctaHref: "https://app.refluxtweaks.com?plan=monthly",
    highlights: [
      "100+ full tweaks unlocked",
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
    price: 44.99,
    displayPrice: "$44.99",
    originalPrice: "$59.88",
    suffix: "/yr",
    badge: "SAVE 25%",
    tagline: "Pay once a year, save vs monthly",
    cta: "Go Yearly",
    ctaHref: "https://app.refluxtweaks.com?plan=yearly",
    highlights: [
      "Everything in Monthly",
      "Save over $15 per year",
      "Early access to new tweaks",
      "Seasonal optimization profiles",
      "VIP support queue",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 74.99,
    displayPrice: "$74.99",
    originalPrice: "$99.99",
    suffix: " once",
    badge: "MOST POPULAR",
    popular: true,
    tagline: "One payment. Every tweak. Forever.",
    cta: "Get Lifetime",
    ctaHref: "https://app.refluxtweaks.com?plan=lifetime",
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
