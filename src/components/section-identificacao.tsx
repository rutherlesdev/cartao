"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CampoLinha } from "@/components/campo-linha";
import type { CardData, FieldErrors } from "@/lib/card-types";

const pregnancyTypes = ["Unica", "Gemelar", "Trigemelar ou mais", "Ignorada"];
const riskTypes = ["Habitual", "Alto risco", "Planejada"];

interface Props {
  data: CardData;
  errors: FieldErrors;
  onUpdate: (updater: (prev: CardData) => CardData) => void;
}

function SectionIdentificacaoInner({ data, errors, onUpdate }: Props) {
  const updatePatient = useCallback(
    (field: keyof CardData["patient"], value: string) => {
      onUpdate((prev) => ({
        ...prev,
        patient: { ...prev.patient, [field]: value },
      }));
    },
    [onUpdate]
  );

  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      {/* Patient info */}
      <div className="afetus-paper rounded-2xl p-5 lg:p-6">
        <p className="afetus-section-title mb-4 lg:text-sm">
          Dados da paciente
        </p>
        <div className="flex flex-col gap-4">
          <CampoLinha
            id="patient-name"
            label="Nome completo"
            placeholder="Nome da gestante"
            value={data.patient.name}
            error={errors.name}
            onChange={(v) => updatePatient("name", v)}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <CampoLinha
              id="patient-age"
              label="Idade"
              placeholder="Ex.: 29"
              value={data.patient.age}
              inputMode="numeric"
              error={errors.age}
              onChange={(v) => updatePatient("age", v)}
            />
            <CampoLinha
              id="patient-city"
              label="Cidade / UF"
              placeholder="Cidade"
              value={data.patient.city}
              error={errors.city}
              onChange={(v) => updatePatient("city", v)}
            />
          </div>
          <CampoLinha
            id="patient-baby-name"
            label="Nome do bebe"
            placeholder="Nome planejado (opcional)"
            value={data.patient.babyName}
            onChange={(v) => updatePatient("babyName", v)}
          />
        </div>
      </div>

      {/* Classification */}
      <div className="afetus-paper rounded-2xl p-5 lg:p-6">
        <p className="afetus-section-title mb-4 lg:text-sm">
          Classificacao clinica
        </p>

        <div className="mb-4">
          <p className="mb-2.5 text-xs font-semibold text-muted-foreground">
            Tipo de gravidez
          </p>
          <div className="flex flex-wrap gap-2">
            {pregnancyTypes.map((type) => (
              <Button
                key={type}
                variant={data.pregnancyType === type ? "default" : "outline"}
                size="sm"
                className="rounded-xl text-sm"
                onClick={() =>
                  onUpdate((prev) => ({ ...prev, pregnancyType: type }))
                }
              >
                {type}
              </Button>
            ))}
          </div>
          {errors.pregnancyType && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.pregnancyType}
            </p>
          )}
        </div>

        <Separator className="my-4" />

        <div>
          <p className="mb-2.5 text-xs font-semibold text-muted-foreground">
            Classificacao de risco
          </p>
          <div className="flex flex-wrap gap-2">
            {riskTypes.map((type) => (
              <Button
                key={type}
                variant={data.riskType === type ? "default" : "outline"}
                size="sm"
                className="rounded-xl text-sm"
                onClick={() =>
                  onUpdate((prev) => ({ ...prev, riskType: type }))
                }
              >
                {type}
              </Button>
            ))}
          </div>
          {errors.riskType && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.riskType}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const SectionIdentificacao = memo(SectionIdentificacaoInner);
