import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    category: data.category || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isValid = formData.object && formData.property && formData.category;

  return (
    <Card className="shadow-card border-0">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Type d'intervention
          </h2>
          <p className="text-muted-foreground">
            Décrivez le type de vitrage concerné
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="object">Objet de l'intervention *</Label>
            <Select 
              value={formData.object}
              onValueChange={(value) => setFormData(prev => ({...prev, object: value}))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Que souhaitez-vous faire ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vitre-cassee">Vitre cassée</SelectItem>
                <SelectItem value="miroir">Miroir</SelectItem>
                <SelectItem value="chatiere">Chatière</SelectItem>
                <SelectItem value="decoupe-clim">Découpe climatisation</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="property">Type de propriété *</Label>
            <Select 
              value={formData.property}
              onValueChange={(value) => setFormData(prev => ({...prev, property: value}))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="bureau">Bureau</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Précisez la catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fenetre">Fenêtre</SelectItem>
                <SelectItem value="porte-vitree">Porte vitrée</SelectItem>
                <SelectItem value="vitrine">Vitrine</SelectItem>
                <SelectItem value="baie-vitree">Baie vitrée</SelectItem>
                <SelectItem value="cloison">Cloison vitrée</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <Glasses className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Information</p>
                <p className="text-muted-foreground">
                  Ces informations nous aident à préparer le bon matériel
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