import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, MoveVertical, MoveHorizontal, Plus, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PhotoCapture } from "@/components/ui/photo-capture";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
interface QuoteStep3Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}
export const QuoteStep3 = ({
  data,
  onComplete,
  onBack
}: QuoteStep3Props) => {
  const [formData, setFormData] = useState({
    category: data.category || "fenetre",
    vitrage: data.vitrage || "simple",
    largeur: data.largeur || "",
    hauteur: data.hauteur || "",
    quantite: data.quantite || "1",
    photo: data.photo || null,
    photoPreview: data.photoPreview || null
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFields = [];
    if (!formData.category) missingFields.push("Catégorie");
    if (!formData.vitrage) missingFields.push("Type de vitrage");
    if (!formData.largeur) missingFields.push("Largeur");
    if (!formData.hauteur) missingFields.push("Hauteur");
    
    if (missingFields.length > 0) {
      toast({
        title: "Champs manquants",
        description: `Veuillez remplir: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }
    
    onComplete(formData);
  };
  const handlePhotoSelect = (file: File, preview: string) => {
    setFormData(prev => ({
      ...prev,
      photo: file,
      photoPreview: preview
    }));
    toast({
      title: "Photo ajoutée",
      description: "Votre photo a été téléchargée avec succès"
    });
  };

  const handlePhotoDelete = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: null
    }));
    toast({
      title: "Photo supprimée",
      description: "La photo a été supprimée"
    });
  };
  const isValid = formData.category && formData.vitrage && formData.largeur && formData.hauteur;
  return <Card className="shadow-card border-0">
      <div className="p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-6 block">Type de vitrage ?</Label>
            
            <div className="mb-4">
              <Label htmlFor="category">Catégorie <span className="text-destructive">*</span></Label>
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
            
            <RadioGroup 
              value={formData.vitrage} 
              onValueChange={value => setFormData(prev => ({...prev, vitrage: value}))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="simple" id="simple" className="w-6 h-6" />
                <Label htmlFor="simple" className="text-lg cursor-pointer flex-1">Simple</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="double" id="double" className="w-6 h-6" />
                <Label htmlFor="double" className="text-lg cursor-pointer flex-1">Double</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="autre" id="autre" className="w-6 h-6" />
                <Label htmlFor="autre" className="text-lg cursor-pointer flex-1">Autre</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hauteur">Hauteur <span className="text-destructive">*</span></Label>
              <Input id="hauteur" type="number" placeholder="150 cm" className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={formData.hauteur} onChange={e => setFormData(prev => ({
                ...prev,
                hauteur: e.target.value
              }))} required />
            </div>

            <div>
              <Label htmlFor="largeur">Largeur <span className="text-destructive">*</span></Label>
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
            <Label htmlFor="photo">Photos (optionnel)</Label>
            <div className="mt-1 space-y-3">
              {formData.photo && (
                <div className="p-3 bg-accent rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">
                      Photo ajoutée: {formData.photo.name || "Photo sélectionnée"}
                    </p>
                    <div className="flex gap-2">
                      {formData.photoPreview && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <img 
                              src={formData.photoPreview} 
                              alt="Photo prévisualisée" 
                              className="w-full h-auto rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handlePhotoDelete}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <PhotoCapture onPhotoSelect={handlePhotoSelect}>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-20 border-dashed"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter une photo
                </Button>
              </PhotoCapture>
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