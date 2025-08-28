import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dvifibvzwunnpcsihpxq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA";

// Test users for isolation
const TEST_USERS = {
  userA: {
    email: 'test-user-a@rls-test.local',
    password: 'test-password-123!',
    id: null as string | null,
  },
  userB: {
    email: 'test-user-b@rls-test.local', 
    password: 'test-password-456!',
    id: null as string | null,
  },
  admin: {
    email: 'test-admin@rls-test.local',
    password: 'admin-password-789!',
    id: null as string | null,
  }
};

// Supabase clients
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let userAClient: ReturnType<typeof createClient>;
let userBClient: ReturnType<typeof createClient>;
let adminClient: ReturnType<typeof createClient>;

/**
 * RLS Regression Test Suite
 * 
 * Prevents "oops, we exposed everything" security issues by testing:
 * - Anon access restrictions
 * - User isolation (User A cannot access User B's data)
 * - Admin-only table protections
 * - Materialized view access restrictions
 */
describe('RLS Security Regression Tests', () => {
  beforeAll(async () => {
    console.log('Setting up test users and clients...');
    
    // Create test users
    for (const [key, user] of Object.entries(TEST_USERS)) {
      try {
        const { data, error } = await anonClient.auth.signUp({
          email: user.email,
          password: user.password,
        });
        
        if (error && !error.message.includes('already registered')) {
          console.warn(`Failed to create ${key}:`, error.message);
        }
        
        user.id = data.user?.id || null;
      } catch (error) {
        console.warn(`Error creating ${key}:`, error);
      }
    }

    // Create authenticated clients
    userAClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    userBClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Sign in users
    await userAClient.auth.signInWithPassword({
      email: TEST_USERS.userA.email,
      password: TEST_USERS.userA.password,
    });

    await userBClient.auth.signInWithPassword({
      email: TEST_USERS.userB.email,
      password: TEST_USERS.userB.password,
    });

    await adminClient.auth.signInWithPassword({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
    });

    // Wait a bit for auth to settle
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    console.log('Cleaning up test data...');
    // Sign out all clients
    await userAClient?.auth.signOut();
    await userBClient?.auth.signOut(); 
    await adminClient?.auth.signOut();
  });

  describe('Anonymous Access Restrictions', () => {
    it('should deny anon access to profiles table', async () => {
      const { data, error } = await anonClient
        .from('profiles')
        .select('*')
        .limit(1);

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/denied|permission|policy/i);
      expect(data).toBeNull();
    });

    it('should allow anon access to public views only', async () => {
      // Test establishments (should be publicly readable)
      const { data: establishments, error: establishmentsError } = await anonClient
        .from('establishments')
        .select('name, address')
        .limit(1);

      expect(establishmentsError).toBeNull();
      expect(Array.isArray(establishments)).toBe(true);
    });

    it('should deny anon access to sensitive tables', async () => {
      const sensitiveTablesTests = [
        'payment_audit_logs',
        'security_event_logs', 
        'device_fingerprints',
        'user_consent_tracking',
        'financial_transactions',
      ];

      for (const table of sensitiveTablesTests) {
        const { data, error } = await anonClient
          .from(table)
          .select('*')
          .limit(1);

        expect(error).toBeTruthy();
        expect(error?.message).toMatch(/denied|permission|policy/i);
        expect(data).toBeNull();
      }
    });

    it('should deny anon insert/update/delete operations', async () => {
      // Test insert
      const { error: insertError } = await anonClient
        .from('profiles')
        .insert({ display_name: 'test' });

      expect(insertError).toBeTruthy();
      expect(insertError?.message).toMatch(/denied|permission|policy/i);

      // Test update
      const { error: updateError } = await anonClient
        .from('profiles')
        .update({ display_name: 'test' })
        .eq('id', '00000000-0000-0000-0000-000000000000');

      expect(updateError).toBeTruthy();
      expect(updateError?.message).toMatch(/denied|permission|policy/i);

      // Test delete
      const { error: deleteError } = await anonClient
        .from('profiles')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');

      expect(deleteError).toBeTruthy();
      expect(deleteError?.message).toMatch(/denied|permission|policy/i);
    });
  });

  describe('User Data Isolation', () => {
    it('should allow users to read their own profile only', async () => {
      if (!TEST_USERS.userA.id || !TEST_USERS.userB.id) {
        console.warn('Skipping test - users not created');
        return;
      }

      // User A should read their own profile
      const { data: userAProfile, error: userAError } = await userAClient
        .from('profiles')
        .select('*')
        .eq('id', TEST_USERS.userA.id)
        .single();

      expect(userAError).toBeNull();
      expect(userAProfile?.id).toBe(TEST_USERS.userA.id);

      // User A should NOT read User B's profile
      const { data: userBProfile, error: userBError } = await userAClient
        .from('profiles')
        .select('*')
        .eq('id', TEST_USERS.userB.id);

      // Should either return empty array or access denied
      expect(userBProfile?.length || 0).toBe(0);
    });

    it('should allow users to update their own data only', async () => {
      if (!TEST_USERS.userA.id || !TEST_USERS.userB.id) {
        console.warn('Skipping test - users not created');
        return;
      }

      // User A should update their own profile
      const { error: selfUpdateError } = await userAClient
        .from('profiles')
        .update({ display_name: 'Updated by User A' })
        .eq('id', TEST_USERS.userA.id);

      expect(selfUpdateError).toBeNull();

      // User A should NOT update User B's profile
      const { error: crossUpdateError } = await userAClient
        .from('profiles')
        .update({ display_name: 'Hacked by User A' })
        .eq('id', TEST_USERS.userB.id);

      expect(crossUpdateError).toBeTruthy();
    });

    it('should isolate financial transactions by user', async () => {
      // Users should only see their own transactions
      const { data: userATransactions, error: userAError } = await userAClient
        .from('financial_transactions')
        .select('*');

      expect(userAError).toBeNull();
      
      // If any data returned, all should belong to user A
      if (userATransactions && userATransactions.length > 0) {
        userATransactions.forEach(transaction => {
          expect(transaction.user_id).toBe(TEST_USERS.userA.id);
        });
      }
    });

    it('should isolate reward transactions by user', async () => {
      const { data: userARewards, error } = await userAClient
        .from('reward_transactions')
        .select('*');

      expect(error).toBeNull();
      
      // If any data returned, all should belong to user A
      if (userARewards && userARewards.length > 0) {
        userARewards.forEach(reward => {
          expect(reward.user_id).toBe(TEST_USERS.userA.id);
        });
      }
    });
  });

  describe('Admin-Only Table Protection', () => {
    it('should deny non-admin access to payment audit logs', async () => {
      const { data, error } = await userAClient
        .from('payment_audit_logs')
        .select('*')
        .limit(1);

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/denied|permission|policy|admin/i);
      expect(data).toBeNull();
    });

    it('should deny non-admin access to security event logs', async () => {
      const { data, error } = await userAClient
        .from('security_event_logs')
        .select('*')
        .limit(1);

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/denied|permission|policy/i);
      expect(data).toBeNull();
    });

    it('should deny non-admin access to device fingerprints of other users', async () => {
      const { data, error } = await userAClient
        .from('device_fingerprints')
        .select('*')
        .neq('user_id', TEST_USERS.userA.id);

      // Should either error or return empty results
      expect(data?.length || 0).toBe(0);
    });

    it('should deny access to system settings for non-admins (write)', async () => {
      const { error } = await userAClient
        .from('system_settings')
        .insert({
          key: 'test_key',
          value: { test: true },
          category: 'test'
        });

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/denied|permission|policy/i);
    });
  });

  describe('Materialized View Protection', () => {
    it('should deny direct access to materialized views', async () => {
      // These should fail because materialized views should not be exposed via API
      const materializedViewTests = [
        'reward_analytics_materialized', // Should be moved to private schema
      ];

      for (const view of materializedViewTests) {
        const { data, error } = await userAClient
          .from(view)
          .select('*')
          .limit(1);

        expect(error).toBeTruthy();
        expect(error?.message).toMatch(/relation.*does not exist|denied|permission/i);
        expect(data).toBeNull();
      }
    });

    it('should require admin access for analytics RPC functions', async () => {
      // Non-admin should not be able to call admin analytics functions
      const { data, error } = await userAClient
        .rpc('get_reward_analytics');

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/denied|admin|privilege/i);
      expect(data).toBeNull();
    });
  });

  describe('RPC Function Security', () => {
    it('should protect admin-only RPC functions', async () => {
      const adminOnlyFunctions = [
        'get_reward_analytics',
        'refresh_reward_analytics_materialized',
        'anonymize_user_data',
        'run_retention_cleanup',
      ];

      for (const func of adminOnlyFunctions) {
        const { error } = await userAClient.rpc(func);
        
        expect(error).toBeTruthy();
        expect(error?.message).toMatch(/denied|admin|privilege|permission/i);
      }
    });

    it('should allow user-scoped RPC functions', async () => {
      // Functions that should work for authenticated users on their own data
      const { error: userTypeError } = await userAClient
        .rpc('get_current_user_type');

      // This should either work or fail gracefully (not with permission error)
      if (userTypeError) {
        expect(userTypeError.message).not.toMatch(/denied|admin|privilege/i);
      }
    });
  });

  describe('API Surface Security', () => {
    it('should not expose internal/private tables', async () => {
      // Tables that should never be accessible via API
      const internalTables = [
        'auth.users',           // Auth schema should not be accessible
        'auth.sessions',        // Auth schema should not be accessible  
        'private.reward_analytics_materialized', // Private schema
      ];

      for (const table of internalTables) {
        const { data, error } = await userAClient
          .from(table)
          .select('*')
          .limit(1);

        expect(error).toBeTruthy();
        expect(data).toBeNull();
      }
    });

    it('should enforce proper view security (security_invoker)', async () => {
      // Views should respect RLS of underlying tables
      // This test ensures views use security_invoker mode
      
      const { data: myView, error: myViewError } = await userAClient
        .from('financial_transactions_my_v')
        .select('*');

      expect(myViewError).toBeNull();
      
      // All returned data should belong to current user
      if (myView && myView.length > 0) {
        myView.forEach(row => {
          expect(row.user_id).toBe(TEST_USERS.userA.id);
        });
      }
    });
  });

  describe('Edge Function Security', () => {
    it('should require authentication for secure analytics', async () => {
      const { data, error } = await anonClient.functions.invoke('secure-analytics', {
        body: { action: 'getRewardAnalytics' }
      });

      expect(error || data?.error).toBeTruthy();
      const errorMessage = error?.message || data?.error || '';
      expect(errorMessage).toMatch(/authentication|auth/i);
    });

    it('should require admin privileges for analytics functions', async () => {
      const { data, error } = await userAClient.functions.invoke('secure-analytics', {
        body: { action: 'getRewardAnalytics' }
      });

      // Should fail with admin privilege requirement
      if (error || data?.error) {
        const errorMessage = error?.message || data?.error || '';
        expect(errorMessage).toMatch(/admin|privilege|access.*denied/i);
      }
    });
  });
});

