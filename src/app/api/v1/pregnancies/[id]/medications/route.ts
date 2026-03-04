import { assertStaff } from "@/lib/api/auth";
import { withAuth } from "@/lib/api/handlers";
import { created, ok } from "@/lib/api/response";
import { getUuidParam, parseJson } from "@/lib/api/validation";
import { getPregnancyOrThrow } from "@/lib/services/pregnancy";
import { medicationSchema } from "@/lib/validators/schemas";

export const GET = withAuth(async ({ supabase, context }) => {
  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");

  const { data, error } = await supabase
    .from("pregnancy_medications")
    .select("*")
    .eq("pregnancy_id", pregnancyId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ok(data ?? []);
});

export const POST = withAuth(async ({ request, profile, supabase, user, context }) => {
  assertStaff(profile.role);

  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");
  const payload = await parseJson(request, medicationSchema);
  const pregnancy = await getPregnancyOrThrow(supabase, pregnancyId);

  const { data, error } = await supabase
    .from("pregnancy_medications")
    .insert({
      pregnancy_id: pregnancy.id,
      clinic_id: pregnancy.clinic_id,
      ...payload,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created(data);
});
