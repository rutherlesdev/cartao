import { assertStaff } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { consultationPatchSchema } from "@/lib/validators/schemas";

export const PATCH = withAuth(async ({ request, profile, supabase, user, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const consultationId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, consultationPatchSchema);

  const { data, error } = await supabase
    .from("consultations")
    .update({ ...payload, updated_by: user.id })
    .eq("id", consultationId)
    .select("*")
    .single();

  if (error || !data) {
    throw ApiError.notFound("Consulta não encontrada");
  }

  return ok(data);
});
