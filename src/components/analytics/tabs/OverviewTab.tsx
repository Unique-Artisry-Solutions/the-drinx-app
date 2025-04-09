
import React from 'react';
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

export const OverviewTab: React.FC<OverviewTabProps> = ({
  formattedVisitorData,
  ratingData,
  popularDrinks,
  formattedRevenueData
}) => {
  // Check if we have valid visitor data
  const hasVisitorData = formattedVisitorData && formattedVisitorData.length > 0;
  
  // Check if we have valid rating data
  const hasRatingData = ratingData && ratingData.length > 0;

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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedVisitorData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No visitor data available for the selected period.</p>
                </div>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rating" fill="#8884d8" name="Average Rating" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No rating data available for the selected period.</p>
                </div>
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
              {popularDrinks && popularDrinks.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={popularDrinks.slice(0, 5).map(drink => ({
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
                        const drink = popularDrinks.find(d => d.cocktail_name.includes(label));
                        return drink ? drink.cocktail_name : label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="reviews" fill="#82ca9d" name="Reviews" />
                    <Bar dataKey="rating" fill="#8884d8" name="Rating" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No mocktail data available.</p>
                </div>
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
              {formattedRevenueData && formattedRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={formattedRevenueData} 
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No revenue data available for the selected period.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
