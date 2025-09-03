-- Migration progressive pour restructurer la table clients

-- D'abord, supprimer les politiques existantes
DROP POLICY IF EXISTS "Allow public insert for quotes" ON clients;
DROP POLICY IF EXISTS "Users can view own client data" ON clients;
DROP POLICY IF EXISTS "Users can update own client data" ON clients;

-- Ajouter les nouvelles colonnes à la table existante
ALTER TABLE clients ADD COLUMN IF NOT EXISTS mobile VARCHAR;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS prenom VARCHAR;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS raison_sociale VARCHAR;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email_facturation VARCHAR;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS adresse_intervention TEXT;

-- Migrer les données existantes vers la nouvelle structure
UPDATE clients 
SET 
  mobile = COALESCE(telephone, ''),
  adresse_intervention = COALESCE(adresse, ''),
  raison_sociale = nom_societe
WHERE mobile IS NULL OR adresse_intervention IS NULL;

-- Rendre mobile et adresse_intervention obligatoires après migration
ALTER TABLE clients ALTER COLUMN mobile SET NOT NULL;
ALTER TABLE clients ALTER COLUMN adresse_intervention SET NOT NULL;

-- Supprimer les anciennes colonnes
ALTER TABLE clients DROP COLUMN IF EXISTS telephone;
ALTER TABLE clients DROP COLUMN IF EXISTS nom_societe;
ALTER TABLE clients DROP COLUMN IF EXISTS adresse;
ALTER TABLE clients DROP COLUMN IF EXISTS code_postal;
ALTER TABLE clients DROP COLUMN IF EXISTS ville;
ALTER TABLE clients DROP COLUMN IF EXISTS civilite;

-- Ajouter la contrainte unique
ALTER TABLE clients ADD CONSTRAINT unique_client UNIQUE (email, mobile);

-- Créer les nouvelles politiques RLS
CREATE POLICY "Admin full access" ON clients
FOR ALL USING (auth.jwt() ->> 'email' = 'yves@securyglass.fr');

-- Politique pour insertion par le système de devis (sans vérification de doublons dans la policy)
CREATE POLICY "Quote system can insert" ON clients
FOR INSERT WITH CHECK (true);

CREATE POLICY "Quote system can check duplicates" ON clients
FOR SELECT USING (true);

CREATE POLICY "Users view own data" ON clients
FOR SELECT USING (
  auth.jwt() ->> 'email' = email
);