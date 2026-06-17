export function BackgroundImage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 10% -8%, rgba(94, 196, 239, 0.14), transparent 55%), radial-gradient(ellipse 70% 50% at 95% 5%, rgba(88, 101, 242, 0.12), transparent 50%), radial-gradient(ellipse 55% 45% at 50% 100%, rgba(255, 107, 91, 0.1), transparent 55%), linear-gradient(180deg, #040508 0%, #060810 40%, #040508 100%)",
        }}
      />
    </div>
  );
}
