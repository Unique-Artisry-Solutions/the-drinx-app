
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Download, BarChart } from 'lucide-react';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { SegmentPerformanceMetrics } from './SegmentPerformanceMetrics';
import { SegmentOverlapAnalysis } from './SegmentOverlapAnalysis';
import { SegmentTrendsChart } from './SegmentTrendsChart';
import { ExportReportDialog } from './ExportReportDialog';

export function SegmentAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { segments, isLoadingSegments } = useAudienceSegments();
  
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  
  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId) 
        : [...prev, segmentId]
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Segment Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto justify-start text-left font-normal gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={() => setShowExportDialog(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="overlap">Segment Overlap</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance Metrics</CardTitle>
              <CardDescription>
                Real-time performance metrics for your audience segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SegmentPerformanceMetrics 
                dateRange={dateRange} 
                segments={segments}
                isLoading={isLoadingSegments}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overlap" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Overlap Analysis</CardTitle>
              <CardDescription>
                Analyze how your audience segments overlap with each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SegmentOverlapAnalysis 
                segments={segments}
                selectedSegments={selectedSegments}
                onSegmentToggle={handleSegmentToggle}
                isLoading={isLoadingSegments}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Effectiveness Trends</CardTitle>
              <CardDescription>
                Visualize how your segments perform over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SegmentTrendsChart 
                dateRange={dateRange}
                segments={segments.filter(s => selectedSegments.includes(s.id))}
                isLoading={isLoadingSegments}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ExportReportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        segments={segments}
        selectedSegments={selectedSegments}
        onSegmentToggle={handleSegmentToggle}
        dateRange={dateRange}
      />
    </div>
  );
}
