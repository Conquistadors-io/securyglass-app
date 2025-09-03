-- Restructure clients table with better organization and security

-- First, drop existing policies
DROP POLICY IF EXISTS "Allow public insert for quotes" ON clients;
DROP POLICY IF EXISTS "Users can view own client data" ON clients;
DROP POLICY IF EXISTS "Users can update own client data" ON clients;

-- Drop existing table and recreate with new structure
DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL,
  mobile VARCHAR NOT NULL,
  nom VARCHAR NOT NULL,
  prenom VARCHAR,
  
  -- Données entreprise optionnelles
  raison_sociale VARCHAR,
  email_facturation VARCHAR,    -- Si différent de email contact
  
  -- Adresse
  adresse_intervention TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte unique combinée
  CONSTRAINT unique_client UNIQUE (email, mobile)
);

-- Active RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 1. Admin (toi) - accès total
CREATE POLICY "Admin full access" ON clients
FOR ALL USING (auth.jwt() ->> 'email' = 'yves@securyglass.fr');

-- 2. Système devis - peut créer clients
CREATE POLICY "Quote system can insert" ON clients
FOR INSERT WITH CHECK (
  -- Vérifie que la combinaison email+mobile n'existe pas
  NOT EXISTS (
    SELECT 1 FROM clients 
    WHERE email = NEW.email AND mobile = NEW.mobile
  )
);

-- 3. Système devis - peut vérifier doublons
CREATE POLICY "Quote system can check duplicates" ON clients
FOR SELECT USING (true);

-- 4. Clients authentifiés voient leurs données
CREATE POLICY "Users view own data" ON clients
FOR SELECT USING (
  auth.jwt() ->> 'email' = email
);

-- Update devis table to reference the new client structure
-- Remove foreign key constraint if it exists and update column names for consistency
ALTER TABLE devis DROP CONSTRAINT IF EXISTS devis_client_email_fkey;

-- Rename client_email to match new structure if needed
-- (keeping client_email as is since it matches the email field)