
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreferencesFormError() {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Failed to load user preferences. Please try again later.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
