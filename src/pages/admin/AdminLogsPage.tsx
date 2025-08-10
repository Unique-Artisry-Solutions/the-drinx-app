
import { useState, useMemo } from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@/components/ui';
import TableSkeleton from '@/components/loading/skeletons/TableSkeleton';
import { Activity, Database, Shield, Bell } from 'lucide-react';
import { useHttpRequestLogs, usePaymentAuditLogs, useSecurityEventLogs, useSecurityAlerts, TimeRange, Severity } from '@/hooks/admin/useAdminLogs';

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: 'Last 15m', value: '15m' },
  { label: 'Last 1h', value: '1h' },
  { label: 'Last 24h', value: '24h' },
  { label: 'Last 7d', value: '7d' },
];

const AdminLogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'payments' | 'events' | 'alerts'>('requests');
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Tab-specific filters
  const [method, setMethod] = useState<string>('all');
  const [statusCode, setStatusCode] = useState<string>('all');
  const [severity, setSeverity] = useState<Severity | 'all'>('all');

  const commonParams = useMemo(() => ({ search, timeRange, autoRefresh }), [search, timeRange, autoRefresh]);

  const requests = useHttpRequestLogs({ ...commonParams, method: method === 'all' ? undefined : method, statusCode: statusCode === 'all' ? undefined : statusCode });
  const payments = usePaymentAuditLogs({ ...commonParams });
  const events = useSecurityEventLogs({ ...commonParams, severity: severity === 'all' ? undefined as Severity | undefined : severity as Severity });
  const alerts = useSecurityAlerts({ ...commonParams, severity: severity === 'all' ? undefined as Severity | undefined : severity as Severity });

  const pageConfig = {
    title: 'Logs & Alerts',
    description: 'Inspect HTTP requests, payments, security events, and alerts',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  return (
    <AdminPageLayout config={pageConfig}>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search (path, request id, message)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Time range" /></SelectTrigger>
          <SelectContent>
            {timeRanges.map(tr => (
              <SelectItem key={tr.value} value={tr.value}>{tr.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeTab === 'requests' && (
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Method" /></SelectTrigger>
              <SelectContent>
                {['all','GET','POST','PUT','PATCH','DELETE','OPTIONS'].map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusCode} onValueChange={setStatusCode}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {['all','2xx','3xx','4xx','5xx'].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {(activeTab === 'events' || activeTab === 'alerts') && (
          <Select value={severity} onValueChange={(v) => setSeverity(v as Severity | 'all')}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              {['all','low','medium','high','critical'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button variant={autoRefresh ? 'secondary' : 'outline'} onClick={() => setAutoRefresh(v => !v)}>
          {autoRefresh ? 'Auto-refresh: On' : 'Auto-refresh: Off'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="requests" className="flex items-center gap-2"><Activity className="h-4 w-4" />Requests</TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2"><Database className="h-4 w-4" />Payments</TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2"><Shield className="h-4 w-4" />Security Events</TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2"><Bell className="h-4 w-4" />Alerts</TabsTrigger>
        </TabsList>

        {/* Requests */}
        <TabsContent value="requests">
          {requests.isLoading ? (
            <TableSkeleton rows={6} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Time</th>
                    <th className="p-2">Method</th>
                    <th className="p-2">Path</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.data?.items?.map((r: any) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="p-2"><Badge variant="secondary">{r.method}</Badge></td>
                      <td className="p-2"><code className="text-xs">{r.path}</code></td>
                      <td className="p-2">{r.status_code}</td>
                      <td className="p-2">{r.duration_ms} ms</td>
                    </tr>
                  ))}
                  {requests.data?.items?.length === 0 && (
                    <tr><td className="p-4 text-muted-foreground" colSpan={5}>No results</td></tr>
                  )}
                </tbody>
              </table>
              <PaginationControls page={requests.data?.page || 1} total={requests.data?.total || 0} pageSize={requests.data?.pageSize || 50} onPageChange={requests.setPage} />
            </div>
          )}
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments">
          {payments.isLoading ? (
            <TableSkeleton rows={6} columns={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Time</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Provider</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Request ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.data?.items?.map((r: any) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="p-2">{r.action}</td>
                      <td className="p-2">{r.status}</td>
                      <td className="p-2">{r.provider}</td>
                      <td className="p-2">{r.amount} {r.currency}</td>
                      <td className="p-2"><code className="text-xs">{r.request_id}</code></td>
                    </tr>
                  ))}
                  {payments.data?.items?.length === 0 && (
                    <tr><td className="p-4 text-muted-foreground" colSpan={6}>No results</td></tr>
                  )}
                </tbody>
              </table>
              <PaginationControls page={payments.data?.page || 1} total={payments.data?.total || 0} pageSize={payments.data?.pageSize || 50} onPageChange={payments.setPage} />
            </div>
          )}
        </TabsContent>

        {/* Security Events */}
        <TabsContent value="events">
          {events.isLoading ? (
            <TableSkeleton rows={6} columns={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Time</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Severity</th>
                    <th className="p-2">IP</th>
                    <th className="p-2">Endpoint</th>
                    <th className="p-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {events.data?.items?.map((r: any) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="p-2">{r.event_type}</td>
                      <td className="p-2"><Badge variant="secondary">{r.severity}</Badge></td>
                      <td className="p-2">{r.ip_address}</td>
                      <td className="p-2">{r.endpoint}</td>
                      <td className="p-2 max-w-[300px] truncate" title={JSON.stringify(r.details)}>{typeof r.details === 'object' ? JSON.stringify(r.details) : r.details}</td>
                    </tr>
                  ))}
                  {events.data?.items?.length === 0 && (
                    <tr><td className="p-4 text-muted-foreground" colSpan={6}>No results</td></tr>
                  )}
                </tbody>
              </table>
              <PaginationControls page={events.data?.page || 1} total={events.data?.total || 0} pageSize={events.data?.pageSize || 50} onPageChange={events.setPage} />
            </div>
          )}
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts">
          {alerts.isLoading ? (
            <TableSkeleton rows={6} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Time</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Severity</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.data?.items?.map((r: any) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="p-2">{r.title}</td>
                      <td className="p-2"><Badge variant="secondary">{r.severity}</Badge></td>
                      <td className="p-2">{r.status}</td>
                      <td className="p-2">{r.source}</td>
                    </tr>
                  ))}
                  {alerts.data?.items?.length === 0 && (
                    <tr><td className="p-4 text-muted-foreground" colSpan={5}>No results</td></tr>
                  )}
                </tbody>
              </table>
              <PaginationControls page={alerts.data?.page || 1} total={alerts.data?.total || 0} pageSize={alerts.data?.pageSize || 50} onPageChange={alerts.setPage} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({ page, total, pageSize, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="text-xs text-muted-foreground">Page {page} of {totalPages} • {total} items</div>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</Button>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default AdminLogsPage;
