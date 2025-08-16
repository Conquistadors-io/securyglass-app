import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Glasses } from "lucide-react";

interface QuoteStep2Props {
  data: any;
  onComplete: (data: any) => void;
}

export const QuoteStep2 = ({ data, onComplete }: QuoteStep2Props) => {
  const [formData, setFormData] = useState({
    object: data.object || "",
    property: data.property || "",
    propertyOther: data.propertyOther || "",
    motif: data.motif || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isValid = formData.object && formData.property && formData.motif && 
    (formData.property !== "autre" || formData.propertyOther.trim() !== "");

  return (
    <Card className="shadow-card border-0">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="object">Objet de l'intervention *</Label>
            <Select 
              value={formData.object}
              onValueChange={(value) => setFormData(prev => ({...prev, object: value}))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Vitre cassée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vitre-cassee">Vitre cassée</SelectItem>
                <SelectItem value="miroir">Miroir</SelectItem>
                <SelectItem value="chatiere">Chatière</SelectItem>
                <SelectItem value="decoupe-aeration">Découpe Aération</SelectItem>
                <SelectItem value="verre-anti-bruit">Verre Anti-Bruit</SelectItem>
                <SelectItem value="renovation">Rénovation</SelectItem>
                <SelectItem value="verre-anti-effraction">Verre Anti-effraction</SelectItem>
                <SelectItem value="mise-conformite-erp">Mise en conformité ERP</SelectItem>
                <SelectItem value="defaut-etancheite">Défaut d'étanchéité ( traces, buées )</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="property">Type de propriété *</Label>
            <Select 
              value={formData.property}
              onValueChange={(value) => setFormData(prev => ({...prev, property: value, propertyOther: ""}))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Appartement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="immeuble">Immeuble ( ou parties communes )</SelectItem>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="commerce">Magasin</SelectItem>
                <SelectItem value="autre">Autre : préciser ...</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.property === "autre" && (
              <div className="mt-3">
                <Input
                  placeholder="Précisez le type de propriété..."
                  value={formData.propertyOther}
                  onChange={(e) => setFormData(prev => ({...prev, propertyOther: e.target.value}))}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="motif">Motif de l'intervention *</Label>
            <Select 
              value={formData.motif}
              onValueChange={(value) => setFormData(prev => ({...prev, motif: value}))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Accident" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="choc-thermique">Choc thermique</SelectItem>
                <SelectItem value="vandalisme">Vandalisme</SelectItem>
                <SelectItem value="usure">Usure normale</SelectItem>
                <SelectItem value="effraction">Effraction ( ou tentative )</SelectItem>
                <SelectItem value="pompiers">Intervention des pompiers</SelectItem>
                <SelectItem value="projectiles">Projectiles</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <Glasses className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Information</p>
                <p className="text-foreground">
                  Ces informations ne seront pas mentionnées sur le devis
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="default" 
            size="lg" 
            className="w-full"
            disabled={!isValid}
          >
            Continuer
          </Button>
        </form>
      </div>
    </Card>
  );
};