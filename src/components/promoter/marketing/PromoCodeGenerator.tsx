
import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { usePromotionCodes } from "@/hooks/usePromotionCodes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Package,
  Edit, 
  Trash, 
  MoreVertical, 
  Code, 
  FileInput, 
  FileOutput, 
  BarChart3,
  Calendar,
  Clock,
  Users,
  ShoppingBasket,
  Layers,
  Info
} from "lucide-react";

// Form schema for single code creation
const singleCodeSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().positive("Value must be positive"),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().default(true),
  usage_limit: z.coerce.number().int().positive().nullable().optional(),
  valid_days: z.array(z.string()).nullable().optional(),
  valid_hours: z.object({
    start: z.string(),
    end: z.string()
  }).nullable().optional(),
  user_segment: z.enum(["all", "new", "returning"]).optional(),
  combinable: z.boolean().default(true),
  min_purchase_amount: z.coerce.number().positive().nullable().optional()
});

// Form schema for batch code creation
const batchCodeSchema = z.object({
  prefix: z.string().min(2, "Prefix must be at least 2 characters"),
  count: z.coerce.number().int().positive().max(100, "Maximum 100 codes at once"),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().positive("Value must be positive"),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().default(true),
  usage_limit: z.coerce.number().int().positive().nullable().optional(),
  valid_days: z.array(z.string()).nullable().optional(),
  valid_hours: z.object({
    start: z.string(),
    end: z.string()
  }).nullable().optional(),
  user_segment: z.enum(["all", "new", "returning"]).optional(),
  combinable: z.boolean().default(true),
  min_purchase_amount: z.coerce.number().positive().nullable().optional()
});

type SingleCodeFormValues = z.infer<typeof singleCodeSchema>;
type BatchCodeFormValues = z.infer<typeof batchCodeSchema>;

// Temporary establishment ID - in a real application, this would come from context or props
const TEMP_ESTABLISHMENT_ID = "c7e47c8b-5793-4a78-8e7a-0d1c5d5f654e";

