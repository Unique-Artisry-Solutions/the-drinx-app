import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Settings, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  diagnosticsData: Record<string, any>;
  serviceWorkerStatus: 'checking' | 'active' | 'inactive';
  permissionState: NotificationPermission;
  subscription: any;
  onReset: () => Promise<void>;
}

const DiagnosticItem = ({ label, value, isPositive = true }: { 
  label: string; 
  value: React.ReactNode;
  isPositive?: boolean;
}) => (
  <p className="flex justify-between">
    <span>{label}:</span>
    <span className={isPositive ? "text-green-600" : "text-amber-600 font-medium"}>
      {value}
    </span>
  </p>
);

const ServiceWorkerStatusIndicator = ({ status }: { status: 'checking' | 'active' | 'inactive' }) => {
  if (status === 'checking') {
    return <span className="text-blue-500 flex items-center gap-1">
      <Info className="h-3 w-3" /> Checking...
    </span>;
  } else if (status === 'active') {
    return <span className="text-green-500 flex items-center gap-1">
      <CheckCircle2 className="h-3 w-3" /> Active
    </span>;
  } else {
    return <span className="text-amber-500 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" /> Inactive
    </span>;
  }
};

const formatPermission = (permission: NotificationPermission) => {
  switch (permission) {
    case 'granted': return <span className="text-green-600">Granted</span>;
    case 'denied': return <span className="text-red-600">Denied</span>;
    default: return <span className="text-amber-600">Not set</span>;
  }
};

export default function NotificationDiagnosticsPanel({
  diagnosticsData,
  serviceWorkerStatus,
  permissionState,
  subscription,
  onReset,
}: Props) {
  if (!diagnosticsData || Object.keys(diagnosticsData).length === 0) return null;

  const registrationsCount = Array.isArray(diagnosticsData.registrations) ? 
    diagnosticsData.registrations.length : 0;

  return (
    <div className="mt-4 p-4 border rounded-md bg-slate-50">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Settings className="h-3 w-3" /> System Diagnostics
      </h4>
      
      <div className="text-xs space-y-1 text-gray-500">
        <DiagnosticItem 
          label="Service Worker" 
          value={<ServiceWorkerStatusIndicator status={serviceWorkerStatus} />} 
          isPositive={serviceWorkerStatus === 'active'} 
        />
        <DiagnosticItem 
          label="Permission" 
          value={formatPermission(permissionState)} 
          isPositive={permissionState === 'granted'} 
        />
        <DiagnosticItem 
          label="Controller" 
          value={diagnosticsData.controller ? 'Yes' : 'No'} 
          isPositive={!!diagnosticsData.controller} 
        />
        <DiagnosticItem 
          label="Registrations" 
          value={registrationsCount} 
          isPositive={registrationsCount > 0} 
        />
        <DiagnosticItem 
          label="Subscription" 
          value={subscription ? 'Yes' : 'No'} 
          isPositive={!!subscription} 
        />
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
