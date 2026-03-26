import {
  FileText,
  MapPin,
  Map,
  ClipboardCheck,
  Receipt,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    icon: FileText,
    title: "Génération de devis",
    description:
      "Devis automatique conforme assurance, généré directement depuis le formulaire client. Dashboard complet pour le gestionnaire.",
  },
  {
    icon: MapPin,
    title: "Techniciens proches",
    description:
      "Transmission automatique aux techniciens les plus proches du client pour une intervention rapide.",
  },
  {
    icon: Map,
    title: "Maps & itinéraire",
    description:
      "Itinéraire GPS intégré pour que le technicien arrive à destination sans perdre de temps.",
  },
  {
    icon: ClipboardCheck,
    title: "Interface d'interventions",
    description:
      "Validation des données de la vitre sur place : dimensions, type de vitrage, photos avant/après.",
  },
  {
    icon: Receipt,
    title: "Factures depuis devis",
    description:
      "Génération de facture en un clic à partir du devis validé. Tout le cycle commercial est couvert.",
  },
  {
    icon: Smartphone,
    title: "Paiement par SMS",
    description:
      "Lien de paiement sécurisé envoyé par SMS au client. Encaissement en direct, sans friction.",
  },
  {
    icon: BarChart3,
    title: "Dashboard technicien",
    description:
      "Chiffre d'affaires généré, nombre d'interventions, planning. Toutes les données utiles au quotidien.",
  },
];

export const Features = () => {
  const { ref, isInView } = useInView({ threshold: 0.05 });

  return (
    <section id="fonctionnalites" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 scroll-animate ${isInView ? "in-view" : ""}`}>
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
            Tout ce qu'il faut pour gérer vos interventions
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Une solution complète qui connecte clients, techniciens et gestionnaires.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:border-sky-100 hover:-translate-y-1 transition-all duration-300 scroll-animate-scale ${isInView ? "in-view" : ""}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
