
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Bell, Image, Gift } from 'lucide-react';

interface FollowerCommunicationProps {
  promoterId: string;
}

export const FollowerCommunication: React.FC<FollowerCommunicationProps> = ({ promoterId }) => {
  const { 
    sendNotification, 
    sendFlyer, 
    sendDiscountCode, 
    tiers,
    followers 
  } = useSubscriptions(promoterId);

  const [activeTab, setActiveTab] = useState<'announcement' | 'flyer' | 'discount'>('announcement');
  const [targetTiers, setTargetTiers] = useState<string[]>([]);
  
  // Announcement form
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  // Flyer form
  const [flyerTitle, setFlyerTitle] = useState('');
  const [flyerDescription, setFlyerDescription] = useState('');
  const [flyerUrl, setFlyerUrl] = useState('');
  
  // Discount form
  const [discountTitle, setDiscountTitle] = useState('');
  const [discountDescription, setDiscountDescription] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSendAnnouncement = async () => {
    if (!announcementTitle || !announcementContent) return;
    
    await sendNotification.mutateAsync({
      promoterId,
      notification: {
        title: announcementTitle,
        content: announcementContent,
        priority
      },
      targetTiers: targetTiers.length > 0 ? targetTiers : undefined
    });
    
    // Reset form
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setPriority('medium');
  };

  const handleSendFlyer = async () => {
    if (!flyerTitle || !flyerDescription || !flyerUrl) return;
    
    await sendFlyer.mutateAsync({
      promoterId,
      flyerUrl,
      title: flyerTitle,
      description: flyerDescription,
      targetTiers: targetTiers.length > 0 ? targetTiers : undefined
    });
    
    // Reset form
    setFlyerTitle('');
    setFlyerDescription('');
    setFlyerUrl('');
  };

  const handleSendDiscountCode = async () => {
    if (!discountTitle || !discountDescription || !discountCode) return;
    
    await sendDiscountCode.mutateAsync({
      promoterId,
      discountCode,
      title: discountTitle,
      description: discountDescription,
      expiresAt: expiresAt || undefined,
      targetTiers: targetTiers.length > 0 ? targetTiers : undefined
    });
    
    // Reset form
    setDiscountTitle('');
    setDiscountDescription('');
    setDiscountCode('');
    setExpiresAt('');
  };

  const toggleTierTarget = (tierId: string) => {
    setTargetTiers(prev => 
      prev.includes(tierId) 
        ? prev.filter(id => id !== tierId)
        : [...prev, tierId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communicate with Followers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Send announcements, flyers, and discount codes to your {followers.length} followers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'announcement' ? 'default' : 'outline'}
              onClick={() => setActiveTab('announcement')}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Announcement
            </Button>
            <Button
              variant={activeTab === 'flyer' ? 'default' : 'outline'}
              onClick={() => setActiveTab('flyer')}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Flyer
            </Button>
            <Button
              variant={activeTab === 'discount' ? 'default' : 'outline'}
              onClick={() => setActiveTab('discount')}
              className="flex items-center gap-2"
            >
              <Gift className="h-4 w-4" />
              Discount Code
            </Button>
          </div>

          {/* Target Audience Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Target Audience</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={targetTiers.length === 0 ? 'default' : 'outline'}
                onClick={() => setTargetTiers([])}
                size="sm"
              >
                All Followers
              </Button>
              <Button
                variant={targetTiers.includes('free') ? 'default' : 'outline'}
                onClick={() => toggleTierTarget('free')}
                size="sm"
              >
                Free Followers Only
              </Button>
              {tiers.map(tier => (
                <Button
                  key={tier.id}
                  variant={targetTiers.includes(tier.id) ? 'default' : 'outline'}
                  onClick={() => toggleTierTarget(tier.id)}
                  size="sm"
                >
                  {tier.name} Subscribers
                </Button>
              ))}
            </div>
          </div>

          {/* Announcement Tab */}
          {activeTab === 'announcement' && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Announcement title"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your announcement message..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSendAnnouncement}
                disabled={!announcementTitle || !announcementContent || sendNotification.isPending}
                className="w-full"
              >
                {sendNotification.isPending ? 'Sending...' : 'Send Announcement'}
              </Button>
            </div>
          )}

          {/* Flyer Tab */}
          {activeTab === 'flyer' && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Flyer title"
                  value={flyerTitle}
                  onChange={(e) => setFlyerTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Flyer description..."
                  value={flyerDescription}
                  onChange={(e) => setFlyerDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Input
                  placeholder="Flyer image URL"
                  value={flyerUrl}
                  onChange={(e) => setFlyerUrl(e.target.value)}
                  type="url"
                />
              </div>
              <Button 
                onClick={handleSendFlyer}
                disabled={!flyerTitle || !flyerDescription || !flyerUrl || sendFlyer.isPending}
                className="w-full"
              >
                {sendFlyer.isPending ? 'Sending...' : 'Send Flyer'}
              </Button>
            </div>
          )}

          {/* Discount Code Tab */}
          {activeTab === 'discount' && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Discount title"
                  value={discountTitle}
                  onChange={(e) => setDiscountTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Discount description..."
                  value={discountDescription}
                  onChange={(e) => setDiscountDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Input
                  placeholder="Discount code (e.g., SAVE20)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="Expiration date (optional)"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  type="date"
                />
              </div>
              <Button 
                onClick={handleSendDiscountCode}
                disabled={!discountTitle || !discountDescription || !discountCode || sendDiscountCode.isPending}
                className="w-full"
              >
                {sendDiscountCode.isPending ? 'Sending...' : 'Send Discount Code'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
