import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, Wrench, Sparkles, Grid3x3, Settings, ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
interface QuoteStep0Props {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}
export const QuoteStep0 = ({
  data,
  onComplete,
  onBack
}: QuoteStep0Props) => {
  const [formData, setFormData] = useState({
    serviceType: data.serviceType && data.serviceType !== "" ? data.serviceType : "vitrerie"
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
          {/* Header de section avec icône */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-gray-100">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Type de prestation ?
              </h2>
              <p className="text-sm text-muted-foreground">
                Sélectionnez le type de prestation
              </p>
            </div>
          </div>

          <div>
            <RadioGroup value={formData.serviceType} onValueChange={handleServiceTypeChange} className="space-y-4">
              <label htmlFor="vitrerie" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-gray-300 ${formData.serviceType === 'vitrerie' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-base font-semibold ${formData.serviceType === 'vitrerie' ? 'text-primary' : 'text-gray-900'}`}>Vitrerie</div>
                    <p className={`text-sm mt-0.5 ${formData.serviceType === 'vitrerie' ? 'text-primary/70' : 'text-muted-foreground'}`}>Tous types de verres</p>
                  </div>
                  <RadioGroupItem value="vitrerie" id="vitrerie" className="w-6 h-6 ml-auto" />
                </div>
              </label>
              
              <label htmlFor="miroiterie" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-gray-300 ${formData.serviceType === 'miroiterie' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Grid3x3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-base font-semibold ${formData.serviceType === 'miroiterie' ? 'text-primary' : 'text-gray-900'}`}>Miroiterie</div>
                    <p className={`text-sm mt-0.5 ${formData.serviceType === 'miroiterie' ? 'text-primary/70' : 'text-muted-foreground'}`}>Tous types de miroirs</p>
                  </div>
                  <RadioGroupItem value="miroiterie" id="miroiterie" className="w-6 h-6 ml-auto" />
                </div>
              </label>
              
              <div className="space-y-4">
                {showAutresOptions && (
                  <label htmlFor="renovation" className={`flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-gray-300 ${formData.serviceType === 'renovation' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-base font-semibold ${formData.serviceType === 'renovation' ? 'text-primary' : 'text-gray-900'}`}>Volet Roulant</div>
                        <p className={`text-sm mt-0.5 ${formData.serviceType === 'renovation' ? 'text-primary/70' : 'text-muted-foreground'}`}>Installation et réparation</p>
                      </div>
                      <RadioGroupItem value="renovation" id="renovation" className="w-6 h-6 ml-auto" />
                    </div>
                  </label>
                )}
                
                  <div className={`flex items-center space-x-4 py-3 px-5 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:border-gray-300 ${formData.serviceType === 'autres' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200'}`}
                  onClick={() => {
                    setShowAutresOptions(!showAutresOptions);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MoreHorizontal className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`text-base font-semibold ${formData.serviceType === 'autres' ? 'text-primary' : 'text-gray-900'}`}>Autres</div>
                  </div>
                  <button type="button" onClick={e => {
                    e.stopPropagation();
                    setShowAutresOptions(!showAutresOptions);
                  }} className="p-1 rounded transition-colors">
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showAutresOptions ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            {onBack && (
              <Button type="button" variant="outline" className="flex-1 h-12 text-base font-semibold border-2" onClick={onBack}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
            )}
            <Button type="submit" variant="default" className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all" disabled={!isValid}>
              Continuer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Card>;
};