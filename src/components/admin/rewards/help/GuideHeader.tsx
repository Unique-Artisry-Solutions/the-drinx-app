
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function GuideHeader({ isCollapsed, setIsCollapsed }: GuideHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between bg-muted/40 pb-2">
      <CardTitle className="flex items-center gap-2">
        <Book className="h-5 w-5 text-primary" />
        Rewards Program Administration Guide
      </CardTitle>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10">Documentation</Badge>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </CardHeader>
  );
}
