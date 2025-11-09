import { UserState, PurchaseResult, RecordPurchaseResult } from './types';
import { calculateTier } from './utils';

class RateLimiter {
  private userStates: Map<string, UserState>;

  constructor() {
    this.userStates = new Map();
  }

  getOrCreateUser(clientId: string): UserState {
    if (!this.userStates.has(clientId)) {
      const tier = calculateTier(0);
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
    return this.userStates.get(clientId)!;
  }

  canPurchase(clientId: string): PurchaseResult {
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

  recordPurchase(clientId: string): RecordPurchaseResult {
    const user = this.getOrCreateUser(clientId);
    const oldTier = user.tier;
    
    user.totalPurchases += 1;
    user.lastPurchase = Date.now();
    user.currentPhase = 'planting';

    const newTierData = calculateTier(user.totalPurchases);
    user.tier = newTierData.name;
    user.cooldownSeconds = newTierData.cooldownSeconds;

    const tierUpgraded = oldTier !== user.tier;

    return {
      user,
      tierUpgraded,
      newTierData
    };
  }

  updateSocketId(clientId: string, socketId: string): void {
    const user = this.getOrCreateUser(clientId);
    user.socketId = socketId;
  }

  getUserState(clientId: string): UserState {
    return this.getOrCreateUser(clientId);
  }

  getAllUsers(): UserState[] {
    return Array.from(this.userStates.values());
  }
}

export default new RateLimiter();