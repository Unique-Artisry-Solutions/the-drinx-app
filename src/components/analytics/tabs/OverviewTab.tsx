
import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DrinkPopularity } from '@/services/establishmentAnalyticsService';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface OverviewTabProps {
  formattedVisitorData: Array<{
    name: string;
    visitors: number;
    returningVisitors: number;
    uniqueVisitors: number;
  }>;
  ratingData: any[];
  popularDrinks: DrinkPopularity[];
  formattedRevenueData: Array<{
    name: string;
    revenue: number;
    transactions: number;
  }>;
}

// Chart components wrapped with memo to prevent unnecessary re-renders
const VisitorGrowthChart = memo(({ data }: { 
  data: Array<{ name: string; visitors: number; returningVisitors: number; uniqueVisitors: number; }> 
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{fontSize: 12}} />
        <YAxis tick={{fontSize: 12}} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="visitors" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
          name="Total Visitors"
        />
        <Line 
          type="monotone" 
          dataKey="uniqueVisitors" 
          stroke="#82ca9d"
          name="Unique Visitors" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

const RatingsChart = memo(({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{fontSize: 12}} />
        <YAxis tick={{fontSize: 12}} domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="rating" fill="#8884d8" name="Average Rating" />
      </BarChart>
    </ResponsiveContainer>
  );
});

const PopularMocktailsChart = memo(({ data }: { data: DrinkPopularity[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data.slice(0, 5).map(drink => ({
          name: drink.cocktail_name.length > 15 
            ? `${drink.cocktail_name.substring(0, 13)}...` 
            : drink.cocktail_name,
          reviews: drink.review_count,
          rating: drink.average_rating,
          fullName: drink.cocktail_name
        }))}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{fontSize: 12}} />
        <YAxis type="category" dataKey="name" tick={{fontSize: 12}} width={120} />
        <Tooltip 
          labelFormatter={(label) => {
            const drink = data.find(d => d.cocktail_name.includes(label));
            return drink ? drink.cocktail_name : label;
          }}
        />
        <Legend />
        <Bar dataKey="reviews" fill="#82ca9d" name="Reviews" />
        <Bar dataKey="rating" fill="#8884d8" name="Rating" />
      </BarChart>
    </ResponsiveContainer>
  );
});

const RevenueTrendsChart = memo(({ data }: { 
  data: Array<{ name: string; revenue: number; transactions: number; }> 
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{fontSize: 12}} />
        <YAxis tick={{fontSize: 12}} />
        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
        <Legend />
        <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
        <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
      </BarChart>
    </ResponsiveContainer>
  );
});

// Empty state components
const EmptyChartState = memo(({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
});

export const OverviewTab = memo(({
  formattedVisitorData,
  ratingData,
  popularDrinks,
  formattedRevenueData
}: OverviewTabProps) => {
  // Check if we have valid visitor data
  const hasVisitorData = formattedVisitorData && formattedVisitorData.length > 0;
  
  // Check if we have valid rating data
  const hasRatingData = ratingData && ratingData.length > 0;

  // Check if we have valid popular drinks data
  const hasPopularDrinksData = popularDrinks && popularDrinks.length > 0;
  
  // Check if we have valid revenue data
  const hasRevenueData = formattedRevenueData && formattedRevenueData.length > 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Visitor Growth</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[320px] w-full">
              {hasVisitorData ? (
                <VisitorGrowthChart data={formattedVisitorData} />
              ) : (
                <EmptyChartState message="No visitor data available for the selected period." />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Ratings Overview</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[320px] w-full">
              {hasRatingData ? (
                <RatingsChart data={ratingData} />
              ) : (
                <EmptyChartState message="No rating data available for the selected period." />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Popular Mocktails</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[360px] w-full">
              {hasPopularDrinksData ? (
                <PopularMocktailsChart data={popularDrinks} />
              ) : (
                <EmptyChartState message="No mocktail data available." />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[320px] w-full">
              {hasRevenueData ? (
                <RevenueTrendsChart data={formattedRevenueData} />
              ) : (
                <EmptyChartState message="No revenue data available for the selected period." />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
});
