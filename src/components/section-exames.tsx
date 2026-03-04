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
      <div className="afetus-paper rounded-2xl p-4 lg:col-span-2 lg:p-6">
        <p className="afetus-section-title mb-3 lg:text-sm">
          Exames laboratoriais
        </p>
        <div className="space-y-3 lg:hidden">
          {exames.map((exame, idx) => (
            <div key={exame} className="afetus-grid-line rounded-xl border bg-background p-3">
              <p className="mb-2 text-sm font-semibold text-foreground">{exame}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="afetus-grid-line flex flex-col gap-1 rounded-lg border bg-card p-2">
                  <span className="text-xs font-medium text-muted-foreground">Data</span>
                  <Input
                    className="rounded-lg border-transparent bg-background focus:border-primary/30 focus:bg-card"
                    placeholder="dd/mm/aaaa"
                    value={data.exams[idx].date}
                    onChange={(e) => handleExamChange(idx, "date", e.target.value)}
                  />
                </label>
                <label className="afetus-grid-line flex flex-col gap-1 rounded-lg border bg-card p-2">
                  <span className="text-xs font-medium text-muted-foreground">Resultado</span>
                  <Input
                    className="rounded-lg border-transparent bg-background focus:border-primary/30 focus:bg-card"
                    value={data.exams[idx].result}
                    onChange={(e) =>
                      handleExamChange(idx, "result", e.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-xl lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="afetus-pill text-xs font-bold uppercase tracking-wider">
                  Exame
                </TableHead>
                <TableHead className="afetus-pill text-xs font-bold uppercase tracking-wider">
                  Data
                </TableHead>
                <TableHead className="afetus-pill text-xs font-bold uppercase tracking-wider">
                  Resultado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exames.map((exame, idx) => (
                <TableRow key={exame} className="afetus-grid-line">
                  <TableCell className="afetus-grid-line border-r bg-[var(--surface-soft)] text-sm font-semibold text-foreground">
                    {exame}
                  </TableCell>
                  <TableCell className="p-1.5">
                    <Input
                      className="rounded-lg border-transparent bg-background text-sm transition-colors focus:border-primary/30 focus:bg-card"
                      placeholder="dd/mm/aaaa"
                      value={data.exams[idx].date}
                      onChange={(e) =>
                        handleExamChange(idx, "date", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="p-1.5">
                    <Input
                      className="rounded-lg border-transparent bg-background text-sm transition-colors focus:border-primary/30 focus:bg-card"
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
      <div className="afetus-paper rounded-2xl p-4 lg:col-span-2 lg:p-6">
        <p className="afetus-section-title mb-3 lg:text-sm">
          Ultrassonografias
        </p>
        <div className="space-y-3 lg:hidden">
          {data.ultrasounds.map((usg, row) => (
            <div key={`usg-mobile-${row + 1}`} className="afetus-grid-line rounded-xl border bg-background p-3">
              <p className="mb-2 text-sm font-semibold text-foreground">USG {row + 1}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    ["date", "Data", "dd/mm/aaaa"],
                    ["igUsg", "IG USG", ""],
                    ["pesoFetal", "Peso fetal", ""],
                    ["placenta", "Placenta", ""],
                    ["liquido", "Liquido", ""],
                  ] as const
                ).map(([field, label, ph]) => (
                  <label key={field} className="afetus-grid-line flex flex-col gap-1 rounded-lg border bg-card p-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {label}
                    </span>
                    <Input
                      className="rounded-lg border-transparent bg-background focus:border-primary/30 focus:bg-card"
                      placeholder={ph}
                      value={usg[field]}
                      onChange={(e) =>
                        handleUsgChange(row, field, e.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-xl lg:block">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                {["Data", "IG USG", "Peso fetal", "Placenta", "Liquido"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="afetus-pill text-xs font-bold uppercase tracking-wider"
                    >
                      {h}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.ultrasounds.map((usg, row) => (
                <TableRow key={`usg-${row + 1}`} className="afetus-grid-line">
                  {(
                    [
                      ["date", "dd/mm/aaaa"],
                      ["igUsg", ""],
                      ["pesoFetal", ""],
                      ["placenta", ""],
                      ["liquido", ""],
                    ] as const
                  ).map(([field, ph]) => (
                    <TableCell key={field} className="p-1.5">
                      <Input
                        className="rounded-lg border-transparent bg-background text-sm transition-colors focus:border-primary/30 focus:bg-card"
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
