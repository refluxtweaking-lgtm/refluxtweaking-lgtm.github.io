export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden" aria-hidden="true">
      <div className="ambient-bg-wash" />
    </div>
  );
}
