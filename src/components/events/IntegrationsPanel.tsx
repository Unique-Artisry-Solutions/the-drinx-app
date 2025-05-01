
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link, Building, DollarSign, BarChart3, PlugIcon } from 'lucide-react';

interface IntegrationsPanelProps {
  eventId: string;
}

interface IntegrationSystem {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'not_connected' | 'pending';
  icon: React.ReactNode;
}

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('venues');
  
  const [integrations, setIntegrations] = useState<Record<string, IntegrationSystem[]>>({
    venues: [
      {
        id: 'venue-1',
        name: 'Venue Hub',
        description: 'Connect with your venue management system',
        status: 'not_connected',
        icon: <Building className="h-6 w-6" />
      },
      {
        id: 'venue-2',
        name: 'Space Manager',
        description: 'Manage venue spaces and floor plans',
        status: 'not_connected',
        icon: <Building className="h-6 w-6" />
      }
    ],
    finance: [
      {
        id: 'finance-1',
        name: 'Event Finance Pro',
        description: 'Track ticket sales and event revenue',
        status: 'connected',
        icon: <DollarSign className="h-6 w-6" />
      },
      {
        id: 'finance-2',
        name: 'QuickBooks',
        description: 'Accounting software integration',
        status: 'not_connected',
        icon: <DollarSign className="h-6 w-6" />
      }
    ],
    analytics: [
      {
        id: 'analytics-1',
        name: 'Event Analytics',
        description: 'Track event performance and attendee analytics',
        status: 'connected',
        icon: <BarChart3 className="h-6 w-6" />
      },
      {
        id: 'analytics-2',
        name: 'Google Analytics',
        description: 'Connect with Google Analytics',
        status: 'not_connected',
        icon: <BarChart3 className="h-6 w-6" />
      }
    ],
    other: [
      {
        id: 'other-1',
        name: 'Zapier',
        description: 'Connect with thousands of apps through Zapier',
        status: 'not_connected',
        icon: <PlugIcon className="h-6 w-6" />
      }
    ]
  });

  const [webhookUrl, setWebhookUrl] = useState('');

  const handleConnectService = (serviceId: string) => {
    // Find the service category and the service itself
    let serviceCategory = '';
    let serviceIndex = -1;
    
    for (const [category, services] of Object.entries(integrations)) {
      const index = services.findIndex(service => service.id === serviceId);
      if (index !== -1) {
        serviceCategory = category;
        serviceIndex = index;
        break;
      }
    }
    
    if (serviceCategory && serviceIndex !== -1) {
      // Update the service status
      const updatedIntegrations = { ...integrations };
      updatedIntegrations[serviceCategory][serviceIndex].status = 
        updatedIntegrations[serviceCategory][serviceIndex].status === 'connected' ? 
          'not_connected' : 'connected';
      
      setIntegrations(updatedIntegrations);
      
      toast({
        title: updatedIntegrations[serviceCategory][serviceIndex].status === 'connected' ? 
          "Service Connected" : "Service Disconnected",
        description: `${integrations[serviceCategory][serviceIndex].name} has been ${
          updatedIntegrations[serviceCategory][serviceIndex].status === 'connected' ? 'connected' : 'disconnected'
        } successfully.`,
      });
    }
  };

  const handleSaveWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Webhook Saved",
      description: "The webhook URL has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Integrations</CardTitle>
        <CardDescription>
          Connect your event with other systems and services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="venues">Venue Management</TabsTrigger>
            <TabsTrigger value="finance">Finance Systems</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Tools</TabsTrigger>
            <TabsTrigger value="other">Other Services</TabsTrigger>
          </TabsList>
          
          {Object.keys(integrations).map(category => (
            <TabsContent key={category} value={category}>
              {category === 'other' && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Webhook Integration</CardTitle>
                    <CardDescription>
                      Connect your event to external systems using webhooks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div>
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <div className="flex mt-1.5">
                          <Input
                            id="webhookUrl"
                            placeholder="https://your-webhook-endpoint.com"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            className="ml-2"
                            onClick={handleSaveWebhook}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Event Notifications</h4>
                        <div className="space-y-2">
                          {['Ticket Purchase', 'Attendee Check-in', 'Campaign Activity'].map(event => (
                            <div key={event} className="flex items-center justify-between">
                              <Label htmlFor={`event-${event}`}>{event}</Label>
                              <Switch id={`event-${event}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                {integrations[category].map(service => (
                  <Card key={service.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 rounded-lg p-2">
                            {service.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {service.name}
                              <Badge 
                                className="ml-2" 
                                variant={service.status === 'connected' ? 'default' : 'outline'}
                              >
                                {service.status === 'connected' ? 'Connected' : 'Not Connected'}
                              </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant={service.status === 'connected' ? "destructive" : "default"}
                        onClick={() => handleConnectService(service.id)}
                        className="w-full"
                      >
                        {service.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationsPanel;
