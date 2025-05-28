
import type { 
  RewardTierRow, 
  RewardOfferingRow, 
  RewardTransactionRow,
  UserRewardRow,
  UserRewardPreferenceRow
} from '@/types/rewards/database';
import type { 
  RewardTier, 
  RewardOffering, 
  RewardTransaction,
  UserRewardProfile,
  TimeSeriesData,
  Achievement
} from '@/types/rewards/api';
import type {
  RewardTierProps,
  RewardOfferingProps,
  RewardTransactionProps
} from '@/types/rewards/components';

// Database to API transformers
export function transformRewardTier(row: RewardTierRow): RewardTier {
  return {
    id: row.id,
    establishment_id: row.establishment_id,
    name: row.name,
    description: row.description,
    points_required: row.points_required,
    pointsRequired: row.points_required,
    minimumPoints: row.points_required,
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    color: row.color,
    icon: row.icon,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export function transformRewardOffering(row: RewardOfferingRow): RewardOffering {
  return {
    id: row.id,
    establishment_id: row.establishment_id,
    name: row.name,
    description: row.description,
    points_required: row.points_required,
    pointsRequired: row.points_required,
    pointCost: row.points_required,
    pointValue: row.points_required,
    quantity_available: row.quantity_available,
    availableQuantity: row.quantity_available,
    expiration_days: row.expiration_days,
    is_active: row.is_active,
    image_url: row.image_url,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export function transformRewardTransaction(row: RewardTransactionRow): RewardTransaction {
  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id,
    establishment_id: row.establishment_id,
    points: row.points,
    pointsAmount: row.points,
    transaction_type: row.transaction_type,
    type: row.transaction_type === 'earn' ? 'earned' : 'redeemed',
    source: row.source,
    description: row.description || row.source,
    timestamp: row.created_at,
    date: row.created_at,
    created_at: row.created_at,
    metadata: row.metadata
  };
}

export function transformUserRewardProfile(row: UserRewardRow & { 
  tier?: RewardTierRow;
  offerings?: RewardOfferingRow[];
  transactions?: RewardTransactionRow[];
}): UserRewardProfile {
  return {
    id: row.id,
    user_id: row.user_id,
    points: row.points,
    lifetime_points: row.lifetime_points,
    lifetimePoints: row.lifetime_points,
    currentTier: row.tier ? transformRewardTier(row.tier) : undefined,
    availableRewards: row.offerings?.map(transformRewardOffering) || [],
    transactionHistory: row.transactions?.map(transformRewardTransaction) || [],
    redemptionHistory: [],
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export function transformTimeSeriesData(data: {
  date: string;
  earned?: number;
  redeemed?: number;
  pointsEarned?: number;
  pointsRedeemed?: number;
  netPoints?: number;
}): TimeSeriesData {
  const earned = data.earned ?? data.pointsEarned ?? 0;
  const redeemed = data.redeemed ?? data.pointsRedeemed ?? 0;
  
  return {
    date: data.date,
    pointsEarned: earned,
    pointsRedeemed: redeemed,
    netPoints: data.netPoints ?? (earned - redeemed),
    earned,
    redeemed
  };
}

// API to Component transformers
export function toRewardTierProps(tier: RewardTier): RewardTierProps['tier'] {
  return {
    id: tier.id,
    name: tier.name,
    description: tier.description,
    pointsRequired: tier.points_required,
    benefits: tier.benefits,
    color: tier.color,
    icon: tier.icon,
    isActive: tier.is_active
  };
}

export function toRewardOfferingProps(offering: RewardOffering): RewardOfferingProps['offering'] {
  return {
    id: offering.id,
    name: offering.name,
    description: offering.description,
    pointCost: offering.points_required,
    availableQuantity: offering.quantity_available,
    imageUrl: offering.image_url,
    isActive: offering.is_active
  };
}

export function toRewardTransactionProps(transactions: RewardTransaction[]): RewardTransactionProps['transactions'] {
  return transactions.map(tx => ({
    id: tx.id,
    type: tx.type,
    points: tx.points,
    description: tx.description || tx.source,
    timestamp: tx.timestamp,
    source: tx.source
  }));
}
