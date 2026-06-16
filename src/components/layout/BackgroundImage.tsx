export function BackgroundImage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 15% -5%, rgba(110, 184, 224, 0.12), transparent 55%), radial-gradient(ellipse 60% 45% at 90% 10%, rgba(88, 101, 242, 0.1), transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(255, 107, 91, 0.08), transparent 55%), linear-gradient(180deg, #080b12 0%, #0a0e16 50%, #080b12 100%)",
        }}
      />
    </div>
  );
}
