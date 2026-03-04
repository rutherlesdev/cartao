"use client";

import { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CardData } from "@/lib/card-types";
import { consultas, metricasConsulta } from "@/lib/card-types";

interface Props {
  data: CardData;
  onUpdate: (updater: (prev: CardData) => CardData) => void;
}

function SectionConsultasInner({ data, onUpdate }: Props) {
  const handleCellChange = useCallback(
    (row: number, col: number, value: string) => {
      onUpdate((prev) => ({
        ...prev,
        consultations: prev.consultations.map((line, r) =>
          r === row ? line.map((v, c) => (c === col ? value : v)) : line
        ),
      }));
    },
    [onUpdate]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="afetus-paper rounded-2xl p-4 lg:p-6">
        <p className="afetus-section-title mb-3 lg:text-sm">
          Evolucao em consultas
        </p>
        <div className="space-y-3 lg:hidden">
          {metricasConsulta.map((metrica, row) => (
            <div key={metrica} className="afetus-grid-line rounded-xl border bg-background p-3">
              <p className="mb-3 text-sm font-semibold text-foreground">{metrica}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {consultas.map((c, col) => (
                  <label key={`${metrica}-${c}`} className="afetus-grid-line flex flex-col gap-1 rounded-lg border bg-card p-2">
                    <span className="text-xs font-medium text-muted-foreground">{c}</span>
                    <Input
                      className="rounded-lg border-transparent bg-background focus:border-primary/30 focus:bg-card"
                      value={data.consultations[row][col]}
                      onChange={(e) => handleCellChange(row, col, e.target.value)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-xl lg:block">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="afetus-pill sticky left-0 z-10 min-w-[140px] rounded-tl-lg text-xs font-bold uppercase tracking-wider lg:min-w-[180px]">
                  Indicador
                </TableHead>
                {consultas.map((c) => (
                  <TableHead
                    key={c}
                    className="afetus-pill text-center text-xs font-bold uppercase tracking-wider"
                  >
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricasConsulta.map((metrica, row) => (
                <TableRow key={metrica} className="afetus-grid-line">
                  <TableCell className="afetus-grid-line sticky left-0 z-10 border-r bg-[var(--surface-soft)] text-sm font-semibold text-foreground">
                    {metrica}
                  </TableCell>
                  {consultas.map((c, col) => (
                    <TableCell key={`${metrica}-${c}`} className="p-1.5">
                      <Input
                        className="rounded-lg border-transparent bg-background text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        value={data.consultations[row][col]}
                        onChange={(e) =>
                          handleCellChange(row, col, e.target.value)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export const SectionConsultas = memo(SectionConsultasInner);
