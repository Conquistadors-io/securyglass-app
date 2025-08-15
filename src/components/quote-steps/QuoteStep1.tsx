import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Mail, MapPin, Hash, Shield } from "lucide-react";
import { DepartmentSelect } from "@/components/ui/department-select";
import { CitySelect } from "@/components/ui/city-select";
interface QuoteStep1Props {
  data: any;
  onComplete: (data: any) => void;
}
export const QuoteStep1 = ({
  data,
  onComplete
}: QuoteStep1Props) => {
  const [formData, setFormData] = useState({
    civilite: data.civilite || "",
    nom: data.nom || "",
    telephone: data.telephone || "",
    email: data.email || "",
    adresse: data.adresse || "",
    codePostal: data.codePostal || "",
    ville: data.ville || "",
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
                <SelectItem value="societe">Société ( ou Association )</SelectItem>
                <SelectItem value="entreprise-btp">Entreprise BTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nom">Nom complet *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="nom" placeholder="Nom et prénom" className="pl-10" value={formData.nom} onChange={e => setFormData(prev => ({
              ...prev,
              nom: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="telephone">Téléphone *</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="telephone" type="tel" placeholder="06 12 34 56 78" className="pl-10" value={formData.telephone} onChange={e => setFormData(prev => ({
              ...prev,
              telephone: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" value={formData.email} onChange={e => setFormData(prev => ({
              ...prev,
              email: e.target.value
            }))} required />
            </div>
          </div>

          <div>
            <Label htmlFor="codePostal">Département</Label>
            <div className="mt-1">
              <DepartmentSelect 
                value={formData.codePostal} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  codePostal: value,
                  ville: "" // Réinitialiser la ville quand on change de département
                }))}
                placeholder="75 Paris"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ville">Ville</Label>
            <div className="mt-1">
              <CitySelect 
                value={formData.ville} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  ville: value
                }))}
                departmentCode={formData.codePostal}
                placeholder="Sélectionnez une ville"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="adresse">Adresse (facultatif)</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="adresse" placeholder="Adresse complète" className="pl-10" value={formData.adresse} onChange={e => setFormData(prev => ({
              ...prev,
              adresse: e.target.value
            }))} />
            </div>
          </div>

          <div>
            <Label htmlFor="assurance">Assurance (facultatif)</Label>
            <div className="relative mt-1">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="assurance" placeholder="Nom de votre assurance" className="pl-10" value={formData.assurance} onChange={e => setFormData(prev => ({
              ...prev,
              assurance: e.target.value
            }))} />
            </div>
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={!isValid}>
            Continuer
          </Button>
        </form>
      </div>
    </Card>;
};