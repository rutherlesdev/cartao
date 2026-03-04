"use client";

import { memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import type { CardData } from "@/lib/card-types";

interface Props {
  data: CardData;
  loaded: boolean;
  onUpdate: (updater: (prev: CardData) => CardData) => void;
}

function SectionObservacoesInner({ data, loaded, onUpdate }: Props) {
  const handleChange = useCallback(
    (idx: number, value: string) => {
      onUpdate((prev) => ({
        ...prev,
        observations: prev.observations.map((note, i) =>
          i === idx ? value : note
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
            <FileText className="h-4.5 w-4.5 text-primary" />
          </div>
          Observacoes e orientacoes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-3">
          {data.observations.map((value, idx) => (
            <Textarea
              key={`obs-${idx + 1}`}
              className="min-h-12 resize-none rounded-xl border-transparent bg-muted/40 text-sm transition-colors focus:border-primary/30 focus:bg-card"
              placeholder={`Observacao ${idx + 1}`}
              value={value}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 text-primary-foreground lg:w-80">
          <p className="text-lg font-semibold">Cuidados essenciais</p>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            A maternidade e um amor que brota no ventre para desabrochar no
            mundo. Um pre-natal regular contribui para uma gestacao segura.
          </p>
          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/85">
            <li>Alimente-se bem e mantenha hidratacao.</li>
            <li>Realize atividade fisica com orientacao.</li>
            <li>Nao falte as consultas e exames periodicos.</li>
            <li>Converse com a equipe sobre seu plano de parto.</li>
          </ul>
          <p className="pt-2 font-serif text-2xl">Seja bem-vinda!</p>
          <p className="text-xs text-primary-foreground/60">
            Dados salvos localmente ({loaded ? "carregado" : "iniciando"})
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export const SectionObservacoes = memo(SectionObservacoesInner);
