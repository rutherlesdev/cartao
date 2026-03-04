import {
  CalendarDays,
  ClipboardList,
  HeartPulse,
  MessageSquareText,
  User,
} from "lucide-react";

export const appTabs = [
  { id: "capa", label: "Inicio", icon: HeartPulse },
  { id: "identificacao", label: "Paciente", icon: User },
  { id: "consultas", label: "Consultas", icon: CalendarDays },
  { id: "exames", label: "Exames", icon: ClipboardList },
  { id: "observacoes", label: "Notas", icon: MessageSquareText },
] as const;

export type TabId = (typeof appTabs)[number]["id"];

