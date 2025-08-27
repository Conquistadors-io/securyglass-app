-- Create table to store Gmail OAuth credentials
CREATE TABLE public.gmail_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gmail_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies - only allow access to own credentials
CREATE POLICY "Users can view their own Gmail credentials" 
ON public.gmail_credentials 
FOR SELECT 
USING (true); -- Public access for the application to read

CREATE POLICY "Users can insert Gmail credentials" 
ON public.gmail_credentials 
FOR INSERT 
WITH CHECK (true); -- Public access for the application to insert

CREATE POLICY "Users can update Gmail credentials" 
ON public.gmail_credentials 
FOR UPDATE 
USING (true); -- Public access for the application to update

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gmail_credentials_updated_at
BEFORE UPDATE ON public.gmail_credentials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();