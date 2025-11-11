import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import securyglassLogo from "@/assets/securyglass-logo.png";

interface TechnicianLoginProps {
  onNavigate: (route: string) => void;
}

export const TechnicianLogin = ({ onNavigate }: TechnicianLoginProps) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    // Simuler la connexion
    onNavigate('technician-dashboard');
  };

  const handleSignUp = () => {
    // Simuler la création de compte
    onNavigate('technician-onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('welcome')}
          className="text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex flex-col items-center">
          <img src={securyglassLogo} alt="SECURYGLASS" className="h-12 w-auto mb-2" />
          <h1 className="text-xl font-bold text-white">SECURYGLASS</h1>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isSignUp ? "Créer un compte" : "Connexion"}
            </CardTitle>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Rejoignez l'équipe SECURYGLASS" 
                : "Accédez à votre espace technicien"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="Jean Dupont" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" placeholder="06 12 34 56 78" className="pl-10" />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>
            
            <Button 
              onClick={isSignUp ? handleSignUp : handleLogin}
              className="w-full" 
              size="lg"
            >
              {isSignUp ? "Créer mon compte" : "Se connecter"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground"
              >
                {isSignUp 
                  ? "Déjà un compte ? Se connecter" 
                  : "Pas encore de compte ? Créer un compte"
                }
              </Button>
            </div>

            {!isSignUp && (
              <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Mot de passe oublié ?
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-white/70 text-sm">
          Service d'urgence vitrerie disponible 24h/7j
        </p>
      </div>
    </div>
  );
};