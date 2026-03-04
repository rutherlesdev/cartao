"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertCircle,
  Baby,
  CalendarDays,
  ClipboardList,
  Download,
  FileJson,
  FileText,
  HardDriveDownload,
  HeartPulse,
  Save,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const STORAGE_KEY = "cartao-gestante-mvp-v1";
const consultas = Array.from({ length: 12 }, (_, i) => `${i + 1}ª`);
const metricasConsulta = [
  "Data",
  "Queixa principal",
  "IG semanas",
  "Peso / IMC",
  "Pressão arterial (mmHg)",
  "Altura uterina (cm)",
  "BCF / Mov. fetal",
  "Conduta",
];
const exames = [
  "ABO / RH",
  "Coombs indireto",
  "HB / HT",
  "Plaquetas",
  "Glicemia de jejum",
  "HIV / VDRL",
  "HBsAg / Anti HBs",
  "Toxoplasmose",
  "Rubéola",
  "TSH / T4 livre",
  "Urina / Urocultura",
  "Swab GBS",
];
const pregnancyTypes = ["Única", "Gemelar", "Trigemelar ou mais", "Ignorada"];
const riskTypes = ["Habitual", "Alto risco", "Planejada"];

type CardData = {
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

type FieldErrors = {
  name?: string;
  age?: string;
  city?: string;
  pregnancyType?: string;
  riskType?: string;
};

function createInitialData(): CardData {
  return {
    patient: { name: "", age: "", city: "", babyName: "" },
    pregnancyType: pregnancyTypes[0],
    riskType: riskTypes[0],
    consultations: metricasConsulta.map(() =>
      Array.from({ length: consultas.length }, () => ""),
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

function normalizeData(raw: unknown): CardData {
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
        (_, col) => parsed.consultations?.[row]?.[col] ?? "",
      ),
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
      (_, idx) => parsed.observations?.[idx] ?? "",
    ),
  };
}

function getValidationErrors(data: CardData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.patient.name.trim()) {
    errors.name = "Nome é obrigatório.";
  }
  if (!data.patient.city.trim()) {
    errors.city = "Cidade é obrigatória.";
  }
  if (!data.patient.age.trim()) {
    errors.age = "Idade é obrigatória.";
  } else {
    const numericAge = Number(data.patient.age.replace(/[^\d]/g, ""));
    if (!Number.isFinite(numericAge) || numericAge <= 10 || numericAge >= 60) {
      errors.age = "Idade deve estar entre 11 e 59 anos.";
    }
  }
  if (!pregnancyTypes.includes(data.pregnancyType)) {
    errors.pregnancyType = "Selecione um tipo de gravidez válido.";
  }
  if (!riskTypes.includes(data.riskType)) {
    errors.riskType = "Selecione uma classificação de risco válida.";
  }

  return errors;
}

