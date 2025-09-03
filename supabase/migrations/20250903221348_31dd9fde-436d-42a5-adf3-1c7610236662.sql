-- Fix RLS policies to protect sensitive customer data

-- First, drop existing overly permissive policies
DROP POLICY IF EXISTS "Public can view clients" ON clients;
DROP POLICY IF EXISTS "Public can update clients" ON clients;
DROP POLICY IF EXISTS "Public can insert clients" ON clients;

DROP POLICY IF EXISTS "Public can view devis" ON clients;
DROP POLICY IF EXISTS "Public can insert devis" ON devis;

DROP POLICY IF EXISTS "Users can view their own Gmail credentials" ON gmail_credentials;
DROP POLICY IF EXISTS "Users can insert Gmail credentials" ON gmail_credentials;
DROP POLICY IF EXISTS "Users can update Gmail credentials" ON gmail_credentials;

-- Create secure policies for clients table
-- Allow public insert for quote system (needed for online quotes)
CREATE POLICY "Allow public insert for quotes" ON clients
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Only allow users to view their own data based on email
-- This assumes the application will use email-based access control
CREATE POLICY "Users can view own client data" ON clients
FOR SELECT TO authenticated
USING (email = auth.jwt() ->> 'email');

-- Allow updates only for authenticated users on their own data
CREATE POLICY "Users can update own client data" ON clients
FOR UPDATE TO authenticated
USING (email = auth.jwt() ->> 'email')
WITH CHECK (email = auth.jwt() ->> 'email');

-- Create secure policies for devis table
-- Allow public insert for quote system
CREATE POLICY "Allow public insert for quotes" ON devis
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Only allow users to view their own quotes
CREATE POLICY "Users can view own quotes" ON devis
FOR SELECT TO authenticated
USING (client_email = auth.jwt() ->> 'email');

-- Allow updates only for authenticated users on their own quotes
CREATE POLICY "Users can update own quotes" ON devis
FOR UPDATE TO authenticated
USING (client_email = auth.jwt() ->> 'email')
WITH CHECK (client_email = auth.jwt() ->> 'email');

-- Create secure policies for gmail_credentials table
-- Only allow users to manage their own Gmail credentials
CREATE POLICY "Users can view own Gmail credentials" ON gmail_credentials
FOR SELECT TO authenticated
USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own Gmail credentials" ON gmail_credentials
FOR INSERT TO authenticated
WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update own Gmail credentials" ON gmail_credentials
FOR UPDATE TO authenticated
USING (user_email = auth.jwt() ->> 'email')
WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can delete own Gmail credentials" ON gmail_credentials
FOR DELETE TO authenticated
USING (user_email = auth.jwt() ->> 'email');

-- Add admin access policies (for future admin functionality)
-- Note: This requires implementing user roles in the future
-- For now, we'll comment these out until proper user management is implemented

-- CREATE POLICY "Admins can view all clients" ON clients
-- FOR ALL TO authenticated
-- USING (auth.jwt() ->> 'role' = 'admin');

-- CREATE POLICY "Admins can manage all quotes" ON devis
-- FOR ALL TO authenticated
-- USING (auth.jwt() ->> 'role' = 'admin');