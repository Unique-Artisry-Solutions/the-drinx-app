
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFollowers } from '@/hooks/useFollowers';
import { Search, Bell, BellOff, Mail, MessageSquare } from 'lucide-react';
import EngagementScoreWidget from './EngagementScoreWidget';
import type { FollowerComponentProps } from '@/types/FollowerComponentTypes';

interface FollowerListProps extends FollowerComponentProps {
  searchTerm?: string;
  maxItems?: number;
  showActions?: boolean;
}

const FollowerList: React.FC<FollowerListProps> = ({ 
  promoterId, 
  searchTerm: externalSearchTerm = '',
  maxItems,
  showActions = true,
  onError,
  onSuccess 
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const { promoterFollowers, isLoading, sendNotification, updatePreferences } = useFollowers(promoterId);

  const searchTerm = externalSearchTerm || internalSearchTerm;

  const filteredFollowers = promoterFollowers?.filter(follower => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      follower.subscriber_id.toLowerCase().includes(searchLower) ||
      follower.promoter_name?.toLowerCase().includes(searchLower) ||
      (follower.engagement_score?.toString() || '0').includes(searchLower) ||
      (follower.engagement_tier || 'bronze').toLowerCase().includes(searchLower)
    );
  }).slice(0, maxItems) || [];

  const handleSendNotification = async (followerId: string) => {
    try {
      await sendNotification.mutateAsync({
        followerId,
        message: 'Hello from your promoter!'
      });
      onSuccess?.({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error('Failed to send notification:', error);
      onError?.(error as Error);
    }
  };

  const toggleNotifications = async (followerId: string, currentPreferences: any) => {
    try {
      await updatePreferences.mutateAsync({
        followerId,
        preferences: {
          ...currentPreferences,
          events: !currentPreferences.events
        }
      });
      onSuccess?.({ message: 'Notification preferences updated' });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      onError?.(error as Error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading followers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Followers ({promoterFollowers?.length || 0})</CardTitle>
          {!externalSearchTerm && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={internalSearchTerm}
                onChange={(e) => setInternalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredFollowers.map((follower) => (
            <div key={follower.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">
                        {follower.promoter_name || `Follower ${follower.subscriber_id.slice(0, 8)}...`}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {follower.follow_status}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {follower.follower_tier}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Engagement Score Widget */}
                    <EngagementScoreWidget
                      followerId={follower.id}
                      score={follower.engagement_score || 0}
                      tier={(follower.engagement_tier || 'bronze') as 'bronze' | 'silver' | 'gold' | 'platinum'}
                      lastUpdated={follower.score_last_updated}
                      compact={true}
                    />
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div>Engagements: {follower.engagement_count || 0}</div>
                    <div>Joined: {new Date(follower.created_at).toLocaleDateString()}</div>
                    {follower.last_engagement_at && (
                      <div>Last active: {new Date(follower.last_engagement_at).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNotifications(follower.id, follower.notification_preferences)}
                      disabled={updatePreferences.isPending}
                    >
                      {follower.notification_preferences?.events ? (
                        <Bell className="h-4 w-4 text-blue-500" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendNotification(follower.id)}
                      disabled={sendNotification.isPending}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredFollowers.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No followers found matching your search.' : 'No followers yet.'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerList;
