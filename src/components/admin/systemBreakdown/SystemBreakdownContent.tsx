
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Phase1Setup from "./phases/Phase1Setup";
import Phase2Authentication from "./phases/Phase2Authentication";
import Phase3UserExperience from "./phases/Phase3UserExperience";
import Phase4Integration from "./phases/Phase4Integration";
import Phase5Analysis from "./phases/Phase5Analysis";
import Phase6Testing from "./phases/Phase6Testing";
import Phase7FeatureSystemRollout from './phases/Phase7FeatureSystemRollout';
import { useSystemData } from '@/hooks/useSystemData';

const SystemBreakdownContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, error } = useSystemData();
  
  if (isLoading) {
    return <div className="text-center p-12">Loading system information...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500">Error loading system information</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search system components..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">Export Report</Button>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">System Implementation Phases</h2>
        
        <div className="space-y-4">
          <Phase1Setup />
          <Phase2Authentication />
          <Phase3UserExperience />
          <Phase4Integration />
          <Phase5Analysis />
          <Phase6Testing />
          <Phase7FeatureSystemRollout />
        </div>
      </div>
    </div>
  );
};

export default SystemBreakdownContent;
