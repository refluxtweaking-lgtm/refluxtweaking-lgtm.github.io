"use client";

import { useMemo, useState } from "react";
import { PRODUCT_LIMITS, tweaks, tweakCategories, type TweakCategory } from "@/data/tweaks";
import { planOrder, plans } from "@/data/plans";
import { Icon } from "@/components/ui/Icon";

export function TweakComparisonTable() {
  const [filter, setFilter] = useState<TweakCategory | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tweaks.filter((t) => {
      const matchCat = filter === "All" || t.category === filter;
      const matchSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [filter, search]);

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Icon name="search" size={16} glow={false} className="text-reflux-muted" />
          </span>
          <input
            type="search"
            placeholder="Search tweaks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-reflux-border/80 bg-[#0a0c10]/90 py-3.5 pr-4 pl-11 text-sm text-white placeholder:text-reflux-muted focus:border-reflux-accent/50 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={filter === "All"} onClick={() => setFilter("All")}>
            Highlights ({tweaks.length})
          </FilterPill>
          {tweakCategories.map((cat) => (
            <FilterPill
              key={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-reflux-border/60 glass-card-static">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-reflux-border bg-gradient-to-r from-reflux-card to-[#0a0c10]">
                <th className="sticky left-0 z-10 bg-reflux-card px-5 py-4 font-bold text-white">
                  Tweak
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className={`px-4 py-4 text-center font-bold ${
                      plan.highlighted
                        ? "text-reflux-discord"
                        : plan.popular
                          ? "text-reflux-accent"
                          : "text-reflux-muted"
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tweak, i) => (
                <tr
                  key={tweak.id}
                  className={`border-b border-reflux-border/30 transition-colors hover:bg-reflux-accent/5 ${
                    i % 2 === 0 ? "" : "bg-white/[0.015]"
                  }`}
                >
                  <td className="sticky left-0 z-10 bg-[#0c0e12] px-5 py-4">
                    <div className="font-semibold text-white">{tweak.name}</div>
                    <div className="mt-0.5 text-xs text-reflux-muted">{tweak.description}</div>
                    <span className="mt-2 inline-block rounded-md border border-reflux-border/50 bg-reflux-card/60 px-2 py-0.5 text-[10px] font-medium text-reflux-muted">
                      {tweak.category}
                    </span>
                  </td>
                  {planOrder.map((planId) => (
                    <td key={planId} className="px-4 py-4 text-center">
                      <PlanCell included={tweak.plans[planId]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-reflux-muted">No tweaks match your search.</p>
      )}

      <p className="mt-6 text-center text-sm text-reflux-muted">
        REFLUX PRO includes {PRODUCT_LIMITS.proTweaks} total optimizations. This table highlights the
        most popular ones — the full library lives in the desktop app.
      </p>
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-reflux-accent to-[#c43d35] text-white shadow-[0_0_16px_rgba(241,91,80,0.35)]"
          : "border border-reflux-border/60 bg-reflux-card/40 text-reflux-muted hover:border-reflux-accent/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function PlanCell({ included }: { included: boolean }) {
  return included ? (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-reflux-green/15 ring-1 ring-reflux-green/30">
      <Icon name="check" size={16} strokeWidth={2.6} className="text-reflux-green" glow={false} />
    </span>
  ) : (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-reflux-border/20 text-reflux-muted/50">
      —
    </span>
  );
}
