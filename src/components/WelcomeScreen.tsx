interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}

export const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-[#9CB8CC] overflow-y-auto flex items-center justify-center p-8">
      <div className="relative w-full max-w-[800px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - Text content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            <span className="text-black">Artisans,</span>
            <br />
            <span className="text-black">formez-vous</span>
            <br />
            <span className="bg-[#FFD700] text-black px-2 inline-block">gratuitement</span>
            <br />
            <span className="text-black">aux réseaux</span>
            <br />
            <span className="text-black">sociaux.</span>
          </h1>

          <div className="flex gap-4 pt-4">
            <button className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
              CREACTIFS
            </button>
            <button className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
              FINANCÉ PAR L'ÉTAT
            </button>
          </div>
        </div>

        {/* Right side - Artisan image placeholder */}
        <div className="flex justify-center items-center">
          <div className="w-full aspect-[3/4] bg-white/20 rounded-lg flex items-center justify-center text-white text-center p-8">
            <p className="text-sm">Photo d'artisan ici</p>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="md:col-span-2 flex gap-4 justify-center mt-8">
          <a 
            href="https://creactifs.fr/formations/reseaux-sociaux" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#FFD700] text-black font-bold py-4 px-8 rounded-full hover:bg-[#FFC700] transition-colors"
          >
            Regarder la formation
          </a>
          <button
            onClick={() => onNavigate('online-quote')}
            className="bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            Devis gratuit
          </button>
        </div>
      </div>
    </div>
  );
};