
import { useState, useEffect } from 'react';
import {
  generateAttendanceForecast,
  generateRevenuePrediction,
  generatePricingRecommendation,
  generateEarlyWarnings,
  getModelPerformance,
  type AttendanceForecast,
  type RevenuePrediction,
  type PricingRecommendation,
  type EarlyWarning,
  type PredictiveModel
} from '@/services/predictiveAnalyticsService';

interface UsePredictiveAnalyticsProps {
  promoterId: string;
  eventId?: string;
}

interface UsePredictiveAnalyticsReturn {
  attendanceForecast: AttendanceForecast | null;
  revenuePrediction: RevenuePrediction | null;
  pricingRecommendation: PricingRecommendation | null;
  earlyWarnings: EarlyWarning[];
  modelPerformance: PredictiveModel[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  generateForecast: (eventId: string) => Promise<void>;
  generatePricing: (eventId: string) => Promise<void>;
}

export function usePredictiveAnalytics({
  promoterId,
  eventId
}: UsePredictiveAnalyticsProps): UsePredictiveAnalyticsReturn {
  const [attendanceForecast, setAttendanceForecast] = useState<AttendanceForecast | null>(null);
  const [revenuePrediction, setRevenuePrediction] = useState<RevenuePrediction | null>(null);
  const [pricingRecommendation, setPricingRecommendation] = useState<PricingRecommendation | null>(null);
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarning[]>([]);
  const [modelPerformance, setModelPerformance] = useState<PredictiveModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [warningsData, modelsData] = await Promise.all([
        generateEarlyWarnings(promoterId),
        getModelPerformance()
      ]);

      setEarlyWarnings(warningsData);
      setModelPerformance(modelsData);

      // Load event-specific data if eventId is provided
      if (eventId) {
        const [forecastData, revenueData, pricingData] = await Promise.all([
          generateAttendanceForecast(eventId),
          generateRevenuePrediction(eventId),
          generatePricingRecommendation(eventId)
        ]);

        setAttendanceForecast(forecastData);
        setRevenuePrediction(revenueData);
        setPricingRecommendation(pricingData);
      }
    } catch (err) {
      console.error('Error loading predictive analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load predictive analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const generateForecast = async (targetEventId: string) => {
    try {
      const [forecastData, revenueData] = await Promise.all([
        generateAttendanceForecast(targetEventId),
        generateRevenuePrediction(targetEventId)
      ]);

      setAttendanceForecast(forecastData);
      setRevenuePrediction(revenueData);
    } catch (err) {
      console.error('Error generating forecast:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate forecast');
    }
  };

  const generatePricing = async (targetEventId: string) => {
    try {
      const pricingData = await generatePricingRecommendation(targetEventId);
      setPricingRecommendation(pricingData);
    } catch (err) {
      console.error('Error generating pricing recommendation:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate pricing recommendation');
    }
  };

  const refresh = () => {
    loadData();
  };

  useEffect(() => {
    if (promoterId) {
      loadData();
    }
  }, [promoterId, eventId]);

  return {
    attendanceForecast,
    revenuePrediction,
    pricingRecommendation,
    earlyWarnings,
    modelPerformance,
    isLoading,
    error,
    refresh,
    generateForecast,
    generatePricing
  };
}
