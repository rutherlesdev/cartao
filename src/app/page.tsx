"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Download,
  FileJson,
  HardDriveDownload,
  Save,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import type { CardData } from "@/lib/card-types";
import {
  createInitialData,
  exames,
  getValidationErrors,
  metricasConsulta,
  normalizeData,
} from "@/lib/card-types";

import { SectionCapa } from "@/components/section-capa";
import { SectionIdentificacao } from "@/components/section-identificacao";
import { SectionConsultas } from "@/components/section-consultas";
import { SectionExames } from "@/components/section-exames";
import { SectionObservacoes } from "@/components/section-observacoes";

const STORAGE_KEY = "cartao-gestante-mvp-v1";

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
    "-- Cartao da Gestante MVP - export SQL",
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
        `INSERT INTO mvp_consultation (metric, consultation_number, value) VALUES ('${escapeSql(metric)}', ${col + 1}, '${escapeSql(value)}');`
      );
    });
  });

  exames.forEach((examName, idx) => {
    const exam = data.exams[idx];
    if (!exam.date.trim() && !exam.result.trim()) return;
    lines.push(
      `INSERT INTO mvp_exam (exam_name, exam_date, result) VALUES ('${escapeSql(examName)}', '${escapeSql(exam.date)}', '${escapeSql(exam.result)}');`
    );
  });

  data.ultrasounds.forEach((usg) => {
    if (
      !usg.date.trim() &&
      !usg.igUsg.trim() &&
      !usg.pesoFetal.trim() &&
      !usg.placenta.trim() &&
      !usg.liquido.trim()
    )
      return;
    lines.push(
      `INSERT INTO mvp_ultrasound (exam_date, ig_usg, peso_fetal, placenta, liquido) VALUES ('${escapeSql(usg.date)}', '${escapeSql(usg.igUsg)}', '${escapeSql(usg.pesoFetal)}', '${escapeSql(usg.placenta)}', '${escapeSql(usg.liquido)}');`
    );
  });

  data.observations.forEach((note, idx) => {
    if (!note.trim()) return;
    lines.push(
      `INSERT INTO mvp_observation (position, note) VALUES (${idx + 1}, '${escapeSql(note)}');`
    );
  });

  lines.push("", "COMMIT;");
  return lines.join("\n");
}

export default function Home() {
  const [data, setData] = useState<CardData>(createInitialData);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

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
    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [data, errors.age]);

  const quickStats = useMemo(
    () => [
      { label: "Consultas", value: "12", icon: CalendarDays },
      { label: "Exames", value: `${exames.length}`, icon: ClipboardList },
      { label: "Risco", value: data.riskType, icon: ShieldCheck },
      { label: "Status", value: "MVP local", icon: Activity },
    ],
    [data.riskType]
  );

  const handleUpdate = useCallback(
    (updater: (prev: CardData) => CardData) => {
      setData(updater);
    },
    []
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
      "application/json"
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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-28 pt-5 md:px-6 md:pb-8 md:pt-8">
      {/* Header */}
      <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Prontuario digital
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            Cartao da Gestante
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs"
          >
            shadcn/ui
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs"
          >
            JSON local
          </Badge>
          <Badge className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
            <Stethoscope className="mr-1 h-3.5 w-3.5" />
            MVP
          </Badge>
        </div>
      </header>

      {/* Progress bar */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Progresso do cadastro</p>
            <p className="font-semibold text-primary">{completion}%</p>
          </div>
          <Progress value={completion} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              {saveState === "saving"
                ? "Salvando..."
                : saveState === "saved"
                  ? "Salvo"
                  : "Pronto"}
            </p>
            <p>
              {hasErrors
                ? `${Object.keys(errors).length} pendencia(s)`
                : "Tudo validado"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation alert */}
      {hasErrors ? (
        <Card className="mb-4 border-destructive/30 bg-destructive/5 shadow-sm">
          <CardContent className="flex items-start gap-3 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Corrija os campos obrigatorios</p>
              <p className="text-destructive/80">
                Nome, idade valida e cidade sao necessarios.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Desktop actions */}
      <div className="mb-5 hidden flex-wrap gap-2 md:flex">
        <Button size="sm" className="gap-2 rounded-full" onClick={saveNow}>
          <Save className="h-4 w-4" />
          Salvar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-full"
          onClick={exportJson}
        >
          <FileJson className="h-4 w-4" />
          Exportar JSON
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-full"
          onClick={exportSql}
          disabled={hasErrors}
        >
          <Download className="h-4 w-4" />
          Exportar SQL
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="gap-2 rounded-full"
          onClick={resetData}
        >
          <HardDriveDownload className="h-4 w-4" />
          Resetar
        </Button>
      </div>

      {/* Quick stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {label}
                </p>
                <p className="truncate text-lg font-semibold text-foreground">
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="capa" className="flex flex-col gap-5">
        <TabsList className="sticky top-0 z-30 flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border bg-card p-1.5 shadow-sm">
          <TabsTrigger
            value="capa"
            className="min-h-10 rounded-lg px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Capa
          </TabsTrigger>
          <TabsTrigger
            value="identificacao"
            className="min-h-10 rounded-lg px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Identificacao
          </TabsTrigger>
          <TabsTrigger
            value="consultas"
            className="min-h-10 rounded-lg px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Consultas
          </TabsTrigger>
          <TabsTrigger
            value="exames"
            className="min-h-10 rounded-lg px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Exames
          </TabsTrigger>
          <TabsTrigger
            value="observacoes"
            className="min-h-10 rounded-lg px-4 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Observacoes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capa">
          <SectionCapa />
        </TabsContent>

        <TabsContent value="identificacao">
          <SectionIdentificacao
            data={data}
            errors={errors}
            onUpdate={handleUpdate}
          />
        </TabsContent>

        <TabsContent value="consultas">
          <SectionConsultas data={data} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="exames">
          <SectionExames data={data} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="observacoes">
          <SectionObservacoes
            data={data}
            loaded={loaded}
            onUpdate={handleUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card p-3 shadow-[0_-4px_20px_-4px_oklch(0_0_0/0.1)] md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-11 gap-2 rounded-xl" onClick={saveNow}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl"
            onClick={exportJson}
          >
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl"
            onClick={exportSql}
            disabled={hasErrors}
          >
            <Download className="h-4 w-4" />
            SQL
          </Button>
          <Button
            variant="secondary"
            className="h-11 gap-2 rounded-xl"
            onClick={resetData}
          >
            <HardDriveDownload className="h-4 w-4" />
            Resetar
          </Button>
        </div>
      </div>
    </main>
  );
}
