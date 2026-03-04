import { z } from "zod";

import { ATTACHMENT_KINDS, EXAM_CODES, PREGNANCY_RISKS, PREGNANCY_TYPES } from "@/lib/domain/types";

export const patientCreateSchema = z.object({
  full_name: z.string().min(3),
  birth_date: z.string().date().optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  baby_name: z.string().max(120).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  auth_user_id: z.uuid().optional().nullable(),
});

export const patientUpdateSchema = patientCreateSchema.partial().refine((payload) => Object.keys(payload).length > 0, {
  message: "Informe ao menos um campo para atualizar",
});

export const pregnancyCreateSchema = z.object({
  started_on: z.string().date().optional().nullable(),
  status: z.enum(["active", "closed"]).default("active"),
});

export const pregnancyClinicalSnapshotSchema = z.object({
  dum: z.string().date().optional().nullable(),
  dpp: z.string().date().optional().nullable(),
  dpp_usg: z.string().date().optional().nullable(),
  pregnancy_type: z.enum(PREGNANCY_TYPES).default("single"),
  pregnancy_risk: z.enum(PREGNANCY_RISKS).default("habitual"),
  planned_pregnancy: z.boolean().optional().nullable(),
  ig_weeks: z.number().int().min(0).max(45).optional().nullable(),
  ig_days: z.number().int().min(0).max(6).optional().nullable(),
});

export const pregnancyHistorySchema = z.object({
  gesta: z.number().int().min(0).max(30).default(0),
  abortions: z.number().int().min(0).max(30).default(0),
  vaginal_births: z.number().int().min(0).max(30).default(0),
  cesarean_births: z.number().int().min(0).max(30).default(0),
  live_births: z.number().int().min(0).max(30).default(0),
  deceased_births: z.number().int().min(0).max(30).default(0),
  ectopic_pregnancies: z.number().int().min(0).max(30).default(0),
  preeclampsia: z.boolean().optional().nullable(),
  eclampsia: z.boolean().optional().nullable(),
  low_weight_births: z.number().int().min(0).max(30).default(0),
  high_weight_births: z.number().int().min(0).max(30).default(0),
  fetal_deaths: z.number().int().min(0).max(30).default(0),
  death_first_week: z.number().int().min(0).max(30).default(0),
  death_after_first_week: z.number().int().min(0).max(30).default(0),
  previous_gestation_ended_under_1year: z.boolean().optional().nullable(),
});

export const pregnancyAntecedentsSchema = z.object({
  personal: z.string().max(5000).optional().nullable(),
  obstetric: z.string().max(5000).optional().nullable(),
  family_history: z.string().max(5000).optional().nullable(),
  lifestyle: z.string().max(5000).optional().nullable(),
});

export const pregnancyVaccineItemSchema = z.object({
  vaccine_name: z.string().min(2).max(100),
  dose_label: z.string().max(80).optional().nullable(),
  taken_on: z.string().date().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const pregnancyVaccinesSchema = z.object({
  vaccines: z.array(pregnancyVaccineItemSchema).max(50),
});

export const consultationSchema = z.object({
  visit_index: z.number().int().min(1).max(500),
  visit_date: z.string().date().optional().nullable(),
  chief_complaint: z.string().max(5000).optional().nullable(),
  ig_weeks: z.number().int().min(0).max(45).optional().nullable(),
  weight_kg: z.number().min(0).max(500).optional().nullable(),
  imc: z.number().min(0).max(100).optional().nullable(),
  edema: z.string().max(500).optional().nullable(),
  blood_pressure: z.string().max(50).optional().nullable(),
  uterine_height_cm: z.number().min(0).max(80).optional().nullable(),
  fetal_presentation: z.string().max(120).optional().nullable(),
  bcf_mov_fetal: z.string().max(255).optional().nullable(),
  touch_exam: z.string().max(2000).optional().nullable(),
  diagnosis_conduct: z.string().max(5000).optional().nullable(),
  signature_name_crm: z.string().max(255).optional().nullable(),
});

export const consultationPatchSchema = consultationSchema.partial().refine((payload) => Object.keys(payload).length > 0, {
  message: "Informe ao menos um campo para atualizar",
});

export const examResultSchema = z.object({
  exam_code: z.enum(EXAM_CODES),
  collection_date: z.string().date().optional().nullable(),
  result_date: z.string().date().optional().nullable(),
  result_text: z.string().max(5000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const ultrasoundSchema = z.object({
  exam_date: z.string().date(),
  ig_dum: z.string().max(50).optional().nullable(),
  ig_usg: z.string().max(50).optional().nullable(),
  fetal_weight_g: z.number().int().min(0).max(10000).optional().nullable(),
  placenta: z.string().max(120).optional().nullable(),
  liquid: z.string().max(120).optional().nullable(),
  doppler: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const observationsSchema = z.object({
  content: z.string().min(1).max(20000),
});

export const medicationSchema = z.object({
  medication_name: z.string().min(1).max(255),
  dosage: z.string().max(255).optional().nullable(),
  frequency: z.string().max(255).optional().nullable(),
  started_on: z.string().date().optional().nullable(),
  ended_on: z.string().date().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const signedUploadSchema = z.object({
  pregnancy_id: z.uuid(),
  kind: z.enum(ATTACHMENT_KINDS),
  file_name: z.string().min(1).max(255),
  mime_type: z.string().max(100).optional().nullable(),
  consultation_id: z.uuid().optional().nullable(),
  exam_id: z.uuid().optional().nullable(),
  ultrasound_id: z.uuid().optional().nullable(),
});

export const confirmAttachmentSchema = z.object({
  pregnancy_id: z.uuid().optional().nullable(),
  consultation_id: z.uuid().optional().nullable(),
  exam_id: z.uuid().optional().nullable(),
  ultrasound_id: z.uuid().optional().nullable(),
  kind: z.enum(ATTACHMENT_KINDS),
  object_path: z.string().min(3).max(500),
  file_name: z.string().min(1).max(255),
  mime_type: z.string().max(100).optional().nullable(),
  size_bytes: z.number().int().min(0).optional().nullable(),
});
