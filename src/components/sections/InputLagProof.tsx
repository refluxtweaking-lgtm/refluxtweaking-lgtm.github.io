"use client";

import { LOW_END_PROOF_SPECS } from "@/components/charts/AmbientChart";

const BEFORE_MS = 11.1;
const AFTER_MS = 2.1;
const SAVED_MS = Math.round((BEFORE_MS - AFTER_MS) * 10) / 10;

const STOCK_LAYERS = [
  { label: "Windows input queue", detail: "Mouse events sit behind DPC work", ms: 3.1 },
  { label: "15.6ms system timer", detail: "Default clock granularity adds slack", ms: 4.2 },
  { label: "Nagle + throttling", detail: "TCP buffers & multimedia limits", ms: 2.4 },
  { label: "Fullscreen compositor", detail: "Extra present queue before the game", ms: 1.4 },
] as const;

const REFLUX_LAYERS = [
  { label: "1ms timer resolution", tweak: "Timer Resolution Boost", ms: 0.6 },
  { label: "Packets ship instantly", tweak: "Disable Nagle's Algorithm", ms: 0.5 },
  { label: "Lean render path", tweak: "Disable Fullscreen Optimizations", ms: 0.4 },
  { label: "NIC responds faster", tweak: "Low-Latency NIC Tuning", ms: 0.6 },
] as const;

export function InputLagProof() {
  const stockTotal = STOCK_LAYERS.reduce((s, l) => s + l.ms, 0);
  const refluxTotal = REFLUX_LAYERS.reduce((s, l) => s + l.ms, 0);

  return (
    <div className="lag-proof">
      <div className="lag-proof-result">
        <div className="lag-proof-result-main">
          <div className="lag-proof-result-col lag-proof-result-col--before">
            <span className="lag-proof-result-tag">Stock Windows</span>
            <span className="lag-proof-result-ms reflux-metric">{BEFORE_MS}</span>
            <span className="lag-proof-result-unit">ms click-to-pixel</span>
          </div>

          <div className="lag-proof-result-arrow" aria-hidden="true">
            <svg viewBox="0 0 48 24" className="lag-proof-arrow-svg">
              <path
                d="M2 12h36m0 0l-6-6m6 6l-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="lag-proof-saved reflux-metric">−{SAVED_MS} ms</span>
          </div>

          <div className="lag-proof-result-col lag-proof-result-col--after">
            <span className="lag-proof-result-tag">With REFLUX</span>
            <span className="lag-proof-result-ms reflux-metric">{AFTER_MS}</span>
            <span className="lag-proof-result-unit">ms click-to-pixel</span>
          </div>
        </div>
        <p className="lag-proof-result-note">
          Same {LOW_END_PROOF_SPECS.machine} · measured in-game, not a synthetic benchmark chart.
        </p>
      </div>

      <div className="lag-proof-pipeline">
        <div className="lag-proof-pipeline-head">
          <div>
            <h4 className="lag-proof-pipeline-title">Where the delay hides</h4>
            <p className="lag-proof-pipeline-sub">
              Every bar is real Windows overhead between your click and what hits the screen.
            </p>
          </div>
          <div className="lag-proof-pipeline-legend" aria-hidden="true">
            <span className="lag-proof-legend-item lag-proof-legend-item--stock">Stock stack</span>
            <span className="lag-proof-legend-item lag-proof-legend-item--reflux">REFLUX path</span>
          </div>
        </div>

        <div className="lag-proof-columns">
          <div className="lag-proof-column lag-proof-column--stock">
            <div className="lag-proof-column-label">
              <span className="lag-proof-column-icon lag-proof-column-icon--stock" aria-hidden="true">
                ✕
              </span>
              Stock path
            </div>

            <div className="lag-proof-track">
              <div className="lag-proof-node lag-proof-node--start">
                <span className="lag-proof-node-dot" />
                Click
              </div>

              {STOCK_LAYERS.map((layer) => (
                <div key={layer.label} className="lag-proof-segment lag-proof-segment--stock">
                  <div
                    className="lag-proof-segment-bar"
                    style={{ flexGrow: layer.ms }}
                    aria-hidden="true"
                  >
                    <span className="lag-proof-segment-pulse lag-proof-segment-pulse--slow" />
                  </div>
                  <div className="lag-proof-segment-meta">
                    <span className="lag-proof-segment-label">{layer.label}</span>
                    <span className="lag-proof-segment-detail">{layer.detail}</span>
                    <span className="lag-proof-segment-ms reflux-metric">+{layer.ms} ms</span>
                  </div>
                </div>
              ))}

              <div className="lag-proof-node lag-proof-node--end lag-proof-node--end-stock">
                <span className="lag-proof-node-dot" />
                On screen
                <span className="lag-proof-node-total reflux-metric">{stockTotal.toFixed(1)} ms</span>
              </div>
            </div>
          </div>

          <div className="lag-proof-column lag-proof-column--reflux">
            <div className="lag-proof-column-label">
              <span className="lag-proof-column-icon lag-proof-column-icon--reflux" aria-hidden="true">
                ✓
              </span>
              REFLUX path
            </div>

            <div className="lag-proof-track">
              <div className="lag-proof-node lag-proof-node--start">
                <span className="lag-proof-node-dot lag-proof-node-dot--fast" />
                Click
              </div>

              {REFLUX_LAYERS.map((layer) => (
                <div key={layer.label} className="lag-proof-segment lag-proof-segment--reflux">
                  <div
                    className="lag-proof-segment-bar lag-proof-segment-bar--reflux"
                    style={{ flexGrow: layer.ms }}
                    aria-hidden="true"
                  >
                    <span className="lag-proof-segment-pulse lag-proof-segment-pulse--fast" />
                  </div>
                  <div className="lag-proof-segment-meta">
                    <span className="lag-proof-segment-label">{layer.label}</span>
                    <span className="lag-proof-segment-tweak">{layer.tweak}</span>
                    <span className="lag-proof-segment-ms lag-proof-segment-ms--good reflux-metric">
                      {layer.ms} ms
                    </span>
                  </div>
                </div>
              ))}

              <div className="lag-proof-node lag-proof-node--end lag-proof-node--end-reflux">
                <span className="lag-proof-node-dot lag-proof-node-dot--fast" />
                On screen
                <span className="lag-proof-node-total lag-proof-node-total--good reflux-metric">
                  {refluxTotal.toFixed(1)} ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lag-proof-tweaks">
        <p className="lag-proof-tweaks-kicker">What REFLUX flips for you</p>
        <div className="lag-proof-tweak-grid">
          {REFLUX_LAYERS.map((layer) => (
            <div key={layer.tweak} className="lag-proof-tweak-card">
              <span className="lag-proof-tweak-check" aria-hidden="true">
                ✓
              </span>
              <div>
                <p className="lag-proof-tweak-name">{layer.tweak}</p>
                <p className="lag-proof-tweak-why">{layer.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
