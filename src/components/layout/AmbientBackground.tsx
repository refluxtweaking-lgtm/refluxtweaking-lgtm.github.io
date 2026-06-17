export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-reflux-accent/[0.07] blur-[120px]" />
      <div className="absolute top-[40%] -right-24 h-[360px] w-[360px] rounded-full bg-reflux-calm/[0.05] blur-[100px]" />
    </div>
  );
}
