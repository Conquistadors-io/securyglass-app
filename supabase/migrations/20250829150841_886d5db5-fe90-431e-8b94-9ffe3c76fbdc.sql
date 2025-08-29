-- Create pricing_rules table for centralized pricing configuration
CREATE TABLE public.pricing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_key TEXT NOT NULL UNIQUE,
  rule_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view pricing rules" 
ON public.pricing_rules 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pricing_rules_updated_at
BEFORE UPDATE ON public.pricing_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial pricing data
INSERT INTO public.pricing_rules (rule_key, rule_value, description) VALUES
('glass_prices', '{
  "simple": {"particulier": 25, "professionnel": 20},
  "double": {"particulier": 35, "professionnel": 28},
  "feuillete": {"particulier": 45, "professionnel": 36},
  "trempe": {"particulier": 55, "professionnel": 44}
}', 'Prix au m² pour différents types de vitrage'),

('labor_costs', '{
  "base_rate_per_m2": 50,
  "minimum_charge": 120,
  "security_setup": 80
}', 'Coûts de main d''œuvre'),

('delivery_rules', '{
  "free_threshold": 500,
  "cost_under_threshold": 50,
  "travel_cost_per_km": 0.8,
  "base_travel_cost": 30
}', 'Règles de livraison et déplacement'),

('general_settings', '{
  "minimum_surface_m2": 0.25,
  "tva_rate": 0.20,
  "quote_validity_days": 30
}', 'Paramètres généraux'),

('client_types', '{
  "particulier": {"multiplier": 1.0, "label": "Particulier"},
  "professionnel": {"multiplier": 0.8, "label": "Professionnel"}
}', 'Types de clients et leurs multiplicateurs');