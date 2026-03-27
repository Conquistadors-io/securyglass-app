import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuoteStep0 } from './quote-steps/QuoteStep0';
import { QuoteStep1 } from './quote-steps/QuoteStep1';
import { QuoteStep2 } from './quote-steps/QuoteStep2';
import { QuoteStep3 } from './quote-steps/QuoteStep3';
import { QuoteStep4 } from './quote-steps/QuoteStep4';
import { QuoteStepper } from './quote-steps/QuoteStepper';
import { QuoteSummary } from './quote-steps/QuoteSummary';

interface OnlineQuoteProps {
  onNavigate: (route: string) => void;
}

export const OnlineQuote = ({ onNavigate }: OnlineQuoteProps) => {
  const defaultFormData = {
    serviceType: '',
    civilite: '',
    nom: '',
    prenom: '',
    raison_sociale: '',
    mobile: '',
    email: '',
    email_facturation: '',
    adresse_intervention: '',
    codePostal: '',
    ville: '',
    assurance: '',
    differentInterventionAddress: false,
    interventionCodePostal: '',
    interventionVille: '',
    interventionAdresse: '',
    object: '',
    property: '',
    motif: '',
    category: '',
    subcategory: '',
    vitrage: '',
    largeur: '',
    hauteur: '',
    quantite: '1',
    photo: null as File | null,
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalSteps = 6;

  // Reset scroll position to top on step change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: any) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
    if (currentStep < totalSteps) {
      handleNext();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <QuoteStep0 data={formData} onComplete={handleStepComplete} onBack={() => onNavigate('welcome')} />;
      case 1:
        return <QuoteStep2 data={formData} onComplete={handleStepComplete} onBack={handlePrevious} />;
      case 2:
        return <QuoteStep3 data={formData} onComplete={handleStepComplete} onBack={handlePrevious} />;
      case 3:
        return <QuoteStep1 data={formData} onComplete={handleStepComplete} onBack={handlePrevious} />;
      case 4:
        return <QuoteStep4 data={formData} onValidate={handleNext} onModify={(step: number) => setCurrentStep(step)} />;
      case 5:
        return (
          <QuoteSummary
            data={formData}
            onNavigate={(route) => {
              onNavigate(route);
            }}
            onComplete={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-sky-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-extrabold text-primary tracking-tight">SECURYGLASS</span>
          </Link>
          <Link to="/" className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
        </div>
      </div>

      {/* Main area wrapper — relative so button can be positioned absolutely outside the scroll flow */}
      <div className="flex-1 min-h-0 relative">
        {/* Scroll container — fills wrapper, contains stepper + form */}
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto hide-scrollbar">
          {/* Stepper — sticky at top of scroll area, lower z */}
          <div className="sticky top-0 z-10 relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
            <div className="py-16">
              <QuoteStepper currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          </div>

          {/* Form — higher z, scrolls over stepper */}
          <div className="relative z-20 -mt-4">
            <div className="max-w-3xl mx-auto px-4 pb-12">
              <div className="flex gap-4">
                {/* Spacer — reserves space for the absolutely-positioned back button */}
                <div className="hidden lg:block w-12 shrink-0" />

                {/* Form card */}
                <div className="flex-1 max-w-2xl mx-auto">
                  <div
                    key={currentStep}
                    className="bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-100 p-6 sm:p-8"
                  >
                    {renderStep()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back button — absolutely positioned OUTSIDE the scroll container */}
        {currentStep <= 4 && (
          <button
            onClick={() => {
              if (currentStep === 0) {
                onNavigate('welcome');
              } else if (currentStep === 4) {
                setCurrentStep(0);
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
            className="hidden lg:flex absolute z-30 items-center justify-center w-12 h-12 rounded-full border-2 border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm"
            style={{
              left: 'calc(50% - 368px)',
              top: '200px',
            }}
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
