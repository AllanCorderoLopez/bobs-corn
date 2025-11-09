import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import errorImg from '../assets/error.png';

interface ErrorToastProps {
  message: string | null;
  duration?: number;
  onClose?: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'fixed',
            top: '-60px',
            right: '0px',
            transform: 'translate(200px, -50%)',
            zIndex: 99,
            pointerEvents: 'none',
          }}
        >
          <img
            src={errorImg}
            alt="Error"
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'contain',
              
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
