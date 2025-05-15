
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, ArrowUpDown, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

import { ImprovementItem, SortField, SortOrder, FeatureBusinessValueType } from './types';

interface ProposedImprovementsTabProps {
  improvements: ImprovementItem[];
}

const ProposedImprovementsTab: React.FC<ProposedImprovementsTabProps> = ({ improvements }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showLovableCompatible, setShowLovableCompatible] = useState<boolean>(false);

  // Filter and sort improvements based on current state
  const filteredImprovements = useMemo(() => {
    return improvements
      .filter(item => {
        // Text search
        const matchesSearch = 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Status filter
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        
        // Tab filter
        const matchesTab = 
          activeTab === 'all' || 
          (activeTab === 'critical' && item.priority === 'critical') ||
          (activeTab === 'high' && item.priority === 'high') ||
          (activeTab === 'lovable' && item.lovableCompatible);
        
        // Lovable compatibility filter  
        const matchesLovable = !showLovableCompatible || item.lovableCompatible;
        
        return matchesSearch && matchesStatus && matchesTab && matchesLovable;
      })
      .sort((a, b) => {
        // If sortField is not available, default to title
        const fieldA = a[sortField] !== undefined ? a[sortField] : a.title;
        const fieldB = b[sortField] !== undefined ? b[sortField] : b.title;
        
        // Handle string comparison
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortOrder === 'asc' 
            ? fieldA.localeCompare(fieldB) 
            : fieldB.localeCompare(fieldA);
        }
        
        // Handle number or boolean comparison
        return sortOrder === 'asc' 
          ? (fieldA as number) - (fieldB as number) 
          : (fieldB as number) - (fieldA as number);
      });
  }, [improvements, searchTerm, filterStatus, activeTab, showLovableCompatible, sortField, sortOrder]);

  const renderStatusBadge = (status: string) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;

    switch (status) {
      case 'implemented':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case 'in-progress':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case 'planned':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case 'proposed':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <Badge className={`${bgColor} ${textColor} flex items-center gap-1`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderPriorityBadge = (priority: FeatureBusinessValueType) => {
    let bgColor = '';
    let textColor = '';

    switch (priority) {
      case 'critical':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'high':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        break;
      case 'medium':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'low':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <Badge className={`${bgColor} ${textColor}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const renderImprovementCard = (item: ImprovementItem) => {
    // Helper function to convert numeric values to text ratings for UI
    const getEffortText = (effort: number) => {
      if (effort >= 5) return 'Very High';
      if (effort >= 4) return 'High';
      if (effort >= 3) return 'Medium';
      if (effort >= 2) return 'Low';
      return 'Very Low';
    };
    
    return (
      <Card key={item.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {renderStatusBadge(item.status)}
              {renderPriorityBadge(item.priority as FeatureBusinessValueType)}
              {item.type && (
                <Badge variant="outline">
                  {item.type === 'new-feature' ? 'New Feature' : 'Enhancement'}
                </Badge>
              )}
              {item.lovableCompatible && (
                <Badge className="bg-blue-100 text-blue-800">Lovable Compatible</Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {item.category && <span className="mr-2">{item.category}</span>}
            {item.createdAt && <span className="text-xs">Added on {new Date(item.createdAt).toLocaleDateString()}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{item.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Effort:</div>
              <div className="text-sm">{getEffortText(item.effort)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Impact:</div>
              <div className="text-sm">{getEffortText(item.impact)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Difficulty:</div>
              <div className="text-sm">{item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</div>
            </div>
            {item.targetDate && (
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Target Date:</div>
                <div className="text-sm">{new Date(item.targetDate).toLocaleDateString()}</div>
              </div>
            )}
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {item.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {item.assignedTo && (
            <div className="flex items-center mt-4">
              <div className="text-sm font-medium mr-2">Assigned to:</div>
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.assignedTo}`} />
                <AvatarFallback>{item.assignedTo.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm">{item.assignedTo}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposed Improvements</CardTitle>
        <CardDescription>
          Review and track proposed improvements and feature requests for the system
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="all">All Improvements</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="lovable">Lovable Compatible</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search improvements..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="proposed">Proposed</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="gap-1"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="effort">Effort</SelectItem>
                <SelectItem value="impact">Impact</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="votes">Votes</SelectItem>
                <SelectItem value="submittedDate">Submitted Date</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lovable" 
                checked={showLovableCompatible}
                onCheckedChange={(checked) => setShowLovableCompatible(checked as boolean)}
              />
              <Label htmlFor="lovable">Lovable Compatible Only</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredImprovements.length > 0 ? (
          <div>
            {filteredImprovements.map(item => renderImprovementCard(item))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No improvements match your search criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposedImprovementsTab;
