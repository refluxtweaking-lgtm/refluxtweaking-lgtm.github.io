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
    quote: "W good fps now",
    author: "Marcus L.",
    game: "Valorant",
    rating: 4.8,
    tone: "casual",
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
    quote: "W works good",
    author: "***",
    game: "Apex Legends",
    rating: 4.9,
    tone: "casual",
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
    quote: "W stable fps",
    author: "D*** R.",
    game: "CS2",
    rating: 4.7,
    tone: "casual",
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
    quote: "W just works",
    author: "Noah K.",
    game: "Apex Legends",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r8",
    quote: "W better ping",
    author: "***",
    game: "Valorant",
    rating: 4.6,
    tone: "casual",
  },
  {
    id: "r9",
    quote: "W found games",
    author: "E***",
    game: "Cyberpunk 2077",
    rating: 4.8,
    tone: "casual",
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
    quote: "W no stutter",
    author: "***",
    game: "Elden Ring",
    rating: 4.5,
    tone: "casual",
  },
  {
    id: "r12",
    quote: "W fps jumped",
    author: "t***",
    game: "Warzone",
    rating: 4.9,
    tone: "casual",
  },
  {
    id: "r13",
    quote: "W free hits",
    author: "Kai M.",
    game: "CS2",
    rating: 4.7,
    tone: "casual",
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
    quote: "W tweaks hit",
    author: "***",
    game: "Rainbow Six Siege",
    rating: 4.6,
    tone: "casual",
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
    quote: "W fast support",
    author: "S*** P.",
    game: "Valorant",
    rating: 5,
    tone: "casual",
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
