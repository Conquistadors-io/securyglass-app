import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export const CTASection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-primary overflow-hidden" ref={ref}>
      {/* Subtle glass pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="glass-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="30" height="30" fill="none" stroke="white" strokeWidth="0.5" rx="4" />
              <rect x="30" y="30" width="30" height="30" fill="none" stroke="white" strokeWidth="0.5" rx="4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#glass-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className={`text-3xl md:text-4xl font-extrabold text-white mb-4 scroll-animate ${isInView ? "in-view" : ""}`}
        >
          Prêt à simplifier votre gestion ?
        </h2>
        <p
          className={`text-lg text-white/80 mb-8 max-w-2xl mx-auto scroll-animate ${isInView ? "in-view" : ""}`}
          style={{ transitionDelay: "100ms" }}
        >
          Obtenez votre devis en quelques clics. Nos techniciens interviennent rapidement partout en France.
        </p>
        <div
          className={`scroll-animate ${isInView ? "in-view" : ""}`}
          style={{ transitionDelay: "200ms" }}
        >
          <Link to="/devis">
            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-base font-semibold bg-white text-primary hover:bg-white/90 hover:scale-[1.03] shadow-lg hover:shadow-xl transition-all"
            >
              Demander un devis gratuit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
