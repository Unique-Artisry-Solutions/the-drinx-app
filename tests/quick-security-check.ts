#!/usr/bin/env node

/**
 * Quick Security Check Script
 * 
 * Run this for fast security validation before deployments
 * Usage: npx tsx tests/quick-security-check.ts
 */

import { RLSTestHelpers } from './utils/test-helpers';

async function runQuickSecurityCheck() {
  console.log('🔒 Running quick security check...\n');

  try {
    const result = await RLSTestHelpers.quickSecurityCheck();
    
    if (result.passed) {
      console.log('✅ All critical security checks passed!');
      console.log('🛡️ RLS policies are properly configured');
      process.exit(0);
    } else {
      console.log('❌ Security check failed!\n');
      console.log('Critical security issues found:');
      result.errors.forEach(error => console.log(`  ${error}`));
      console.log('\n🚨 DO NOT DEPLOY until these issues are resolved!');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Security check crashed:', error);
    console.log('🚨 Unable to verify security - investigation required!');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runQuickSecurityCheck();
}

export { runQuickSecurityCheck };