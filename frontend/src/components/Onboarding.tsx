import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_IMAGES = [
  "/src/assets/onboard1.png",
  "/src/assets/onboard2.png",
  "/src/assets/onboard3.png",
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < ONBOARDING_IMAGES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("onboarding_completed", "true");
    setTimeout(onComplete, 500); // Aumentado para que coincida con la animación
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="onboarding-overlay"
            onClick={handleComplete}
          />

          {/* Granjero con animación de entrada/salida */}
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="onboarding-farmer"
          >
            <img src="/src/assets/bob.png" alt="Granjero" />
          </motion.div>

          {/* Imagen de pensamiento + controles con animación de entrada/salida */}
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
            className="onboarding-thought"
          >
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={ONBOARDING_IMAGES[currentStep]}
                alt={`Paso ${currentStep + 1}`}
              />
            </motion.div>

            {/* Controles */}
            <div className="onboarding-controls">
              {/* Indicadores */}
              <div className="onboarding-indicators">
                {ONBOARDING_IMAGES.map((_, index) => (
                  <div
                    key={index}
                    className={`onboarding-indicator ${
                      index === currentStep ? "active" : "inactive"
                    }`}
                  />
                ))}
              </div>

              {/* Botón con imagen */}
              <button onClick={handleNext} className="onboarding-btn-next">
                <img 
                  src="/src/assets/arrow.png" 
                  alt={currentStep < ONBOARDING_IMAGES.length - 1 ? "Siguiente" : "Empezar"}
                />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};