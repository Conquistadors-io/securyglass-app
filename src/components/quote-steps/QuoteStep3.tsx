import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Shield, MoveVertical, MoveHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface QuoteStep3Props {
  data: any;
  onComplete: (data: any) => void;
}
export const QuoteStep3 = ({
  data,
  onComplete
}: QuoteStep3Props) => {
  const [formData, setFormData] = useState({
    category: data.category || "fenetre",
    vitrage: data.vitrage || "simple",
    largeur: data.largeur || "",
    hauteur: data.hauteur || "",
    quantite: data.quantite || "1",
    photo: data.photo || null
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      toast({
        title: "Photo ajoutée",
        description: "Votre photo a été téléchargée avec succès"
      });
    }
  };
  const isValid = formData.category && formData.vitrage && formData.largeur && formData.hauteur;
  return <Card className="shadow-card border-0">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Description</h2>
          <p className="text-muted-foreground">
            Spécifications pour calculer votre devis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={value => setFormData(prev => ({
            ...prev,
            category: value
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Précisez la catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fenetre">Fenêtre</SelectItem>
                <SelectItem value="porte-vitree">Porte vitrée</SelectItem>
                <SelectItem value="porte-entree">Porte d'entrée</SelectItem>
                <SelectItem value="porte-fenetre">Porte-fenêtre</SelectItem>
                <SelectItem value="vitrine">Vitrine</SelectItem>
                <SelectItem value="baie-vitree">Baie vitrée</SelectItem>
                <SelectItem value="marquise">Marquise</SelectItem>
                <SelectItem value="fenetre-toit">Fenêtre de toit</SelectItem>
                <SelectItem value="velux">VELUX</SelectItem>
                <SelectItem value="cloison">Cloison vitrée</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vitrage">Type de vitrage *</Label>
            <Select value={formData.vitrage} onValueChange={value => setFormData(prev => ({
            ...prev,
            vitrage: value
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple vitrage</SelectItem>
                <SelectItem value="double">Double vitrage</SelectItem>
                <SelectItem value="trempe">Verre trempé</SelectItem>
                <SelectItem value="feuillete">Verre feuilleté</SelectItem>
                <SelectItem value="anti-bruit">Anti-bruit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hauteur">Hauteur *</Label>
              <Input id="hauteur" type="number" placeholder="150 cm" className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={formData.hauteur} onChange={e => setFormData(prev => ({
                ...prev,
                hauteur: e.target.value
              }))} required />
            </div>

            <div>
              <Label htmlFor="largeur">Largeur *</Label>
              <Input id="largeur" type="number" placeholder="100 cm" className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={formData.largeur} onChange={e => setFormData(prev => ({
                ...prev,
                largeur: e.target.value
              }))} required />
            </div>

            <div>
              <Label htmlFor="quantite">Qté</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-3 text-sm text-muted-foreground">x</span>
                <Input id="quantite" type="number" min="1" value={formData.quantite} onChange={e => setFormData(prev => ({
                ...prev,
                quantite: e.target.value
              }))} className="pl-8" />
              </div>
            </div>
          </div>


          <div>
            <Label htmlFor="photo">Photo (optionnel)</Label>
            <div className="mt-1 space-y-3">
              {formData.photo && (
                <div className="p-3 bg-accent rounded-lg">
                  <p className="text-sm text-foreground">
                    Photo ajoutée: {formData.photo.name || "Photo sélectionnée"}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <label htmlFor="camera-upload" className="flex flex-col items-center justify-center h-20 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                  <Camera className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-sm text-muted-foreground">Prendre une photo</span>
                  <input id="camera-upload" type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                </label>
                
                <label htmlFor="gallery-upload" className="flex flex-col items-center justify-center h-20 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                  <div className="h-5 w-5 mb-1 flex items-center justify-center">
                    <div className="w-4 h-3 border border-muted-foreground rounded-sm"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Mes photos</span>
                  <input id="gallery-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={!isValid}>
            Voir le devis
          </Button>
        </form>
      </div>
    </Card>;
};