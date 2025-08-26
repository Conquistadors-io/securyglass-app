import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Glasses } from "lucide-react";

interface QuoteStep2Props {
  data: any;
  onComplete: (data: any) => void;
}

export const QuoteStep2 = ({ data, onComplete }: QuoteStep2Props) => {
  const [formData, setFormData] = useState({
    object: data.object || "vitre-cassee",
    property: data.property || "appartement",
    propertyOther: data.propertyOther || "",
    motif: data.motif || "accident"
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
            <Label className="text-lg font-medium mb-6 block">Objet de la demande :</Label>
            <RadioGroup 
              value={formData.object} 
              onValueChange={value => setFormData(prev => ({...prev, object: value}))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="vitre-cassee" id="vitre-cassee" className="w-6 h-6" />
                <Label htmlFor="vitre-cassee" className="text-lg cursor-pointer flex-1">Vitre cassée</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value={data.serviceType === "vitrerie" ? "verre-sur-mesure" : "miroir"} id={data.serviceType === "vitrerie" ? "verre-sur-mesure" : "miroir"} className="w-6 h-6" />
                <Label htmlFor={data.serviceType === "vitrerie" ? "verre-sur-mesure" : "miroir"} className="text-lg cursor-pointer flex-1">
                  {data.serviceType === "vitrerie" ? "Verre sur mesure" : "Miroir"}
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="mise-securite" id="mise-securite" className="w-6 h-6" />
                <Label htmlFor="mise-securite" className="text-lg cursor-pointer flex-1">Découpe aération</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="decoupe-chatiere" id="decoupe-chatiere" className="w-6 h-6" />
                <Label htmlFor="decoupe-chatiere" className="text-lg cursor-pointer flex-1">Découpe chatière</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="autre" id="autre-objet" className="w-6 h-6" />
                <Label htmlFor="autre-objet" className="text-lg cursor-pointer flex-1">Autre</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="motif">Motif : *</Label>
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

          <div>
            <Label htmlFor="property">Lieu *</Label>
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
                <SelectItem value="autre">Autres</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.property === "autre" && (
              <div className="mt-3">
                <Input
                  placeholder="Précisez ..."
                  value={formData.propertyOther}
                  onChange={(e) => setFormData(prev => ({...prev, propertyOther: e.target.value}))}
                />
              </div>
            )}
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