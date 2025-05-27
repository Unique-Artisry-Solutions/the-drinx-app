
// Base interfaces for the reporting service
export interface EventReport {
  id: string;
  eventId: string;
  eventName: string;
  reportType: 'summary' | 'comprehensive' | 'financial' | 'attendee';
  status: 'generating' | 'completed' | 'failed';
  generatedAt: string;
  metrics: {
    totalAttendees?: number;
    totalRevenue?: number;
    conversionRate?: number;
    ticketsSold?: number;
    averageTicketPrice?: number;
  };
  reportData: any; // Detailed report data
}

export interface ComparativeAnalysis {
  id: string;
  comparedEvents: string[];
  generatedAt: string;
  insights: {
    bestPerforming: {
      eventName: string;
      attendance?: number;
      revenue?: number;
      conversionRate?: number;
    };
    trends: Array<{
      metric: string;
      direction: 'up' | 'down';
      change: string;
      description: string;
    }>;
  };
}

export interface CustomDashboard {
  id: string;
  name: string;
  description?: string;
  promoterId: string;
  isDefault: boolean;
  layout: {
    widgets: Array<{
      id: string;
      type: string;
      config: {
        title: string;
        [key: string]: any;
      };
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'xlsx' | 'json';
  dataType: 'events' | 'attendees' | 'revenue' | 'all';
  dateRange: '7d' | '30d' | '90d' | 'all' | { start: string; end: string; };
  includeMetrics: boolean;
}

// Service implementations
export async function generateEventReport(
  eventId: string, 
  reportType: EventReport['reportType']
): Promise<EventReport> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `report-${Date.now()}`,
    eventId,
    eventName: `Event ${eventId}`,
    reportType,
    status: 'completed',
    generatedAt: new Date().toISOString(),
    metrics: {
      totalAttendees: Math.floor(Math.random() * 500) + 100,
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      conversionRate: Math.random() * 20 + 5,
      ticketsSold: Math.floor(Math.random() * 400) + 80,
      averageTicketPrice: Math.floor(Math.random() * 100) + 25
    },
    reportData: {}
  };
}

export async function generateComparativeAnalysis(eventIds: string[]): Promise<ComparativeAnalysis> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: `comparison-${Date.now()}`,
    comparedEvents: eventIds,
    generatedAt: new Date().toISOString(),
    insights: {
      bestPerforming: {
        eventName: 'Summer Music Festival',
        attendance: 1250,
        revenue: 45000,
        conversionRate: 18.5
      },
      trends: [
        {
          metric: 'Attendance',
          direction: 'up',
          change: '+23%',
          description: 'Attendance has increased significantly across all compared events'
        },
        {
          metric: 'Revenue',
          direction: 'up',
          change: '+15%',
          description: 'Revenue growth driven by higher ticket prices and better conversion'
        },
        {
          metric: 'Conversion Rate',
          direction: 'down',
          change: '-5%',
          description: 'Slight decrease in conversion rate due to increased competition'
        }
      ]
    }
  };
}

export async function getCustomDashboards(promoterId: string): Promise<CustomDashboard[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'dashboard-1',
      name: 'Event Performance Overview',
      description: 'Key metrics for tracking event success',
      promoterId,
      isDefault: true,
      layout: {
        widgets: [
          {
            id: 'widget-1',
            type: 'metric',
            config: { title: 'Total Attendees' }
          },
          {
            id: 'widget-2',
            type: 'chart',
            config: { title: 'Revenue Trend' }
          },
          {
            id: 'widget-3',
            type: 'metric',
            config: { title: 'Conversion Rate' }
          },
          {
            id: 'widget-4',
            type: 'table',
            config: { title: 'Top Events' }
          },
          {
            id: 'widget-5',
            type: 'chart',
            config: { title: 'Attendance by Month' }
          }
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'dashboard-2',
      name: 'Marketing Analytics',
      description: 'Track campaign performance and ROI',
      promoterId,
      isDefault: false,
      layout: {
        widgets: [
          {
            id: 'widget-6',
            type: 'metric',
            config: { title: 'Campaign ROI' }
          },
          {
            id: 'widget-7',
            type: 'chart',
            config: { title: 'Click-through Rate' }
          },
          {
            id: 'widget-8',
            type: 'table',
            config: { title: 'Top Channels' }
          }
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

export async function exportData(options: ExportOptions): Promise<{ url: string; filename: string }> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${options.dataType}_export_${timestamp}.${options.format}`;
  
  // In a real implementation, this would generate the actual file and return a download URL
  return {
    url: `blob:${window.location.origin}/${filename}`,
    filename
  };
}
