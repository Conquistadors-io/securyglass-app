-- Supprimer les anciennes politiques RESTRICTIVE
DROP POLICY IF EXISTS "Admins can manage all quotes" ON public.devis;
DROP POLICY IF EXISTS "Enable insert for public quotes" ON public.devis;
DROP POLICY IF EXISTS "Users can update own quotes" ON public.devis;
DROP POLICY IF EXISTS "Users can view own quotes" ON public.devis;

-- Recréer en mode PERMISSIVE (par défaut)

-- 1. Admin peut tout gérer
CREATE POLICY "Admins can manage all quotes"
ON public.devis
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Insertion publique pour les devis en ligne (PERMISSIVE pour les anonymes)
CREATE POLICY "Enable insert for public quotes"
ON public.devis
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'draft' 
  AND source = 'online' 
  AND client_email IS NOT NULL
);

-- 3. Les utilisateurs peuvent modifier leurs propres devis
CREATE POLICY "Users can update own quotes"
ON public.devis
FOR UPDATE
TO authenticated
USING (client_email = (auth.jwt() ->> 'email'))
WITH CHECK (client_email = (auth.jwt() ->> 'email'));

-- 4. Les utilisateurs peuvent voir leurs propres devis
CREATE POLICY "Users can view own quotes"
ON public.devis
FOR SELECT
TO authenticated
USING (client_email = (auth.jwt() ->> 'email'));

-- 5. Rendre le bucket quote-pdfs public pour éviter les erreurs 401
UPDATE storage.buckets 
SET public = true 
WHERE name = 'quote-pdfs';