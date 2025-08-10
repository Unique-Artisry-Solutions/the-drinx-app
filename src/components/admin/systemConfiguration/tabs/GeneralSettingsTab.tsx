
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SettingsTabProps } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Info, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import EmptyState from '../EmptyState';
import { supabase } from '@/lib/supabase';
import { debouncedToast } from '@/utils/debouncedToast';

const GeneralSettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  isLoading,
  editingSettingId,
  editValue,
  changeReason,
  onEditClick,
  onSaveClick,
  onCancelClick,
  setEditValue,
  setChangeReason,
}) => {
  const [healthStatus, setHealthStatus] = useState<'idle' | 'checking' | 'healthy' | 'unhealthy'>('idle');
  const [healthDetails, setHealthDetails] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runHealthCheck = useCallback(async () => {
    try {
      setHealthStatus('checking');
      setHealthDetails(null);
      const { data, error } = await supabase.functions.invoke('security-healthcheck');
      if (error) throw new Error(error.message || 'Health check failed');

      if (data?.ok) {
        setHealthStatus('healthy');
        setHealthDetails(`Env: ${data.environment}${data?.stripe?.email ? ` • Stripe: ${data.stripe.email}` : ''}`);
        debouncedToast.success('Security health', 'All checks passed');
      } else {
        setHealthStatus('unhealthy');
        setHealthDetails(data?.error || 'Unknown error');
        debouncedToast.error('Security health', data?.error || 'Failed');
      }
      setLastCheck(new Date());
    } catch (e) {
      setHealthStatus('unhealthy');
      const msg = e instanceof Error ? e.message : 'Health check failed';
      setHealthDetails(msg);
      setLastCheck(new Date());
      debouncedToast.error('Security health', msg);
    }
  }, []);

  const hasSettings = settings && settings.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage system-wide configuration settings</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Add Setting
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {healthStatus === 'healthy' ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : healthStatus === 'unhealthy' ? (
                <ShieldAlert className="h-5 w-5 text-red-600" />
              ) : (
                <Info className="h-5 w-5 text-blue-500" />
              )}
              <div>
                <p className="text-sm font-medium">Security Health Check</p>
                <p className="text-sm text-muted-foreground">
                  {healthStatus === 'idle' && 'Run the check to validate Stripe and environment'}
                  {healthStatus === 'checking' && 'Checking...'}
                  {healthStatus === 'healthy' && 'All systems operational'}
                  {healthStatus === 'unhealthy' && (healthDetails ? `Issues: ${healthDetails}` : 'Issues detected')}
                </p>
                {lastCheck && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last checked: {lastCheck.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Button size="sm" onClick={runHealthCheck} disabled={healthStatus === 'checking'}>
              {healthStatus === 'checking' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking
                </>
              ) : (
                'Run health check'
              )}
            </Button>
          </div>
        </div>
        {hasSettings ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">About General Settings</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>These settings control the core functionality of the application.</p>
                    <p className="mt-1">Changes to these settings will affect how the system operates.</p>
                  </div>
                </div>
              </div>
            </div>
            <SystemSettingsTable
              settings={settings}
              isLoading={isLoading}
              editingSettingId={editingSettingId}
              editValue={editValue}
              changeReason={changeReason}
              onEditClick={onEditClick}
              onSaveClick={onSaveClick}
              onCancelClick={onCancelClick}
              setEditValue={setEditValue}
              setChangeReason={setChangeReason}
            />
          </>
        ) : (
          <EmptyState 
            title="No general settings found" 
            description="There are no general settings configured yet. Click the button above to add your first setting."
            icon="Settings" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;
