import type { PregnancyCardView } from "@/lib/domain/card";

function safe(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderCardHtml(payload: PregnancyCardView) {
  const consultations = payload.consultations.slice(0, 12);
  const observationsText = (payload.observations[0]?.content as string | undefined) ?? "";

  const consultationRows = consultations
    .map(
      (item) => `
      <tr>
        <td>${safe(item.visit_index)}</td>
        <td>${safe(item.visit_date)}</td>
        <td>${safe(item.chief_complaint)}</td>
        <td>${safe(item.weight_kg)}</td>
        <td>${safe(item.blood_pressure)}</td>
        <td>${safe(item.diagnosis_conduct)}</td>
        <td>${safe(item.signature_name_crm)}</td>
      </tr>
    `,
    )
    .join("");

  const examRows = payload.exams
    .map(
      (item) => `
      <tr>
        <td>${safe(item.exam_code)}</td>
        <td>${safe(item.collection_date)}</td>
        <td>${safe(item.result_text)}</td>
      </tr>
    `,
    )
    .join("");

  const ultrasoundRows = payload.ultrasounds
    .map(
      (item) => `
      <tr>
        <td>${safe(item.exam_date)}</td>
        <td>${safe(item.ig_dum)}</td>
        <td>${safe(item.ig_usg)}</td>
        <td>${safe(item.fetal_weight_g)}</td>
        <td>${safe(item.placenta)}</td>
        <td>${safe(item.liquid)}</td>
        <td>${safe(item.doppler)}</td>
      </tr>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #163040; }
    h1 { margin: 0 0 8px 0; color: #0d5c75; }
    h2 { margin: 18px 0 8px 0; color: #0d5c75; font-size: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #c8d6df; border-radius: 8px; padding: 10px; }
    .label { font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #d4dde3; padding: 4px; text-align: left; vertical-align: top; }
    th { background: #0d5c75; color: #fff; }
    .obs { white-space: pre-wrap; min-height: 140px; }
    .muted { color: #4f6472; font-size: 11px; }
  </style>
</head>
<body>
  <h1>Cartão da Gestante</h1>
  <p class="muted">Paciente: ${safe(payload.patient.full_name)} | Cidade: ${safe(payload.patient.city)} | Bebê: ${safe(payload.patient.baby_name)}</p>

  <div class="grid">
    <div class="card">
      <h2>Resumo Gestacional</h2>
      <p><span class="label">DUM:</span> ${safe(payload.clinical_snapshot?.dum)}</p>
      <p><span class="label">DPP:</span> ${safe(payload.clinical_snapshot?.dpp)}</p>
      <p><span class="label">Tipo:</span> ${safe(payload.clinical_snapshot?.pregnancy_type)}</p>
      <p><span class="label">Risco:</span> ${safe(payload.clinical_snapshot?.pregnancy_risk)}</p>
      <p><span class="label">IG:</span> ${safe(payload.clinical_snapshot?.ig_weeks)}s ${safe(payload.clinical_snapshot?.ig_days)}d</p>
    </div>
    <div class="card">
      <h2>Observações</h2>
      <div class="obs">${safe(observationsText)}</div>
    </div>
  </div>

  <h2>Consultas (primeiras 12)</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Data</th>
        <th>Queixa</th>
        <th>Peso</th>
        <th>PA</th>
        <th>Conduta</th>
        <th>Assinatura</th>
      </tr>
    </thead>
    <tbody>
      ${consultationRows}
    </tbody>
  </table>

  <h2>Exames</h2>
  <table>
    <thead>
      <tr>
        <th>Exame</th>
        <th>Data</th>
        <th>Resultado</th>
      </tr>
    </thead>
    <tbody>
      ${examRows}
    </tbody>
  </table>

  <h2>Ultrassonografia</h2>
  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>IG DUM</th>
        <th>IG USG</th>
        <th>Peso fetal</th>
        <th>Placenta</th>
        <th>Líquido</th>
        <th>Doppler</th>
      </tr>
    </thead>
    <tbody>
      ${ultrasoundRows}
    </tbody>
  </table>
</body>
</html>
  `;
}
