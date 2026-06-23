export type ReviewTone = "professional" | "casual";

export type Review = {
  id: string;
  quote: string;
  author: string;
  game: string;
  rating: number;
  tone: ReviewTone;
};

export const REVIEWS_PAGE_SIZE = 6;

export const reviews: Review[] = [
  {
    id: "r1",
    quote:
      "I was skeptical at first, but the network tweaks alone dropped my ping by roughly nine milliseconds. Setup took under ten minutes.",
    author: "Marcus L.",
    game: "Valorant",
    rating: 4.8,
    tone: "professional",
  },
  {
    id: "r2",
    quote: "tweaked my pc good asff",
    author: "***",
    game: "Fortnite",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r3",
    quote:
      "Clear explanations for every toggle, and the restore point ran before anything changed. That alone sold me on Pro.",
    author: "***",
    game: "Apex Legends",
    rating: 4.9,
    tone: "professional",
  },
  {
    id: "r4",
    quote: "way more fps now",
    author: "***",
    game: "Warzone",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r5",
    quote:
      "My one-percent lows improved noticeably after the CPU and power plan changes. I still use Windows restore before big batches, just in case.",
    author: "D*** R.",
    game: "CS2",
    rating: 4.7,
    tone: "professional",
  },
  {
    id: "r6",
    quote: "actually works lol",
    author: "j***",
    game: "Rocket League",
    rating: 4.9,
    tone: "casual",
  },
  {
    id: "r7",
    quote:
      "Finally a tweaker that does not install sketchy background services. Everything is reversible, and the hardware detection matched my rig on the first launch.",
    author: "Noah K.",
    game: "Apex Legends",
    rating: 5,
    tone: "professional",
  },
  {
    id: "r8",
    quote: "ping feels way snappier tbh",
    author: "***",
    game: "Valorant",
    rating: 4.6,
    tone: "casual",
  },
  {
    id: "r9",
    quote:
      "The game scanner found my Steam library instantly, and the per-title optimize button is exactly what I wanted. Worth it for the time saved alone.",
    author: "E***",
    game: "Cyberpunk 2077",
    rating: 4.8,
    tone: "professional",
  },
  {
    id: "r10",
    quote: "ez clap runs smooth now",
    author: "***",
    game: "Fortnite",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r11",
    quote:
      "Stuttering in open-world games dropped a lot after the GPU scheduling tweaks. Not magic, but a solid improvement on my laptop.",
    author: "***",
    game: "Elden Ring",
    rating: 4.5,
    tone: "professional",
  },
  {
    id: "r12",
    quote: "bro my fps jumped like crazy",
    author: "t***",
    game: "Warzone",
    rating: 4.9,
    tone: "casual",
  },
  {
    id: "r13",
    quote:
      "I like that Free is a real desktop app, not a watered-down demo. Upgraded after a week because the optimizer recommendations matched my CPU and GPU.",
    author: "Kai M.",
    game: "CS2",
    rating: 4.7,
    tone: "professional",
  },
  {
    id: "r14",
    quote: "clean app no weird stuff",
    author: "***",
    game: "Minecraft",
    rating: 4.8,
    tone: "casual",
  },
  {
    id: "r15",
    quote:
      "Debloat section is aggressive, so I stuck to the performance tabs. Results were still strong, and I appreciated the warnings on experimental tweaks.",
    author: "***",
    game: "Rainbow Six Siege",
    rating: 4.6,
    tone: "professional",
  },
  {
    id: "r16",
    quote: "lowkey fixed my stutters",
    author: "***",
    game: "Apex Legends",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r17",
    quote:
      "Support on Discord answered a license question within an hour. The installer was straightforward, and my lifetime key activated on the first try.",
    author: "S*** P.",
    game: "Valorant",
    rating: 5,
    tone: "professional",
  },
  {
    id: "r18",
    quote: "10/10 would tweak again",
    author: "***",
    game: "Fortnite",
    rating: 5,
    tone: "casual",
  },
];

export function reviewAuthorInitial(author: string): string {
  const trimmed = author.trim();
  if (!trimmed || trimmed === "***" || /^[*]+$/.test(trimmed)) return "*";
  const letter = trimmed.replace(/[^a-zA-Z]/g, "").charAt(0);
  return letter ? letter.toUpperCase() : "*";
}
