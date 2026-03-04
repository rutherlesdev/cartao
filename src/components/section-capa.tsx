"use client";

import { Baby, Heart, Shield, Stethoscope } from "lucide-react";

export function SectionCapa() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Hero banner */}
      <div className="overflow-hidden rounded-2xl bg-primary lg:flex lg:items-stretch">
        <div className="px-5 pb-6 pt-6 lg:flex-1 lg:px-8 lg:py-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 lg:h-12 lg:w-12">
            <Baby className="h-5 w-5 text-primary-foreground lg:h-6 lg:w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary-foreground lg:text-3xl">
            Bem-vinda ao seu
          </h2>
          <h2 className="font-serif text-2xl font-bold text-primary-foreground lg:text-3xl">
            acompanhamento pre-natal
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75 lg:mt-3 lg:max-w-md lg:text-base">
            Aqui voce encontra seu historico completo de consultas, exames e
            orientacoes medicas.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-primary-foreground/10 bg-primary-foreground/5 px-5 py-3 lg:border-l lg:border-t-0 lg:px-8">
          <Stethoscope className="h-4 w-4 text-primary-foreground/70" />
          <p className="text-xs font-medium text-primary-foreground/80 lg:text-sm">
            Dr. Stenio Galvao de Freitas
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {[
          {
            icon: Heart,
            title: "Cuidado integrado",
            desc: "Todos os dados da gestacao em um so lugar",
          },
          {
            icon: Shield,
            title: "Seguro e privado",
            desc: "Seus dados ficam protegidos no seu dispositivo",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-2 rounded-2xl bg-card p-4 lg:p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent lg:h-11 lg:w-11">
              <Icon className="h-4 w-4 text-accent-foreground lg:h-5 lg:w-5" />
            </div>
            <p className="text-sm font-bold text-foreground lg:text-base">{title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground lg:text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="rounded-2xl bg-card p-5 lg:p-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary lg:text-sm">
          Cuidados essenciais
        </p>
        <ul className="flex flex-col gap-2.5 lg:grid lg:grid-cols-2 lg:gap-3">
          {[
            "Alimente-se bem e mantenha hidratacao adequada.",
            "Realize atividade fisica com orientacao medica.",
            "Nao falte as consultas e exames periodicos.",
            "Converse com a equipe sobre seu plano de parto.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm text-foreground lg:text-base">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
