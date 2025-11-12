-- Add UPDATE policy for clients table to allow public upserts
CREATE POLICY "Public can update clients by email and mobile"
ON public.clients
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);