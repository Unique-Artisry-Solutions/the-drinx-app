
// Define all the types and service functions for the Promoter Analytics feature
import { addDays, subDays } from 'date-fns';

// Basic analytics data type
export interface PromoterAnalytics {
  date: string;
  views: number;
  engagement_rate: number;
  clicks: number;
  subscribes: number;
  unsubscribes: number;
}

// Event performance data type
export interface EventPerformance {
  id: string;
  name: string;
  date: string;
  venue: string;
  attendees: number;
  ticket_sales: number;
  revenue: number;
}

// Campaign performance data type
export interface CampaignPerformance {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'scheduled' | 'paused';
  start_date: string;
  end_date: string | null;
  reach: number;
  engagement: number;
  clicks?: number;
  ctr?: string;
  conversion_rate: number;
}

// Audience metric data type
export interface AudienceMetric {
  metric_name: string;
  segment: string;
  metric_value: number;
  previous_period?: number;
  percentage_change?: number;
}

// Trend data point type
export interface TrendDataPoint {
  date: string;
  metric_name: string;
  metric_value: number;
}

// Demographics data type
export interface AudienceDemographicData {
  name: string;
  value: number;
}

// Audience retention data type
export interface AudienceRetentionData {
  cohort: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
}

// Campaign ROI data type
export interface CampaignROIData {
  campaignId: string;
  campaignName: string;
  startDate: string;
  endDate: string | null;
  marketingCost: number;
  revenue: number;
  ticketsSold: number;
  roi: number;
  channels: {
    name: string;
    cost: number;
    conversions: number;
    revenue: number;
  }[];
  timeframes: {
    period: string;
    cost: number;
    revenue: number;
    roi: number;
  }[];
}

// Event details data type
export interface EventDetails {
  id: string;
  name: string;
  date: string;
  venue_name: string;
  total_attendees: number;
  total_revenue: number;
  historical_comparison: {
    event_name: string;
    previous_date: string;
    previous_attendees: number;
    previous_revenue: number;
    attendee_growth: number;
    revenue_growth: number;
  };
  ticket_breakdown: {
    ticket_type: string;
    price: number;
    quantity_sold: number;
    revenue: number;
  }[];
  attendance_demographics: {
    category: string;
    value: number;
    percentage: number;
  }[];
}

// Helper function to generate mock data for testing
function generateMockData<T>(count: number, generator: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => generator(i));
}

// Mock analytics data fetch function
export async function fetchPromoterAnalytics(
  promoterId: string,
  dateRange: { startDate: Date; endDate: Date }
): Promise<PromoterAnalytics[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const daysCount = Math.ceil(
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return generateMockData(daysCount, (i) => {
    const date = addDays(new Date(dateRange.startDate), i);
    return {
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 500) + 100,
      engagement_rate: Math.random() * 20 + 5,
      clicks: Math.floor(Math.random() * 150) + 30,
      subscribes: Math.floor(Math.random() * 30) + 5,
      unsubscribes: Math.floor(Math.random() * 10)
    };
  });
}

// Mock event performance data fetch function
export async function fetchEventPerformance(promoterId: string): Promise<EventPerformance[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return generateMockData(5, (i) => {
    const date = subDays(new Date(), i * 15);
    return {
      id: `event-${i + 1}`,
      name: `Event ${i + 1}`,
      date: date.toISOString().split('T')[0],
      venue: `Venue ${i + 1}`,
      attendees: Math.floor(Math.random() * 200) + 50,
      ticket_sales: Math.floor(Math.random() * 250) + 50,
      revenue: Math.floor(Math.random() * 5000) + 1000
    };
  });
}

