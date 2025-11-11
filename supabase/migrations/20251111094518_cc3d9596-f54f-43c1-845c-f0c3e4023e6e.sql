-- Security Fix: Restrict public access to sensitive data
-- This migration fixes critical security vulnerabilities by removing public access to customer data

-- 1. Fix clients table - Remove public SELECT policy and restrict to authenticated users
DROP POLICY IF EXISTS "Quote system can check duplicates" ON public.clients;

-- Keep the public INSERT policy for quote form submissions  
-- (This allows new quotes to create clients, but doesn't expose existing client data)

-- Add a policy for authenticated users to view only their own data (already exists)
-- The existing "Users view own data" policy is sufficient for authenticated access

-- 2. Fix devis table - Remove public SELECT policy and restrict to authenticated users
DROP POLICY IF EXISTS "Public can view devis" ON public.devis;

-- Keep the public INSERT policy for quote form submissions
-- (This allows customers to submit quotes, but doesn't expose existing quotes)

-- Add policies for authenticated users to view their own quotes (already exists)
-- The existing "Users view own data" and "Users can view own quotes" policies are sufficient

-- 3. Add secure duplicate checking function for clients
-- This allows the quote system to check for duplicates without exposing all client data
CREATE OR REPLACE FUNCTION public.check_client_exists(
  _email TEXT,
  _mobile TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clients
    WHERE email = _email OR mobile = _mobile
  );
$$;

-- IMPORTANT: After this migration is applied, you MUST implement authentication
-- for the application to work properly. Without authentication:
-- - Customers won't be able to view their submitted quotes
-- - Technicians won't be able to access the admin dashboard
-- - The RLS policies checking auth.jwt() will deny all access

-- The public INSERT policies remain in place to allow:
-- - Quote form submissions from unauthenticated customers
-- - Client data creation during quote submission

COMMENT ON FUNCTION public.check_client_exists IS 'Securely checks if a client exists without exposing client data. Used by the quote form to prevent duplicates.';
