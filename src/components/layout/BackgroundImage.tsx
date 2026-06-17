export function BackgroundImage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0e1014 0%, #0c0e12 50%, #0e1014 100%)",
        }}
      />
    </div>
  );
}
