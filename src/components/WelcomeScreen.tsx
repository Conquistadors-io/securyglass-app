import formationArtisans from "@/assets/formation-artisans.png";
import certificationQualite from "@/assets/certification-qualite.jpg";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}
export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return <div className="min-h-screen w-full bg-background overflow-y-auto">
      {/* Formation Artisans Banner */}
      <div className="relative w-full aspect-[3/4] md:aspect-square bg-background">
        <img src={formationArtisans} alt="Formation artisans aux réseaux sociaux" className="w-full h-full object-cover" />
        
        {/* Text Overlay with CTAs */}
        <div className="absolute left-4 md:left-12 lg:left-16 top-6 md:top-8 lg:top-12 max-w-sm md:max-w-2xl lg:max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">Un bris de glace? Securyglass !</h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1">
            Votre devis
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-yellow-400 text-foreground px-2 font-extrabold">
              en 5 minutes
            </span>
          </h2>
          
          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-8 mt-4">
            <Button size="lg" className="w-full text-sm md:text-base lg:text-lg font-semibold rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-10 lg:px-12 md:h-14 lg:h-16" onClick={() => onNavigate("online-quote")}>
              Devis gratuit
            </Button>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="lg" className="w-full text-sm md:text-base lg:text-lg font-semibold rounded-full border-2 bg-white text-blue-700 border-blue-600 hover:bg-blue-50 px-6 md:px-10 lg:px-12 md:h-14 lg:h-16" asChild>
                <a href="tel:0970144344" className="flex items-center justify-center gap-2">
                  <Phone size={18} className="md:w-5 md:h-5" />
                  Nous contacter
                </a>
              </Button>
              <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-foreground/80">
                <Phone size={14} className="md:w-4 md:h-4" />
                <span className="font-medium">09 70 14 43 44</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Badge */}
        <div className="absolute bottom-4 left-4">
          <img src={certificationQualite} alt="Certification Qualité" className="w-20 md:w-28 lg:w-32 h-auto" />
        </div>
      </div>
    </div>;
};