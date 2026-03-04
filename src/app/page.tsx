"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

import type { CardData } from "@/lib/card-types";
import {
  createInitialData,
  exames,
  getValidationErrors,
  normalizeData,
} from "@/lib/card-types";

import { SectionCapa } from "@/components/section-capa";
import { SectionConsultas } from "@/components/section-consultas";
import { SectionExames } from "@/components/section-exames";
import { SectionIdentificacao } from "@/components/section-identificacao";
import { SectionObservacoes } from "@/components/section-observacoes";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomTabs } from "@/components/navigation/mobile-bottom-tabs";
import { MobileTopBar } from "@/components/navigation/mobile-top-bar";
import { ProgressSummary } from "@/components/navigation/progress-summary";
import { QuickStats } from "@/components/navigation/quick-stats";
import { appTabs, type TabId } from "@/components/navigation/tabs";
import { buildPdfHtml } from "@/lib/pdf-builder";

const STORAGE_KEY = "cartao-gestante-mvp-v1";

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
  const errorCount = Object.keys(errors).length;
  const hasErrors = errorCount > 0;

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

  const saveStatusLabel = useMemo(() => {
    if (saveState === "saving") return "Salvando...";
    if (saveState === "saved") return "Salvo";
    return "Prontuario digital";
  }, [saveState]);

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

  const activeTabLabel = appTabs.find((tab) => tab.id === activeTab)?.label;

  const renderedSection = useMemo(() => {
    if (activeTab === "capa") return <SectionCapa />;
    if (activeTab === "identificacao") {
      return <SectionIdentificacao data={data} errors={errors} onUpdate={handleUpdate} />;
    }
    if (activeTab === "consultas") {
      return <SectionConsultas data={data} onUpdate={handleUpdate} />;
    }
    if (activeTab === "exames") {
      return <SectionExames data={data} onUpdate={handleUpdate} />;
    }
    return <SectionObservacoes data={data} loaded={loaded} onUpdate={handleUpdate} />;
  }, [activeTab, data, errors, handleUpdate, loaded]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background lg:flex-row">
      <p className="sr-only" role="status" aria-live="polite">
        Status: {saveStatusLabel}
      </p>

      <DesktopSidebar
        activeTab={activeTab}
        completion={completion}
        errorCount={errorCount}
        saveStatusLabel={saveStatusLabel}
        onTabChange={setActiveTab}
        onSave={saveNow}
        onExportPdf={exportPdf}
        onReset={resetData}
      />

      <div className="flex flex-1 flex-col">
        <MobileTopBar
          saveStatusLabel={saveStatusLabel}
          onSave={saveNow}
          onExportPdf={exportPdf}
          onReset={resetData}
        />

        <ProgressSummary
          completion={completion}
          errorCount={errorCount}
          className="afetus-paper px-4 pb-3 pt-3 lg:hidden"
        />

        {activeTab === "capa" && (
          <QuickStats riskType={data.riskType} examCount={exames.length} />
        )}

        {activeTab !== "capa" && (
          <div className="hidden items-center gap-3 border-b border-border px-6 py-4 lg:flex">
            <Badge
              variant="secondary"
              className="rounded-lg px-3 py-1 text-xs font-semibold"
            >
              {activeTabLabel}
            </Badge>
            {hasErrors && (
              <Badge variant="destructive" className="rounded-lg px-3 py-1 text-xs">
                {errorCount} pendencia(s)
              </Badge>
            )}
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-3 lg:px-6 lg:pb-8 lg:pt-5">
          <div className="mx-auto w-full max-w-4xl">{renderedSection}</div>
        </main>
      </div>

      <MobileBottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

