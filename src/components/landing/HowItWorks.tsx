import { FileText, Wrench, BarChart3 } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const steps = [
  {
    number: 1,
    title: "Le client déclare",
    description:
      "Formulaire guidé en 3 minutes. Type de vitre, cause du sinistre, photos. Le devis conforme assurance est généré automatiquement.",
    color: "bg-sky-500 text-white",
    lineColor: "bg-sky-300",
    icon: FileText,
  },
  {
    number: 2,
    title: "Le technicien intervient",
    description:
      "Le devis est attribué à un technicien. Il suit l'intervention depuis son espace : planning, statut, validation client.",
    color: "bg-emerald-500 text-white",
    lineColor: "bg-emerald-300",
    icon: Wrench,
  },
  {
    number: 3,
    title: "L'admin contrôle",
    description:
      "Vision globale : techniciens actifs, devis en cours, chiffre d'affaires. Tout est tracé, rien ne passe entre les mailles.",
    color: "bg-amber-400 text-white",
    lineColor: "bg-amber-200",
    icon: BarChart3,
  },
];

export const HowItWorks = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="comment-ca-marche" className="py-20 bg-sky-50/70" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 scroll-animate ${isInView ? "in-view" : ""}`}
        >
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 max-w-xl leading-tight">
            Du sinistre au remboursement, tout est fluide.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
          {/* Connecting lines (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-1 z-0">
            <div className="w-full h-full flex">
              <div className="flex-1 bg-gradient-to-r from-sky-300 to-emerald-300 rounded-full" />
              <div className="flex-1 bg-gradient-to-r from-emerald-300 to-amber-300 rounded-full" />
            </div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative z-10 flex flex-col items-center text-center scroll-animate ${isInView ? "in-view" : ""}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                {/* Icon circle */}
                <div
                  className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg mb-6 transition-transform duration-300 hover:scale-110`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
