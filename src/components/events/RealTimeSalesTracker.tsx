import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { TicketAnalyticsData, ReferralSource } from '@/types/EventTypes';
import { adaptReferralSource } from '@/utils/typeGuards';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import classNames from 'classnames';

Chart.register(ArcElement, Tooltip, Legend);

interface RealTimeSalesTrackerProps {
  eventId: string;
  ticketSalesData: {
    totalTickets: number;
    soldTickets: number;
    attendanceRate: number;
    salesByType: ReferralSource[];
    recentSales: any[];
  };
  isLoading: boolean;
  error: string | null;
}

// Define a function to get the progress color class based on the ratio
const getProgressColorClass = (ratio: number): string => {
  if (ratio < 0.3) {
    return "bg-red-500";
  } else if (ratio < 0.7) {
    return "bg-yellow-500";
  } else {
    return "bg-green-500";
  }
};

const RealTimeSalesTracker: React.FC<RealTimeSalesTrackerProps> = ({
  eventId,
  ticketSalesData,
  isLoading,
  error
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const chartData = {
    labels: ticketSalesData.salesByType.map(item => item.name),
    datasets: [
      {
        label: 'Ticket Sales by Type',
        data: ticketSalesData.salesByType.map(item => item.visits),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: isDarkTheme ? 'white' : 'black', // Adjust color based on theme
        },
      },
    },
  };
  
  const renderTicketTypes = useCallback((salesData: ReferralSource[]) => {
    // Convert ReferralSource objects to the expected format with sold, typeName properties
    const adaptedData = salesData.map(adaptReferralSource);
    
    return (
      <div className="space-y-4 mt-4">
        {adaptedData.map((ticket, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-between mb-1 text-sm font-medium">
              <span>{ticket.name}</span>
              <span className="text-gray-600">
                {ticket.visits} / {ticketSalesData.totalTickets} ({((ticket.visits / ticketSalesData.totalTickets) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={classNames("h-2 rounded-full", getProgressColorClass(ticket.visits / ticketSalesData.totalTickets))}
                style={{ width: `${(ticket.visits / ticketSalesData.totalTickets) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }, [ticketSalesData]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Real-Time Sales Tracker</CardTitle>
          <CardDescription>Ticket sales and attendance data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Real-Time Sales Tracker</CardTitle>
        <CardDescription>Ticket sales and attendance data</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ticket Sales by Type</h3>
            {renderTicketTypes(ticketSalesData.salesByType)}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Overall Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Total Tickets</div>
              <div className="text-xl font-bold">{ticketSalesData.totalTickets}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Sold Tickets</div>
              <div className="text-xl font-bold">{ticketSalesData.soldTickets}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Attendance Rate</div>
              <div className="text-xl font-bold">{ticketSalesData.attendanceRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeSalesTracker;
