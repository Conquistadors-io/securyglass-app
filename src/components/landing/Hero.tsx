import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { CheckCircle2, Clock, Phone, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-primary-dark via-primary to-primary-light"
    >
      {/* Subtle glass pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-glass" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="40" height="40" fill="none" stroke="white" strokeWidth="0.5" rx="6" />
              <rect x="40" y="40" width="40" height="40" fill="none" stroke="white" strokeWidth="0.5" rx="6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-glass)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="flex flex-col gap-5">
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] whitespace-nowrap scroll-animate ${isInView ? 'in-view' : ''}`}
            >
              Un bris de glace ?
            </h1>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight scroll-animate ${isInView ? 'in-view' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="text-yellow-300">SECURYGLASS</span>
              <span className="text-yellow-300"> !</span>
            </h2>
            <p
              className={`text-base sm:text-lg md:text-xl text-white/85 max-w-lg scroll-animate ${isInView ? 'in-view' : ''}`}
              style={{ transitionDelay: '200ms' }}
            >
              Votre devis <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">en 3 minutes</span>.
              Intervention rapide partout en France par nos techniciens certifiés.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-3 pt-3 scroll-animate ${isInView ? 'in-view' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              <Link to="/devis">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-bold bg-yellow-400 text-slate-900 hover:bg-yellow-300 hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all border-0"
                >
                  Devis gratuit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-semibold border-2 border-white/80 text-white bg-white/10 hover:bg-white/20 hover:scale-[1.02] transition-all"
                asChild
              >
                <a href="tel:0970144344" className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  09 70 14 43 44
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div
              className={`flex flex-wrap items-center gap-4 pt-1 scroll-animate ${isInView ? 'in-view' : ''}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="flex items-center gap-1.5 text-sm text-white/80">
                <Clock className="h-4 w-4 text-yellow-300" />
                <span>
                  Intervention en <strong className="text-white">24h</strong>
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <div className="flex items-center gap-1.5 text-sm text-white/80">
                <Shield className="h-4 w-4 text-yellow-300" />
                <span>
                  Techniciens <strong className="text-white">certifiés</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Static product highlights */}
          <div
            className={`hidden md:flex flex-col gap-4 scroll-animate ${isInView ? 'in-view' : ''}`}
            style={{ transitionDelay: '300ms' }}
          >
            {/* Logo card */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/25 shadow-lg">
              <div className="flex items-center gap-4 mb-5">
                <div>
                  <div className="text-white font-extrabold text-2xl tracking-tight">SECURYGLASS</div>
                  <div className="text-white/70 text-sm">Vitrerie & Miroiterie</div>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-white text-sm font-medium">Devis conforme assurance en 3 min</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-white text-sm font-medium">Techniciens certifiés partout en France</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-white text-sm font-medium">Suivi en temps réel de l'intervention</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-white text-sm font-medium">Paiement sécurisé par SMS</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/25 shadow-md text-center">
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-xs text-white/70 mt-1 font-medium">Délai moyen</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/25 shadow-md text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-white/70 mt-1 font-medium">Certifiés</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/25 shadow-md text-center">
                <div className="text-2xl font-bold text-white">🇫🇷</div>
                <div className="text-xs text-white/70 mt-1 font-medium">Toute la France</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
