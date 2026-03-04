import { assertStaff } from "@/lib/api/auth";
import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validation";
import { getPregnancyOrThrow } from "@/lib/services/pregnancy";
import { createAdminClient } from "@/lib/supabase/admin";
import { signedUploadSchema } from "@/lib/validators/schemas";

const BUCKET = "clinical-attachments";

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const POST = withAuth(async ({ request, profile, supabase }) => {
  assertStaff(profile.role);

  const payload = await parseJson(request, signedUploadSchema);
  const pregnancy = await getPregnancyOrThrow(supabase, payload.pregnancy_id);

  const cleanName = sanitizeFileName(payload.file_name);
  const objectPath = `${pregnancy.clinic_id}/${pregnancy.id}/${payload.kind}/${Date.now()}-${cleanName}`;

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(objectPath);

  if (error || !data) {
    throw new Error(error?.message ?? "Falha ao criar signed upload URL");
  }

  return ok({
    bucket: BUCKET,
    path: data.path,
    token: data.token,
    signed_url: data.signedUrl,
    object_path: objectPath,
  });
});
