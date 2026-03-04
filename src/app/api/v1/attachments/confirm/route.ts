import { assertStaff } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/handlers";
import { created } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validation";
import { getPregnancyOrThrow } from "@/lib/services/pregnancy";
import { confirmAttachmentSchema } from "@/lib/validators/schemas";

const BUCKET = "clinical-attachments";

export const POST = withAuth(async ({ request, profile, supabase, user }) => {
  assertStaff(profile.role);

  const payload = await parseJson(request, confirmAttachmentSchema);

  if (!payload.pregnancy_id) {
    throw ApiError.badRequest("pregnancy_id é obrigatório para confirmar anexo");
  }

  const pregnancy = await getPregnancyOrThrow(supabase, payload.pregnancy_id);

  const { data, error } = await supabase
    .from("attachments")
    .insert({
      clinic_id: pregnancy.clinic_id,
      pregnancy_id: payload.pregnancy_id,
      consultation_id: payload.consultation_id,
      exam_id: payload.exam_id,
      ultrasound_id: payload.ultrasound_id,
      kind: payload.kind,
      bucket: BUCKET,
      object_path: payload.object_path,
      file_name: payload.file_name,
      mime_type: payload.mime_type,
      size_bytes: payload.size_bytes,
      uploaded_by: user.id,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Falha ao confirmar anexo");
  }

  return created(data);
});
