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
import { exames } from "@/lib/card-types";

interface Props {
  data: CardData;
  onUpdate: (updater: (prev: CardData) => CardData) => void;
}

function SectionExamesInner({ data, onUpdate }: Props) {
  const handleExamChange = useCallback(
    (idx: number, field: "date" | "result", value: string) => {
      onUpdate((prev) => ({
        ...prev,
        exams: prev.exams.map((exam, i) =>
          i === idx ? { ...exam, [field]: value } : exam
        ),
      }));
    },
    [onUpdate]
  );

  const handleUsgChange = useCallback(
    (row: number, field: keyof CardData["ultrasounds"][0], value: string) => {
      onUpdate((prev) => ({
        ...prev,
        ultrasounds: prev.ultrasounds.map((item, i) =>
          i === row ? { ...item, [field]: value } : item
        ),
      }));
    },
    [onUpdate]
  );

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      {/* Lab exams */}
      <div className="rounded-2xl bg-card p-4 lg:col-span-2 lg:p-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary lg:text-sm">
          Exames laboratoriais
        </p>
        <div className="overflow-x-auto rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground lg:text-xs">
                  Exame
                </TableHead>
                <TableHead className="bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground lg:text-xs">
                  Data
                </TableHead>
                <TableHead className="bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground lg:text-xs">
                  Resultado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exames.map((exame, idx) => (
                <TableRow key={exame}>
                  <TableCell className="bg-muted/40 text-xs font-semibold text-foreground lg:text-sm">
                    {exame}
                  </TableCell>
                  <TableCell className="p-1 lg:p-1.5">
                    <Input
                      className="h-8 rounded-lg border-transparent bg-background text-xs transition-colors focus:border-primary/30 focus:bg-card lg:h-9 lg:text-sm"
                      placeholder="dd/mm/aaaa"
                      value={data.exams[idx].date}
                      onChange={(e) =>
                        handleExamChange(idx, "date", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="p-1 lg:p-1.5">
                    <Input
                      className="h-8 rounded-lg border-transparent bg-background text-xs transition-colors focus:border-primary/30 focus:bg-card lg:h-9 lg:text-sm"
                      value={data.exams[idx].result}
                      onChange={(e) =>
                        handleExamChange(idx, "result", e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Ultrasounds */}
      <div className="rounded-2xl bg-card p-4 lg:col-span-2 lg:p-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary lg:text-sm">
          Ultrassonografias
        </p>
        <div className="overflow-x-auto rounded-xl">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                {["Data", "IG USG", "Peso fetal", "Placenta", "Liquido"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground lg:text-xs"
                    >
                      {h}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.ultrasounds.map((usg, row) => (
                <TableRow key={`usg-${row + 1}`}>
                  {(
                    [
                      ["date", "dd/mm/aaaa"],
                      ["igUsg", ""],
                      ["pesoFetal", ""],
                      ["placenta", ""],
                      ["liquido", ""],
                    ] as const
                  ).map(([field, ph]) => (
                    <TableCell key={field} className="p-1 lg:p-1.5">
                      <Input
                        className="h-8 rounded-lg border-transparent bg-background text-xs transition-colors focus:border-primary/30 focus:bg-card lg:h-9 lg:text-sm"
                        placeholder={ph}
                        value={usg[field]}
                        onChange={(e) =>
                          handleUsgChange(row, field, e.target.value)
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

export const SectionExames = memo(SectionExamesInner);
