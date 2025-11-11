import formationArtisans from "@/assets/formation-artisans.png";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}

export const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-formation-bg overflow-y-auto">
      {/* Main Content */}
      <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-formation-text">
              Artisans,<br />
              formez-vous<br />
              <span className="bg-formation-highlight px-2">gratuitement</span><br />
              aux réseaux<br />
              sociaux.
            </h1>
            
            <div className="text-2xl font-bold text-formation-text">
              CREACTIFS
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <img 
              src={formationArtisans} 
              alt="Artisan avec casque et téléphone" 
              className="w-full h-auto object-contain"
            />
            <div className="absolute bottom-4 right-4 bg-white px-4 py-2 font-bold text-sm">
              FINANCÉ PAR L'ÉTAT
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-start gap-4">
            {/* Logo Circle */}
            <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-formation-text mb-1">
                Artisans, profitez d'une formation aux réseaux sociaux financée par l'État, s...
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Formation Réseaux sociaux pour les artisans, financée par le gouvernement. Sans votre C...
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Sponsorisé</span> · CréActifs - Conseil et Formation Pa...
              </p>
            </div>

            {/* Menu Icon */}
            <button className="text-muted-foreground">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <a 
              href="https://creactifs.fr/formations/reseaux-sociaux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="lg" className="w-full">
                Regarder
              </Button>
            </a>
            <Button 
              onClick={() => onNavigate('online-quote')}
              size="lg" 
              className="flex-1"
            >
              Devis gratuit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};