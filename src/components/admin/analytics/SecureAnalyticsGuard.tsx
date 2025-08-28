import { ReactNode } from 'react';
import { useSecureAnalytics } from '@/hooks/useSecureAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SecureAnalyticsGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Guard component that checks admin access before showing analytics content
 * Prevents unauthorized access to analytics data and materialized views
 */
export function SecureAnalyticsGuard({ children, fallback }: SecureAnalyticsGuardProps) {
  const { hasAdminAccess, checkingAccess, canAccessAnalytics } = useSecureAnalytics();

  if (checkingAccess) {
    return fallback || (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Checking Access...
          </CardTitle>
          <CardDescription>
            Verifying your permissions to access analytics data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!hasAdminAccess) {
    return fallback || (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You need admin privileges to access analytics data and materialized views.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This content is protected to ensure data security and prevent unauthorized access to sensitive analytics information.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (canAccessAnalytics) {
    return <>{children}</>;
  }

  return fallback || null;
}