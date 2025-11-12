-- Create admin_tabs table for dynamic tab management
CREATE TABLE public.admin_tabs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.admin_tabs ENABLE ROW LEVEL SECURITY;

-- Anyone can view active tabs
CREATE POLICY "Anyone can view active admin tabs"
ON public.admin_tabs
FOR SELECT
USING (is_active = true);

-- Authenticated users can manage tabs
CREATE POLICY "Authenticated users can manage admin tabs"
ON public.admin_tabs
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_tabs_updated_at
BEFORE UPDATE ON public.admin_tabs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tabs
INSERT INTO public.admin_tabs (title, key, icon, display_order, is_system) VALUES
('Dashboard', 'dashboard', 'LayoutDashboard', 0, true),
('Sources', 'sources', 'Globe', 1, false),
('Projets', 'projets', 'FolderKanban', 2, false),
('Clients', 'clients', 'Users', 3, false),
('Articles', 'articles', 'Package', 4, false),
('Devis', 'devis', 'FileText', 5, true),
('Factures', 'factures', 'Receipt', 6, false),
('Dépenses', 'depenses', 'TrendingDown', 7, false),
('Fournisseurs', 'fournisseurs', 'Truck', 8, false),
('Avoirs', 'avoirs', 'FileDown', 9, false),
('Planning', 'planning', 'Calendar', 10, false),
('Techniciens', 'techniciens', 'HardHat', 11, false),
('Travaux', 'travaux', 'Wrench', 12, false),
('CGV', 'cgv', 'FileCheck', 13, false),
('Statistiques', 'statistiques', 'BarChart3', 14, false),
('Configuration Gmail', 'gmail', 'Mail', 15, true),
('Descriptions de Motifs', 'motifs', 'FileEdit', 16, true),
('Aperçu PDF', 'preview', 'Eye', 17, true),
('Gestion des Onglets', 'tabs-manager', 'Settings', 18, true);