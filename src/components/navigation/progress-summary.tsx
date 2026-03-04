import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressSummaryProps {
  completion: number;
  errorCount: number;
  className?: string;
}

export function ProgressSummary({
  completion,
  errorCount,
  className,
}: ProgressSummaryProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between pb-2 text-xs">
        <span className="font-medium text-muted-foreground">Preenchimento</span>
        <span className="font-bold text-primary">{completion}%</span>
      </div>
      <Progress value={completion} className="h-1.5" />
      {errorCount > 0 && (
        <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-destructive/8 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
          <p className="text-xs font-medium text-destructive">
            {errorCount} campo(s) pendente(s)
          </p>
        </div>
      )}
    </div>
  );
}

