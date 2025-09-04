-- Fix the INSERT policy for clients table to allow quote system insertions
DROP POLICY IF EXISTS "Quote system can insert" ON public.clients;

CREATE POLICY "Quote system can insert" 
ON public.clients 
FOR INSERT 
WITH CHECK (true);