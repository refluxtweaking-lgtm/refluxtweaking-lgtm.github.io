interface TweakCardMiniProps {
  title: string;
  description: string;
}

export function TweakCardMini({ title, description }: TweakCardMiniProps) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border border-reflux-border/60 bg-gradient-to-r from-[#10141b] via-[#0c0e12] to-[#0a0c10] px-3 py-2.5 transition-all hover:border-reflux-accent/35 hover:shadow-[0_0_20px_rgba(241,91,80,0.1)] sm:px-4 sm:py-3.5">
      <div className="min-w-0">
        <strong className="block truncate text-sm text-white">{title}</strong>
        <p className="truncate text-xs text-reflux-muted">{description}</p>
      </div>
      <div className="toggle-on relative h-6 w-11 shrink-0 rounded-full bg-reflux-accent shadow-[0_0_12px_rgba(241,91,80,0.55)]" />
    </div>
  );
}
