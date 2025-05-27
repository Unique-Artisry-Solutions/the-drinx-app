
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target,
  ChevronRight,
  Calendar
} from 'lucide-react';
import type { EventReport } from '@/services/reportingService';

interface EventReportsPanelProps {
  reports: EventReport[];
  onGenerateReport: (eventId: string, reportType: EventReport['reportType']) => Promise<void>;
  isGenerating: boolean;
}

const EventReportsPanel: React.FC<EventReportsPanelProps> = ({
  reports,
  onGenerateReport,
  isGenerating
}) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<EventReport['reportType']>('comprehensive');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const mockEvents = [
    { id: 'event-1', name: 'Summer Music Festival 2024' },
    { id: 'event-2', name: 'Tech Conference Downtown' },
    { id: 'event-3', name: 'Food & Wine Tasting' },
    { id: 'event-4', name: 'Comedy Night Special' }
  ];

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'marketing', label: 'Marketing Performance' },
    { value: 'comprehensive', label: 'Comprehensive Report' }
  ];

  const handleGenerateReport = () => {
    if (selectedEvent) {
      onGenerateReport(selectedEvent, selectedReportType);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Event Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={selectedReportType} onValueChange={(value) => setSelectedReportType(value as EventReport['reportType'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateReport}
                disabled={!selectedEvent || isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Reports</h3>
        
        {reports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Reports Generated</h3>
              <p className="text-muted-foreground">
                Generate your first event report to see detailed analytics
              </p>
            </CardContent>
          </Card>
        ) : (
          reports.map(report => (
            <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader 
                className="pb-3"
                onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-base">{report.eventName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {reportTypes.find(t => t.value === report.reportType)?.label} • 
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {report.reportType}
                    </Badge>
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform ${
                        expandedReport === report.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              </CardHeader>
              
              {expandedReport === report.id && (
                <CardContent className="pt-0">
                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Tickets Sold</span>
                      </div>
                      <div className="text-xl font-bold">{report.reportData.summary.totalTicketsSold}</div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Revenue</span>
                      </div>
                      <div className="text-xl font-bold">{formatCurrency(report.reportData.summary.totalRevenue)}</div>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Attendance Rate</span>
                      </div>
                      <div className="text-xl font-bold">{formatPercentage(report.reportData.summary.attendanceRate)}</div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Conversion Rate</span>
                      </div>
                      <div className="text-xl font-bold">{formatPercentage(report.reportData.summary.conversionRate)}</div>
                    </div>
                  </div>

                  {/* Ticket Type Breakdown */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Ticket Type Performance</h4>
                    <div className="space-y-3">
                      {report.reportData.breakdown.ticketTypes.map((ticket, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{ticket.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {ticket.sold} sold • {formatCurrency(ticket.revenue)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{ticket.percentage}%</div>
                            <Progress value={ticket.percentage} className="w-20 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h4 className="font-medium mb-3">Key Insights</h4>
                    <div className="space-y-2">
                      {report.reportData.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="font-medium">{insight.title}</div>
                            <div className="text-sm text-muted-foreground mb-1">{insight.description}</div>
                            {insight.recommendation && (
                              <div className="text-sm text-blue-600 font-medium">
                                💡 {insight.recommendation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EventReportsPanel;
