-- Initial seed data

insert into public.clinics (
  id,
  name,
  legal_name,
  city,
  state,
  phone,
  email
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Clínica Cartão da Gestante',
  'Clínica Cartão da Gestante LTDA',
  'Petrolina',
  'PE',
  '(87) 3861-9857',
  'contato@cartaogestante.local'
)
on conflict (id) do nothing;

insert into public.exam_catalog (code, label, sort_order)
values
  ('abo_rh', 'ABO / RH', 1),
  ('coombs_indireto', 'Coombs indireto', 2),
  ('hb_ht', 'HB / HT', 3),
  ('plaquetas', 'Plaquetas', 4),
  ('glicemia_jejum', 'Glicemia de jejum', 5),
  ('totg_75', 'TOTG 75', 6),
  ('hiv', 'HIV', 7),
  ('vdrl', 'VDRL', 8),
  ('hbsag', 'HbsAg', 9),
  ('anti_hbs', 'Anti Hbs', 10),
  ('anti_hcv', 'Anti HCV', 11),
  ('toxoplasmose', 'Toxoplasmose', 12),
  ('cmv', 'CMV', 13),
  ('rubeola', 'Rubéola', 14),
  ('htlv', 'HTLV', 15),
  ('urina1', 'Urina I', 16),
  ('urocultura', 'Urocultura', 17),
  ('tsh_t4', 'TSH / T4 Livre', 18),
  ('abo_rh_pai', 'ABO / RH (Pai)', 19),
  ('swab_gbs', 'Swab GBS', 20),
  ('outros', 'Outros', 21)
on conflict (code) do update
set
  label = excluded.label,
  sort_order = excluded.sort_order,
  active = true;

-- Promote first existing auth user as admin of default clinic.
insert into public.user_profiles (user_id, clinic_id, role, display_name)
select
  u.id,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin'::app_role,
  coalesce(u.raw_user_meta_data->>'name', u.email)
from auth.users u
order by u.created_at asc
limit 1
on conflict (user_id) do update
set
  clinic_id = excluded.clinic_id,
  role = excluded.role,
  display_name = excluded.display_name,
  updated_at = now();
