
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { EstablishmentAnalytics, RevenueReport, DrinkPopularity } from '@/services/establishmentAnalyticsService';

interface AnalyticsHeaderProps {
  establishmentName: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  visitorAnalytics: EstablishmentAnalytics[];
  revenueReports: RevenueReport[];
  popularDrinks: DrinkPopularity[];
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  establishmentName, 
  date, 
  setDate,
  visitorAnalytics,
  revenueReports,
  popularDrinks
}) => {
  const downloadAnalyticsCSV = () => {
    const formattedVisitorData = visitorAnalytics.map(data => ({
      name: format(new Date(data.date), 'MMM d'),
      visitors: data.total_visitors,
      returningVisitors: data.returning_visitors,
      uniqueVisitors: data.unique_visitors,
      date: data.date
    }));

    const formattedRevenueData = revenueReports.map(report => ({
      name: format(new Date(report.month), 'MMM yyyy'),
      revenue: report.monthly_revenue,
      transactions: report.transaction_count
    }));
    
    const allData = {
      visitors: formattedVisitorData,
      revenue: formattedRevenueData,
      drinks: popularDrinks
    };
    
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      "Date,Total Visitors,Returning Visitors,Unique Visitors\n" +
      formattedVisitorData.map(row => 
        `${row.date},${row.visitors},${row.returningVisitors},${row.uniqueVisitors}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 className="text-3xl font-bold mb-4 sm:mb-0">
        {establishmentName ? `${establishmentName} - Analytics` : 'Establishment Analytics'}
      </h1>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
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
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" onClick={downloadAnalyticsCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
};
