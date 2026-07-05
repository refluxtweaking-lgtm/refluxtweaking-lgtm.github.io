import { StepVisualDownload } from "./StepVisualDownload";
import { StepVisualPlay } from "./StepVisualPlay";
import { StepVisualTweaks } from "./StepVisualTweaks";

type StepVisualProps = {
  step: "01" | "02" | "03";
};

export function StepVisual({ step }: StepVisualProps) {
  if (step === "01") return <StepVisualDownload />;
  if (step === "02") return <StepVisualTweaks />;
  return <StepVisualPlay />;
}
