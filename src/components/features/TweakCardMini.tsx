interface TweakCardMiniProps {
  title: string;
  description: string;
}

export function TweakCardMini({ title, description }: TweakCardMiniProps) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-reflux-border/60 bg-gradient-to-r from-[#0f1217] to-[#0c0e12] px-4 py-3.5 transition-all hover:border-reflux-accent/35 hover:shadow-[0_0_16px_rgba(241,91,80,0.08)]">
      <div>
        <strong className="text-sm">{title}</strong>
        <p className="text-xs text-reflux-muted">{description}</p>
      </div>
      <div className="toggle-on relative h-6 w-11 shrink-0 rounded-full bg-reflux-accent shadow-[0_0_12px_rgba(241,91,80,0.55)]" />
    </div>
  );
}
