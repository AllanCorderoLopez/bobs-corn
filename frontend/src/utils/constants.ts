import { LoyaltyTier } from '../types';

export const LOYALTY_TIERS: Record<string, LoyaltyTier> = {
  NEWBIE: {
    name: "Nuevo Cliente",
    minPurchases: 0,
    cooldownSeconds: 60,
    badge: "",
    color: "#86efac"
  },
  REGULAR: {
    name: "Cliente Regular",
    minPurchases: 5,
    cooldownSeconds: 50,
    badge: "",
    color: "#fbbf24"
  },
  VIP: {
    name: "Cliente VIP",
    minPurchases: 15,
    cooldownSeconds: 40,
    badge: "",
    color: "#a78bfa"
  },
  LEGEND: {
    name: "Leyenda del Maíz",
    minPurchases: 30,
    cooldownSeconds: 30,
    badge: "",
    color: "#fb3c3c"
  }
};

export const API_URL: string = 'http://localhost:3000/';