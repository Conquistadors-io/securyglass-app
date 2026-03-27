import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Euro, Star, Phone, Clock, Award, Target, Zap, Timer, Menu, User, FileText, Shield, Car, TrendingUp, CreditCard, AlertTriangle, X, Users, Edit3, Save, XCircle, Settings } from "lucide-react";
interface TechnicianDashboardProps {
  onNavigate: (route: string) => void;
}
export const TechnicianDashboard = ({
  onNavigate
}: TechnicianDashboardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    prenom: "DRAME",
    departement: "75 - Paris",
    note: 4.8,
    competences: "Expert",
    diplome: "CAP Vitrier",
    vehicule: "Utilitaire 500kg",
    interventions: 142,
    caSemine: 680,
    caMensuel: 2450,
    retards: 2,
    reclamations: 1,
    annulations: 0,
    astreinteNuit: true,
    astreinteWeekend: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ici on pourrait sauvegarder les données
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Ici on pourrait restaurer les données originales
  };

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
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
        return <Badge className="bg-primary/10 text-primary-dark">À venir</Badge>;
      case "to-confirm":
        return <Badge className="bg-yellow-100 text-yellow-800">À confirmer</Badge>;
      default:
        return <Badge>En cours</Badge>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 pb-32">{/* Added pb-32 for bottom padding */}
      {/* Header with Hamburger Menu */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profil Technicien</span>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Informations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prénom</span>
                    {isEditing ? (
                      <Input 
                        value={profileData.prenom} 
                        onChange={(e) => updateField('prenom', e.target.value)}
                        className="w-32 h-8"
                      />
                    ) : (
                      <span className="font-medium">{profileData.prenom}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Département</span>
                    {isEditing ? (
                      <Input 
                        value={profileData.departement} 
                        onChange={(e) => updateField('departement', e.target.value)}
                        className="w-32 h-8"
                      />
                    ) : (
                      <Badge variant="outline">{profileData.departement}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contrat sous-traitance</span>
                    <Badge className="bg-green-100 text-green-800">Valide</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attestation vigilance</span>
                    <Badge className="bg-green-100 text-green-800">Valide</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assurance</span>
                    <Badge className="bg-green-100 text-green-800">Valide</Badge>
                  </div>
                </div>
              </div>

              {/* Évaluations et Compétences */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Évaluations
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Note / Étoiles</span>
                    {isEditing ? (
                      <Input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={profileData.note} 
                        onChange={(e) => updateField('note', parseFloat(e.target.value))}
                        className="w-20 h-8"
                      />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{profileData.note}/5</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compétences</span>
                    {isEditing ? (
                      <Input 
                        value={profileData.competences} 
                        onChange={(e) => updateField('competences', e.target.value)}
                        className="w-24 h-8"
                      />
                    ) : (
                      <Badge className="bg-primary/10 text-primary-dark">{profileData.competences}</Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Diplôme</span>
                    {isEditing ? (
                      <Input 
                        value={profileData.diplome} 
                        onChange={(e) => updateField('diplome', e.target.value)}
                        className="w-32 h-8"
                      />
                    ) : (
                      <Badge variant="outline">{profileData.diplome}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Véhicule et Interventions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <Car className="h-4 w-4 mr-2" />
                  Logistique
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Véhicule / Capacité</span>
                    {isEditing ? (
                      <Input 
                        value={profileData.vehicule} 
                        onChange={(e) => updateField('vehicule', e.target.value)}
                        className="w-36 h-8"
                      />
                    ) : (
                      <span className="font-medium">{profileData.vehicule}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interventions</span>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={profileData.interventions} 
                        onChange={(e) => updateField('interventions', parseInt(e.target.value))}
                        className="w-20 h-8"
                      />
                    ) : (
                      <span className="font-medium">{profileData.interventions} total</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chiffre d'affaires */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Chiffre d'affaires
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CA Semaine</span>
                    {isEditing ? (
                      <div className="flex items-center space-x-1">
                        <Input 
                          type="number"
                          value={profileData.caSemine} 
                          onChange={(e) => updateField('caSemine', parseInt(e.target.value))}
                          className="w-20 h-8"
                        />
                        <span className="text-sm">€</span>
                      </div>
                    ) : (
                      <span className="font-medium text-green-600">{profileData.caSemine}€</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CA Mensuel</span>
                    {isEditing ? (
                      <div className="flex items-center space-x-1">
                        <Input 
                          type="number"
                          value={profileData.caMensuel} 
                          onChange={(e) => updateField('caMensuel', parseInt(e.target.value))}
                          className="w-24 h-8"
                        />
                        <span className="text-sm">€</span>
                      </div>
                    ) : (
                      <span className="font-medium text-green-600">{profileData.caMensuel.toLocaleString()}€</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Paiements */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Paiements
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Paiement dû</span>
                    <div className="flex space-x-1">
                      <Badge variant="outline">Chèque</Badge>
                      <Badge variant="outline">Espèces</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alertes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alertes
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retard</span>
                    {isEditing ? (
                      <Input 
                        type="number"
                        min="0"
                        value={profileData.retards} 
                        onChange={(e) => updateField('retards', parseInt(e.target.value))}
                        className="w-16 h-8"
                      />
                    ) : (
                      <Badge variant="destructive">{profileData.retards} retards</Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Réclamation</span>
                    {isEditing ? (
                      <Input 
                        type="number"
                        min="0"
                        value={profileData.reclamations} 
                        onChange={(e) => updateField('reclamations', parseInt(e.target.value))}
                        className="w-16 h-8"
                      />
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800">{profileData.reclamations} en cours</Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Annulation</span>
                    {isEditing ? (
                      <Input 
                        type="number"
                        min="0"
                        value={profileData.annulations} 
                        onChange={(e) => updateField('annulations', parseInt(e.target.value))}
                        className="w-16 h-8"
                      />
                    ) : (
                      <Badge variant="outline">{profileData.annulations} ce mois</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Astreintes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Astreintes
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nuit</span>
                    {isEditing ? (
                      <Switch 
                        checked={profileData.astreinteNuit}
                        onCheckedChange={(checked) => updateField('astreinteNuit', checked)}
                      />
                    ) : (
                      <Badge className={profileData.astreinteNuit ? "bg-primary/10 text-primary-dark" : "bg-gray-100 text-gray-800"}>
                        {profileData.astreinteNuit ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Week-end</span>
                    {isEditing ? (
                      <Switch 
                        checked={profileData.astreinteWeekend}
                        onCheckedChange={(checked) => updateField('astreinteWeekend', checked)}
                      />
                    ) : (
                      <Badge className={profileData.astreinteWeekend ? "bg-primary/10 text-primary-dark" : "bg-gray-100 text-gray-800"}>
                        {profileData.astreinteWeekend ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Header Profile */}
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
               <AvatarImage src="/src/assets/thomas-photo.jpg" />
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
                <Badge className="bg-primary text-white text-xs font-medium">Expert</Badge>
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
        <Card className="p-4 text-center cursor-pointer transition-shadow" onClick={() => onNavigate("technician-planning")}>
          <div className="text-2xl font-bold text-primary">5</div>
          <div className="text-xs text-muted-foreground">Aujourd'hui</div>
          <div className="text-sm font-medium text-green-600 mt-1">680€</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">2</div>
          <div className="text-xs text-red-600 font-medium my-0 py-0 mx-[4px] px-px whitespace-nowrap">Prendre RDV</div>
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
Travaux</div>
              <div className="text-xs text-green-600">En attente</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 bg-primary/5 p-3 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium text-primary-dark">97% Taux</div>
              <div className="text-xs text-primary">Fiable</div>
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
        
        {interventions.map(intervention => <Card key={intervention.id} className="p-4 cursor-pointer transition-shadow" onClick={() => onNavigate("quote-detail")}>
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

      {/* Admin Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full h-12 flex items-center justify-center space-x-2"
          onClick={() => window.location.href = '/admin'}
        >
          <Settings className="h-5 w-5" />
          <span>Configuration Gmail (Admin)</span>
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