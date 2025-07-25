import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Phone, MapPin, Camera, CheckCircle, XCircle, Clock } from "lucide-react";

interface TechnicianInterventionProps {
  onNavigate: (route: string) => void;
}

export const TechnicianIntervention = ({ onNavigate }: TechnicianInterventionProps) => {
  const [status, setStatus] = useState<"pending" | "accepted" | "refused">("pending");

  const clientInfo = {
    name: "Marie Dupont",
    phone: "06 12 34 56 78",
    address: "15 rue Victor Hugo, 75001 Paris",
    type: "Vitre cassée",
    motif: "Accident",
    description: "Vitre de la porte d'entrée cassée suite à un choc",
    urgency: "Normale",
    photos: 2
  };

  const handleAccept = () => {
    setStatus("accepted");
    setTimeout(() => {
      onNavigate("technician-appointment");
    }, 1500);
  };

  const handleRefuse = () => {
    setStatus("refused");
    setTimeout(() => {
      onNavigate("technician-dashboard");
    }, 1500);
  };

  if (status === "accepted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Intervention acceptée</h2>
          <p className="text-muted-foreground">Redirection vers la planification...</p>
        </Card>
      </div>
    );
  }

  if (status === "refused") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Intervention refusée</h2>
          <p className="text-muted-foreground">Retour au tableau de bord...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate("technician-dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Nouvelle intervention</h1>
          <Badge className="bg-orange-100 text-orange-800 ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Client Info */}
        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-primary text-white">MD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{clientInfo.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{clientInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{clientInfo.address}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Intervention Details */}
        <Card className="p-4 space-y-3">
          <h3 className="font-medium text-foreground">Détails de l'intervention</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm text-muted-foreground">Type</span>
              <div className="font-medium text-foreground">{clientInfo.type}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Motif</span>
              <div className="font-medium text-foreground">{clientInfo.motif}</div>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Description</span>
            <div className="font-medium text-foreground mt-1">{clientInfo.description}</div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Photos jointes</span>
            <div className="flex items-center space-x-1">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{clientInfo.photos} photos</span>
            </div>
          </div>
        </Card>

        {/* Distance & Time */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">12 min</div>
              <div className="text-sm text-muted-foreground">Temps de trajet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5.2 km</div>
              <div className="text-sm text-muted-foreground">Distance</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 space-y-3">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          onClick={handleAccept}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Accepter l'intervention
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full border-red-200 text-red-700 hover:bg-red-50"
          onClick={handleRefuse}
        >
          <XCircle className="h-5 w-5 mr-2" />
          Refuser
        </Button>
      </div>
    </div>
  );
};