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
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <div className="afetus-paper rounded-2xl p-5 lg:col-span-1 lg:p-6">
        <p className="afetus-section-title mb-3 lg:text-sm">
          Observacoes e orientacoes
        </p>
        <div className="flex flex-col gap-3">
          {data.observations.slice(0, Math.ceil(data.observations.length / 2)).map((value, idx) => (
            <div key={`obs-${idx + 1}`} className="flex items-start gap-3">
              <div className="afetus-pill flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold">
                {idx + 1}
              </div>
              <Textarea
                className="min-h-[44px] flex-1 resize-none rounded-xl border-border bg-[#f3f4f6] text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/15 lg:min-h-[56px] lg:text-base"
                placeholder={`Observacao ${idx + 1}`}
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
                  <div className="afetus-pill flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold">
                    {realIdx + 1}
                  </div>
                  <Textarea
                    className="min-h-[44px] flex-1 resize-none rounded-xl border-border bg-[#f3f4f6] text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/15 lg:min-h-[56px] lg:text-base"
                    placeholder={`Observacao ${realIdx + 1}`}
                    value={value}
                    onChange={(e) => handleChange(realIdx, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-6 text-primary-foreground lg:p-8 shadow-lg">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-primary-foreground/8 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-primary-foreground/6 blur-2xl" />
          
          <div className="relative z-10 space-y-4 lg:space-y-5">
            {/* Heart icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm lg:h-14 lg:w-14">
              <svg className="h-6 w-6 text-primary-foreground lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
            
            {/* Title */}
            <div>
              <p className="text-lg font-bold tracking-tight lg:text-xl">Maternidade e amor</p>
              <p className="h-1 w-12 mt-2 rounded-full bg-primary-foreground/30" />
            </div>
            
            {/* Main text */}
            <p className="max-w-md text-sm leading-relaxed text-primary-foreground/90 lg:text-base lg:leading-relaxed">
              A maternidade é um amor que brota no ventre para desabrochar no mundo. Um pré-natal regular contribui para uma gestação segura e tranquila.
            </p>
            
            {/* Motivational message */}
            <div className="space-y-1">
              <p className="font-serif text-2xl italic font-semibold lg:text-3xl">Seja bem-vinda!</p>
              <p className="text-xs text-primary-foreground/70">
                ✓ Dados salvos localmente ({loaded ? "carregado" : "iniciando"})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SectionObservacoes = memo(SectionObservacoesInner);
