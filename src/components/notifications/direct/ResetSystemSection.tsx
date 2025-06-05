
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Zap } from "lucide-react";

interface ResetSystemSectionProps {
  isLoading: boolean;
  onReset: () => void;
}

const ResetSystemSection: React.FC<ResetSystemSectionProps> = ({
  isLoading,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle>System Reset</AlertTitle>
        <AlertDescription>
          If you're experiencing issues with notifications, you can reset the entire notification system. This will:
          <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
            <li>Unregister all service workers</li>
            <li>Refresh permission status</li>
            <li>Clear any cached data</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <Button 
        variant="destructive" 
        onClick={onReset}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Reset Notification System
          </>
        )}
      </Button>
    </div>
  );
};

export default ResetSystemSection;
