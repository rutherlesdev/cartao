import type { SupabaseClient } from "@supabase/supabase-js";

import { ApiError } from "@/lib/api/errors";

export async function getPregnancyOrThrow(supabase: SupabaseClient, pregnancyId: string) {
  const { data, error } = await supabase
    .from("pregnancies")
    .select("id,clinic_id,patient_id")
    .eq("id", pregnancyId)
    .single();

  if (error || !data) {
    throw ApiError.notFound("Gestação não encontrada");
  }

  return data as { id: string; clinic_id: string; patient_id: string };
}
