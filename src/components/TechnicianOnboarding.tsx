import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhotoCapture } from "@/components/ui/photo-capture";
import { ChevronRight, ChevronLeft, Check, Star, Calendar, MapPin, Euro, Camera, Phone, Clock, Shield } from "lucide-react";

interface TechnicianOnboardingProps {
  onComplete: () => void;
  onNavigate: (route: string) => void;
}

export const TechnicianOnboarding = ({ onComplete, onNavigate }: TechnicianOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    zone: "",
    weekendWork: false,
    emergencyWork: false,
    photo: null as string | null
  });

  const handlePhotoSelect = (file: File, previewUrl: string) => {
    setProfile({...profile, photo: previewUrl});
  };

  const steps = [
    {
      id: "welcome",
      title: "Bienvenue chez SECURYGLASS",
      subtitle: "Votre nouvelle plateforme de gestion des interventions",
      icon: <Star className="h-12 w-12 text-primary" />,
      content: (
        <div className="text-center space-y-4">
          <div className="bg-gradient-primary text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Star className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Bienvenue dans l'équipe !</h2>
          <p className="text-muted-foreground">
            Vous allez découvrir comment gérer vos interventions, 
            optimiser vos tournées et suivre vos gains en temps réel.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-primary font-medium">
              🚀 Prêt à commencer votre aventure avec SECURYGLASS ?
            </p>
          </div>
        </div>
      )
    },
    {
      id: "profile",
      title: "Votre profil technicien",
      subtitle: "Configurons vos informations personnelles",
      icon: <Camera className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              {profile.photo ? (
                <AvatarImage src={profile.photo} alt="Photo de profil" />
              ) : (
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'TC'}
                </AvatarFallback>
              )}
            </Avatar>
            <PhotoCapture onPhotoSelect={handlePhotoSelect}>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                {profile.photo ? 'Changer la photo' : 'Ajouter une photo'}
              </Button>
            </PhotoCapture>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                placeholder="Thomas Carpentier"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                placeholder="06 12 34 56 78"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="thomas@example.com"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="zone">Zone d'intervention *</Label>
              <Input
                id="zone"
                placeholder="Paris 1er-8e"
                value={profile.zone}
                onChange={(e) => setProfile({...profile, zone: e.target.value})}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "preferences",
      title: "Vos préférences de travail",
      subtitle: "Définissez votre disponibilité",
      icon: <Clock className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="bg-secondary/10 p-4 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">Disponibilités</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Travail le weekend</Label>
                  <p className="text-xs text-muted-foreground">Accepter les interventions samedi et dimanche</p>
                </div>
                <Switch 
                  checked={profile.weekendWork}
                  onCheckedChange={(checked) => setProfile({...profile, weekendWork: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Urgences 24h/24</Label>
                  <p className="text-xs text-muted-foreground">Recevoir les interventions d'urgence</p>
                </div>
                <Switch 
                  checked={profile.emergencyWork}
                  onCheckedChange={(checked) => setProfile({...profile, emergencyWork: checked})}
                />
              </div>
            </div>
          </div>

          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <Euro className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Potentiel de gains</span>
            </div>
            <p className="text-sm text-green-700">
              Avec vos préférences actuelles, vous pourriez gagner jusqu'à{' '}
              <span className="font-bold">
                {profile.weekendWork && profile.emergencyWork ? '3500€' : 
                 profile.weekendWork || profile.emergencyWork ? '2800€' : '2200€'}
              </span> par mois.
            </p>
          </Card>
        </div>
      )
    },
    {
      id: "features",
      title: "Découvrez vos outils",
      subtitle: "Les fonctionnalités qui vont vous simplifier la vie",
      icon: <Shield className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="grid gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Planning intelligent</h4>
                  <p className="text-sm text-muted-foreground">Gérez vos RDV et optimisez vos tournées</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Navigation GPS</h4>
                  <p className="text-sm text-muted-foreground">Itinéraires optimisés vers vos clients</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Euro className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Suivi des gains</h4>
                  <p className="text-sm text-muted-foreground">Tableaux de bord et objectifs</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-lg p-2">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Communication client</h4>
                  <p className="text-sm text-muted-foreground">Appels et SMS intégrés</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "complete",
      title: "Tout est prêt !",
      subtitle: "Votre profil est configuré, vous pouvez commencer",
      icon: <Check className="h-12 w-12 text-green-600" />,
      content: (
        <div className="text-center space-y-6">
          <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <Check className="h-10 w-10" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Félicitations {profile.name.split(' ')[0]} !</h2>
            <p className="text-muted-foreground">
              Votre profil est maintenant configuré. Vous êtes prêt à recevoir vos premières interventions.
            </p>
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="font-medium text-foreground mb-3">Récapitulatif de votre profil</h3>
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zone :</span>
                <span className="font-medium">{profile.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekend :</span>
                <span className="font-medium">{profile.weekendWork ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Urgences 24h :</span>
                <span className="font-medium">{profile.emergencyWork ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={onComplete}
            >
              Accéder au tableau de bord
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => onNavigate("technician-planning")}
            >
              Voir mon planning
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const canProceed = currentStep === 0 || 
                    (currentStep === 1 && profile.name && profile.phone && profile.zone) ||
                    currentStep > 1;

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-lg font-semibold text-foreground">Configuration initiale</h1>
            <div className="text-sm text-muted-foreground">
              Étape {currentStep + 1} sur {steps.length}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 pb-32">{/* Added pb-32 for bottom padding */}
        <Card className="p-6 animate-fade-in">
          <div className="text-center mb-6">
            {currentStepData.icon}
            <h2 className="text-xl font-bold text-foreground mt-4 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentStepData.subtitle}
            </p>
          </div>
          
          {currentStepData.content}
        </Card>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-4 left-4 right-4 space-y-3">
        {!isLastStep && (
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentStep === 0 ? 'Commencer' : 'Continuer'}
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        )}
        
        {!isFirstStep && !isLastStep && (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>
        )}
      </div>
    </div>
  );
};