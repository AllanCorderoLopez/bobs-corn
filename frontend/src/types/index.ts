export interface LoyaltyTier {
  name: string;
  minPurchases: number;
  cooldownSeconds: number;
  badge: string;
  color: string;
}

export type CornPhase = 'planting' | 'growing' | 'ready';

export interface CornFarmState {
  totalCorn: number;
  tier: LoyaltyTier | null;
  phase: CornPhase;
  canBuy: boolean;
  timeRemaining: number;
  nextTierAt: number | null;
  isConnected: boolean;
  error: string | null;
}

export interface ServerToClientEvents {
  'corn:initial-state': (data: {
    totalCorn: number;
    tier: LoyaltyTier;
    phase: CornPhase;
    timeRemaining: number;
    canBuy: boolean;
    nextTierAt: number | null;
  }) => void;
  
  'corn:state': (data: {
    phase: CornPhase;
    timeRemaining: number;
    progress: number;
  }) => void;
  
  'corn:ready': (data: {
    message: string;
    canHarvest: boolean;
  }) => void;
  
  'corn:harvested': (data: {
    statusCode?: number;
    success: boolean;
    totalCorn: number;
    tier: LoyaltyTier;
    timeRemaining: number;
    message: string;
  }) => void;
  
  'corn:error': (data: {
    statusCode: number;      
    message: string;
    retryAfter: number;      
    timeRemaining: number;
  }) => void;
  
  'tier:upgraded': (data: {
    newTier: LoyaltyTier;
    totalCorn: number;
    nextTierAt: number | null;
  }) => void;
}

export interface ClientToServerEvents {
  'user:connected': (data: { clientId: string }) => void;
  'corn:buy': (data: { clientId: string }) => void;
}

export interface CornFarmHook extends CornFarmState {
  buyCorn: () => void;
  clearError: () => void;
}