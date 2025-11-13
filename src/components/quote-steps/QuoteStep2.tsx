import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, ShieldAlert, AlertCircle, Home, Building2, Building, Store, MoreHorizontal, ChevronDown, ArrowRight, ArrowLeft, Ruler, Cat, Wind, VolumeX, Lock, Droplets, Info, Grid2x2 } from "lucide-react";
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
  
  const [showAutresOptions, setShowAutresOptions] = useState(
    formData.object === "autre" || 
    formData.object === "verre-sur-mesure" || 
    formData.object === "chatiere" || 
    formData.object === "decoupe-aeration" || 
    formData.object === "verre-anti-bruit" || 
    formData.object === "verre-anti-effraction" ||
    formData.object === "condensation"
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  const isValid = formData.object && formData.property && formData.motif && (formData.property !== "autre" || formData.propertyOther.trim() !== "");
  
  // Helper pour obtenir l'affichage de l'option sélectionnée
  const getSelectedOptionDisplay = (object: string) => {
    const options = {
      "verre-sur-mesure": { icon: Ruler, label: "Verre sur mesure" },
      "chatiere": { icon: Cat, label: "Chatière" },
      "decoupe-aeration": { icon: Wind, label: "Découpe aération" },
      "verre-anti-bruit": { icon: VolumeX, label: "Verre Anti-Bruit" },
      "verre-anti-effraction": { icon: Lock, label: "Verre Anti-effraction" },
      "condensation": { icon: Droplets, label: "Condensation" }
    };
    return options[object as keyof typeof options];
  };

  return <Card className="shadow-card border-0">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header de section avec icône */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-gray-100">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Objet de la demande
              </h2>
              <p className="text-sm text-muted-foreground">
                Précisez la nature de votre besoin
              </p>
            </div>
          </div>

          <div>
            <RadioGroup value={formData.object} onValueChange={value => {
              setFormData(prev => ({
                ...prev,
                object: value
              }));
              // Fermer le menu pour toute sélection sauf le bouton "Autres" lui-même
              if (value !== "autre") {
                setShowAutresOptions(false);
              }
            }} className="space-y-4">
              {isMiroiterie ? <>
                  <label htmlFor="miroir-casse" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "miroir-casse" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                      </div>
                      <Label htmlFor="miroir-casse" className={`text-base font-semibold cursor-pointer ${formData.object === "miroir-casse" ? "text-primary" : "text-gray-900"}`}>Miroir cassé</Label>
                    </div>
                    <RadioGroupItem value="miroir-casse" id="miroir-casse" className="w-6 h-6" />
                  </label>
                  
                  <label htmlFor="miroir-sur-mesure" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "miroir-sur-mesure" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-primary" />
                      </div>
                      <Label htmlFor="miroir-sur-mesure" className={`text-base font-semibold cursor-pointer ${formData.object === "miroir-sur-mesure" ? "text-primary" : "text-gray-900"}`}>Miroir sur mesure</Label>
                    </div>
                    <RadioGroupItem value="miroir-sur-mesure" id="miroir-sur-mesure" className="w-6 h-6" />
                  </label>
                </> : <>
                  <label htmlFor="vitre-cassee" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "vitre-cassee" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Grid2x2 className="w-5 h-5 text-primary" />
                      </div>
                      <Label htmlFor="vitre-cassee" className={`text-base font-semibold cursor-pointer ${formData.object === "vitre-cassee" ? "text-primary" : "text-gray-900"}`}>Vitre cassée</Label>
                    </div>
                    <RadioGroupItem value="vitre-cassee" id="vitre-cassee" className="w-6 h-6" />
                  </label>
                  
                  <div className="space-y-4">
                    {showAutresOptions && (
                      <>
                        <label htmlFor="verre-sur-mesure" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "verre-sur-mesure" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Ruler className="w-5 h-5 text-primary" />
                            </div>
                            <Label htmlFor="verre-sur-mesure" className={`text-base font-semibold cursor-pointer ${formData.object === "verre-sur-mesure" ? "text-primary" : "text-gray-900"}`}>Verre sur mesure</Label>
                          </div>
                          <RadioGroupItem value="verre-sur-mesure" id="verre-sur-mesure" className="w-6 h-6" />
                        </label>

                        <label htmlFor="chatiere" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "chatiere" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Cat className="w-5 h-5 text-primary" />
                            </div>
                            <Label htmlFor="chatiere" className={`text-base font-semibold cursor-pointer ${formData.object === "chatiere" ? "text-primary" : "text-gray-900"}`}>Chatière</Label>
                          </div>
                          <RadioGroupItem value="chatiere" id="chatiere" className="w-6 h-6" />
                        </label>

                        <label htmlFor="decoupe-aeration" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "decoupe-aeration" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Wind className="w-5 h-5 text-primary" />
                            </div>
                            <Label htmlFor="decoupe-aeration" className={`text-base font-semibold cursor-pointer ${formData.object === "decoupe-aeration" ? "text-primary" : "text-gray-900"}`}>Découpe aération</Label>
                          </div>
                          <RadioGroupItem value="decoupe-aeration" id="decoupe-aeration" className="w-6 h-6" />
                        </label>

                        <label htmlFor="verre-anti-bruit" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "verre-anti-bruit" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <VolumeX className="w-5 h-5 text-primary" />
                            </div>
                            <Label htmlFor="verre-anti-bruit" className={`text-base font-semibold cursor-pointer ${formData.object === "verre-anti-bruit" ? "text-primary" : "text-gray-900"}`}>Verre Anti-Bruit</Label>
                          </div>
                          <RadioGroupItem value="verre-anti-bruit" id="verre-anti-bruit" className="w-6 h-6" />
                        </label>

                        <label htmlFor="verre-anti-effraction" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "verre-anti-effraction" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <Label htmlFor="verre-anti-effraction" className={`text-base font-semibold cursor-pointer ${formData.object === "verre-anti-effraction" ? "text-primary" : "text-gray-900"}`}>Verre Anti-effraction</Label>
                          </div>
                          <RadioGroupItem value="verre-anti-effraction" id="verre-anti-effraction" className="w-6 h-6" />
                        </label>

                        <label htmlFor="condensation" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "condensation" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Droplets className="w-5 h-5 text-primary" />
                            </div>
                            <Label htmlFor="condensation" className={`text-base font-semibold cursor-pointer ${formData.object === "condensation" ? "text-primary" : "text-gray-900"}`}>Condensation</Label>
                          </div>
                          <RadioGroupItem value="condensation" id="condensation" className="w-6 h-6" />
                        </label>
                      </>
                    )}

                    <div 
                      className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${formData.object === "autre" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200"}`}
                      onClick={() => setShowAutresOptions(!showAutresOptions)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MoreHorizontal className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-base font-semibold ${formData.object === "autre" ? "text-primary" : "text-gray-900"}`}>
                            Autres
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowAutresOptions(!showAutresOptions);
                        }} 
                        className="p-1 rounded transition-colors"
                      >
                        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showAutresOptions ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Afficher l'option sélectionnée EN DESSOUS du bouton Autres */}
                    {formData.object !== "vitre-cassee" && formData.object !== "autre" && !showAutresOptions && (() => {
                      const selectedOption = getSelectedOptionDisplay(formData.object);
                      if (!selectedOption) return null;
                      const OptionIcon = selectedOption.icon;
                      
                      return (
                        <div className="flex items-center space-x-4 p-5 border-2 rounded-xl border-primary bg-primary/5 shadow-md">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <OptionIcon className="w-5 h-5 text-primary" />
                            </div>
                            <Label className="text-base font-semibold text-primary cursor-pointer">
                              {selectedOption.label}
                            </Label>
                          </div>
                          <RadioGroupItem value={formData.object} checked className="w-6 h-6" />
                        </div>
                      );
                    })()}
                  </div>
                </>}
            </RadioGroup>
            
          </div>

          {/* Section Type de bien */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b-2 border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label htmlFor="property" className="text-base font-semibold text-gray-700">
                  Type de bien <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Indiquez où se situe l'intervention
                </p>
              </div>
            </div>
            
            <Select value={formData.property} onValueChange={value => setFormData(prev => ({
            ...prev,
            property: value,
            propertyOther: ""
          }))}>
              <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10">
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
            
            {formData.property === "autre" && <div className="mt-4">
                <Input 
                  placeholder="Précisez le type de bien ..." 
                  value={formData.propertyOther} 
                  onChange={e => setFormData(prev => ({
                  ...prev,
                  propertyOther: e.target.value
                }))} 
                  className="h-12 border-2" 
                />
              </div>}
          </div>

          {/* Section Motif */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b-2 border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <Label htmlFor="motif" className="text-base font-semibold text-gray-700">
                  Motif <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Quelle est la raison de votre demande ?
                </p>
              </div>
            </div>
            
            <Select value={formData.motif} onValueChange={value => setFormData(prev => ({
            ...prev,
            motif: value,
            motifOther: ""
          }))}>
              <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10">
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
            
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg mt-4 flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-blue-900 text-sm font-medium">
                Le motif ne sera pas mentionné sur le devis
              </p>
            </div>
            
            {formData.motif === "autre" && <div className="mt-4">
                <Input 
                  placeholder="Précisez le motif ..." 
                  value={formData.motifOther} 
                  onChange={e => setFormData(prev => ({
                  ...prev,
                  motifOther: e.target.value
                }))} 
                  className="h-12 border-2" 
                />
              </div>}
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