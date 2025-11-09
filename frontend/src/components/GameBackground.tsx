import { motion, AnimatePresence } from 'framer-motion';
import { CornPhase } from '../types';
import { useState, useEffect } from 'react';
import plantingImg from '../assets/1.png';
import growingImg from '../assets/2.png';
import readyImg from '../assets/3.png';

interface GameBackgroundProps {
  phase: CornPhase;
  canBuy: boolean;
  onHarvest: () => void;
}

const getCornImage = (phase: CornPhase): string => {
  const images = {
    planting: plantingImg,
    growing: growingImg,
    ready: readyImg,
  };
  return images[phase];
};

export const GameBackground: React.FC<GameBackgroundProps> = ({
  phase,
  canBuy,
  onHarvest,
}) => {
  const [isHarvesting, setIsHarvesting] = useState(false);

  useEffect(() => {
    [plantingImg, growingImg, readyImg].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleClick = () => {
    setIsHarvesting(true);
    onHarvest();
    setTimeout(() => setIsHarvesting(false), 300);
  };

  return (
    <div
      className={`absolute inset-0 bg-black overflow-hidden ${
        canBuy ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <img
        src={getCornImage(phase)}
        alt={`Farm ${phase}`}
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
      />
    </div>
  );
};
