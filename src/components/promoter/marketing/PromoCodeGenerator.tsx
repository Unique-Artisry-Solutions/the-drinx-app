
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, FileDown, FileUp, BarChart3, RefreshCw } from 'lucide-react';
import { usePromotionCodes } from '@/hooks/usePromotionCodes';
import { useAuth } from '@/contexts/auth';
import { format } from 'date-fns';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePromotionCodeParams } from '@/lib/promotions/api';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';
import { UserSegmentType, ValidDays } from '@/types/auth/AuthTypes';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnalyticsExport } from '@/hooks/useAnalyticsExport';
import { PromotionAnalytics } from '@/lib/promotions/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().min(2, "Description is required"),
  discount_type: z.enum(["percentage", "fixed", "free_item"]),
  discount_value: z.coerce.number().min(0, "Value must be positive"),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  usage_limit: z.coerce.number().nullable().optional(),
  valid_days: z.array(z.string()).nullable().optional(),
  valid_hours: z.object({
    start: z.string(),
    end: z.string(),
  }).nullable().optional(),
  user_segment: z.enum(["all", "new", "returning"]).nullable().optional(),
  combinable: z.boolean().default(true),
  min_purchase_amount: z.coerce.number().nullable().optional(),
});

const batchFormSchema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  count: z.coerce.number().min(1, "Must generate at least 1 code").max(100, "Maximum 100 codes at once"),
  discount_type: z.enum(["percentage", "fixed", "free_item"]),
  discount_value: z.coerce.number().min(0, "Value must be positive"),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  usage_limit: z.coerce.number().nullable().optional(),
  description: z.string().min(2, "Description is required"),
});

