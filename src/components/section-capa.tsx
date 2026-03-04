"use client";

import {
  Baby,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
} from "lucide-react";

export function SectionCapa() {
  return (
    <section aria-labelledby="section-capa-title" className="flex flex-col gap-4 lg:gap-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-primary lg:flex lg:min-h-[460px] lg:items-stretch">
        <div className="pointer-events-none absolute -bottom-44 -right-16 hidden h-[420px] w-[420px] rounded-[50%] border-[14px] border-[#adb4bb] bg-[#f4f5f6] opacity-95 lg:block" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 hidden h-[430px] w-[430px] rounded-[50%] border border-white/30 lg:block" />
        <div className="relative px-5 pb-6 pt-6 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:px-8 lg:py-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/75">
              AfetUS Especialidades
            </p>
            <h2
              id="section-capa-title"
              className="mt-3 max-w-lg font-serif text-2xl font-bold text-primary-foreground lg:text-4xl"
            >
              Cartao da Gestante
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/80 lg:max-w-md lg:text-base">
              Acompanhe consultas, exames e orientacoes do pre-natal em um so
              lugar.
            </p>
          </div>

          <div className="mt-5 space-y-2.5 text-primary-foreground/95 lg:mt-8">
            <div className="flex items-start gap-2 text-xs lg:text-sm">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>Rua Tobias Barreto, n 189, Centro, Petrolina-PE</p>
            </div>
            <div className="flex items-center gap-2 text-xs lg:text-sm">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <p>(87) 9 9166-4735</p>
              <Instagram className="ml-2 h-3.5 w-3.5 shrink-0" />
              <p>@steniogalvaof</p>
            </div>
            <div className="flex items-center gap-2 text-xs lg:text-sm">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <p>(87) 3861-9857 | 3861-6347 | 3862-5185</p>
            </div>
            <div className="flex items-center gap-2 text-xs lg:text-sm">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <p>steniogalvaof@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="relative hidden w-[38%] border-l border-primary-foreground/10 bg-primary/35 lg:flex lg:flex-col lg:justify-between lg:p-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 lg:h-12 lg:w-12">
            <Baby className="h-5 w-5 text-primary-foreground lg:h-6 lg:w-6" />
          </div>
          <p className="max-w-[12rem] text-sm font-medium leading-relaxed text-primary-foreground/85">
            A paciente e protagonista deste momento unico.
          </p>
          <p className="font-serif text-3xl italic text-primary-foreground/80">
            Seja bem-vinda!
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 border-t border-primary-foreground/20 bg-primary/35 px-5 py-3 backdrop-blur-[1px] lg:border-l lg:border-t-0 lg:px-8">
          <Stethoscope className="h-4 w-4 text-primary-foreground/95" />
          <p className="text-xs font-semibold text-primary-foreground lg:text-sm">
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
            className="afetus-paper flex flex-col gap-2 rounded-2xl p-4 lg:p-5"
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
      <div className="afetus-paper rounded-2xl p-5 lg:p-6">
        <h3 className="afetus-section-title mb-3 lg:text-sm">
          Cuidados essenciais
        </h3>
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
    </section>
  );
}
