
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileUpload, FileScan, FileCheck, FileCog, Database, RefreshCw, Tags, Trash2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { usePromotionCodes } from '@/hooks/usePromotionCodes';
import { formatDistanceToNow, format } from 'date-fns';

// Mock venue ID - in a real application, this would come from auth context or props
const VENUE_ID = "3f8cedd9-79fa-4e14-9dee-22a69250d999";

// Form schema for single code creation
const singleCodeSchema = z.object({
  code: z.string().min(3, 'Promotion code must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().min(0),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().default(true),
  usage_limit: z.coerce.number().nullable().optional(),
  valid_days: z.array(z.string()).optional(),
  valid_hours_start: z.string().optional(),
  valid_hours_end: z.string().optional(),
  user_segment: z.enum(['new', 'returning', 'all']).optional(),
  min_purchase_amount: z.coerce.number().nullable().optional(),
  combinable: z.boolean().default(true)
});

// Form schema for batch code creation
const batchCodeSchema = z.object({
  prefix: z.string().min(2, 'Prefix must be at least 2 characters'),
  count: z.coerce.number().int().min(1).max(100),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().min(0),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().default(true),
  usage_limit: z.coerce.number().nullable().optional(),
  valid_days: z.array(z.string()).optional(),
  valid_hours_start: z.string().optional(),
  valid_hours_end: z.string().optional(),
  user_segment: z.enum(['new', 'returning', 'all']).optional(),
  min_purchase_amount: z.coerce.number().nullable().optional(),
  combinable: z.boolean().default(true)
});

// Days of the week for valid_days selection
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PromoCodeGenerator: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [csvData, setCsvData] = useState<string | null>(null);

  // Get all the hook functionality
  const {
    promotionCodes,
    analyticsData,
    isLoadingCodes,
    isLoadingAnalytics,
    isErrorCodes,
    isErrorAnalytics,
    codesError,
    analyticsError,
    createCode,
    updateCode,
    deleteCode,
    batchCreateCodes,
    exportCodes,
    importCodes,
    isCreating,
    isUpdating,
    isBatchCreating,
    isDeleting,
    importing,
    refetchCodes,
    refetchAnalytics
  } = usePromotionCodes(VENUE_ID);

  // Form for creating a single promotion code
  const singleCodeForm = useForm<z.infer<typeof singleCodeSchema>>({
    resolver: zodResolver(singleCodeSchema),
    defaultValues: {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      start_date: new Date(),
      is_active: true,
      combinable: true,
      user_segment: 'all'
    },
  });

  // Form for batch creating promotion codes
  const batchCodeForm = useForm<z.infer<typeof batchCodeSchema>>({
    resolver: zodResolver(batchCodeSchema),
    defaultValues: {
      prefix: '',
      count: 10,
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      start_date: new Date(),
      is_active: true,
      combinable: true,
      user_segment: 'all'
    },
  });

  // Create a single promotion code
  const handleCreateSingleCode = (values: z.infer<typeof singleCodeSchema>) => {
    const formattedValues: any = {
      establishment_id: VENUE_ID,
      code: values.code,
      description: values.description,
      discount_type: values.discount_type,
      discount_value: values.discount_value,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date ? values.end_date.toISOString() : null,
      is_active: values.is_active,
      usage_limit: values.usage_limit || null,
      min_purchase_amount: values.min_purchase_amount || null,
      combinable: values.combinable,
      user_segment: values.user_segment || null,
    };

    // Add valid_days if specified
    if (values.valid_days && values.valid_days.length > 0) {
      formattedValues.valid_days = values.valid_days;
    }

    // Add valid_hours if both start and end are specified
    if (values.valid_hours_start && values.valid_hours_end) {
      formattedValues.valid_hours = {
        start: values.valid_hours_start,
        end: values.valid_hours_end
      };
    }

    createCode(formattedValues);
    singleCodeForm.reset();
  };

  // Create batch promotion codes
  const handleCreateBatchCodes = (values: z.infer<typeof batchCodeSchema>) => {
    const formattedValues: any = {
      establishment_id: VENUE_ID,
      prefix: values.prefix,
      count: values.count,
      description: values.description,
      discount_type: values.discount_type,
      discount_value: values.discount_value,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date ? values.end_date.toISOString() : null,
      is_active: values.is_active,
      usage_limit: values.usage_limit || null,
      min_purchase_amount: values.min_purchase_amount || null,
      combinable: values.combinable,
      user_segment: values.user_segment || null,
    };

    // Add valid_days if specified
    if (values.valid_days && values.valid_days.length > 0) {
      formattedValues.valid_days = values.valid_days;
    }

    // Add valid_hours if both start and end are specified
    if (values.valid_hours_start && values.valid_hours_end) {
      formattedValues.valid_hours = {
        start: values.valid_hours_start,
        end: values.valid_hours_end
      };
    }

    batchCreateCodes(formattedValues);
    batchCodeForm.reset();
  };

  // Handle file input for CSV import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  // Handle CSV import
  const handleImport = () => {
    if (!csvData) return;
    importCodes(csvData);
    setCsvData(null);
  };

  // Get chart data from analytics
  const getChartData = () => {
    if (!analyticsData || analyticsData.length === 0) return [];
    return analyticsData.map(code => ({
      code: code.code,
      redemptions: code.redemptions || 0,
      value: code.total_discount_amount || 0,
      averageOrder: code.average_order_value || 0
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Promotion Code Manager</CardTitle>
        <CardDescription>Create and manage discount codes for your events</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Codes</TabsTrigger>
            <TabsTrigger value="manage">Manage Codes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="single">Single Code</TabsTrigger>
                <TabsTrigger value="batch">Batch Codes</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4 mt-4">
                <Form {...singleCodeForm}>
                  <form onSubmit={singleCodeForm.handleSubmit(handleCreateSingleCode)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={singleCodeForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Promotion Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SUMMER25" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a unique code for this promotion
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={singleCodeForm.control}
                        name="discount_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose how the discount will be applied
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={singleCodeForm.control}
                      name="discount_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount Value ({singleCodeForm.watch('discount_type') === 'percentage' ? '%' : '$'})
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={singleCodeForm.watch('discount_type') === 'percentage' ? 100 : undefined}
                              placeholder={singleCodeForm.watch('discount_type') === 'percentage' ? '25' : '10.00'}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {singleCodeForm.watch('discount_type') === 'percentage'
                              ? 'Enter percentage discount (0-100)'
                              : 'Enter fixed amount discount'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={singleCodeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="25% off your first event ticket"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Clearly describe what this promotion offers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={singleCodeForm.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} 
                                onChange={e => field.onChange(new Date(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={singleCodeForm.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} 
                                onChange={e => e.target.value ? field.onChange(new Date(e.target.value)) : field.onChange(null)}
                                min={format(singleCodeForm.watch('start_date'), 'yyyy-MM-dd')}
                              />
                            </FormControl>
                            <FormDescription>
                              Leave blank for no expiration
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={singleCodeForm.control}
                        name="usage_limit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usage Limit (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                placeholder="100"
                                {...field}
                                value={field.value ?? ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of redemptions
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={singleCodeForm.control}
                        name="min_purchase_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Purchase Amount (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01"
                                placeholder="25.00"
                                {...field}
                                value={field.value ?? ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum amount required to use this promotion
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={singleCodeForm.control}
                      name="user_segment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target User Segment</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select target users" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="new">New Users Only</SelectItem>
                              <SelectItem value="returning">Returning Users Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Which users can use this promotion
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel>Valid Days (Optional)</FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <FormField
                            key={day}
                            control={singleCodeForm.control}
                            name="valid_days"
                            render={({ field }) => (
                              <FormItem
                                key={day}
                                className="flex flex-row items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValues, day]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter((value) => value !== day)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{day}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={singleCodeForm.control}
                        name="valid_hours_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valid From (Optional)</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={singleCodeForm.control}
                        name="valid_hours_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valid Until (Optional)</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={singleCodeForm.control}
                        name="combinable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Combinable with Other Discounts</FormLabel>
                              <FormDescription>
                                Allow this promotion to be used with others
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={singleCodeForm.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                Enable or disable this promotion
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isCreating}>
                      {isCreating ? 'Creating...' : 'Create Promotion Code'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="batch" className="space-y-4 mt-4">
                <Form {...batchCodeForm}>
                  <form onSubmit={batchCodeForm.handleSubmit(handleCreateBatchCodes)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={batchCodeForm.control}
                        name="prefix"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code Prefix</FormLabel>
                            <FormControl>
                              <Input placeholder="SUMMER" {...field} />
                            </FormControl>
                            <FormDescription>
                              Common prefix for all generated codes
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={batchCodeForm.control}
                        name="count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Codes</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={1} 
                                max={100}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              How many codes to generate (max 100)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* The rest of the batch form is similar to the single code form */}
                    {/* ... similar fields for discount_type, discount_value, description, etc. */}
                    
                    <Button type="submit" className="w-full" disabled={isBatchCreating}>
                      {isBatchCreating ? 'Creating...' : `Generate ${batchCodeForm.watch('count')} Codes`}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Promotion Codes</h3>
              <div className="flex gap-2">
                <Button onClick={exportCodes} size="sm" variant="outline" className="gap-1">
                  <FileUpload className="h-4 w-4" />
                  Export CSV
                </Button>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <FileCheck className="h-4 w-4" />
                      Import CSV
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Import Promotion Codes</SheetTitle>
                      <SheetDescription>
                        Upload a CSV file with your promotion codes
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FileScan className="h-12 w-12 text-muted-foreground mb-2" />
                          <span className="font-medium">Click to select a CSV file</span>
                          <span className="text-sm text-muted-foreground mt-1">
                            or drag and drop your file here
                          </span>
                        </label>
                        {csvData && <p className="mt-2 text-sm text-green-600">File loaded successfully!</p>}
                      </div>
                      <Button 
                        onClick={handleImport} 
                        disabled={!csvData || importing}
                        className="w-full"
                      >
                        {importing ? 'Importing...' : 'Import Codes'}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button onClick={() => refetchCodes()} size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isLoadingCodes ? (
              <div className="text-center py-8">Loading promotion codes...</div>
            ) : isErrorCodes ? (
              <div className="text-center py-8 text-destructive">Error loading codes</div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotionCodes.length > 0 ? (
                      promotionCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono font-medium">{code.code}</TableCell>
                          <TableCell>
                            {code.discount_type === 'percentage'
                              ? `${code.discount_value}%`
                              : `$${code.discount_value.toFixed(2)}`}
                          </TableCell>
                          <TableCell>{code.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant={code.is_active ? "success" : "secondary"}
                            >
                              {code.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {code.usage_count ?? 0}
                            {code.usage_limit ? ` / ${code.usage_limit}` : ''}
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the promotion code "{code.code}".
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteCode(code.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No promotion codes found. Create one to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Performance Analytics</h3>
              <Button onClick={() => refetchAnalytics()} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {isLoadingAnalytics ? (
              <div className="text-center py-8">Loading analytics data...</div>
            ) : isErrorAnalytics ? (
              <div className="text-center py-8 text-destructive">Error loading analytics</div>
            ) : analyticsData && analyticsData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Total Redemptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analyticsData.reduce((sum, item) => sum + (item.redemptions || 0), 0)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Total Discount Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${analyticsData.reduce((sum, item) => sum + (item.total_discount_amount || 0), 0).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Avg. Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${(analyticsData.reduce((sum, item) => sum + (item.average_order_value || 0), 0) / analyticsData.length).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Promotion Code Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getChartData()}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="code" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="redemptions" name="Redemptions" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="value" name="Discount Value ($)" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No analytics data available. Create and distribute promotion codes to see performance metrics.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        Promotion codes manager v1.0 — {new Date().toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default PromoCodeGenerator;
