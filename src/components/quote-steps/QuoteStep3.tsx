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
    category: data.category || "",
    vitrage: data.vitrage || "",
    largeur: data.largeur || "",
    hauteur: data.hauteur || "",
    quantite: data.quantite || "1",
    assurance: data.assurance || "",
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hauteur">Hauteur (cm) *</Label>
              <div className="relative mt-1">
                <MoveVertical className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="hauteur" type="number" placeholder="150" className="pl-10" value={formData.hauteur} onChange={e => setFormData(prev => ({
                ...prev,
                hauteur: e.target.value
              }))} required />
              </div>
            </div>

            <div>
              <Label htmlFor="largeur">Largeur (cm) *</Label>
              <div className="relative mt-1">
                <MoveHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="largeur" type="number" placeholder="100" className="pl-10" value={formData.largeur} onChange={e => setFormData(prev => ({
                ...prev,
                largeur: e.target.value
              }))} required />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="quantite">Quantité</Label>
            <Input id="quantite" type="number" min="1" value={formData.quantite} onChange={e => setFormData(prev => ({
            ...prev,
            quantite: e.target.value
          }))} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="assurance">Prise en charge assurance</Label>
            <Select value={formData.assurance} onValueChange={value => setFormData(prev => ({
            ...prev,
            assurance: value
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Avez-vous une assurance ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oui">Oui, j'ai une assurance</SelectItem>
                <SelectItem value="non">Non, pas d'assurance</SelectItem>
                <SelectItem value="ne-sait-pas">Je ne sais pas</SelectItem>
              </SelectContent>
            </Select>
            {formData.assurance === "oui" && <div className="mt-2 p-3 bg-accent rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="text-sm text-foreground">
                    Nous vous aiderons avec votre dossier assurance
                  </p>
                </div>
              </div>}
          </div>

          <div>
            <Label htmlFor="photo">Photo (optionnel)</Label>
            <div className="mt-1">
              <label htmlFor="photo-upload" className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <div className="text-center">
                  <Camera className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {formData.photo ? formData.photo.name || "Photo ajoutée" : "Ajouter une photo du vitrage"}
                  </p>
                </div>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={!isValid}>
            Voir le devis
          </Button>
        </form>
      </div>
    </Card>;
};