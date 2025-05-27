
export interface MobileUsageMetrics {
  activeUsers: number;
  sessionDuration: number;
  screenViews: number;
  appOpens: number;
  crashRate: number;
  retentionRate: number;
}

export interface LocationAnalyticsMetrics {
  totalEvents: number;
  uniqueLocations: number;
  averageAccuracy: number;
  geofenceEvents: number;
  locationPermissions: number;
}

export interface PushNotificationMetrics {
  openRate: number;
  clickThroughRate: number;
  conversionRate: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
}

export interface MobileConversionMetrics {
  conversionRate: number;
  averageOrderValue: number;
  funnelDropoff: Array<{
    step: string;
    users: number;
    dropoffRate: number;
  }>;
  devicePerformance: Array<{
    device: string;
    performance: number;
    conversionRate: number;
  }>;
  userJourney: Array<{
    action: string;
    timestamp: string;
    location?: string;
  }>;
}

export async function getMobileUsageMetrics(promoterId: string): Promise<MobileUsageMetrics> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    activeUsers: Math.floor(Math.random() * 5000) + 1000,
    sessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
    screenViews: Math.floor(Math.random() * 50000) + 10000,
    appOpens: Math.floor(Math.random() * 10000) + 2000,
    crashRate: Math.random() * 2 + 0.5, // percentage
    retentionRate: Math.random() * 30 + 70 // percentage
  };
}

export async function getLocationAnalytics(promoterId: string): Promise<LocationAnalyticsMetrics> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    totalEvents: Math.floor(Math.random() * 10000) + 2000,
    uniqueLocations: Math.floor(Math.random() * 500) + 100,
    averageAccuracy: Math.random() * 50 + 10, // meters
    geofenceEvents: Math.floor(Math.random() * 1000) + 200,
    locationPermissions: Math.random() * 20 + 75 // percentage
  };
}

export async function getPushNotificationMetrics(promoterId: string): Promise<PushNotificationMetrics> {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const totalSent = Math.floor(Math.random() * 50000) + 10000;
  const totalDelivered = Math.floor(totalSent * 0.95);
  const totalOpened = Math.floor(totalDelivered * 0.25);
  
  return {
    openRate: (totalOpened / totalDelivered) * 100,
    clickThroughRate: Math.random() * 15 + 5,
    conversionRate: Math.random() * 8 + 2,
    totalSent,
    totalDelivered,
    totalOpened
  };
}

export async function getMobileConversionMetrics(promoterId: string): Promise<MobileConversionMetrics> {
  await new Promise(resolve => setTimeout(resolve, 900));
  
  return {
    conversionRate: Math.random() * 10 + 15,
    averageOrderValue: Math.floor(Math.random() * 100) + 50,
    funnelDropoff: [
      { step: 'App Open', users: 1000, dropoffRate: 0 },
      { step: 'Event View', users: 750, dropoffRate: 25 },
      { step: 'Ticket Selection', users: 500, dropoffRate: 33.3 },
      { step: 'Checkout', users: 300, dropoffRate: 40 },
      { step: 'Payment', users: 180, dropoffRate: 40 }
    ],
    devicePerformance: [
      { device: 'iPhone', performance: 95, conversionRate: 22 },
      { device: 'Samsung', performance: 88, conversionRate: 18 },
      { device: 'Google Pixel', performance: 92, conversionRate: 20 },
      { device: 'Other Android', performance: 75, conversionRate: 15 }
    ],
    userJourney: [
      { action: 'App Launch', timestamp: new Date().toISOString(), location: 'Home' },
      { action: 'Event Browse', timestamp: new Date().toISOString() },
      { action: 'Location Check', timestamp: new Date().toISOString(), location: 'Downtown' },
      { action: 'Ticket Purchase', timestamp: new Date().toISOString() }
    ]
  };
}
