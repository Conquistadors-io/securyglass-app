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
      </div>
    </div>
  );
};