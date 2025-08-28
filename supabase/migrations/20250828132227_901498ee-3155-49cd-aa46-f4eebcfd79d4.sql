
-- 1) Tables

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  civilite text,
  nom text,
  nom_societe text,
  telephone text,
  adresse text,
  code_postal text,
  ville text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.devis (
  id uuid primary key default gen_random_uuid(),
  quote_number text unique,
  client_email text not null references public.clients(email) on delete restrict,
  service_type text not null,
  object text not null,
  property text,
  property_other text,
  motif text,
  motif_other text,
  category text,
  subcategory text,
  vitrage text,
  largeur_cm numeric,
  hauteur_cm numeric,
  quantite int not null default 1,
  assurance text,
  different_intervention_address boolean not null default false,
  intervention_code_postal text,
  intervention_ville text,
  intervention_adresse text,
  photo_url text,
  price_subtotal numeric(12,2),
  price_tva numeric(12,2),
  price_tva_rate numeric(5,2),
  price_total numeric(12,2),
  price_details jsonb,
  status text not null default 'draft',
  source text default 'online',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Indexes utiles

create index if not exists idx_clients_email on public.clients(email);
create index if not exists idx_clients_created_at on public.clients(created_at);

create index if not exists idx_devis_client_email on public.devis(client_email);
create index if not exists idx_devis_created_at on public.devis(created_at);
create index if not exists idx_devis_status on public.devis(status);
create index if not exists idx_devis_code_postal on public.devis(intervention_code_postal);

-- 3) Triggers updated_at (fonction déjà présente: public.update_updated_at_column)

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
before update on public.clients
for each row execute procedure public.update_updated_at_column();

drop trigger if exists trg_devis_updated_at on public.devis;
create trigger trg_devis_updated_at
before update on public.devis
for each row execute procedure public.update_updated_at_column();

-- 4) RLS

alter table public.clients enable row level security;
alter table public.devis enable row level security;

-- Policies pour clients
-- Autoriser l'insertion publique (nécessaire pour le formulaire sans auth)
drop policy if exists "Public can insert clients" on public.clients;
create policy "Public can insert clients"
  on public.clients
  for insert
  to anon, authenticated
  with check (true);

-- Autoriser la mise à jour publique (upsert par email; pas d'effet sans connaître la ligne)
drop policy if exists "Public can update clients" on public.clients;
create policy "Public can update clients"
  on public.clients
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Pas de SELECT/DELETE publics sur clients (ne pas créer de policy -> interdit)

-- Policies pour devis
-- Autoriser l'insertion publique
drop policy if exists "Public can insert devis" on public.devis;
create policy "Public can insert devis"
  on public.devis
  for insert
  to anon, authenticated
  with check (true);

-- Pas de SELECT/UPDATE/DELETE publics sur devis (ne pas créer de policy -> interdit)
