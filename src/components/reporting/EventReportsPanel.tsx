
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
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
  if (isGenerating) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Event Reports</h3>
          <p className="text-sm text-muted-foreground">
            Automated reports for your events with detailed analytics
          </p>
        </div>
        <Button 
          onClick={() => onGenerateReport('sample-event-1', 'comprehensive')}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reports Generated</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first report to get detailed insights about your events
            </p>
            <Button 
              onClick={() => onGenerateReport('sample-event-1', 'comprehensive')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map(report => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {report.eventName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.reportType} Report
                    </p>
                  </div>
                  <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Report Summary */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium">Total Attendees</div>
                      <div className="text-lg font-bold text-blue-600">
                        {report.metrics.totalAttendees?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Revenue</div>
                      <div className="text-lg font-bold text-green-600">
                        ${report.metrics.totalRevenue?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Info */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Generated: {new Date(report.generatedAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventReportsPanel;
