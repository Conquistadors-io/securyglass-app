-- Add pdf_url column to devis table
ALTER TABLE public.devis 
ADD COLUMN pdf_url TEXT;

-- Create storage bucket for quote PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-pdfs', 'quote-pdfs', false);

-- RLS Policy: Admins can manage all PDFs
CREATE POLICY "Admins can manage PDFs"
ON storage.objects FOR ALL
USING (
  bucket_id = 'quote-pdfs' 
  AND has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'quote-pdfs' 
  AND has_role(auth.uid(), 'admin')
);

-- RLS Policy: Clients can view their own PDFs
CREATE POLICY "Clients can view own PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'quote-pdfs'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM devis 
    WHERE client_email = auth.jwt() ->> 'email'
  )
);