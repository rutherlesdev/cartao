"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  ClipboardList,
  FileDown,
  HeartPulse,
  MessageSquareText,
  RotateCcw,
  Save,
  Stethoscope,
  User,
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
import { buildPdfHtml } from "@/lib/pdf-builder";

const STORAGE_KEY = "cartao-gestante-mvp-v1";

const tabs = [
  { id: "capa", label: "Inicio", icon: HeartPulse },
  { id: "identificacao", label: "Paciente", icon: User },
  { id: "consultas", label: "Consultas", icon: CalendarDays },
  { id: "exames", label: "Exames", icon: ClipboardList },
  { id: "observacoes", label: "Notas", icon: MessageSquareText },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("capa");
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
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [data, errors.age]);

  const handleUpdate = useCallback(
    (updater: (prev: CardData) => CardData) => setData(updater),
    []
  );

  const saveNow = useCallback(() => {
    setSaveState("saving");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 900);
  }, [data]);

  const exportPdf = useCallback(() => {
    const html = buildPdfHtml(data);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }, [data]);

  const resetData = useCallback(() => {
    const initial = createInitialData();
    setData(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Native-style status bar spacer */}
      <div className="h-[env(safe-area-inset-top)] bg-primary" />

      {/* Top app bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Cartao da Gestante</h1>
            <p className="text-[10px] font-medium leading-tight text-primary-foreground/70">
              {saveState === "saving"
                ? "Salvando..."
                : saveState === "saved"
                  ? "Salvo"
                  : "Prontuario digital"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={saveNow}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
            aria-label="Salvar"
          >
            <Save className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
            aria-label="Exportar PDF"
          >
            <FileDown className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={resetData}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
            aria-label="Resetar dados"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Progress strip */}
      <div className="bg-card px-4 pb-3 pt-3">
        <div className="flex items-center justify-between pb-1.5 text-xs">
          <span className="font-medium text-muted-foreground">
            Preenchimento
          </span>
          <span className="font-bold text-primary">{completion}%</span>
        </div>
        <Progress value={completion} className="h-1.5" />
        {hasErrors && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/8 px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
            <p className="text-xs font-medium text-destructive">
              {Object.keys(errors).length} campo(s) pendente(s)
            </p>
          </div>
        )}
      </div>

      {/* Quick stats row */}
      {activeTab === "capa" && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-1">
          {[
            { label: "Consultas", value: "12", icon: CalendarDays },
            { label: "Exames", value: `${exames.length}`, icon: ClipboardList },
            { label: "Risco", value: data.riskType || "---", icon: Activity },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-2xl bg-card px-4 py-3 shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="truncate text-sm font-bold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content area */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        <div className={activeTab === "capa" ? "block" : "hidden"}>
          <SectionCapa />
        </div>
        <div className={activeTab === "identificacao" ? "block" : "hidden"}>
          <SectionIdentificacao data={data} errors={errors} onUpdate={handleUpdate} />
        </div>
        <div className={activeTab === "consultas" ? "block" : "hidden"}>
          <SectionConsultas data={data} onUpdate={handleUpdate} />
        </div>
        <div className={activeTab === "exames" ? "block" : "hidden"}>
          <SectionExames data={data} onUpdate={handleUpdate} />
        </div>
        <div className={activeTab === "observacoes" ? "block" : "hidden"}>
          <SectionObservacoes data={data} loaded={loaded} onUpdate={handleUpdate} />
        </div>
      </main>

      {/* Native-style bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch justify-around">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                }`}
                aria-label={label}
                aria-current={active ? "page" : undefined}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    active ? "bg-primary/12" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                </div>
                <span
                  className={`text-[10px] leading-tight ${
                    active ? "font-bold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
