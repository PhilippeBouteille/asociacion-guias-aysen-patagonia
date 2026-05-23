-- ============================================================
-- AGAP — Asociación de Guías Aysén Patagonia
-- Supabase Migration v1
-- ============================================================

-- ── GUIDES ──────────────────────────────────────────────────
create table if not exists agap_guides (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null,
  prenom        text,
  photo_url     text,
  bio           text,
  zona          text,
  especialidades text[],   -- ['trekking','kayak','escalada','fauna','pesca','glaciares']
  idiomas       text[],    -- ['es','en','fr','pt']
  certificaciones text[],  -- ['AGAP Nivel 1','AGAP Nivel 2','AGAP Nivel 3','SERNATUR']
  telefono      text,
  email         text,
  instagram     text,
  whatsapp      text,
  activo        boolean default true,
  orden         integer default 0,
  created_at    timestamptz default now()
);

-- ── INSCRIPTIONS GUIDES (formulaire Únete) ──────────────────
create table if not exists agap_inscriptions (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null,
  prenom        text,
  email         text not null,
  telefono      text,
  especialidad  text,
  zona          text,
  mensaje       text,
  tratado       boolean default false,
  created_at    timestamptz default now()
);

-- ── DEMANDES CLIENTS (formulaire Contacto) ──────────────────
create table if not exists agap_demandes (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null,
  email         text not null,
  actividad     text,
  mensaje       text,
  guide_id      uuid references agap_guides(id),
  tratado       boolean default false,
  created_at    timestamptz default now()
);

-- ── PARAMÈTRES ───────────────────────────────────────────────
create table if not exists agap_parametres (
  cle           text primary key,
  valeur        text,
  updated_at    timestamptz default now()
);

insert into agap_parametres (cle, valeur) values
  ('nom_asso',    'Asociación de Guías Aysén Patagonia'),
  ('email',       'contacto@agapguias.cl'),
  ('whatsapp',    '+56 9 xxxx xxxx'),
  ('instagram',   '@agapguias'),
  ('ciudad',      'Coyhaique, Región de Aysén, Chile')
on conflict (cle) do nothing;

-- ── RLS ──────────────────────────────────────────────────────
alter table agap_guides       enable row level security;
alter table agap_inscriptions enable row level security;
alter table agap_demandes     enable row level security;
alter table agap_parametres   enable row level security;

-- Lecture publique des guides actifs
create policy "public_read_guides" on agap_guides
  for select using (activo = true);

-- Lecture publique des paramètres
create policy "public_read_parametres" on agap_parametres
  for select using (true);

-- Insertion publique des inscriptions et demandes
create policy "public_insert_inscriptions" on agap_inscriptions
  for insert with check (true);

create policy "public_insert_demandes" on agap_demandes
  for insert with check (true);

-- Accès total pour les authentifiés (gestion.html)
create policy "auth_all_guides" on agap_guides
  for all using (auth.role() = 'authenticated');

create policy "auth_all_inscriptions" on agap_inscriptions
  for all using (auth.role() = 'authenticated');

create policy "auth_all_demandes" on agap_demandes
  for all using (auth.role() = 'authenticated');

create policy "auth_all_parametres" on agap_parametres
  for all using (auth.role() = 'authenticated');
