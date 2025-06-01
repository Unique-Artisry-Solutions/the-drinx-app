
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Settings, ListCheck, Database, ChartBar, FileText } from "lucide-react";

interface GuideTabsListProps {
  activeTab: string;
}

export function GuideTabsList({ activeTab }: GuideTabsListProps) {
  return (
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
  );
}
