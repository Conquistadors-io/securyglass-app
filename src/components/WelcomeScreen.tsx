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
          className="w-full h-full object-cover"
        />
        {/* Clickable buttons overlay */}
        <div className="absolute bottom-[3%] left-0 right-0 flex gap-4 px-[3%] max-w-4xl mx-auto">
          <a 
            href="https://creactifs.fr/formations/reseaux-sociaux" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 h-[50px] rounded-full opacity-0 hover:opacity-10 hover:bg-white transition-opacity"
            aria-label="Regarder la formation"
          />
          <button
            onClick={() => onNavigate('online-quote')}
            className="flex-1 h-[50px] rounded-full opacity-0 hover:opacity-10 hover:bg-white transition-opacity cursor-pointer"
            aria-label="Devis gratuit"
          />
        </div>
      </div>
    </div>;
};