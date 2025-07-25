import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, Euro, Star, Phone, Clock, Award, Target, Zap, Timer } from "lucide-react";
interface TechnicianDashboardProps {
  onNavigate: (route: string) => void;
}
export const TechnicianDashboard = ({
  onNavigate
}: TechnicianDashboardProps) => {
  const interventions = [{
    id: 1,
    client: "Marie Dupont",
    address: "15 rue Victor Hugo, 75001 Paris",
    type: "Vitre cassée",
    status: "upcoming",
    time: "14:30"
  }, {
    id: 2,
    client: "Jean Martin",
    address: "42 avenue des Champs, 75008 Paris",
    type: "Effraction",
    status: "to-confirm",
    time: "16:00"
  }];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">À venir</Badge>;
      case "to-confirm":
        return <Badge className="bg-yellow-100 text-yellow-800">À confirmer</Badge>;
      default:
        return <Badge>En cours</Badge>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 pb-32">{/* Added pb-32 for bottom padding */}
      {/* Header Profile */}
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-primary text-white text-lg">TC</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 border-2 border-background rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-1">
              <h1 className="text-xl font-bold text-foreground">Thomas Carpentier</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-blue-500 text-white text-xs font-medium">Expert</Badge>
                <Badge className="bg-green-100 text-green-800 text-xs">Disponible</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-muted-foreground">4.8 (127 avis)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Euro className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-foreground">2,450€ ce mois</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("technician-planning")}>
          <div className="text-2xl font-bold text-primary">5</div>
          <div className="text-xs text-muted-foreground">Aujourd'hui</div>
          <div className="text-sm font-medium text-green-600 mt-1">680€</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">2</div>
          <div className="text-xs text-red-600 font-medium my-0 py-0 mx-[4px] px-px">Prendre RDV</div>
          <div className="text-sm font-medium text-red-600 mt-1">320€</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">28</div>
          <div className="text-xs text-muted-foreground">Ce mois</div>
          <div className="text-sm font-medium text-green-600 mt-1">2,450€</div>
        </Card>
      </div>

      {/* Gamification Badges */}
      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Performances & Badges</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-lg">
            <Award className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-purple-800">142 Acceptées</div>
              <div className="text-xs text-purple-600">Expert</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-800">138 
r</div>
              <div className="text-xs text-green-600">Finisseur</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-800">97% Taux</div>
              <div className="text-xs text-blue-600">Fiable</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-orange-50 p-3 rounded-lg">
            <Timer className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-orange-800">2.3 jours</div>
              <div className="text-xs text-orange-600">Délai moyen</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Interventions List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-3">Interventions du jour</h2>
        
        {interventions.map(intervention => <Card key={intervention.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("quote-detail")}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{intervention.client}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{intervention.address}</span>
                </div>
              </div>
              {getStatusBadge(intervention.status)}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-primary">{intervention.type}</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{intervention.time}</span>
              </div>
            </div>
          </Card>)}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onNavigate("technician-planning")}>
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Planning</span>
        </Button>
        
        <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onNavigate("technician-map")}>
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Carte</span>
        </Button>
        
        <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onNavigate("technician-earnings")}>
          <Euro className="h-5 w-5" />
          <span className="text-xs">Gains</span>
        </Button>
        
        <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onNavigate("technician-profile")}>
          <Star className="h-5 w-5" />
          <span className="text-xs">Profil</span>
        </Button>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 space-y-2">
        <Button variant="hero" size="lg" className="w-full" onClick={() => onNavigate("technician-planning")}>
          <Calendar className="h-5 w-5 mr-2" />
          Voir le planning
        </Button>
        
        <Button variant="outline" size="lg" className="w-full" onClick={() => onNavigate("welcome")}>
          Retour accueil
        </Button>
      </div>
    </div>;
};