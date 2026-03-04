"use client";

import { Baby, Heart, Shield, Stethoscope } from "lucide-react";

export function SectionCapa() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-primary lg:flex lg:items-stretch">
        <div className="pointer-events-none absolute -bottom-44 -right-16 hidden h-[420px] w-[420px] rounded-[50%] border-[14px] border-[#adb4bb] bg-[#f4f5f6] opacity-95 lg:block" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 hidden h-[430px] w-[430px] rounded-[50%] border border-white/30 lg:block" />
        <div className="relative px-5 pb-6 pt-6 lg:flex-1 lg:px-8 lg:py-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 lg:h-12 lg:w-12">
            <Baby className="h-5 w-5 text-primary-foreground lg:h-6 lg:w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary-foreground lg:text-3xl">
            Bem-vinda ao seu
          </h2>
          <h2 className="font-serif text-2xl font-bold text-primary-foreground lg:text-3xl">
            acompanhamento pre-natal
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/75 lg:mt-3 lg:max-w-md lg:text-base">
            Aqui voce encontra seu historico completo de consultas, exames e
            orientacoes medicas.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 border-t border-primary-foreground/10 bg-primary-foreground/5 px-5 py-3 lg:border-l lg:border-t-0 lg:px-8">
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
