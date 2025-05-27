
export interface EventReport {
  id: string;
  eventId: string;
  eventName: string;
  reportType: 'attendance' | 'revenue' | 'marketing' | 'comprehensive';
  generatedAt: string;
  reportData: {
    summary: {
      totalTicketsSold: number;
      totalRevenue: number;
      attendanceRate: number;
      conversionRate: number;
    };
    breakdown: {
      ticketTypes: Array<{
        name: string;
        sold: number;
        revenue: number;
        percentage: number;
      }>;
      timelineSales: Array<{
        date: string;
        sales: number;
        revenue: number;
      }>;
      demographics: {
        ageGroups: Array<{ range: string; count: number; percentage: number }>;
        locations: Array<{ city: string; count: number; percentage: number }>;
      };
    };
    marketing: {
      campaignPerformance: Array<{
        name: string;
        impressions: number;
        clicks: number;
        conversions: number;
        cost: number;
        roi: number;
      }>;
      trafficSources: Array<{
        source: string;
        visitors: number;
        conversions: number;
        conversionRate: number;
      }>;
    };
    insights: Array<{
      type: 'positive' | 'negative' | 'neutral';
      title: string;
      description: string;
      recommendation?: string;
    }>;
  };
}

export interface CustomDashboard {
  id: string;
  promoterId: string;
  name: string;
  description?: string;
  layout: {
    widgets: Array<{
      id: string;
      type: 'chart' | 'metric' | 'table' | 'timeline';
      position: { x: number; y: number; width: number; height: number };
      config: {
        dataSource: string;
        chartType?: 'line' | 'bar' | 'pie' | 'area';
        metrics?: string[];
        filters?: Record<string, any>;
        title: string;
      };
    }>;
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComparativeAnalysis {
  id: string;
  events: Array<{
    id: string;
    name: string;
    date: string;
  }>;
  metrics: {
    attendance: Array<{ eventId: string; value: number; change?: number }>;
    revenue: Array<{ eventId: string; value: number; change?: number }>;
    conversionRate: Array<{ eventId: string; value: number; change?: number }>;
    marketingEfficiency: Array<{ eventId: string; value: number; change?: number }>;
  };
  insights: Array<{
    type: 'trend' | 'outlier' | 'best_practice';
    title: string;
    description: string;
    affectedEvents: string[];
  }>;
  generatedAt: string;
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  customFields?: string[];
}

// Mock data generation functions
export const generateEventReport = async (eventId: string, reportType: EventReport['reportType']): Promise<EventReport> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const reportData = {
    summary: {
      totalTicketsSold: Math.floor(Math.random() * 500) + 100,
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      attendanceRate: Math.random() * 0.3 + 0.7, // 70-100%
      conversionRate: Math.random() * 0.1 + 0.05 // 5-15%
    },
    breakdown: {
      ticketTypes: [
        { name: 'General Admission', sold: 200, revenue: 15000, percentage: 60 },
        { name: 'VIP', sold: 50, revenue: 7500, percentage: 15 },
        { name: 'Early Bird', sold: 100, revenue: 8000, percentage: 25 }
      ],
      timelineSales: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 2000) + 500
      })),
      demographics: {
        ageGroups: [
          { range: '18-24', count: 120, percentage: 24 },
          { range: '25-34', count: 180, percentage: 36 },
          { range: '35-44', count: 140, percentage: 28 },
          { range: '45+', count: 60, percentage: 12 }
        ],
        locations: [
          { city: 'New York', count: 200, percentage: 40 },
          { city: 'Brooklyn', count: 150, percentage: 30 },
          { city: 'Queens', count: 100, percentage: 20 },
          { city: 'Bronx', count: 50, percentage: 10 }
        ]
      }
    },
    marketing: {
      campaignPerformance: [
        { name: 'Social Media', impressions: 50000, clicks: 2500, conversions: 125, cost: 1500, roi: 8.33 },
        { name: 'Email Marketing', impressions: 10000, clicks: 800, conversions: 80, cost: 200, roi: 40 },
        { name: 'Influencer Partnership', impressions: 25000, clicks: 1250, conversions: 100, cost: 2000, roi: 5 }
      ],
      trafficSources: [
        { source: 'Direct', visitors: 1200, conversions: 240, conversionRate: 0.2 },
        { source: 'Social Media', visitors: 2500, conversions: 125, conversionRate: 0.05 },
        { source: 'Email', visitors: 800, conversions: 80, conversionRate: 0.1 },
        { source: 'Search', visitors: 600, conversions: 60, conversionRate: 0.1 }
      ]
    },
    insights: [
      {
        type: 'positive' as const,
        title: 'Strong Early Bird Sales',
        description: 'Early bird tickets sold 40% faster than previous events',
        recommendation: 'Consider extending early bird period for future events'
      },
      {
        type: 'negative' as const,
        title: 'Low Social Media Conversion',
        description: 'Social media campaigns have lower conversion rates',
        recommendation: 'Review targeting and ad creative for social campaigns'
      },
      {
        type: 'neutral' as const,
        title: 'Steady Sales Pattern',
        description: 'Sales following typical event timeline with peak 2 weeks before event'
      }
    ]
  };

  return {
    id: `report-${Date.now()}`,
    eventId,
    eventName: `Sample Event ${eventId.slice(-4)}`,
    reportType,
    generatedAt: new Date().toISOString(),
    reportData
  };
};

