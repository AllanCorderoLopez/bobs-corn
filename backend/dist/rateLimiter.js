"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class RateLimiter {
    constructor() {
        this.userStates = new Map();
    }
    getOrCreateUser(clientId) {
        if (!this.userStates.has(clientId)) {
            const tier = (0, utils_1.calculateTier)(0);
            this.userStates.set(clientId, {
                clientId,
                totalPurchases: 0,
                tier: tier.name,
                cooldownSeconds: tier.cooldownSeconds,
                lastPurchase: null,
                currentPhase: 'ready',
                socketId: null
            });
        }
        return this.userStates.get(clientId);
    }
    canPurchase(clientId) {
        const user = this.getOrCreateUser(clientId);
        if (!user.lastPurchase) {
            return { allowed: true, user };
        }
        const now = Date.now();
        const elapsed = now - user.lastPurchase;
        const requiredCooldown = user.cooldownSeconds * 1000;
        if (elapsed < requiredCooldown) {
            return {
                allowed: false,
                user,
                retryAfter: Math.ceil((requiredCooldown - elapsed) / 1000),
                timeRemaining: requiredCooldown - elapsed
            };
        }
        return { allowed: true, user };
    }
    recordPurchase(clientId) {
        const user = this.getOrCreateUser(clientId);
        const oldTier = user.tier;
        user.totalPurchases += 1;
        user.lastPurchase = Date.now();
        user.currentPhase = 'planting';
        const newTierData = (0, utils_1.calculateTier)(user.totalPurchases);
        user.tier = newTierData.name;
        user.cooldownSeconds = newTierData.cooldownSeconds;
        const tierUpgraded = oldTier !== user.tier;
        return {
            user,
            tierUpgraded,
            newTierData
        };
    }
    updateSocketId(clientId, socketId) {
        const user = this.getOrCreateUser(clientId);
        user.socketId = socketId;
    }
    getUserState(clientId) {
        return this.getOrCreateUser(clientId);
    }
    getAllUsers() {
        return Array.from(this.userStates.values());
    }
}
exports.default = new RateLimiter();
