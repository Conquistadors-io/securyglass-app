import formationArtisans from "@/assets/formation-artisans.png";
import thomasPhoto from "@/assets/thomas-photo.jpg";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}

export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Votre devis <span className="inline-block bg-yellow-400 px-4 py-2 rounded-lg">en 5 minutes</span>
            </h1>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                <img 
                  src={thomasPhoto} 
                  alt="Thomas, artisan vitrier" 
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-xl"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-6">
                  <h2 className="text-3xl md:text-5xl font-bold text-blue-900 mb-2">
                    SECURYGLASS
                  </h2>
                  <p className="text-xl text-gray-600">
                    Vitrier professionnel à votre service
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <p className="text-lg text-gray-700">Intervention rapide 24/7</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <p className="text-lg text-gray-700">Devis gratuit en ligne</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <p className="text-lg text-gray-700">Travail garanti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0970144344" className="flex-1 max-w-xs mx-auto sm:mx-0">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-16 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                <Phone className="mr-2 h-5 w-5" />
                Nous contacter
              </Button>
            </a>
            <Button 
              variant="default" 
              size="lg"
              onClick={() => onNavigate('online-quote')}
              className="flex-1 max-w-xs mx-auto sm:mx-0 h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Devis gratuit
            </Button>
          </div>

          {/* Footer badge */}
          <div className="text-center mt-8">
            <div className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              🇫🇷 Service français de qualité
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};