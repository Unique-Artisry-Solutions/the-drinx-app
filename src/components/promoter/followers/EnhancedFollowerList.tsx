
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Mail, 
  MessageSquare, 
  Calendar,
  Bell,
  BellOff,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatDistanceToNow } from 'date-fns';
import { FollowerListProps, FollowerFilters } from '@/types/FollowerComponentTypes';
import FollowerErrorBoundary from './FollowerErrorBoundary';
import { FollowerListSkeleton } from './FollowerLoadingStates';

interface EnhancedFollowerListProps extends FollowerListProps {
  onBulkAction?: (action: string, selectedFollowers: string[]) => void;
  onExport?: (format: 'csv' | 'xlsx', selectedFollowers: string[]) => void;
}

const EnhancedFollowerList: React.FC<EnhancedFollowerListProps> = ({ 
  promoterId,
  searchTerm = '',
  filters,
  showActions = true,
  className = '',
  onError,
  onSuccess,
  onBulkAction,
  onExport
}) => {
  const { followers, isLoading } = useSubscriptions(promoterId);
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState<FollowerFilters>(filters || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredFollowers = useMemo(() => {
    if (!followers) return [];
    
    let filtered = followers.filter(follower => {
      const searchLower = localSearchTerm.toLowerCase();
      const matchesSearch = (
        follower.subscriber_id.toLowerCase().includes(searchLower) ||
        (follower.promoter_name || '').toLowerCase().includes(searchLower)
      );

      if (!matchesSearch) return false;

      // Apply filters
      if (localFilters.status && follower.follow_status !== localFilters.status) return false;
      if (localFilters.notificationsEnabled !== undefined) {
        const hasNotifications = follower.notification_preferences?.events ?? true;
        if (localFilters.notificationsEnabled !== hasNotifications) return false;
      }
      if (localFilters.joinedAfter && new Date(follower.created_at) < localFilters.joinedAfter) return false;
      if (localFilters.joinedBefore && new Date(follower.created_at) > localFilters.joinedBefore) return false;

      return true;
    });

    return filtered;
  }, [followers, localSearchTerm, localFilters]);

  const paginatedFollowers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFollowers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFollowers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredFollowers.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFollowers(paginatedFollowers.map(f => f.id));
    } else {
      setSelectedFollowers([]);
    }
  };

  const handleSelectFollower = (followerId: string, checked: boolean) => {
    if (checked) {
      setSelectedFollowers(prev => [...prev, followerId]);
    } else {
      setSelectedFollowers(prev => prev.filter(id => id !== followerId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (onBulkAction && selectedFollowers.length > 0) {
      onBulkAction(action, selectedFollowers);
      setSelectedFollowers([]);
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    const exportIds = selectedFollowers.length > 0 ? selectedFollowers : filteredFollowers.map(f => f.id);
    if (onExport) {
      onExport(format, exportIds);
    }
  };

  if (isLoading) {
    return <FollowerListSkeleton count={itemsPerPage} />;
  }

  if (filteredFollowers.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            {localSearchTerm ? 'No followers found matching your search.' : 'No followers yet.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const allSelected = paginatedFollowers.length > 0 && selectedFollowers.length === paginatedFollowers.length;
  const someSelected = selectedFollowers.length > 0;

  return (
    <FollowerErrorBoundary onError={onError}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Followers ({filteredFollowers.length})</span>
            <div className="flex items-center gap-2">
              {someSelected && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedFollowers.length} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('message')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardTitle>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={localFilters.status || 'all'}
                onValueChange={(value) => setLocalFilters(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : value as any
                }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={localFilters.notificationsEnabled === undefined ? 'all' : 
                       localFilters.notificationsEnabled ? 'enabled' : 'disabled'}
                onValueChange={(value) => setLocalFilters(prev => ({ 
                  ...prev, 
                  notificationsEnabled: value === 'all' ? undefined : value === 'enabled'
                }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Bulk Selection Header */}
          {showActions && (
            <div className="flex items-center gap-2 mb-4 p-2 border rounded-lg bg-muted/20">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all followers"
              />
              <span className="text-sm text-muted-foreground">
                Select all on this page
              </span>
            </div>
          )}

          {/* Followers List */}
          <div className="space-y-4">
            {paginatedFollowers.map((follower, index) => {
              const joinedDate = new Date(follower.created_at);
              const hasNotifications = follower.notification_preferences?.events ?? true;
              const isSelected = selectedFollowers.includes(follower.id);
              
              return (
                <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {showActions && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectFollower(follower.id, checked as boolean)}
                        aria-label={`Select follower ${index + 1}`}
                      />
                    )}
                    
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${follower.subscriber_id}`} />
                      <AvatarFallback>
                        {follower.subscriber_id.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Follower #{(currentPage - 1) * itemsPerPage + index + 1}</h4>
                        {hasNotifications ? (
                          <Badge variant="secondary" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Notifications On
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <BellOff className="h-3 w-3 mr-1" />
                            Notifications Off
                          </Badge>
                        )}
                        <Badge variant={follower.follow_status === 'active' ? 'default' : 'secondary'}>
                          {follower.follow_status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}
                        </span>
                        <span>ID: {follower.subscriber_id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  {showActions && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredFollowers.length)} of {filteredFollowers.length} followers
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </FollowerErrorBoundary>
  );
};

export default EnhancedFollowerList;
