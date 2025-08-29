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
    subcategory: data.subcategory || "coulissante",
    vitrage: data.vitrage || "simple",
    largeur: data.largeur || "",
    hauteur: data.hauteur || "",
    quantite: data.quantite || "1",
    photo: data.photo || null,
    photoPreview: data.photoPreview || null
  });
  const [validationErrors, setValidationErrors] = useState({
    category: false,
    vitrage: false,
    largeur: false,
    hauteur: false
  });
  const {
    toast
  } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      category: !formData.category,
      vitrage: !formData.vitrage,
      largeur: !formData.largeur,
      hauteur: !formData.hauteur
    };
    setValidationErrors(errors);
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
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

  const isValid = formData.category && formData.vitrage && formData.largeur && formData.hauteur && (formData.category !== "baie-vitree" || formData.subcategory);

  return <Card className="shadow-card border-0">
      <div className="p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-6 block">Type de vitrage ?</Label>
            
            <div className="mb-4">
              <Label htmlFor="category">Catégorie <span className="text-destructive">*</span></Label>
               <Select value={formData.category} onValueChange={value => {
              setFormData(prev => ({
                ...prev,
                category: value,
                subcategory: value === "baie-vitree" ? "coulissante" : prev.subcategory,
                vitrage: value === "baie-vitree" ? "double" : prev.vitrage
              }));
              setValidationErrors(prev => ({
                ...prev,
                category: false
              }));
            }}>
                 <SelectTrigger className={`mt-1 ${validationErrors.category ? 'border-red-500 ring-red-500' : ''}`}>
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
            
            {formData.category === "baie-vitree" && <div className="mb-4">
                
                <RadioGroup value={formData.subcategory} onValueChange={value => {
              setFormData(prev => ({
                ...prev,
                subcategory: value
              }));
            }} className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coulissante" id="coulissante" className="w-4 h-4" />
                    <Label htmlFor="coulissante" className="text-sm cursor-pointer">Coulissante</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixe" id="fixe" className="w-4 h-4" />
                    <Label htmlFor="fixe" className="text-sm cursor-pointer">Fixe</Label>
                  </div>
                </RadioGroup>
              </div>}
            
            <RadioGroup value={formData.vitrage} onValueChange={value => {
            setFormData(prev => ({
              ...prev,
              vitrage: value
            }));
            setValidationErrors(prev => ({
              ...prev,
              vitrage: false
            }));
          }} className={`space-y-4 ${validationErrors.vitrage ? 'ring-2 ring-red-500 rounded-lg p-2' : ''}`}>
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="simple" id="simple" className="w-6 h-6" />
                <Label htmlFor="simple" className="text-lg cursor-pointer flex-1">Simple Vitrage</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="double" id="double" className="w-6 h-6" />
                <Label htmlFor="double" className="text-lg cursor-pointer flex-1">Double Vitrage</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="autre" id="autre" className="w-6 h-6" />
                <Label htmlFor="autre" className="text-lg cursor-pointer flex-1">Autres</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
            <div>
              <Label htmlFor="hauteur">Hauteur (cm) <span className="text-destructive">*</span></Label>
              <Input id="hauteur" type="number" placeholder="150" className={`mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${validationErrors.hauteur ? 'border-red-500 ring-red-500' : ''}`} value={formData.hauteur} onChange={e => {
              setFormData(prev => ({
                ...prev,
                hauteur: e.target.value
              }));
              setValidationErrors(prev => ({
                ...prev,
                hauteur: false
              }));
            }} required />
            </div>

            <div>
              <Label htmlFor="largeur">Largeur (cm) <span className="text-destructive">*</span></Label>
              <Input id="largeur" type="number" placeholder="100" className={`mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${validationErrors.largeur ? 'border-red-500 ring-red-500' : ''}`} value={formData.largeur} onChange={e => {
              setFormData(prev => ({
                ...prev,
                largeur: e.target.value
              }));
              setValidationErrors(prev => ({
                ...prev,
                largeur: false
              }));
            }} required />
            </div>

            <div className="w-20">
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

          <Button type="button" variant="outline" className="w-full" onClick={() => {
          toast({
            title: "Article ajouté",
            description: "Un nouvel article a été ajouté à votre devis"
          });
        }}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un article
          </Button>

          <div>
            <Label htmlFor="photo">Photos ( optionnel )</Label>
            <div className="mt-1 space-y-3">
              {formData.photo && <div className="p-3 bg-accent rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">
                      Photo ajoutée: {formData.photo.name || "Photo sélectionnée"}
                    </p>
                    <div className="flex gap-2">
                      {formData.photoPreview && <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <img src={formData.photoPreview} alt="Photo prévisualisée" className="w-full h-auto rounded-lg" />
                          </DialogContent>
                        </Dialog>}
                      <Button size="sm" variant="outline" onClick={handlePhotoDelete} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>}
              
              <PhotoCapture onPhotoSelect={handlePhotoSelect}>
                <Button type="button" variant="outline" className="w-full h-20 border-dashed">
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter une photo
                </Button>
              </PhotoCapture>
            </div>
          </div>

          <div className="flex gap-4">
            {onBack && <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>
                Retour
              </Button>}
            <Button type="submit" variant="default" size="lg" className="flex-1" disabled={!isValid}>
              Continuer
            </Button>
          </div>
        </form>
      </div>
    </Card>;
};
