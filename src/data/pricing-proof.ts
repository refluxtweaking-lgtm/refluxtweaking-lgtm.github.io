/** Founder rig — real Fortnite session, medium graphics, in-game readout. */
export const PRICING_PROOF = {
  game: "Fortnite",
  settings: "Medium graphics",
  hardware: {
    machine: "Gaming laptop",
    cpu: "AMD Ryzen 5 7235HS",
    gpu: "NVIDIA GeForce RTX 4050 Laptop",
    ram: "12 GB DDR5",
  },
  context:
    "Same session on my daily-driver laptop — Ryzen 5 7235HS, RTX 4050, 12 GB DDR5. In-game FPS & ping overlay, medium graphics.",
  meshNote: "Ping spikes to ~70 ms occasionally on mesh Wi‑Fi — still a fraction of stock Windows.",
  fps: {
    before: { low: 109, high: 118, label: "109–118", note: "Unstable, dipping in fights" },
    after: { low: 135, high: 144, label: "135–144", note: "Stable frame time" },
    gainLabel: "+26 FPS",
    gainDetail: "Higher floor, no more sub-110 dips",
  },
  ping: {
    before: { low: 158, high: 773, label: "158–773", note: "Wild spikes, unplayable lag" },
    after: { low: 30, high: 38, label: "30–38", note: "Consistent in-game" },
    spikeNote: "Occasional ~70 ms on mesh",
    gainLabel: "−90%+",
    gainDetail: "Network pack + TCP tuning",
  },
} as const;

/** Static chart series for pricing proof visuals (not live-generated). */
export const PRICING_PROOF_FPS_BEFORE = [
  118, 112, 109, 115, 110, 118, 109, 114, 111, 117, 109, 113, 110, 118, 109, 115, 112, 109, 116, 110,
];
export const PRICING_PROOF_FPS_AFTER = [
  138, 141, 135, 143, 137, 144, 136, 142, 139, 144, 135, 141, 138, 143, 136, 144, 137, 140, 135, 142,
];
export const PRICING_PROOF_PING_BEFORE = [
  158, 420, 210, 773, 320, 185, 540, 158, 610, 290, 773, 195, 480, 158, 350, 620, 158, 410, 773, 240,
];
export const PRICING_PROOF_PING_AFTER = [
  32, 35, 30, 38, 33, 36, 31, 70, 34, 30, 37, 32, 68, 35, 30, 38, 33, 31, 36, 34,
];
