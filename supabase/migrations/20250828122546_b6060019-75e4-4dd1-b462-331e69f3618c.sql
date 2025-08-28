-- Enable RLS on financial_transactions table
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Admins have full access to transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Service can manage transactions" ON public.financial_transactions;

-- Policy for users to view their own financial transactions
CREATE POLICY "Users can view own transactions" 
ON public.financial_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to update their own financial transactions
CREATE POLICY "Users can update own transactions" 
ON public.financial_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to insert their own financial transactions
CREATE POLICY "Users can insert own transactions" 
ON public.financial_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own financial transactions (if needed)
CREATE POLICY "Users can delete own transactions" 
ON public.financial_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policy for admins to have full access to all financial transactions
CREATE POLICY "Admins have full access to transactions" 
ON public.financial_transactions 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Additional policy for admin inserts with proper check
CREATE POLICY "Admins can insert any transaction" 
ON public.financial_transactions 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Allow service role for system operations (payments, refunds, etc.)
CREATE POLICY "Service can manage transactions" 
ON public.financial_transactions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Additional service role insert policy
CREATE POLICY "Service can insert transactions" 
ON public.financial_transactions 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');