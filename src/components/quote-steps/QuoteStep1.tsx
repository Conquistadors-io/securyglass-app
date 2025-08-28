
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Mail, MapPin, Hash, Shield } from "lucide-react";
import { DepartmentSelect } from "@/components/ui/department-select";
import { CitySelect } from "@/components/ui/city-select";
import { AddressSelect } from "@/components/ui/address-select";
import { InsuranceSelect } from "@/components/ui/insurance-select";

interface QuoteStep1Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export const QuoteStep1 = ({
  data,
  onComplete,
  onBack
}: QuoteStep1Props) => {
  const [formData, setFormData] = useState({
    civilite: data.civilite || "",
    nom: data.nom || "",
    telephone: data.telephone || "",
    email: data.email || "",
    adresse: data.adresse || "",
    codePostal: data.codePostal || "",
    ville: data.ville || "",
    priseEnChargeAssurance: data.priseEnChargeAssurance || "",
    assurance: data.assurance || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isValid = formData.nom && formData.telephone && formData.email;

  return <Card className="shadow-card border-0">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Message
          </h2>
          <p className="text-muted-foreground">
            Nous avons besoin de vos coordonnées pour établir votre devis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="civilite">Civilité</Label>
            <Select value={formData.civilite} onValueChange={value => setFormData(prev => ({
            ...prev,
            civilite: value
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="madame">Madame</SelectItem>
                <SelectItem value="monsieur">Monsieur</SelectItem>
                <SelectItem value="societe">Société ( Entreprise ou Association )</SelectItem>
                <SelectItem value="entreprise-btp">Professionnel du BTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nom">Nom Prénom <span className="text-destructive">*</span></Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="nom" placeholder="Nom et prénom" className="pl-10" value={formData.nom} onChange={e => setFormData(prev => ({
              ...prev,
              nom: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="telephone">Téléphone <span className="text-destructive">*</span></Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="telephone" type="tel" placeholder="06 12 34 56 78" className="pl-10" value={formData.telephone} onChange={e => setFormData(prev => ({
              ...prev,
              telephone: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" value={formData.email} onChange={e => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="codePostal">Code postal <span className="text-destructive">*</span></Label>
            <div className="mt-1">
              <Input 
                id="codePostal" 
                value={formData.codePostal} 
                onChange={e => setFormData(prev => ({
                  ...prev,
                  codePostal: e.target.value
                }))} 
                required 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ville">Ville <span className="text-destructive">*</span></Label>
            <div className="mt-1">
              <CitySelect 
                value={formData.ville} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  ville: value
                }))}
                postalCode={formData.codePostal}
                placeholder="Sélectionnez une ville"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="adresse">Adresse ( facultatif )</Label>
            <div className="mt-1">
              <AddressSelect 
                value={formData.adresse} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  adresse: value
                }))}
                departmentCode={formData.codePostal}
                city={formData.ville}
                placeholder="Tapez votre adresse"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assurance">Assurance (facultatif)</Label>
            <div className="mt-1">
              <InsuranceSelect 
                value={formData.assurance} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  assurance: value
                }))}
                placeholder="Sélectionnez votre assurance"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {onBack && (
              <Button 
                type="button"
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={onBack}
              >
                Retour
              </Button>
            )}
            <Button 
              type="submit" 
              variant="default" 
              size="lg" 
              className="flex-1" 
              disabled={!isValid}
            >
              Continuer
            </Button>
          </div>
        </form>
      </div>
    </Card>;
};
