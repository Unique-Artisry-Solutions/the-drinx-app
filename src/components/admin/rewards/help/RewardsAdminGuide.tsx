
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Info, HelpCircle, Book, Settings, ListCheck, Database, ChartBar, FileText } from "lucide-react";

export function RewardsAdminGuide() {
  const [openTab, setOpenTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-muted/40 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5 text-primary" />
          Rewards Program Administration Guide
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10">Documentation</Badge>
          <CollapsibleTrigger asChild onClick={() => setIsCollapsed(!isCollapsed)}>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      
      <Collapsible open={!isCollapsed}>
        <CollapsibleContent>
          <CardContent className="pt-4">
            <Tabs value={openTab} onValueChange={setOpenTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="configuration" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Configuration
                </TabsTrigger>
                <TabsTrigger value="rules" className="flex items-center gap-1">
                  <ListCheck className="h-4 w-4" />
                  Rules
                </TabsTrigger>
                <TabsTrigger value="bulk" className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  Bulk Operations
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-1">
                  <ChartBar className="h-4 w-4" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Export
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="overview">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Rewards Program Administration</h3>
                    <p>Welcome to the Rewards Program Administration panel. This guide will help you navigate and use the various tools available for managing your rewards program.</p>
                    
                    <Alert variant="default" className="bg-muted/50">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        The administration panel is divided into five main sections: Configuration, Rules Management, Bulk Operations, Statistics, and Export Reports.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Getting Started</h4>
                      <p>To begin managing your rewards program:</p>
                      <ol className="list-decimal list-inside space-y-1 pl-4">
                        <li>Start by reviewing and updating your program configuration settings</li>
                        <li>Set up reward rules to define how users earn points</li>
                        <li>Use bulk operations for mass point adjustments when needed</li>
                        <li>Monitor program performance through the statistics dashboard</li>
                        <li>Generate reports for detailed analysis and record-keeping</li>
                      </ol>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Concepts</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Points:</strong> The currency of your rewards program</li>
                        <li><strong>Rules:</strong> Conditions that trigger point earning or redemption</li>
                        <li><strong>Tiers:</strong> Levels users can achieve based on their activity</li>
                        <li><strong>Redemptions:</strong> When users exchange points for rewards</li>
                      </ul>
                    </div>
                    
                    <p>Select a specific section from the tabs above to learn more about each feature.</p>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="configuration">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configuration Guide</h3>
                    <p>This section allows you to customize core settings of your rewards program.</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">General Settings</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Program Status:</strong> Enable or disable the entire rewards program</li>
                        <li><strong>Tier Analytics:</strong> Toggle tracking of tier progression metrics</li>
                        <li><strong>Points Expiration:</strong> Set how many days before points expire (0 for never)</li>
                      </ul>
                      
                      <div className="bg-muted/30 rounded-md p-3 mt-2">
                        <p className="text-sm"><strong>Pro Tip:</strong> Disabling the program temporarily can be useful during maintenance or when making significant changes.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Point Earning Settings</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Points per Dollar:</strong> Points awarded per dollar spent</li>
                        <li><strong>Signup Bonus:</strong> One-time points awarded to new users</li>
                        <li><strong>Referral Bonus:</strong> Points awarded for successful referrals</li>
                        <li><strong>Check-in Points:</strong> Points awarded when users check in</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Redemption Settings</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Minimum Redemption:</strong> Minimum points needed for any redemption</li>
                        <li><strong>Redemption Rules:</strong> Special conditions for point redemption</li>
                      </ul>
                      
                      <div className="bg-muted/30 rounded-md p-3 mt-2">
                        <p className="text-sm"><strong>Best Practice:</strong> Set redemption minimums that encourage users to engage more with your platform.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">How to Save Changes</h4>
                      <p>After making changes to any configuration settings:</p>
                      <ol className="list-decimal list-inside space-y-1 pl-4">
                        <li>Review your changes for accuracy</li>
                        <li>Click the "Save Changes" button at the top of the card</li>
                        <li>Wait for confirmation that settings have been updated</li>
                      </ol>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="rules">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Rules Management Guide</h3>
                    <p>This section allows you to create and manage rules for how users earn and redeem points.</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Creating a New Rule</h4>
                      <ol className="list-decimal list-inside space-y-1 pl-4">
                        <li>Click the "Add New Rule" button</li>
                        <li>Fill in the required fields:
                          <ul className="list-disc list-inside ml-6 mt-1">
                            <li><strong>Rule Name:</strong> A descriptive name for the rule</li>
                            <li><strong>Description:</strong> Details explaining the rule's purpose</li>
                            <li><strong>Event Type:</strong> The trigger action (e.g., check_in, purchase)</li>
                            <li><strong>Points:</strong> Number of points to award</li>
                          </ul>
                        </li>
                        <li>Set the rule as active or inactive</li>
                        <li>Click "Save" to create the rule</li>
                      </ol>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Managing Existing Rules</h4>
                      <p>For each rule in the list, you can:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Edit:</strong> Modify any aspect of the rule</li>
                        <li><strong>Activate/Deactivate:</strong> Toggle whether the rule is currently in effect</li>
                        <li><strong>Delete:</strong> Permanently remove a rule</li>
                      </ul>
                      
                      <div className="bg-muted/30 rounded-md p-3 mt-2">
                        <p className="text-sm"><strong>Caution:</strong> Deleting a rule cannot be undone. Consider deactivating rules instead if you may need them again.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Rule Types and Best Practices</h4>
                      <p>Common rule types include:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Regular activity rules:</strong> For check-ins, purchases, etc.</li>
                        <li><strong>Special event rules:</strong> For limited-time promotions</li>
                        <li><strong>Milestone rules:</strong> For achievements or loyalty milestones</li>
                      </ul>
                      
                      <p className="mt-2">For effective rule management:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Use clear, descriptive names for rules</li>
                        <li>Regularly review and update rules based on program performance</li>
                        <li>Test new rules thoroughly before activating them</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="bulk">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bulk Operations Guide</h3>
                    <p>This section allows you to add or subtract points for multiple users simultaneously.</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Using Bulk Operations</h4>
                      <ol className="list-decimal list-inside space-y-1 pl-4">
                        <li>Select an operation type:
                          <ul className="list-disc list-inside ml-6 mt-1">
                            <li><strong>Add Points:</strong> Add points to user accounts</li>
                            <li><strong>Subtract Points:</strong> Deduct points from user accounts</li>
                          </ul>
                        </li>
                        <li>Provide user data in CSV format:
                          <ul className="list-disc list-inside ml-6 mt-1">
                            <li>Either upload a CSV file</li>
                            <li>Or manually enter data in the text area</li>
                          </ul>
                        </li>
                        <li>Click "Execute Bulk Operation" to process</li>
                      </ol>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">CSV Format Requirements</h4>
                      <p>Your CSV data should follow this format:</p>
                      <div className="font-mono text-sm p-3 bg-muted/30 rounded-md">
                        userId,points,source,metadata
                      </div>
                      
                      <p className="mt-2">For example:</p>
                      <div className="font-mono text-sm p-3 bg-muted/30 rounded-md">
                        user-123,100,promotion,{`{"campaign":"summer"}`}<br/>
                        user-456,50,bonus,{`{"reason":"loyalty"}`}
                      </div>
                      
                      <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                        <li><strong>userId:</strong> Unique identifier for the user</li>
                        <li><strong>points:</strong> Number of points to add/subtract</li>
                        <li><strong>source:</strong> Reason for the point change</li>
                        <li><strong>metadata:</strong> Optional JSON object with additional information</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Tips for Bulk Operations</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Always verify your CSV data before submission</li>
                        <li>Use meaningful source values for audit purposes</li>
                        <li>Keep backup records of large point adjustments</li>
                        <li>Review results after completion to verify success</li>
                      </ul>
                      
                      <div className="bg-muted/30 rounded-md p-3 mt-2">
                        <p className="text-sm"><strong>Note:</strong> For very large datasets (1000+ users), consider breaking them into smaller batches for better performance.</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="statistics">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Statistics Dashboard Guide</h3>
                    <p>This section provides visual analytics and insights about your rewards program performance.</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Metrics</h4>
                      <p>The dashboard displays several important metrics:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Total Users:</strong> Number of users enrolled in the program</li>
                        <li><strong>Active Users:</strong> Users who have earned or redeemed points recently</li>
                        <li><strong>Average Points Balance:</strong> Mean points across all user accounts</li>
                        <li><strong>Total Point Transactions:</strong> Volume of point activities</li>
                        <li><strong>Redemption Rate:</strong> Percentage of earned points that get redeemed</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Chart Interpretations</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>Points Earned vs. Redeemed:</strong> Balance between points entering and leaving the system</li>
                        <li><strong>User Tier Distribution:</strong> Breakdown of users across different program tiers</li>
                        <li><strong>Engagement Over Time:</strong> Trends in user participation</li>
                        <li><strong>Top Earning Sources:</strong> Which activities generate the most points</li>
                        <li><strong>Popular Redemptions:</strong> What rewards users choose most often</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Using the Statistics Dashboard</h4>
                      <ol className="list-decimal list-inside space-y-1 pl-4">
                        <li>Use date filters to view data for specific periods</li>
                        <li>Hover over chart elements to see detailed information</li>
                        <li>Toggle between different visualization types when available</li>
                        <li>Look for anomalies or trends that might indicate issues or opportunities</li>
                      </ol>
                      
                      <div className="bg-muted/30 rounded-md p-3 mt-2">
                        <p className="text-sm"><strong>Tip:</strong> Check the statistics dashboard regularly to identify patterns and optimize your reward program strategy.</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="export">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Report Export Guide</h3>
                    <p>This section allows you to generate and export detailed reports about your rewards program.</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Available Report Types</h4>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li><strong>User Points:</strong> Current point balances for all users</li>
                        <li><strong>Reward Redemptions:</strong> History of all reward redemptions</li>
                        <li><strong>Point Transactions:</strong> Detailed log of point activities</li>
                        <li><strong>Tier Distribution:</strong> Breakdown of users by tier level</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Generating Reports</h4>
                      <ol className="list-decimal list-inside space-y-1 pl-4">
                        <li>Select the report type you need</li>
                        <li>Specify a date range if applicable</li>
                        <li>Click "Generate Preview" to see a sample of the data</li>
                        <li>Review the preview to ensure it contains the information you need</li>
                        <li>Click "Export Full Report" to download the complete dataset</li>
                      </ol>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Working with Exported Reports</h4>
                      <p>Exported reports are delivered as CSV files that can be:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Opened in spreadsheet applications like Excel or Google Sheets</li>
                        <li>Imported into data analysis tools</li>
                        <li>Archived for record-keeping and compliance</li>
                        <li>Shared with team members or stakeholders</li>
                      </ul>
                      
                      <div className="bg-muted/30 rounded-md p-3 mt-2">
                        <p className="text-sm"><strong>Best Practice:</strong> Schedule regular exports of critical reports for backup purposes and trend analysis.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Troubleshooting</h4>
                      <p>If you encounter issues with report exports:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Verify your date range is valid</li>
                        <li>Try exporting a smaller date range if the report is too large</li>
                        <li>Check for any system notifications about maintenance or downtime</li>
                        <li>Refresh the page and try again if the export button is unresponsive</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
