
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react';

interface PaymentAnalyticsProps {
  onExportData: () => void;
}

const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = ({ onExportData }) => {
  const [dateRange, setDateRange] = useState('7d');

  // Mock data for demonstration
  const paymentMethodData = [
    { name: 'Card', value: 65, color: '#3B82F6' },
    { name: 'Apple Pay', value: 20, color: '#10B981' },
    { name: 'Google Pay', value: 15, color: '#F59E0B' }
  ];

  const revenueData = [
    { date: '2024-01-01', revenue: 1200, transactions: 45 },
    { date: '2024-01-02', revenue: 1800, transactions: 62 },
    { date: '2024-01-03', revenue: 1500, transactions: 53 },
    { date: '2024-01-04', revenue: 2200, transactions: 78 },
    { date: '2024-01-05', revenue: 1900, transactions: 65 },
    { date: '2024-01-06', revenue: 2400, transactions: 85 },
    { date: '2024-01-07', revenue: 2100, transactions: 72 }
  ];

  const installmentData = [
    { type: 'Full Payment', count: 120, percentage: 75 },
    { type: '3 Months', count: 25, percentage: 15.6 },
    { type: '6 Months', count: 10, percentage: 6.3 },
    { type: '12 Months', count: 5, percentage: 3.1 }
  ];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = revenueData.reduce((sum, item) => sum + item.transactions, 0);
  const avgTransactionValue = totalRevenue / totalTransactions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Analytics</h2>
          <p className="text-gray-600">Track payment performance and trends</p>
        </div>
        <Button onClick={onExportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange(range)}
          >
            {range === '7d' && 'Last 7 days'}
            {range === '30d' && 'Last 30 days'}
            {range === '90d' && 'Last 90 days'}
            {range === '1y' && 'Last year'}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +12.5% vs last period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                +8.3% vs last period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                <p className="text-2xl font-bold">{formatCurrency(avgTransactionValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                +3.7% vs last period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                +0.2% vs last period
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="installments">Installments</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Transaction Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : value,
                        name === 'revenue' ? 'Revenue' : 'Transactions'
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="revenue" />
                    <Bar yAxisId="right" dataKey="transactions" fill="#10B981" name="transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Installment Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installmentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.type}</h4>
                      <p className="text-sm text-gray-600">{item.count} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{item.percentage}%</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentAnalytics;
