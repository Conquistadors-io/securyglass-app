import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Calendar, Clock, CheckCircle } from "lucide-react";

interface TechnicianAppointmentProps {
  onNavigate: (route: string) => void;
}

export const TechnicianAppointment = ({ onNavigate }: TechnicianAppointmentProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const timeSlots = [
    { time: "09:00", available: true },
    { time: "10:30", available: true },
    { time: "14:00", available: false },
    { time: "15:30", available: true },
    { time: "17:00", available: true }
  ];

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onNavigate("technician-measurement");
    }, 2000);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">RDV confirmé</h2>
          <p className="text-muted-foreground">Client notifié par SMS</p>
          <p className="text-sm text-muted-foreground mt-2">Redirection vers la visite...</p>
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
            onClick={() => onNavigate("technician-intervention")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Planifier RDV</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Client Contact */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">Contact client</h3>
            <Badge className="bg-green-100 text-green-800">En ligne</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Marie Dupont</div>
            <div className="text-sm text-muted-foreground">06 12 34 56 78</div>
          </div>

          <Button variant="outline" className="w-full mt-3">
            <Phone className="h-4 w-4 mr-2" />
            Appeler maintenant
          </Button>
        </Card>

        {/* Date Selection */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Date du rendez-vous</h3>
          <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Aujourd'hui - 15 janvier 2024</span>
          </div>
        </Card>

        {/* Time Slots */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Créneaux disponibles</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  !slot.available
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : selectedSlot === slot.time
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-gray-200 hover:border-primary"
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{slot.time}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Selected Appointment */}
        {selectedSlot && (
          <Card className="p-4 border-primary/20 bg-primary/5">
            <h3 className="font-medium text-foreground mb-2">Rendez-vous sélectionné</h3>
            <div className="text-sm text-muted-foreground">
              Aujourd'hui à {selectedSlot}
            </div>
            <div className="text-sm text-muted-foreground">
              Visite de prise de mesures
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={!selectedSlot}
          onClick={handleConfirm}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirmer le RDV
        </Button>
      </div>
    </div>
  );
};