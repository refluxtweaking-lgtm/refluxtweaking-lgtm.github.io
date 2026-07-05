import Image from "next/image";

export function StepVisualPlay() {
  return (
    <div className="hiw-visual hiw-visual--play">
      <div className="hiw-play-frame">
        <Image
          src="/how-it-works/fortnite-play.jpg"
          alt="Gamer playing Fortnite after optimizing with REFLUX"
          fill
          className="hiw-play-media object-cover"
          sizes="(max-width: 768px) 100vw, 380px"
        />
        <div className="hiw-play-vignette" aria-hidden="true" />
        <div className="hiw-play-hud" aria-hidden="true">
          <span className="hiw-play-hud-fps reflux-metric">240 FPS</span>
          <span className="hiw-play-hud-ping reflux-metric">15 ms</span>
        </div>
        <div className="hiw-play-scan" aria-hidden="true" />
      </div>
    </div>
  );
}
