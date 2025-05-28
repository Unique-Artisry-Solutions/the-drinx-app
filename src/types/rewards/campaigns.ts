
export interface RewardCampaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled' | 'cancelled';
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: AudienceFilter[];
  rewards: CampaignReward[];
  trigger_conditions?: TriggerCondition[];
  performance_metrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AudienceFilter {
  id: string;
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

export interface CampaignReward {
  id: string;
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

export interface TriggerCondition {
  id: string;
  type: 'visit' | 'purchase' | 'checkin' | 'review' | 'referral';
  value: string;
  description: string;
}
