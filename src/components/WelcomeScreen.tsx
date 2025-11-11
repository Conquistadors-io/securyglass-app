import formationArtisans from "@/assets/formation-artisans.png";
import certificationQualite from "@/assets/certification-qualite.jpg";
import { Button } from "@/components/ui/button";
interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}
export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return <div className="min-h-screen w-full bg-background overflow-y-auto">
      {/* Formation Artisans Banner */}
      <div className="relative w-full aspect-square bg-background">
        <img src={formationArtisans} alt="Formation artisans aux réseaux sociaux" className="w-full h-full object-contain" />
        
        {/* Text Overlay */}
        <div className="absolute left-4 md:left-8 top-8 md:top-12 lg:top-16">
          <h2 className="md:text-5xl lg:text-6xl font-bold text-foreground text-4xl">
            Votre devis
          </h2>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-yellow-400 text-foreground px-2 text-3xl">
              en 5 minutes
            </span>
          </h2>
        </div>

        {/* Certification Badge */}
        <div className="absolute bottom-4 left-4">
          <img src={certificationQualite} alt="Certification Qualité" className="w-32 md:w-40 h-auto" />
        </div>
      </div>
      
      {/* Buttons Section */}
      <div className="grid grid-cols-2 gap-4 px-4 py-8 md:py-12 max-w-2xl mx-auto">
        <Button variant="outline" size="lg" className="w-full text-base md:text-lg font-semibold" onClick={() => window.open("https://creactifs.fr/formations/reseaux-sociaux", "_blank")}>
          Nous contacter
        </Button>
        <Button size="lg" className="w-full text-base md:text-lg font-semibold bg-blue-600 hover:bg-blue-700" onClick={() => onNavigate("online-quote")}>
          Devis gratuit
        </Button>
      </div>
    </div>;
};