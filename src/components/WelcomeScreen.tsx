import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Quote, Users, Settings } from "lucide-react";
import securyglassLogo from "@/assets/securyglass-logo.png";
import formationArtisans from "@/assets/formation-artisans.png";
interface WelcomeScreenProps {
  onNavigate: (route: string) => void;
}
export const WelcomeScreen = ({
  onNavigate
}: WelcomeScreenProps) => {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  return <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header with Logo */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <div className="mb-6 animate-fade-in">
          <img src={securyglassLogo} alt="SECURYGLASS" className="h-20 w-auto" />
        </div>
        <div className="text-center animate-slide-up">
          <h1 className="text-3xl font-bold text-white mb-2">SECURYGLASS</h1>
          <p className="text-white/90 text-lg font-medium">
            Un bris de glace ? SECURYGLASS 🙂
          </p>
        </div>
      </div>

      {/* Formation Artisans Banner */}
      <div className="px-6 mb-6">
        <div className="max-w-md mx-auto relative">
          <img 
            src={formationArtisans} 
            alt="Formation réseaux sociaux pour artisans financée par l'État" 
            className="w-full rounded-lg shadow-lg"
          />
          {/* Clickable buttons overlay */}
          <div className="absolute bottom-[3%] left-0 right-0 flex gap-4 px-[3%]">
            <a 
              href="https://creactifs.fr/formations/reseaux-sociaux" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 h-[50px] rounded-full opacity-0 hover:opacity-10 hover:bg-white transition-opacity"
              aria-label="Regarder la formation"
            />
            <a 
              href="https://creactifs.fr/inscriptions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 h-[50px] rounded-full opacity-0 hover:opacity-10 hover:bg-white transition-opacity"
              aria-label="S'inscrire à la formation"
            />
          </div>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-white text-center mb-8">Choisissez votre profil</h2>

          {/* Client Card */}
          <Card className="p-6 cursor-pointer transition-all duration-300 bg-white/95 backdrop-blur shadow-card border-0" onClick={() => onNavigate('online-quote')}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Quote className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">CLIENTS</h3>
                <p className="text-sm text-gray-600">Devis automatique</p>
              </div>
            </div>
          </Card>

          {/* Technician Card */}
          <Card className="p-6 cursor-pointer transition-all duration-300 bg-white/95 backdrop-blur shadow-card border-0" onClick={() => onNavigate('technician-login')}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">TECHNICIENS</h3>
                <p className="text-sm text-gray-600">
                  Gérer mes interventions
                </p>
              </div>
            </div>
          </Card>

          {/* Admin Card */}
          <Card className="p-6 cursor-pointer transition-all duration-300 bg-white/95 backdrop-blur shadow-card border-0" onClick={() => setSelectedUserType('admin')}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">ADMIN</h3>
                <p className="text-sm text-gray-600">
                  Tableau de bord complet
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          {selectedUserType === 'client' && <div className="space-y-4 mt-8 animate-scale-in">
              <Button variant="emergency" size="lg" className="w-full" onClick={() => onNavigate('urgent-intervention')}>
                <AlertCircle className="h-5 w-5 mr-2" />
                Intervention Urgente
              </Button>
              <Button variant="outline" size="lg" className="w-full bg-white/90" onClick={() => onNavigate('online-quote')}>
                <Quote className="h-5 w-5 mr-2" />
                Devis en Ligne
              </Button>
            </div>}

          {selectedUserType === 'technician' && <div className="space-y-4 mt-8 animate-scale-in">
              <Button variant="secondary" size="lg" className="w-full" onClick={() => onNavigate('technician-onboarding')}>
                <Users className="h-5 w-5 mr-2" />
                Premier Accès - Configuration
              </Button>
              <Button variant="outline" size="lg" className="w-full bg-white/90" onClick={() => onNavigate('technician-dashboard')}>
                Accès Direct au Tableau de Bord
              </Button>
            </div>}

          {selectedUserType === 'admin' && <div className="mt-8 animate-scale-in">
              <Button variant="default" size="lg" className="w-full" onClick={() => onNavigate('admin-dashboard')}>
                <Settings className="h-5 w-5 mr-2" />
                Accéder à l'Administration
              </Button>
            </div>}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-white/70 text-sm">
          Service d'urgence vitrerie disponible 24h/7j
        </p>
      </div>
    </div>;
};