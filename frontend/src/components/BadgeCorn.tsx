import { motion, AnimatePresence } from "framer-motion";
import counter from "../assets/badge.png";

interface BadgeCornProps {
  totalCorn: number;
  isVisible?: boolean;
}

export const BadgeCorn: React.FC<BadgeCornProps> = ({
  totalCorn,
  isVisible = true,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-0 left-0 right-0 z-50"
        >
          <div className="bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="relative flex items-center">
                  <img
                    src={counter}
                    alt="Counter Background"
                    className="object-contain opacity-90"
                    style={{
                      width: "305px",
                      height: "auto",
                      transform: "translate(-5%, -20%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h1
                      className="font-black text-white drop-shadow-lg"
                      style={{
                        transform: "translate(180px, -238px)",
                        fontSize: "25px",
                        color: "white",
                      }}
                    >
                      {totalCorn}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
