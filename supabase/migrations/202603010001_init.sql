-- Cartao da Gestante - Initial Schema
-- Generated: 2026-03-01

create extension if not exists pgcrypto;
create schema if not exists app;

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'doctor', 'secretary', 'patient');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pregnancy_risk') THEN
    CREATE TYPE pregnancy_risk AS ENUM ('habitual', 'high_risk');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pregnancy_type') THEN
    CREATE TYPE pregnancy_type AS ENUM ('single', 'twins', 'triplets_or_more', 'ignored');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_code') THEN
    CREATE TYPE exam_code AS ENUM (
      'abo_rh',
      'coombs_indireto',
      'hb_ht',
      'plaquetas',
      'glicemia_jejum',
      'totg_75',
      'hiv',
      'vdrl',
      'hbsag',
      'anti_hbs',
      'anti_hcv',
      'toxoplasmose',
      'cmv',
      'rubeola',
      'htlv',
      'urina1',
      'urocultura',
      'tsh_t4',
      'abo_rh_pai',
      'swab_gbs',
      'outros'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attachment_kind') THEN
    CREATE TYPE attachment_kind AS ENUM ('exam', 'ultrasound', 'consultation', 'other');
  END IF;
END $$;

-- Core tables
create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  document text,
  phone text,
  email text,
  city text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  role app_role not null default 'patient',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  birth_date date,
  city text,
  baby_name text,
  phone text,
  notes text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancies (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'closed')),
  started_on date,
  ended_on date,
  closed_reason text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_clinical_snapshot (
  pregnancy_id uuid primary key references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  dum date,
  dpp date,
  dpp_usg date,
  pregnancy_type pregnancy_type not null default 'single',
  pregnancy_risk pregnancy_risk not null default 'habitual',
  planned_pregnancy boolean,
  ig_weeks integer,
  ig_days integer,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_history (
  pregnancy_id uuid primary key references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  gesta integer not null default 0,
  abortions integer not null default 0,
  vaginal_births integer not null default 0,
  cesarean_births integer not null default 0,
  live_births integer not null default 0,
  deceased_births integer not null default 0,
  ectopic_pregnancies integer not null default 0,
  preeclampsia boolean,
  eclampsia boolean,
  low_weight_births integer not null default 0,
  high_weight_births integer not null default 0,
  fetal_deaths integer not null default 0,
  death_first_week integer not null default 0,
  death_after_first_week integer not null default 0,
  previous_gestation_ended_under_1year boolean,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_antecedents (
  pregnancy_id uuid primary key references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  personal text,
  obstetric text,
  family_history text,
  lifestyle text,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_vaccines (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid not null references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  vaccine_name text not null,
  dose_label text,
  taken_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_medications (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid not null references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  medication_name text not null,
  dosage text,
  frequency text,
  started_on date,
  ended_on date,
  notes text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid not null references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  visit_index integer not null check (visit_index > 0),
  visit_date date,
  chief_complaint text,
  ig_weeks integer,
  weight_kg numeric(5,2),
  imc numeric(5,2),
  edema text,
  blood_pressure text,
  uterine_height_cm numeric(5,2),
  fetal_presentation text,
  bcf_mov_fetal text,
  touch_exam text,
  diagnosis_conduct text,
  signature_name_crm text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pregnancy_id, visit_index)
);

create table if not exists public.pregnancy_exams (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid not null references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  exam_code exam_code not null,
  collection_date date,
  result_date date,
  result_text text,
  notes text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_ultrasounds (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid not null references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  exam_date date not null,
  ig_dum text,
  ig_usg text,
  fetal_weight_g integer,
  placenta text,
  liquid text,
  doppler text,
  notes text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pregnancy_observations (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid not null references public.pregnancies(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  content text not null,
  is_current boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  pregnancy_id uuid references public.pregnancies(id) on delete cascade,
  consultation_id uuid references public.consultations(id) on delete set null,
  exam_id uuid references public.pregnancy_exams(id) on delete set null,
  ultrasound_id uuid references public.pregnancy_ultrasounds(id) on delete set null,
  kind attachment_kind not null,
  bucket text not null default 'clinical-attachments',
  object_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attachment_ref_check check (
    pregnancy_id is not null
    or consultation_id is not null
    or exam_id is not null
    or ultrasound_id is not null
  )
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  clinic_id uuid,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  changed_by uuid,
  changed_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);

create table if not exists public.exam_catalog (
  code exam_code primary key,
  label text not null,
  sort_order integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_user_profiles_clinic on public.user_profiles(clinic_id);
create index if not exists idx_patients_clinic_name on public.patients(clinic_id, full_name);
create index if not exists idx_patients_auth_user on public.patients(auth_user_id);
create index if not exists idx_pregnancies_patient on public.pregnancies(patient_id, created_at desc);
create index if not exists idx_pregnancies_clinic on public.pregnancies(clinic_id);
create index if not exists idx_consultations_pregnancy on public.consultations(pregnancy_id, visit_index);
create index if not exists idx_exams_pregnancy on public.pregnancy_exams(pregnancy_id, exam_code, collection_date);
create index if not exists idx_ultrasounds_pregnancy on public.pregnancy_ultrasounds(pregnancy_id, exam_date);
create index if not exists idx_vaccines_pregnancy on public.pregnancy_vaccines(pregnancy_id, vaccine_name);
create unique index if not exists idx_vaccines_unique_dose
  on public.pregnancy_vaccines (pregnancy_id, vaccine_name, coalesce(dose_label, 'dose-unica'));
create index if not exists idx_medications_pregnancy on public.pregnancy_medications(pregnancy_id);
create index if not exists idx_observations_pregnancy_current on public.pregnancy_observations(pregnancy_id, is_current);
create index if not exists idx_attachments_pregnancy on public.attachments(pregnancy_id);
create index if not exists idx_audit_logs_clinic_changed on public.audit_logs(clinic_id, changed_at desc);

-- Helpers
create or replace function app.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app.current_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select up.role from public.user_profiles up where up.user_id = auth.uid() limit 1;
$$;

create or replace function app.current_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select up.clinic_id from public.user_profiles up where up.user_id = auth.uid() limit 1;
$$;

create or replace function app.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(app.current_role() in ('admin', 'doctor', 'secretary'), false);
$$;

create or replace function app.is_patient_owner(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.patients p
     where p.id = p_id
       and p.auth_user_id = auth.uid()
  );
$$;

create or replace function app.can_read_pregnancy(pregnancy_id uuid, clinic uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select (
    (app.is_staff() and clinic = app.current_clinic_id())
    or exists (
      select 1
        from public.pregnancies pr
        join public.patients p on p.id = pr.patient_id
       where pr.id = pregnancy_id
         and p.auth_user_id = auth.uid()
    )
  );
$$;

create or replace function app.audit_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record_id text;
  v_clinic_id uuid;
  v_new jsonb;
  v_old jsonb;
begin
  v_new := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  v_old := case when tg_op = 'INSERT' then null else to_jsonb(old) end;

  v_record_id := coalesce(v_new->>'id', v_old->>'id', v_new->>'pregnancy_id', v_old->>'pregnancy_id', 'unknown');
  v_clinic_id := coalesce((v_new->>'clinic_id')::uuid, (v_old->>'clinic_id')::uuid);

  insert into public.audit_logs(clinic_id, table_name, record_id, action, changed_by, old_data, new_data)
  values (
    v_clinic_id,
    tg_table_name,
    v_record_id,
    tg_op,
    auth.uid(),
    v_old,
    v_new
  );

  return coalesce(new, old);
end;
$$;

-- updated_at triggers
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'clinics',
    'user_profiles',
    'patients',
    'pregnancies',
    'pregnancy_clinical_snapshot',
    'pregnancy_history',
    'pregnancy_antecedents',
    'pregnancy_vaccines',
    'pregnancy_medications',
    'consultations',
    'pregnancy_exams',
    'pregnancy_ultrasounds',
    'attachments'
  ]
  LOOP
    EXECUTE format('drop trigger if exists trg_touch_updated_at_%s on public.%I;', t, t);
    EXECUTE format('create trigger trg_touch_updated_at_%s before update on public.%I for each row execute function app.touch_updated_at();', t, t);
  END LOOP;
END $$;

-- audit triggers
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'patients',
    'pregnancies',
    'pregnancy_clinical_snapshot',
    'pregnancy_history',
    'pregnancy_antecedents',
    'pregnancy_vaccines',
    'pregnancy_medications',
    'consultations',
    'pregnancy_exams',
    'pregnancy_ultrasounds',
    'pregnancy_observations',
    'attachments'
  ]
  LOOP
    EXECUTE format('drop trigger if exists trg_audit_%s on public.%I;', t, t);
    EXECUTE format('create trigger trg_audit_%s after insert or update or delete on public.%I for each row execute function app.audit_changes();', t, t);
  END LOOP;
END $$;

-- Enable RLS
alter table public.clinics enable row level security;
alter table public.user_profiles enable row level security;
alter table public.patients enable row level security;
alter table public.pregnancies enable row level security;
alter table public.pregnancy_clinical_snapshot enable row level security;
alter table public.pregnancy_history enable row level security;
alter table public.pregnancy_antecedents enable row level security;
alter table public.pregnancy_vaccines enable row level security;
alter table public.pregnancy_medications enable row level security;
alter table public.consultations enable row level security;
alter table public.pregnancy_exams enable row level security;
alter table public.pregnancy_ultrasounds enable row level security;
alter table public.pregnancy_observations enable row level security;
alter table public.attachments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.exam_catalog enable row level security;

-- Policies: clinics
DROP POLICY IF EXISTS clinics_select_policy ON public.clinics;
CREATE POLICY clinics_select_policy ON public.clinics
FOR SELECT USING (id = app.current_clinic_id());

DROP POLICY IF EXISTS clinics_update_policy ON public.clinics;
CREATE POLICY clinics_update_policy ON public.clinics
FOR UPDATE USING (app.is_staff() and id = app.current_clinic_id())
WITH CHECK (app.is_staff() and id = app.current_clinic_id());

-- Policies: user_profiles
DROP POLICY IF EXISTS user_profiles_select_policy ON public.user_profiles;
CREATE POLICY user_profiles_select_policy ON public.user_profiles
FOR SELECT USING (
  user_id = auth.uid() OR (app.is_staff() and clinic_id = app.current_clinic_id())
);

DROP POLICY IF EXISTS user_profiles_update_self_policy ON public.user_profiles;
CREATE POLICY user_profiles_update_self_policy ON public.user_profiles
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policies: patients
DROP POLICY IF EXISTS patients_select_policy ON public.patients;
CREATE POLICY patients_select_policy ON public.patients
FOR SELECT USING (
  (app.is_staff() and clinic_id = app.current_clinic_id()) OR auth_user_id = auth.uid()
);

DROP POLICY IF EXISTS patients_insert_policy ON public.patients;
CREATE POLICY patients_insert_policy ON public.patients
FOR INSERT WITH CHECK (app.is_staff() and clinic_id = app.current_clinic_id());

DROP POLICY IF EXISTS patients_update_policy ON public.patients;
CREATE POLICY patients_update_policy ON public.patients
FOR UPDATE USING (app.is_staff() and clinic_id = app.current_clinic_id())
WITH CHECK (app.is_staff() and clinic_id = app.current_clinic_id());

DROP POLICY IF EXISTS patients_delete_policy ON public.patients;
CREATE POLICY patients_delete_policy ON public.patients
FOR DELETE USING (app.is_staff() and clinic_id = app.current_clinic_id());

-- Policies: pregnancies
DROP POLICY IF EXISTS pregnancies_select_policy ON public.pregnancies;
CREATE POLICY pregnancies_select_policy ON public.pregnancies
FOR SELECT USING (app.can_read_pregnancy(id, clinic_id));

DROP POLICY IF EXISTS pregnancies_insert_policy ON public.pregnancies;
CREATE POLICY pregnancies_insert_policy ON public.pregnancies
FOR INSERT WITH CHECK (app.is_staff() and clinic_id = app.current_clinic_id());

DROP POLICY IF EXISTS pregnancies_update_policy ON public.pregnancies;
CREATE POLICY pregnancies_update_policy ON public.pregnancies
FOR UPDATE USING (app.is_staff() and clinic_id = app.current_clinic_id())
WITH CHECK (app.is_staff() and clinic_id = app.current_clinic_id());

DROP POLICY IF EXISTS pregnancies_delete_policy ON public.pregnancies;
CREATE POLICY pregnancies_delete_policy ON public.pregnancies
FOR DELETE USING (app.is_staff() and clinic_id = app.current_clinic_id());

-- Template for pregnancy children
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'pregnancy_clinical_snapshot',
    'pregnancy_history',
    'pregnancy_antecedents',
    'pregnancy_vaccines',
    'pregnancy_medications',
    'consultations',
    'pregnancy_exams',
    'pregnancy_ultrasounds',
    'pregnancy_observations',
    'attachments'
  ]
  LOOP
    EXECUTE format('drop policy if exists %I_select_policy on public.%I;', t, t);
    EXECUTE format(
      'create policy %I_select_policy on public.%I for select using ((app.is_staff() and clinic_id = app.current_clinic_id()) or app.can_read_pregnancy(pregnancy_id, clinic_id));',
      t,
      t
    );

    EXECUTE format('drop policy if exists %I_insert_policy on public.%I;', t, t);
    EXECUTE format(
      'create policy %I_insert_policy on public.%I for insert with check (app.is_staff() and clinic_id = app.current_clinic_id());',
      t,
      t
    );

    EXECUTE format('drop policy if exists %I_update_policy on public.%I;', t, t);
    EXECUTE format(
      'create policy %I_update_policy on public.%I for update using (app.is_staff() and clinic_id = app.current_clinic_id()) with check (app.is_staff() and clinic_id = app.current_clinic_id());',
      t,
      t
    );

    EXECUTE format('drop policy if exists %I_delete_policy on public.%I;', t, t);
    EXECUTE format(
      'create policy %I_delete_policy on public.%I for delete using (app.is_staff() and clinic_id = app.current_clinic_id());',
      t,
      t
    );
  END LOOP;
END $$;

-- Policies: audit_logs
DROP POLICY IF EXISTS audit_logs_select_policy ON public.audit_logs;
CREATE POLICY audit_logs_select_policy ON public.audit_logs
FOR SELECT USING (app.is_staff() and clinic_id = app.current_clinic_id());

DROP POLICY IF EXISTS audit_logs_insert_policy ON public.audit_logs;
CREATE POLICY audit_logs_insert_policy ON public.audit_logs
FOR INSERT WITH CHECK (true);

-- Policies: exam catalog
DROP POLICY IF EXISTS exam_catalog_select_policy ON public.exam_catalog;
CREATE POLICY exam_catalog_select_policy ON public.exam_catalog
FOR SELECT USING (auth.role() = 'authenticated');

-- Storage bucket and policies
insert into storage.buckets (id, name, public)
values ('clinical-attachments', 'clinical-attachments', false)
on conflict (id) do nothing;

DROP POLICY IF EXISTS storage_staff_select ON storage.objects;
CREATE POLICY storage_staff_select ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'clinical-attachments'
  and app.is_staff()
  and split_part(name, '/', 1) = app.current_clinic_id()::text
);

DROP POLICY IF EXISTS storage_staff_insert ON storage.objects;
CREATE POLICY storage_staff_insert ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'clinical-attachments'
  and app.is_staff()
  and split_part(name, '/', 1) = app.current_clinic_id()::text
);

DROP POLICY IF EXISTS storage_staff_update ON storage.objects;
CREATE POLICY storage_staff_update ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'clinical-attachments'
  and app.is_staff()
  and split_part(name, '/', 1) = app.current_clinic_id()::text
)
WITH CHECK (
  bucket_id = 'clinical-attachments'
  and app.is_staff()
  and split_part(name, '/', 1) = app.current_clinic_id()::text
);

DROP POLICY IF EXISTS storage_staff_delete ON storage.objects;
CREATE POLICY storage_staff_delete ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'clinical-attachments'
  and app.is_staff()
  and split_part(name, '/', 1) = app.current_clinic_id()::text
);
