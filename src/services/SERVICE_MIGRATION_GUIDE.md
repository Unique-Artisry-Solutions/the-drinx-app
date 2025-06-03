
# Service Migration Guide - Phase 8C Completion

## Overview
Phase 8C has been completed with unified service architecture. All services are now consolidated and accessible through the Service Registry.

## Unified Services

### 1. Analytics Service
**Old imports:**
```typescript
import { getRealTimeMetrics, getEventAnalyticsData } from '@/services/realTimeAnalyticsService';
import { getMobileUsageMetrics } from '@/services/mobileAnalyticsService';
```

**New unified approach:**
```typescript
import { serviceRegistry } from '@/services';
// OR
import { AnalyticsService } from '@/services';

const analytics = serviceRegistry.getService('analytics');
const metrics = await analytics.getRealTimeMetrics();
```

### 2. Event Service
**Old imports:**
```typescript
import { updateEventStatus } from '@/services/eventService';
import { generateEventAccessToken } from '@/services/eventAccessService';
```

**New unified approach:**
```typescript
import { serviceRegistry } from '@/services';
// OR
import { EventService } from '@/services';

const events = serviceRegistry.getService('events');
await events.updateEventStatus(eventId, 'published');
```

### 3. Payment Service
**Old imports:**
```typescript
import { processPayment } from '@/services/paymentService';
import { paymentRetryService } from '@/services/paymentRetryService';
```

**New unified approach:**
```typescript
import { serviceRegistry } from '@/services';
// OR
import { PaymentService } from '@/services';

const payments = serviceRegistry.getService('payments');
await payments.processPayment(request);
```

### 4. Mobile Service
**Old imports:**
```typescript
import { getMobileUsageMetrics, getLocationAnalytics } from '@/services/mobileAnalyticsService';
```

**New unified approach:**
```typescript
import { serviceRegistry } from '@/services';
// OR
import { MobileService } from '@/services';

const mobile = serviceRegistry.getService('mobile');
const metrics = await mobile.getMobileUsageMetrics(promoterId);
```

## Service Registry Features

### Service Discovery
```typescript
import { serviceRegistry } from '@/services';

// Get all analytics services
const analyticsServices = serviceRegistry.getServicesByCategory('analytics');

// Get service metadata
const metadata = serviceRegistry.getServiceMetadata();

// Health check all services
const health = await serviceRegistry.healthCheck();
```

### Runtime Service Switching
```typescript
import { serviceRegistry } from '@/services';

// Switch to a mock service for testing
serviceRegistry.switchService('analytics', MockAnalyticsService);
```

## Migration Steps

1. **Update imports** - Replace individual service imports with unified services
2. **Use Service Registry** - Access services through `serviceRegistry.getService()`
3. **Update health checks** - Use unified health checking
4. **Leverage service discovery** - Use category-based service access
5. **Update tests** - Use service switching for mocking

## Benefits

- **Centralized Management**: All services in one registry
- **Better Testing**: Easy service mocking and switching
- **Health Monitoring**: Unified health checking across all services
- **Service Discovery**: Find and group services by category
- **Dependency Management**: Proper initialization order
- **Runtime Flexibility**: Switch services without code changes

## Backward Compatibility

All old service exports are still available but marked as deprecated. Migration can be done gradually.

## Next Steps

1. Update existing components to use unified services
2. Update hooks to use Service Registry
3. Add service monitoring dashboard
4. Implement service dependency visualization
