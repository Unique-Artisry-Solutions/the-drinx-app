
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LinkIcon, Check, ExternalLink } from 'lucide-react';

interface IntegrationsPanelProps {
  eventId: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  connectedAt?: string;
  status: 'connected' | 'disconnected' | 'pending';
}

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<string>("create_new");
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Connect your Mailchimp account to sync subscribers',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'eventbrite',
      name: 'Eventbrite',
      description: 'Sync event details with Eventbrite',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'facebook',
      name: 'Facebook Events',
      description: 'Publish this event to Facebook',
      connected: true,
      connectedAt: '2023-05-15T10:30:00',
      status: 'connected'
    }
  ]);

  const handleConnect = (integrationId: string) => {
    setIsConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIntegrations(prevState => 
        prevState.map(integration => 
          integration.id === integrationId
            ? { ...integration, connected: true, status: 'connected' as const, connectedAt: new Date().toISOString() }
            : integration
        )
      );
      
      setIsConnecting(false);
      
      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${integrations.find(i => i.id === integrationId)?.name}`
      });
    }, 1500);
  };

  const handleDisconnect = (integrationId: string) => {
    if (confirm('Are you sure you want to disconnect this integration? This may affect your marketing campaigns.')) {
      setIntegrations(prevState => 
        prevState.map(integration => 
          integration.id === integrationId
            ? { ...integration, connected: false, status: 'disconnected' as const }
            : integration
        )
      );
      
      toast({
        title: "Integration Disconnected",
        description: `Successfully disconnected from ${integrations.find(i => i.id === integrationId)?.name}`
      });
    }
  };

  const handleToggleStatus = (integrationId: string, enabled: boolean) => {
    setIntegrations(prevState => 
      prevState.map(integration => 
        integration.id === integrationId
          ? { ...integration, status: enabled ? 'connected' : 'disconnected' as any }
          : integration
      )
    );
    
    toast({
      title: enabled ? "Integration Enabled" : "Integration Disabled",
      description: `${integrations.find(i => i.id === integrationId)?.name} has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Integrations</CardTitle>
        <CardDescription>
          Connect third-party tools to enhance your marketing capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Integrations</h3>
          {integrations.map(integration => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{integration.name}</h4>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                {integration.connected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Connected on {integration.connectedAt ? new Date(integration.connectedAt).toLocaleDateString() : 'N/A'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {integration.connected && (
                  <Switch 
                    checked={integration.status === 'connected'} 
                    onCheckedChange={(checked) => handleToggleStatus(integration.id, checked)}
                  />
                )}
                {integration.connected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4 mr-1" />}
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">API Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
                <SelectTrigger id="api-key">
                  <SelectValue placeholder="Select API key" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create_new">Create new API key</SelectItem>
                  <SelectItem value="existing_key_1">Marketing API Key (Created 2023-04-10)</SelectItem>
                  <SelectItem value="existing_key_2">Developer API Key (Created 2023-05-22)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                {selectedApiKey === 'create_new' ? 'Generate API Key' : 'Use Selected Key'}
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              API keys allow external applications to access this event's data. Learn more about our 
              <Button variant="link" className="h-auto p-0 ml-1">
                API documentation <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsPanel;