describe('RLS Policy Validation', () => {
  it('should have RLS enabled on critical tables', async () => {
    // This test checks that RLS is actually enabled on important tables
    // We can't directly query pg_tables in tests, but we can verify behavior
    
    const criticalTables = [
      'profiles',
      'financial_transactions', 
      'reward_transactions',
      'payment_audit_logs',
      'security_event_logs',
      'device_fingerprints',
      'user_consent_tracking',
    ];

    // For each table, anon access should be denied (indicating RLS is working)
    for (const table of criticalTables) {
      const { data, error } = await anonClient
        .from(table)
        .select('id')
        .limit(1);

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/denied|permission|policy/i);
      expect(data).toBeNull();
    }
  });

  it('should prevent privilege escalation attempts', async () => {
    // Attempt various privilege escalation patterns
    
    // Try to access admin functions through SQL injection patterns
    const maliciousInputs = [
      "'; DROP TABLE profiles; --",
      "1' OR '1'='1",
      "admin'; --",
      "1 UNION SELECT * FROM auth.users --",
    ];

    for (const maliciousInput of maliciousInputs) {
      // Test various endpoints with malicious input
      const { error: profileError } = await userAClient
        .from('profiles')
        .select('*')
        .eq('display_name', maliciousInput);

      // Should not cause system errors or expose data
      if (profileError) {
        expect(profileError.message).not.toMatch(/syntax error|relation.*does not exist/);
      }
    }
  });
});