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
  {
    id: "r19",
    quote: "W ping fixed",
    author: "***",
    game: "Valorant",
    rating: 4.8,
    tone: "casual",
  },
  {
    id: "r20",
    quote: "runs way smoother",
    author: "m***",
    game: "Rust",
    rating: 4.9,
    tone: "casual",
  },
  {
    id: "r21",
    quote: "W lowkey fire",
    author: "***",
    game: "Overwatch 2",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r22",
    quote: "got more fps fs",
    author: "***",
    game: "PUBG",
    rating: 4.7,
    tone: "casual",
  },
  {
    id: "r23",
    quote: "W worth it",
    author: "A***",
    game: "Destiny 2",
    rating: 4.8,
    tone: "casual",
  },
  {
    id: "r24",
    quote: "ping down fps up",
    author: "***",
    game: "Rainbow Six Siege",
    rating: 4.9,
    tone: "casual",
  },
  {
    id: "r25",
    quote: "W easy tweak",
    author: "***",
    game: "League of Legends",
    rating: 4.6,
    tone: "casual",
  },
  {
    id: "r26",
    quote: "game feels snappy",
    author: "r***",
    game: "CS2",
    rating: 5,
    tone: "casual",
  },
  {
    id: "r27",
    quote: "W no lag",
    author: "***",
    game: "Apex Legends",
    rating: 4.8,
    tone: "casual",
  },
  {
    id: "r28",
    quote: "fps boost lowkey",
    author: "***",
    game: "Fortnite",
    rating: 4.9,
    tone: "casual",
  },
  {
    id: "r29",
    quote: "W clean tweaks",
    author: "L***",
    game: "Warzone",
    rating: 4.7,
    tone: "casual",
  },
  {
    id: "r30",
    quote: "solid W app",
    author: "***",
    game: "Valorant",
    rating: 5,
    tone: "casual",
  },
];

export function getReviewStats() {
  const count = reviews.length;
  const averageRating =
    count === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / count;

  return {
    count,
    averageRating: Math.round(averageRating * 10) / 10,
  };
}

export function reviewAuthorInitial(author: string): string {
  const trimmed = author.trim();
  if (!trimmed || trimmed === "***" || /^[*]+$/.test(trimmed)) return "*";
  const letter = trimmed.replace(/[^a-zA-Z]/g, "").charAt(0);
  return letter ? letter.toUpperCase() : "*";
}
