
import { RewardOffering, TimeSeriesData, RewardAnalytics } from '../types';

/**
 * Converts database reward offering format to client interface format
 */
export const mapDbOfferingToClient = (dbOffering: any): RewardOffering => {
  return {
    id: dbOffering.id,
    name: dbOffering.name,
    description: dbOffering.description,
    pointCost: dbOffering.points_required,
    availableQuantity: dbOffering.quantity_available,
    // Keep original fields for compatibility
    points_required: dbOffering.points_required,
    pointsRequired: dbOffering.points_required,
    pointValue: dbOffering.points_required,
    quantity_available: dbOffering.quantity_available,
    expiration_days: dbOffering.expiration_days,
    is_active: dbOffering.is_active,
    image_url: dbOffering.image_url,
    establishment_id: dbOffering.establishment_id,
    category: dbOffering.category,
    created_at: dbOffering.created_at,
    updated_at: dbOffering.updated_at
  };
};

/**
 * Maps analytics time series data to the format expected by components
 */
export const mapAnalyticsTimeSeriesData = (data: RewardAnalytics['timeSeriesData']): TimeSeriesData[] => {
  return data.map(item => ({
    date: item.date,
    pointsEarned: item.earned || item.pointsEarned || 0,
    pointsRedeemed: item.redeemed || item.pointsRedeemed || 0,
    netPoints: (item.earned || item.pointsEarned || 0) - (item.redeemed || item.pointsRedeemed || 0),
    earned: item.earned || item.pointsEarned || 0,
    redeemed: item.redeemed || item.pointsRedeemed || 0
  }));
};
