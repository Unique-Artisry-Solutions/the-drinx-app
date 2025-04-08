
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Glasses, Star, CircleSlash } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DrinkPopularityProps {
  popularDrinks?: Array<{
    cocktail_id: string;
    cocktail_name: string;
    review_count: number;
    average_rating: number;
    unique_reviewers: number;
  }>;
  hasData?: boolean;
}

const DrinkPopularityTab: React.FC<DrinkPopularityProps> = ({ 
  popularDrinks = [], 
  hasData = true 
}) => {
  if (!hasData || popularDrinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Drink Popularity</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <CircleSlash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-material-on-surface-variant">No drink data available</p>
          <p className="mt-2 text-material-on-surface-variant">
            Add drinks to your menu and collect reviews to see statistics here
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format the drinks for the chart
  const formattedDrinks = popularDrinks.map(drink => ({
    name: drink.cocktail_name.length > 20 
      ? `${drink.cocktail_name.substring(0, 18)}...` 
      : drink.cocktail_name,
    reviews: drink.review_count,
    rating: drink.average_rating,
    fullName: drink.cocktail_name  // For tooltip
  }));

  // Find most popular drink
  const topDrink = popularDrinks[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drink Popularity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Glasses className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="font-medium">Most Popular Drink</h3>
            </div>
            {topDrink ? (
              <>
                <p className="text-xl font-bold">{topDrink.cocktail_name}</p>
                <p className="text-sm text-material-on-surface-variant">
                  {topDrink.review_count} reviews from {topDrink.unique_reviewers} customers
                </p>
              </>
            ) : (
              <p className="text-material-on-surface-variant">No popular drinks yet</p>
            )}
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-purple-500 mr-2 fill-purple-500" />
              <h3 className="font-medium">Average Rating</h3>
            </div>
            {topDrink ? (
              <div className="flex items-end">
                <p className="text-2xl font-bold">{topDrink.average_rating.toFixed(1)}</p>
                <p className="text-lg ml-1">/5</p>
              </div>
            ) : (
              <p className="text-material-on-surface-variant">No ratings yet</p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Drink Popularity Comparison</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedDrinks}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, name === 'reviews' ? 'Reviews' : 'Rating']}
                  labelFormatter={(label) => {
                    const drink = formattedDrinks.find(d => d.name === label);
                    return drink ? drink.fullName : label;
                  }}
                />
                <Bar dataKey="reviews" fill="#8884d8" name="Reviews" />
                <Bar dataKey="rating" fill="#82ca9d" name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrinkPopularityTab;
