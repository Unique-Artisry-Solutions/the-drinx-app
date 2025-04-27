
import React from 'react';
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const PreferencesFormError = () => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load preferences. Please try refreshing the page or contact support if the issue persists.
      </AlertDescription>
    </Alert>
  );
};
