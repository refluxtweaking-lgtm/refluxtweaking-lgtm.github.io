"use client";

import { discordVouches } from "@/data/vouches";

/**
 * Infinite horizontal vouch rail: enters from the left, exits right.
 * No cards, no pills. Red underline accent only.
 */
export function VouchMarquee() {
  const loop = [...discordVouches, ...discordVouches, ...discordVouches];

  return (
    <div className="vouch-marquee" aria-label="Discord vouches">
      <div className="vouch-marquee-fade vouch-marquee-fade--left" aria-hidden="true" />
      <div className="vouch-marquee-fade vouch-marquee-fade--right" aria-hidden="true" />
      <div className="vouch-marquee-track">
        {loop.map((vouch, index) => (
          <figure key={`${vouch.id}-${index}`} className="vouch-item">
            <figcaption className="vouch-author">
              <span className="vouch-name">{vouch.author}</span>
              <span className="vouch-product">{vouch.product}</span>
            </figcaption>
            <blockquote className="vouch-quote">{vouch.quote}</blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}
