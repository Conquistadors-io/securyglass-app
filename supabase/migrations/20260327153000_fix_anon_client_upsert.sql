-- Fix: anon users cannot read back client ID after insert/update
-- because there is no anon SELECT policy on clients.
--
-- Solution: replace the two-step check+insert/update with a single
-- SECURITY DEFINER function that bypasses RLS internally.

CREATE OR REPLACE FUNCTION public.upsert_client(
  _email TEXT,
  _mobile TEXT,
  _nom TEXT,
  _prenom TEXT DEFAULT NULL,
  _raison_sociale TEXT DEFAULT NULL,
  _civilite TEXT DEFAULT NULL,
  _email_facturation TEXT DEFAULT NULL,
  _address_line TEXT DEFAULT NULL,
  _city TEXT DEFAULT NULL,
  _postal_code TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _client_id UUID;
BEGIN
  -- Try to find existing client by email or mobile
  SELECT id INTO _client_id
  FROM public.clients
  WHERE email = _email OR mobile = _mobile
  LIMIT 1;

  IF _client_id IS NOT NULL THEN
    -- Update existing client
    UPDATE public.clients
    SET
      nom = _nom,
      prenom = _prenom,
      raison_sociale = _raison_sociale,
      civilite = _civilite,
      email = _email,
      mobile = _mobile,
      email_facturation = _email_facturation,
      address_line = _address_line,
      city = _city,
      postal_code = _postal_code
    WHERE id = _client_id;
  ELSE
    -- Insert new client
    INSERT INTO public.clients (
      email, mobile, nom, prenom, raison_sociale,
      civilite, email_facturation, address_line, city, postal_code
    ) VALUES (
      _email, _mobile, _nom, _prenom, _raison_sociale,
      _civilite, _email_facturation, _address_line, _city, _postal_code
    )
    RETURNING id INTO _client_id;
  END IF;

  RETURN _client_id;
END;
$$;

-- Grant execute to anon so the public quote form can use it
GRANT EXECUTE ON FUNCTION public.upsert_client TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_client TO authenticated;
