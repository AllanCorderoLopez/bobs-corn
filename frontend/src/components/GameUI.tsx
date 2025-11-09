import { CornFarmHook } from "../types";
import { HarvestIndicator } from "./HarvestIndicator";
import { ProgressBar } from "./ProgressBar";
import { BadgeCorn } from "./BadgeCorn";

interface GameUIProps {
  farmData: CornFarmHook;
  isHarvesting: boolean;
  onHarvest: () => void; // 🔹 recibimos la función
}

export const GameUI: React.FC<GameUIProps> = ({ farmData, onHarvest }) => {
  const { totalCorn, tier, timeRemaining } = farmData;

  return (
    <div>
      <BadgeCorn totalCorn={totalCorn} />
      <ProgressBar timeRemaining={timeRemaining} tier={tier} />
      <HarvestIndicator onHarvest={onHarvest} />
    </div>
  );
};
