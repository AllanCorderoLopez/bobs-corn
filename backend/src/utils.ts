import { LoyaltyTier, CornPhase } from './types';

export const LOYALTY_TIERS: Record<string, LoyaltyTier> = {
  NEWBIE: {
    name: 'Nuevo Cliente',
    minPurchases: 0,
    cooldownSeconds: 60,
    badge: '',
    color: '#86efac',
  },
  REGULAR: {
    name: 'Cliente Regular',
    minPurchases: 5,
    cooldownSeconds: 50,
    badge: '',
    color: '#fbbf24',
  },
  VIP: {
    name: 'Cliente VIP',
    minPurchases: 15,
    cooldownSeconds: 40,
    badge: '',
    color: '#a78bfa',
  },
  LEGEND: {
    name: 'Leyenda del Maíz',
    minPurchases: 30,
    cooldownSeconds: 30,
    badge: '',
    color: '#fb923c',
  },
};

export function calculateTier(totalPurchases: number): LoyaltyTier {
  if (totalPurchases >= 30) return LOYALTY_TIERS.LEGEND;
  if (totalPurchases >= 15) return LOYALTY_TIERS.VIP;
  if (totalPurchases >= 5) return LOYALTY_TIERS.REGULAR;
  return LOYALTY_TIERS.NEWBIE;
}

export function getNextTierThreshold(totalPurchases: number): number | null {
  if (totalPurchases < 5) return 5;
  if (totalPurchases < 15) return 15;
  if (totalPurchases < 30) return 30;
  return null;
}

export function calculatePhase(elapsed: number, cooldownSeconds: number): CornPhase {
  const cooldownMs = cooldownSeconds * 1000;
  const progress = elapsed / cooldownMs;

  if (progress < 0.33) return 'planting';
  if (progress < 0.66) return 'growing';
  if (progress >= 1.0) return 'ready';
  return 'growing';
}
