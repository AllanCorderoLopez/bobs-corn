"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOYALTY_TIERS = void 0;
exports.calculateTier = calculateTier;
exports.getNextTierThreshold = getNextTierThreshold;
exports.calculatePhase = calculatePhase;
exports.LOYALTY_TIERS = {
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
function calculateTier(totalPurchases) {
    if (totalPurchases >= 30)
        return exports.LOYALTY_TIERS.LEGEND;
    if (totalPurchases >= 15)
        return exports.LOYALTY_TIERS.VIP;
    if (totalPurchases >= 5)
        return exports.LOYALTY_TIERS.REGULAR;
    return exports.LOYALTY_TIERS.NEWBIE;
}
function getNextTierThreshold(totalPurchases) {
    if (totalPurchases < 5)
        return 5;
    if (totalPurchases < 15)
        return 15;
    if (totalPurchases < 30)
        return 30;
    return null;
}
function calculatePhase(elapsed, cooldownSeconds) {
    const cooldownMs = cooldownSeconds * 1000;
    const progress = elapsed / cooldownMs;
    if (progress < 0.33)
        return 'planting';
    if (progress < 0.66)
        return 'growing';
    if (progress >= 1.0)
        return 'ready';
    return 'growing';
}
