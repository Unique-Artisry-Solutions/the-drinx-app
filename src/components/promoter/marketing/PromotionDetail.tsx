import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Tag, Users, DollarSign, Percent, Box, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromotionAuditLogs from './PromotionAuditLogs';
import { useToast } from '@/hooks/use-toast';

// Import getPromotionCode from your API
import { getPromotionCodes } from '@/lib/promotions/api';

export default function PromotionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: promotion, isLoading, error } = useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => {
      if (!id) throw new Error('Promotion ID is required');
      
      // Get the promotion details
      const promotions = await getPromotionCodes('placeholder-establishment-id');
      const promotion = promotions.find(p => p.id === id);
      
      if (!promotion) {
        throw new Error('Promotion not found');
      }
      
      return promotion;
    },
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !promotion) {
    return (
      <Card className="w-full bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <AlertCircle className="mr-2 h-5 w-5" /> Error
          </CardTitle>
          <CardDescription className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to load promotion details'}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No end date';
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const getDiscountValue = () => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}% off`;
    } else if (promotion.discount_type === 'fixed') {
      return `$${promotion.discount_value.toFixed(2)} off`;
    } else {
      return 'Free item';
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(promotion.code);
    toast({
      description: "Promotion code copied to clipboard",
    });
  };
  
  const usageText = promotion.usage_limit 
    ? `${promotion.used_count || 0} / ${promotion.usage_limit}`
    : 'Unlimited';
  
  const validHours = promotion.valid_hours && typeof promotion.valid_hours === 'object' && 'start' in promotion.valid_hours && 'end' in promotion.valid_hours
    ? `${promotion.valid_hours.start} - ${promotion.valid_hours.end}`
    : 'All Hours';
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Promotions
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Promotion Details</CardTitle>
                <Badge variant={promotion.is_active ? "default" : "secondary"}>
                  {promotion.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>
                {promotion.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-primary" />
                  <span className="font-medium">Code</span>
                </div>
                <div className="flex items-center bg-background px-3 py-1 rounded border">
                  <code className="mr-2 font-mono">{promotion.code}</code>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-6 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16V4a2 2 0 0 1 2-2h10"/></svg>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  {promotion.discount_type === 'percentage' ? (
                    <Percent className="mr-2 h-4 w-4 text-primary" />
                  ) : promotion.discount_type === 'fixed' ? (
                    <DollarSign className="mr-2 h-4 w-4 text-primary" />
                  ) : (
                    <Box className="mr-2 h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium">Discount</span>
                </div>
                <span>{getDiscountValue()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  <span className="font-medium">Active Period</span>
                </div>
                <span>{formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</span>
              </div>
              
              {promotion.usage_limit && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-medium">Usage</span>
                  </div>
                  <span>{usageText}</span>
                </div>
              )}
              
              {promotion.min_purchase_amount && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-medium">Min Purchase</span>
                  </div>
                  <span>${promotion.min_purchase_amount.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Additional details card */}
          <Card>
            <CardHeader>
              <CardTitle>Restrictions</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {promotion.valid_days && promotion.valid_days.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    Valid Days
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {promotion.valid_days.map(day => (
                      <Badge key={day} variant="outline">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {promotion.valid_hours && (
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Valid Hours
                  </div>
                  <span>{validHours}</span>
                </div>
              )}
              
              {promotion.user_segment && (
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    User Segment
                  </div>
                  <Badge variant="outline">
                    {promotion.user_segment.charAt(0).toUpperCase() + promotion.user_segment.slice(1)} Users
                  </Badge>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="text-sm font-medium flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  Combinable
                </div>
                <Badge variant={promotion.combinable ? "outline" : "destructive"}>
                  {promotion.combinable ? 'Can be combined with other promos' : 'Cannot be combined'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="audit" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="audit" className="h-full">
              <PromotionAuditLogs promotionId={id!} />
            </TabsContent>
            
            <TabsContent value="analytics" className="h-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>
                    Performance metrics for this promotion code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-10">
                    Analytics visualization coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
