-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public insert for quotes" ON public.devis;
DROP POLICY IF EXISTS "Quote system can insert" ON public.clients;
DROP POLICY IF EXISTS "Public can update clients by email and mobile" ON public.clients;

-- Create new PERMISSIVE policies for devis
CREATE POLICY "Allow public insert for quotes" 
ON public.devis
FOR INSERT 
TO public
WITH CHECK (true);

-- Create new PERMISSIVE policies for clients
CREATE POLICY "Quote system can insert" 
ON public.clients
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Public can update clients by email and mobile" 
ON public.clients
FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);