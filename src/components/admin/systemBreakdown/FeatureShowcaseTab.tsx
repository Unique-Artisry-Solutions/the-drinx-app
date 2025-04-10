
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BarChart, Download, Filter, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FeatureShowcaseData, FeatureShowcaseCategory, FeatureBusinessValue } from './types';
import SignatureFeatureSpotlight from './components/SignatureFeatureSpotlight';
import FeatureCategoriesDashboard from './components/FeatureCategoriesDashboard';
import BusinessValueSection from './components/BusinessValueSection';
import FeatureTable from './components/showcase/FeatureTable';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prepareFeatureShowcaseData, generateFeatureReport } from './utils/featureShowcaseUtils';
import { useToast } from '@/hooks/use-toast';

interface FeatureShowcaseTabProps {
  adminFeatures: any[];
  establishmentFeatures: any[];
  individualFeatures: any[];
}

const FeatureShowcaseTab: React.FC<FeatureShowcaseTabProps> = ({ 
  adminFeatures,
  establishmentFeatures,
  individualFeatures
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedValue, setSelectedValue] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('spotlight');
  const { toast } = useToast();
  
  // Transform features for showcase display
  const showcaseFeatures = prepareFeatureShowcaseData(
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures
  );
  
  // Filter features based on search and filters
  const filteredFeatures = showcaseFeatures.filter(feature => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      selectedCategory === 'all' || 
      feature.showcaseCategory === selectedCategory;
    
    // Value filter
    const matchesValue = 
      selectedValue === 'all' || 
      feature.businessValue === selectedValue.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesValue;
  });
  
  // Get signature features
  const signatureFeatures = showcaseFeatures.filter(feature => feature.isSignature);
  
  // Extract unique categories for the filter
  const categories = Array.from(
    new Set(showcaseFeatures.map(feature => feature.showcaseCategory))
  );
  
  // Handle export feature report
  const handleExportReport = () => {
    const report = generateFeatureReport(showcaseFeatures, false);
    
    // Create and download the report as a markdown file
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spiritless-feature-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Feature Report Generated",
      description: "The feature report has been exported as a Markdown file.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Feature Showcase</CardTitle>
              <CardDescription>
                Highlight the platform's capabilities to demonstrate value to potential clients
              </CardDescription>
            </div>
            <Button 
              onClick={handleExportReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search features..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger className="w-[180px]">
                  <BarChart className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Business Value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Values</SelectItem>
                    <SelectItem value="high">High Value</SelectItem>
                    <SelectItem value="medium">Medium Value</SelectItem>
                    <SelectItem value="low">Low Value</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="spotlight" className="flex gap-2 items-center">
                <Award className="h-4 w-4" /> 
                Signature Features
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex gap-2 items-center">
                <BarChart className="h-4 w-4" /> 
                Feature Categories
              </TabsTrigger>
              <TabsTrigger value="business" className="flex gap-2 items-center">
                <Star className="h-4 w-4" /> 
                Business Value
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="spotlight">
              <SignatureFeatureSpotlight features={signatureFeatures} />
            </TabsContent>
            
            <TabsContent value="categories">
              <FeatureCategoriesDashboard features={filteredFeatures} />
            </TabsContent>
            
            <TabsContent value="business">
              <BusinessValueSection features={filteredFeatures} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6 pb-2 px-6">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">All Features ({filteredFeatures.length})</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50">
                  Implemented: {filteredFeatures.filter(f => f.implementationStatus === 'implemented').length}
                </Badge>
                <Badge variant="outline" className="bg-amber-50">
                  Partial: {filteredFeatures.filter(f => f.implementationStatus === 'partial').length}
                </Badge>
              </div>
            </div>
            <FeatureTable features={filteredFeatures} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeatureShowcaseTab;
