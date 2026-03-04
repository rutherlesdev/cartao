"use client";

import { memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays } from "lucide-react";
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
          r === row
            ? line.map((v, c) => (c === col ? value : v))
            : line
        ),
      }));
    },
    [onUpdate]
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="h-4.5 w-4.5 text-primary" />
          </div>
          Evolucao em consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border">
          <Table className="min-w-[1120px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="sticky left-0 z-10 min-w-56 bg-muted/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                  Indicador
                </TableHead>
                {consultas.map((c) => (
                  <TableHead
                    key={c}
                    className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricasConsulta.map((metrica, row) => (
                <TableRow key={metrica} className="hover:bg-muted/30">
                  <TableCell className="sticky left-0 z-10 bg-card text-sm font-medium backdrop-blur-sm">
                    {metrica}
                  </TableCell>
                  {consultas.map((c, col) => (
                    <TableCell key={`${metrica}-${c}`} className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export const SectionConsultas = memo(SectionConsultasInner);
