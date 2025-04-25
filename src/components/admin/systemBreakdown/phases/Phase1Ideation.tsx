
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, FileText, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Phase1Ideation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Phase 1: Ideation
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Initial concept development and brainstorming phase for the promoter system.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Market Research & Competitor Analysis</h3>
              <p className="text-xs text-gray-600">Evaluated existing promoter tools and platforms to identify market gaps</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">User Interviews</h3>
              <p className="text-xs text-gray-600">Conducted interviews with promoters and venue owners to understand pain points</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Initial Feature Set Definition</h3>
              <p className="text-xs text-gray-600">Defined core feature requirements and prioritized implementation sequence</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Value Proposition</h3>
              <p className="text-xs text-gray-600">Established unique value proposition for promoters to differentiate from competing platforms</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Business Model Canvas</h3>
              <p className="text-xs text-gray-600">Created business model canvas to evaluate revenue potential and business viability</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Ideation Outcomes</h4>
            <span className="text-xs font-medium text-green-600">100% Complete</span>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2 rounded-md flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <div>
                <p className="text-xs font-medium">Requirements Document</p>
                <p className="text-xs text-slate-600">23 pages</p>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-md flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-600" />
              <div>
                <p className="text-xs font-medium">User Research</p>
                <p className="text-xs text-slate-600">15 interviews conducted</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase1Ideation;
