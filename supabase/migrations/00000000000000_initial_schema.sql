-- ============================================================
-- SecuriGlass — Initial Schema Migration
-- Full business lifecycle: leads → quotes → jobs → payments
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- for text search

-- ────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────

-- Roles
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'admin',
  'operator',
  'technician'
);

-- Client type
CREATE TYPE public.client_type AS ENUM ('individual', 'professional');

-- Property type
CREATE TYPE public.property_type AS ENUM ('house', 'apartment', 'office', 'shop', 'other');

-- Lead lifecycle
CREATE TYPE public.lead_source AS ENUM (
  'phone', 'website_form', 'online_quote', 'google_business', 'referral', 'other'
);
CREATE TYPE public.lead_status AS ENUM ('new', 'qualified', 'converted', 'lost');

-- Quote lifecycle
CREATE TYPE public.quote_status AS ENUM (
  'draft', 'sent', 'validated', 'accepted', 'rejected', 'expired', 'revised'
);

-- Job lifecycle
CREATE TYPE public.job_status AS ENUM (
  'assigned', 'accepted', 'diagnostic_scheduled', 'diagnostic_done',
  'deposit_collected', 'materials_ordered', 'installation_scheduled',
  'installation_done', 'balance_collected', 'closed', 'cancelled'
);

-- Appointment
CREATE TYPE public.appointment_type AS ENUM ('diagnostic', 'installation');
CREATE TYPE public.appointment_status AS ENUM (
  'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
);

-- Payment
CREATE TYPE public.payment_type AS ENUM ('deposit', 'balance', 'full');
CREATE TYPE public.payment_method AS ENUM ('sumup', 'card', 'check', 'cash', 'transfer');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Photo type
CREATE TYPE public.photo_type AS ENUM ('before', 'after', 'measurement', 'other');

-- Notification channel
CREATE TYPE public.notification_channel AS ENUM ('email', 'sms', 'in_app');


-- ────────────────────────────────────────────────────────────
-- 2. SEQUENCES
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE public.quote_number_seq START WITH 1;
CREATE SEQUENCE public.job_number_seq START WITH 1;
CREATE SEQUENCE public.invoice_number_seq START WITH 1;


-- ────────────────────────────────────────────────────────────
-- 3. TABLES
-- ────────────────────────────────────────────────────────────

-- ── user_roles ──────────────────────────────────────────────

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- ── clients ─────────────────────────────────────────────────

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_type public.client_type NOT NULL DEFAULT 'individual',
  -- Identity
  civilite TEXT,
  nom TEXT,
  prenom TEXT,
  raison_sociale TEXT,
  -- Contact
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  phone TEXT,
  email_facturation TEXT,
  -- Address
  address_line TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'FR',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- ── leads ───────────────────────────────────────────────────
-- Pre-contact: captures initial contact BEFORE a quote exists

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  -- Source & qualification
  source public.lead_source NOT NULL DEFAULT 'phone',
  status public.lead_status NOT NULL DEFAULT 'new',
  -- Quick capture fields
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  -- Qualification
  demand_type TEXT,
  property_type public.property_type,
  urgency_level SMALLINT DEFAULT 3 CHECK (urgency_level BETWEEN 1 AND 5),
  city TEXT,
  postal_code TEXT,
  notes TEXT,
  -- Conversion tracking (FK added after quotes table)
  converted_quote_id UUID,
  -- Meta
  qualified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── technicians ─────────────────────────────────────────────

CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Identity
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  -- Location
  address_line TEXT,
  postal_code TEXT,
  city TEXT,
  department TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- Professional
  status TEXT NOT NULL DEFAULT 'active',
  skill_level TEXT,
  certifications TEXT[],
  vehicle_type TEXT,
  max_discount_percent NUMERIC(5,2) DEFAULT 0,
  -- Availability
  on_call_night BOOLEAN DEFAULT false,
  on_call_weekend BOOLEAN DEFAULT false,
  -- Payment methods the tech can accept
  payment_methods public.payment_method[],
  -- Denormalized stats
  rating NUMERIC(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ── technician_zones ────────────────────────────────────────

CREATE TABLE public.technician_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  postal_codes TEXT[],
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── quotes ──────────────────────────────────────────────────

CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  -- Version tracking
  current_version INTEGER NOT NULL DEFAULT 1,
  status public.quote_status NOT NULL DEFAULT 'draft',
  -- Context (quote-level, applies to all items)
  service_type TEXT NOT NULL DEFAULT 'vitrerie',
  motif TEXT,
  motif_other TEXT,
  property_type public.property_type,
  property_other TEXT,
  assurance TEXT,
  -- Intervention address (may differ from client address)
  intervention_address TEXT,
  intervention_postal_code TEXT,
  intervention_city TEXT,
  intervention_latitude DOUBLE PRECISION,
  intervention_longitude DOUBLE PRECISION,
  -- Pricing totals (aggregated from quote_items)
  price_subtotal NUMERIC(10,2) DEFAULT 0,
  price_tva NUMERIC(10,2) DEFAULT 0,
  price_tva_rate NUMERIC(5,2),
  price_total NUMERIC(10,2) DEFAULT 0,
  -- Validation (client validates via tokenized link)
  validation_token TEXT,
  validated_at TIMESTAMPTZ,
  validation_ip TEXT,
  -- Legal disclaimer
  disclaimer TEXT DEFAULT 'Sous réserve de constat des lieux et mesures définitives',
  -- Documents
  pdf_url TEXT,
  photo_url TEXT,
  -- Source & notes
  source public.lead_source DEFAULT 'online_quote',
  notes TEXT,
  -- Meta
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add circular FK: leads.converted_quote_id → quotes.id
ALTER TABLE public.leads
  ADD CONSTRAINT leads_converted_quote_id_fkey
  FOREIGN KEY (converted_quote_id) REFERENCES public.quotes(id) ON DELETE SET NULL;

-- ── quote_items ─────────────────────────────────────────────
-- Individual line items within a quote (multi-product support)

CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  -- Product description
  description TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  vitrage TEXT,
  -- Dimensions
  largeur_cm NUMERIC(10,2),
  hauteur_cm NUMERIC(10,2),
  quantite INTEGER NOT NULL DEFAULT 1,
  -- Pricing
  unit_price NUMERIC(10,2),
  price_subtotal NUMERIC(10,2),
  price_tva NUMERIC(10,2),
  price_total NUMERIC(10,2),
  price_details JSONB,
  -- Photo of this specific item
  photo_url TEXT,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── quote_versions ──────────────────────────────────────────
-- History of quote revisions (after field assessment, etc.)

CREATE TABLE public.quote_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  -- Snapshot
  items_snapshot JSONB NOT NULL,
  pricing_snapshot JSONB NOT NULL,
  -- Revision context
  revision_reason TEXT,
  disclaimer TEXT,
  pdf_url TEXT,
  -- Who made the revision
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quote_id, version_number)
);

-- ── jobs ────────────────────────────────────────────────────
-- Intervention: created when a quote is accepted

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT NOT NULL UNIQUE,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE RESTRICT,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  -- Status
  status public.job_status NOT NULL DEFAULT 'assigned',
  -- Intervention address (denormalized from quote)
  intervention_address TEXT,
  intervention_postal_code TEXT,
  intervention_city TEXT,
  intervention_latitude DOUBLE PRECISION,
  intervention_longitude DOUBLE PRECISION,
  -- Financial summary
  total_amount NUMERIC(10,2),
  deposit_amount NUMERIC(10,2),
  balance_amount NUMERIC(10,2),
  deposit_paid BOOLEAN DEFAULT false,
  balance_paid BOOLEAN DEFAULT false,
  -- Discount
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_reason TEXT,
  -- Workflow timestamps
  assigned_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  diagnostic_at TIMESTAMPTZ,
  deposit_collected_at TIMESTAMPTZ,
  materials_ordered_at TIMESTAMPTZ,
  installation_completed_at TIMESTAMPTZ,
  balance_collected_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  -- Meta
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── appointments ────────────────────────────────────────────

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE RESTRICT,
  -- Scheduling
  type public.appointment_type NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  -- Details
  notes TEXT,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── job_photos ──────────────────────────────────────────────

