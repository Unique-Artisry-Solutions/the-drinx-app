-- Tighten financial_transactions table security
-- Users should only see their own transactions, not everyone's

-- Enable Row Level Security on financial_transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Revoke all access from anon role (they shouldn't see financial data)
REVOKE ALL ON TABLE public.financial_transactions FROM anon;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS ft_select_self ON public.financial_transactions;
DROP POLICY IF EXISTS ft_insert_service ON public.financial_transactions;
DROP POLICY IF EXISTS ft_update_service ON public.financial_transactions;

-- Create policy for SELECT: users can only see their own transactions, admins can see all
CREATE POLICY ft_select_self ON public.financial_transactions
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Create policy for INSERT: only service role can insert financial transactions
CREATE POLICY ft_insert_service ON public.financial_transactions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create policy for UPDATE: only service role and admins can update financial transactions
CREATE POLICY ft_update_service ON public.financial_transactions
  FOR UPDATE USING (auth.role() = 'service_role' OR public.is_admin(auth.uid()));

-- Grant authenticated users access to the table (access controlled by RLS policies)
GRANT SELECT ON public.financial_transactions TO authenticated;

-- Create a masked view for user-friendly transaction access
DROP VIEW IF EXISTS public.financial_transactions_my_v;
CREATE VIEW public.financial_transactions_my_v
  WITH (security_invoker = true) AS
SELECT
  id,
  user_id,
  created_at,
  status,
  amount,
  currency,
  transaction_type,
  fee_amount,
  tax_amount,
  net_amount,
  provider,
  reconciled,
  reconciled_at,
  -- Mask sensitive provider transaction ID (show only first 6 chars + ellipsis)
  CASE 
    WHEN provider_transaction_id IS NOT NULL AND length(provider_transaction_id) > 6 THEN
      left(provider_transaction_id, 6) || '…'
    ELSE provider_transaction_id
  END as provider_transaction_id_sample,
  -- Include metadata but remove potentially sensitive fields
  CASE 
    WHEN metadata IS NOT NULL THEN
      metadata - 'stripe_payment_intent_id' - 'customer_id' - 'payment_method_details' - 'internal_ref'
    ELSE metadata
  END as metadata_safe
FROM public.financial_transactions
WHERE user_id = auth.uid();

-- Grant authenticated users access to the masked view
GRANT SELECT ON public.financial_transactions_my_v TO authenticated;

-- Add comments explaining the security model
COMMENT ON TABLE public.financial_transactions IS 'Financial transactions with RLS - users can only see their own transactions, service role can insert/update, admins have full access';
COMMENT ON VIEW public.financial_transactions_my_v IS 'User-friendly masked view of financial transactions showing only user''s own transactions with sensitive data masked';