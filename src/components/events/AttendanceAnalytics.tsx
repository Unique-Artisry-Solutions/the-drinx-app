import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralSource } from '@/types/EventTypes';
import { adaptToTicketAnalyticsData } from '@/utils/typeGuards';

interface AttendanceAnalyticsProps {
  attendanceData: {
    total: number;
    checkedIn: number;
    percentCheckedIn: number;
  };
  referralSources: ReferralSource[];
  demographicData?: {
    age?: Record<string, number>;
    gender?: Record<string, number>;
    location?: Record<string, number>;
  };
}

const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({
  attendanceData,
  referralSources,
  demographicData = {}
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // When rendering source data, adapt it to the expected format:
  const renderSourceData = useCallback((sources: ReferralSource[]) => {
    // Convert ReferralSource objects to the expected format with sold, typeName properties
    const adaptedSources = sources.map(adaptToTicketAnalyticsData);
    
    return (
      <div>
        {adaptedSources.map((source, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between mb-1 text-sm text-gray-700">
              <span>{source.typeName}</span>
              <span>
                {source.sold} attendees • {source.percentage ? source.percentage.toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${source.percentage || 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }, []);

  const renderDemographicData = useCallback((data: Record<string, number>, title: string) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {Object.entries(data).map(([key, value], idx) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          
          return (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1 text-sm text-gray-700">
                <span>{key}</span>
                <span>
                  {value} • {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Analytics</CardTitle>
        <CardDescription>
          Track attendance and check-in statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Total Registered</div>
            <div className="text-2xl font-bold">{attendanceData.total}</div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Checked In</div>
            <div className="text-2xl font-bold">{attendanceData.checkedIn}</div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Check-in Rate</div>
            <div className="text-2xl font-bold">{attendanceData.percentCheckedIn}%</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Check-in Progress</span>
                <span className="text-sm text-muted-foreground">
                  {attendanceData.checkedIn} / {attendanceData.total}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full"
                  style={{ width: `${attendanceData.percentCheckedIn}%` }}
                ></div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Top Referral Sources</h3>
                {renderSourceData(referralSources.slice(0, 3))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics">
            <div className="space-y-6">
              {demographicData.age && renderDemographicData(demographicData.age, 'Age Groups')}
              {demographicData.gender && renderDemographicData(demographicData.gender, 'Gender')}
              {demographicData.location && renderDemographicData(demographicData.location, 'Locations')}
              
              {!demographicData.age && !demographicData.gender && !demographicData.location && (
                <div className="text-center py-8 text-muted-foreground">
                  No demographic data available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sources">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-3">All Referral Sources</h3>
              {referralSources.length > 0 ? (
                renderSourceData(referralSources)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No referral source data available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceAnalytics;
