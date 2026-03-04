import { assertStaff } from "@/lib/api/auth";
import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { getPregnancyOrThrow } from "@/lib/services/pregnancy";
import { pregnancyClinicalSnapshotSchema } from "@/lib/validators/schemas";

export const PATCH = withAuth(async ({ request, profile, supabase, user, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, pregnancyClinicalSnapshotSchema);

  const pregnancy = await getPregnancyOrThrow(supabase, pregnancyId);

  const { data, error } = await supabase
    .from("pregnancy_clinical_snapshot")
    .upsert(
      {
        pregnancy_id: pregnancy.id,
        clinic_id: pregnancy.clinic_id,
        ...payload,
        updated_by: user.id,
      },
      { onConflict: "pregnancy_id" },
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return ok(data);
});
