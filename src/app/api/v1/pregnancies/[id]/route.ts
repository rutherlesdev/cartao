import { withAuth } from "@/lib/api/handlers";
import { ok } from "@/lib/api/response";
import { getUuidParam } from "@/lib/api/validation";
import { getPregnancyCardView } from "@/lib/services/pregnancy-card";

export const GET = withAuth(async ({ supabase, context }) => {
  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");

  const data = await getPregnancyCardView(supabase, pregnancyId);
  return ok(data);
});
