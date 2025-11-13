import formationArtisans from "@/assets/formation-artisans.png";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}
export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return <div className="min-h-screen w-full bg-background overflow-y-auto">
      {/* Formation Artisans Banner */}
      <div className="relative w-full h-screen md:aspect-square bg-background overflow-hidden">
        {/* Image de fond */}
        <img src={formationArtisans} alt="Formation artisans aux réseaux sociaux" className="w-full h-full object-cover object-[center_20%] md:object-center" />
        
        {/* Overlay léger pour contraste sur mobile */}
        <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
        
        {/* Contenu - Layout mobile flex vertical */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 md:block md:p-0">
          
          {/* Zone supérieure : Titres en haut */}
          <div className="flex flex-col pt-8 md:absolute md:left-12 lg:left-16 md:top-8 lg:top-12 md:max-w-2xl lg:max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-1">
              Un bris de glace ?
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 md:mb-6">
              Securyglass !
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-1">
              Votre devis
            </h2>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-yellow-400 text-foreground px-2 font-extrabold">
                en 5 minutes
              </span>
            </h2>
          </div>
          
          {/* Zone inférieure : Boutons CTA (bas fixe sur mobile, 2 colonnes sur desktop) */}
          <div className="flex flex-col gap-3 pb-safe md:grid md:grid-cols-2 md:gap-6 lg:gap-8 md:absolute md:left-12 lg:left-16 md:top-[420px] lg:top-[500px] md:max-w-2xl lg:max-w-4xl">
            <Button size="lg" className="w-full text-sm md:text-base lg:text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-10 lg:px-12 h-12 md:h-14 lg:h-16 gap-2" onClick={() => onNavigate("online-quote")}>
              Devis gratuit
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="lg" className="w-full text-sm md:text-base lg:text-lg font-semibold rounded-full border-2 bg-white text-blue-700 border-blue-600 hover:bg-blue-50 px-6 md:px-10 lg:px-12 h-12 md:h-14 lg:h-16" asChild>
                <a href="tel:0970144344" className="flex items-center justify-center gap-2">
                  <Phone size={18} className="md:w-5 md:h-5" />
                  09 70 14 43 44
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};