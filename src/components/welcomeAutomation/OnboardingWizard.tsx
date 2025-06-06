
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useWelcomeAutomation } from '@/hooks/useWelcomeAutomation';
import { Clock, Mail, Users, Settings, Trophy, Sparkles } from 'lucide-react';

interface OnboardingWizardProps {
  promoterId: string;
  onComplete?: () => void;
}

const messageTypeConfig = {
  welcome: { icon: Sparkles, color: 'bg-blue-500', label: 'Welcome' },
  value_intro: { icon: Mail, color: 'bg-green-500', label: 'Value Intro' },
  event_invite: { icon: Clock, color: 'bg-purple-500', label: 'Event Invite' },
  community_intro: { icon: Users, color: 'bg-orange-500', label: 'Community' },
  preference_setting: { icon: Settings, color: 'bg-gray-500', label: 'Preferences' },
  milestone_celebration: { icon: Trophy, color: 'bg-yellow-500', label: 'Milestone' }
};

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ promoterId, onComplete }) => {
  const { createWelcomeFlow, createWelcomeMessage } = useWelcomeAutomation(promoterId);
  const [step, setStep] = useState(1);
  const [flowData, setFlowData] = useState({
    flow_name: '',
    description: '',
    duration_days: 14,
    total_steps: 6
  });
  const [messages, setMessages] = useState([
    {
      step_number: 1,
      step_name: 'Immediate Welcome',
      delay_minutes: 0,
      message_type: 'welcome' as const,
      subject_line: 'Welcome to our community! 🎉',
      message_content: 'Thank you for following us! Here\'s what you can expect...'
    },
    {
      step_number: 2,
      step_name: 'Value Introduction',
      delay_minutes: 60,
      message_type: 'value_intro' as const,
      subject_line: 'Here\'s your exclusive content! ✨',
      message_content: 'As promised, here\'s your first taste of exclusive content...'
    },
    {
      step_number: 3,
      step_name: 'First Event Invitation',
      delay_minutes: 1440,
      message_type: 'event_invite' as const,
      subject_line: 'You\'re invited to our next event! 🎟️',
      message_content: 'Don\'t miss out! Here\'s your chance to join our upcoming event...'
    }
  ]);

  const handleFlowSubmit = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      const flowResult = await createWelcomeFlow.mutateAsync({
        flow_name: flowData.flow_name,
        description: flowData.description,
        flow_config: {
          duration_days: flowData.duration_days,
          total_steps: flowData.total_steps,
          auto_advance: true,
          personalization_enabled: true,
          engagement_tracking: true
        },
        trigger_conditions: {
          trigger_on: 'new_follow',
          delay_minutes: 0,
          conditions: []
        },
        completion_criteria: {
          all_steps_completed: true,
          min_engagement_score: 50,
          time_limit_days: 30
        }
      });

      // Create all messages
      for (const message of messages) {
        await createWelcomeMessage.mutateAsync({
          automation_flow_id: flowResult.id,
          ...message,
          message_data: {},
          send_conditions: { always_send: true }
        });
      }

      onComplete?.();
    } catch (error) {
      console.error('Error creating welcome flow:', error);
    }
  };

  const updateMessage = (index: number, field: string, value: any) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, [field]: value } : msg
    ));
  };

  const addMessage = () => {
    setMessages(prev => [...prev, {
      step_number: prev.length + 1,
      step_name: `Step ${prev.length + 1}`,
      delay_minutes: 0,
      message_type: 'custom' as const,
      subject_line: '',
      message_content: ''
    }]);
    setFlowData(prev => ({ ...prev, total_steps: prev.total_steps + 1 }));
  };

  const formatDelay = (minutes: number) => {
    if (minutes === 0) return 'Immediately';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  };

  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Welcome Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="flow_name">Flow Name</Label>
            <Input
              id="flow_name"
              value={flowData.flow_name}
              onChange={(e) => setFlowData(prev => ({ ...prev, flow_name: e.target.value }))}
              placeholder="e.g., VIP Welcome Series"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={flowData.description}
              onChange={(e) => setFlowData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your welcome flow..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={flowData.duration_days}
                onChange={(e) => setFlowData(prev => ({ ...prev, duration_days: parseInt(e.target.value) }))}
                min="1"
                max="90"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Total Steps</Label>
              <Input
                id="steps"
                type="number"
                value={flowData.total_steps}
                onChange={(e) => setFlowData(prev => ({ ...prev, total_steps: parseInt(e.target.value) }))}
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>
              Next: Configure Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Configure Welcome Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const config = messageTypeConfig[message.message_type as keyof typeof messageTypeConfig];
            const Icon = config?.icon || Mail;
            
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${config?.color || 'bg-gray-500'}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={message.step_name}
                      onChange={(e) => updateMessage(index, 'step_name', e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <Badge variant="outline">
                    Step {message.step_number}
                  </Badge>
                  <Badge variant="secondary">
                    {formatDelay(message.delay_minutes)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Message Type</Label>
                    <Select
                      value={message.message_type}
                      onValueChange={(value) => updateMessage(index, 'message_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(messageTypeConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delay (minutes)</Label>
                    <Input
                      type="number"
                      value={message.delay_minutes}
                      onChange={(e) => updateMessage(index, 'delay_minutes', parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label>Subject Line</Label>
                  <Input
                    value={message.subject_line}
                    onChange={(e) => updateMessage(index, 'subject_line', e.target.value)}
                    placeholder="Enter subject line..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    value={message.message_content}
                    onChange={(e) => updateMessage(index, 'message_content', e.target.value)}
                    placeholder="Enter message content..."
                    rows={3}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={addMessage}>
            Add Message
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              onClick={handleFlowSubmit}
              disabled={createWelcomeFlow.isPending || createWelcomeMessage.isPending}
            >
              {createWelcomeFlow.isPending || createWelcomeMessage.isPending ? 'Creating...' : 'Create Flow'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingWizard;
