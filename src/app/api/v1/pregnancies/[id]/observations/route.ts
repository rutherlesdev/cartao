import { assertStaff } from "@/lib/api/auth";
import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { getPregnancyOrThrow } from "@/lib/services/pregnancy";
import { observationsSchema } from "@/lib/validators/schemas";

export const PUT = withAuth(async ({ request, profile, supabase, user, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, observationsSchema);
  const pregnancy = await getPregnancyOrThrow(supabase, pregnancyId);

  const { error: clearError } = await supabase
    .from("pregnancy_observations")
    .update({ is_current: false })
    .eq("pregnancy_id", pregnancy.id)
    .eq("is_current", true);

  if (clearError) {
    throw new Error(clearError.message);
  }

  const { data, error } = await supabase
    .from("pregnancy_observations")
    .insert({
      pregnancy_id: pregnancy.id,
      clinic_id: pregnancy.clinic_id,
      content: payload.content,
      is_current: true,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return ok(data);
});
