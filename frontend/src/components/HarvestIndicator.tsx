import { motion } from "framer-motion";
import harvestImg from "../assets/btn.png";

interface HarvestIndicatorProps {
  onHarvest: () => void;
}

export const HarvestIndicator: React.FC<HarvestIndicatorProps> = ({ onHarvest }) => {
  return (
    <div
      className="absolute"
      style={{
        left: "70%",
        top: "70%",
        transform: "translate(37.5%, 26%)",
      }}
    >
      <div className="relative flex items-center justify-center">
        <motion.img
          src={harvestImg}
          alt="Botón de cosechar"
          style={{ width: "250px", height: "auto" }}
          className="object-contain cursor-pointer select-none"
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.8 }}
          onClick={onHarvest} 
        />
      </div>
    </div>
  );
};
