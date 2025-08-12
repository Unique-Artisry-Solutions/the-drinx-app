import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Activity, Rocket, Trash2, EyeOff, Eye } from 'lucide-react';

// Simple log entry type
interface LogEntry {
  ts: string; // ISO timestamp
  level: 'info' | 'success' | 'error';
  message: string;
}

const TOKEN_STORAGE_KEY = 'seed_admin_token';

type SeedAction = 'health' | 'seed_personas' | 'seed_all' | 'cleanup';

const DevSeedingPanel: React.FC = () => {
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState<string>('');
  const [isRunning, setIsRunning] = useState<SeedAction | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Seed runs state
  type SeedRun = { id: string; started_at: string; status: string };
  const [runs, setRuns] = useState<SeedRun[]>([]);
  const [runsLoading, setRunsLoading] = useState(false);
  const [runsError, setRunsError] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  // Load token from localStorage
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
    setToken(t);
    setSavedToken(t);
  }, []);

  // Auto scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((entry: Omit<LogEntry, 'ts'>) => {
    setLogs((prev) => [...prev, { ts: new Date().toISOString(), ...entry }]);
  }, []);

  const maskedToken = useMemo(() => {
    if (!savedToken) return '';
    if (savedToken.length <= 6) return '*'.repeat(savedToken.length);
    return savedToken.slice(0, 3) + '*'.repeat(savedToken.length - 6) + savedToken.slice(-3);
  }, [savedToken]);

  const [showToken, setShowToken] = useState(false);

  const saveToken = () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setSavedToken(token);
    toast({ description: 'Seed admin token saved locally' });
    addLog({ level: 'success', message: 'Token saved to localStorage' });
  };

const clearToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setSavedToken('');
    setToken('');
    toast({ description: 'Seed admin token cleared' });
    addLog({ level: 'info', message: 'Token cleared from localStorage' });
  };

  // Fetch recent seed runs for targeted cleanup
  const fetchRuns = useCallback(async () => {
    setRunsLoading(true);
    setRunsError(null);
    try {
      const { data, error } = await supabase
        .from('dev_seed_registry')
        .select('id, started_at, status')
        .order('started_at', { ascending: false })
        .limit(25);
      if (error) throw error;
      setRuns(data || []);
    } catch (e: any) {
      setRuns([]);
      setRunsError(e?.message || 'Unable to load seed runs');
      addLog({ level: 'error', message: `Failed to load seed runs: ${e?.message || 'unknown error'}` });
    } finally {
      setRunsLoading(false);
    }
  }, [addLog]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const invoke = async (action: SeedAction, extra?: Record<string, any>) => {
    if (!savedToken) {
      toast({ description: 'Please save a token first' });
      addLog({ level: 'error', message: 'No token saved. Save token before running actions.' });
      return;
    }

    if (action === 'cleanup') {
      const ok = window.confirm('Are you sure you want to cleanup seeded data? This cannot be undone.');
      if (!ok) return;
    }

    setIsRunning(action);
    setLastResult(null);
    addLog({ level: 'info', message: `Running action: ${action} ...` });

    try {
      const { data, error } = await supabase.functions.invoke('seed-dev-data', {
        body: { action, ...(extra || {}) },
        headers: { 'x-seed-admin-token': savedToken },
      });

      if (error) {
        throw error;
      }

      addLog({ level: 'success', message: `${action} completed` });
      if (data) {
        setLastResult(data);
        addLog({ level: 'info', message: `Response: ${JSON.stringify(data)}` });
      }
      toast({ description: `${action} finished successfully` });

      if (action === 'seed_all') {
        // Refresh runs so the new run appears in the dropdown
        fetchRuns();
      }
    } catch (err: any) {
      const msg = err?.message || 'Unknown error';
      addLog({ level: 'error', message: `${action} failed: ${msg}` });
      toast({ description: `${action} failed: ${msg}` });
    } finally {
      setIsRunning(null);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Dev Seeding
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Run health checks and seed realistic test data. Token is stored only in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token controls */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Seed Admin Token</label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="flex-1 flex items-center gap-2">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter token"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button variant="outline" type="button" onClick={() => setShowToken((s) => !s)} size="sm">
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" type="button" onClick={saveToken} disabled={!token}>
                Save token
              </Button>
              <Button variant="ghost" type="button" onClick={clearToken} disabled={!savedToken}>
                Clear
              </Button>
            </div>
          </div>
          {savedToken && (
            <p className="text-xs text-muted-foreground">Saved: {maskedToken}</p>
          )}
        </div>

        {/* Cleanup target (optional) */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Cleanup target (optional)</label>
          <div className="flex items-center gap-2">
            <div className="min-w-[220px]">
              <Select
                value={selectedRunId ?? 'all'}
                onValueChange={(v) => setSelectedRunId(v === 'all' ? null : v)}
                disabled={!!isRunning || runsLoading}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="All runs" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">All runs</SelectItem>
                  {runs.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {`${r.id.slice(0, 8)} — ${r.status} — ${new Date(r.started_at).toLocaleString()}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={fetchRuns} disabled={runsLoading || !!isRunning}>
              Refresh
            </Button>
          </div>
          {runsError && (
            <p className="text-xs text-muted-foreground">
              Could not list runs. Cleanup will affect all runs unless a specific ID is selected.
            </p>
          )}
          {!runsError && runs.length === 0 && (
            <p className="text-xs text-muted-foreground">No seed runs yet. Run Seed All to create one.</p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={() => invoke('health')}
            disabled={!!isRunning}
            className="justify-start"
          >
            <Activity className="h-4 w-4 mr-2" /> Health
          </Button>

          <Button
            variant="outline"
            onClick={() => invoke('seed_personas')}
            disabled={!!isRunning}
            className="justify-start"
          >
            <ShieldCheck className="h-4 w-4 mr-2" /> Seed Personas
          </Button>

          <Button
            variant="outline"
            onClick={() => invoke('seed_all')}
            disabled={!!isRunning}
            className="justify-start"
          >
            <Rocket className="h-4 w-4 mr-2" /> Seed All
          </Button>

          <Button
            variant="destructive"
            onClick={() => invoke('cleanup', { seed_run_id: selectedRunId })}
            disabled={!!isRunning}
            className="justify-start"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Cleanup
          </Button>
        </div>

        {/* Console */}
        <div>
          <div className="text-sm font-medium mb-2">Status Console</div>
          <div
            ref={consoleRef}
            className="h-40 overflow-auto rounded-md border border-border bg-muted/30 p-3 text-sm"
          >
            {logs.length === 0 ? (
              <div className="text-muted-foreground">No activity yet.</div>
            ) : (
              <ul className="space-y-1">
                {logs.map((l, idx) => (
                  <li key={idx} className="whitespace-pre-wrap">
                    <span className="text-muted-foreground">[{new Date(l.ts).toLocaleTimeString()}]</span>{' '}
                    <span className={
                      l.level === 'error'
                        ? 'text-destructive'
                        : l.level === 'success'
                        ? 'text-emerald-600'
                        : 'text-foreground'
                    }>
                      {l.level.toUpperCase()}
                    </span>{' '}
                    <span className="text-foreground">{l.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Result summary */}
        {lastResult && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Last Result</div>
            <pre className="max-h-64 overflow-auto rounded-md border border-border bg-background p-3 text-xs">
{JSON.stringify(lastResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DevSeedingPanel;
