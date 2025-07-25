import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Phone, MessageSquare, Send, Calendar, MapPin, Navigation, Euro } from "lucide-react";

interface AppointmentDetailProps {
  onNavigate: (route: string) => void;
}

export const AppointmentDetail = ({ onNavigate }: AppointmentDetailProps) => {
  const [isConfirmed, setIsConfirmed] = useState(true);

  const appointment = {
    id: "INT-240705-001",
    client: "MILLOT 59 x NICOLAS",
    date: "05",
    month: "JUIL",
    day: "samedi 05 juil.",
    time: "18:00 - 19:00",
    duration: "1h",
    address: "7 Rue du Coq Hardi",
    city: "59380 Armbouts-Cappel",
    phone: "+33 6 12 34 56 78",
    type: "Installation vitre",
    status: "confirmed"
  };

  const handleBilling = () => {
    onNavigate("quote-detail");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate("technician-planning")}
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary"
          >
            Modifier
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-32">
        {/* Date Display */}
        <div className="text-center">
          <div className="inline-block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-24">
              <div className="bg-green-600 text-white text-xs font-bold py-1 px-2 text-center">
                {appointment.month}
              </div>
              <div className="text-4xl font-bold text-foreground py-3 text-center">
                {appointment.date}
              </div>
            </div>
          </div>
        </div>

        {/* Client and Status */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">{appointment.client}</h1>
            {isConfirmed && (
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-muted-foreground">{appointment.day}</p>
            <p className="text-lg font-medium text-foreground">
              {appointment.time} ({appointment.duration})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex-col h-20 space-y-2"
            onClick={() => window.open(`tel:${appointment.phone}`)}
          >
            <Phone className="h-6 w-6 text-primary" />
            <span className="text-sm">Appeler</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-col h-20 space-y-2"
            onClick={() => window.open(`sms:${appointment.phone}`)}
          >
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-sm">Message</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-col h-20 space-y-2"
          >
            <Send className="h-6 w-6 text-primary" />
            <span className="text-sm">Envoyer</span>
          </Button>
        </div>

        {/* Add to Calendar */}
        <Button 
          variant="ghost" 
          className="w-full text-primary justify-center"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Ajouter au calendrier
        </Button>

        {/* Location */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Lieu</h3>
          <div className="space-y-2">
            <p className="text-foreground">{appointment.address}</p>
            <p className="text-muted-foreground">{appointment.city}</p>
          </div>
          
          {/* Map Placeholder */}
          <div className="mt-4 h-48 bg-green-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300">
              {/* Simulated streets */}
              <div className="absolute top-0 left-1/3 w-1 h-full bg-white/60"></div>
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/60"></div>
              <div className="absolute top-1/4 right-1/4 w-1 h-1/2 bg-white/60"></div>
              
              {/* Location Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center relative">
                  <MapPin className="h-5 w-5 text-white" />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
                </div>
              </div>
              
              {/* Area Labels */}
              <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-medium">
                KROEMENHOUCK
              </div>
              <div className="absolute top-4 right-8 text-xs text-gray-600 font-medium transform rotate-45">
                DU KROEKENOL
              </div>
            </div>
            
            {/* Map attribution */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-1">
              <div className="bg-white/80 rounded px-1 py-0.5">
                <span className="text-xs font-semibold">📍Plans</span>
              </div>
              <div className="text-xs text-gray-600">Mentions légales</div>
            </div>
          </div>

          {/* Navigation Button */}
          <Button 
            variant="outline" 
            className="w-full mt-3"
            onClick={() => onNavigate("technician-map")}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Itinéraire
          </Button>
        </Card>

        {/* Appointment Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Détails de l'intervention</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type :</span>
              <span className="font-medium text-foreground">{appointment.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée :</span>
              <span className="font-medium text-foreground">{appointment.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut :</span>
              <Badge className="bg-green-100 text-green-800">Confirmé</Badge>
            </div>
          </div>
        </Card>

        {/* Client Contact */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Contact client</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Téléphone :</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{appointment.phone}</span>
                <Button size="icon" variant="ghost" onClick={() => window.open(`tel:${appointment.phone}`)}>
                  <Phone className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          onClick={handleBilling}
        >
          <Euro className="h-5 w-5 mr-2" />
          Facturer le RDV
        </Button>
      </div>
    </div>
  );
};