
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Pause, Edit, Trash2, Plus, Mail, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomatedCampaignManagerProps {
  promoterId: string;
}

interface DripCampaign {
  id: string;
  name: string;
  description: string;
  trigger: 'new_follower' | 'tier_upgrade' | 'inactivity' | 'birthday';
  status: 'active' | 'paused' | 'draft';
  steps: CampaignStep[];
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  created_at: string;
}

interface CampaignStep {
  id: string;
  order: number;
  delay_hours: number;
  subject: string;
  content: string;
  conditions?: string[];
}

const AutomatedCampaignManager: React.FC<AutomatedCampaignManagerProps> = ({ promoterId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // Mock data for demonstration
  const [campaigns, setCampaigns] = useState<DripCampaign[]>([
    {
      id: 'welcome-series',
      name: 'Welcome Series',
      description: 'Onboard new followers with a 5-step welcome sequence',
      trigger: 'new_follower',
      status: 'active',
      steps: [
        {
          id: 'step-1',
          order: 1,
          delay_hours: 0,
          subject: 'Welcome to our community!',
          content: 'Thank you for following us. Here\'s what you can expect...'
        },
        {
          id: 'step-2',
          order: 2,
          delay_hours: 24,
          subject: 'Getting started guide',
          content: 'Here are some tips to make the most of your membership...'
        },
        {
          id: 'step-3',
          order: 3,
          delay_hours: 72,
          subject: 'Exclusive content just for you',
          content: 'As a follower, you get access to exclusive content...'
        }
      ],
      metrics: {
        sent: 156,
        opened: 124,
        clicked: 67,
        converted: 23
      },
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'reengagement',
      name: 'Re-engagement Campaign',
      description: 'Win back inactive followers',
      trigger: 'inactivity',
      status: 'active',
      steps: [
        {
          id: 'step-1',
          order: 1,
          delay_hours: 0,
          subject: 'We miss you!',
          content: 'It\'s been a while since we last connected...'
        },
        {
          id: 'step-2',
          order: 2,
          delay_hours: 168,
          subject: 'Special offer inside',
          content: 'Here\'s an exclusive offer to welcome you back...'
        }
      ],
      metrics: {
        sent: 89,
        opened: 45,
        clicked: 19,
        converted: 8
      },
      created_at: '2024-02-01T00:00:00Z'
    },
    {
      id: 'tier-upgrade',
      name: 'Tier Upgrade Celebration',
      description: 'Celebrate and guide users who upgrade their tier',
      trigger: 'tier_upgrade',
      status: 'paused',
      steps: [
        {
          id: 'step-1',
          order: 1,
          delay_hours: 0,
          subject: 'Congratulations on your upgrade!',
          content: 'Welcome to your new tier! Here are your new benefits...'
        }
      ],
      metrics: {
        sent: 34,
        opened: 29,
        clicked: 15,
        converted: 12
      },
      created_at: '2024-02-10T00:00:00Z'
    }
  ]);

  const getTriggerLabel = (trigger: string) => {
    const labels = {
      'new_follower': 'New Follower',
      'tier_upgrade': 'Tier Upgrade',
      'inactivity': 'Inactivity',
      'birthday': 'Birthday'
    };
    return labels[trigger as keyof typeof labels] || trigger;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-500',
      'paused': 'bg-yellow-500',
      'draft': 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        toast({
          title: `Campaign ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
          description: `${campaign.name} has been ${newStatus === 'active' ? 'activated' : 'paused'}.`
        });
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const deleteCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    toast({
      title: "Campaign Deleted",
      description: `${campaign?.name} has been deleted.`
    });
  };

  const calculateConversionRate = (metrics: DripCampaign['metrics']) => {
    return metrics.sent > 0 ? ((metrics.converted / metrics.sent) * 100).toFixed(1) : '0';
  };

  const calculateOpenRate = (metrics: DripCampaign['metrics']) => {
    return metrics.sent > 0 ? ((metrics.opened / metrics.sent) * 100).toFixed(1) : '0';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Automated Campaign Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Active Campaigns</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>

            <div className="grid gap-4">
              {campaigns.map(campaign => (
                <Card key={campaign.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getTriggerLabel(campaign.trigger)}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {campaign.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {campaign.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Steps:</span>
                            <div className="font-medium">{campaign.steps.length}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sent:</span>
                            <div className="font-medium">{campaign.metrics.sent}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Open Rate:</span>
                            <div className="font-medium">{calculateOpenRate(campaign.metrics)}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conversion:</span>
                            <div className="font-medium">{calculateConversionRate(campaign.metrics)}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCampaignStatus(campaign.id)}
                        >
                          {campaign.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {selectedCampaign === campaign.id && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-3">Campaign Steps</h5>
                        <div className="space-y-3">
                          {campaign.steps.map(step => (
                            <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {step.order}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{step.subject}</div>
                                <div className="text-xs text-muted-foreground">
                                  Delay: {step.delay_hours === 0 ? 'Immediate' : `${step.delay_hours} hours`}
                                </div>
                              </div>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={() => setSelectedCampaign(
                        selectedCampaign === campaign.id ? null : campaign.id
                      )}
                    >
                      {selectedCampaign === campaign.id ? 'Hide' : 'View'} Steps
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Emails Sent</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaigns.reduce((total, campaign) => total + campaign.metrics.sent, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">This month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Average Open Rate</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {(campaigns.reduce((total, campaign) => {
                      const rate = campaign.metrics.sent > 0 ? (campaign.metrics.opened / campaign.metrics.sent) * 100 : 0;
                      return total + rate;
                    }, 0) / campaigns.length).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Across all campaigns</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Total Conversions</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {campaigns.reduce((total, campaign) => total + campaign.metrics.converted, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">This month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Open Rate</span>
                          <span>{calculateOpenRate(campaign.metrics)}%</span>
                        </div>
                        <Progress value={parseInt(calculateOpenRate(campaign.metrics))} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Conversion Rate</span>
                          <span>{calculateConversionRate(campaign.metrics)}%</span>
                        </div>
                        <Progress value={parseInt(calculateConversionRate(campaign.metrics))} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Global Campaign Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Auto-start campaigns</label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start campaigns when triggers are met
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Respect quiet hours</label>
                    <p className="text-sm text-muted-foreground">
                      Don't send emails during follower quiet hours
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Smart send optimization</label>
                    <p className="text-sm text-muted-foreground">
                      Optimize send times based on follower engagement patterns
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Default Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Default sender name</label>
                  <Input defaultValue="Your Brand" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Default sender email</label>
                  <Input defaultValue="hello@yourbrand.com" type="email" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Default unsubscribe text</label>
                  <Input defaultValue="You can unsubscribe at any time by clicking here." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AutomatedCampaignManager;
