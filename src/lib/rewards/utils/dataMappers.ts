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
    quantity_available: dbOffering.quantity_available,
    expiration_days: dbOffering.expiration_days,
    is_active: dbOffering.is_active,
    image_url: dbOffering.image_url,
    establishment_id: dbOffering.establishment_id
  };
};

/**
 * Maps analytics time series data to the format expected by components
 */
export const mapAnalyticsTimeSeriesData = (data: RewardAnalytics['timeSeriesData']): TimeSeriesData[] => {
  return data.map(item => ({
    date: item.date,
    pointsEarned: item.earned,
    pointsRedeemed: item.redeemed,
    netPoints: item.earned - item.redeemed
  }));
};
