"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CampoLinhaProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  onChange: (value: string) => void;
}

export function CampoLinha({
  id,
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  error,
  onChange,
}: CampoLinhaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-1.5 xl:flex-row xl:items-start xl:gap-0">
        <Label
          htmlFor={id}
          className="afetus-pill inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold xl:h-11 xl:w-36 xl:rounded-r-none xl:rounded-l-lg xl:border-r-0"
        >
          {label}
        </Label>
        <div className="flex-1">
          <Input
            id={id}
            placeholder={placeholder}
            className="h-11 rounded-xl border-border bg-[#f3f4f6] px-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/15 xl:rounded-l-none xl:rounded-r-lg"
            value={value}
            type={type}
            inputMode={inputMode}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-destructive xl:pl-36"
        >
          {error}
        </p>
      )}
    </div>
  );
}
