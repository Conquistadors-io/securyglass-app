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
              <label htmlFor="vitrerie" className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors cursor-pointer group ${formData.serviceType === 'vitrerie' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <RadioGroupItem value="vitrerie" id="vitrerie" className="w-6 h-6" />
                <div className="flex-1">
                  <div className={`text-lg font-medium ${formData.serviceType === 'vitrerie' ? 'text-primary' : 'text-foreground'}`}>Vitrerie</div>
                  <p className="text-sm mt-1 text-muted-foreground">Tous types de verres</p>
                </div>
              </label>
              
              <label htmlFor="miroiterie" className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors cursor-pointer group ${formData.serviceType === 'miroiterie' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <RadioGroupItem value="miroiterie" id="miroiterie" className="w-6 h-6" />
                <div className="flex-1">
                  <div className={`text-lg font-medium ${formData.serviceType === 'miroiterie' ? 'text-primary' : 'text-foreground'}`}>Miroiterie</div>
                  <p className="text-sm mt-1 text-muted-foreground">Tous types de miroirs</p>
                </div>
              </label>
              
              <div className="space-y-2">
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors group cursor-pointer ${formData.serviceType === 'autres' ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  serviceType: 'autres'
                }));
                setShowAutresOptions(!showAutresOptions);
              }}>
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`text-lg font-medium ${formData.serviceType === 'autres' ? 'text-primary' : 'text-foreground'}`}>
                      Autres
                    </div>
                  </div>
                  <button type="button" onClick={e => {
                  e.stopPropagation();
                  setShowAutresOptions(!showAutresOptions);
                }} className="p-1 rounded transition-colors">
                    <ChevronDown className={`w-5 h-5 text-foreground transition-transform ${showAutresOptions ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {showAutresOptions && <div className="ml-6 space-y-2">
                    <label htmlFor="renovation" className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors cursor-pointer group ${formData.serviceType === 'renovation' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="renovation" id="renovation" className="w-5 h-5" />
                      <div className={`flex-1 ${formData.serviceType === 'renovation' ? 'text-primary' : 'text-foreground'}`}>Volet Roulant</div>
                    </label>
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