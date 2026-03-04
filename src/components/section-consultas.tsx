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
      <div className="rounded-2xl bg-card p-4 lg:p-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary lg:text-sm">
          Evolucao em consultas
        </p>
        <div className="overflow-x-auto rounded-xl">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[140px] bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground lg:min-w-[180px] lg:text-xs">
                  Indicador
                </TableHead>
                {consultas.map((c) => (
                  <TableHead
                    key={c}
                    className="bg-primary text-center text-[10px] font-bold uppercase tracking-wider text-primary-foreground lg:text-xs"
                  >
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricasConsulta.map((metrica, row) => (
                <TableRow key={metrica}>
                  <TableCell className="sticky left-0 z-10 bg-muted text-xs font-semibold text-foreground lg:text-sm">
                    {metrica}
                  </TableCell>
                  {consultas.map((c, col) => (
                    <TableCell key={`${metrica}-${c}`} className="p-1 lg:p-1.5">
                      <Input
                        className="h-8 rounded-lg border-transparent bg-background text-xs transition-colors focus:border-primary/30 focus:bg-card lg:h-9 lg:text-sm"
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
