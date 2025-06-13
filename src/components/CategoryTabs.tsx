
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
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="popular">Popular</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="new">New</TabsTrigger>
        <TabsTrigger value="personalized">For You</TabsTrigger>
        <TabsTrigger value="swig-circuits">Circuits</TabsTrigger>
        <TabsTrigger value="promoters">Promoters</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
