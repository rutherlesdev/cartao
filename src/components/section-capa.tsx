"use client";

import { Baby, Heart, Shield, Stethoscope } from "lucide-react";

export function SectionCapa() {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero banner */}
      <div className="overflow-hidden rounded-2xl bg-primary">
        <div className="px-5 pb-6 pt-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Baby className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary-foreground">
            Bem-vinda ao seu
          </h2>
          <h2 className="font-serif text-2xl font-bold text-primary-foreground">
            acompanhamento pre-natal
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
            Aqui voce encontra seu historico completo de consultas, exames e
            orientacoes medicas.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-primary-foreground/10 bg-primary-foreground/5 px-5 py-3">
          <Stethoscope className="h-4 w-4 text-primary-foreground/70" />
          <p className="text-xs font-medium text-primary-foreground/80">
            Dr. Stenio Galvao de Freitas
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3">
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
            className="flex flex-col gap-2 rounded-2xl bg-card p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <Icon className="h-4 w-4 text-accent-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="rounded-2xl bg-card p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          Cuidados essenciais
        </p>
        <ul className="flex flex-col gap-2.5">
          {[
            "Alimente-se bem e mantenha hidratacao adequada.",
            "Realize atividade fisica com orientacao medica.",
            "Nao falte as consultas e exames periodicos.",
            "Converse com a equipe sobre seu plano de parto.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2.5 text-sm text-foreground">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
