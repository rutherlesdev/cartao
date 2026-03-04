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
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        className="h-12 rounded-xl border-border bg-muted/50 px-4 text-base transition-colors focus:bg-card focus:ring-2 focus:ring-primary/20"
        value={value}
        type={type}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
