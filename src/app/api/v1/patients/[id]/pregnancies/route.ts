import { assertStaff } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/handlers";
import { created } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { pregnancyCreateSchema } from "@/lib/validators/schemas";

export const POST = withAuth(async ({ request, profile, supabase, user, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const patientId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, pregnancyCreateSchema);

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("id,clinic_id")
    .eq("id", patientId)
    .single();

  if (patientError || !patient) {
    throw ApiError.notFound("Paciente não encontrado");
  }

  const { data, error } = await supabase
    .from("pregnancies")
    .insert({
      clinic_id: patient.clinic_id,
      patient_id: patient.id,
      status: payload.status,
      started_on: payload.started_on,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Falha ao criar gestação");
  }

  return created(data);
});
