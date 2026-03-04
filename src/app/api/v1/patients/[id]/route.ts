import { assertStaff } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { patientUpdateSchema } from "@/lib/validators/schemas";

export const GET = withAuth(async ({ supabase, context }) => {
  const params = (await context.params) ?? {};
  const patientId = getUuidParam(String(params.id), "id");

  const { data, error } = await supabase.from("patients").select("*").eq("id", patientId).single();

  if (error || !data) {
    throw ApiError.notFound("Paciente não encontrado");
  }

  return ok(data);
});

export const PATCH = withAuth(async ({ request, profile, supabase, user, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const patientId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, patientUpdateSchema);

  const { data, error } = await supabase
    .from("patients")
    .update({ ...payload, updated_by: user.id })
    .eq("id", patientId)
    .select("*")
    .single();

  if (error || !data) {
    throw ApiError.notFound("Paciente não encontrado");
  }

  return ok(data);
});
