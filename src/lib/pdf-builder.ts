import type { CardData } from "@/lib/card-types";
import { exames, metricasConsulta, consultas } from "@/lib/card-types";

function safe(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildPdfHtml(data: CardData): string {
  const consultationRows = metricasConsulta
    .map((metrica, row) => {
      const cells = consultas
        .map(
          (_, col) =>
            `<td>${safe(data.consultations[row]?.[col] ?? "")}</td>`
        )
        .join("");
      return `<tr><td class="metric">${safe(metrica)}</td>${cells}</tr>`;
    })
    .join("");

  const examRows = exames
    .map((examName, idx) => {
      const exam = data.exams[idx];
      return `<tr><td>${safe(examName)}</td><td>${safe(exam?.date)}</td><td>${safe(exam?.result)}</td></tr>`;
    })
    .join("");

  const usgRows = data.ultrasounds
    .filter((u) => u.date || u.igUsg || u.pesoFetal || u.placenta || u.liquido)
    .map(
      (u) =>
        `<tr><td>${safe(u.date)}</td><td>${safe(u.igUsg)}</td><td>${safe(u.pesoFetal)}</td><td>${safe(u.placenta)}</td><td>${safe(u.liquido)}</td></tr>`
    )
    .join("");

  const obsItems = data.observations
    .filter((o) => o.trim())
    .map((o, i) => `<li><strong>${i + 1}.</strong> ${safe(o)}</li>`)
    .join("");

  const consultaHeaders = consultas
    .map((c) => `<th>${c}</th>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Cartao da Gestante - ${safe(data.patient.name) || "Paciente"}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    color: #163040;
    font-size: 10px;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header {
    background: linear-gradient(135deg, #0d5c75 0%, #0a4f63 100%);
    color: #fff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(13, 92, 117, 0.2);
  }
  .header h1 { 
    font-size: 20px; 
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  .header p { 
    font-size: 11px; 
    opacity: 0.9;
    margin-top: 3px;
  }
  .header-info {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .header-info p {
    margin: 0;
  }
  .doctor-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    margin-top: 4px;
  }
  .patient-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 14px;
  }
  .patient-grid .item {
    background: #e8eff2;
    border-radius: 6px;
    padding: 8px 10px;
  }
  .patient-grid .item .label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #4f6472;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .patient-grid .item .value {
    font-size: 11px;
    font-weight: 600;
    color: #163040;
  }
  h2 {
    font-size: 12px;
    color: #0d5c75;
    border-bottom: 2px solid #0d5c75;
    padding-bottom: 3px;
    margin: 14px 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
    margin-bottom: 10px;
  }
  th {
    background: #0d5c75;
    color: #fff;
    padding: 5px 4px;
    text-align: left;
    font-weight: 600;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  td {
    border: 1px solid #d4dde3;
    padding: 4px;
    vertical-align: top;
  }
  .metric {
    background: #e8eff2;
    font-weight: 600;
    min-width: 120px;
  }
  tr:nth-child(even) td:not(.metric) { background: #f7fafb; }
  .obs-list { padding-left: 16px; }
  .obs-list li { margin-bottom: 4px; }
  .footer {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #c8d6df;
    text-align: center;
    color: #4f6472;
    font-size: 8px;
  }
  @media print {
    body { margin: 0; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>Cartão da Gestante</h1>
    <p>Acompanhamento pré-natal especializado</p>
    <div class="doctor-badge">Dr. Stenio Galvão de Freitas</div>
  </div>
  <div class="header-info">
    <p><strong>Emitido em:</strong></p>
    <p>${new Date().toLocaleDateString("pt-BR")}</p>
  </div>
</div>

<div class="patient-grid">
  <div class="item">
    <div class="label">Paciente</div>
    <div class="value">${safe(data.patient.name) || "---"}</div>
  </div>
  <div class="item">
    <div class="label">Idade</div>
    <div class="value">${safe(data.patient.age) || "---"}</div>
  </div>
  <div class="item">
    <div class="label">Cidade</div>
    <div class="value">${safe(data.patient.city) || "---"}</div>
  </div>
  <div class="item">
    <div class="label">Nome do bebe</div>
    <div class="value">${safe(data.patient.babyName) || "---"}</div>
  </div>
  <div class="item">
    <div class="label">Tipo de gravidez</div>
    <div class="value">${safe(data.pregnancyType) || "---"}</div>
  </div>
  <div class="item">
    <div class="label">Classificacao de risco</div>
    <div class="value">${safe(data.riskType) || "---"}</div>
  </div>
</div>

<h2>Evolucao em Consultas</h2>
<table>
  <thead><tr><th>Indicador</th>${consultaHeaders}</tr></thead>
  <tbody>${consultationRows}</tbody>
</table>

<h2>Exames Laboratoriais</h2>
<table>
  <thead><tr><th>Exame</th><th>Data</th><th>Resultado</th></tr></thead>
  <tbody>${examRows}</tbody>
</table>

${
  usgRows
    ? `<h2>Ultrassonografias</h2>
<table>
  <thead><tr><th>Data</th><th>IG USG</th><th>Peso fetal</th><th>Placenta</th><th>Liquido</th></tr></thead>
  <tbody>${usgRows}</tbody>
</table>`
    : ""
}

${
  obsItems
    ? `<h2>Observacoes</h2>
<ul class="obs-list">${obsItems}</ul>`
    : ""
}

<div class="footer">
  Cartao da Gestante &bull; Prontuario digital &bull; Documento gerado para impressao/PDF
</div>
</body>
</html>`;
}
