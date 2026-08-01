export type Vouch = {
  id: string;
  author: string;
  quote: string;
  product: "FREE" | "PRO";
};

/** Discord vouches. Usernames shortened: first letters + asterisks. No dates. */
export const discordVouches: Vouch[] = [
  {
    id: "v-zen",
    author: "zen****",
    quote: "vouch 20+ fps added -30 ping running stable 240fps and lower lag on fn",
    product: "PRO",
  },
  {
    id: "v-sno",
    author: "sno****",
    quote:
      "vouch @reflux 30 fps added free version roblox went from running 30 fps to running 60+. laptop went 30 fps to 75 avg, peak 120",
    product: "FREE",
  },
  {
    id: "v-xvz",
    author: "xvz****",
    quote:
      "vouch 50+ fps -20 ms on roblox. helped me step by step and answered every question. ill buy premium soon",
    product: "PRO",
  },
  {
    id: "v-cuc",
    author: "cuc****",
    quote: "from 60 fps to 80, less ping less delay, tested on roblox, free version. thanks!",
    product: "FREE",
  },
];
