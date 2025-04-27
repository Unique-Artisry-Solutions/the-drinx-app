
# Rewards System API Documentation

## Overview
The rewards system API provides endpoints for managing user reward points, tiers, and redemptions. All operations are performed through the `rewardsApi` object.

## Core Operations

### Get User Reward Profile
```typescript
getUserRewardProfile(userId: string): Promise<UserRewardProfile | null>
```
Retrieves a user's complete reward profile including points, tier, and transaction history.

**Parameters:**
- `userId`: string - The unique identifier of the user

**Returns:**
- `UserRewardProfile` object containing:
  - points: Current point balance
  - lifetimePoints: Total points earned
  - currentTier: Current reward tier information
  - availableRewards: List of rewards that can be redeemed
  - transactionHistory: Recent point transactions
  - redemptionHistory: Recent reward redemptions

**Cache behavior:**
- Results are cached for 300 seconds (5 minutes)
- Cache is automatically invalidated on point updates

### Add Points
```typescript
addPoints(userId: string, points: number, source: string, metadata?: any): Promise<RewardOperationResponse>
```
Adds (or subtracts) points from a user's balance.

**Parameters:**
- `userId`: string - The unique identifier of the user
- `points`: number - Amount of points (negative for deduction)
- `source`: string - Source of the points (e.g., 'purchase', 'review')
- `metadata`: object (optional) - Additional contextual data

**Returns:**
- `RewardOperationResponse` with success/error information

### Batch Update Points
```typescript
batchUpdatePoints(operations: Array<{ userId: string; points: number; source: string; metadata?: any }>): Promise<Array<RewardOperationResponse>>
```
Updates points for multiple users in a single operation.

**Parameters:**
- `operations`: Array of point update operations

**Returns:**
- Array of `RewardOperationResponse` objects, one per operation

### Redeem Reward
```typescript
redeemReward(userId: string, offeringId: string): Promise<RewardOperationResponse>
```
Attempts to redeem a reward for a user.

**Parameters:**
- `userId`: string - The unique identifier of the user
- `offeringId`: string - The identifier of the reward being redeemed

**Returns:**
- `RewardOperationResponse` indicating success or failure

### System Status
```typescript
isRewardsEnabled(): Promise<boolean>
```
Checks if the rewards system is currently enabled.

**Returns:**
- Boolean indicating system availability

### Analytics
```typescript
getRewardAnalytics(): Promise<RewardAnalytics>
```
Retrieves analytics data for the rewards system.

**Returns:**
- `RewardAnalytics` object with system-wide metrics

### Event Tracking
```typescript
trackRewardEvent(eventType: string, userId: string, eventData?: Record<string, any>): Promise<boolean>
```
Tracks reward-related events for analytics.

**Parameters:**
- `eventType`: string - Type of event
- `userId`: string - The user associated with the event
- `eventData`: object (optional) - Additional event data

**Returns:**
- Boolean indicating if event was tracked successfully

## Error Handling

All API methods include error handling and will:
- Log errors to the console
- Return appropriate error responses
- Never throw unhandled exceptions

## Types

### UserRewardProfile
```typescript
interface UserRewardProfile {
  points: number;
  lifetimePoints: number;
  currentTier: RewardTier | null;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardRedemption[];
}
```

### RewardOperationResponse
```typescript
interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

## Performance Considerations

- User profiles are cached for 5 minutes
- Batch operations should be used for updating multiple users
- Analytics queries use materialized views for performance
- System health is monitored and logged

## Security

- All operations require authentication
- Row Level Security (RLS) policies enforce data access
- Points cannot go below zero
- All operations are tracked for audit purposes

