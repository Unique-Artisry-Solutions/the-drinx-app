
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, BarChart, CircleSlash, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { recordRevenueEntry } from '@/services/establishmentAnalyticsService';

interface RevenueStatsTabProps {
  establishmentId: string;
  revenueTrends?: Array<{
    name: string;
    revenue: number;
    transactions: number;
    average: number;
    month: string;
  }>;
  totalRevenue: number;
  hasData?: boolean;
  onRevenueAdded?: () => void;
}

const RevenueStatsTab: React.FC<RevenueStatsTabProps> = ({ 
  establishmentId,
  revenueTrends = [], 
  totalRevenue = 0,
  hasData = true,
  onRevenueAdded 
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const form = useForm({
    defaultValues: {
      amount: '',
      source: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const handleAddRevenue = async (data: any) => {
    try {
      const success = await recordRevenueEntry(
        establishmentId,
        parseFloat(data.amount),
        data.source,
        data.notes,
        new Date(data.date)
      );

      if (success) {
        toast({
          title: "Revenue entry added",
          description: `$${data.amount} has been recorded successfully.`
        });
        
        form.reset();
        setIsOpen(false);
        
        if (onRevenueAdded) {
          onRevenueAdded();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add entry",
          description: "There was a problem recording your revenue entry."
        });
      }
    } catch (error) {
      console.error('Error adding revenue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred."
      });
    }
  };

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue Statistics</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Revenue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Revenue Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleAddRevenue)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...form.register("amount", { required: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Food & Drink Sales"
                    {...form.register("source", { required: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register("date", { required: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional details about this revenue"
                    {...form.register("notes")}
                  />
                </div>
                
                <Button type="submit" className="w-full">Add Revenue Entry</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="text-center py-10">
          <CircleSlash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-material-on-surface-variant">No revenue data available</p>
          <p className="mt-2 text-material-on-surface-variant">
            Start recording your revenue to see statistics here
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalRevenue);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Statistics</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Revenue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Revenue Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddRevenue)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...form.register("amount", { required: true })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., Food & Drink Sales"
                  {...form.register("source", { required: true })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...form.register("date", { required: true })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional details about this revenue"
                  {...form.register("notes")}
                />
              </div>
              
              <Button type="submit" className="w-full">Add Revenue Entry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium">Total Revenue</h3>
            </div>
            <p className="text-2xl font-bold">{formattedRevenue}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Monthly Performance</h3>
            </div>
            <p className="text-md">
              {revenueTrends.length > 0
                ? `${revenueTrends[0].transactions} transactions in ${revenueTrends[0].name}`
                : "No recent transactions"}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Revenue History</h3>
          {revenueTrends && revenueTrends.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={revenueTrends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
              <BarChart className="h-8 w-8 text-gray-400 mr-2" />
              <p className="text-material-on-surface-variant text-sm">
                Not enough revenue data to display trends
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueStatsTab;
