import { Activity, CalendarDays, ClipboardList, type LucideIcon } from "lucide-react";

interface QuickStatsProps {
  riskType: string;
  examCount: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function QuickStats({ riskType, examCount }: QuickStatsProps) {
  const statsCards: StatItem[] = [
    { label: "Consultas", value: "12", icon: CalendarDays },
    { label: "Exames", value: `${examCount}`, icon: ClipboardList },
    { label: "Risco", value: riskType || "---", icon: Activity },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-2 lg:gap-3 lg:px-6 lg:pt-6">
      {statsCards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="afetus-paper flex min-w-0 shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 shadow-sm lg:min-w-[180px] lg:px-5 lg:py-4"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent lg:h-11 lg:w-11">
            <Icon className="h-4 w-4 text-accent-foreground lg:h-5 lg:w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="truncate text-sm font-bold text-foreground lg:text-base">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

