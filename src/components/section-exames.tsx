"use client";

import { memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
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
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardList className="h-4.5 w-4.5 text-primary" />
          </div>
          Exames e ultrassonografia
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Exames laboratoriais */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Exames laboratoriais
          </p>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Exame
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Data
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Resultado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exames.map((exame, idx) => (
                  <TableRow key={exame} className="hover:bg-muted/30">
                    <TableCell className="text-sm font-medium">
                      {exame}
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        placeholder="dd/mm/aaaa"
                        value={data.exams[idx].date}
                        onChange={(e) =>
                          handleExamChange(idx, "date", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
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

        {/* Ultrassonografias */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ultrassonografias
          </p>
          <div className="overflow-x-auto rounded-xl border">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Data
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    IG USG
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Peso fetal
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Placenta
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Liquido
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.ultrasounds.map((usg, row) => (
                  <TableRow
                    key={`usg-${row + 1}`}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        placeholder="dd/mm/aaaa"
                        value={usg.date}
                        onChange={(e) =>
                          handleUsgChange(row, "date", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        value={usg.igUsg}
                        onChange={(e) =>
                          handleUsgChange(row, "igUsg", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        value={usg.pesoFetal}
                        onChange={(e) =>
                          handleUsgChange(row, "pesoFetal", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        value={usg.placenta}
                        onChange={(e) =>
                          handleUsgChange(row, "placenta", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        className="h-9 rounded-lg border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
                        value={usg.liquido}
                        onChange={(e) =>
                          handleUsgChange(row, "liquido", e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const SectionExames = memo(SectionExamesInner);
