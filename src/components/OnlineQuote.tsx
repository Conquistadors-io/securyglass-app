import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QuoteStep1 } from "./quote-steps/QuoteStep1";
import { QuoteStep2 } from "./quote-steps/QuoteStep2";
import { QuoteStep3 } from "./quote-steps/QuoteStep3";
import { QuoteSummary } from "./quote-steps/QuoteSummary";

interface OnlineQuoteProps {
  onNavigate: (route: string) => void;
}

export const OnlineQuote = ({ onNavigate }: OnlineQuoteProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal info
    civilite: "",
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    
    // Step 2: Object
    object: "",
    
    // Step 3: Motif
    motif: "",
    
    // Step 4: Property (simplified for demo)
    property: "",
    category: "",
    vitrage: "",
    largeur: "",
    hauteur: "",
    quantite: "1",
    assurance: "",
    photo: null as File | null
  });

  const totalSteps = 4; // Simplified to 4 steps for demo
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    if (currentStep < totalSteps) {
      handleNext();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuoteStep1 
            data={formData} 
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <QuoteStep2 
            data={formData} 
            onComplete={handleStepComplete}
          />
        );
      case 3:
        return (
          <QuoteStep3 
            data={formData} 
            onComplete={handleStepComplete}
          />
        );
      case 4:
        return (
          <QuoteSummary 
            data={formData} 
            onNavigate={onNavigate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 mr-3"
              onClick={() => currentStep === 1 ? onNavigate('welcome') : handlePrevious()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Devis en Ligne</h1>
          </div>
          <span className="text-sm">
            {currentStep}/{totalSteps}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress 
            value={progress} 
            className="h-2 bg-white/20"
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 py-8">
        {renderStep()}
      </div>
    </div>
  );
};