import formationArtisans from "@/assets/formation-artisans.png";

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
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Votre devis
          </h2>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-yellow-400 text-foreground px-2">
              en 5 minutes
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};