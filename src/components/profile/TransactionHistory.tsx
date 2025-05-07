
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, ArrowDown, ArrowUp, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { getUserTransactions, getReceipt } from '@/services/paymentService';
import { PaymentTransaction, PaymentReceipt } from '@/types/PaymentTypes';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTransactions() {
      try {
        setIsLoading(true);
        const data = await getUserTransactions();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions');
        console.error('Error loading transactions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTransactions();
  }, []);
  
  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      const receipt = await getReceipt(transactionId);
      if (!receipt) {
        console.error('No receipt found for this transaction');
        return;
      }
      
      // Generate basic HTML receipt
      const receiptHTML = `
        <html>
          <head>
            <title>Receipt ${receipt.receipt_number}</title>
            <style>
              body { font-family: sans-serif; line-height: 1.6; }
              .container { max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              .total { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Receipt #${receipt.receipt_number}</h1>
              <p>Transaction ID: ${receipt.transaction_id}</p>
              <p>Date: ${new Date(receipt.created_at).toLocaleString()}</p>
              
              <h2>Details</h2>
              <pre>${JSON.stringify(receipt.receipt_data, null, 2)}</pre>
              
              <p class="total">Total: $${(receipt.receipt_data.amount || 0).toFixed(2)}</p>
            </div>
          </body>
        </html>
      `;
      
      // Create a blob and trigger download
      const blob = new Blob([receiptHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receipt.receipt_number}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading receipt:', err);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><ArrowDown className="h-3 w-3 mr-1" /> Refunded</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><AlertCircle className="h-3 w-3 mr-1" /> {status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.status === 'refunded' ? 
                          <ArrowDown className="mr-1 h-4 w-4 text-red-500" /> : 
                          <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                        }
                        ${(transaction.amount / 100).toFixed(2)} {transaction.currency.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="capitalize">{transaction.provider}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => alert(`View details for ${transaction.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        {transaction.status === 'completed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownloadReceipt(transaction.id)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download receipt</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
