import formationArtisans from "@/assets/formation-artisans.png";
interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}
export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return <div className="min-h-screen w-full bg-background overflow-y-auto">
      {/* Formation Artisans Banner - Full Screen */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <img src={formationArtisans} alt="Formation réseaux sociaux pour artisans financée par l'État" className="w-full h-auto max-h-screen object-contain" />
        {/* Clickable buttons overlay */}
        
      </div>
    </div>;
};