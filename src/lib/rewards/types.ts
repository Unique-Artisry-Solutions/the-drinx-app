
import { Json } from '@/integrations/supabase/types';

export interface RewardTier {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  benefits: any[];
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earn' | 'spend';
  source: string;
  description?: string;
  date: string;
}

// Helper function to transform raw database data to RewardTier type
export function transformRewardTier(rawData: any): RewardTier {
  return {
    id: rawData.id,
    establishment_id: rawData.establishment_id || 'default',
    name: rawData.name,
    description: rawData.description,
    points_required: rawData.points_required,
    benefits: Array.isArray(rawData.benefits) 
      ? rawData.benefits 
      : (typeof rawData.benefits === 'string' 
        ? JSON.parse(rawData.benefits) 
        : []),
    icon: rawData.icon,
    color: rawData.color,
    is_active: rawData.is_active === undefined ? true : rawData.is_active,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at
  };
}

// Helper function to transform raw transaction data
export function transformTransaction(rawData: any): RewardTransaction {
  return {
    id: rawData.id,
    user_id: rawData.user_id,
    points: rawData.points,
    type: rawData.transaction_type === 'earn' ? 'earn' : 'spend',
    source: rawData.source,
    description: rawData.description,
    date: rawData.created_at
  };
}
