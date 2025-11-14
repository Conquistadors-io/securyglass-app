-- Add civilite column to devis table
ALTER TABLE public.devis 
ADD COLUMN civilite TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.devis.civilite IS 'Civilité du client (monsieur, madame, societe, entreprise-btp)';