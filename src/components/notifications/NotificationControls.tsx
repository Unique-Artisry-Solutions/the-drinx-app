
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap } from "lucide-react";

interface NotificationControlsProps {
  onRefresh: () => void;
  onDiagnose: () => void;
}

export const NotificationControls: React.FC<NotificationControlsProps> = ({
  onRefresh,
  onDiagnose
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDiagnose}
        title="Run system diagnostics"
        className="h-8 px-2"
      >
        <Zap className="h-4 w-4 mr-1" />
        Diagnose
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        title="Refresh permission status"
        className="h-8 px-2"
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Refresh
      </Button>
    </div>
  );
};
