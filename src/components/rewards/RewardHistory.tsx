
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MinusCircle, Calendar } from 'lucide-react';
import { RewardTransaction } from '@/lib/rewards/types';
import { format } from 'date-fns';

interface RewardHistoryProps {
  transactions: RewardTransaction[];
}

export function RewardHistory({ transactions }: RewardHistoryProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-muted/30 inline-flex rounded-full p-3 mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No transaction history yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {transaction.type === 'earn' ? (
                    <PlusCircle className="h-4 w-4" />
                  ) : (
                    <MinusCircle className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {transaction.description || (transaction.type === 'earn' ? 'Points earned' : 'Points redeemed')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.source} • {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <Badge variant={transaction.type === 'earn' ? 'outline' : 'secondary'} className="shrink-0">
                {transaction.type === 'earn' ? '+' : '-'}{transaction.points}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
