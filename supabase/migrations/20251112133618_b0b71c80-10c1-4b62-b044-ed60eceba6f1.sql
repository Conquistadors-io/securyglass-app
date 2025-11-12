-- Create table for motif descriptions
CREATE TABLE public.motif_descriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  motif TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.motif_descriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can read motif descriptions)
CREATE POLICY "Anyone can view motif descriptions" 
ON public.motif_descriptions 
FOR SELECT 
USING (true);

-- Create policy for admin to insert/update/delete (using auth for now, can be restricted later)
CREATE POLICY "Authenticated users can manage motif descriptions" 
ON public.motif_descriptions 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Insert default values
INSERT INTO public.motif_descriptions (motif, description) VALUES
  ('Vitre cassée', 'REMPLACEMENT DE VITRAGE À L''IDENTIQUE SUITE À UN BRIS DE GLACE'),
  ('Changement vitrage', 'CHANGEMENT DE VITRAGE POUR AMÉLIORATION'),
  ('Rénovation', 'RÉNOVATION DE VITRAGE EXISTANT'),
  ('Installation neuve', 'INSTALLATION DE VITRAGE NEUF')
ON CONFLICT (motif) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_motif_descriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_motif_descriptions_updated_at
BEFORE UPDATE ON public.motif_descriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_motif_descriptions_updated_at();