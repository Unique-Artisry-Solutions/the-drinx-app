
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Calendar, FileDown, Loader2 } from "lucide-react";
import { DateRange, ReportType, reportTypes } from './exportUtils';

interface ReportControlsProps {
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  onGeneratePreview: () => void;
  onExport: () => void;
  isLoading: boolean;
  hasPreviewData: boolean;
}

export const ReportControls: React.FC<ReportControlsProps> = ({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  onGeneratePreview,
  onExport,
  isLoading,
  hasPreviewData
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <div className="flex gap-2 items-center">
            <div className={isLoading ? "pointer-events-none opacity-50" : ""}>
              <DatePicker
                date={dateRange.from}
                setDate={(date) => setDateRange(prev => ({ ...prev, from: date }))}
              />
            </div>
            <span className="text-sm font-medium">to</span>
            <div className={isLoading ? "pointer-events-none opacity-50" : ""}>
              <DatePicker
                date={dateRange.to}
                setDate={(date) => setDateRange(prev => ({ ...prev, to: date }))}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onGeneratePreview} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Calendar className="h-4 w-4 mr-2" />
          )}
          Generate Preview
        </Button>
        <Button 
          variant="default" 
          onClick={onExport} 
          disabled={isLoading || !hasPreviewData}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export Full Report
        </Button>
      </div>
    </div>
  );
};
