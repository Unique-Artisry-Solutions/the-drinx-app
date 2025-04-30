
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format, addMonths } from 'date-fns';
import { CalendarDays, CalendarClock, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const CampaignScheduler = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [scheduleType, setScheduleType] = useState<string>('one-time');
  
  // Sample scheduled campaigns for demonstration
  const scheduledCampaigns = [
    {
      id: '1',
      name: 'Summer Promotion',
      startDate: new Date(2025, 5, 1),
      endDate: new Date(2025, 7, 31),
      status: 'scheduled'
    },
    {
      id: '2',
      name: 'Welcome Bonus',
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 30),
      status: 'active'
    },
    {
      id: '3',
      name: 'Holiday Special',
      startDate: new Date(2025, 11, 1),
      endDate: new Date(2025, 11, 31),
      status: 'draft'
    }
  ];
  
  // Helper function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Campaign Scheduler</h3>
        <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
          <TabsList>
            <TabsTrigger value="calendar">
              <CalendarDays className="h-4 w-4 mr-1" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-1" />
              Upcoming
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {view === 'calendar' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Campaign Calendar
                </CardTitle>
                <CardDescription>
                  View and manage scheduled campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Scheduled on {date ? format(date, 'MMMM d, yyyy') : ''}</h4>
                    <div className="space-y-2">
                      {scheduledCampaigns
                        .filter(campaign => 
                          date && 
                          campaign.startDate <= date && 
                          campaign.endDate >= date
                        ).length > 0 ? (
                        scheduledCampaigns
                          .filter(campaign => 
                            date && 
                            campaign.startDate <= date && 
                            campaign.endDate >= date
                          )
                          .map(campaign => (
                            <div 
                              key={campaign.id} 
                              className="p-2 border rounded-md flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{campaign.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(campaign.startDate, 'MMM d')} - {format(campaign.endDate, 'MMM d, yyyy')}
                                </p>
                              </div>
                              <Badge className={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted-foreground">No campaigns scheduled for this date</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Campaigns
                </CardTitle>
                <CardDescription>
                  List of all scheduled campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledCampaigns
                      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                      .map(campaign => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{format(campaign.startDate, 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(campaign.endDate, 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Schedule Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schedule-type">Schedule Type</Label>
                  <Select 
                    value={scheduleType} 
                    onValueChange={setScheduleType}
                  >
                    <SelectTrigger id="schedule-type">
                      <SelectValue placeholder="Select schedule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="campaign">Select Campaign</Label>
                  <Select>
                    <SelectTrigger id="campaign">
                      <SelectValue placeholder="Select a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">Summer Promotion</SelectItem>
                      <SelectItem value="welcome">Welcome Bonus</SelectItem>
                      <SelectItem value="holiday">Holiday Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {scheduleType === 'one-time' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Recurrence Pattern</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="auto-activate" />
                      <label
                        htmlFor="auto-activate"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Auto-activate on schedule
                      </label>
                    </div>
                  </div>
                )}
                
                <Button className="w-full">Schedule Campaign</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