export const generateComparativeAnalysis = async (eventIds: string[]): Promise<ComparativeAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const events = eventIds.map(id => ({
    id,
    name: `Event ${id.slice(-4)}`,
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));

  return {
    id: `comparison-${Date.now()}`,
    events,
    metrics: {
      attendance: eventIds.map(id => ({
        eventId: id,
        value: Math.floor(Math.random() * 400) + 100,
        change: (Math.random() - 0.5) * 0.4 // -20% to +20%
      })),
      revenue: eventIds.map(id => ({
        eventId: id,
        value: Math.floor(Math.random() * 40000) + 10000,
        change: (Math.random() - 0.5) * 0.6 // -30% to +30%
      })),
      conversionRate: eventIds.map(id => ({
        eventId: id,
        value: Math.random() * 0.1 + 0.05,
        change: (Math.random() - 0.5) * 0.1 // -5% to +5%
      })),
      marketingEfficiency: eventIds.map(id => ({
        eventId: id,
        value: Math.random() * 10 + 2,
        change: (Math.random() - 0.5) * 0.8 // -40% to +40%
      }))
    },
    insights: [
      {
        type: 'trend',
        title: 'Improving Conversion Rates',
        description: 'Recent events show 15% improvement in conversion rates',
        affectedEvents: eventIds.slice(0, 2)
      },
      {
        type: 'outlier',
        title: 'Exceptional Performance',
        description: 'One event significantly outperformed others in revenue',
        affectedEvents: [eventIds[0]]
      }
    ],
    generatedAt: new Date().toISOString()
  };
};

export const getCustomDashboards = async (promoterId: string): Promise<CustomDashboard[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'dashboard-1',
      promoterId,
      name: 'Event Performance Overview',
      description: 'High-level metrics for all events',
      layout: {
        widgets: [
          {
            id: 'widget-1',
            type: 'metric',
            position: { x: 0, y: 0, width: 6, height: 4 },
            config: {
              dataSource: 'events',
              metrics: ['totalRevenue'],
              title: 'Total Revenue'
            }
          },
          {
            id: 'widget-2',
            type: 'chart',
            position: { x: 6, y: 0, width: 6, height: 4 },
            config: {
              dataSource: 'tickets',
              chartType: 'line',
              metrics: ['sales'],
              title: 'Ticket Sales Trend'
            }
          }
        ]
      },
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const exportData = async (options: ExportOptions): Promise<{ url: string; filename: string }> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Simulate file generation
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `event-report-${timestamp}.${options.format}`;
  
  return {
    url: `#download-${filename}`,
    filename
  };
};
