-- Enable RLS on payment_transactions table
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can update own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can insert own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can delete own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins have full access to payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can insert any payment transaction" ON public.payment_transactions;
DROP POLICY IF EXISTS "Service can manage payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Service can insert payment transactions" ON public.payment_transactions;

-- Policy for users to view their own payment transactions
CREATE POLICY "Users can view own payment transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to update their own payment transactions
CREATE POLICY "Users can update own payment transactions" 
ON public.payment_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to insert their own payment transactions
CREATE POLICY "Users can insert own payment transactions" 
ON public.payment_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own payment transactions (if needed)
CREATE POLICY "Users can delete own payment transactions" 
ON public.payment_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policy for admins to have full access to all payment transactions
CREATE POLICY "Admins have full access to payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Additional policy for admin inserts with proper check
CREATE POLICY "Admins can insert any payment transaction" 
ON public.payment_transactions 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Allow service role for system operations (payments, refunds, etc.)
CREATE POLICY "Service can manage payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Additional service role insert policy
CREATE POLICY "Service can insert payment transactions" 
ON public.payment_transactions 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');