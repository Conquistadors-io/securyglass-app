-- Supprimer l'ancienne policy qui ne fonctionne pas
DROP POLICY IF EXISTS "Allow public insert for quotes" ON public.devis;

-- Créer une nouvelle policy pour permettre les insertions publiques
CREATE POLICY "Enable insert for public quotes" ON public.devis
  FOR INSERT
  TO public
  WITH CHECK (
    status = 'draft' 
    AND source = 'online'
    AND client_email IS NOT NULL
  );