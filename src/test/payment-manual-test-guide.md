# Payment Flow Manual Testing Guide

## Prerequisites
- Stripe test account with secret key configured
- Valid Supabase project with payment tables
- Authentication working (user must be logged in)

## Test Cards (Stripe Test Mode)
```
Success: 4242424242424242
Declined: 4000000000000002
Requires Authentication: 4000002500003155
Insufficient Funds: 4000000000009995
Processing Error: 4000000000000119
```

## Manual Test Scenarios

### 1. Successful Payment Flow
**Steps:**
1. Navigate to checkout/payment page
2. Enter test card: `4242424242424242`
3. Use any future expiry date (e.g., 12/25)
4. Use any 3-digit CVC (e.g., 123)
5. Submit payment

**Expected Results:**
- Payment form validates card input
- Payment method created successfully
- Edge function processes payment
- Database records transaction
- Receipt generated
- Success confirmation displayed

**Verification:**
```sql
-- Check transaction was recorded
SELECT * FROM payment_transactions 
WHERE user_id = '[current_user_id]' 
ORDER BY created_at DESC LIMIT 1;

-- Check receipt was generated
SELECT * FROM payment_receipts 
WHERE transaction_id = '[transaction_id]';
```

### 2. Card Declined Scenario
**Steps:**
1. Use declined test card: `4000000000000002`
2. Complete payment form
3. Submit payment

**Expected Results:**
- Stripe returns decline error
- No transaction recorded in database
- User sees appropriate error message
- No partial charges created

### 3. Authentication Required
**Steps:**
1. Use test card: `4000002500003155`
2. Complete payment form
3. Submit payment
4. Handle 3D Secure challenge

**Expected Results:**
- Payment requires additional authentication
- User redirected to 3D Secure flow
- Payment completes after authentication
- Transaction recorded correctly

### 4. Invalid Payment Method
**Steps:**
1. Use invalid card number: `4000000000000010`
2. Submit payment

**Expected Results:**
- Card validation fails
- Appropriate error message displayed
- No payment attempt made
- No database records created

### 5. Database Error Simulation
**Steps:**
1. Temporarily remove database write permissions
2. Process successful payment with test card
3. Restore permissions

**Expected Results:**
- Payment succeeds with Stripe
- Database write fails
- Critical error logged
- User notified of issue
- Manual reconciliation process triggered

## Edge Function Testing

### Direct Function Calls
```javascript
// Test successful payment
const response = await supabase.functions.invoke('process-payment', {
  body: {
    paymentMethodId: 'pm_card_visa',
    amount: 5000,
    currency: 'usd',
    description: 'Test payment',
    metadata: { testCase: 'manual_test' }
  }
});

console.log('Payment response:', response);
```

### Error Scenarios
```javascript
// Test invalid payment method
const errorResponse = await supabase.functions.invoke('process-payment', {
  body: {
    paymentMethodId: 'pm_invalid',
    amount: 5000
  }
});

// Test missing required fields
const incompleteResponse = await supabase.functions.invoke('process-payment', {
  body: {
    amount: 1000
    // Missing paymentMethodId
  }
});
```

## Component Testing

### CheckoutPaymentForm
1. **Loading State**: Verify skeleton displays while Stripe loads
2. **Card Input**: Test card number, expiry, CVC validation
3. **Error Display**: Confirm errors show appropriately
4. **Payment Method Creation**: Verify callback fired when card complete

### PaymentService
1. **Authentication Check**: Verify user login requirement
2. **Error Handling**: Test edge function error propagation
3. **Response Processing**: Confirm correct response formatting

## Database Verification

### Check Transaction Records
```sql
-- Recent transactions
SELECT 
  id,
  user_id,
  amount,
  currency,
  status,
  provider_transaction_id,
  created_at
FROM payment_transactions
ORDER BY created_at DESC
LIMIT 10;
```

### Verify Receipt Generation
```sql
-- Receipts for recent transactions
SELECT 
  t.id as transaction_id,
  t.amount,
  t.status,
  r.receipt_number,
  r.created_at as receipt_created
FROM payment_transactions t
LEFT JOIN payment_receipts r ON t.id = r.transaction_id
WHERE t.created_at > NOW() - INTERVAL '1 hour'
ORDER BY t.created_at DESC;
```

### Check RLS Policies
```sql
-- Test user can only see own transactions
-- (Run as different users to verify isolation)
SELECT COUNT(*) FROM payment_transactions;
```

## Performance Testing

### Response Times
- Payment form load: < 2 seconds
- Card validation: < 500ms
- Payment processing: < 5 seconds
- Database operations: < 1 second

### Load Testing
1. Multiple concurrent payments
2. Large transaction amounts
3. Rapid successive payments
4. Network interruption scenarios

## Troubleshooting Checklist

### Payment Fails
- [ ] Stripe secret key configured correctly
- [ ] User authenticated
- [ ] Test card valid
- [ ] Network connectivity
- [ ] Database accessible

### Database Issues
- [ ] Tables exist and accessible
- [ ] RLS policies configured
- [ ] User permissions correct
- [ ] Foreign key constraints satisfied

### Component Issues
- [ ] Stripe context initialized
- [ ] Card element renders
- [ ] Event handlers attached
- [ ] Error boundaries working

## Security Validation

### Data Protection
- [ ] Payment data encrypted
- [ ] PCI compliance maintained
- [ ] No sensitive data logged
- [ ] Secure error messages

### Access Control
- [ ] User authentication required
- [ ] RLS policies enforced
- [ ] API endpoints protected
- [ ] Cross-user data isolation