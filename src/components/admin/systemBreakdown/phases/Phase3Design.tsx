
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Figma, LayoutPanelLeft, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Phase3Design: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-pink-500" />
            Phase 3: Design
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            90% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            User interface and experience design for the promoter system.
          </p>
          <Progress value={90} className="w-24 h-2" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Design System</h3>
              <p className="text-xs text-gray-600">Created unified design system for promoter interfaces with consistent components</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">User Flow Mapping</h3>
              <p className="text-xs text-gray-600">Designed user flows for key promoter journeys: event creation, communication, analytics</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">High-Fidelity Mockups</h3>
              <p className="text-xs text-gray-600">Created detailed mockups for all promoter interfaces and components</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Design Prototypes</h3>
              <p className="text-xs text-gray-600">Built interactive prototypes to validate user flows and interface functionality</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Usability Testing</h3>
              <p className="text-xs text-gray-600">Conducting usability testing with promoter focus group to validate design decisions</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium mb-3">Design Deliverables</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Figma className="h-4 w-4 text-slate-600" />
                <h5 className="text-xs font-medium">UI Components</h5>
              </div>
              <div className="flex items-center gap-1">
                <Progress value={100} className="h-1.5 flex-1" />
                <span className="text-xs font-medium">100%</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <LayoutPanelLeft className="h-4 w-4 text-slate-600" />
                <h5 className="text-xs font-medium">Page Mockups</h5>
              </div>
              <div className="flex items-center gap-1">
                <Progress value={95} className="h-1.5 flex-1" />
                <span className="text-xs font-medium">95%</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-slate-600" />
                <h5 className="text-xs font-medium">User Testing</h5>
              </div>
              <div className="flex items-center gap-1">
                <Progress value={75} className="h-1.5 flex-1" />
                <span className="text-xs font-medium">75%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md mt-3">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Design System Highlights</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs">Primary</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs">Secondary</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Success</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs">Warning</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase3Design;
