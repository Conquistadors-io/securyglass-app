import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { QuoteStep0 } from "./quote-steps/QuoteStep0";
import { QuoteStep1 } from "./quote-steps/QuoteStep1";
import { QuoteStep2 } from "./quote-steps/QuoteStep2";
import { QuoteStep3 } from "./quote-steps/QuoteStep3";
import { QuoteSummary } from "./quote-steps/QuoteSummary";
import { QuoteStep4 } from "./quote-steps/QuoteStep4";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OnlineQuoteProps {
  onNavigate: (route: string) => void;
}

interface CachedQuoteData {
  formData: any;
  currentStep: number;
  timestamp: number;
  completed: boolean;
}

export const OnlineQuote = ({
  onNavigate
}: OnlineQuoteProps) => {
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const defaultFormData = {
    serviceType: "",
    civilite: "",
    nom: "",
    prenom: "",
    raison_sociale: "",
    mobile: "",
    email: "",
    email_facturation: "",
    adresse_intervention: "",
    codePostal: "",
    ville: "",
    assurance: "",
    differentInterventionAddress: false,
    interventionCodePostal: "",
    interventionVille: "",
    interventionAdresse: "",
    object: "",
    property: "",
    motif: "",
    category: "",
    subcategory: "",
    vitrage: "",
    largeur: "",
    hauteur: "",
    quantite: "1",
    photo: null as File | null
  };

  // Initialisation avec gestion d'expiration et completion
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem('quote-cache');
      if (!saved) return 0;
      
      const cache: CachedQuoteData = JSON.parse(saved);
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 heures
      
      // Si le cache a plus de 24h OU si le devis était complété, nettoyer
      if (now - cache.timestamp > expirationTime || cache.completed) {
        localStorage.removeItem('quote-cache');
        localStorage.removeItem('quote-form-data');
        localStorage.removeItem('quote-current-step');
        console.log('🧹 Cache expiré ou devis complété - nettoyage');
        return 0;
      }
      
      return cache.currentStep;
    } catch {
      return 0;
    }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('quote-cache');
      if (!saved) return defaultFormData;
      
      const cache: CachedQuoteData = JSON.parse(saved);
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000;
      
      if (now - cache.timestamp > expirationTime || cache.completed) {
        return defaultFormData;
      }
      
      return cache.currentStep > 0 ? cache.formData : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  // Scroll vers le haut à chaque changement d'étape
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Détecter les données existantes au chargement
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quote-cache');
      if (saved) {
        const cache: CachedQuoteData = JSON.parse(saved);
        const now = Date.now();
        const expirationTime = 24 * 60 * 60 * 1000;
        
        // Si données valides et non expirées et non complétées et pas à l'étape 0
        if (
          now - cache.timestamp < expirationTime && 
          !cache.completed && 
          cache.currentStep > 0
        ) {
          setShowResumeDialog(true);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lecture cache:', error);
    }
  }, []);

  // Sauvegarder dans une structure unifiée avec timestamp
  useEffect(() => {
    try {
      const cache: CachedQuoteData = {
        formData,
        currentStep,
        timestamp: Date.now(),
        completed: false
      };
      localStorage.setItem('quote-cache', JSON.stringify(cache));
    } catch (error) {
      console.error('❌ Erreur sauvegarde cache:', error);
    }
  }, [formData, currentStep]);

  // Fonction pour vider le cache
  const clearSavedData = () => {
    try {
      localStorage.removeItem('quote-cache');
      localStorage.removeItem('quote-form-data'); // Compatibilité anciennes versions
      localStorage.removeItem('quote-current-step'); // Compatibilité anciennes versions
      console.log('✅ Cache du devis nettoyé');
    } catch (error) {
      console.error('❌ Erreur suppression cache:', error);
    }
  };

  const handleCancelQuote = () => {
    clearSavedData();
    setCurrentStep(0);
    setFormData(defaultFormData);
    setShowCancelDialog(false);
  };

  const handleRestartQuote = () => {
    clearSavedData();
    setCurrentStep(0);
    setFormData(defaultFormData);
    setShowResumeDialog(false);
  };

  const totalSteps = 6;
  const progress = (currentStep + 1) / totalSteps * 100;

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
    setFormData(prev => ({
      ...prev,
      ...stepData
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
        return <QuoteSummary data={formData} onNavigate={route => {
          clearSavedData();
          onNavigate(route);
        }} onComplete={clearSavedData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dialog de reprise */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Devis en cours</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez un devis en cours. Souhaitez-vous le continuer ou recommencer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRestartQuote}>
              Recommencer
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowResumeDialog(false)}>
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler le devis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ce devis ? Toutes les données seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, continuer</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelQuote} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="bg-gradient-primary px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white" 
              onClick={() => currentStep === 0 ? onNavigate('welcome') : handlePrevious()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Devis en 3 minutes</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={() => setShowCancelDialog(true)}
                title="Annuler le devis"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <span className="text-sm">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 py-8">
        {renderStep()}
      </div>
    </div>
  );
};
