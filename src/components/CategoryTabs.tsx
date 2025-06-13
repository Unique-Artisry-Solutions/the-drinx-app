
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type CategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits' | 'promoters';

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <Tabs value={selectedCategory} onValueChange={(value) => onCategoryChange(value as CategoryType)}>
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
        <TabsTrigger value="popular" className="text-xs sm:text-sm">Popular</TabsTrigger>
        <TabsTrigger value="trending" className="text-xs sm:text-sm">Trending</TabsTrigger>
        <TabsTrigger value="new" className="text-xs sm:text-sm">New</TabsTrigger>
        <TabsTrigger value="personalized" className="text-xs sm:text-sm">For You</TabsTrigger>
        <TabsTrigger value="swig-circuits" className="text-xs sm:text-sm">Swig Circuits</TabsTrigger>
        <TabsTrigger value="promoters" className="text-xs sm:text-sm">Promoters</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
