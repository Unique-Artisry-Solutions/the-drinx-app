
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Award, Gift, Star, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Transaction {
  id: string;
  date: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  source: string;
}

interface RewardHistoryProps {
  transactions: Transaction[];
}

export function RewardHistory({ transactions }: RewardHistoryProps) {
  // Sort transactions by date - most recent first
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  
  sortedTransactions.forEach(transaction => {
    const date = new Date(transaction.date).toDateString();
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });
  
  // Get transaction icon based on type and source
  const getIcon = (transaction: Transaction) => {
    if (transaction.type === 'earn') {
      if (transaction.source === 'achievement') return <Award className="h-4 w-4 text-green-500" />;
      if (transaction.source === 'visit') return <Calendar className="h-4 w-4 text-blue-500" />;
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
  };
  
  // Get transaction badge based on type
  const getBadge = (transaction: Transaction) => {
    if (transaction.type === 'earn') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">+{transaction.points}</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">-{transaction.points}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-primary" />
          Reward History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-muted/30 inline-flex rounded-full p-3 mb-3">
              <Star className="h-6 w-6 text-muted-foreground/70" />
            </div>
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Your reward history will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">{date}</h3>
                  
                  <div className="space-y-2">
                    {dayTransactions.map((transaction) => (
                      <div 
                        key={transaction.id}
                        className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="mr-3 p-2 rounded-full bg-muted">
                          {getIcon(transaction)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="ml-2">
                          {getBadge(transaction)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
