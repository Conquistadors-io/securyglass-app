import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuoteStep0Props {
  data: any;
  onComplete: (data: any) => void;
}

export const QuoteStep0 = ({ data, onComplete }: QuoteStep0Props) => {
  const [formData, setFormData] = useState({
    serviceType: data.serviceType || "vitrerie"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isValid = formData.serviceType;

  return (
    <Card className="shadow-card border-0">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Type de service
          </h2>
          <p className="text-muted-foreground">
            Sélectionnez le type de service dont vous avez besoin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-6 block">Quel type de service souhaitez-vous ?</Label>
            <RadioGroup 
              value={formData.serviceType} 
              onValueChange={value => setFormData(prev => ({...prev, serviceType: value}))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="vitrerie" id="vitrerie" className="w-6 h-6" />
                <div className="flex-1">
                  <Label htmlFor="vitrerie" className="text-lg cursor-pointer">Vitrerie</Label>
                  <p className="text-sm text-muted-foreground mt-1">Tous types de verres</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="miroiterie" id="miroiterie" className="w-6 h-6" />
                <div className="flex-1">
                  <Label htmlFor="miroiterie" className="text-lg cursor-pointer">Miroiterie</Label>
                  <p className="text-sm text-muted-foreground mt-1">Tous types de miroirs</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <RadioGroupItem value="autres" id="autres" className="w-6 h-6" />
                <Label htmlFor="autres" className="text-lg cursor-pointer flex-1">Autres</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            type="submit" 
            variant="default" 
            size="lg" 
            className="w-full"
            disabled={!isValid}
          >
            Continuer
          </Button>
        </form>
      </div>
    </Card>
  );
};