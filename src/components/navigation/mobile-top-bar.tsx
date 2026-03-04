import { FileDown, RotateCcw, Save, Stethoscope } from "lucide-react";

interface MobileTopBarProps {
  saveStatusLabel: string;
  onSave: () => void;
  onExportPdf: () => void;
  onReset: () => void;
}

export function MobileTopBar({
  saveStatusLabel,
  onSave,
  onExportPdf,
  onReset,
}: MobileTopBarProps) {
  return (
    <>
      <div className="h-[env(safe-area-inset-top)] bg-primary lg:hidden" />
      <header className="sticky top-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Cartao da Gestante</h1>
            <p className="text-xs font-medium leading-tight text-primary-foreground/70">
              {saveStatusLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSave}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
            aria-label="Salvar"
            title="Salvar"
          >
            <Save className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
            aria-label="Exportar PDF"
            title="Exportar PDF"
          >
            <FileDown className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors active:bg-primary-foreground/20"
            aria-label="Resetar dados"
            title="Resetar dados"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>
    </>
  );
}

