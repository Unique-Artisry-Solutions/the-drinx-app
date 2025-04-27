
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { RewardTransaction } from '@/lib/rewards/types';
import { format } from 'date-fns';

interface RewardHistoryProps {
  transactions: RewardTransaction[];
}

export function RewardHistory({ transactions }: RewardHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground">No reward activity yet</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">{transaction.source}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'redeem' ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.type === 'redeem' ? '-' : '+'}{transaction.points} points
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
