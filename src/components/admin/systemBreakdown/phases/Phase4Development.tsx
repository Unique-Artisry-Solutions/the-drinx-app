
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TestProgressSection from "../shared/TestProgressSection";

const Phase4Development = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Phase 4: Development</CardTitle>
            <CardDescription>Core functionality implementation and feature development</CardDescription>
          </div>
          <Badge className="ml-2" variant="outline">In Progress</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Implementation Status</h3>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 border border-green-200 bg-green-50">
                  <h4 className="font-medium text-green-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completed Features
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      User authentication &amp; profile management
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Establishment listing &amp; details
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Mocktail recipe creation &amp; management
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Admin dashboard &amp; moderation tools
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Map integration with location features
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Bar crawl creation &amp; management
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Rewards system &amp; points tracking
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Promoter event management
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Discount Code Management with advanced rules
                    </li>
                  </ul>
                </Card>
                
                <Card className="p-4 border border-blue-200 bg-blue-50">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    In Progress Features
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Advanced analytics dashboard
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Notification system integration
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Advanced ticket types &amp; pricing
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Custom branding for promoters
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Email marketing campaigns
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Advanced search &amp; filtering
                    </li>
                  </ul>
                </Card>
              </div>
              
              <TestProgressSection />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Development Notes</h3>
            <p className="text-muted-foreground">
              Phase 4 development is progressing well with several key features now fully implemented. 
              The discount code management system has been completed with advanced rules and batch operations.
              Current focus is on completing the ticketing system and enhancing the analytics capabilities.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Next Steps</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Complete remaining ticket management features</li>
              <li>Finalize event analytics dashboard for promoters</li>
              <li>Implement email marketing campaign tools</li>
              <li>Enhance user experience for mobile devices</li>
              <li>Begin integration testing with all components</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase4Development;
