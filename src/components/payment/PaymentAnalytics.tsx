
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Users, 
  Download,
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PaymentMetrics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  successRate: number;
  refundRate: number;
  installmentUsage: number;
}

interface PaymentAnalyticsProps {
  dateRange?: string;
  onExportData?: () => void;
}

const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = ({
  dateRange = '30d',
  onExportData
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(dateRange);
  const [metrics, setMetrics] = useState<PaymentMetrics>({
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransactionValue: 0,
    successRate: 0,
    refundRate: 0,
    installmentUsage: 0
  });

  // Mock data - replace with actual API calls
  const revenueData = [
    { month: 'Jan', revenue: 12000, transactions: 45 },
    { month: 'Feb', revenue: 15000, transactions: 52 },
    { month: 'Mar', revenue: 18000, transactions: 61 },
    { month: 'Apr', revenue: 22000, transactions: 73 },
    { month: 'May', revenue: 25000, transactions: 84 },
    { month: 'Jun', revenue: 28000, transactions: 92 }
  ];

  const paymentMethodData = [
    { name: 'Credit Card', value: 65, color: '#8884d8' },
    { name: 'Digital Wallet', value: 25, color: '#82ca9d' },
    { name: 'Installments', value: 10, color: '#ffc658' }
  ];

  const transactionStatusData = [
    { status: 'Successful', count: 892, percentage: 94.2 },
    { status: 'Failed', count: 35, percentage: 3.7 },
    { status: 'Pending', count: 20, percentage: 2.1 }
  ];

  useEffect(() => {
    // Simulate loading metrics based on selected period
    const loadMetrics = () => {
      // Mock data - replace with actual API call
      setMetrics({
        totalRevenue: 156750,
        totalTransactions: 1247,
        averageTransactionValue: 125.68,
        successRate: 94.2,
        refundRate: 2.8,
        installmentUsage: 15.3
      });
    };

    loadMetrics();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Analytics</h2>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Avg: {formatCurrency(metrics.averageTransactionValue)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(metrics.successRate)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Excellent
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Installment Usage</p>
                <p className="text-2xl font-bold">{formatPercentage(metrics.installmentUsage)}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Refund Rate: {formatPercentage(metrics.refundRate)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Revenue"
              />
              <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction Status */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionStatusData.map((item) => (
                <div key={item.status} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        item.status === 'Successful' ? 'bg-green-500' :
                        item.status === 'Failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.count}</div>
                    <div className="text-sm text-gray-600">{formatPercentage(item.percentage)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
