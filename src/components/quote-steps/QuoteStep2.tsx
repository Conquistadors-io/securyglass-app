import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Glasses, Info, ShieldAlert, Ruler, Cat, Wind, VolumeX, Lock, Home, Building2, Building, Store, MoreHorizontal } from "lucide-react";
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
    motifOther: data.motifOther || "",
    miseEnSecurite: data.miseEnSecurite || "non"
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
                  <div className={`group flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "miroir-casse" ? "border-primary" : "border-border"}`}>
                    <RadioGroupItem value="miroir-casse" id="miroir-casse" className="w-6 h-6" />
                    <Label htmlFor="miroir-casse" className={`text-lg cursor-pointer flex-1 group-hover:text-accent-foreground ${formData.object === "miroir-casse" ? "text-primary" : ""}`}>Miroir cassé</Label>
                  </div>
                  
                  <div className={`group flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "miroir-sur-mesure" ? "border-primary" : "border-border"}`}>
                    <RadioGroupItem value="miroir-sur-mesure" id="miroir-sur-mesure" className="w-6 h-6" />
                    <Label htmlFor="miroir-sur-mesure" className={`text-lg cursor-pointer flex-1 group-hover:text-accent-foreground ${formData.object === "miroir-sur-mesure" ? "text-primary" : ""}`}>Miroir sur mesure</Label>
                  </div>
                </> : <>
                  <div className={`group flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "vitre-cassee" ? "border-primary" : "border-border"}`}>
                    <RadioGroupItem value="vitre-cassee" id="vitre-cassee" className="w-6 h-6" />
                    <Label htmlFor="vitre-cassee" className={`text-lg cursor-pointer flex-1 group-hover:text-accent-foreground ${formData.object === "vitre-cassee" ? "text-primary" : ""}`}>Vitre cassée</Label>
                  </div>
                  
                  <div className={`group flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "autre" || formData.object === "verre-sur-mesure" || formData.object === "chatiere" || formData.object === "decoupe-aeration" || formData.object === "verre-anti-bruit" || formData.object === "verre-anti-effraction" ? "border-primary" : "border-border"}`} onClick={() => setFormData(prev => ({ ...prev, object: "autre" }))}>
                    <RadioGroupItem value="autre" id="autre-objet" className="w-6 h-6" />
                    <Label htmlFor="autre-objet" className="text-lg cursor-pointer flex-1 group-hover:text-accent-foreground">
                      Autres :
                      {formData.object !== "autre" && formData.object !== "vitre-cassee" && (
                        <div className="text-primary mt-1">
                          {formData.object === "verre-sur-mesure" ? "Verre sur mesure" : formData.object === "chatiere" ? "Chatière" : formData.object === "decoupe-aeration" ? "Découpe aération" : formData.object === "verre-anti-bruit" ? "Verre Anti-Bruit" : formData.object === "verre-anti-effraction" ? "Verre Anti-effraction" : ""}
                        </div>
                      )}
                    </Label>
                  </div>
                </>}
            </RadioGroup>
            
            {!isMiroiterie && formData.object === "autre" && <div className="mt-4 pl-6 space-y-3">
                <RadioGroup value={formData.object} onValueChange={value => setFormData(prev => ({
              ...prev,
              object: value
            }))}>
                  <div className={`group flex items-center justify-between p-3 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "verre-sur-mesure" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center space-x-3">
                      <Ruler className={`w-4 h-4 shrink-0 group-hover:text-accent-foreground ${formData.object === "verre-sur-mesure" ? "text-primary" : ""}`} />
                      <Label htmlFor="verre-sur-mesure" className={`cursor-pointer group-hover:text-accent-foreground ${formData.object === "verre-sur-mesure" ? "text-primary" : ""}`}>Verre sur mesure</Label>
                    </div>
                    <RadioGroupItem value="verre-sur-mesure" id="verre-sur-mesure" className="w-5 h-5" />
                  </div>
                  
                  
                  
                  <div className={`group flex items-center justify-between p-3 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "chatiere" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center space-x-3">
                      <Cat className={`w-4 h-4 shrink-0 group-hover:text-accent-foreground ${formData.object === "chatiere" ? "text-primary" : ""}`} />
                      <Label htmlFor="chatiere" className={`cursor-pointer group-hover:text-accent-foreground ${formData.object === "chatiere" ? "text-primary" : ""}`}>Chatière</Label>
                    </div>
                    <RadioGroupItem value="chatiere" id="chatiere" className="w-5 h-5" />
                  </div>
                  
                  <div className={`group flex items-center justify-between p-3 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "decoupe-aeration" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center space-x-3">
                      <Wind className={`w-4 h-4 shrink-0 group-hover:text-accent-foreground ${formData.object === "decoupe-aeration" ? "text-primary" : ""}`} />
                      <Label htmlFor="decoupe-aeration" className={`cursor-pointer group-hover:text-accent-foreground ${formData.object === "decoupe-aeration" ? "text-primary" : ""}`}>Découpe aération</Label>
                    </div>
                    <RadioGroupItem value="decoupe-aeration" id="decoupe-aeration" className="w-5 h-5" />
                  </div>
                  
                  <div className={`group flex items-center justify-between p-3 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "verre-anti-bruit" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center space-x-3">
                      <VolumeX className={`w-4 h-4 shrink-0 group-hover:text-accent-foreground ${formData.object === "verre-anti-bruit" ? "text-primary" : ""}`} />
                      <Label htmlFor="verre-anti-bruit" className={`cursor-pointer group-hover:text-accent-foreground ${formData.object === "verre-anti-bruit" ? "text-primary" : ""}`}>Verre Anti-Bruit</Label>
                    </div>
                    <RadioGroupItem value="verre-anti-bruit" id="verre-anti-bruit" className="w-5 h-5" />
                  </div>
                  
                  <div className={`group flex items-center justify-between p-3 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.object === "verre-anti-effraction" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center space-x-3">
                      <Lock className={`w-4 h-4 shrink-0 group-hover:text-accent-foreground ${formData.object === "verre-anti-effraction" ? "text-primary" : ""}`} />
                      <Label htmlFor="verre-anti-effraction" className={`cursor-pointer group-hover:text-accent-foreground ${formData.object === "verre-anti-effraction" ? "text-primary" : ""}`}>Verre Anti-effraction</Label>
                    </div>
                    <RadioGroupItem value="verre-anti-effraction" id="verre-anti-effraction" className="w-5 h-5" />
                  </div>
                </RadioGroup>
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
                <SelectItem value="appartement">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Appartement</span>
                  </div>
                </SelectItem>
                <SelectItem value="maison">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Maison</span>
                  </div>
                </SelectItem>
                <SelectItem value="bureau">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>Bureaux</span>
                  </div>
                </SelectItem>
                <SelectItem value="commerce">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <span>Magasin</span>
                  </div>
                </SelectItem>
                <SelectItem value="immeuble">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Immeuble ( ou parties communes )</span>
                  </div>
                </SelectItem>
                <SelectItem value="autre">
                  <div className="flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                    <span>Autres</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {formData.property === "autre" && <div className="mt-3">
                <Input placeholder="Précisez ..." value={formData.propertyOther} onChange={e => setFormData(prev => ({
              ...prev,
              propertyOther: e.target.value
            }))} />
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
            
            <div className="p-4 bg-primary/10 rounded-lg mt-2 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <p className="text-primary text-sm">
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