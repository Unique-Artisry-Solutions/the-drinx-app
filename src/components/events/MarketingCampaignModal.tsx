
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';

interface MarketingCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<EventMarketingCampaign>) => Promise<void>;
  campaign?: EventMarketingCampaign;
  isEditing?: boolean;
}

const campaignTypes = [
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'sms', label: 'SMS Messages' },
  { value: 'push', label: 'Push Notifications' },
  { value: 'partner', label: 'Partner Promotions' },
];

const initialState: Partial<EventMarketingCampaign> = {
  name: '',
  description: '',
  campaign_type: 'email',
  status: 'draft',
  start_date: new Date().toISOString(),
  end_date: undefined,
  budget: 0,
  metrics: {},
  target_audience: {},
};

const MarketingCampaignModal: React.FC<MarketingCampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaign,
  isEditing = false
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Partial<EventMarketingCampaign>>(
    campaign || initialState
  );
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    formData.start_date ? new Date(formData.start_date) : new Date()
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    formData.end_date ? new Date(formData.end_date) : undefined
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when the modal opens/closes or campaign changes
  React.useEffect(() => {
    if (campaign) {
      setFormData(campaign);
      setStartDate(campaign.start_date ? new Date(campaign.start_date) : new Date());
      setEndDate(campaign.end_date ? new Date(campaign.end_date) : undefined);
    } else {
      setFormData(initialState);
      setStartDate(new Date());
      setEndDate(undefined);
    }
  }, [campaign, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...formData,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
      };
      
      await onSave(dataToSave);
      toast({
        title: isEditing ? 'Campaign Updated' : 'Campaign Created',
        description: `Campaign has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} campaign.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Campaign' : 'New Marketing Campaign'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign_type">Campaign Type</Label>
              <Select
                value={formData.campaign_type || 'email'}
                onValueChange={(value) => handleSelectChange('campaign_type', value)}
              >
                <SelectTrigger id="campaign_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {campaignTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'draft'}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={formData.budget || ''}
              onChange={handleNumberChange}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingCampaignModal;
