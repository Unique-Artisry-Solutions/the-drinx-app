
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getPayoutRequests, getFinancialReports, generateFinancialReport } from '@/services/financialService';
import { PayoutRequest, FinancialReport } from '@/types/FinancialTypes';
import PayoutRequestForm from './PayoutRequestForm';
import { useToast } from '@/hooks/use-toast';

export default function FinancialDashboard() {
  const { toast } = useToast();
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayoutForm, setShowPayoutForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payouts, reports] = await Promise.all([
        getPayoutRequests(),
        getFinancialReports('')
      ]);
      setPayoutRequests(payouts);
      setFinancialReports(reports);
    } catch (error) {
      toast({
        title: "Failed to load financial data",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: FinancialReport['report_type']) => {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      await generateFinancialReport(
        '', // Will be filled by the service
        type,
        startDate.toISOString(),
        endDate.toISOString()
      );

      toast({
        title: "Report generated",
        description: `${type} report has been generated successfully`
      });

      loadData();
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: PayoutRequest['status']) => {
    const variants = {
      pending: 'default',
      processing: 'secondary',
      completed: 'default',
      failed: 'destructive',
      cancelled: 'outline'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: PayoutRequest['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return <div>Loading financial dashboard...</div>;
  }

  const totalEarnings = financialReports.reduce((sum, report) => sum + report.net_earnings, 0);
  const totalPending = payoutRequests
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.net_amount, 0);
  const totalCompleted = payoutRequests
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.net_amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Payouts</p>
                <p className="text-2xl font-bold">${totalCompleted.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  ${financialReports
                    .filter(r => r.report_type === 'monthly')
                    .slice(0, 1)
                    .reduce((sum, r) => sum + r.net_earnings, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="request">Request Payout</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {payoutRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No payout requests found</p>
              ) : (
                <div className="space-y-4">
                  {payoutRequests.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(payout.status)}
                        <div>
                          <p className="font-medium">${payout.net_amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            Requested {new Date(payout.requested_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payout.status)}
                        {payout.failure_reason && (
                          <p className="text-sm text-red-600 mt-1">{payout.failure_reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financial Reports</CardTitle>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('monthly')}
                >
                  Generate Monthly
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport('quarterly')}
                >
                  Generate Quarterly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {financialReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No financial reports found</p>
              ) : (
                <div className="space-y-4">
                  {financialReports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)} Report
                        </h4>
                        <Badge variant="outline">
                          {report.period_start} to {report.period_end}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Revenue:</span>
                          <span className="ml-2 font-medium">${report.total_revenue.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fees:</span>
                          <span className="ml-2 font-medium">${report.total_fees.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Net:</span>
                          <span className="ml-2 font-medium">${report.net_earnings.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sales:</span>
                          <span className="ml-2 font-medium">{report.ticket_sales_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request">
          <PayoutRequestForm onSuccess={() => {
            setShowPayoutForm(false);
            loadData();
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
