
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
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
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertCircle, CalendarIcon, TargetIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Badge } from '@/components/ui/badge';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketingCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Omit<EventMarketingCampaign, 'id'>) => void;
  campaign?: EventMarketingCampaign;
  isEditing: boolean;
  eventId: string;
}

const campaignTypes = [
  { value: 'email', label: 'Email Campaign' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'referral', label: 'Referral Program' },
  { value: 'influencer', label: 'Influencer Marketing' },
  { value: 'partner', label: 'Partner Promotion' }
];

const MarketingCampaignModal: React.FC<MarketingCampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  campaign,
  isEditing,
  eventId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [status, setStatus] = useState<'draft' | 'active' | 'completed' | 'cancelled'>('draft');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [isABTest, setIsABTest] = useState(false);
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [variantDistribution, setVariantDistribution] = useState<number>(50);
  const [activeTab, setActiveTab] = useState('basic');
  
  const { segments, isLoadingSegments } = useAudienceSegments();
  
  useEffect(() => {
    if (campaign) {
      setName(campaign.name || '');
      setDescription(campaign.description || '');
      setCampaignType(campaign.campaign_type || '');
      setStatus(campaign.status || 'draft');
      setStartDate(campaign.start_date ? new Date(campaign.start_date) : undefined);
      setEndDate(campaign.end_date ? new Date(campaign.end_date) : undefined);
      setBudget(campaign.budget);
      
      // Load audience targeting and A/B testing settings
      if (campaign.target_audience) {
        setSelectedSegmentId(campaign.target_audience.segmentId || null);
        
        if (campaign.target_audience.abTest) {
          setIsABTest(true);
          setVariantA(campaign.target_audience.abTest.variantA || '');
          setVariantB(campaign.target_audience.abTest.variantB || '');
          setVariantDistribution(campaign.target_audience.abTest.distribution || 50);
        }
      }
    } else {
      // Reset form for new campaign
      setName('');
      setDescription('');
      setCampaignType('');
      setStatus('draft');
      setStartDate(undefined);
      setEndDate(undefined);
      setBudget(undefined);
      setSelectedSegmentId(null);
      setIsABTest(false);
      setVariantA('');
      setVariantB('');
      setVariantDistribution(50);
    }
  }, [campaign, isOpen]);

  const handleSubmit = () => {
    // Create target audience object
    const targetAudience = {
      segmentId: selectedSegmentId,
      ...(isABTest && {
        abTest: {
          variantA,
          variantB,
          distribution: variantDistribution
        }
      })
    };

    onSave({
      event_id: eventId,
      name,
      description,
      campaign_type: campaignType,
      status,
      start_date: startDate?.toISOString(),
      end_date: endDate?.toISOString(),
      budget,
      target_audience: targetAudience
    });
  };

  const selectedSegment = segments.find(s => s.id === selectedSegmentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Marketing Campaign' : 'Create Marketing Campaign'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to your marketing campaign here.'
              : 'Create a new marketing campaign to promote your event.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="targeting">
              <Users className="h-4 w-4 mr-2" />
              Audience Targeting
            </TabsTrigger>
            <TabsTrigger value="abtest" disabled={!selectedSegmentId}>
              <TargetIcon className="h-4 w-4 mr-2" />
              A/B Testing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Campaign description"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={campaignType}
                onValueChange={setCampaignType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  {campaignTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(val: 'draft' | 'active' | 'completed' | 'cancelled') => setStatus(val)}
              >
                <SelectTrigger className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <Input
                id="budget"
                type="number"
                value={budget !== undefined ? budget : ''}
                onChange={(e) => setBudget(e.target.value !== '' ? parseFloat(e.target.value) : undefined)}
                className="col-span-3"
                placeholder="Campaign budget"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="targeting" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Target Audience Segment</Label>
                {selectedSegmentId && (
                  <Badge variant="outline" className="ml-auto">
                    {selectedSegment?.memberCount || 0} members
                  </Badge>
                )}
              </div>
              
              <Select
                value={selectedSegmentId || undefined}
                onValueChange={setSelectedSegmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Users (No Segmentation)</SelectItem>
                  {segments.map(segment => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedSegment && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{selectedSegment.description}</p>
                </div>
              )}
              
              {!selectedSegmentId && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No segment selected. Your campaign will target all users.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('abtest')}
                disabled={!selectedSegmentId}
              >
                Configure A/B Testing
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="abtest" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Label htmlFor="enable-ab-test">Enable A/B Testing</Label>
              <input
                id="enable-ab-test"
                type="checkbox"
                checked={isABTest}
                onChange={(e) => setIsABTest(e.target.checked)}
                className="ml-2"
              />
            </div>
            
            {isABTest && (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variantA">Variant A Content</Label>
                    <Textarea
                      id="variantA"
                      value={variantA}
                      onChange={(e) => setVariantA(e.target.value)}
                      placeholder="Enter variant A content"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="variantB">Variant B Content</Label>
                    <Textarea
                      id="variantB"
                      value={variantB}
                      onChange={(e) => setVariantB(e.target.value)}
                      placeholder="Enter variant B content"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="distribution">Distribution (% for Variant A)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="distribution"
                        type="number"
                        min="1"
                        max="99"
                        value={variantDistribution}
                        onChange={(e) => setVariantDistribution(parseInt(e.target.value, 10))}
                      />
                      <div className="text-sm">Variant A: {variantDistribution}% | Variant B: {100 - variantDistribution}%</div>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    A/B test results will be available in the campaign analytics dashboard.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingCampaignModal;
