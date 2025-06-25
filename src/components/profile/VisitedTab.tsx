
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Award, Bell, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useVisitAchievements } from '@/hooks/useVisitAchievements';
import { VisitWithEstablishment } from '@/types/VisitTypes';
import VisitItem from './VisitItem';
import AchievementItem from './AchievementItem';
import NotificationItem from './NotificationItem';
import { Badge } from '@/components/ui/badge';

interface VisitedTabProps {
  visitedEstablishments?: any[]; // Keep existing prop for compatibility
}

const VisitedTab: React.FC<VisitedTabProps> = () => {
  const { visits, stats, isLoading: visitsLoading } = useUserVisits();
  const { 
    achievements, 
    notifications, 
    unreadCount,
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useVisitAchievements();
  
  const [selectedVisit, setSelectedVisit] = useState<VisitWithEstablishment | null>(null);
  
  if (visitsLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-center">
          <div className="h-6 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!visits || visits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-medium text-lg mb-2">No Visited Places Yet</h3>
          <p className="text-gray-600 mb-4">
            Check in to establishments to start building your visit history.
          </p>
          <Button asChild>
            <Link to="/explore">Explore Places</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Your Visit Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{stats.total_visits}</div>
                <div className="text-xs text-blue-600">Total Visits</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{stats.unique_establishments}</div>
                <div className="text-xs text-green-600">Places Visited</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-700">{stats.average_rating?.toFixed(1) || 0}</div>
                <div className="text-xs text-amber-600">Avg. Rating</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-700">{stats.total_mocktails_tried}</div>
                <div className="text-xs text-purple-600">Mocktails Tried</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="history">
        <TabsList className="w-full">
          <TabsTrigger value="history">Visit History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-1 bg-red-500" variant="destructive">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          {selectedVisit ? (
            <div>
              <Button 
                variant="ghost" 
                className="mb-3" 
                onClick={() => setSelectedVisit(null)}
              >
                ← Back to all visits
              </Button>
              
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold">{selectedVisit.establishment.name}</h2>
                  <div className="flex items-center text-sm text-gray-600 mt-1 mb-4">
                    <MapPin size={16} className="mr-1" />
                    {selectedVisit.establishment.address}
                  </div>
                  
                  {/* Visit details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs font-medium text-gray-500">Visit Date</div>
                      <div className="text-sm">
                        {new Date(selectedVisit.visit_date).toLocaleDateString()} at {' '}
                        {new Date(selectedVisit.visit_date).toLocaleTimeString()}
                      </div>
                    </div>
                    {selectedVisit.rating && (
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs font-medium text-gray-500">Rating</div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < selectedVisit.rating! ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes section */}
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Notes</h3>
                    {selectedVisit.notes.length > 0 ? (
                      <div className="space-y-2">
                        {selectedVisit.notes.map(note => (
                          <div key={note.id} className="bg-gray-50 p-3 rounded text-sm">
                            {note.note}
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(note.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No notes for this visit</div>
                    )}
                  </div>
                  
                  {/* Tried mocktails section */}
                  <div>
                    <h3 className="font-medium mb-2">Tried Mocktails</h3>
                    {selectedVisit.tried_mocktails.length > 0 ? (
                      <div className="space-y-2">
                        {selectedVisit.tried_mocktails.map(mocktail => (
                          <div key={mocktail.id} className="bg-gray-50 p-3 rounded">
                            <div className="font-medium text-sm">{mocktail.cocktail_id.substring(0, 8)}</div>
                            {mocktail.rating && (
                              <div className="flex mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={`${
                                      i < mocktail.rating! ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            {mocktail.notes && (
                              <div className="text-sm mt-1">{mocktail.notes}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No mocktails recorded for this visit</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map(visit => (
                <VisitItem 
                  key={visit.id} 
                  visit={visit} 
                  onViewDetails={(visit) => setSelectedVisit(visit)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-4">
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map(achievement => (
                <AchievementItem key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-lg mb-2">No Achievements Yet</h3>
                <p className="text-gray-600">
                  Visit places to earn achievements and unlock badges.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          {notifications.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Your Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
                    <Check size={14} className="mr-1" /> Mark all as read
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkAsRead={markNotificationAsRead}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-lg mb-2">No Notifications</h3>
                <p className="text-gray-600">
                  You don't have any notifications at this time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisitedTab;
