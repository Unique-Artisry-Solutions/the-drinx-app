
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { EventMarketingCampaign } from '@/types/EventTypes';

interface MarketingCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<EventMarketingCampaign>) => void;
  campaign?: Partial<EventMarketingCampaign>;
  eventId: string;
}

const MarketingCampaignModal: React.FC<MarketingCampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaign
}) => {
  const [formData, setFormData] = useState<Partial<EventMarketingCampaign>>({
    name: campaign?.name || '',
    description: campaign?.description || '',
    campaign_type: campaign?.campaign_type || 'email',
    status: campaign?.status || 'draft',
    budget: campaign?.budget || undefined,
    start_date: campaign?.start_date || undefined,
    end_date: campaign?.end_date || undefined,
    ...campaign
  });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const handleDateRangeChange = (dates: { from: Date | undefined; to: Date | undefined }) => {
    setFormData(prev => ({
      ...prev,
      start_date: dates.from?.toISOString(),
      end_date: dates.to?.toISOString()
    }));
  };

  const handleClearEndDate = () => {
    setFormData(prev => ({ ...prev, end_date: undefined }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {campaign ? 'Edit Marketing Campaign' : 'Create Marketing Campaign'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter campaign name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter campaign description"
            />
          </div>

          <div>
            <Label htmlFor="campaign_type">Campaign Type</Label>
            <Select
              value={formData.campaign_type}
              onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Marketing</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="paid">Paid Advertising</SelectItem>
                <SelectItem value="influencer">Influencer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'draft' | 'active' | 'completed' | 'cancelled') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
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

          <div>
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                budget: e.target.value ? Number(e.target.value) : undefined 
              })}
              placeholder="Enter budget amount"
            />
          </div>

          <div>
            <Label>Campaign Duration</Label>
            <div className="space-y-2">
              <DatePickerWithRange
                date={{
                  from: formData.start_date ? new Date(formData.start_date) : undefined,
                  to: formData.end_date ? new Date(formData.end_date) : undefined
                }}
                onDateChange={handleDateRangeChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleClearEndDate}
              >
                Clear End Date
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {campaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingCampaignModal;
