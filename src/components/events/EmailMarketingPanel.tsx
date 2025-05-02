
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Mail, SendHorizontal, List, Users, FileText, Loader2 } from 'lucide-react';
import { PlusCircle } from '@/components/icons/PlusCircle';
import { supabase } from '@/integrations/supabase/client';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';

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

interface AttendeeList {
  id: string;
  name: string;
  emails: string[];
}

const EmailMarketingPanel: React.FC<EmailMarketingPanelProps> = ({ eventId, eventName, campaigns }) => {
  const { toast } = useToast();
  const { createCampaign, trackMetric } = useEventMarketing(eventId);
  const [currentTab, setCurrentTab] = useState('compose');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedList, setSelectedList] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [attendeeLists, setAttendeeLists] = useState<AttendeeList[]>([
    { id: 'all', name: 'All Attendees', emails: [] },
    { id: 'registered', name: 'Registered Only', emails: [] },
    { id: 'checked-in', name: 'Checked-in Attendees', emails: [] },
    { id: 'vip', name: 'VIP Ticket Holders', emails: [] },
  ]);
  const [sentCampaigns, setSentCampaigns] = useState<any[]>([
    { id: 'sample-1', name: 'Event Announcement', recipients: 256, openRate: '68%', clickRate: '42%', sentDate: 'Jul 15, 2023' },
    { id: 'sample-2', name: 'Early Bird Reminder', recipients: 128, openRate: '72%', clickRate: '58%', sentDate: 'Jul 10, 2023' },
  ]);

  // Fetch attendee lists when component mounts
  React.useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const { data: attendees, error } = await supabase
          .from('event_attendees')
          .select('email, status, custom_fields, ticket_type_id')
          .eq('event_id', eventId);
          
        if (error) throw error;
        
        // Get all valid emails
        const allEmails = attendees?.filter(a => a.email)
          .map(a => a.email as string) || [];
          
        // Get registered emails
        const registeredEmails = attendees?.filter(a => a.email && a.status === 'registered')
          .map(a => a.email as string) || [];
          
        // Get checked-in emails
        const checkedInEmails = attendees?.filter(a => a.email && a.status === 'checked_in')
          .map(a => a.email as string) || [];
          
        // Get VIP emails - assuming you have a field or ticket type that identifies VIPs
        const vipEmails = attendees?.filter(a => a.email && 
          (a.custom_fields?.isVip || a.ticket_type_id === 'vip-ticket-id'))
          .map(a => a.email as string) || [];
          
        setAttendeeLists([
          { id: 'all', name: 'All Attendees', emails: allEmails },
          { id: 'registered', name: 'Registered Only', emails: registeredEmails },
          { id: 'checked-in', name: 'Checked-in Attendees', emails: checkedInEmails },
          { id: 'vip', name: 'VIP Ticket Holders', emails: vipEmails },
        ]);
      } catch (err) {
        console.error("Error fetching attendees:", err);
      }
    };
    
    fetchAttendees();
  }, [eventId]);

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

  const convertContentToHtml = (content: string) => {
    // Simple conversion of newlines to <br> tags
    return content.replace(/\n/g, '<br>');
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a test email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Create a campaign for tracking purposes if none exists
      let campaignId: string;
      const existingCampaign = campaigns?.find(c => c.name === 'Test Email Campaign');
      
      if (existingCampaign) {
        campaignId = existingCampaign.id;
      } else {
        const newCampaign = await createCampaign({
          name: 'Test Email Campaign',
          description: 'Campaign for test emails',
          campaign_type: 'email',
          status: 'draft'
        });
        campaignId = newCampaign.id;
      }
      
      // Prepare HTML content with tracking pixel
      const htmlContent = convertContentToHtml(emailContent);
      
      // Send email using the edge function
      const response = await fetch(`${window.location.origin}/api/send-marketing-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          htmlContent,
          recipients: [testEmail],
          campaignId,
          eventId,
          trackingPixel: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send test email');
      }
      
      // Track metrics
      await trackMetric(campaignId, 'test_emails_sent', 1);
      
      toast({
        title: "Test Email Sent",
        description: `A test email has been sent to ${testEmail}`,
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!emailSubject || !emailContent) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and content for your email",
        variant: "destructive"
      });
      return;
    }
    
    const selectedListObj = attendeeLists.find(list => list.id === selectedList);
    if (!selectedListObj || selectedListObj.emails.length === 0) {
      toast({
        title: "No Recipients",
        description: "The selected list has no recipients",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Create a campaign for this email
      const campaignName = `Email: ${emailSubject.substring(0, 30)}${emailSubject.length > 30 ? '...' : ''}`;
      const newCampaign = await createCampaign({
        name: campaignName,
        description: `Email campaign: ${emailSubject}`,
        campaign_type: 'email',
        status: 'active',
        target_audience: { recipient_list: selectedList, recipient_count: selectedListObj.emails.length }
      });
      
      // Prepare HTML content
      const htmlContent = convertContentToHtml(emailContent);
      
      // Send email using the edge function
      const response = await fetch(`${window.location.origin}/api/send-marketing-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          htmlContent,
          recipients: selectedListObj.emails,
          campaignId: newCampaign.id,
          eventId,
          trackingPixel: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send campaign emails');
      }
      
      // Update campaign metrics
      await trackMetric(newCampaign.id, 'emails_sent', selectedListObj.emails.length);
      
      // Add to sent campaigns list
      const newSentCampaign = {
        id: newCampaign.id,
        name: campaignName,
        recipients: selectedListObj.emails.length,
        openRate: '0%',
        clickRate: '0%',
        sentDate: new Date().toLocaleDateString()
      };
      
      setSentCampaigns([newSentCampaign, ...sentCampaigns]);
      
      toast({
        title: "Campaign Sent",
        description: `Email campaign has been sent to ${selectedListObj.emails.length} recipients`,
      });
      
      // Reset the form
      setEmailSubject('');
      setEmailContent('');
      setSelectedTemplate('');
      
      // Switch to sent tab
      setCurrentTab('sent');
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast({
        title: "Error",
        description: "Failed to send campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
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
                    {attendeeLists.map(list => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name} ({list.emails.length})
                      </SelectItem>
                    ))}
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
              
              <div className="border p-4 rounded-md bg-slate-50">
                <Label htmlFor="testEmail" className="block mb-2">Send a test email</Label>
                <div className="flex gap-2">
                  <Input
                    id="testEmail"
                    placeholder="Enter your email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleSendTestEmail}
                    disabled={isSending || !testEmail}
                  >
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send Test
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSendCampaign}
                  disabled={isSending || !emailSubject || !emailContent}
                >
                  {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendeeLists.map(list => (
                      <tr key={list.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{list.name}</td>
                        <td className="px-4 py-3">{list.emails.length}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">View</Button>
                            <Button size="sm" variant="ghost">Export</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                    {sentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{campaign.name}</td>
                        <td className="px-4 py-3">{campaign.recipients}</td>
                        <td className="px-4 py-3">{campaign.openRate}</td>
                        <td className="px-4 py-3">{campaign.clickRate}</td>
                        <td className="px-4 py-3">{campaign.sentDate}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost">View Report</Button>
                        </td>
                      </tr>
                    ))}
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
