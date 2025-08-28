
-- Fix RLS policies by making them permissive for anon/authenticated

-- 1) Clients: drop existing restrictive policies
DROP POLICY IF EXISTS "Public can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Public can update clients" ON public.clients;

-- Recreate as permissive
CREATE POLICY "Public can insert clients"
ON public.clients
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can update clients"
ON public.clients
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 2) Devis: drop existing restrictive policy
DROP POLICY IF EXISTS "Public can insert devis" ON public.devis;

-- Recreate as permissive
CREATE POLICY "Public can insert devis"
ON public.devis
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
