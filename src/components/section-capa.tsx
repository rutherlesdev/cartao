"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, Stethoscope } from "lucide-react";

export function SectionCapa() {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <section className="relative flex flex-col justify-center bg-primary px-6 py-10 text-primary-foreground md:px-10 lg:w-1/2 lg:py-14">
            <Badge className="mb-4 w-fit border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15">
              <Stethoscope className="mr-1.5 h-3.5 w-3.5" />
              Clinica Obstetrica
            </Badge>
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              Cartao da Gestante
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80 md:text-base">
              Acompanhamento humanizado com historico clinico, exames e evolucao pre-natal.
            </p>
          </section>

          <section className="flex flex-col justify-center bg-card px-6 py-10 md:px-10 lg:w-1/2 lg:py-14">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <Baby className="h-7 w-7 text-accent-foreground" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pre-natal seguro
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
              Dr. Stenio Galvao de Freitas
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ginecologia, Obstetricia e Medicina Fetal
            </p>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