// Mock campaign performance data fetch function
export async function fetchCampaignPerformance(promoterId: string): Promise<CampaignPerformance[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const statusOptions: Array<'active' | 'completed' | 'scheduled' | 'paused'> = ['active', 'completed', 'scheduled', 'paused'];
  
  return generateMockData(4, (i) => {
    const startDate = subDays(new Date(), (i + 1) * 10);
    const endDate = i % 2 === 0 ? null : addDays(startDate, 30).toISOString().split('T')[0];
    
    return {
      id: `campaign-${i + 1}`,
      name: `Campaign ${i + 1}`,
      status: statusOptions[i % statusOptions.length],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate,
      reach: Math.floor(Math.random() * 2000) + 500,
      engagement: Math.floor(Math.random() * 400) + 100,
      conversion_rate: Math.random() * 10 + 1
    };
  });
}

// Mock audience metrics data fetch function
export async function fetchAudienceMetrics(promoterId: string): Promise<AudienceMetric[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const metricNames = ['Interest', 'Platform', 'Age Group', 'Location', 'Device'];
  const segments = [
    ['Music', 'Art', 'Food', 'Sports', 'Technology'],
    ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'Email'],
    ['18-24', '25-34', '35-44', '45-54', '55+'],
    ['Urban', 'Suburban', 'Rural', 'Downtown', 'University'],
    ['Mobile', 'Desktop', 'Tablet', 'iOS', 'Android']
  ];
  
  const result: AudienceMetric[] = [];
  
  metricNames.forEach((metricName, idx) => {
    segments[idx].forEach(segment => {
      result.push({
        metric_name: metricName,
        segment,
        metric_value: Math.floor(Math.random() * 100) + 10
      });
    });
  });
  
  return result;
}

// Mock trend data fetch function
export async function fetchTrendData(
  promoterId: string,
  metricType: string,
  dateRange: { startDate: Date; endDate: Date }
): Promise<TrendDataPoint[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const daysCount = Math.min(
    Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)),
    30 // Limiting to 30 points for cleaner visualization
  );
  
  return generateMockData(daysCount, (i) => {
    const date = addDays(new Date(dateRange.startDate), i * Math.max(Math.floor(daysCount / 15), 1));
    const baseValue = metricType === 'engagement_rate' ? 
      (Math.random() * 10 + 5) : // engagement rate between 5-15%
      (Math.random() * 800 + 200); // subscriber count between 200-1000
    
    // Add some trend to the data
    const trendFactor = 1 + (i / daysCount) * 0.5; // gradual increase
    
    return {
      date: date.toISOString().split('T')[0],
      metric_name: metricType,
      metric_value: Math.floor(baseValue * trendFactor)
    };
  });
}

// Mock event details fetch function
export async function fetchEventDetails(eventId: string): Promise<EventDetails> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const currentAttendees = Math.floor(Math.random() * 400) + 200;
  const prevAttendees = Math.floor(currentAttendees * (Math.random() * 0.4 + 0.7)); // 70-110% of current
  
  const currentRevenue = Math.floor(Math.random() * 8000) + 3000;
  const prevRevenue = Math.floor(currentRevenue * (Math.random() * 0.4 + 0.7)); // 70-110% of current
  
  const attendeeGrowth = Math.floor(((currentAttendees - prevAttendees) / prevAttendees) * 100);
  const revenueGrowth = Math.floor(((currentRevenue - prevRevenue) / prevRevenue) * 100);
  
  const ticketTypes = [
    { name: "General Admission", price: 25 },
    { name: "VIP", price: 75 },
    { name: "Early Bird", price: 20 },
    { name: "Group (5+)", price: 22 }
  ];
  
  const ticketBreakdown = ticketTypes.map(type => {
    const quantitySold = Math.floor(Math.random() * 100) + 20;
    return {
      ticket_type: type.name,
      price: type.price,
      quantity_sold: quantitySold,
      revenue: type.price * quantitySold
    };
  });
  
  const demographicCategories = ["Students", "Professionals", "Tourists", "Locals"];
  const attendanceDemographics = demographicCategories.map(category => {
    const value = Math.floor(Math.random() * 100) + 50;
    return {
      category,
      value,
      percentage: Math.floor((value / currentAttendees) * 100)
    };
  });
  
  return {
    id: eventId,
    name: `Event ${eventId.split('-')[1]}`,
    date: new Date().toISOString().split('T')[0],
    venue_name: `Venue ${Math.floor(Math.random() * 5) + 1}`,
    total_attendees: currentAttendees,
    total_revenue: currentRevenue,
    historical_comparison: {
      event_name: `Previous Event`,
      previous_date: subDays(new Date(), 90).toISOString().split('T')[0],
      previous_attendees: prevAttendees,
      previous_revenue: prevRevenue,
      attendee_growth: attendeeGrowth,
      revenue_growth: revenueGrowth
    },
    ticket_breakdown: ticketBreakdown,
    attendance_demographics: attendanceDemographics
  };
}

