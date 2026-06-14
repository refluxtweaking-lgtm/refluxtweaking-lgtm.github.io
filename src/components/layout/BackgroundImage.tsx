export function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-20" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555618254-1e2e0e9c3db0?q=80&w=2070&auto=format&fit=crop')",
          filter: "brightness(0.18) saturate(0.7)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030507]/40 via-[#030507]/70 to-[#030507]" />
    </div>
  );
}
