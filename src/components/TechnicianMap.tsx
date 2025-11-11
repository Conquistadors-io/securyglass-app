import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Navigation, MapPin, Phone, Clock, Car } from "lucide-react";

interface TechnicianMapProps {
  onNavigate: (route: string) => void;
}

export const TechnicianMap = ({ onNavigate }: TechnicianMapProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  // Simulé les interventions avec coordonnées
  const interventions = [
    {
      id: 1,
      client: "Marie Dupont",
      address: "15 rue Victor Hugo, 75001 Paris",
      type: "Vitre cassée",
      status: "confirmed",
      time: "14:30",
      lat: 48.8566,
      lng: 2.3522,
      priority: "high"
    },
    {
      id: 2,
      client: "Jean Martin",
      address: "42 avenue des Champs, 75008 Paris",
      type: "Installation",
      status: "pending",
      time: "16:00",
      lat: 48.8738,
      lng: 2.2950,
      priority: "medium"
    },
    {
      id: 3,
      client: "Paul Dubois",
      address: "8 rue de la Paix, 75009 Paris",
      type: "Devis",
      status: "confirmed",
      time: "17:30",
      lat: 48.8698,
      lng: 2.3310,
      priority: "low"
    }
  ];

  const [selectedIntervention, setSelectedIntervention] = useState(interventions[0]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('googleMapsApiKey', apiKey);
      setShowApiKeyInput(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-foreground mb-4">Configuration Google Maps</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pour utiliser la carte, veuillez entrer votre clé API Google Maps.
            Vous pouvez obtenir une clé sur <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-primary underline">Google Cloud Console</a>.
          </p>
          
          <div className="space-y-4">
            <Input
              placeholder="Entrez votre clé API Google Maps"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
            />
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
                className="flex-1"
              >
                Valider
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate("technician-dashboard")}
              >
                Retour
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> La clé API sera stockée localement dans votre navigateur. 
              Pour une sécurité optimale, connectez votre projet à Supabase.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate("technician-dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Carte des interventions</h1>
          </div>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-1" />
            Rechercher
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Map Container */}
        <div className="h-96 bg-gray-200 relative overflow-hidden">
          {/* Simulation d'une carte Google Maps */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carte Google Maps</p>
              <p className="text-xs text-muted-foreground">API Key configurée</p>
            </div>
          </div>
          
          {/* Marqueurs simulés */}
          {interventions.map((intervention, index) => (
            <div
              key={intervention.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getPriorityColor(intervention.priority)}`}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`
              }}
              onClick={() => setSelectedIntervention(intervention)}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{intervention.id}</span>
              </div>
            </div>
          ))}

          {/* Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="icon" variant="secondary" className="shadow-lg">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Intervention Details */}
        <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
          {/* Selected Intervention */}
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-foreground">{selectedIntervention.client}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{selectedIntervention.address}</span>
                </div>
              </div>
              {getStatusBadge(selectedIntervention.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{selectedIntervention.time}</span>
              </div>
              <span className="text-sm font-medium text-primary">{selectedIntervention.type}</span>
            </div>

            <div className="flex space-x-2 mt-3">
              <Button size="sm" className="flex-1">
                <Navigation className="h-4 w-4 mr-1" />
                Naviguer
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Appeler
              </Button>
            </div>
          </Card>

          {/* Route Info */}
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3 flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Itinéraire optimisé
            </h3>
            
            <div className="space-y-3">
              {interventions.map((intervention, index) => (
                <div 
                  key={intervention.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedIntervention.id === intervention.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-secondary/10'
                  }`}
                  onClick={() => setSelectedIntervention(intervention)}
                >
                  <div className={`w-6 h-6 rounded-full ${getPriorityColor(intervention.priority)} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{intervention.client}</div>
                    <div className="text-xs text-muted-foreground">{intervention.time} • {intervention.type}</div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {index === 0 ? '5 min' : `${10 + index * 5} min`}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">42 km</div>
                <div className="text-xs text-muted-foreground">Distance totale</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">1h 25min</div>
                <div className="text-xs text-muted-foreground">Temps trajet</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">3</div>
                <div className="text-xs text-muted-foreground">Interventions</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 space-y-2">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          onClick={() => setShowApiKeyInput(true)}
        >
          <Navigation className="h-5 w-5 mr-2" />
          Démarrer la navigation
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => onNavigate("technician-planning")}
        >
          Voir le planning
        </Button>
      </div>
    </div>
  );
};