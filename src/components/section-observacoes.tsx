"use client";

import { memo, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-card p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          Observacoes e orientacoes
        </p>
        <div className="flex flex-col gap-3">
          {data.observations.map((value, idx) => (
            <div key={`obs-${idx + 1}`} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent text-[10px] font-bold text-accent-foreground">
                {idx + 1}
              </div>
              <Textarea
                className="min-h-[42px] flex-1 resize-none rounded-xl border-transparent bg-muted/60 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/15"
                placeholder={`Observacao ${idx + 1}`}
                value={value}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Motivational card */}
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
        <p className="text-base font-bold">Maternidade e amor</p>
        <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/75">
          A maternidade e um amor que brota no ventre para desabrochar no
          mundo. Um pre-natal regular contribui para uma gestacao segura e
          tranquila.
        </p>
        <p className="mt-3 font-serif text-xl">Seja bem-vinda!</p>
        <p className="mt-1 text-[10px] text-primary-foreground/50">
          Dados salvos localmente ({loaded ? "carregado" : "iniciando"})
        </p>
      </div>
    </div>
  );
}

export const SectionObservacoes = memo(SectionObservacoesInner);
