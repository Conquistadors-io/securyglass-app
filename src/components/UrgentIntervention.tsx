import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, MapPin, Phone, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UrgentInterventionProps {
  onNavigate: (route: string) => void;
}

export const UrgentIntervention = ({ onNavigate }: UrgentInterventionProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zipCode: "",
    damageType: "",
    motif: "",
    photo: null as File | null
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.zipCode || !formData.damageType) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      toast({
        title: "Photo ajoutée",
        description: "Votre photo a été téléchargée avec succès"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 text-center shadow-card border-0 bg-white/95 backdrop-blur">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Demande envoyée !
            </h2>
            <p className="text-muted-foreground">
              Un technicien sera chez vous dans environ
            </p>
            <p className="text-3xl font-bold text-primary mt-2">
              ~45 minutes
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Référence:</strong> URG-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-sm text-foreground mt-1">
                Vous recevrez un SMS de confirmation sous peu
              </p>
            </div>
            
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => onNavigate('welcome')}
            >
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary px-6 py-4 text-white">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 mr-3"
            onClick={() => onNavigate('welcome')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Intervention Urgente</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-8">
        <Card className="shadow-card border-0">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet <span className="text-destructive">*</span></Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Votre nom et prénom"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">Code postal <span className="text-destructive">*</span></Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="zipCode"
                    placeholder="75001"
                    className="pl-10"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({...prev, zipCode: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="damageType">Type de dégât <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setFormData(prev => ({...prev, damageType: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vitre-cassee">Vitre cassée</SelectItem>
                    <SelectItem value="porte-vitree">Porte vitrée</SelectItem>
                    <SelectItem value="vitrine">Vitrine commerciale</SelectItem>
                    <SelectItem value="fenetre">Fenêtre</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="motif">Motif</Label>
                <Select onValueChange={(value) => setFormData(prev => ({...prev, motif: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Cause du dégât" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accident">Accident</SelectItem>
                    <SelectItem value="effraction">Effraction</SelectItem>
                    <SelectItem value="vandalisme">Vandalisme</SelectItem>
                    <SelectItem value="choc">Choc</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="photo">Photo (optionnel)</Label>
                <div className="mt-1">
                  <label 
                    htmlFor="photo-upload" 
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="text-center">
                      <Camera className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {formData.photo ? formData.photo.name : "Ajouter une photo"}
                      </p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="emergency" 
              size="lg" 
              className="w-full"
            >
              Envoyer la demande d'intervention
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Un technicien vous contactera dans les plus brefs délais
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};