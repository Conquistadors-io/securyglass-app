import { Button } from "@/components/ui/button";
import formationArtisans from "@/assets/formation-artisans.png";
interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}
export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
      {/* Formation Artisans Banner - Full Screen */}
      <div className="relative w-full h-screen">
        <img 
          src={formationArtisans} 
          alt="Formation réseaux sociaux pour artisans financée par l'État" 
          className="w-full h-full object-contain"
        />
        {/* Real buttons overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12 lg:pb-16">
          <div className="flex flex-col sm:flex-row gap-4 w-[90%] max-w-2xl px-4">
            <a 
              href="https://creactifs.fr/formations/reseaux-sociaux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full text-base sm:text-lg font-semibold h-12 sm:h-14"
              >
                Regarder
              </Button>
            </a>
            <Button
              variant="default"
              size="lg"
              onClick={() => onNavigate('online-quote')}
              className="flex-1 text-base sm:text-lg font-semibold h-12 sm:h-14"
            >
              Devis gratuit
            </Button>
          </div>
        </div>
      </div>
    </div>;
};