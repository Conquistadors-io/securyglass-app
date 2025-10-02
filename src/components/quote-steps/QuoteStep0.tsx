import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";
interface QuoteStep0Props {
  data: any;
  onComplete: (data: any) => void;
}
export const QuoteStep0 = ({
  data,
  onComplete
}: QuoteStep0Props) => {
  const [formData, setFormData] = useState({
    serviceType: data.serviceType || "vitrerie"
  });

  // La section "Autres" reste ouverte si on a sélectionné "autres" ou une de ses sous-options
  const [showAutresOptions, setShowAutresOptions] = useState(formData.serviceType === "autres" || formData.serviceType === "renovation");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  const handleServiceTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType: value
    }));

    // Ouvrir automatiquement la section "Autres" si on sélectionne une sous-option
    if (value === "autres" || value === "renovation") {
      setShowAutresOptions(true);
    } else {
      // Fermer la section "Autres" si on sélectionne vitrerie ou miroiterie
      setShowAutresOptions(false);
    }
  };
  const isValid = formData.serviceType;
  return <Card className="shadow-card border-0">
      <div className="p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-6 block">Quel type de service souhaitez-vous ?</Label>
            <RadioGroup value={formData.serviceType} onValueChange={handleServiceTypeChange} className="space-y-4">
              <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.serviceType === 'vitrerie' ? 'border-primary' : 'border-border'}`}>
                <RadioGroupItem value="vitrerie" id="vitrerie" className="w-6 h-6" />
                <div className="flex-1" onClick={() => handleServiceTypeChange('vitrerie')}>
                  <Label htmlFor="vitrerie" className="text-lg cursor-pointer text-primary">Vitrerie</Label>
                  <p className={`text-sm mt-1 ${formData.serviceType === 'vitrerie' ? 'text-primary opacity-70' : 'opacity-70'}`}>Tous types de verres</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.serviceType === 'miroiterie' ? 'border-primary' : 'border-border'}`}>
                <RadioGroupItem value="miroiterie" id="miroiterie" className="w-6 h-6" />
                <div className="flex-1" onClick={() => handleServiceTypeChange('miroiterie')}>
                  <Label htmlFor="miroiterie" className="text-lg cursor-pointer text-primary">Miroiterie</Label>
                  <p className={`text-sm mt-1 ${formData.serviceType === 'miroiterie' ? 'text-primary opacity-70' : 'opacity-70'}`}>Tous types de miroirs</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.serviceType === 'autres' ? 'border-primary' : 'border-border'}`} onClick={() => {
                handleServiceTypeChange('autres');
                setShowAutresOptions(true);
              }}>
                  <RadioGroupItem value="autres" id="autres" className="w-6 h-6" />
                  <Label htmlFor="autres" className="text-lg cursor-pointer flex-1 text-slate-700">
                    Autres
                  </Label>
                  <button type="button" onClick={e => {
                  e.stopPropagation();
                  setShowAutresOptions(!showAutresOptions);
                }} className="p-1 hover:bg-accent rounded transition-colors">
                    <ChevronDown className={`w-5 h-5 transition-transform ${showAutresOptions ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {showAutresOptions && <div className="ml-6 space-y-2">
                    
                    <div className={`flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer ${formData.serviceType === 'renovation' ? 'border-primary' : 'border-border'}`} onClick={() => handleServiceTypeChange('renovation')}>
                      <RadioGroupItem value="renovation" id="renovation" className="w-5 h-5" />
                      <Label htmlFor="renovation" className="cursor-pointer flex-1 text-slate-700">Rénovation</Label>
                    </div>
                  </div>}
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={!isValid}>
            Continuer
          </Button>
        </form>
      </div>
    </Card>;
};