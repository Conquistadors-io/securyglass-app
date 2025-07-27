import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PhotoCapture } from "@/components/ui/photo-capture";
import { ArrowLeft, Star, MapPin, Phone, Mail, Settings, Camera, Shield, FileText } from "lucide-react";

interface TechnicianProfileProps {
  onNavigate: (route: string) => void;
}

export const TechnicianProfile = ({ onNavigate }: TechnicianProfileProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePhotoSelect = (file: File, previewUrl: string) => {
    setProfilePhoto(previewUrl);
  };

  const profile = {
    name: "Thomas Carpentier",
    phone: "06 12 34 56 78",
    email: "thomas.c@securyglass.fr",
    zone: "Paris 1er-8e",
    rating: 4.8,
    reviews: 127,
    earnings: 2450,
    interventions: 45,
    certifications: ["Vitrage sécurisé", "Installation PVC", "Urgences"],
    documents: {
      insurance: { valid: true, expires: "15/12/2024" },
      license: { valid: true, expires: "22/08/2025" },
      id: { valid: true, expires: "10/03/2028" }
    }
  };

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
            <h1 className="text-lg font-semibold text-foreground">Mon profil</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {profilePhoto ? (
                  <AvatarImage src={profilePhoto} alt="Photo de profil" />
                ) : (
                  <AvatarImage src="/src/assets/thomas-photo.jpg" alt="Thomas Carpentier" />
                )}
                <AvatarFallback className="bg-gradient-primary text-white text-xl">TC</AvatarFallback>
              </Avatar>
              {isEditing && (
                <PhotoCapture onPhotoSelect={handlePhotoSelect}>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </PhotoCapture>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-muted-foreground">
                  {profile.rating} ({profile.reviews} avis)
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.zone}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <span className="text-sm text-muted-foreground">
                  {isAvailable ? "Disponible" : "Indisponible"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{profile.earnings}€</div>
              <div className="text-xs text-muted-foreground">Ce mois</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{profile.interventions}</div>
              <div className="text-xs text-muted-foreground">Interventions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{profile.rating}</div>
              <div className="text-xs text-muted-foreground">Note moyenne</div>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Informations de contact</h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="phone" className="text-sm">Téléphone</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone"
                  value={profile.phone}
                  disabled={!isEditing}
                  className={!isEditing ? "border-transparent bg-transparent" : ""}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  value={profile.email}
                  disabled={!isEditing}
                  className={!isEditing ? "border-transparent bg-transparent" : ""}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Certifications</h3>
          
          <div className="flex flex-wrap gap-2">
            {profile.certifications.map((cert, index) => (
              <Badge key={index} variant="secondary">
                {cert}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Documents administratifs
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">Assurance professionnelle</div>
                  <div className="text-xs text-muted-foreground">Expire le {profile.documents.insurance.expires}</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Valide</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">Permis de conduire</div>
                  <div className="text-xs text-muted-foreground">Expire le {profile.documents.license.expires}</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Valide</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">Pièce d'identité</div>
                  <div className="text-xs text-muted-foreground">Expire le {profile.documents.id.expires}</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Valide</Badge>
            </div>
          </div>
        </Card>

        {/* Zone Settings */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Zone d'intervention</h3>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Zone principale</Label>
              <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                <span className="text-sm text-primary font-medium">{profile.zone}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm">Interventions weekend</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm">Urgences 24h/24</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 right-4 space-y-2">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={() => setIsEditing(false)}
          >
            Sauvegarder
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
};