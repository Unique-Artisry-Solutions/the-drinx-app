
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { AudienceSegment } from '@/types/AudienceTypes';

interface MarketingCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<EventMarketingCampaign>, segments?: { segment_id: string; allocation_percentage?: number }[]) => void;
  campaign?: EventMarketingCampaign;
  isEditing: boolean;
  eventId: string;
  availableSegments?: AudienceSegment[];
}

const MarketingCampaignModal: React.FC<MarketingCampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaign,
  isEditing,
  eventId,
  availableSegments = [] // Default to empty array if not provided
}) => {
  const [formData, setFormData] = useState<Partial<EventMarketingCampaign>>({
    name: '',
    description: '',
    campaign_type: 'email',
    status: 'draft',
    start_date: new Date().toISOString(),
    end_date: null,
    budget: null,
    target_audience: {}
  });
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description,
        campaign_type: campaign.campaign_type,
        status: campaign.status,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        budget: campaign.budget,
        target_audience: campaign.target_audience
      });
      
      // Set the dates for the calendar
      if (campaign.start_date) {
        setStartDate(new Date(campaign.start_date));
      }
      if (campaign.end_date) {
        setEndDate(new Date(campaign.end_date));
      }
    } else {
      // Reset form for new campaign
      setFormData({
        name: '',
        description: '',
        campaign_type: 'email',
        status: 'draft',
        start_date: new Date().toISOString(),
        end_date: null,
        budget: null,
        target_audience: {}
      });
      
      setStartDate(new Date());
      setEndDate(undefined);
      setSelectedSegments([]);
    }
  }, [campaign, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, start_date: date.toISOString() }));
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, end_date: date.toISOString() }));
    } else {
      setFormData(prev => ({ ...prev, end_date: null }));
    }
  };
  
  const handleSegmentChange = (segmentId: string, selected: boolean) => {
    if (selected) {
      setSelectedSegments(prev => [...prev, segmentId]);
    } else {
      setSelectedSegments(prev => prev.filter(id => id !== segmentId));
    }
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      // Format data as needed before submitting
    };
    
    // Convert selected segments into the format expected by the backend
    const segmentData = selectedSegments.map(segmentId => ({
      segment_id: segmentId,
      allocation_percentage: 100 // Default to 100%
    }));
    
    onSave(finalData, segmentData.length > 0 ? segmentData : undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Marketing Campaign' : 'Create Marketing Campaign'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details of your marketing campaign' 
              : 'Fill in the details to create a new marketing campaign'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Campaign name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Campaign description"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campaign_type" className="text-right">
              Type
            </Label>
            <Select
              value={formData.campaign_type}
              onValueChange={(value) => handleSelectChange('campaign_type', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Campaign</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="display">Display Ads</SelectItem>
                <SelectItem value="sms">SMS Campaign</SelectItem>
                <SelectItem value="referral">Referral Program</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Optional</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                  disabled={(date) => date < (startDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">
              Budget
            </Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget || ''}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Optional budget amount"
            />
          </div>
          
          {/* Display available audience segments if provided */}
          {availableSegments && availableSegments.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-2">
              <Label className="text-right self-start mt-2">
                Target Segments
              </Label>
              <div className="col-span-3 space-y-2 border rounded-md p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Select audience segments to target with this campaign.
                  You can configure targeting details after creating the campaign.
                </p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {availableSegments.map(segment => (
                    <div key={segment.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`segment-${segment.id}`}
                        checked={selectedSegments.includes(segment.id)}
                        onChange={(e) => handleSegmentChange(segment.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`segment-${segment.id}`} className="font-normal">
                        {segment.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isEditing ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingCampaignModal;
