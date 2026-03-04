import type { SupabaseClient } from "@supabase/supabase-js";

import { ApiError } from "@/lib/api/errors";
import type { PregnancyCardView } from "@/lib/domain/card";

export async function getPregnancyCardView(
  supabase: SupabaseClient,
  pregnancyId: string,
): Promise<PregnancyCardView> {
  const { data: pregnancy, error: pregnancyError } = await supabase
    .from("pregnancies")
    .select("*")
    .eq("id", pregnancyId)
    .single();

  if (pregnancyError || !pregnancy) {
    throw ApiError.notFound("Gestação não encontrada");
  }

  const patientId = pregnancy.patient_id as string;

  const [
    patientRes,
    snapshotRes,
    historyRes,
    antecedentsRes,
    vaccinesRes,
    medsRes,
    consultationsRes,
    examsRes,
    ultrasoundsRes,
    observationsRes,
  ] = await Promise.all([
    supabase.from("patients").select("*").eq("id", patientId).single(),
    supabase.from("pregnancy_clinical_snapshot").select("*").eq("pregnancy_id", pregnancyId).maybeSingle(),
    supabase.from("pregnancy_history").select("*").eq("pregnancy_id", pregnancyId).maybeSingle(),
    supabase.from("pregnancy_antecedents").select("*").eq("pregnancy_id", pregnancyId).maybeSingle(),
    supabase.from("pregnancy_vaccines").select("*").eq("pregnancy_id", pregnancyId).order("vaccine_name", { ascending: true }),
    supabase.from("pregnancy_medications").select("*").eq("pregnancy_id", pregnancyId).order("created_at", { ascending: true }),
    supabase.from("consultations").select("*").eq("pregnancy_id", pregnancyId).order("visit_index", { ascending: true }),
    supabase.from("pregnancy_exams").select("*").eq("pregnancy_id", pregnancyId).order("collection_date", { ascending: true }),
    supabase.from("pregnancy_ultrasounds").select("*").eq("pregnancy_id", pregnancyId).order("exam_date", { ascending: true }),
    supabase.from("pregnancy_observations").select("*").eq("pregnancy_id", pregnancyId).order("created_at", { ascending: false }),
  ]);

  if (patientRes.error || !patientRes.data) {
    throw ApiError.notFound("Paciente da gestação não encontrado");
  }

  return {
    pregnancy,
    patient: patientRes.data,
    clinical_snapshot: snapshotRes.data,
    history: historyRes.data,
    antecedents: antecedentsRes.data,
    vaccines: vaccinesRes.data ?? [],
    medications: medsRes.data ?? [],
    consultations: consultationsRes.data ?? [],
    exams: examsRes.data ?? [],
    ultrasounds: ultrasoundsRes.data ?? [],
    observations: observationsRes.data ?? [],
  };
}
