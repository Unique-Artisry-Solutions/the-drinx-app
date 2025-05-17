
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImprovementItem, SortField, SortOrder } from './types';
import { Clock, ArrowUp, ArrowDown, Tag, User, Calendar, CheckCircle2 } from 'lucide-react';

interface ProposedImprovementsTabProps {
  improvements: ImprovementItem[];
}

const ProposedImprovementsTab: React.FC<ProposedImprovementsTabProps> = ({ improvements }) => {
  const [filteredImprovements, setFilteredImprovements] = useState<ImprovementItem[]>(improvements);
  const [sortField, setSortField] = useState<SortField>('votes');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    let filtered = [...improvements];
    
    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        improvement => 
          improvement.title.toLowerCase().includes(lowerQuery) || 
          improvement.description.toLowerCase().includes(lowerQuery) ||
          improvement.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply status filter (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(improvement => improvement.status === activeTab);
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(improvement => improvement.category === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'votes') {
        comparison = (a.votes || 0) - (b.votes || 0);
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'impact') {
        comparison = (a.impact) - (b.impact);
      } else if (sortField === 'effort') {
        comparison = (a.effort) - (b.effort);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'createdAt') {
        comparison = a.createdAt.localeCompare(b.createdAt);
      } else if (sortField === 'submittedDate') {
        comparison = (a.submittedDate || '').localeCompare(b.submittedDate || '');
      } else if (sortField === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      } else if (sortField === 'lovableCompatible') {
        comparison = (a.lovableCompatible === b.lovableCompatible) ? 0 : a.lovableCompatible ? -1 : 1;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredImprovements(filtered);
  }, [improvements, sortField, sortOrder, searchQuery, activeTab, selectedCategory]);
  
  // Get unique categories for the filter dropdown
  const categories = Array.from(new Set(improvements.map(item => item.category)));
  
  // Get count of improvements by status for the tabs
  const statusCounts = improvements.reduce((acc, imp) => {
    const status = imp.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Helper to render badges for improvement types
  const renderTypeBadge = (type?: string) => {
    if (!type) return null;
    
    return (
      <Badge variant="outline" className={
        type === 'enhancement' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
        'bg-purple-50 text-purple-700 border-purple-200'
      }>
        {type === 'enhancement' ? 'Enhancement' : 'New Feature'}
      </Badge>
    );
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Helper to render effort/impact tags
  const getEffortImpactLabel = (value: number) => {
    if (value >= 4) return 'high';
    if (value >= 2) return 'medium';
    return 'low';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search improvements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedCategory || ''}
            onValueChange={(value) => setSelectedCategory(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Sort by votes</SelectItem>
              <SelectItem value="title">Sort by title</SelectItem>
              <SelectItem value="category">Sort by category</SelectItem>
              <SelectItem value="impact">Sort by impact</SelectItem>
              <SelectItem value="effort">Sort by effort</SelectItem>
              <SelectItem value="status">Sort by status</SelectItem>
              <SelectItem value="createdAt">Sort by date</SelectItem>
              <SelectItem value="type">Sort by type</SelectItem>
              <SelectItem value="lovableCompatible">Sort by Lovable compatibility</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({improvements.length})</TabsTrigger>
          <TabsTrigger value="proposed">Proposed ({statusCounts.proposed || 0})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({statusCounts.approved || 0})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({statusCounts.in_progress || 0})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({statusCounts.completed || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredImprovements.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Tag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No improvements found</h3>
              <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredImprovements.map(improvement => (
                <Card key={improvement.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{improvement.title}</CardTitle>
                        <CardDescription className="mt-1">{improvement.category}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {improvement.lovableCompatible !== undefined && (
                          <Badge variant={improvement.lovableCompatible ? "default" : "outline"}>
                            {improvement.lovableCompatible ? "Lovable Compatible" : "Custom Implementation"}
                          </Badge>
                        )}
                        {renderTypeBadge(improvement.type)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-gray-600">{improvement.description}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Impact: {getEffortImpactLabel(improvement.impact)}
                      </Badge>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        Effort: {getEffortImpactLabel(improvement.effort)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {improvement.votes} votes
                      </Badge>
                    </div>
                    
                    {improvement.technicalRequirements && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 font-medium">Technical Requirements</p>
                        <p className="text-sm text-gray-600">{improvement.technicalRequirements}</p>
                      </div>
                    )}
                    
                    {improvement.implementationSteps && improvement.implementationSteps.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 font-medium">Implementation Steps</p>
                        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                          {improvement.implementationSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {improvement.estimatedEffort && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Estimated Effort</p>
                          <p className="text-sm text-gray-600">{improvement.estimatedEffort}</p>
                        </div>
                      )}
                      
                      {improvement.businessImpact && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Business Impact</p>
                          <p className="text-sm text-gray-600">{improvement.businessImpact}</p>
                        </div>
                      )}
                    </div>
                    
                    {improvement.technicalRequirements && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Technical Requirements</p>
                        <p className="text-sm text-gray-600">{improvement.technicalRequirements}</p>
                      </div>
                    )}
                    
                    {improvement.currentStatus && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Current Status</p>
                        <p className="text-sm text-gray-600">{improvement.currentStatus}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 mt-3 border-t text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {improvement.submittedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(improvement.submittedDate || improvement.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposedImprovementsTab;