CREATE TABLE public.job_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  photo_type public.photo_type NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── job_notes ───────────────────────────────────────────────

CREATE TABLE public.job_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── payments ────────────────────────────────────────────────

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE RESTRICT,
  -- Payment details
  type public.payment_type NOT NULL,
  method public.payment_method NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  amount NUMERIC(10,2) NOT NULL,
  -- External reference (e.g. SumUp transaction ID)
  external_reference TEXT,
  -- Who collected it
  collected_by UUID REFERENCES auth.users(id),
  collected_at TIMESTAMPTZ,
  notes TEXT,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── invoices ────────────────────────────────────────────────

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  -- Amounts
  subtotal NUMERIC(10,2) NOT NULL,
  tva NUMERIC(10,2) NOT NULL,
  tva_rate NUMERIC(5,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  -- Status
  status TEXT NOT NULL DEFAULT 'draft',
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── notifications ───────────────────────────────────────────

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID REFERENCES auth.users(id),
  recipient_email TEXT,
  recipient_phone TEXT,
  -- Content
  channel public.notification_channel NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  -- Reference to related entity
  reference_type TEXT,
  reference_id UUID,
  -- Status
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── email_templates ─────────────────────────────────────────

CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  description TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── emails_sent ─────────────────────────────────────────────

CREATE TABLE public.emails_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  template_key TEXT NOT NULL,
  -- Recipient
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  -- Content
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables_data JSONB,
  -- Status
  status TEXT NOT NULL DEFAULT 'sent',
  external_message_id TEXT,
  error_message TEXT,
  -- Tracking
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── motif_descriptions ──────────────────────────────────────

CREATE TABLE public.motif_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motif TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── pricing_rules ───────────────────────────────────────────

CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_key TEXT NOT NULL UNIQUE,
  rule_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── admin_tabs ──────────────────────────────────────────────

CREATE TABLE public.admin_tabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 4. FUNCTIONS
-- ────────────────────────────────────────────────────────────

-- ── updated_at trigger function ─────────────────────────────

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Number generators ───────────────────────────────────────

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := 'DEV-' || LPAD(nextval('public.quote_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_job_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_number IS NULL OR NEW.job_number = '' THEN
    NEW.job_number := 'JOB-' || LPAD(nextval('public.job_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'FAC-' || LPAD(nextval('public.invoice_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── has_role ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- ── check_client_exists ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.check_client_exists(_email TEXT, _mobile TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients
    WHERE email = _email OR mobile = _mobile
  );
$$;

-- ── is_admin_or_operator ────────────────────────────────────
-- Helper for RLS policies

CREATE OR REPLACE FUNCTION public.is_admin_or_operator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin', 'operator')
  );
$$;

-- ── is_technician ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_technician()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'technician'
  );
$$;

-- ── get_technician_id ───────────────────────────────────────
-- Returns the technician.id for the current auth user

CREATE OR REPLACE FUNCTION public.get_technician_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.technicians
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;


-- ────────────────────────────────────────────────────────────
-- 5. TRIGGERS
-- ────────────────────────────────────────────────────────────

-- updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.quote_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.emails_sent
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.motif_descriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.admin_tabs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-generate number triggers
CREATE TRIGGER trg_generate_quote_number
  BEFORE INSERT ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.generate_quote_number();

CREATE TRIGGER trg_generate_job_number
  BEFORE INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.generate_job_number();

CREATE TRIGGER trg_generate_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();


-- ────────────────────────────────────────────────────────────
-- 6. INDEXES
-- ────────────────────────────────────────────────────────────

-- Clients
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_mobile ON public.clients(mobile);

-- Leads
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_client_id ON public.leads(client_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);

-- Quotes
CREATE INDEX idx_quotes_client_id ON public.quotes(client_id);
CREATE INDEX idx_quotes_lead_id ON public.quotes(lead_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at);
CREATE INDEX idx_quotes_validation_token ON public.quotes(validation_token) WHERE validation_token IS NOT NULL;

-- Quote items
CREATE INDEX idx_quote_items_quote_id ON public.quote_items(quote_id);

-- Quote versions
CREATE INDEX idx_quote_versions_quote_id ON public.quote_versions(quote_id);

-- Jobs
CREATE INDEX idx_jobs_quote_id ON public.jobs(quote_id);
CREATE INDEX idx_jobs_technician_id ON public.jobs(technician_id);
CREATE INDEX idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at);

-- Appointments
CREATE INDEX idx_appointments_job_id ON public.appointments(job_id);
CREATE INDEX idx_appointments_technician_id ON public.appointments(technician_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- Photos
CREATE INDEX idx_job_photos_job_id ON public.job_photos(job_id);

-- Notes
CREATE INDEX idx_job_notes_job_id ON public.job_notes(job_id);

-- Payments
CREATE INDEX idx_payments_job_id ON public.payments(job_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Invoices
CREATE INDEX idx_invoices_job_id ON public.invoices(job_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);

-- Technician zones
CREATE INDEX idx_technician_zones_technician_id ON public.technician_zones(technician_id);
CREATE INDEX idx_technician_zones_department ON public.technician_zones(department);

-- Notifications
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_user_id);
CREATE INDEX idx_notifications_reference ON public.notifications(reference_type, reference_id);

-- Emails sent
CREATE INDEX idx_emails_sent_quote_id ON public.emails_sent(quote_id);


-- ────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motif_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tabs ENABLE ROW LEVEL SECURITY;


-- ── user_roles ──────────────────────────────────────────────

CREATE POLICY "Admin can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());


-- ── clients ─────────────────────────────────────────────────

CREATE POLICY "Anon can insert clients"
  ON public.clients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update clients"
  ON public.clients FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin/operator full access to clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read own job clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (
    public.is_technician()
    AND id IN (
      SELECT client_id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── leads ───────────────────────────────────────────────────

CREATE POLICY "Anon can insert leads"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin/operator full access to leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ── technicians ─────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to technicians"
  ON public.technicians FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read own profile"
  ON public.technicians FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Technician can update own profile"
  ON public.technicians FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ── technician_zones ────────────────────────────────────────

CREATE POLICY "Admin/operator full access to zones"
  ON public.technician_zones FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read own zones"
  ON public.technician_zones FOR SELECT
  TO authenticated
  USING (technician_id = public.get_technician_id());


-- ── quotes ──────────────────────────────────────────────────

CREATE POLICY "Anon can insert quotes"
  ON public.quotes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can select quote by validation token"
  ON public.quotes FOR SELECT
  TO anon
  USING (validation_token IS NOT NULL);

CREATE POLICY "Admin/operator full access to quotes"
  ON public.quotes FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read assigned quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (
    public.is_technician()
    AND id IN (
      SELECT quote_id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── quote_items ─────────────────────────────────────────────

CREATE POLICY "Anon can insert quote items"
  ON public.quote_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can select quote items by quote"
  ON public.quote_items FOR SELECT
  TO anon
  USING (
    quote_id IN (
      SELECT id FROM public.quotes WHERE validation_token IS NOT NULL
    )
  );

CREATE POLICY "Admin/operator full access to quote items"
  ON public.quote_items FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read assigned quote items"
  ON public.quote_items FOR SELECT
  TO authenticated
  USING (
    public.is_technician()
    AND quote_id IN (
      SELECT quote_id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── quote_versions ──────────────────────────────────────────

CREATE POLICY "Admin/operator full access to quote versions"
  ON public.quote_versions FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read assigned quote versions"
  ON public.quote_versions FOR SELECT
  TO authenticated
  USING (
    public.is_technician()
    AND quote_id IN (
      SELECT quote_id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── jobs ────────────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to jobs"
  ON public.jobs FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can read own jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (
    public.is_technician()
    AND technician_id = public.get_technician_id()
  );

CREATE POLICY "Technician can update own jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (
    public.is_technician()
    AND technician_id = public.get_technician_id()
  )
  WITH CHECK (
    public.is_technician()
    AND technician_id = public.get_technician_id()
  );


-- ── appointments ────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to appointments"
  ON public.appointments FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can manage own appointments"
  ON public.appointments FOR ALL
  TO authenticated
  USING (
    public.is_technician()
    AND technician_id = public.get_technician_id()
  )
  WITH CHECK (
    public.is_technician()
    AND technician_id = public.get_technician_id()
  );


-- ── job_photos ──────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to photos"
  ON public.job_photos FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can manage own job photos"
  ON public.job_photos FOR ALL
  TO authenticated
  USING (
    public.is_technician()
    AND job_id IN (
      SELECT id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  )
  WITH CHECK (
    public.is_technician()
    AND job_id IN (
      SELECT id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── job_notes ───────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to notes"
  ON public.job_notes FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can manage own job notes"
  ON public.job_notes FOR ALL
  TO authenticated
  USING (
    public.is_technician()
    AND job_id IN (
      SELECT id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  )
  WITH CHECK (
    public.is_technician()
    AND job_id IN (
      SELECT id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── payments ────────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Technician can insert and read own job payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    public.is_technician()
    AND job_id IN (
      SELECT id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );

CREATE POLICY "Technician can insert payments for own jobs"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_technician()
    AND job_id IN (
      SELECT id FROM public.jobs
      WHERE technician_id = public.get_technician_id()
    )
  );


-- ── invoices ────────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to invoices"
  ON public.invoices FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ── notifications ───────────────────────────────────────────

CREATE POLICY "Admin/operator can read all notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (public.is_admin_or_operator());

CREATE POLICY "Admin/operator can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "User can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (recipient_user_id = auth.uid());

CREATE POLICY "User can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (recipient_user_id = auth.uid())
  WITH CHECK (recipient_user_id = auth.uid());


-- ── email_templates ─────────────────────────────────────────

CREATE POLICY "Anyone can read active templates"
  ON public.email_templates FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin/operator can manage templates"
  ON public.email_templates FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ── emails_sent ─────────────────────────────────────────────

CREATE POLICY "Admin/operator full access to sent emails"
  ON public.emails_sent FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ── motif_descriptions ──────────────────────────────────────

CREATE POLICY "Anyone can read motif descriptions"
  ON public.motif_descriptions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin/operator can manage motif descriptions"
  ON public.motif_descriptions FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ── pricing_rules ───────────────────────────────────────────

CREATE POLICY "Anyone can read pricing rules"
  ON public.pricing_rules FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin/operator can manage pricing rules"
  ON public.pricing_rules FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ── admin_tabs ──────────────────────────────────────────────

CREATE POLICY "Anyone can read active admin tabs"
  ON public.admin_tabs FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage admin tabs"
  ON public.admin_tabs FOR ALL
  TO authenticated
  USING (public.is_admin_or_operator())
  WITH CHECK (public.is_admin_or_operator());


-- ────────────────────────────────────────────────────────────
-- 8. STORAGE — Supabase Buckets
-- ────────────────────────────────────────────────────────────

-- Create the bucket for job photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-photos',
  'job-photos',
  false,
  10485760,  -- 10MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Storage policies

-- Authenticated users can upload photos to job-photos bucket
CREATE POLICY "Authenticated can upload job photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'job-photos');

-- Authenticated users can read photos from job-photos bucket
CREATE POLICY "Authenticated can read job photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'job-photos');

-- Authenticated users can update their own uploads
CREATE POLICY "Authenticated can update own job photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'job-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'job-photos');

-- Admin/operator can delete photos
CREATE POLICY "Admin can delete job photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'job-photos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin', 'operator')
    )
  );

-- Create bucket for quote documents (PDFs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-documents',
  'quote-documents',
  true,  -- PDFs are shared via public URLs
  20971520,  -- 20MB max
  ARRAY['application/pdf']
);

-- Anyone can read public quote documents
CREATE POLICY "Public can read quote documents"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'quote-documents');

-- Authenticated can upload quote documents
CREATE POLICY "Authenticated can upload quote documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'quote-documents');

-- Admin can delete quote documents
CREATE POLICY "Admin can delete quote documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'quote-documents'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin', 'operator')
    )
  );
