
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Filter, Search } from "lucide-react";
import { FeatureShowcaseData } from '../../types';

interface FeatureTableProps {
  features: FeatureShowcaseData[];
}

export const FeatureTable: React.FC<FeatureTableProps> = ({ features }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFeatures = features.filter(feature => {
    const matchesUserType = filter === 'all' || feature.userType === filter;
    const matchesSearch = searchTerm === '' || 
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesUserType && matchesSearch;
  });
  
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'implemented':
        return <Badge className="bg-green-500">Implemented</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500">Partial</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500">Blocked</Badge>;
      default:
        return <Badge className="bg-gray-500">Planned</Badge>;
    }
  };
  
  const renderComplexityIndicator = (complexity: string) => {
    switch(complexity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  
  const renderBusinessValueBadge = (value: string) => {
    switch(value) {
      case 'high':
        return <Badge className="bg-purple-100 text-purple-800">High Value</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium Value</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low Value</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by user type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All User Types</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="establishment">Establishments</SelectItem>
              <SelectItem value="individual">Individuals</SelectItem>
              <SelectItem value="promoter">Promoters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Feature</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Complexity</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFeatures.map(feature => (
            <TableRow key={feature.id}>
              <TableCell>
                <div className="flex items-start">
                  <div>
                    <div className="font-medium flex items-center">
                      {feature.name} 
                      {feature.isSignature && (
                        <Star className="ml-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">{feature.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {feature.showcaseCategory}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={
                  feature.userType === 'admin' ? 'bg-violet-100 text-violet-800' :
                  feature.userType === 'establishment' ? 'bg-blue-100 text-blue-800' :
                  feature.userType === 'promoter' ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }>
                  {feature.userType.charAt(0).toUpperCase() + feature.userType.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {renderStatusBadge(feature.implementationStatus)}
              </TableCell>
              <TableCell>
                {renderComplexityIndicator(feature.complexityLevel)}
              </TableCell>
              <TableCell>
                {renderBusinessValueBadge(feature.businessValue)}
              </TableCell>
            </TableRow>
          ))}
          
          {filteredFeatures.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No features match your search or filter criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
