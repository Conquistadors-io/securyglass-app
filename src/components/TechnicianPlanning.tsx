import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechnicianPlanningProps {
  onNavigate: (route: string) => void;
}

export const TechnicianPlanning = ({ onNavigate }: TechnicianPlanningProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [filter, setFilter] = useState("all");

  const appointments = [
    {
      id: 1,
      time: "09:00",
      endTime: "10:00",
      client: "Jean Martin",
      address: "42 avenue des Champs, 75008 Paris",
      type: "Visite mesures",
      status: "confirmed",
      phone: "06 12 34 56 78"
    },
    {
      id: 2,
      time: "14:30",
      endTime: "16:30",
      client: "Marie Dupont", 
      address: "15 rue Victor Hugo, 75001 Paris",
      type: "Installation",
      status: "confirmed",
      phone: "06 23 45 67 89"
    },
    {
      id: 3,
      time: "16:00",
      endTime: "16:45",
      client: "Paul Dubois",
      address: "8 rue de la Paix, 75009 Paris",
      type: "Devis sur site",
      status: "pending",
      phone: "06 34 56 78 90"
    }
  ];

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 text-xs">Confirmé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">En attente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 text-xs">Annulé</Badge>;
      default:
        return <Badge className="text-xs">Inconnu</Badge>;
    }
  };

  const getAppointmentForTime = (time: string) => {
    return appointments.find(apt => apt.time === time);
  };

  const isTimeSlotFree = (time: string) => {
    return !appointments.some(apt => apt.time === time);
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate("technician-dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Planning</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtrer
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Button 
                    variant={filter === "all" ? "default" : "ghost"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setFilter("all")}
                  >
                    Tous les RDV
                  </Button>
                  <Button 
                    variant={filter === "confirmed" ? "default" : "ghost"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setFilter("confirmed")}
                  >
                    Confirmés
                  </Button>
                  <Button 
                    variant={filter === "pending" ? "default" : "ghost"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setFilter("pending")}
                  >
                    En attente
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex space-x-1">
          {[
            { key: "day", label: "Jour" },
            { key: "week", label: "Semaine" },
            { key: "month", label: "Mois" }
          ].map((viewOption) => (
            <Button
              key={viewOption.key}
              variant={view === viewOption.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(viewOption.key as "day" | "week" | "month")}
            >
              {viewOption.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Date Navigation */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="font-medium">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Daily Summary */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{appointments.length}</div>
              <div className="text-xs text-muted-foreground">RDV</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">7h</div>
              <div className="text-xs text-muted-foreground">Occupé</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">3h</div>
              <div className="text-xs text-muted-foreground">Libre</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">45km</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
          </div>
        </Card>

        {view === "day" && (
          <>
            {/* Timeline View */}
            <Card className="p-4">
              <h3 className="font-medium text-foreground mb-4">Planning détaillé</h3>
              
              <div className="space-y-2">
                {timeSlots.map((time) => {
                  const appointment = getAppointmentForTime(time);
                  const isFree = isTimeSlotFree(time);
                  
                  return (
                    <div key={time} className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-muted-foreground font-mono">
                        {time}
                      </div>
                      
                      {appointment ? (
                        <Card 
                          className="flex-1 p-3 cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                          onClick={() => onNavigate("technician-intervention")}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium text-foreground text-sm">{appointment.client}</div>
                              <div className="text-xs text-primary">{appointment.type}</div>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="flex items-center space-x-1 mb-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.address}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {appointment.time} - {appointment.endTime}
                            </span>
                          </div>
                        </Card>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5"
                          onClick={() => {/* TODO: Add appointment */}}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span className="text-sm text-muted-foreground">Créneau libre</span>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {view === "week" && (
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4">Vue semaine</h3>
            <div className="text-center text-muted-foreground">
              Vue semaine en développement
            </div>
          </Card>
        )}

        {view === "month" && (
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4">Vue mensuelle</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={cn("w-full pointer-events-auto")}
            />
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Actions rapides</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 flex-col space-y-1">
              <Plus className="h-4 w-4" />
              <span className="text-xs">Ajouter RDV</span>
            </Button>
            
            <Button variant="outline" className="h-12 flex-col space-y-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Bloquer créneau</span>
            </Button>
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Prochains rendez-vous</h3>
          
          <div className="space-y-3">
            {filteredAppointments.slice(0, 3).map((appointment) => (
              <div 
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => onNavigate("technician-intervention")}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{appointment.client}</span>
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {appointment.time} • {appointment.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4">
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg animate-scale-in"
          onClick={() => onNavigate("technician-intervention")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => onNavigate("technician-dashboard")}
        >
          Retour tableau de bord
        </Button>
      </div>
    </div>
  );
};