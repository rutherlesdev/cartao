import { assertStaff } from "@/lib/api/auth";
import { withAuth } from "@/lib/api/handlers";
import { created } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validation";
import { patientCreateSchema } from "@/lib/validators/schemas";

export const POST = withAuth(async ({ request, profile, supabase, user }) => {
  assertStaff(profile.role);

  const payload = await parseJson(request, patientCreateSchema);

  const { data, error } = await supabase
    .from("patients")
    .insert({
      clinic_id: profile.clinic_id,
      full_name: payload.full_name,
      birth_date: payload.birth_date,
      city: payload.city,
      baby_name: payload.baby_name,
      phone: payload.phone,
      notes: payload.notes,
      auth_user_id: payload.auth_user_id,
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
