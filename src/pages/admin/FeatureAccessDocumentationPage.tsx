
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Separator } from '@/components/ui/separator';
import { Book, Code, LineChart, GitBranch, ShieldCheck } from 'lucide-react';
import { Callout } from '@/components/ui/callout';

// Markdown component (simplified for this example)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

// Example markdown content
const overviewContent = `
# Feature Access System

The Feature Access System is a comprehensive solution for controlling which features are available to which users. 

## Key Components

- **Feature Registry**: Centralized definition of all features
- **Feature Context**: React context for providing feature access
- **FeatureGate Component**: UI component for conditional rendering
- **Feature API**: Backend communication layer

## Benefits

- **Flexible Access Control**: Control features by tier, role, or segment
- **Performance**: Optimized with caching for minimal impact
- **Testability**: Comprehensive testing suite
- **Monitoring**: Built-in performance tracking
`;

const implementationContent = `
# Implementation Guide

Follow these steps to implement feature gating in your components:

\`\`\`tsx
import { FeatureGate } from '@/components/FeatureGate';
import { FEATURES } from '@/lib/features/registry';

// In your component:
return (
  <div>
    <h1>My Component</h1>
    
    <FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
      <AdvancedAnalytics />
    </FeatureGate>
  </div>
);
\`\`\`

For programmatic access:

\`\`\`tsx
import { useFeatureToggle } from '@/components/FeatureGate';
import { FEATURES } from '@/lib/features/registry';

// In your component:
const { whenEnabled } = useFeatureToggle(FEATURES.BULK_MESSAGING);

whenEnabled(() => {
  // This code only runs if the user has access
  sendBulkMessages();
});
\`\`\`
`;

const apiContent = `
# API Reference

## React Hooks

### \`useFeatures()\`

Returns the feature context.

\`\`\`tsx
const { hasAccess, checkAccess, trackFeatureUsage } = useFeatures();
\`\`\`

**Returns:**
- \`hasAccess\`: (featureId: FeatureId) => boolean
- \`checkAccess\`: (featureId: FeatureId) => Promise<boolean>
- \`trackFeatureUsage\`: (featureId: FeatureId, eventType?: string, data?: Record<string, any>) => void

### \`useFeatureToggle(featureId: FeatureId)\`

Hook for conditionally executing code based on feature access.

\`\`\`tsx
const { whenEnabled, hasAccess, trackUsage } = useFeatureToggle(FEATURES.ADVANCED_ANALYTICS);
\`\`\`

**Returns:**
- \`whenEnabled\`: (callback: Function, fallback?: Function) => any
- \`hasAccess\`: boolean
- \`trackUsage\`: (eventType?: string, data?: Record<string, any>) => void

## Components

### \`<FeatureGate>\`

\`\`\`tsx
<FeatureGate 
  feature={FEATURES.ADVANCED_ANALYTICS}
  fallback={<UpgradePrompt />}
  showUpgradePrompt={true}
  trackingEventName="view"
>
  <ProtectedFeature />
</FeatureGate>
\`\`\`

**Props:**
- \`feature\`: FeatureId - The feature ID to check access for
- \`children\`: React.ReactNode - Content to render if access is granted
- \`fallback?\`: React.ReactNode - Optional fallback content
- \`showUpgradePrompt?\`: boolean - Whether to show an upgrade prompt (default: true)
- \`trackingEventName?\`: string - Event name to track (default: "view")

## API Functions

### \`checkFeatureAccess(featureId: FeatureId): Promise<boolean>\`

Checks if the current user has access to a feature.

### \`trackFeatureEvent(featureId: FeatureId, eventType: string, eventData?: object): Promise<void>\`

Tracks a feature-related event.

### \`batchCheckFeatureAccess(featureIds: FeatureId[]): Promise<Record<FeatureId, boolean>>\`

Checks multiple features at once for efficiency.
`;

const securityContent = `
# Security Considerations

The feature access system is designed with security in mind:

## Client-Server Verification

All feature access is verified on both the client and server:

- Client-side checks for UI rendering
- Server-side checks for data operations

## Admin Safeguards

- Admin users have automatic access to all features
- Admin operations are logged for audit

## Protection Mechanisms

- Row Level Security (RLS) policies protect feature configuration data
- Feature access checks are performed in database functions
- Permission checks cascade to data access

## Best Practices

1. Never bypass the feature checking mechanism
2. Use server-side checks for sensitive operations
3. Monitor denied access attempts
4. Regularly audit feature access settings
`;

const monitoringContent = `
# Monitoring and Performance

The feature access system includes built-in monitoring capabilities:

## Performance Metrics

- Average response time for feature checks
- Cache hit rate
- API call volume

## Usage Analytics

- Feature access attempts
- Feature usage rates
- Denied access events

## Dashboard Integration

Performance metrics are integrated with the admin dashboard:

1. Navigate to Admin > Feature Access > Monitoring
2. View real-time performance graphs
3. Export reports for further analysis

## Optimization Tips

- Use batch checks when multiple features need to be checked
- Cache frequently-accessed features
- Preload common features on application startup
`;

const FeatureAccessDocumentationPage: React.FC = () => {
  const { trackPage } = useAnalytics();
  
  useEffect(() => {
    trackPage('admin_feature_access_documentation');
  }, [trackPage]);
  
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Feature Access Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Complete guide to the feature access and gating system
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full border-b p-0 flex justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-b-none">
              <Book className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex items-center gap-2 rounded-b-none">
              <Code className="h-4 w-4" />
              Implementation
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2 rounded-b-none">
              <GitBranch className="h-4 w-4" />
              API Reference
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 rounded-b-none">
              <ShieldCheck className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2 rounded-b-none">
              <LineChart className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Introduction to the feature access system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MarkdownRenderer content={overviewContent} />
                
                <Separator className="my-4" />
                
                <Callout>
                  <div className="text-sm">
                    <strong>Quick Start</strong>: Check the Implementation tab for code examples
                    on how to gate features in your components.
                  </div>
                </Callout>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="implementation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Guide</CardTitle>
                <CardDescription>
                  How to implement feature gating in your components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={implementationContent} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Complete reference for all hooks, components, and functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={apiContent} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Considerations</CardTitle>
                <CardDescription>
                  Security aspects of the feature access system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={securityContent} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring and Performance</CardTitle>
                <CardDescription>
                  Monitoring capabilities and performance considerations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={monitoringContent} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeatureAccessDocumentationPage;
