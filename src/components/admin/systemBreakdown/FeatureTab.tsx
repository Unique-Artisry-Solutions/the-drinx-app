
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Server, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeatureItem } from './types';
import { renderStatusBadge, renderDatabaseStatusBadge, renderAccessIcon } from './utils';

// Tags with colors for consistent rendering
const tagColors: Record<string, string> = {
  "promoter": "bg-purple-100 text-purple-800",
  "establishment": "bg-blue-100 text-blue-800",
  "individual": "bg-green-100 text-green-700",
  "admin": "bg-amber-100 text-amber-800",
  "dashboard": "bg-indigo-100 text-indigo-800",
  "analytics": "bg-cyan-100 text-cyan-800",
  "reporting": "bg-teal-100 text-teal-800",
  "communication": "bg-rose-100 text-rose-800",
  "messaging": "bg-pink-100 text-pink-800",
  "contacts": "bg-orange-100 text-orange-800",
  "notifications": "bg-yellow-100 text-yellow-800",
  "events": "bg-lime-100 text-lime-800",
  "promotions": "bg-emerald-100 text-emerald-800",
  "partnerships": "bg-sky-100 text-sky-800"
};

interface FeatureTabProps {
  features: FeatureItem[];
  title: string;
  description: string;
}

const FeatureTab: React.FC<FeatureTabProps> = ({ features, title, description }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter features based on search term and status filter
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Extract and count unique tags for filter options
  const allTags = features.reduce((tags: string[], feature) => {
    if (feature.tags) {
      feature.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);

  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {tags.map(tag => (
          <Badge key={tag} variant="outline" className={tagColors[tag] || "bg-gray-100 text-gray-800"}>
            {tag}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="w-full md:w-2/3">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <Label htmlFor="status-filter" className="sr-only">Filter by status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="partial">Partially Implemented</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-x-auto">
        <Table>
          <TableCaption>
            {filteredFeatures.length} of {features.length} features
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Feature</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Database</TableHead>
              <TableHead className="hidden md:table-cell">Complexity</TableHead>
              <TableHead className="hidden md:table-cell">User Impact</TableHead>
              <TableHead className="hidden lg:table-cell">Access</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeatures.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{feature.name}</div>
                    <div className="text-gray-500 text-sm">{feature.description}</div>
                    {feature.tags && renderTags(feature.tags)}
                  </div>
                </TableCell>
                <TableCell>{renderStatusBadge(feature.status)}</TableCell>
                <TableCell>{renderDatabaseStatusBadge(feature.databaseStatus || feature.dbStatus)}</TableCell>
                <TableCell className="hidden md:table-cell capitalize">{feature.complexity}</TableCell>
                <TableCell className="hidden md:table-cell capitalize">{feature.userImpact}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex space-x-1">
                    {renderAccessIcon(feature.adminAccess, <Database className="h-4 w-4" />, "Admin")}
                    {renderAccessIcon(feature.establishmentAccess, <Server className="h-4 w-4" />, "Establishment")}
                    {renderAccessIcon(feature.individualAccess, <Users className="h-4 w-4" />, "Individual")}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FeatureTab;
