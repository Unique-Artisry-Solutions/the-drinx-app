
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Settings } from "lucide-react";

interface Props {
  diagnosticsData: Record<string, any>;
  serviceWorkerStatus: 'checking' | 'active' | 'inactive';
  permissionState: NotificationPermission;
  subscription: any;
  onReset: () => Promise<void>;
}

export default function NotificationDiagnosticsPanel({
  diagnosticsData,
  serviceWorkerStatus,
  permissionState,
  subscription,
  onReset,
}: Props) {
  if (!diagnosticsData || Object.keys(diagnosticsData).length === 0) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-slate-50">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Settings className="h-3 w-3" /> System Diagnostics
      </h4>
      <div className="text-xs space-y-1 text-gray-500">
        <p>Service Worker: {serviceWorkerStatus === 'active' ? 'Active' : serviceWorkerStatus === 'checking' ? 'Checking...' : 'Inactive'}</p>
        <p>Permission: {permissionState}</p>
        <p>Controller: {diagnosticsData.controller ? 'Yes' : 'No'}</p>
        <p>Registrations: {diagnosticsData.registrations?.length || 0}</p>
        <p>Subscription: {subscription ? 'Yes' : 'No'}</p>
      </div>
      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs"
        >
          Reset System
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="text-xs"
        >
          Reload Page
        </Button>
      </div>

      <div className="mt-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle>Service Worker Mode</AlertTitle>
          <AlertDescription>
            This mode uses service workers to handle push notifications. If you're having trouble, try the Direct Browser mode instead.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
