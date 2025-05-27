
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Download, Send } from 'lucide-react';

interface PayoutManagementProps {
  promoterId: string;
}

export const PayoutManagement: React.FC<PayoutManagementProps> = ({ promoterId }) => {
  // Mock payout data - replace with actual API calls
  const pendingPayouts = [
    {
      id: '1',
      partner_name: 'Jane Smith',
      amount: 245.50,
      commission_count: 12,
      status: 'pending',
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      partner_name: 'Mike Johnson',
      amount: 189.75,
      commission_count: 8,
      status: 'pending',
      created_at: '2024-01-18T15:30:00Z'
    }
  ];

  const recentPayouts = [
    {
      id: '3',
      partner_name: 'Sarah Wilson',
      amount: 320.00,
      commission_count: 15,
      status: 'completed',
      processed_at: '2024-01-15T09:00:00Z'
    },
    {
      id: '4',
      partner_name: 'Tom Brown',
      amount: 156.25,
      commission_count: 6,
      status: 'completed',
      processed_at: '2024-01-12T14:20:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payout Management</h2>
        <p className="text-muted-foreground">Manage affiliate commission payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$435.25</div>
            <p className="text-xs text-muted-foreground">2 payouts ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240</div>
            <p className="text-xs text-muted-foreground">8 payouts processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,450</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Payouts</CardTitle>
              <CardDescription>Commissions ready for payment</CardDescription>
            </div>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Process All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{payout.partner_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {payout.commission_count} commissions
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">${payout.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(payout.status)}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </Badge>
                  <Button size="sm">Process</Button>
                </div>
              </div>
            ))}

            {pendingPayouts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending payouts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
          <CardDescription>Recently processed commission payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{payout.partner_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {payout.commission_count} commissions
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">${payout.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payout.processed_at!).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(payout.status)}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
