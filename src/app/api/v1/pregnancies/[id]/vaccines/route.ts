import { assertStaff } from "@/lib/api/auth";
import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { getPregnancyOrThrow } from "@/lib/services/pregnancy";
import { pregnancyVaccinesSchema } from "@/lib/validators/schemas";

export const PUT = withAuth(async ({ request, profile, supabase, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, pregnancyVaccinesSchema);
  const pregnancy = await getPregnancyOrThrow(supabase, pregnancyId);

  const { error: deleteError } = await supabase.from("pregnancy_vaccines").delete().eq("pregnancy_id", pregnancy.id);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (payload.vaccines.length === 0) {
    return ok([]);
  }

  const { data, error } = await supabase
    .from("pregnancy_vaccines")
    .insert(
      payload.vaccines.map((item) => ({
        pregnancy_id: pregnancy.id,
        clinic_id: pregnancy.clinic_id,
        vaccine_name: item.vaccine_name,
        dose_label: item.dose_label,
        taken_on: item.taken_on,
        notes: item.notes,
      })),
    )
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return ok(data ?? []);
});
