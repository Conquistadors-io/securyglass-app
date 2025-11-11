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
        <div className="absolute inset-0 flex items-end justify-center pb-[8%]">
          <div className="flex gap-[2%] w-[80%] max-w-[600px]">
            <a 
              href="https://creactifs.fr/formations/reseaux-sociaux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 h-[60px] rounded-full opacity-0 hover:opacity-20 hover:bg-white transition-opacity cursor-pointer"
              aria-label="Regarder la formation"
            />
            <button
              onClick={() => onNavigate('online-quote')}
              className="flex-1 h-[60px] rounded-full opacity-0 hover:opacity-20 hover:bg-white transition-opacity cursor-pointer"
              aria-label="Devis gratuit"
            />
          </div>
        </div>
      </div>
    </div>;
};