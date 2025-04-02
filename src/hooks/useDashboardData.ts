
import { useState, useEffect } from 'react';

// Types
export interface DashboardStats {
  totalVisits: number;
  newVisitorsToday: number;
  returningRate: number;
  pendingBarCrawls: number;
  reviewsThisWeek: number;
  avgRating: number;
  topMocktail: string;
  topMocktailOrders: number;
  // Added properties to match StatsData requirements
  revenue: string;
  totalRating: number;
  visitorCount: number;
}

export interface VisitorData {
  name: string;
  visitors: number;
  returningVisitors: number;
}

export interface RatingData {
  name: string;
  rating: number;
}

export interface MocktailData {
  name: string;
  orders: number;
  color: string;
}

export interface BarCrawlData {
  name: string;
  value: number;
  color: string;
}

interface DashboardData {
  stats: DashboardStats;
  visitorData: VisitorData[];
  ratingData: RatingData[];
  mocktailData: MocktailData[];
  barCrawlData: BarCrawlData[];
  isLoading: boolean;
}

export const useDashboardData = (): DashboardData => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data - in a real implementation, this would come from Supabase
  const stats: DashboardStats = {
    totalVisits: 278,
    newVisitorsToday: 12,
    returningRate: 62,
    pendingBarCrawls: 3,
    reviewsThisWeek: 8,
    avgRating: 4.7,
    topMocktail: "Blue Lagoon",
    topMocktailOrders: 42,
    // Added new properties to match StatsData requirements
    revenue: "$2,850",
    totalRating: 4.7,  // Using avgRating value
    visitorCount: 278  // Using totalVisits value
  };
  
  // Sample visitor data
  const visitorData: VisitorData[] = [
    { name: 'Jan', visitors: 140, returningVisitors: 65 },
    { name: 'Feb', visitors: 156, returningVisitors: 78 },
    { name: 'Mar', visitors: 190, returningVisitors: 95 },
    { name: 'Apr', visitors: 205, returningVisitors: 110 },
    { name: 'May', visitors: 245, returningVisitors: 135 },
    { name: 'Jun', visitors: 278, returningVisitors: 173 }
  ];
  
  // Sample rating data
  const ratingData: RatingData[] = [
    { name: 'Jan', rating: 4.2 },
    { name: 'Feb', rating: 4.3 },
    { name: 'Mar', rating: 4.5 },
    { name: 'Apr', rating: 4.5 },
    { name: 'May', rating: 4.6 },
    { name: 'Jun', rating: 4.7 }
  ];
  
  // Sample mocktail data
  const mocktailData: MocktailData[] = [
    { name: 'Blue Lagoon', orders: 42, color: '#3b82f6' },
    { name: 'Tropical Paradise', orders: 36, color: '#f59e0b' },
    { name: 'Virgin Mojito', orders: 28, color: '#10b981' },
    { name: 'Strawberry Daiquiri', orders: 22, color: '#ec4899' },
    { name: 'Piña Colada', orders: 18, color: '#8b5cf6' }
  ];
  
  // Sample bar crawl data
  const barCrawlData: BarCrawlData[] = [
    { name: 'Downtown Crawl', value: 24, color: '#8b5cf6' },
    { name: 'Friday Night Tour', value: 18, color: '#f97316' },
    { name: 'Weekend Warriors', value: 15, color: '#0ea5e9' },
    { name: 'College Night', value: 12, color: '#ec4899' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    stats,
    visitorData,
    ratingData,
    mocktailData,
    barCrawlData,
    isLoading
  };
};
