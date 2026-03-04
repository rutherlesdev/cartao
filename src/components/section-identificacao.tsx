"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HeartPulse } from "lucide-react";
import { CampoLinha } from "@/components/campo-linha";
import type { CardData, FieldErrors } from "@/lib/card-types";

const pregnancyTypes = ["Unica", "Gemelar", "Trigemelar ou mais", "Ignorada"];
const riskTypes = ["Habitual", "Alto risco", "Planejada"];

interface SectionIdentificacaoProps {
  data: CardData;
  errors: FieldErrors;
  onUpdate: (updater: (prev: CardData) => CardData) => void;
}

function SectionIdentificacaoInner({
  data,
  errors,
  onUpdate,
}: SectionIdentificacaoProps) {
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
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <HeartPulse className="h-4.5 w-4.5 text-primary" />
          </div>
          Identificacao e antecedentes
        </CardTitle>
        <CardDescription>
          Dados essenciais da paciente e classificacao clinica.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CampoLinha
          id="patient-name"
          label="Nome"
          placeholder="Nome completo da gestante"
          value={data.patient.name}
          error={errors.name}
          onChange={(v) => updatePatient("name", v)}
        />
        <CampoLinha
          id="patient-age"
          label="Idade"
          placeholder="Ex.: 29 anos"
          value={data.patient.age}
          inputMode="numeric"
          error={errors.age}
          onChange={(v) => updatePatient("age", v)}
        />
        <CampoLinha
          id="patient-city"
          label="Cidade"
          placeholder="Cidade / UF"
          value={data.patient.city}
          error={errors.city}
          onChange={(v) => updatePatient("city", v)}
        />
        <CampoLinha
          id="patient-baby-name"
          label="Nome do bebe"
          placeholder="Nome planejado (opcional)"
          value={data.patient.babyName}
          onChange={(v) => updatePatient("babyName", v)}
        />

        <Separator className="my-2" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tipo de gravidez
            </p>
            <div className="flex flex-wrap gap-2">
              {pregnancyTypes.map((type) => (
                <Button
                  key={type}
                  variant={
                    data.pregnancyType === type ? "default" : "outline"
                  }
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    onUpdate((prev) => ({ ...prev, pregnancyType: type }))
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
            {errors.pregnancyType ? (
              <p className="mt-2 text-xs text-destructive">
                {errors.pregnancyType}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Classificacao de risco
            </p>
            <div className="flex flex-wrap gap-2">
              {riskTypes.map((type) => (
                <Button
                  key={type}
                  variant={data.riskType === type ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    onUpdate((prev) => ({ ...prev, riskType: type }))
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
            {errors.riskType ? (
              <p className="mt-2 text-xs text-destructive">
                {errors.riskType}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const SectionIdentificacao = memo(SectionIdentificacaoInner);
