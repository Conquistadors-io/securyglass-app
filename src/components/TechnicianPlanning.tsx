import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Filter } from "lucide-react";

interface TechnicianPlanningProps {
  onNavigate: (route: string) => void;
}

export const TechnicianPlanning = ({ onNavigate }: TechnicianPlanningProps) => {
  const [selectedDate, setSelectedDate] = useState("today");
  const [filter, setFilter] = useState("all");

  const appointments = [
    {
      id: 1,
      time: "09:00",
      client: "Jean Martin",
      address: "42 avenue des Champs, 75008 Paris",
      type: "Visite mesures",
      status: "confirmed",
      duration: "1h"
    },
    {
      id: 2,
      time: "14:30",
      client: "Marie Dupont", 
      address: "15 rue Victor Hugo, 75001 Paris",
      type: "Installation",
      status: "confirmed",
      duration: "2h"
    },
    {
      id: 3,
      time: "16:00",
      client: "Paul Dubois",
      address: "8 rue de la Paix, 75009 Paris",
      type: "Devis sur site",
      status: "pending",
      duration: "45min"
    }
  ];

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

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filtrer
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Date Selection */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {["today", "tomorrow", "week"].map((period) => (
            <Button
              key={period}
              variant={selectedDate === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDate(period)}
              className="whitespace-nowrap"
            >
              {period === "today" ? "Aujourd'hui" : 
               period === "tomorrow" ? "Demain" : "Cette semaine"}
            </Button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {[
            { key: "all", label: "Tous" },
            { key: "confirmed", label: "Confirmés" },
            { key: "pending", label: "En attente" }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Daily Summary */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">Résumé du jour</h3>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-primary">3</div>
              <div className="text-xs text-muted-foreground">RDV</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">4h30</div>
              <div className="text-xs text-muted-foreground">Durée</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">45km</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Rendez-vous</h3>
          
          {filteredAppointments.map((appointment) => (
            <Card 
              key={appointment.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate("technician-intervention")}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{appointment.time}</div>
                    <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="space-y-1">
                <div className="font-medium text-foreground">{appointment.client}</div>
                <div className="text-sm text-primary">{appointment.type}</div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{appointment.address}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Actions rapides</h3>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter créneau libre
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Bloquer créneau
            </Button>
          </div>
        </Card>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => onNavigate("technician-intervention")}
        >
          <Plus className="h-5 w-5" />
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