
import { DateRange } from "react-day-picker";
import { supabase } from '@/lib/supabase';
import { BusinessImpactData, ExecutiveSummaryData } from '../types';

/**
 * Gets executive summary data for the rewards program
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 * @param comparisonPeriod Period to compare against (30d, 90d, 1yr)
 */
export async function getExecutiveSummary(
  startDate: Date,
  endDate: Date,
  comparisonPeriod: '30d' | '90d' | '1yr'
): Promise<ExecutiveSummaryData> {
  try {
    // In a real implementation, we would fetch actual data from the database
    // For now, we'll generate realistic mock data
    
    // Program health metrics
    const programHealth = {
      activeMembers: 12450,
      activeMembersChange: 5.2,
      pointsBalance: 2345600,
      pointsBalanceChange: -2.1,
      growthRate: 8.5,
      growthRateChange: 1.2,
      engagementRate: 64.3,
      engagementRateChange: 3.7
    };
    
    // Generate trend data for the requested time period
    const growthTrends = generateGrowthTrendData(startDate, endDate, comparisonPeriod);
    
    // Business impact data
    const businessImpact = generateBusinessImpactData();
    
    return {
      programHealth,
      growthTrends,
      businessImpact
    };
  } catch (error) {
    console.error('Error fetching executive summary:', error);
    throw error;
  }
}

/**
 * Generate mock growth trend data
 */
function generateGrowthTrendData(startDate: Date, endDate: Date, comparisonPeriod: string) {
  // Calculate date points based on the range
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  let interval = 1; // default to daily
  
  if (days > 90) {
    interval = 7; // weekly
  } else if (days > 365) {
    interval = 30; // monthly
  }
  
  // Generate enrollment trend data
  const enrollment = [];
  const activeRate = [];
  
  const dataPoints = Math.ceil(days / interval);
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * interval));
    
    // Generate realistic looking enrollment data
    const baseEnrollment = 50 + Math.floor(Math.random() * 30);
    const newMembers = baseEnrollment + (i * 2);
    const returningMembers = Math.floor(newMembers * (0.3 + (Math.random() * 0.2)));
    
    enrollment.push({
      name: date.toISOString().split('T')[0],
      newMembers,
      returningMembers,
      total: newMembers + returningMembers
    });
    
    // Generate active rate data
    const baseRate = 60 + (i * 0.2) + (Math.random() * 5 - 2.5);
    activeRate.push({
      name: date.toISOString().split('T')[0],
      activeRate: parseFloat(baseRate.toFixed(1)),
      targetRate: 75
    });
  }
  
  return {
    enrollment,
    activeRate
  };
}

/**
 * Generate mock business impact data
 */
function generateBusinessImpactData(): BusinessImpactData {
  // Mock business impact metrics
  const revenueInfluenced = 427500;
  const memberValueDiff = 48.75;
  const retentionImpact = 23.4;
  const redemptionEfficiency = 78.2;
  
  // Member value comparison (average spend)
  const memberValueComparison = [
    { name: "Last Month", memberValue: 89.50, nonMemberValue: 42.25 },
    { name: "2 Months Ago", memberValue: 85.75, nonMemberValue: 40.50 },
    { name: "3 Months Ago", memberValue: 82.25, nonMemberValue: 39.75 }
  ];
  
  // Redemption distribution by category
  const redemptionDistribution = [
    { name: "Free Items", value: 42 },
    { name: "Discounts", value: 28 },
    { name: "Experiences", value: 15 },
    { name: "Early Access", value: 10 },
    { name: "Other", value: 5 }
  ];
  
  return {
    revenueInfluenced,
    revenueInfluencedChange: 8.3,
    memberValueDiff,
    memberValueChange: 5.1,
    retentionImpact,
    retentionImpactChange: 2.7,
    redemptionEfficiency,
    redemptionEfficiencyChange: -1.5,
    memberValueComparison,
    redemptionDistribution
  };
}
