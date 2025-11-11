import { Button } from "@/components/ui/button";
import thomasPhoto from "@/assets/thomas-photo.jpg";

interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}

export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-formation-bg overflow-y-auto">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-formation-primary mb-4 leading-tight">
            Formation réseaux sociaux <br />
            pour artisans <span className="text-formation-highlight">gratuitement</span>
          </h1>
          
          <div className="inline-block bg-destructive text-white px-6 py-3 rounded-lg font-bold text-lg md:text-xl mt-6 shadow-lg">
            FINANCÉ PAR L'ÉTAT
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          
          {/* Image */}
          <div className="flex justify-center">
            <img 
              src={thomasPhoto} 
              alt="Artisan professionnel" 
              className="rounded-2xl shadow-2xl w-full max-w-md"
            />
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-formation-primary">
                CREACTIFS
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Développez votre activité grâce aux réseaux sociaux avec notre formation 100% gratuite pour les artisans.
              </p>

              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-formation-accent mr-2">✓</span>
                  <span>Formation professionnelle certifiée</span>
                </li>
                <li className="flex items-start">
                  <span className="text-formation-accent mr-2">✓</span>
                  <span>Financée à 100% par l'État</span>
                </li>
                <li className="flex items-start">
                  <span className="text-formation-accent mr-2">✓</span>
                  <span>Adaptée aux artisans</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                asChild
                variant="default"
                size="lg"
                className="flex-1 text-lg"
              >
                <a href="tel:0970144344">
                  Nous contacter
                </a>
              </Button>
              
              <Button 
                onClick={() => onNavigate('online-quote')}
                variant="secondary"
                size="lg"
                className="flex-1 text-lg"
              >
                Devis gratuit
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center pt-2">
              📞 0970 144 344
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};