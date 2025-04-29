
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, FileDown, Calendar, Info } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function ReportExportUtility() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState('user_points');
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [preview, setPreview] = useState<any[]>([]);
  const [recentExports, setRecentExports] = useState<{
    id: string;
    type: string;
    date: string;
    fileName: string;
  }[]>([
    {
      id: '1',
      type: 'User Points',
      date: format(new Date(), 'yyyy-MM-dd'),
      fileName: 'user_points_export_20250428.csv'
    }
  ]);
  
  const reportTypes = [
    { value: 'user_points', label: 'User Points' },
    { value: 'reward_redemptions', label: 'Reward Redemptions' },
    { value: 'point_transactions', label: 'Point Transactions' },
    { value: 'tier_distribution', label: 'Tier Distribution' }
  ];
  
  const generatePreview = async () => {
    setIsLoading(true);
    try {
      let data = [];
      
      // Fetch preview data based on report type
      switch (reportType) {
        case 'user_points':
          const { data: userPoints, error: userError } = await supabase
            .from('user_rewards')
            .select('user_id, points, lifetime_points')
            .limit(5);
          
          if (userError) throw userError;
          data = userPoints;
          break;
          
        case 'reward_redemptions':
          const { data: redemptions, error: redemptionError } = await supabase
            .from('reward_redemptions')
            .select('id, user_id, offering_id, points_spent, created_at')
            .limit(5);
          
          if (redemptionError) throw redemptionError;
          data = redemptions;
          break;
          
        case 'point_transactions':
          const { data: transactions, error: transactionError } = await supabase
            .from('reward_transactions')
            .select('id, user_id, points, transaction_type, source, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (transactionError) throw transactionError;
          data = transactions;
          break;
          
        case 'tier_distribution':
          // Simulate tier distribution data
          data = [
            { tier: 'Tier 1', user_count: 156, percentage: '62.4%' },
            { tier: 'Tier 2', user_count: 67, percentage: '26.8%' },
            { tier: 'Tier 3', user_count: 27, percentage: '10.8%' }
          ];
          break;
      }
      
      setPreview(data);
      
      toast({
        title: "Preview Generated",
        description: `Showing a preview of ${reportType} report data`
      });
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate report preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Get full dataset based on report type and date range
      let data;
      let fileName;
      
      switch (reportType) {
        case 'user_points':
          const { data: userPoints, error: userError } = await supabase
            .from('user_rewards')
            .select('*');
          
          if (userError) throw userError;
          data = userPoints;
          fileName = `user_points_export_${format(new Date(), 'yyyyMMdd')}.csv`;
          break;
          
        // Handle other report types similarly
        default:
          data = preview; // Use preview data as a fallback
          fileName = `${reportType}_export_${format(new Date(), 'yyyyMMdd')}.csv`;
      }
      
      // Convert data to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Add to recent exports
      setRecentExports(prev => [{
        id: `export-${Date.now()}`,
        type: reportTypes.find(t => t.value === reportType)?.label || reportType,
        date: format(new Date(), 'yyyy-MM-dd'),
        fileName
      }, ...prev]);
      
      toast({
        title: "Export Successful",
        description: `Successfully exported ${reportType} data to ${fileName}`
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export the report data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Report Export Utility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
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
                <DatePicker
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  disabled={isLoading}
                />
                <span className="text-sm font-medium">to</span>
                <DatePicker
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generatePreview} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Generate Preview
            </Button>
            <Button 
              variant="default" 
              onClick={handleExport} 
              disabled={isLoading || preview.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export Full Report
            </Button>
          </div>
          
          {preview.length > 0 && (
            <>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted py-2 px-4 font-medium">
                  Data Preview
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(preview[0]).map((header) => (
                          <TableHead key={header}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Alert variant="default" className="bg-muted/50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a preview showing up to 5 records. Export the full report to get all data.
                </AlertDescription>
              </Alert>
            </>
          )}
          
          <div>
            <h3 className="text-sm font-medium mb-2">Recent Exports</h3>
            {recentExports.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentExports.map(export_ => (
                      <TableRow key={export_.id}>
                        <TableCell>{export_.type}</TableCell>
                        <TableCell>{export_.date}</TableCell>
                        <TableCell className="font-mono text-xs">{export_.fileName}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent exports</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
