
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { formatDistance } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RewardTransaction } from "@/types/RewardTypes";
import { formatPoints } from "@/lib/pointsFormatter";

interface RewardHistoryProps {
  transactions: RewardTransaction[];
  isLoading: boolean;
}

const RewardHistory: React.FC<RewardHistoryProps> = ({ 
  transactions, 
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Function to get the appropriate transaction icon
  const getTransactionIcon = (type: string) => {
    return type.toUpperCase() === "EARN" ? 
      <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" /> : 
      <ArrowDownRight className="mr-2 h-4 w-4 text-amber-500" />;
  };

  // Function to get the appropriate transaction color
  const getTransactionColor = (type: string) => {
    return type.toUpperCase() === "EARN" ? "text-green-500" : "text-amber-500";
  };

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.transaction_type.toUpperCase() === activeTab.toUpperCase();
  });

  // Format the transaction date
  const formatTransactionDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
            <CardDescription>Your recent reward activity</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filter transactions"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        {showFilters && (
          <Tabs defaultValue="all" className="mt-3" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="EARN">Earned</TabsTrigger>
              <TabsTrigger value="REDEEM">Redeemed</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-2">
          {isLoading ? (
            <div className="flex flex-col space-y-4 items-center justify-center py-8">
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col space-y-4 items-center justify-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center">
                    {getTransactionIcon(transaction.transaction_type)}
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTransactionDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {transaction.source}
                    </Badge>
                    <span className={`font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type.toUpperCase() === "EARN" ? "+" : "-"}
                      {formatPoints(transaction.points)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RewardHistory;
