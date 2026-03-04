export const consultas = Array.from({ length: 12 }, (_, i) => `${i + 1}a`);

export const metricasConsulta = [
  "Data",
  "Queixa principal",
  "IG semanas",
  "Peso / IMC",
  "Pressao arterial (mmHg)",
  "Altura uterina (cm)",
  "BCF / Mov. fetal",
  "Conduta",
];

export const exames = [
  "ABO / RH",
  "Coombs indireto",
  "HB / HT",
  "Plaquetas",
  "Glicemia de jejum",
  "HIV / VDRL",
  "HBsAg / Anti HBs",
  "Toxoplasmose",
  "Rubeola",
  "TSH / T4 livre",
  "Urina / Urocultura",
  "Swab GBS",
];

export const pregnancyTypes = ["Unica", "Gemelar", "Trigemelar ou mais", "Ignorada"];
export const riskTypes = ["Habitual", "Alto risco", "Planejada"];

export type CardData = {
  patient: { name: string; age: string; city: string; babyName: string };
  pregnancyType: string;
  riskType: string;
  consultations: string[][];
  exams: { date: string; result: string }[];
  ultrasounds: {
    date: string;
    igUsg: string;
    pesoFetal: string;
    placenta: string;
    liquido: string;
  }[];
  observations: string[];
};

export type FieldErrors = {
  name?: string;
  age?: string;
  city?: string;
  pregnancyType?: string;
  riskType?: string;
};

export function createInitialData(): CardData {
  return {
    patient: { name: "", age: "", city: "", babyName: "" },
    pregnancyType: pregnancyTypes[0],
    riskType: riskTypes[0],
    consultations: metricasConsulta.map(() =>
      Array.from({ length: consultas.length }, () => "")
    ),
    exams: exames.map(() => ({ date: "", result: "" })),
    ultrasounds: Array.from({ length: 8 }, () => ({
      date: "",
      igUsg: "",
      pesoFetal: "",
      placenta: "",
      liquido: "",
    })),
    observations: Array.from({ length: 10 }, () => ""),
  };
}

export function normalizeData(raw: unknown): CardData {
  const base = createInitialData();
  if (!raw || typeof raw !== "object") return base;

  const parsed = raw as Partial<CardData>;
  return {
    ...base,
    ...parsed,
    patient: { ...base.patient, ...parsed.patient },
    consultations: metricasConsulta.map((_, row) =>
      Array.from(
        { length: consultas.length },
        (_, col) => parsed.consultations?.[row]?.[col] ?? ""
      )
    ),
    exams: exames.map((_, idx) => ({
      date: parsed.exams?.[idx]?.date ?? "",
      result: parsed.exams?.[idx]?.result ?? "",
    })),
    ultrasounds: Array.from({ length: 8 }, (_, idx) => ({
      date: parsed.ultrasounds?.[idx]?.date ?? "",
      igUsg: parsed.ultrasounds?.[idx]?.igUsg ?? "",
      pesoFetal: parsed.ultrasounds?.[idx]?.pesoFetal ?? "",
      placenta: parsed.ultrasounds?.[idx]?.placenta ?? "",
      liquido: parsed.ultrasounds?.[idx]?.liquido ?? "",
    })),
    observations: Array.from(
      { length: 10 },
      (_, idx) => parsed.observations?.[idx] ?? ""
    ),
  };
}

export function getValidationErrors(data: CardData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.patient.name.trim()) {
    errors.name = "Nome e obrigatorio.";
  }
  if (!data.patient.city.trim()) {
    errors.city = "Cidade e obrigatoria.";
  }
  if (!data.patient.age.trim()) {
    errors.age = "Idade e obrigatoria.";
  } else {
    const numericAge = Number(data.patient.age.replace(/[^\d]/g, ""));
    if (!Number.isFinite(numericAge) || numericAge <= 10 || numericAge >= 60) {
      errors.age = "Idade deve estar entre 11 e 59 anos.";
    }
  }
  if (!pregnancyTypes.includes(data.pregnancyType)) {
    errors.pregnancyType = "Selecione um tipo de gravidez valido.";
  }
  if (!riskTypes.includes(data.riskType)) {
    errors.riskType = "Selecione uma classificacao de risco valida.";
  }

  return errors;
}