function escapeSql(value: string): string {
  return value.replaceAll("'", "''");
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildSql(data: CardData): string {
  const lines: string[] = [
    "-- Cartão da Gestante MVP - export SQL",
    "BEGIN;",
    "",
    "CREATE TABLE IF NOT EXISTS mvp_patient (name TEXT, age TEXT, city TEXT, baby_name TEXT, pregnancy_type TEXT, risk_type TEXT);",
    "CREATE TABLE IF NOT EXISTS mvp_consultation (metric TEXT, consultation_number INTEGER, value TEXT);",
    "CREATE TABLE IF NOT EXISTS mvp_exam (exam_name TEXT, exam_date TEXT, result TEXT);",
    "CREATE TABLE IF NOT EXISTS mvp_ultrasound (exam_date TEXT, ig_usg TEXT, peso_fetal TEXT, placenta TEXT, liquido TEXT);",
    "CREATE TABLE IF NOT EXISTS mvp_observation (position INTEGER, note TEXT);",
    "",
    "DELETE FROM mvp_patient;",
    "DELETE FROM mvp_consultation;",
    "DELETE FROM mvp_exam;",
    "DELETE FROM mvp_ultrasound;",
    "DELETE FROM mvp_observation;",
    "",
    `INSERT INTO mvp_patient (name, age, city, baby_name, pregnancy_type, risk_type) VALUES ('${escapeSql(data.patient.name)}', '${escapeSql(data.patient.age)}', '${escapeSql(data.patient.city)}', '${escapeSql(data.patient.babyName)}', '${escapeSql(data.pregnancyType)}', '${escapeSql(data.riskType)}');`,
  ];

  metricasConsulta.forEach((metric, row) => {
    data.consultations[row].forEach((value, col) => {
      if (!value.trim()) return;
      lines.push(
        `INSERT INTO mvp_consultation (metric, consultation_number, value) VALUES ('${escapeSql(metric)}', ${col + 1}, '${escapeSql(value)}');`,
      );
    });
  });

  exames.forEach((examName, idx) => {
    const exam = data.exams[idx];
    if (!exam.date.trim() && !exam.result.trim()) return;
    lines.push(
      `INSERT INTO mvp_exam (exam_name, exam_date, result) VALUES ('${escapeSql(examName)}', '${escapeSql(exam.date)}', '${escapeSql(exam.result)}');`,
    );
  });

  data.ultrasounds.forEach((usg) => {
    if (
      !usg.date.trim() &&
      !usg.igUsg.trim() &&
      !usg.pesoFetal.trim() &&
      !usg.placenta.trim() &&
      !usg.liquido.trim()
    ) {
      return;
    }
    lines.push(
      `INSERT INTO mvp_ultrasound (exam_date, ig_usg, peso_fetal, placenta, liquido) VALUES ('${escapeSql(usg.date)}', '${escapeSql(usg.igUsg)}', '${escapeSql(usg.pesoFetal)}', '${escapeSql(usg.placenta)}', '${escapeSql(usg.liquido)}');`,
    );
  });

  data.observations.forEach((note, idx) => {
    if (!note.trim()) return;
    lines.push(
      `INSERT INTO mvp_observation (position, note) VALUES (${idx + 1}, '${escapeSql(note)}');`,
    );
  });

  lines.push("", "COMMIT;");
  return lines.join("\n");
}

function CampoLinha({
  id,
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[172px_1fr] sm:items-start">
      <Label
        htmlFor={id}
        className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
      >
        {label}
      </Label>
      <div className="space-y-1">
        <Input
          id={id}
          placeholder={placeholder}
          className="h-11 bg-white/90 text-base md:text-sm"
          value={value}
          type={type}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error ? (
          <p id={`${id}-error`} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<CardData>(createInitialData);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(normalizeData(JSON.parse(raw)));
    } catch {
      setData(createInitialData());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 900);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [data, loaded]);

  const errors = useMemo(() => getValidationErrors(data), [data]);
  const hasErrors = Object.keys(errors).length > 0;
  const completion = useMemo(() => {
    const checks = [
      data.patient.name.trim().length > 1,
      data.patient.age.trim().length > 0 && !errors.age,
      data.patient.city.trim().length > 1,
      Boolean(data.pregnancyType),
      Boolean(data.riskType),
    ];
    const ok = checks.filter(Boolean).length;
    return Math.round((ok / checks.length) * 100);
  }, [data, errors.age]);

  const quickStats = useMemo(
    () => [
      { label: "Consultas previstas", value: "12", icon: CalendarDays },
      { label: "Exames rastreados", value: `${exames.length}`, icon: ClipboardList },
      { label: "Risco atual", value: data.riskType, icon: ShieldCheck },
      { label: "Status clínico", value: "MVP local", icon: Activity },
    ],
    [data.riskType],
  );

  const saveNow = useCallback(() => {
    setSaveState("saving");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 900);
  }, [data]);

  const exportJson = useCallback(() => {
    downloadFile(
      "cartao-gestante-mvp.json",
      JSON.stringify(data, null, 2),
      "application/json",
    );
  }, [data]);

  const exportSql = useCallback(() => {
    downloadFile("cartao-gestante-mvp.sql", buildSql(data), "text/sql");
  }, [data]);

  const resetData = useCallback(() => {
    const initial = createInitialData();
    setData(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1320px] px-4 pb-28 pt-6 md:px-8 md:py-8">
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-card/80 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
            Prontuário digital
          </p>
          <h2 className="font-serif text-3xl font-semibold text-primary md:text-4xl">
            Cartão da Gestante
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="h-9 rounded-full px-4">
            Frontend com shadcn/ui
          </Badge>
          <Badge variant="outline" className="h-9 rounded-full px-4">
            Persistência local JSON
          </Badge>
          <Badge className="h-9 rounded-full bg-primary px-4 text-primary-foreground">
            <Stethoscope className="mr-1 h-4 w-4" />
            MVP
          </Badge>
        </div>
      </div>

      <Card className="surface-card mb-4">
        <CardContent className="space-y-3 py-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Progresso do cadastro mínimo</p>
            <p className="font-semibold text-primary">{completion}%</p>
          </div>
          <Progress value={completion} className="h-2.5" />
          <div className="flex items-center justify-between text-xs">
            <p className="text-muted-foreground">
              Status:{" "}
              <span className="font-medium text-foreground">
                {saveState === "saving"
                  ? "salvando..."
                  : saveState === "saved"
                    ? "salvo"
                    : "pronto"}
              </span>
            </p>
            <p className="text-muted-foreground">
              {hasErrors
                ? `${Object.keys(errors).length} validação(ões) pendente(s)`
                : "Tudo validado para exportação"}
            </p>
          </div>
        </CardContent>
      </Card>

      {hasErrors ? (
        <Card className="mb-4 border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Corrija os campos obrigatórios</p>
              <p>Nome, idade válida e cidade são necessários para um registro mínimo consistente.</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="surface-card mb-5 hidden md:block">
        <CardContent className="flex flex-wrap gap-2 py-4">
          <Button className="gap-2" onClick={saveNow}>
            <Save className="h-4 w-4" />
            Salvar local
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportJson}>
            <FileJson className="h-4 w-4" />
            Exportar JSON
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportSql} disabled={hasErrors}>
            <Download className="h-4 w-4" />
            Exportar SQL
          </Button>
          <Button variant="secondary" className="gap-2" onClick={resetData}>
            <HardDriveDownload className="h-4 w-4" />
            Resetar
          </Button>
        </CardContent>
      </Card>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="surface-card">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/10 p-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="capa" className="space-y-5">
        <TabsList className="sticky top-3 z-30 h-auto w-full justify-start gap-2 overflow-x-auto rounded-xl border border-primary/15 bg-card/95 p-2 backdrop-blur-sm">
          <TabsTrigger value="capa" className="tab-trigger-clinic">
            Capa
          </TabsTrigger>
          <TabsTrigger value="identificacao" className="tab-trigger-clinic">
            Identificação
          </TabsTrigger>
          <TabsTrigger value="consultas" className="tab-trigger-clinic">
            Consultas
          </TabsTrigger>
          <TabsTrigger value="exames" className="tab-trigger-clinic">
            Exames
          </TabsTrigger>
          <TabsTrigger value="observacoes" className="tab-trigger-clinic">
            Observações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capa">
          <Card className="surface-card surface-card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                <section className="relative overflow-hidden bg-gradient-to-br from-primary via-cyan-800 to-cyan-900 p-10 text-white">
                  <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full border border-white/30" />
                  <Badge className="mb-4 border-white/30 bg-white/20 text-white hover:bg-white/20">
                    Clínica Obstétrica
                  </Badge>
                  <h1 className="font-serif text-5xl font-semibold tracking-tight">
                    Cartão da Gestante
                  </h1>
                  <p className="mt-5 max-w-md text-white/85">
                    Acompanhamento humanizado com histórico clínico, exames e evolução pré-natal.
                  </p>
                </section>
                <section className="relative overflow-hidden bg-slate-50 p-10">
                  <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border-[24px] border-primary/20" />
                  <div className="relative space-y-8">
                    <div className="inline-flex rounded-full border border-primary/15 bg-primary/5 p-3">
                      <Baby className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary/80">
                        Pré-natal seguro
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-primary">
                        Dr. Stênio Galvão de Freitas
                      </p>
                      <p className="text-slate-600">Ginecologia, Obstetrícia e Medicina Fetal</p>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identificacao">
          <Card className="surface-card surface-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <HeartPulse className="h-5 w-5" />
                Identificação e antecedentes
              </CardTitle>
              <CardDescription>Dados essenciais da paciente e classificação clínica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CampoLinha
                id="patient-name"
                label="Nome"
                placeholder="Nome completo da gestante"
                value={data.patient.name}
                error={errors.name}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, patient: { ...prev.patient, name: value } }))
                }
              />
              <CampoLinha
                id="patient-age"
                label="Idade"
                placeholder="Ex.: 29 anos"
                value={data.patient.age}
                type="text"
                inputMode="numeric"
                error={errors.age}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, patient: { ...prev.patient, age: value } }))
                }
              />
              <CampoLinha
                id="patient-city"
                label="Cidade"
                placeholder="Cidade / UF"
                value={data.patient.city}
                error={errors.city}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, patient: { ...prev.patient, city: value } }))
                }
              />
              <CampoLinha
                id="patient-baby-name"
                label="Nome do bebê"
                placeholder="Nome planejado (opcional)"
                value={data.patient.babyName}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, patient: { ...prev.patient, babyName: value } }))
                }
              />
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-primary/15 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-primary">Tipo de gravidez</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {pregnancyTypes.map((type) => (
                      <Button
                        key={type}
                        variant={data.pregnancyType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setData((prev) => ({ ...prev, pregnancyType: type }))}
                      >
                        {type}
                      </Button>
                    ))}
                  </CardContent>
                  {errors.pregnancyType ? (
                    <p className="px-6 pb-4 text-xs text-destructive">{errors.pregnancyType}</p>
                  ) : null}
                </Card>
                <Card className="border-primary/15 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-primary">Classificação de risco</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {riskTypes.map((type) => (
                      <Button
                        key={type}
                        variant={data.riskType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setData((prev) => ({ ...prev, riskType: type }))}
                      >
                        {type}
                      </Button>
                    ))}
                  </CardContent>
                  {errors.riskType ? (
                    <p className="px-6 pb-4 text-xs text-destructive">{errors.riskType}</p>
                  ) : null}
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultas">
          <Card className="surface-card surface-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CalendarDays className="h-5 w-5" />
                Evolução em consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border border-primary/15">
                <Table className="min-w-[1120px]">
                  <TableHeader>
                    <TableRow className="bg-primary/10">
                      <TableHead className="sticky left-0 z-10 min-w-64 bg-primary/10 font-semibold text-primary">
                        Indicador
                      </TableHead>
                      {consultas.map((consulta) => (
                        <TableHead key={consulta} className="text-center font-semibold text-primary">
                          {consulta}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metricasConsulta.map((metrica, row) => (
                      <TableRow key={metrica}>
                        <TableCell className="sticky left-0 z-10 bg-card font-medium">{metrica}</TableCell>
                        {consultas.map((consulta, col) => (
                          <TableCell key={`${metrica}-${consulta}`}>
                            <Input
                              className="h-8 bg-white/95"
                              value={data.consultations[row][col]}
                              onChange={(e) =>
                                setData((prev) => ({
                                  ...prev,
                                  consultations: prev.consultations.map((line, r) =>
                                    r === row
                                      ? line.map((value, c) => (c === col ? e.target.value : value))
                                      : line,
                                  ),
                                }))
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exames">
          <Card className="surface-card surface-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <ClipboardList className="h-5 w-5" />
                Exames e ultrassonografia
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-lg border border-primary/15">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/10">
                      <TableHead className="font-semibold text-primary">Exame</TableHead>
                      <TableHead className="font-semibold text-primary">Data</TableHead>
                      <TableHead className="font-semibold text-primary">Resultado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exames.map((exame, idx) => (
                      <TableRow key={exame}>
                        <TableCell className="font-medium">{exame}</TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={data.exams[idx].date}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                exams: prev.exams.map((exam, i) =>
                                  i === idx ? { ...exam, date: e.target.value } : exam,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={data.exams[idx].result}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                exams: prev.exams.map((exam, i) =>
                                  i === idx ? { ...exam, result: e.target.value } : exam,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="rounded-lg border border-primary/15">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/10">
                      <TableHead className="font-semibold text-primary">Data</TableHead>
                      <TableHead className="font-semibold text-primary">IG USG</TableHead>
                      <TableHead className="font-semibold text-primary">Peso fetal</TableHead>
                      <TableHead className="font-semibold text-primary">Placenta</TableHead>
                      <TableHead className="font-semibold text-primary">Líquido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.ultrasounds.map((usg, row) => (
                      <TableRow key={`usg-${row + 1}`}>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={usg.date}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                ultrasounds: prev.ultrasounds.map((item, i) =>
                                  i === row ? { ...item, date: e.target.value } : item,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={usg.igUsg}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                ultrasounds: prev.ultrasounds.map((item, i) =>
                                  i === row ? { ...item, igUsg: e.target.value } : item,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={usg.pesoFetal}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                ultrasounds: prev.ultrasounds.map((item, i) =>
                                  i === row ? { ...item, pesoFetal: e.target.value } : item,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={usg.placenta}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                ultrasounds: prev.ultrasounds.map((item, i) =>
                                  i === row ? { ...item, placenta: e.target.value } : item,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={usg.liquido}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                ultrasounds: prev.ultrasounds.map((item, i) =>
                                  i === row ? { ...item, liquido: e.target.value } : item,
                                ),
                              }))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observacoes">
          <Card className="surface-card surface-card-hover">
            <CardHeader>
              <CardTitle className="text-primary">Observações e orientações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              <div className="space-y-3">
                {data.observations.map((value, idx) => (
                  <Textarea
                    key={`obs-${idx + 1}`}
                    className="min-h-12 resize-none bg-white/90"
                    placeholder={`Observação ${idx + 1}`}
                    value={value}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        observations: prev.observations.map((note, i) =>
                          i === idx ? e.target.value : note,
                        ),
                      }))
                    }
                  />
                ))}
              </div>
              <Card className="border-primary/20 bg-gradient-to-b from-primary to-cyan-900 text-primary-foreground">
                <CardContent className="space-y-4 p-6 text-center">
                  <p className="text-xl font-semibold">Cuidados essenciais</p>
                  <p className="text-sm leading-relaxed text-primary-foreground/95">
                    A maternidade é um amor que brota no ventre para desabrochar no mundo.
                    Um pré-natal regular contribui para uma gestação segura.
                  </p>
                  <ul className="space-y-2 text-sm text-primary-foreground/95">
                    <li>Alimente-se bem e mantenha hidratação.</li>
                    <li>Realize atividade física com orientação.</li>
                    <li>Não falte às consultas e exames periódicos.</li>
                    <li>Converse com a equipe sobre seu plano de parto.</li>
                  </ul>
                  <p className="pt-3 font-serif text-3xl">Seja bem-vinda!</p>
                  <div className="pt-2 text-xs text-primary-foreground/80">
                    <FileText className="mr-1 inline h-3.5 w-3.5" />
                    Dados salvos localmente em JSON ({loaded ? "carregado" : "iniciando"})
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/15 bg-background/95 p-3 backdrop-blur-sm md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-11 gap-2" onClick={saveNow}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button variant="outline" className="h-11 gap-2" onClick={exportJson}>
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={exportSql}
            disabled={hasErrors}
          >
            <Download className="h-4 w-4" />
            SQL
          </Button>
          <Button variant="secondary" className="h-11 gap-2" onClick={resetData}>
            <HardDriveDownload className="h-4 w-4" />
            Resetar
          </Button>
        </div>
      </div>
    </main>
  );
}
