import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dvifibvzwunnpcsihpxq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA";

/**
 * Test utilities for RLS security testing
 */
export class RLSTestHelpers {
  /**
   * Quick security check - validates most critical RLS policies
   * Use this for fast smoke tests before deploying
   */
  static async quickSecurityCheck(): Promise<{ passed: boolean; errors: string[] }> {
    const errors: string[] = [];
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Critical tables that must be protected
    const criticalTables = [
      'profiles',
      'payment_audit_logs', 
      'security_event_logs',
      'financial_transactions',
      'device_fingerprints'
    ];

    // Test anon access to critical tables
    for (const table of criticalTables) {
      try {
        const { data, error } = await anonClient
          .from(table)
          .select('id')
          .limit(1);

        if (!error || data !== null) {
          errors.push(`❌ CRITICAL: Anonymous access to ${table} is not blocked!`);
        }
      } catch (err) {
        console.warn(`Error testing ${table}:`, err);
      }
    }

    // Test materialized view exposure
    try {
      const { data, error } = await anonClient
        .from('reward_analytics_materialized')
        .select('*')
        .limit(1);

      if (!error || data !== null) {
        errors.push('❌ CRITICAL: Materialized view reward_analytics_materialized is exposed!');
      }
    } catch (err) {
      // Expected - materialized view should not be accessible
    }

    // Test admin function protection
    try {
      const { data, error } = await anonClient
        .rpc('get_reward_analytics');

      if (!error || data !== null) {
        errors.push('❌ CRITICAL: Admin function get_reward_analytics is accessible to anon!');
      }
    } catch (err) {
      // Expected - admin functions should be protected
    }

    return {
      passed: errors.length === 0,
      errors
    };
  }

  /**
   * Create a test user for testing purposes
   */
  static async createTestUser(email: string, password: string) {
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await anonClient.auth.signUp({
      email,
      password,
    });

    if (error && !error.message.includes('already registered')) {
      throw error;
    }

    return data.user;
  }

  /**
   * Create an authenticated client for a specific user
   */
  static async createAuthenticatedClient(email: string, password: string) {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return client;
  }

  /**
   * Validate that a table has proper RLS policies
   */
  static async validateTableRLS(tableName: string): Promise<boolean> {
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Anon should not be able to read the table
    const { data: selectData, error: selectError } = await anonClient
      .from(tableName)
      .select('*')
      .limit(1);

    // Anon should not be able to insert into the table
    const { error: insertError } = await anonClient
      .from(tableName)
      .insert({});

    // Both operations should fail for protected tables
    return !!selectError && !!insertError && selectData === null;
  }

  /**
   * Test for SQL injection vulnerabilities in queries
   */
  static async testSQLInjectionResistance(tableName: string): Promise<boolean> {
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const maliciousInputs = [
      "'; DROP TABLE profiles; --",
      "1' OR '1'='1",
      "admin'; --",
      "1 UNION SELECT * FROM auth.users --",
    ];

    for (const maliciousInput of maliciousInputs) {
      try {
        // Test various query methods with malicious input
        const { data, error } = await anonClient
          .from(tableName)
          .select('*')
          .eq('id', maliciousInput)
          .limit(1);

        // Should not return unexpected data or cause system errors
        if (data && data.length > 1) {
          console.warn(`⚠️ Suspicious query result for input: ${maliciousInput}`);
          return false;
        }

        // Check for SQL syntax errors that might indicate injection
        if (error?.message.includes('syntax error')) {
          console.warn(`⚠️ SQL injection might be possible: ${error.message}`);
          return false;
        }
      } catch (err) {
        console.warn(`Error during SQL injection test:`, err);
      }
    }

    return true;
  }

  /**
   * Cleanup test data
   */
  static async cleanupTestData(userIds: string[] = []): Promise<void> {
    // In a real implementation, this would clean up test users and data
    // For now, we'll just log the cleanup intention
    console.log(`🧹 Cleaning up test data for ${userIds.length} users`);
  }
}