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

  const statsCards = [
    { label: "Consultas", value: "12", icon: CalendarDays },
    { label: "Exames", value: `${exames.length}`, icon: ClipboardList },
    { label: "Risco", value: data.riskType || "---", icon: Activity },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background lg:flex-row">
      {/* ===================== DESKTOP SIDEBAR (lg+) ===================== */}
      <aside className="hidden lg:flex lg:w-72 xl:w-80 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-[#f5f6f7]">
        {/* Sidebar header */}
        <div className="flex items-center gap-3 border-b border-border bg-primary px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary-foreground leading-tight">
              Cartao da Gestante
            </h1>
            <p className="text-xs text-primary-foreground/70">
              {saveState === "saving"
                ? "Salvando..."
                : saveState === "saved"
                  ? "Salvo"
                  : "Prontuario digital"}
            </p>
          </div>
        </div>

        {/* Sidebar nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "afetus-paper text-primary"
                    : "text-muted-foreground hover:bg-[var(--surface-soft)] hover:text-foreground"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {label}
                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar progress */}
        <div className="afetus-paper border-t border-border p-4">
          <div className="flex items-center justify-between pb-2 text-xs">
            <span className="font-medium text-muted-foreground">
              Preenchimento
            </span>
            <span className="font-bold text-primary">{completion}%</span>
          </div>
          <Progress value={completion} className="h-1.5" />
          {hasErrors && (
            <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-destructive/8 px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
              <p className="text-xs font-medium text-destructive">
                {Object.keys(errors).length} campo(s) pendente(s)
              </p>
            </div>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="flex gap-2 border-t border-border p-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 rounded-xl"
            onClick={saveNow}
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 rounded-xl"
            onClick={exportPdf}
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 rounded-xl"
            onClick={resetData}
            aria-label="Resetar dados"
            title="Resetar dados"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <div className="flex flex-1 flex-col">
        {/* Mobile-only: top app bar */}
        <div className="h-[env(safe-area-inset-top)] bg-primary lg:hidden" />
        <header className="sticky top-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">
                Cartao da Gestante
              </h1>
              <p className="text-xs font-medium leading-tight text-primary-foreground/70">
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
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
              aria-label="Salvar"
              title="Salvar"
            >
              <Save className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={exportPdf}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
              aria-label="Exportar PDF"
              title="Exportar PDF"
            >
              <FileDown className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={resetData}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
              aria-label="Resetar dados"
              title="Resetar dados"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile-only: progress strip */}
        <div className="afetus-paper px-4 pb-3 pt-3 lg:hidden">
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
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 pt-4 lg:gap-4 lg:px-6 lg:pt-8 lg:pb-6">
            {statsCards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="relative afetus-paper flex min-w-0 shrink-0 flex-col gap-3 rounded-3xl px-5 py-5 shadow-md border border-primary/10 lg:min-w-[200px] lg:px-6 lg:py-6 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 lg:h-12 lg:w-12">
                    <Icon className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
                  </div>
                  <div className="h-1 w-1 rounded-full bg-primary/40" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-primary lg:text-3xl">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop top bar with breadcrumb */}
        {activeTab !== "capa" && (
          <div className="hidden items-center gap-3 border-b border-border px-6 py-4 lg:flex">
            <Badge variant="secondary" className="rounded-lg px-3 py-1 text-xs font-semibold">
              {tabs.find((t) => t.id === activeTab)?.label}
            </Badge>
            {hasErrors && (
              <Badge variant="destructive" className="rounded-lg px-3 py-1 text-xs">
                {Object.keys(errors).length} pendencia(s)
              </Badge>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-3 lg:px-6 lg:pb-8 lg:pt-5">
          <div className="mx-auto w-full max-w-4xl">
            <div className={activeTab === "capa" ? "block" : "hidden"}>
              <SectionCapa />
            </div>
            <div className={activeTab === "identificacao" ? "block" : "hidden"}>
              <SectionIdentificacao
                data={data}
                errors={errors}
                onUpdate={handleUpdate}
              />
            </div>
            <div className={activeTab === "consultas" ? "block" : "hidden"}>
              <SectionConsultas data={data} onUpdate={handleUpdate} />
            </div>
            <div className={activeTab === "exames" ? "block" : "hidden"}>
              <SectionExames data={data} onUpdate={handleUpdate} />
            </div>
            <div className={activeTab === "observacoes" ? "block" : "hidden"}>
              <SectionObservacoes
                data={data}
                loaded={loaded}
                onUpdate={handleUpdate}
              />
            </div>
          </div>
        </main>
      </div>

      {/* ===================== MOBILE BOTTOM TAB BAR ===================== */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[var(--surface-paper)] pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_10px_-2px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex min-h-14 items-stretch justify-around">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                }`}
                aria-label={label}
                aria-current={active ? "page" : undefined}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    active ? "bg-primary/15" : ""
                  }`}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </div>
                <span
                  className={`text-xs leading-tight ${
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
