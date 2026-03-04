"use client";

import { Baby, Heart, Shield, Stethoscope } from "lucide-react";

export function SectionCapa() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Hero banner with doctor info */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 lg:flex lg:items-stretch shadow-lg">
        <div className="pointer-events-none absolute -bottom-48 -right-20 hidden h-[480px] w-[480px] rounded-full border-[16px] border-primary-foreground/10 bg-gradient-to-tl from-primary-foreground/5 to-transparent opacity-40 lg:block" />
        <div className="pointer-events-none absolute -top-32 -left-32 hidden h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl lg:block" />
        
        <div className="relative px-6 py-8 lg:flex-1 lg:px-10 lg:py-10">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm lg:h-14 lg:w-14">
            <Baby className="h-6 w-6 text-primary-foreground lg:h-7 lg:w-7" />
          </div>
          
          <h2 className="font-serif text-3xl font-bold text-primary-foreground leading-tight mb-2 lg:text-4xl">
            Bem-vinda ao seu
          </h2>
          <h2 className="font-serif text-3xl font-bold text-primary-foreground leading-tight mb-4 lg:text-4xl">
            acompanhamento pré-natal
          </h2>
          
          <p className="max-w-lg text-base leading-relaxed text-primary-foreground/90 lg:max-w-2xl lg:text-lg">
            Aqui você encontra seu histórico completo de consultas, exames e
            orientações médicas em um único lugar, seguro e acessível.
          </p>
        </div>

        {/* Doctor Card */}
        <div className="relative z-10 flex flex-col gap-3 border-t border-primary-foreground/15 bg-white/95 backdrop-blur-md px-6 py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-10 lg:w-80 rounded-b-3xl lg:rounded-none lg:rounded-r-3xl">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 lg:h-20 lg:w-20">
              <Stethoscope className="h-7 w-7 text-primary lg:h-9 lg:w-9" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1">Responsável clínico</p>
              <p className="text-lg font-bold text-primary lg:text-xl">Dr. Stenio Galvão</p>
              <p className="text-xs text-foreground/70 mt-1 leading-relaxed">Ginecologia, Obstetrícia e Medicina Fetal</p>
            </div>
          </div>
          <div className="h-px bg-primary/10 my-2" />
          <p className="text-xs text-foreground/60 text-center lg:text-left">Acompanhamento especializado para sua segurança e bem-estar</p>
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
            className="afetus-paper flex flex-col gap-3 rounded-3xl p-5 lg:p-6 border border-primary/15 hover:border-primary/30 hover:shadow-md transition-all duration-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 lg:h-12 lg:w-12">
              <Icon className="h-5 w-5 text-primary lg:h-6 lg:w-6" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-foreground lg:text-lg mb-1">{title}</p>
              <p className="text-xs leading-relaxed text-foreground/75 lg:text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="afetus-paper rounded-3xl p-6 lg:p-8 border border-primary/15">
        <p className="afetus-section-title mb-4 lg:text-sm text-primary">
          Cuidados essenciais
        </p>
        <ul className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
          {[
            "Alimente-se bem e mantenha hidratacao adequada.",
            "Realize atividade fisica com orientacao medica.",
            "Nao falte as consultas e exames periodicos.",
            "Converse com a equipe sobre seu plano de parto.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-3 text-sm text-foreground font-medium lg:text-base">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
