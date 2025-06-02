
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SearchFilterProps {
  filters: {
    categories: string[];
    priceRange: [number, number];
    rating: number;
  };
  onFiltersChange: (filters: any) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ filters, onFiltersChange }) => {
  const categories = ['Bar', 'Restaurant', 'Cafe', 'Lounge'];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Categories</Label>
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label htmlFor={category}>{category}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="mt-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, priceRange: value as [number, number] })
              }
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Minimum Rating</Label>
          <div className="mt-2">
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, rating: value[0] })
              }
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {filters.rating} stars and above
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
