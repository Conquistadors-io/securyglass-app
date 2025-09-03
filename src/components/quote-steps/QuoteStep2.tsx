import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Glasses, Info } from "lucide-react";
interface QuoteStep2Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}
export const QuoteStep2 = ({
  data,
  onComplete,
  onBack
}: QuoteStep2Props) => {
  // Vérifier si c'est un service miroiterie
  const isMiroiterie = data.serviceType === "miroiterie";
  const [formData, setFormData] = useState({
    object: data.object || (isMiroiterie ? "miroir-casse" : "vitre-cassee"),
    property: data.property || "appartement",
    propertyOther: data.propertyOther || "",
    motif: data.motif || "usure",
    motifOther: data.motifOther || ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  const isValid = formData.object && formData.property && formData.motif && (formData.property !== "autre" || formData.propertyOther.trim() !== "");
  return <Card className="shadow-card border-0">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-6 block">Objet de la demande :</Label>
            <RadioGroup value={formData.object} onValueChange={value => setFormData(prev => ({
            ...prev,
            object: value
          }))} className="space-y-4">
              {isMiroiterie ? <>
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "miroir-casse" ? "bg-primary text-primary-foreground" : ""}`}>
                    <RadioGroupItem value="miroir-casse" id="miroir-casse" className="w-6 h-6" />
                    <Label htmlFor="miroir-casse" className="text-lg cursor-pointer flex-1">Miroir cassé</Label>
                  </div>
                  
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "miroir-sur-mesure" ? "bg-primary text-primary-foreground" : ""}`}>
                    <RadioGroupItem value="miroir-sur-mesure" id="miroir-sur-mesure" className="w-6 h-6" />
                    <Label htmlFor="miroir-sur-mesure" className="text-lg cursor-pointer flex-1">Miroir sur mesure</Label>
                  </div>
                </> : <>
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "vitre-cassee" ? "bg-primary text-primary-foreground" : ""}`}>
                    <RadioGroupItem value="vitre-cassee" id="vitre-cassee" className={`w-6 h-6 ${formData.object === "vitre-cassee" ? "border-white text-white" : ""}`} />
                    <Label htmlFor="vitre-cassee" className="text-lg cursor-pointer flex-1">Vitre cassée</Label>
                  </div>
                  
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "autre" ? "bg-primary text-primary-foreground" : ""}`}>
                    <RadioGroupItem value="autre" id="autre-objet" className={`w-6 h-6 ${formData.object === "autre" ? "border-white text-white" : ""}`} />
                    <Label htmlFor="autre-objet" className="text-lg cursor-pointer flex-1">Autres</Label>
                  </div>
                </>}
            </RadioGroup>
            
            {!isMiroiterie && formData.object === "autre" && <div className="mt-4 pl-6 space-y-3">
                <RadioGroup value={formData.object} onValueChange={value => setFormData(prev => ({
              ...prev,
              object: value
            }))}>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="verre-sur-mesure" id="verre-sur-mesure" className="w-5 h-5" />
                    <Label htmlFor="verre-sur-mesure" className="cursor-pointer flex-1">Verre sur mesure</Label>
                  </div>
                  
                  
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="chatiere" id="chatiere" className="w-5 h-5" />
                    <Label htmlFor="chatiere" className="cursor-pointer flex-1">Chatière</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="decoupe-aeration" id="decoupe-aeration" className="w-5 h-5" />
                    <Label htmlFor="decoupe-aeration" className="cursor-pointer flex-1">Découpe aération</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="verre-anti-bruit" id="verre-anti-bruit" className="w-5 h-5" />
                    <Label htmlFor="verre-anti-bruit" className="cursor-pointer flex-1">Verre Anti-Bruit</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="verre-anti-effraction" id="verre-anti-effraction" className="w-5 h-5" />
                    <Label htmlFor="verre-anti-effraction" className="cursor-pointer flex-1">Verre Anti-effraction</Label>
                  </div>
                </RadioGroup>
              </div>}
          </div>

          <div>
            <Label htmlFor="motif">Motif : <span className="text-destructive">*</span></Label>
            
            <Select value={formData.motif} onValueChange={value => setFormData(prev => ({
            ...prev,
            motif: value,
            motifOther: ""
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sans motif apparent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usure">Sans motif apparent</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="choc-thermique">Choc thermique</SelectItem>
                <SelectItem value="vandalisme">Vandalisme</SelectItem>
                <SelectItem value="effraction">Effraction ( ou tentative )</SelectItem>
                <SelectItem value="pompiers">Intervention des pompiers</SelectItem>
                <SelectItem value="projectiles">Projectiles</SelectItem>
                <SelectItem value="ne-sais-pas">Je ne sais pas</SelectItem>
                <SelectItem value="autre">Autres</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="p-4 bg-accent rounded-lg mt-2 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-white" />
              <p className="text-white text-sm">
                Le motif ne sera pas mentionné sur le devis
              </p>
            </div>
            
            {formData.motif === "autre" && <div className="mt-3">
                <Input placeholder="Précisez ..." value={formData.motifOther} onChange={e => setFormData(prev => ({
              ...prev,
              motifOther: e.target.value
            }))} />
              </div>}
          </div>

          <div>
            <Label htmlFor="property">Lieu <span className="text-destructive">*</span></Label>
            <Select value={formData.property} onValueChange={value => setFormData(prev => ({
            ...prev,
            property: value,
            propertyOther: ""
          }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Appartement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="immeuble">Immeuble ( ou parties communes )</SelectItem>
                <SelectItem value="bureau">Bureaux</SelectItem>
                <SelectItem value="commerce">Magasin</SelectItem>
                <SelectItem value="autre">Autres</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.property === "autre" && <div className="mt-3">
                <Input placeholder="Précisez ..." value={formData.propertyOther} onChange={e => setFormData(prev => ({
              ...prev,
              propertyOther: e.target.value
            }))} />
              </div>}
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