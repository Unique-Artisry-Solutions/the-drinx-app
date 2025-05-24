
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CircleDashed, Clock, Code, CodeSquare, MessageSquare, BarChart3, Ticket, Database, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Phase4Development: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-emerald-500" />
            Phase 4: Development
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            In Progress
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Core software development and implementation of the promoter system.
          </p>
          <div className="flex items-center gap-1">
            <Progress value={60} className="w-24 h-2" />
            <span className="text-xs font-medium">60%</span>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="core-infrastructure">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Core Infrastructure</span>
                <Badge className="ml-2 bg-green-100 text-green-800">100%</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-6">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Authentication & Authorization</p>
                    <p className="text-xs text-gray-600">Role-based access control for promoters</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Database Schema Implementation</p>
                    <p className="text-xs text-gray-600">12 tables with relationships and indexes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Base API Layer</p>
                    <p className="text-xs text-gray-600">RESTful endpoints with Supabase integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Navigation & Routing</p>
                    <p className="text-xs text-gray-600">Promoter-specific routes and navigation system</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="communication-system">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Communication System</span>
                <Badge className="ml-2 bg-green-100 text-green-800">95%</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-6">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Messaging Infrastructure</p>
                    <p className="text-xs text-gray-600">Secure message storage and retrieval system</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Thread Management</p>
                    <p className="text-xs text-gray-600">Conversation threading and organization</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Contact System</p>
                    <p className="text-xs text-gray-600">Venue contact search and management</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Notification Integration</p>
                    <p className="text-xs text-gray-600">Real-time messaging notifications</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="event-management">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Event Management</span>
                <Badge className="ml-2 bg-amber-100 text-amber-800">40%</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-6">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Event Creation & Configuration</p>
                    <p className="text-xs text-gray-600">Basic event setup and management</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Ticketing System</p>
                    <p className="text-xs text-gray-600">Ticket types, pricing, and inventory (in progress)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Attendee Management</p>
                    <p className="text-xs text-gray-600">Registration and check-in functionality (in progress)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Payment Processing</p>
                    <p className="text-xs text-gray-600">Integration with payment gateways (not started)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Promotional Tools</p>
                    <p className="text-xs text-gray-600">Marketing and promotional features (not started)</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="analytics">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium">Analytics & Reporting</span>
                <Badge className="ml-2 bg-blue-100 text-blue-800">10%</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-6">
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm">Data Collection Infrastructure</p>
                    <p className="text-xs text-gray-600">Analytics data gathering system (in progress)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Performance Metrics</p>
                    <p className="text-xs text-gray-600">KPI calculation and storage (not started)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Visual Reporting</p>
                    <p className="text-xs text-gray-600">Charts and visualization components (not started)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Export Functionality</p>
                    <p className="text-xs text-gray-600">Data export in multiple formats (not started)</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="brand-partnerships">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Brand Partnerships</span>
                <Badge className="ml-2 bg-gray-100 text-gray-800">Planned</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-6">
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Partnership Profiles</p>
                    <p className="text-xs text-gray-600">Brand profile creation and management (planned)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Connection System</p>
                    <p className="text-xs text-gray-600">Brand-promoter connection functionality (planned)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Collaboration Tools</p>
                    <p className="text-xs text-gray-600">Project management for brand collaborations (planned)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">Contract Management</p>
                    <p className="text-xs text-gray-600">Partnership agreement handling (planned)</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-2 bg-slate-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Development Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <p className="text-xs text-slate-600">Components Built</p>
              <p className="text-lg font-semibold">42</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">APIs Implemented</p>
              <p className="text-lg font-semibold">18</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Open Issues</p>
              <p className="text-lg font-semibold">15</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Code Coverage</p>
              <p className="text-lg font-semibold">78%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase4Development;
