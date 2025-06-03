
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CircleDashed, Clock, Gauge, Lock, MonitorSmartphone, Settings, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Phase5Refinement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Phase 5: Refinement
          </CardTitle>
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            Not Started
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Iterative improvements and feature refinement for the promoter system.
          </p>
          <div className="flex items-center gap-1">
            <Progress value={0} className="w-24 h-2" />
            <span className="text-xs font-medium">0%</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Performance Optimization</h3>
              <p className="text-xs text-gray-600">Implement performance improvements for high-traffic promoter events</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">User Feedback Integration</h3>
              <p className="text-xs text-gray-600">Incorporate feedback from beta users to improve usability</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">UI/UX Improvements</h3>
              <p className="text-xs text-gray-600">Refine interface based on usability testing and user feedback</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Security Auditing</h3>
              <p className="text-xs text-gray-600">Perform security audit and implement recommended enhancements</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">System Scaling</h3>
              <p className="text-xs text-gray-600">Prepare infrastructure for scale and optimize database performance</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Documentation Updates</h3>
              <p className="text-xs text-gray-600">Create comprehensive documentation for promoters and developers</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium mb-3">Refinement Focus Areas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-md flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-slate-600" />
                <h5 className="text-xs font-medium">Performance</h5>
              </div>
              <p className="text-xs text-slate-600">Optimizing load times and resource utilization for high-traffic events</p>
              <div className="mt-2 flex items-center gap-1">
                <Badge variant="outline">Scheduled for Q3</Badge>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-md flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-slate-600" />
                <h5 className="text-xs font-medium">Security</h5>
              </div>
              <p className="text-xs text-slate-600">Enhancing payment security and data protection measures</p>
              <div className="mt-2 flex items-center gap-1">
                <Badge variant="outline">Scheduled for Q3</Badge>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-md flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <MonitorSmartphone className="h-4 w-4 text-slate-600" />
                <h5 className="text-xs font-medium">Mobile Experience</h5>
              </div>
              <p className="text-xs text-slate-600">Optimizing for mobile promoter workflow and event management</p>
              <div className="mt-2 flex items-center gap-1">
                <Badge variant="outline">Scheduled for Q3</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase5Refinement;
