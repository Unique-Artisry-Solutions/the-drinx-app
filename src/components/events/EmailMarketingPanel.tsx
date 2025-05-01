import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Mail, SendHorizontal, List, Users, FileText } from 'lucide-react';
import { PlusCircle } from '@/components/icons/PlusCircle';

interface EmailMarketingPanelProps {
  eventId: string;
  eventName: string;
  campaigns: EventMarketingCampaign[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const sampleTemplates: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Event Announcement',
    subject: 'Join us for an amazing event!',
    content: 'Hello,\n\nWe are excited to announce our upcoming event. This is going to be a great opportunity to connect and learn.\n\nDetails:\n- Date: [EVENT_DATE]\n- Time: [EVENT_TIME]\n- Location: [EVENT_LOCATION]\n\nWe hope to see you there!\n\nBest regards,\nThe [EVENT_NAME] Team'
  },
  {
    id: 'template-2',
    name: 'Ticket Purchase Confirmation',
    subject: 'Your ticket to [EVENT_NAME] is confirmed!',
    content: 'Dear [ATTENDEE_NAME],\n\nThank you for purchasing tickets to [EVENT_NAME]!\n\nYour ticket details:\n- Event: [EVENT_NAME]\n- Date: [EVENT_DATE]\n- Time: [EVENT_TIME]\n- Location: [EVENT_LOCATION]\n- Ticket Type: [TICKET_TYPE]\n\nYour ticket code: [TICKET_CODE]\n\nPlease bring this confirmation or your ticket code to the event for check-in.\n\nWe look forward to seeing you!\n\nBest regards,\nThe [EVENT_NAME] Team'
  },
  {
    id: 'template-3',
    name: 'Event Reminder',
    subject: 'Reminder: [EVENT_NAME] is coming up soon!',
    content: 'Hello [ATTENDEE_NAME],\n\nThis is a friendly reminder that [EVENT_NAME] is coming up soon!\n\nDate: [EVENT_DATE]\nTime: [EVENT_TIME]\nLocation: [EVENT_LOCATION]\n\nDon\'t forget to bring your ticket for check-in.\n\nWe look forward to seeing you there!\n\nBest regards,\nThe [EVENT_NAME] Team'
  }
];

const EmailMarketingPanel: React.FC<EmailMarketingPanelProps> = ({ eventId, eventName, campaigns }) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('compose');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedList, setSelectedList] = useState<string>('all');

  const handleSendTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your address.",
    });
  };

  const handleSendCampaign = () => {
    toast({
      title: "Campaign Scheduled",
      description: "Your email campaign has been scheduled to send.",
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = sampleTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject.replace('[EVENT_NAME]', eventName));
      
      let content = template.content;
      content = content.replace(/\[EVENT_NAME\]/g, eventName);
      content = content.replace(/\[EVENT_DATE\]/g, 'August 15, 2023');
      content = content.replace(/\[EVENT_TIME\]/g, '7:00 PM');
      content = content.replace(/\[EVENT_LOCATION\]/g, 'Downtown Convention Center');
      
      setEmailContent(content);
    }
    setSelectedTemplate(templateId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Marketing</CardTitle>
        <CardDescription>
          Create and send email campaigns to promote {eventName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="compose">
              <Mail className="mr-2 h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="lists">
              <Users className="mr-2 h-4 w-4" />
              Contact Lists
            </TabsTrigger>
            <TabsTrigger value="sent">
              <SendHorizontal className="mr-2 h-4 w-4" />
              Sent Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <div className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailList">Select Recipient List</Label>
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger id="emailList">
                    <SelectValue placeholder="Select a recipient list" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Attendees</SelectItem>
                    <SelectItem value="registered">Registered Only</SelectItem>
                    <SelectItem value="checked-in">Checked-in Attendees</SelectItem>
                    <SelectItem value="vip">VIP Ticket Holders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailTemplate">Email Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger id="emailTemplate">
                    <SelectValue placeholder="Select a template or start from scratch" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="">Start from scratch</SelectItem>
                    {sampleTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input
                  id="emailSubject"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailContent">Email Content</Label>
                <Textarea
                  id="emailContent"
                  placeholder="Enter email content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleSendTestEmail}>
                  Send Test Email
                </Button>
                <Button onClick={handleSendCampaign}>
                  Send Campaign
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="space-y-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Email Templates</h3>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleTemplates.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="font-medium text-sm">Subject: {template.subject}</p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{template.content}</p>
                    </CardContent>
                    <div className="bg-muted px-4 py-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleTemplateSelect(template.id)}>
                        Use Template
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lists">
            <div className="space-y-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Contact Lists</h3>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create List
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">List Name</th>
                      <th className="px-4 py-3">Contacts</th>
                      <th className="px-4 py-3">Last Updated</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">All Attendees</td>
                      <td className="px-4 py-3">128</td>
                      <td className="px-4 py-3">Today</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="ghost">Export</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">VIP Ticket Holders</td>
                      <td className="px-4 py-3">24</td>
                      <td className="px-4 py-3">Yesterday</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="ghost">Export</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">Early Bird Registrants</td>
                      <td className="px-4 py-3">56</td>
                      <td className="px-4 py-3">Jul 12, 2023</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="ghost">Export</Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sent">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Sent Email Campaigns</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Campaign Name</th>
                      <th className="px-4 py-3">Recipients</th>
                      <th className="px-4 py-3">Open Rate</th>
                      <th className="px-4 py-3">Click Rate</th>
                      <th className="px-4 py-3">Sent Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">Event Announcement</td>
                      <td className="px-4 py-3">256</td>
                      <td className="px-4 py-3">68%</td>
                      <td className="px-4 py-3">42%</td>
                      <td className="px-4 py-3">Jul 15, 2023</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost">View Report</Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">Early Bird Reminder</td>
                      <td className="px-4 py-3">128</td>
                      <td className="px-4 py-3">72%</td>
                      <td className="px-4 py-3">58%</td>
                      <td className="px-4 py-3">Jul 10, 2023</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost">View Report</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailMarketingPanel;