const daysOfWeek: ValidDays[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const PromoCodeGenerator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { exportAnalytics } = useAnalyticsExport();
  const [activeTab, setActiveTab] = useState("create");
  const [fileImporting, setFileImporting] = useState(false);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [isBatchCreating, setIsBatchCreating] = useState(false);
  const [timeRestricted, setTimeRestricted] = useState(false);
  const [dayRestricted, setDayRestricted] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [openForm, setOpenForm] = useState(false);

  // Get establishment ID from the logged-in user
  const establishmentId = user?.id || 'test-establishment-id';

  const {
    promotionCodes,
    analyticsData,
    isLoadingCodes,
    isLoadingAnalytics,
    createCode,
    batchCreateCodes,
    exportCodes,
    importCodes,
  } = usePromotionCodes(establishmentId);

  // Form for creating single promotion
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      start_date: new Date(),
      end_date: null,
      usage_limit: null,
      valid_days: null,
      valid_hours: null,
      user_segment: "all",
      combinable: true,
      min_purchase_amount: null,
    },
  });

  // Form for batch creation
  const batchForm = useForm<z.infer<typeof batchFormSchema>>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      prefix: "PROMO",
      count: 5,
      discount_type: "percentage",
      discount_value: 10,
      start_date: new Date(),
      end_date: null,
      usage_limit: 1,
      description: "Special promotion",
    },
  });

  // Handle single code creation
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsCreatingCode(true);
    
    try {
      const promotionData: CreatePromotionCodeParams = {
        ...values,
        establishment_id: establishmentId,
        // Convert dates to ISO strings for the API
        start_date: values.start_date.toISOString(),
        end_date: values.end_date ? values.end_date.toISOString() : null,
        // Only include valid_days if day restrictions are enabled
        valid_days: dayRestricted ? selectedDays : null,
        // Only include valid_hours if time restrictions are enabled
        valid_hours: timeRestricted && values.valid_hours ? values.valid_hours : null,
      };

      await createCode(promotionData);
      toast({
        title: "Success",
        description: "Promotion code has been created successfully!",
      });
      form.reset();
      setActiveTab("list");
      setOpenForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create promotion code: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingCode(false);
    }
  };

  // Handle batch creation of codes
  const onBatchSubmit = async (values: z.infer<typeof batchFormSchema>) => {
    setIsBatchCreating(true);
    
    try {
      const codes: Omit<CreatePromotionCodeParams, 'establishment_id'>[] = [];
      
      for (let i = 0; i < values.count; i++) {
        const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
        codes.push({
          code: `${values.prefix}-${suffix}`,
          description: values.description,
          discount_type: values.discount_type,
          discount_value: values.discount_value,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date ? values.end_date.toISOString() : null,
          usage_limit: values.usage_limit,
        });
      }
      
      await batchCreateCodes({
        establishment_id: establishmentId,
        codes,
      });
      
      toast({
        title: "Success",
        description: `Successfully created ${values.count} promotion codes!`,
      });
      batchForm.reset();
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create promotion codes: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsBatchCreating(false);
    }
  };

  // Handle CSV file import
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setFileImporting(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const csvData = e.target?.result as string;
        if (csvData) {
          await importCodes(csvData);
          setCsvFile(null);
        }
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to import CSV data: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setFileImporting(false);
    }
  };

  // Handle export of analytics data
  const handleExportAnalytics = async () => {
    try {
      await exportAnalytics(
        analyticsData, 
        `promotion-analytics-${format(new Date(), 'yyyy-MM-dd')}`
      );
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to export analytics data: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="list">Promotion Codes</TabsTrigger>
          <TabsTrigger value="create">Create Code</TabsTrigger>
          <TabsTrigger value="batch">Batch Create</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Promotion Codes</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCodes} className="flex items-center gap-1">
                <FileDown className="h-4 w-4" /> Export
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <FileUp className="h-4 w-4" /> Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Promotion Codes</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="csv-file">Upload CSV File</Label>
                      <Input 
                        id="csv-file" 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange} 
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        CSV should include: code, description, discount_type, discount_value, etc.
                      </p>
                    </div>
                    <Button 
                      onClick={handleImport} 
                      disabled={!csvFile || fileImporting}
                      className="w-full"
                    >
                      {fileImporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        'Import Codes'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" /> Create Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Promotion Code</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-full pr-4">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="SUMMER2023" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="discount_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select discount type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    <SelectItem value="free_item">Free Item</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Summer promotion" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="discount_value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {form.watch('discount_type') === 'percentage' ? 'Percentage' : 
                                   form.watch('discount_type') === 'fixed' ? 'Amount ($)' : 'Value'}
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="usage_limit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Usage Limit (optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    placeholder="Unlimited" 
                                    value={field.value || ''} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>End Date (optional)</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>No end date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value || undefined}
                                      onSelect={field.onChange}
                                      initialFocus
                                      fromDate={form.watch('start_date')}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="font-medium text-sm">Advanced Options</h3>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="day-restrictions">Day Restrictions</Label>
                              <div className="text-sm text-muted-foreground">Limit usage to specific days of the week</div>
                            </div>
                            <Switch
                              id="day-restrictions"
                              checked={dayRestricted}
                              onCheckedChange={setDayRestricted}
                            />
                          </div>

                          {dayRestricted && (
                            <div className="border rounded-md p-3 space-y-2">
                              <Label>Valid Days</Label>
                              <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day) => (
                                  <div key={day} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={day}
                                      checked={selectedDays.includes(day)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedDays([...selectedDays, day]);
                                        } else {
                                          setSelectedDays(selectedDays.filter((d) => d !== day));
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={day}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {day}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="time-restrictions">Time Restrictions</Label>
                              <div className="text-sm text-muted-foreground">Limit usage to specific hours</div>
                            </div>
                            <Switch
                              id="time-restrictions"
                              checked={timeRestricted}
                              onCheckedChange={setTimeRestricted}
                            />
                          </div>

                          {timeRestricted && (
                            <div className="border rounded-md p-3 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="start-time">Start Time</Label>
                                  <Input
                                    id="start-time"
                                    type="time"
                                    onChange={(e) => {
                                      form.setValue('valid_hours', {
                                        start: e.target.value,
                                        end: form.watch('valid_hours')?.end || '23:59'
                                      });
                                    }}
                                    value={form.watch('valid_hours')?.start || ''}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="end-time">End Time</Label>
                                  <Input
                                    id="end-time"
                                    type="time"
                                    onChange={(e) => {
                                      form.setValue('valid_hours', {
                                        start: form.watch('valid_hours')?.start || '00:00',
                                        end: e.target.value
                                      });
                                    }}
                                    value={form.watch('valid_hours')?.end || ''}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name="user_segment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>User Segment</FormLabel>
                                <Select
                                  onValueChange={(value) => field.onChange(value as UserSegmentType)}
                                  defaultValue={field.value || 'all'}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Target audience" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="new">New Users Only</SelectItem>
                                    <SelectItem value="returning">Returning Users Only</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Target specific user types with this promotion
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="min_purchase_amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Purchase Amount ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01"
                                    placeholder="No minimum" 
                                    value={field.value || ''} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Minimum purchase amount required to use this promotion
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="combinable"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Allow combining with other promotions
                                  </FormLabel>
                                  <FormDescription>
                                    If checked, this promotion can be used together with other promotions
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" className="w-full" disabled={isCreatingCode}>
                          {isCreatingCode ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            'Create Promotion Code'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoadingCodes ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : promotionCodes.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotionCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-semibold">{code.code}</TableCell>
                      <TableCell>{code.description}</TableCell>
                      <TableCell>
                        {code.discount_type === 'percentage' ? `${code.discount_value}%` :
                         code.discount_type === 'fixed' ? `$${code.discount_value.toFixed(2)}` :
                         'Free Item'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={code.is_active ? "success" : "secondary"}>
                          {code.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {code.usage_count || 0} 
                        {code.usage_limit ? ` / ${code.usage_limit}` : ''}
                      </TableCell>
                      <TableCell>
                        {format(new Date(code.start_date), 'MM/dd/yyyy')}
                        {code.end_date ? ` - ${format(new Date(code.end_date), 'MM/dd/yyyy')}` : ' - No end date'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="text-center">
                  <p className="text-muted-foreground">No promotion codes found</p>
                  <p className="text-sm text-muted-foreground">Create your first promotion code to get started.</p>
                </div>
                <Button onClick={() => setActiveTab("create")}>Create Promotion Code</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Create Single Code */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a Promotion Code</CardTitle>
              <CardDescription>
                Set up a new promotion code with detailed configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  Promotion codes work best when clearly communicated to your target audience.
                  Consider sharing them through your social media channels or email campaigns.
                </AlertDescription>
              </Alert>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Input placeholder="SUMMER2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discount_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                              <SelectItem value="free_item">Free Item</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer promotion" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discount_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch('discount_type') === 'percentage' ? 'Percentage' : 
                             form.watch('discount_type') === 'fixed' ? 'Amount ($)' : 'Value'}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="usage_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage Limit (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              placeholder="Unlimited" 
                              value={field.value || ''} 
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>No end date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                                fromDate={form.watch('start_date')}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Advanced Options</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="day-restrictions">Day Restrictions</Label>
                        <div className="text-sm text-muted-foreground">Limit usage to specific days of the week</div>
                      </div>
                      <Switch
                        id="day-restrictions"
                        checked={dayRestricted}
                        onCheckedChange={setDayRestricted}
                      />
                    </div>

                    {dayRestricted && (
                      <div className="border rounded-md p-3 space-y-2">
                        <Label>Valid Days</Label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={selectedDays.includes(day)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedDays([...selectedDays, day]);
                                  } else {
                                    setSelectedDays(selectedDays.filter((d) => d !== day));
                                  }
                                }}
                              />
                              <label
                                htmlFor={day}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="time-restrictions">Time Restrictions</Label>
                        <div className="text-sm text-muted-foreground">Limit usage to specific hours</div>
                      </div>
                      <Switch
                        id="time-restrictions"
                        checked={timeRestricted}
                        onCheckedChange={setTimeRestricted}
                      />
                    </div>

                    {timeRestricted && (
                      <div className="border rounded-md p-3 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input
                              id="start-time"
                              type="time"
                              onChange={(e) => {
                                form.setValue('valid_hours', {
                                  start: e.target.value,
                                  end: form.watch('valid_hours')?.end || '23:59'
                                });
                              }}
                              value={form.watch('valid_hours')?.start || ''}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input
                              id="end-time"
                              type="time"
                              onChange={(e) => {
                                form.setValue('valid_hours', {
                                  start: form.watch('valid_hours')?.start || '00:00',
                                  end: e.target.value
                                });
                              }}
                              value={form.watch('valid_hours')?.end || ''}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="user_segment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Segment</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value as UserSegmentType)}
                            defaultValue={field.value || 'all'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Target audience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="new">New Users Only</SelectItem>
                              <SelectItem value="returning">Returning Users Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Target specific user types with this promotion
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="min_purchase_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Purchase Amount ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01"
                              placeholder="No minimum" 
                              value={field.value || ''} 
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum purchase amount required to use this promotion
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="combinable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Allow combining with other promotions
                            </FormLabel>
                            <FormDescription>
                              If checked, this promotion can be used together with other promotions
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <CardFooter className="px-0">
                    <Button type="submit" className="ml-auto" disabled={isCreatingCode}>
                      {isCreatingCode ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Promotion Code'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch Create */}
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch Create Promotion Codes</CardTitle>
              <CardDescription>
                Generate multiple codes at once for campaigns or events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  Batch created codes work well for distributing unique single-use codes to subscribers or event attendees.
                </AlertDescription>
              </Alert>
              
              <Form {...batchForm}>
                <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={batchForm.control}
                      name="prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code Prefix</FormLabel>
                          <FormControl>
                            <Input placeholder="SUMMER" {...field} />
                          </FormControl>
                          <FormDescription>
                            A prefix for all generated codes (e.g. SUMMER-ABCDE)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={batchForm.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Codes</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="100" {...field} />
                          </FormControl>
                          <FormDescription>
                            How many unique codes to generate (max 100)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={batchForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer campaign codes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={batchForm.control}
                      name="discount_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                              <SelectItem value="free_item">Free Item</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={batchForm.control}
                      name="discount_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {batchForm.watch('discount_type') === 'percentage' ? 'Percentage' : 
                             batchForm.watch('discount_type') === 'fixed' ? 'Amount ($)' : 'Value'}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={batchForm.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={batchForm.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>No end date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                                fromDate={batchForm.watch('start_date')}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={batchForm.control}
                    name="usage_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage Limit Per Code</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="1" 
                            value={field.value || ''} 
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                          />
                        </FormControl>
                        <FormDescription>
                          How many times each code can be used (default: 1)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0">
                    <Button type="submit" className="ml-auto" disabled={isBatchCreating}>
                      {isBatchCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Batch'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Promotion Analytics</CardTitle>
                <CardDescription>
                  View performance metrics for your promotion codes
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleExportAnalytics}
                >
                  <FileDown className="h-4 w-4" /> Export Data
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : analyticsData && analyticsData.length > 0 ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {analyticsData.reduce((sum, item) => sum + item.total_usage, 0)}
                          </div>
                          <p className="text-muted-foreground">Total Redemptions</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            ${analyticsData.reduce((sum, item) => sum + item.total_revenue, 0).toFixed(2)}
                          </div>
                          <p className="text-muted-foreground">Revenue Generated</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {(analyticsData.reduce((sum, item) => sum + item.conversion_rate, 0) / analyticsData.length).toFixed(1)}%
                          </div>
                          <p className="text-muted-foreground">Avg. Conversion Rate</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            ${(analyticsData.reduce((sum, item) => sum + item.average_order_value, 0) / analyticsData.length).toFixed(2)}
                          </div>
                          <p className="text-muted-foreground">Avg. Order Value</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Promotion Code Performance</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.map(item => {
                            const code = promotionCodes.find(c => c.id === item.promotion_id);
                            return {
                              code: code ? code.code : `Code ${item.promotion_id.substring(0, 4)}`,
                              usage: item.total_usage,
                              revenue: item.total_revenue,
                            };
                          }).sort((a, b) => b.usage - a.usage).slice(0, 10)}
                          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="code" angle={-45} textAnchor="end" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="usage" name="Redemptions" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={30} />
                          <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Detailed Analytics</h3>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Promotion Code</TableHead>
                            <TableHead>Total Usage</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Conversion Rate</TableHead>
                            <TableHead>Avg. Order Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analyticsData.map((item) => {
                            const code = promotionCodes.find(c => c.id === item.promotion_id);
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-mono">
                                  {code ? code.code : `Code ${item.promotion_id.substring(0, 8)}`}
                                </TableCell>
                                <TableCell>{item.total_usage}</TableCell>
                                <TableCell>${item.total_revenue.toFixed(2)}</TableCell>
                                <TableCell>{item.conversion_rate.toFixed(1)}%</TableCell>
                                <TableCell>${item.average_order_value.toFixed(2)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No Analytics Data Yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Analytics will appear here once your promotion codes are being used.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoCodeGenerator;
