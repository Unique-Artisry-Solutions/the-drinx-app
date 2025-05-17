
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  FilterIcon,
  SearchIcon,
  CheckIcon,
  XIcon
} from "lucide-react";

import { ImprovementItem, SortField, SortOrder } from './types';

interface ProposedImprovementsTabProps {
  improvements: ImprovementItem[];
}

const ProposedImprovementsTab: React.FC<ProposedImprovementsTabProps> = ({ improvements }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Sort and filter improvements
  const filteredImprovements = useMemo(() => {
    return improvements
      .filter(item => {
        // Search term filter
        const matchesSearch = searchTerm === '' || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        // Type filter
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        // Sort by selected field
        if (sortField === 'priority') {
          return sortOrder === 'asc' ? a.priority - b.priority : b.priority - a.priority;
        } else if (sortField === 'votes') {
          return sortOrder === 'asc' ? a.votes - b.votes : b.votes - a.votes;
        } else if (sortField === 'effort' || sortField === 'impact') {
          const effortMap = { low: 1, medium: 2, high: 3 };
          const aVal = effortMap[a[sortField] as keyof typeof effortMap];
          const bVal = effortMap[b[sortField] as keyof typeof effortMap];
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        } else if (sortField === 'status') {
          return sortOrder === 'asc' 
            ? a.status.localeCompare(b.status) 
            : b.status.localeCompare(a.status);
        } else if (sortField === 'submittedDate') {
          return sortOrder === 'asc'
            ? new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime()
            : new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
        } else if (sortField === 'title') {
          return sortOrder === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        } else if (sortField === 'type') {
          return sortOrder === 'asc' 
            ? a.type.localeCompare(b.type) 
            : b.type.localeCompare(a.type);
        } else if (sortField === 'lovableCompatible') {
          return sortOrder === 'asc' 
            ? Number(a.lovableCompatible) - Number(b.lovableCompatible) 
            : Number(b.lovableCompatible) - Number(a.lovableCompatible);
        } else if (sortField === 'name') {
          return sortOrder === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [improvements, searchTerm, sortField, sortOrder, typeFilter]);
  
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending order
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  // Count improvements by type
  const typeCounts = useMemo(() => {
    const counts = {
      all: improvements.length,
      'new-feature': 0,
      enhancement: 0,
      'bug-fix': 0,
      refactor: 0
    };
    
    improvements.forEach(item => {
      counts[item.type as keyof typeof counts] = (counts[item.type as keyof typeof counts] || 0) + 1;
    });
    
    return counts;
  }, [improvements]);
  
  // Count improvements by status
  const statusCounts = useMemo(() => {
    const counts = {
      proposed: 0,
      approved: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0
    };
    
    improvements.forEach(item => {
      counts[item.status as keyof typeof counts] = (counts[item.status as keyof typeof counts] || 0) + 1;
    });
    
    return counts;
  }, [improvements]);
  
  // Helper function to render improvement type badge
  const renderTypeBadge = (type: string) => {
    let color = '';
    switch (type) {
      case 'new-feature':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'enhancement':
        color = 'bg-purple-100 text-purple-800';
        break;
      case 'bug-fix':
        color = 'bg-red-100 text-red-800';
        break;
      case 'refactor':
        color = 'bg-gray-100 text-gray-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <Badge className={color}>
        {type === 'new-feature' ? 'New Feature' :
         type === 'bug-fix' ? 'Bug Fix' :
         type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Improvement Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">New Features</div>
                <div className="text-2xl font-bold">{typeCounts['new-feature']}</div>
              </div>
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Enhancements</div>
                <div className="text-2xl font-bold">{typeCounts.enhancement}</div>
              </div>
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Bug Fixes</div>
                <div className="text-2xl font-bold">{typeCounts['bug-fix']}</div>
              </div>
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Refactors</div>
                <div className="text-2xl font-bold">{typeCounts.refactor}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Proposed</div>
                <div className="text-2xl font-bold">{statusCounts.proposed}</div>
              </div>
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Approved</div>
                <div className="text-2xl font-bold">{statusCounts.approved}</div>
              </div>
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">In Progress</div>
                <div className="text-2xl font-bold">{statusCounts.in_progress}</div>
              </div>
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Completed</div>
                <div className="text-2xl font-bold">{statusCounts.completed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Proposed Improvements</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input 
                className="pl-8 w-64" 
                placeholder="Search improvements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select 
              value={typeFilter} 
              onValueChange={(value) => setTypeFilter(value as string)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new-feature">New Features</SelectItem>
                <SelectItem value="enhancement">Enhancements</SelectItem>
                <SelectItem value="bug-fix">Bug Fixes</SelectItem>
                <SelectItem value="refactor">Refactors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSortChange('title')}>
                  Title
                  {sortField === 'title' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('type')}>
                  Type
                  {sortField === 'type' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('impact')}>
                  Impact
                  {sortField === 'impact' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('effort')}>
                  Effort
                  {sortField === 'effort' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('priority')}>
                  Priority
                  {sortField === 'priority' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('votes')}>
                  Votes
                  {sortField === 'votes' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('status')}>
                  Status
                  {sortField === 'status' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('lovableCompatible')}>
                  Lovable
                  {sortField === 'lovableCompatible' && (sortOrder === 'asc' ? <ArrowUpIcon className="inline ml-1 w-3 h-3" /> : <ArrowDownIcon className="inline ml-1 w-3 h-3" />)}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImprovements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{renderTypeBadge(item.type)}</TableCell>
                  <TableCell>
                    <Badge variant={item.impact === 'high' ? 'destructive' : item.impact === 'medium' ? 'default' : 'outline'}>
                      {item.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.effort === 'high' ? 'destructive' : item.effort === 'medium' ? 'default' : 'outline'}>
                      {item.effort}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center font-bold">
                      {item.priority}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{item.votes}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === 'approved' ? 'default' :
                      item.status === 'in_progress' ? 'secondary' :
                      item.status === 'completed' ? 'success' :
                      item.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.lovableCompatible ? 
                      <CheckIcon className="h-5 w-5 text-green-500" /> : 
                      <XIcon className="h-5 w-5 text-red-500" />
                    }
                  </TableCell>
                </TableRow>
              ))}
              {filteredImprovements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No improvements match your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposedImprovementsTab;
