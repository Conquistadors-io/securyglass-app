import formationArtisans from "@/assets/formation-artisans.png";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}

export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-background overflow-y-auto">
      {/* Formation Artisans Banner */}
      <div className="relative w-full">
        <img 
          src={formationArtisans} 
          alt="Formation artisans aux réseaux sociaux" 
          className="w-full h-auto object-cover"
        />
        
        {/* Text Overlay */}
        <div className="absolute left-4 md:left-8 top-1/3 md:top-1/4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Votre devis
          </h2>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-yellow-400 text-foreground px-2">
              en 5 minutes
            </span>
          </h2>
        </div>
      </div>
      
      {/* Buttons Section */}
      <div className="grid grid-cols-2 gap-4 px-4 py-8 md:py-12 max-w-2xl mx-auto">
        <Button 
          variant="outline" 
          size="lg"
          className="w-full text-base md:text-lg font-semibold"
          onClick={() => window.open("https://creactifs.fr/formations/reseaux-sociaux", "_blank")}
        >
          Regarder
        </Button>
        <Button 
          size="lg"
          className="w-full text-base md:text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          onClick={() => onNavigate("online-quote")}
        >
          Devis gratuit
        </Button>
      </div>
    </div>
  );
};