// Mock audience demographics data fetch function
export async function fetchAudienceDemographics(promoterId: string): Promise<AudienceDemographicData[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 20 },
    { name: '45+', value: 20 },
  ];
}

// Mock audience retention data fetch function
export async function fetchAudienceRetention(promoterId: string): Promise<AudienceRetentionData[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  const year = new Date().getFullYear();
  
  return months.map((month, idx) => {
    // Create a cohort with progressively less data as we get to more recent months
    return {
      cohort: `${month} ${year}`,
      month0: 100, // All cohorts start at 100%
      month1: idx >= 3 ? 0 : Math.floor(Math.random() * 30) + 60, // 60-90%
      month2: idx >= 2 ? 0 : Math.floor(Math.random() * 20) + 50, // 50-70%
      month3: idx >= 1 ? 0 : Math.floor(Math.random() * 20) + 40  // 40-60%
    };
  });
}

// Mock campaign ROI data fetch function
export async function fetchCampaignROI(campaignId: string): Promise<CampaignROIData> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const marketingCost = Math.floor(Math.random() * 3000) + 1000;
  const revenue = Math.floor(Math.random() * 8000) + 2000;
  const roi = parseFloat(((revenue - marketingCost) / marketingCost * 100).toFixed(2));
  
  const channels = [
    { name: 'Social Media', cost: Math.floor(marketingCost * 0.4), conversions: Math.floor(Math.random() * 100) + 50, revenue: Math.floor(revenue * 0.45) },
    { name: 'Email', cost: Math.floor(marketingCost * 0.25), conversions: Math.floor(Math.random() * 60) + 30, revenue: Math.floor(revenue * 0.3) },
    { name: 'Influencers', cost: Math.floor(marketingCost * 0.2), conversions: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(revenue * 0.15) },
    { name: 'Other', cost: Math.floor(marketingCost * 0.15), conversions: Math.floor(Math.random() * 20) + 5, revenue: Math.floor(revenue * 0.1) },
  ];
  
  const timeframes = [
    { period: 'Week 1', cost: Math.floor(marketingCost * 0.3), revenue: Math.floor(revenue * 0.2), roi: 0 },
    { period: 'Week 2', cost: Math.floor(marketingCost * 0.3), revenue: Math.floor(revenue * 0.3), roi: 0 },
    { period: 'Week 3', cost: Math.floor(marketingCost * 0.2), revenue: Math.floor(revenue * 0.25), roi: 0 },
    { period: 'Week 4', cost: Math.floor(marketingCost * 0.2), revenue: Math.floor(revenue * 0.25), roi: 0 },
  ];
  
  // Calculate ROI for each timeframe
  timeframes.forEach(tf => {
    tf.roi = parseFloat(((tf.revenue - tf.cost) / tf.cost * 100).toFixed(2));
  });
  
  return {
    campaignId,
    campaignName: `Campaign ${campaignId.split('-')[1]}`,
    startDate: subDays(new Date(), 30).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    marketingCost,
    revenue,
    ticketsSold: Math.floor(Math.random() * 300) + 100,
    roi,
    channels,
    timeframes
  };
}
