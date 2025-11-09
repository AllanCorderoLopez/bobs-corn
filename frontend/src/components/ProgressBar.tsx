import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { LoyaltyTier } from "../types";
import "../index.css";

interface ProgressBarProps {
  timeRemaining: number;
  tier: LoyaltyTier | null;
  position?: { left?: string; top?: string; transform?: string };
  width?: number;
}

const numberPixelArray = [
  "11111001100110011111", // 0
  "00100010001000100010", // 1
  "11110001111110001111", // 2
  "11110001011100011111", // 3
  "10011001111100010001", // 4
  "11111000111100011111", // 5
  "11111000111110011111", // 6
  "11110001000100010001", // 7
  "11111001111110011111", // 8
  "11111001111100011111", // 9
  "10100010010001001001"  // %
];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  timeRemaining: initialTime,
  tier,
  position = {},
  width = 200,
}) => {
  const cooldownSeconds = tier?.cooldownSeconds || 60;
  const color = tier?.color || "#a66fff";
  const maxTime = cooldownSeconds * 1000;

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(performance.now());
  const remainingAtStartRef = useRef<number>(initialTime);

  // Reinicia el temporizador si cambia la tier o el tiempo inicial
  useEffect(() => {
    startTimeRef.current = performance.now();
    remainingAtStartRef.current = initialTime;
  }, [initialTime, tier]);

  // Actualiza el progreso basándose en tiempo real
  useEffect(() => {
    let frameId: number;
    const update = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, remainingAtStartRef.current - elapsed);
      let pct = ((maxTime - remaining) / maxTime) * 100;

      if (pct > 90 && remaining > 0) {
        const smoothPct = 90 + ((100 - 90) * (1 - remaining / (maxTime * 0.1)));
        pct = Math.min(pct, smoothPct);
      }

      setProgress(Math.min(100, Math.max(0, pct)));
      if (remaining > 0) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [initialTime, tier]);

  // Interpolación suave para la barra
  const smoothProgress = useSpring(progress, { stiffness: 50, damping: 15 });

  // Render de los dígitos
  const digits = (() => {
    const p = Math.round(progress);
    if (p === 100) return [1, 0, 0];
    if (p >= 10) return [Math.floor(p / 10), p % 10];
    return [p];
  })();

  const renderDigit = (digit: number, i: number) => {
    const pattern = numberPixelArray[digit].split("");
    return (
      <div key={i} className="pixel-number">
        {pattern.map((px, j) => (
          <div
            key={j}
            style={{ background: px === "1" ? "white" : "transparent" }}
            className="number-pixel"
          />
        ))}
      </div>
    );
  };

  const renderPercentSymbol = () => {
    const pattern = numberPixelArray[10].split("");
    return (
      <div className="pixel-number">
        {pattern.map((px, j) => (
          <div
            key={j}
            style={{ background: px === "1" ? "white" : "transparent" }}
            className="number-pixel"
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="absolute left-6 top-32"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="space-y-4 w-80">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="pixel-progress-container"
            style={{
              position: position.left || position.top ? "absolute" : "relative",
              left: position.left,
              top: position.top,
              transform:
                position.transform || "translate(600px, -170px)",
              width: `${width}px`,
            }}
          >
            <div className="progress-bg">
              <div className="progress-bg-limit" />
              <div className="progress-bg-area">
                {/* Números */}
                <div className="percentage">
                  {digits.map((d, i) => renderDigit(d, i))}
                  {renderPercentSymbol()}
                </div>

                {/* Parte llena */}
                <div
                  className="indicator"
                  style={{
                    background: `linear-gradient(60deg, ${color}dd 0%, ${color} 50%, ${color} 100%)`,
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="indicator-pixels">
                      <div className="progress-bar-pixel zero light" />
                      <div className="progress-bar-pixel transparent light" />
                      <div className="progress-bar-pixel mid-translucent light" />
                      <div className="progress-bar-pixel translucent light" />
                      <div className="progress-bar-pixel mid-transparent light" />
                      <div className="progress-bar-pixel mid-translucent light" />
                      <div className="progress-bar-pixel translucent light" />
                      <div className="progress-bar-pixel transparent light" />
                      <div className="progress-bar-pixel transparent light" />
                      <div className="progress-bar-pixel translucent light" />
                      <div className="progress-bar-pixel mid-translucent light" />
                      <div className="progress-bar-pixel mid-transparent light" />
                      <div className="progress-bar-pixel translucent light" />
                      <div className="progress-bar-pixel mid-translucent light" />
                      <div className="progress-bar-pixel transparent light" />
                      <div className="progress-bar-pixel zero light" />
                    </div>
                  ))}
                </div>

                {/* Parte vacía */}
                <div className="empty" style={{ width: `${100 - Math.min(100, progress)}%` }}>
                  <div className="pixel-fade">
                    <div>
                      <div className="progress-bar-pixel purple transparent" />
                      <div className="progress-bar-pixel purple zero" />
                      <div className="progress-bar-pixel purple zero" />
                      <div className="progress-bar-pixel purple transparent" />
                    </div>
                    <div>
                      <div
                        className="progress-bar-pixel purple"
                        style={{ background: color }}
                      />
                      <div className="progress-bar-pixel purple transparent" />
                      <div className="progress-bar-pixel purple transparent" />
                      <div
                        className="progress-bar-pixel purple"
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                  <div className="solid" style={{ background: color }} />
                </div>
              </div>
              <div className="progress-bg-limit" />
            </div>

            {/* Marco */}
            <div className="progress-bar-frame">
              <div className="progress-bar-border-left-right">
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel transparent" />
              </div>
              <div className="progress-bar-border-left-right">
                <div className="progress-bar-pixel translucent" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel translucent" />
              </div>
              <div className="progress-bar-border-left-right">
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel zero" />
                <div className="progress-bar-pixel zero" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel" />
              </div>
              <div className="progress-bar-border-top-bottom relative-width">
                <div className="progress-bar-pixel relative-width" />
                <div className="progress-bar-pixel relative-width" />
              </div>
              <div className="progress-bar-border-left-right">
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel zero" />
                <div className="progress-bar-pixel zero" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel" />
              </div>
              <div className="progress-bar-border-left-right">
                <div className="progress-bar-pixel translucent" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel translucent" />
              </div>
              <div className="progress-bar-border-left-right">
                <div className="progress-bar-pixel transparent" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel" />
                <div className="progress-bar-pixel transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
