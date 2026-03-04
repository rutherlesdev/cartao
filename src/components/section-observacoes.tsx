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
    <section
      aria-labelledby="section-observacoes-title"
      className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
    >
      <h2 id="section-observacoes-title" className="sr-only">
        Notas e observacoes
      </h2>
      <div className="afetus-paper rounded-2xl p-5 lg:col-span-1 lg:p-6">
        <h3 className="afetus-section-title mb-3 lg:text-sm">
          Observacoes e orientacoes
        </h3>
        <div className="flex flex-col gap-3">
          {data.observations.slice(0, Math.ceil(data.observations.length / 2)).map((value, idx) => (
            <div key={`obs-${idx + 1}`} className="flex items-start gap-3">
              <div className="afetus-pill flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                {idx + 1}
              </div>
              <label htmlFor={`observacao-${idx + 1}`} className="sr-only">
                Observacao {idx + 1}
              </label>
              <Textarea
                id={`observacao-${idx + 1}`}
                className="afetus-field min-h-[56px] flex-1 resize-none rounded-xl border-border text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 lg:min-h-[64px] lg:text-base"
                placeholder={`Registre observacao clinica ${idx + 1}`}
                value={value}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="afetus-paper rounded-2xl p-5 lg:p-6">
          <div className="flex flex-col gap-3">
            {data.observations.slice(Math.ceil(data.observations.length / 2)).map((value, idx) => {
              const realIdx = Math.ceil(data.observations.length / 2) + idx;
              return (
                <div key={`obs-${realIdx + 1}`} className="flex items-start gap-3">
                  <div className="afetus-pill flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                    {realIdx + 1}
                  </div>
                  <label htmlFor={`observacao-${realIdx + 1}`} className="sr-only">
                    Observacao {realIdx + 1}
                  </label>
                  <Textarea
                    id={`observacao-${realIdx + 1}`}
                    className="afetus-field min-h-[56px] flex-1 resize-none rounded-xl border-border text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 lg:min-h-[64px] lg:text-base"
                    placeholder={`Registre observacao clinica ${realIdx + 1}`}
                    value={value}
                    onChange={(e) => handleChange(realIdx, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational card */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground lg:p-6">
          <div className="pointer-events-none absolute -right-14 top-14 h-40 w-40 rounded-full bg-primary-foreground/8" />
          <h3 className="text-base font-bold lg:text-lg">Maternidade e amor</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/80 lg:text-base">
            A maternidade e um amor que brota no ventre para desabrochar no
            mundo. Um pre-natal regular contribui para uma gestacao segura e
            tranquila.
          </p>
          <p className="mt-3 font-serif text-2xl italic lg:text-3xl">Seja bem-vinda!</p>
          <p className="mt-1 text-xs text-primary-foreground/70">
            Dados salvos localmente ({loaded ? "carregado" : "iniciando"})
          </p>
        </div>
      </div>
    </section>
  );
}

export const SectionObservacoes = memo(SectionObservacoesInner);
