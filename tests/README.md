# RLS Security Regression Tests

This directory contains comprehensive Row-Level Security (RLS) regression tests to prevent future "oops, we exposed everything" security incidents.

## What These Tests Do

The RLS test suite validates:

### 🔒 Anonymous Access Restrictions
- Anon users cannot read sensitive tables (`profiles`, `payment_audit_logs`, etc.)
- Anon users cannot perform write operations
- Only public data is accessible without authentication

### 👥 User Data Isolation  
- User A can only access User A's data
- User A cannot read/modify User B's data
- Financial and reward transactions are properly isolated

### 🛡️ Admin-Only Protection
- Payment audit logs require admin access
- Security event logs are admin-only
- System settings modifications are restricted

### 📊 Materialized View Security
- Direct materialized view access is denied
- Analytics functions require proper authorization
- Sensitive aggregated data is protected

### 🔧 RPC Function Security
- Admin-only functions reject non-admin users
- User-scoped functions work appropriately
- No privilege escalation possible

## Running the Tests

```bash
# Run all RLS tests
npm run test:rls

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Structure

- `tests/rls.spec.ts` - Main RLS security test suite
- `tests/setup.ts` - Global test configuration
- `.github/workflows/rls-tests.yml` - CI/CD integration

## Key Security Principles Tested

1. **Defense in Depth**: Multiple layers of security controls
2. **Principle of Least Privilege**: Users only access what they need
3. **Data Isolation**: User data is properly segregated
4. **Admin Segregation**: Administrative functions are properly gated
5. **API Surface Security**: Internal tables/views are not exposed

## Failure Scenarios

Tests will fail if:
- RLS policies are accidentally disabled
- Policies are weakened (e.g., changing `user_id = auth.uid()` to `true`)
- Materialized views are exposed via API
- Admin-only functions become accessible to regular users
- Cross-user data leakage occurs

## CI/CD Integration

- Tests run automatically on PRs touching migrations or security-related code
- Failed security tests block PR merges
- Security audit runs alongside RLS tests
- Test results are reported in PR comments

## Adding New Security Tests

When adding new tables or features:

1. Add RLS policy validation to `rls.spec.ts`
2. Test both positive and negative access scenarios  
3. Verify admin vs. user access patterns
4. Include edge function security if applicable
5. Update this README with new test coverage

## Security Best Practices Enforced

- ✅ All user tables have RLS enabled
- ✅ Views use `security_invoker` mode
- ✅ Functions use `SECURITY DEFINER` with proper `search_path`
- ✅ Materialized views are in private schema
- ✅ Admin functions check `is_admin()` or equivalent
- ✅ Edge functions require authentication
- ✅ No direct SQL injection vectors

## Troubleshooting

If tests fail:

1. Check RLS policies on affected tables
2. Verify admin user setup in test environment
3. Ensure materialized views are properly secured
4. Review recent migration changes
5. Check for SQL injection vulnerabilities

Remember: **Security tests failing is a feature, not a bug!** They're designed to catch security regressions before they reach production.