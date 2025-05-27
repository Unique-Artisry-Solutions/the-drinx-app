
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Users, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailWorkflow {
  id: string;
  name: string;
  triggerType: 'immediate' | 'scheduled' | 'behavior';
  emailTemplate: string;
  targetAudience: string[];
  isActive: boolean;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
  };
}

interface EmailMarketingWorkflowProps {
  campaignId: string;
  onWorkflowCreate: (workflow: Omit<EmailWorkflow, 'id' | 'metrics'>) => void;
}

export default function EmailMarketingWorkflow({ campaignId, onWorkflowCreate }: EmailMarketingWorkflowProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [workflow, setWorkflow] = useState({
    name: '',
    triggerType: 'immediate' as const,
    emailTemplate: '',
    targetAudience: [] as string[],
    isActive: true,
    scheduleTime: '',
    subject: '',
    content: ''
  });

  const [existingWorkflows] = useState<EmailWorkflow[]>([
    {
      id: '1',
      name: 'Welcome Email',
      triggerType: 'immediate',
      emailTemplate: 'welcome_template',
      targetAudience: ['new_subscribers'],
      isActive: true,
      metrics: { sent: 245, opened: 180, clicked: 45 }
    },
    {
      id: '2',
      name: 'Event Reminder',
      triggerType: 'scheduled',
      emailTemplate: 'reminder_template',
      targetAudience: ['ticket_holders'],
      isActive: true,
      metrics: { sent: 150, opened: 135, clicked: 78 }
    }
  ]);

  const handleCreateWorkflow = () => {
    if (!workflow.name || !workflow.subject || !workflow.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    onWorkflowCreate({
      name: workflow.name,
      triggerType: workflow.triggerType,
      emailTemplate: workflow.content,
      targetAudience: workflow.targetAudience,
      isActive: workflow.isActive
    });

    toast({
      title: 'Workflow Created',
      description: 'Email automation workflow has been created successfully'
    });

    setWorkflow({
      name: '',
      triggerType: 'immediate',
      emailTemplate: '',
      targetAudience: [],
      isActive: true,
      scheduleTime: '',
      subject: '',
      content: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" />
          Email Marketing Automation
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Workflow</TabsTrigger>
          <TabsTrigger value="manage">Manage Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Email Automation Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={workflow.name}
                    onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter workflow name"
                  />
                </div>

                <div>
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select 
                    value={workflow.triggerType} 
                    onValueChange={(value: any) => setWorkflow(prev => ({ ...prev, triggerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Scheduled Send</SelectItem>
                      <SelectItem value="behavior">Behavior Triggered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {workflow.triggerType === 'scheduled' && (
                <div>
                  <Label htmlFor="schedule-time">Schedule Time</Label>
                  <Input
                    id="schedule-time"
                    type="datetime-local"
                    value={workflow.scheduleTime}
                    onChange={(e) => setWorkflow(prev => ({ ...prev, scheduleTime: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={workflow.subject}
                  onChange={(e) => setWorkflow(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <Label htmlFor="email-content">Email Content</Label>
                <Textarea
                  id="email-content"
                  value={workflow.content}
                  onChange={(e) => setWorkflow(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter email content..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="target-audience">Target Audience</Label>
                <Select 
                  value={workflow.targetAudience[0] || ''} 
                  onValueChange={(value) => setWorkflow(prev => ({ ...prev, targetAudience: [value] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_subscribers">All Subscribers</SelectItem>
                    <SelectItem value="new_subscribers">New Subscribers</SelectItem>
                    <SelectItem value="ticket_holders">Ticket Holders</SelectItem>
                    <SelectItem value="past_attendees">Past Attendees</SelectItem>
                    <SelectItem value="vip_members">VIP Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="workflow-active"
                  checked={workflow.isActive}
                  onCheckedChange={(checked) => setWorkflow(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="workflow-active">Activate workflow immediately</Label>
              </div>

              <Button onClick={handleCreateWorkflow} className="w-full">
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid gap-4">
            {existingWorkflows.map((wf) => (
              <Card key={wf.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{wf.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={wf.isActive ? 'default' : 'secondary'}>
                        {wf.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {wf.triggerType === 'immediate' && <Zap className="h-3 w-3 mr-1" />}
                        {wf.triggerType === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                        {wf.triggerType === 'behavior' && <Users className="h-3 w-3 mr-1" />}
                        {wf.triggerType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{wf.metrics.sent}</div>
                      <div className="text-sm text-gray-600">Sent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{wf.metrics.opened}</div>
                      <div className="text-sm text-gray-600">Opened</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{wf.metrics.clicked}</div>
                      <div className="text-sm text-gray-600">Clicked</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Pause</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
