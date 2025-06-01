
import React, { useState } from 'react';
import { InfluentialUser } from '@/types/AudienceTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Star, Users } from 'lucide-react';

interface InfluencerListProps {
  influencers: InfluentialUser[];
  onSelectUser: (userId: string) => void;
}

export const InfluencerList: React.FC<InfluencerListProps> = ({
  influencers,
  onSelectUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'influence_score' | 'follower_count' | 'engagement_rate'>('influence_score');
  
  // Filter and sort influencers
  const filteredInfluencers = influencers
    .filter(influencer => 
      influencer.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.expertise_areas?.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b[sortField] - a[sortField]);

  // Format an initial for the avatar
  const getInitial = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Get a color class based on influence score
  const getInfluenceColor = (score: number) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  // Format a percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search influencers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm whitespace-nowrap">Sort by:</label>
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="influence_score">Influence Score</SelectItem>
              <SelectItem value="follower_count">Follower Count</SelectItem>
              <SelectItem value="engagement_rate">Engagement Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredInfluencers.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No influencers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Influence Score</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Connected Segments</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInfluencers.map((influencer) => (
                  <TableRow key={influencer.user_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className={getInfluenceColor(influencer.influence_score)}>
                            {getInitial(influencer.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{influencer.display_name}</p>
                          <div className="flex gap-1 mt-1">
                            {influencer.expertise_areas?.map((area, i) => (
                              <Badge variant="secondary" key={i} className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(influencer.influence_score / 10) * 100}%` }}
                          />
                        </div>
                        <span>{influencer.influence_score.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{influencer.follower_count.toLocaleString()}</TableCell>
                    <TableCell>{formatPercent(influencer.engagement_rate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{influencer.connected_segments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectUser(influencer.user_id)}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
