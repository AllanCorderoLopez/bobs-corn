import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCornFarm } from "./hooks/useCornFarm";
import { GameUI } from "./components/GameUI";
import { ErrorToast } from "./components/ErrorToast";
import { CornPhase } from "./types";
import plantingImg from "./assets/1.png";
import growingImg from "./assets/2.png";
import readyImg from "./assets/3.png";

function App() {
  const [clientId, setClientId] = useState<string>("");
  const [showUpgrade, setShowUpgrade] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isHarvesting, setIsHarvesting] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("clientId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("clientId", id);
    }
    setClientId(id);
    setIsInitialized(true);
  }, []);

  const farmData = useCornFarm(clientId, isInitialized);
  const { totalCorn, tier, phase, canBuy, buyCorn, error, clearError } =
    farmData;

  useEffect(() => {
    if (tier && totalCorn > 0) {
      const previousTotal = totalCorn - 1;
      const shouldShowUpgrade =
        (previousTotal < 5 && totalCorn >= 5) ||
        (previousTotal < 15 && totalCorn >= 15) ||
        (previousTotal < 30 && totalCorn >= 30);

      if (shouldShowUpgrade) {
        setShowUpgrade(true);
        setTimeout(() => setShowUpgrade(false), 3000);
      }
    }
  }, [totalCorn, tier]);

  const getBackgroundImage = (phase: CornPhase): string => {
    const images = {
      planting: plantingImg,
      growing: growingImg,
      ready: readyImg,
    };
    return images[phase];
  };

  const handleHarvest = () => {
    setIsHarvesting(true);

    buyCorn();
    setIsHarvesting(false);
  };

  // ...
return (
  <>
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen"
      style={{
        backgroundImage: `url(${getBackgroundImage(phase)})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <GameUI farmData={farmData} isHarvesting={isHarvesting} onHarvest={handleHarvest} />
    </div>

    <ErrorToast message={error} duration={3000} onClose={clearError} />
  </>
);

}

export default App;
