export const APP_ROLES = ["admin", "doctor", "secretary", "patient"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const PREGNANCY_RISKS = ["habitual", "high_risk"] as const;
export type PregnancyRisk = (typeof PREGNANCY_RISKS)[number];

export const PREGNANCY_TYPES = ["single", "twins", "triplets_or_more", "ignored"] as const;
export type PregnancyType = (typeof PREGNANCY_TYPES)[number];

export const EXAM_CODES = [
  "abo_rh",
  "coombs_indireto",
  "hb_ht",
  "plaquetas",
  "glicemia_jejum",
  "totg_75",
  "hiv",
  "vdrl",
  "hbsag",
  "anti_hbs",
  "anti_hcv",
  "toxoplasmose",
  "cmv",
  "rubeola",
  "htlv",
  "urina1",
  "urocultura",
  "tsh_t4",
  "abo_rh_pai",
  "swab_gbs",
  "outros",
] as const;
export type ExamCode = (typeof EXAM_CODES)[number];

export const ATTACHMENT_KINDS = ["exam", "ultrasound", "consultation", "other"] as const;
export type AttachmentKind = (typeof ATTACHMENT_KINDS)[number];

export type UserProfile = {
  id: string;
  user_id: string;
  clinic_id: string;
  role: AppRole;
  display_name: string | null;
};

export type AuthContext = {
  userId: string;
  profile: UserProfile;
};
