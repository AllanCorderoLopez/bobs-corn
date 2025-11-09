export interface LoyaltyTier {
  name: string;
  minPurchases: number;
  cooldownSeconds: number;
  badge: string;
  color: string;
}

export interface UserState {
  clientId: string;
  totalPurchases: number;
  tier: string;
  cooldownSeconds: number;
  lastPurchase: number | null;
  currentPhase: CornPhase;
  socketId: string | null;
}

export type CornPhase = 'planting' | 'growing' | 'ready';

export interface PurchaseResult {
  allowed: boolean;
  user: UserState;
  retryAfter?: number;
  timeRemaining?: number;
}

export interface RecordPurchaseResult {
  user: UserState;
  tierUpgraded: boolean;
  newTierData: LoyaltyTier;
}

// Socket Events
export interface ServerToClientEvents {
  'corn:initial-state': (data: InitialStateData) => void;
  'corn:state': (data: CornStateData) => void;
  'corn:ready': (data: CornReadyData) => void;
  'corn:harvested': (data: HarvestedData) => void;
  'tier:upgraded': (data: TierUpgradedData) => void;
  'corn:error': (data: ErrorData) => void;
}

export interface ClientToServerEvents {
  'user:connected': (data: { clientId: string }) => void;
  'corn:buy': (data: { clientId: string }) => void;
}

export interface InitialStateData {
  totalCorn: number;
  tier: LoyaltyTier;
  phase: CornPhase;
  timeRemaining: number;
  canBuy: boolean;
  nextTierAt: number | null;
}

export interface CornStateData {
  phase: CornPhase;
  timeRemaining: number;
  progress: number;
}

export interface CornReadyData {
  message: string;
  canHarvest: boolean;
}

export interface HarvestedData {
  statusCode?: number; // 👈 agregado
  success: boolean;
  totalCorn: number;
  tier: LoyaltyTier;
  message: string;
  timeRemaining: number;
}

export interface TierUpgradedData {
  newTier: LoyaltyTier;
  totalCorn: number;
  nextTierAt: number | null;
}

export interface ErrorData {
  statusCode: number;
  message: string;
  retryAfter: number;
  timeRemaining: number;
}
