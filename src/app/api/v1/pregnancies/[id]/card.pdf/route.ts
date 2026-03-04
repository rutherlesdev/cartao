import { withAuth } from "@/lib/api/handlers";
import { getUuidParam } from "@/lib/api/validation";
import { getPregnancyCardView } from "@/lib/services/pregnancy-card";
import { generatePdfFromHtml } from "@/lib/services/pdf";
import { renderCardHtml } from "@/lib/templates/card-template";

export const runtime = "nodejs";

export const GET = withAuth(async ({ supabase, context }) => {
  const params = (await context.params) ?? {};
  const pregnancyId = getUuidParam(String(params.id), "id");

  const data = await getPregnancyCardView(supabase, pregnancyId);
  const html = renderCardHtml(data);
  const pdfBuffer = await generatePdfFromHtml(html);

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cartao-gestante-${pregnancyId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
});
