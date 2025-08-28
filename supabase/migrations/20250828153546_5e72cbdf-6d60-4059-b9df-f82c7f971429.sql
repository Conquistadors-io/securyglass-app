-- Add missing SELECT policies for clients and devis tables

-- Add SELECT policy for clients table
CREATE POLICY "Public can view clients"
ON public.clients
FOR SELECT
TO anon, authenticated
USING (true);

-- Add SELECT policy for devis table  
CREATE POLICY "Public can view devis"
ON public.devis
FOR SELECT
TO anon, authenticated
USING (true);