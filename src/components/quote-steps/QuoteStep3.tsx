import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, MoveVertical, MoveHorizontal, Plus, X, Eye, Trash2, ChevronDown, Square, DoorOpen, DoorClosed, Maximize2, Store, RectangleHorizontal, ArrowUpFromLine, Sun, Grid3x3, Grid2x2, MoreHorizontal, Ruler, Camera, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PhotoCapture } from "@/components/ui/photo-capture";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
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
  const [showAutresOptions, setShowAutresOptions] = useState(data.vitrage === "autre" || data.vitrage === "verre-feuillete" || data.vitrage === "verre-trempe");
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
          {/* Header de section avec icône */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-gray-100">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Grid2x2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Type de vitrage ?
            </h2>
              <p className="text-sm text-muted-foreground">
                Caractéristiques techniques
              </p>
            </div>
          </div>

          {/* Section Type de vitrage */}
          <div className="space-y-4">
            <div className="space-y-2">
              <RadioGroup
                value={formData.category}
                onValueChange={value => {
                  setFormData(prev => ({
                    ...prev,
                    category: value,
                    subcategory: value === "baie-vitree" ? "coulissante" : "",
                    vitrage: value === "baie-vitree" ? "double" : value === "vitrine" ? "verre-feuillete" : prev.vitrage
                  }));
                  setValidationErrors(prev => ({
                    ...prev,
                    category: false
                  }));
                }}
                className="space-y-4"
              >
                <label htmlFor="cat-fenetre" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'fenetre' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Square className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'fenetre' ? 'text-primary' : 'text-gray-900'}`}>Fenêtre</div>
                    </div>
                    <RadioGroupItem value="fenetre" id="cat-fenetre" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-porte-vitree" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'porte-vitree' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DoorOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'porte-vitree' ? 'text-primary' : 'text-gray-900'}`}>Porte vitrée</div>
                    </div>
                    <RadioGroupItem value="porte-vitree" id="cat-porte-vitree" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-porte-entree" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'porte-entree' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DoorClosed className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'porte-entree' ? 'text-primary' : 'text-gray-900'}`}>Porte d'entrée</div>
                    </div>
                    <RadioGroupItem value="porte-entree" id="cat-porte-entree" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-porte-fenetre" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'porte-fenetre' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'porte-fenetre' ? 'text-primary' : 'text-gray-900'}`}>Porte-fenêtre</div>
                    </div>
                    <RadioGroupItem value="porte-fenetre" id="cat-porte-fenetre" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-vitrine" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'vitrine' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'vitrine' ? 'text-primary' : 'text-gray-900'}`}>Vitrine Magasin</div>
                    </div>
                    <RadioGroupItem value="vitrine" id="cat-vitrine" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-baie-vitree" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'baie-vitree' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <RectangleHorizontal className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'baie-vitree' ? 'text-primary' : 'text-gray-900'}`}>Baie vitrée</div>
                    </div>
                    <RadioGroupItem value="baie-vitree" id="cat-baie-vitree" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-marquise" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'marquise' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowUpFromLine className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'marquise' ? 'text-primary' : 'text-gray-900'}`}>Marquise</div>
                    </div>
                    <RadioGroupItem value="marquise" id="cat-marquise" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-fenetre-toit" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'fenetre-toit' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Square className="w-5 h-5 text-primary rotate-45" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'fenetre-toit' ? 'text-primary' : 'text-gray-900'}`}>Fenêtre de toit</div>
                    </div>
                    <RadioGroupItem value="fenetre-toit" id="cat-fenetre-toit" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-velux" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'velux' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'velux' ? 'text-primary' : 'text-gray-900'}`}>VELUX</div>
                    </div>
                    <RadioGroupItem value="velux" id="cat-velux" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-cloison" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'cloison' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Grid3x3 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${formData.category === 'cloison' ? 'text-primary' : 'text-gray-900'}`}>Cloison Vitrée Bureaux</div>
                    </div>
                    <RadioGroupItem value="cloison" id="cat-cloison" className="w-6 h-6 ml-auto" />
                  </div>
                </label>

                <label htmlFor="cat-autre" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all cursor-pointer hover:border-gray-300 ${formData.category === 'autre' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MoreHorizontal className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`text-base font-semibold ${formData.category === 'autre' ? 'text-primary' : 'text-gray-900'}`}>Autre</div>
                    <RadioGroupItem value="autre" id="cat-autre" className="w-6 h-6 ml-auto" />
                  </div>
                </label>
              </RadioGroup>
            </div>
            
            {formData.category === "baie-vitree" && <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-700">Type de baie vitrée</Label>
                <Select value={formData.subcategory} onValueChange={value => {
              setFormData(prev => ({
                ...prev,
                subcategory: value
              }));
            }}>
                <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10">
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coulissante" className="text-blue-600">Coulissante</SelectItem>
                    <SelectItem value="fixe" className="text-blue-600">Fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="vitrage" className="text-base font-semibold text-gray-700">
                Type de vitrage <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.vitrage} onValueChange={value => {
              setFormData(prev => ({
                ...prev,
                vitrage: value
              }));
              setValidationErrors(prev => ({
                ...prev,
                vitrage: false
              }));
            }}>
                <SelectTrigger className={`w-full h-12 border-2 ${validationErrors.vitrage ? 'border-red-500' : 'border-gray-200'} hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10`}>
                  <SelectValue placeholder="Sélectionnez le type de vitrage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple" className="text-blue-600">Simple Vitrage</SelectItem>
                  <SelectItem value="double" className="text-blue-600">Double Vitrage</SelectItem>
                  <SelectItem value="verre-securit" className="text-blue-600">Verre Cheminée</SelectItem>
                  <SelectItem value="verre-feuillete" className="text-blue-600">Verre Feuilleté Sécurit</SelectItem>
                  <SelectItem value="verre-trempe" className="text-blue-600">Verre Trempé Sécurit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section Dimensions */}
          <div className="bg-primary/5 p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Dimensions
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hauteur" className="text-base font-semibold text-gray-700">
                  Hauteur (cm) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MoveVertical className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="hauteur" 
                    type="number" 
                    placeholder="Ex : 190" 
                    className={`h-12 pl-12 border-2 ${validationErrors.hauteur ? 'border-red-500' : 'border-gray-200'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                    value={formData.hauteur} 
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        hauteur: e.target.value
                      }));
                      setValidationErrors(prev => ({
                        ...prev,
                        hauteur: false
                      }));
                    }} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="largeur" className="text-base font-semibold text-gray-700">
                  Largeur (cm) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MoveHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="largeur" 
                    type="number" 
                    placeholder="Ex : 100" 
                    className={`h-12 pl-12 border-2 ${validationErrors.largeur ? 'border-red-500' : 'border-gray-200'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                    value={formData.largeur} 
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        largeur: e.target.value
                      }));
                      setValidationErrors(prev => ({
                        ...prev,
                        largeur: false
                      }));
                    }} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite" className="text-base font-semibold text-gray-700">Quantité</Label>
                <div className="relative">
                  <X className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="quantite" 
                    type="number" 
                    min="1" 
                    placeholder="1" 
                    className="h-12 pl-12 border-2 border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={formData.quantite} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      quantite: e.target.value
                    }))} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Photo */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b-2 border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-700">
                  Photo (optionnel)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajoutez une photo si possible
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {formData.photo && formData.photoPreview && <Dialog>
                  <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <DialogTrigger asChild>
                        <button type="button" className="flex items-center gap-2 text-base font-medium text-primary cursor-pointer hover:text-primary/80 transition-colors">
                          <Eye className="h-4 w-4" />
                          Voir la photo
                        </button>
                      </DialogTrigger>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={handlePhotoDelete} 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                  <DialogContent className="max-w-lg">
                    <DialogTitle>Aperçu de la photo</DialogTitle>
                    <img src={formData.photoPreview} alt="Photo prévisualisée" className="w-full h-auto rounded-lg" />
                  </DialogContent>
                </Dialog>}
              
              <PhotoCapture onPhotoSelect={handlePhotoSelect}>
                <Button type="button" variant="outline" className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all">
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter une photo
                </Button>
              </PhotoCapture>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {onBack && <Button type="button" variant="outline" className="flex-1 h-12 text-base font-semibold border-2 hover:scale-105 transition-all" onClick={onBack}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>}
            <Button type="submit" variant="default" className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all" disabled={!isValid}>
              Continuer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Card>;
};