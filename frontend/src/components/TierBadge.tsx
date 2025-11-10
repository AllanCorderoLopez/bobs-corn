import { motion, AnimatePresence } from "framer-motion";
import { LoyaltyTier } from "../types";
import { useState, useEffect } from "react";

// ✅ Importar imágenes desde assets
import badgeNuevo from "../assets/badge-nuevo.png";
import badgeRegular from "../assets/badge-regular.png";
import badgeVip from "../assets/badge-vip.png";
import badgeLeyenda from "../assets/badge-leyenda.png";

interface TierBadgeProps {
  tier: LoyaltyTier | null;
}

const TIER_BADGES: Record<string, string> = {
  "Nuevo Cliente": badgeNuevo,
  "Cliente Regular": badgeRegular,
  "Cliente VIP": badgeVip,
  "Leyenda del Maíz": badgeLeyenda,
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier }) => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (tier) {
      const timer = setTimeout(() => setShowBadge(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowBadge(false);
    }
  }, [tier]);

  if (!tier) return null;

  const badgeImage = TIER_BADGES[tier.name] || TIER_BADGES["Nuevo Cliente"];

  return (
    <AnimatePresence mode="wait">
      {showBadge && (
        <motion.div
          className="tier-badge-container"
          key={tier.name}
          initial={{ x: -296, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -296, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="tier-badge-glow">
            <img
              src={badgeImage}
              alt={`Insignia ${tier.name}`}
              className="tier-badge-image"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
