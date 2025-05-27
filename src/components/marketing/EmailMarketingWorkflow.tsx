
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Target, Users } from 'lucide-react';

interface EmailWorkflow {
  id: string;
  name: string;
  trigger: 'immediate' | 'scheduled' | 'event_based';
  scheduledDate?: string;
  scheduledTime?: string;
  targetAudience: string;
  emailTemplate: {
    subject: string;
    content: string;
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
}

interface EmailMarketingWorkflowProps {
  campaignId: string;
  onWorkflowCreate: (workflow: EmailWorkflow) => void;
}

const EmailMarketingWorkflow: React.FC<EmailMarketingWorkflowProps> = ({
  campaignId,
  onWorkflowCreate
}) => {
  const [workflows, setWorkflows] = useState<EmailWorkflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Partial<EmailWorkflow>>({
    trigger: 'immediate',
    targetAudience: 'all',
    emailTemplate: {
      subject: '',
      content: ''
    },
    status: 'draft'
  });

  const handleTriggerChange = (trigger: 'immediate' | 'scheduled' | 'event_based') => {
    setCurrentWorkflow(prev => ({
      ...prev,
      trigger,
      // Clear scheduling fields when not needed
      ...(trigger !== 'scheduled' && {
        scheduledDate: undefined,
        scheduledTime: undefined
      })
    }));
  };

  const handleCreateWorkflow = () => {
    if (!currentWorkflow.name || !currentWorkflow.emailTemplate?.subject) {
      return;
    }

    const newWorkflow: EmailWorkflow = {
      id: `workflow-${Date.now()}`,
      name: currentWorkflow.name,
      trigger: currentWorkflow.trigger || 'immediate',
      scheduledDate: currentWorkflow.scheduledDate,
      scheduledTime: currentWorkflow.scheduledTime,
      targetAudience: currentWorkflow.targetAudience || 'all',
      emailTemplate: {
        subject: currentWorkflow.emailTemplate?.subject || '',
        content: currentWorkflow.emailTemplate?.content || ''
      },
      status: 'draft'
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    onWorkflowCreate(newWorkflow);
    
    // Reset form
    setCurrentWorkflow({
      trigger: 'immediate',
      targetAudience: 'all',
      emailTemplate: {
        subject: '',
        content: ''
      },
      status: 'draft'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Marketing Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList>
              <TabsTrigger value="create">Create Workflow</TabsTrigger>
              <TabsTrigger value="manage">Manage Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={currentWorkflow.name || ''}
                    onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter workflow name"
                  />
                </div>

                <div>
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select
                    value={currentWorkflow.trigger}
                    onValueChange={handleTriggerChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Scheduled Send</SelectItem>
                      <SelectItem value="event_based">Event-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currentWorkflow.trigger === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduled-date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="scheduled-date"
                          type="date"
                          value={currentWorkflow.scheduledDate || ''}
                          onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, scheduledDate: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="scheduled-time">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="scheduled-time"
                          type="time"
                          value={currentWorkflow.scheduledTime || ''}
                          onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, scheduledTime: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select
                    value={currentWorkflow.targetAudience}
                    onValueChange={(value) => setCurrentWorkflow(prev => ({ ...prev, targetAudience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="past_attendees">Past Attendees</SelectItem>
                      <SelectItem value="new_subscribers">New Subscribers</SelectItem>
                      <SelectItem value="high_engagement">High Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    value={currentWorkflow.emailTemplate?.subject || ''}
                    onChange={(e) => setCurrentWorkflow(prev => ({
                      ...prev,
                      emailTemplate: {
                        ...prev.emailTemplate,
                        subject: e.target.value,
                        content: prev.emailTemplate?.content || ''
                      }
                    }))}
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <Label htmlFor="email-content">Email Content</Label>
                  <Textarea
                    id="email-content"
                    value={currentWorkflow.emailTemplate?.content || ''}
                    onChange={(e) => setCurrentWorkflow(prev => ({
                      ...prev,
                      emailTemplate: {
                        ...prev.emailTemplate,
                        subject: prev.emailTemplate?.subject || '',
                        content: e.target.value
                      }
                    }))}
                    placeholder="Enter email content"
                    rows={6}
                  />
                </div>

                <Button onClick={handleCreateWorkflow} className="w-full">
                  Create Workflow
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              {workflows.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows created</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first email workflow.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <Card key={workflow.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{workflow.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Target className="h-4 w-4" />
                              <span>{workflow.targetAudience}</span>
                              {workflow.trigger === 'scheduled' && workflow.scheduledDate && (
                                <>
                                  <span>•</span>
                                  <Calendar className="h-4 w-4" />
                                  <span>{workflow.scheduledDate} {workflow.scheduledTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(workflow.status)}>
                            {workflow.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailMarketingWorkflow;