const PromoCodeGenerator: React.FC = () => {
  // State for UI controls
  const [activeTab, setActiveTab] = useState("view");
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedCodeForAnalytics, setSelectedCodeForAnalytics] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [weekdays] = useState([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]);
  
  // Use the hook to manage promotion codes
  const {
    promotionCodes,
    analyticsData,
    isLoadingCodes,
    isErrorCodes,
    isLoadingAnalytics,
    createCode,
    updateCode,
    deleteCode,
    batchCreateCodes,
    exportCodes,
    importCodes,
    importing,
    isCreating,
    isUpdating,
    isDeleting,
    isBatchCreating
  } = usePromotionCodes(TEMP_ESTABLISHMENT_ID);

  // Form for single code creation/editing
  const singleCodeForm = useForm<SingleCodeFormValues>({
    resolver: zodResolver(singleCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      start_date: new Date(),
      is_active: true,
      combinable: true,
      valid_days: null,
      valid_hours: null,
      user_segment: "all"
    }
  });

  // Form for batch code creation
  const batchCodeForm = useForm<BatchCodeFormValues>({
    resolver: zodResolver(batchCodeSchema),
    defaultValues: {
      prefix: "PROMO",
      count: 10,
      discount_type: "percentage",
      discount_value: 10,
      start_date: new Date(),
      is_active: true,
      combinable: true,
      valid_days: null,
      valid_hours: null,
      user_segment: "all"
    }
  });

  // Initialize form with editing values
  const setupEditForm = (code: any) => {
    singleCodeForm.reset({
      code: code.code,
      description: code.description,
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      start_date: new Date(code.start_date),
      end_date: code.end_date ? new Date(code.end_date) : undefined,
      is_active: code.is_active,
      usage_limit: code.usage_limit || undefined,
      valid_days: code.valid_days || [],
      valid_hours: code.valid_hours || null,
      user_segment: code.user_segment || "all",
      combinable: code.combinable,
      min_purchase_amount: code.min_purchase_amount || undefined
    });
  };

  // Handle creating a single code
  const handleCreateSingleCode = (data: SingleCodeFormValues) => {
    if (editingCodeId) {
      // Update existing code
      updateCode({
        id: editingCodeId,
        params: {
          ...data,
          establishment_id: TEMP_ESTABLISHMENT_ID
        }
      });
    } else {
      // Create new code
      createCode({
        ...data,
        establishment_id: TEMP_ESTABLISHMENT_ID
      });
    }
    
    singleCodeForm.reset();
    setEditingCodeId(null);
    setActiveTab("view");
  };

  // Handle creating multiple codes
  const handleBatchCreate = (data: BatchCodeFormValues) => {
    batchCreateCodes({
      ...data,
      establishment_id: TEMP_ESTABLISHMENT_ID
    });
    
    batchCodeForm.reset();
    setActiveTab("view");
  };

  // Handle editing a code
  const handleEditCode = (code: any) => {
    setEditingCodeId(code.id);
    setupEditForm(code);
    setActiveTab("create");
  };

  // Handle deleting a code
  const handleDeleteCode = (id: string) => {
    setCodeToDelete(id);
    setDeleteAlertOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (codeToDelete) {
      deleteCode(codeToDelete);
      setCodeToDelete(null);
    }
    setDeleteAlertOpen(false);
  };

  // Handle importing from CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };

  // Handle importing
  const handleImportSubmit = async () => {
    if (csvContent.trim()) {
      await importCodes(csvContent);
      setCsvContent("");
      setImportDialogOpen(false);
    }
  };

  // View analytics for a specific code
  const viewAnalytics = (code: string) => {
    setSelectedCodeForAnalytics(code);
    setAnalyticsDialogOpen(true);
  };

  // Get analytics for a specific code
  const getCodeAnalytics = (code: string) => {
    return analyticsData.find(data => data.code === code) || {
      redemptions: 0,
      total_discount_amount: 0,
      average_order_value: 0,
      conversion_rate: 0
    };
  };

  // Render the analytics dialog
  const renderAnalyticsDialog = () => {
    if (!selectedCodeForAnalytics) return null;
    
    const analytics = getCodeAnalytics(selectedCodeForAnalytics);
    const selectedCode = promotionCodes.find(c => c.code === selectedCodeForAnalytics);
    
    if (!selectedCode) return null;
    
    return (
      <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics for {selectedCodeForAnalytics}
            </DialogTitle>
            <DialogDescription>
              Performance metrics for this promotion code
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{analytics.redemptions}</div>
                <div className="text-sm text-muted-foreground">Total Redemptions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">${analytics.total_discount_amount.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Discount</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">${analytics.average_order_value.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Avg Order Value</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{analytics.conversion_rate ? `${(analytics.conversion_rate * 100).toFixed(1)}%` : 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Code Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Discount:</div>
              <div>
                {selectedCode.discount_type === 'percentage' 
                  ? `${selectedCode.discount_value}%` 
                  : `$${selectedCode.discount_value}`}
              </div>
              
              <div className="text-muted-foreground">Active Period:</div>
              <div>
                {format(new Date(selectedCode.start_date), 'MMM d, yyyy')} 
                {selectedCode.end_date && ` - ${format(new Date(selectedCode.end_date), 'MMM d, yyyy')}`}
              </div>
              
              <div className="text-muted-foreground">Usage Limit:</div>
              <div>{selectedCode.usage_limit || 'Unlimited'}</div>
              
              <div className="text-muted-foreground">Current Usage:</div>
              <div>{selectedCode.usage_count || 0}</div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyticsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Format restrictions display text
  const formatRestrictions = (code: any) => {
    const restrictions = [];
    
    if (code.valid_days && code.valid_days.length > 0) {
      restrictions.push(`Days: ${code.valid_days.join(', ')}`);
    }
    
    if (code.valid_hours) {
      restrictions.push(`Hours: ${code.valid_hours.start}-${code.valid_hours.end}`);
    }
    
    if (code.user_segment && code.user_segment !== 'all') {
      restrictions.push(`Users: ${code.user_segment}`);
    }
    
    if (code.min_purchase_amount) {
      restrictions.push(`Min purchase: $${code.min_purchase_amount}`);
    }
    
    if (!code.combinable) {
      restrictions.push('Not combinable');
    }
    
    return restrictions.join(' • ');
  };

  // Render table of existing codes
  const renderCodesTable = () => {
    if (isLoadingCodes) {
      return <div className="text-center py-8">Loading codes...</div>;
    }
    
    if (isErrorCodes) {
      return <div className="text-center py-8 text-red-500">Error loading codes</div>;
    }
    
    if (promotionCodes.length === 0) {
      return (
        <div className="text-center py-12">
          <Code className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No promotion codes</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first promotion code to get started.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setActiveTab("create")}
          >
            Create Code
          </Button>
        </div>
      );
    }
    
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Restrictions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotionCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>
                  {code.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </TableCell>
                <TableCell>
                  {code.discount_type === 'percentage' 
                    ? `${code.discount_value}%` 
                    : `$${code.discount_value}`}
                </TableCell>
                <TableCell>
                  {code.end_date 
                    ? format(new Date(code.end_date), 'MMM d, yyyy')
                    : 'No expiration'}
                </TableCell>
                <TableCell>
                  <Badge variant={code.is_active ? "default" : "secondary"}>
                    {code.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-xs">
                    {formatRestrictions(code) || 'None'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditCode(code)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => viewAnalytics(code.code)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCode(code.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Render form for single code creation/editing
  const renderSingleCodeForm = () => {
    return (
      <Form {...singleCodeForm}>
        <form onSubmit={singleCodeForm.handleSubmit(handleCreateSingleCode)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <FormField
              control={singleCodeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="SUMMER20" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique code customers will use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Discount Type */}
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
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Value */}
            <FormField
              control={singleCodeForm.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {singleCodeForm.watch("discount_type") === "percentage" 
                      ? "Discount Percentage" 
                      : "Discount Amount"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder={singleCodeForm.watch("discount_type") === "percentage" ? "10" : "5.00"} 
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {singleCodeForm.watch("discount_type") === "percentage" ? "%" : "$"}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Usage Limit */}
            <FormField
              control={singleCodeForm.control}
              name="usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value || ''} 
                      onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))} 
                      placeholder="Unlimited" 
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for unlimited usage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <FormField
              control={singleCodeForm.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* End Date */}
            <FormField
              control={singleCodeForm.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date (Optional)</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Description */}
          <FormField
            control={singleCodeForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Summer promotion for all customers" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Advanced Options Section */}
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Advanced Restrictions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valid Days */}
              <FormField
                control={singleCodeForm.control}
                name="valid_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Valid Days
                    </FormLabel>
                    <div className="flex flex-col space-y-2 pt-1">
                      {weekdays.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day}`}
                            checked={(field.value || []).includes(day)}
                            onCheckedChange={(checked) => {
                              let updatedDays = [...(field.value || [])];
                              if (checked) {
                                updatedDays.push(day);
                              } else {
                                updatedDays = updatedDays.filter(d => d !== day);
                              }
                              if (updatedDays.length === 0) updatedDays = null;
                              field.onChange(updatedDays);
                            }}
                          />
                          <label
                            htmlFor={`day-${day}`}
                            className="text-sm"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormDescription>
                      Leave unchecked for all days
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {/* Valid Hours */}
              <FormField
                control={singleCodeForm.control}
                name="valid_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Valid Hours
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <Input 
                          type="time" 
                          value={(field.value?.start || '')} 
                          onChange={(e) => {
                            const start = e.target.value;
                            const end = field.value?.end || '';
                            field.onChange(start || end ? { start, end } : null);
                          }} 
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">End Time</FormLabel>
                        <Input 
                          type="time" 
                          value={(field.value?.end || '')} 
                          onChange={(e) => {
                            const start = field.value?.start || '';
                            const end = e.target.value;
                            field.onChange(start || end ? { start, end } : null);
                          }} 
                        />
                      </div>
                    </div>
                    <FormDescription>
                      Leave empty for all hours
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* User Segment */}
              <FormField
                control={singleCodeForm.control}
                name="user_segment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      User Segment
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Min Purchase */}
              <FormField
                control={singleCodeForm.control}
                name="min_purchase_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <ShoppingBasket className="h-4 w-4 mr-2" />
                      Minimum Purchase
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          value={field.value || ''} 
                          onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} 
                          placeholder="No minimum" 
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          $
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Leave empty for no minimum
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Combinable */}
            <div className="mt-4">
              <FormField
                control={singleCodeForm.control}
                name="combinable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Combinable With Other Promotions</FormLabel>
                      <FormDescription>
                        Allow this code to be used with other active promotions
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
            
            {/* Active Status */}
            <div className="mt-4">
              <FormField
                control={singleCodeForm.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Turn on to make this promotion available immediately
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
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                singleCodeForm.reset();
                setEditingCodeId(null);
                setActiveTab("view");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 
                "Saving..." : 
                editingCodeId ? "Update Code" : "Create Code"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  // Render form for batch code creation
  const renderBatchCodeForm = () => {
    return (
      <Form {...batchCodeForm}>
        <form onSubmit={batchCodeForm.handleSubmit(handleBatchCreate)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prefix */}
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
                    Random characters will be added after this prefix
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Count */}
            <FormField
              control={batchCodeForm.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Codes</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum 100 codes at once
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Type */}
            <FormField
              control={batchCodeForm.control}
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
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Discount Value */}
            <FormField
              control={batchCodeForm.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {batchCodeForm.watch("discount_type") === "percentage" 
                      ? "Discount Percentage" 
                      : "Discount Amount"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder={batchCodeForm.watch("discount_type") === "percentage" ? "10" : "5.00"} 
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {batchCodeForm.watch("discount_type") === "percentage" ? "%" : "$"}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <FormField
              control={batchCodeForm.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* End Date */}
            <FormField
              control={batchCodeForm.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date (Optional)</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Usage Limit */}
          <FormField
            control={batchCodeForm.control}
            name="usage_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit (per code)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))} 
                    placeholder="Unlimited" 
                  />
                </FormControl>
                <FormDescription>
                  Leave empty for unlimited usage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Advanced Options Section */}
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Advanced Restrictions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valid Days */}
              <FormField
                control={batchCodeForm.control}
                name="valid_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Valid Days
                    </FormLabel>
                    <div className="flex flex-col space-y-2 pt-1">
                      {weekdays.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`batch-day-${day}`}
                            checked={(field.value || []).includes(day)}
                            onCheckedChange={(checked) => {
                              let updatedDays = [...(field.value || [])];
                              if (checked) {
                                updatedDays.push(day);
                              } else {
                                updatedDays = updatedDays.filter(d => d !== day);
                              }
                              if (updatedDays.length === 0) updatedDays = null;
                              field.onChange(updatedDays);
                            }}
                          />
                          <label
                            htmlFor={`batch-day-${day}`}
                            className="text-sm"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormDescription>
                      Leave unchecked for all days
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {/* Valid Hours */}
              <FormField
                control={batchCodeForm.control}
                name="valid_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Valid Hours
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <Input 
                          type="time" 
                          value={(field.value?.start || '')} 
                          onChange={(e) => {
                            const start = e.target.value;
                            const end = field.value?.end || '';
                            field.onChange(start || end ? { start, end } : null);
                          }} 
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">End Time</FormLabel>
                        <Input 
                          type="time" 
                          value={(field.value?.end || '')} 
                          onChange={(e) => {
                            const start = field.value?.start || '';
                            const end = e.target.value;
                            field.onChange(start || end ? { start, end } : null);
                          }} 
                        />
                      </div>
                    </div>
                    <FormDescription>
                      Leave empty for all hours
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* User Segment */}
              <FormField
                control={batchCodeForm.control}
                name="user_segment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      User Segment
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Min Purchase */}
              <FormField
                control={batchCodeForm.control}
                name="min_purchase_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <ShoppingBasket className="h-4 w-4 mr-2" />
                      Minimum Purchase
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          value={field.value || ''} 
                          onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} 
                          placeholder="No minimum" 
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          $
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Leave empty for no minimum
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Combinable */}
            <div className="mt-4">
              <FormField
                control={batchCodeForm.control}
                name="combinable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Combinable With Other Promotions</FormLabel>
                      <FormDescription>
                        Allow these codes to be used with other active promotions
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
            
            {/* Active Status */}
            <div className="mt-4">
              <FormField
                control={batchCodeForm.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Turn on to make these promotions available immediately
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
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                batchCodeForm.reset();
                setActiveTab("view");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isBatchCreating}>
              {isBatchCreating ? "Creating..." : "Generate Codes"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Promotion Code Management</CardTitle>
          <CardDescription>
            Create and manage discount codes for events and marketing
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Info className="h-4 w-4 mr-1" /> Help
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">About Promotion Codes</h4>
                <p className="text-sm text-muted-foreground">
                  Promotion codes can be used to offer discounts on tickets and 
                  event packages. You can create percentage-based or fixed-amount 
                  discounts with various restrictions.
                </p>
                <h4 className="font-medium pt-2">Advanced Rules</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" /> Set specific days when codes are valid
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-3 w-3 mr-2" /> Restrict to certain hours of the day
                  </li>
                  <li className="flex items-center">
                    <Users className="h-3 w-3 mr-2" /> Target specific user segments
                  </li>
                  <li className="flex items-center">
                    <ShoppingBasket className="h-3 w-3 mr-2" /> Set minimum purchase amounts
                  </li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
          
          {activeTab === "view" && (
            <Button onClick={() => setActiveTab("batch")} className="h-8" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Batch Create
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="view">View Codes</TabsTrigger>
            <TabsTrigger value="create">
              {editingCodeId ? 'Edit Code' : 'Create Code'}
            </TabsTrigger>
            <TabsTrigger value="batch">Batch Create</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Promotion Codes</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportCodes}
                >
                  <FileOutput className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <FileInput className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setActiveTab("create")}
                >
                  <Code className="h-4 w-4 mr-2" />
                  New Code
                </Button>
              </div>
            </div>
            
            {renderCodesTable()}
          </TabsContent>
          
          <TabsContent value="create" className="pt-4">
            <h3 className="text-lg font-medium mb-4">
              {editingCodeId ? 'Edit Promotion Code' : 'Create New Promotion Code'}
            </h3>
            {renderSingleCodeForm()}
          </TabsContent>
          
          <TabsContent value="batch" className="pt-4">
            <h3 className="text-lg font-medium mb-4">Batch Create Promotion Codes</h3>
            {renderBatchCodeForm()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 bg-muted/20">
        <div className="text-xs text-muted-foreground flex items-center">
          <Code className="h-3 w-3 mr-2" />
          {promotionCodes.length} total promotion codes
        </div>
      </CardFooter>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Promotion Codes</DialogTitle>
            <DialogDescription>
              Upload a CSV file with your promotion codes
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Choose CSV File
              </label>
              <Input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
              />
              <p className="text-xs text-muted-foreground">
                CSV should have headers: Code,Description,Type,Value,StartDate,EndDate,Active...
              </p>
            </div>
            
            {csvContent && (
              <div className="border rounded p-2">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <ScrollArea className="h-[100px]">
                  <pre className="text-xs">{csvContent.slice(0, 500)}...</pre>
                </ScrollArea>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImportSubmit}
              disabled={!csvContent.trim() || importing}
            >
              {importing ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this promotion code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Analytics Dialog */}
      {renderAnalyticsDialog()}
    </Card>
  );
};

export default PromoCodeGenerator;
