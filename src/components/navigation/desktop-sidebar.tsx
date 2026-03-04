import { FileDown, RotateCcw, Save, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appTabs, type TabId } from "./tabs";
import { ProgressSummary } from "./progress-summary";

interface DesktopSidebarProps {
  activeTab: TabId;
  completion: number;
  errorCount: number;
  saveStatusLabel: string;
  onTabChange: (tab: TabId) => void;
  onSave: () => void;
  onExportPdf: () => void;
  onReset: () => void;
}

export function DesktopSidebar({
  activeTab,
  completion,
  errorCount,
  saveStatusLabel,
  onTabChange,
  onSave,
  onExportPdf,
  onReset,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-[#f5f6f7] xl:w-80">
      <div className="flex items-center gap-3 border-b border-border bg-primary px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
          <Stethoscope className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight text-primary-foreground">
            Cartao da Gestante
          </h1>
          <p className="text-xs text-primary-foreground/70">{saveStatusLabel}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navegacao principal">
        {appTabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "afetus-paper text-primary"
                  : "text-muted-foreground hover:bg-[var(--surface-soft)] hover:text-foreground"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {active && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      <ProgressSummary
        completion={completion}
        errorCount={errorCount}
        className="afetus-paper border-t border-border p-4"
      />

      <div className="flex gap-2 border-t border-border p-4">
        <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl" onClick={onSave}>
          <Save className="h-4 w-4" />
          Salvar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 rounded-xl"
          onClick={onExportPdf}
        >
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-xl"
          onClick={onReset}
          aria-label="Resetar dados"
          title="Resetar dados"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}

