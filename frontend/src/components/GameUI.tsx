import { useState, useEffect } from "react";
import { CornFarmHook } from "../types";
import { HarvestIndicator } from "./HarvestIndicator";
import { ProgressBar } from "./ProgressBar";
import { BadgeCorn } from "./BadgeCorn";
import { Onboarding } from "./Onboarding";
import { TierBadge } from "./TierBadge";

interface GameUIProps {
  farmData: CornFarmHook;
  isHarvesting: boolean;
  onHarvest: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ farmData, onHarvest }) => {
  const { totalCorn, tier, timeRemaining } = farmData;
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Verifica si es primera vez del usuario
    const hasSeenOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasSeenOnboarding && totalCorn === 0) {
      // Espera un momento antes de mostrar para mejor UX
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, [totalCorn]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div>
      <BadgeCorn totalCorn={totalCorn} />
      <ProgressBar timeRemaining={timeRemaining} tier={tier} />
      <HarvestIndicator onHarvest={onHarvest} />
      <TierBadge tier={tier} />

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
    </div>
  );
};
