import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { saveQuote } from "@/services/quoteService";
import QuoteStep0 from "./quote-steps/QuoteStep0";
import QuoteStep1 from "./quote-steps/QuoteStep1";
import QuoteStep2 from "./quote-steps/QuoteStep2";
import QuoteStep3 from "./quote-steps/QuoteStep3";
import QuoteStep4 from "./quote-steps/QuoteStep4";
import QuoteSummary from "./quote-steps/QuoteSummary";

interface FormData {
  civilite: string;
  nom: string;
  nomSociete: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  serviceType: string;
  object: string;
  property: string;
  propertyOther: string;
  motif: string;
  motifOther: string;
  category: string;
  subcategory: string;
  vitrage: string;
  largeur: string;
  hauteur: string;
  quantite: string;
  assurance: string;
  differentAddress: boolean;
  interventionCodePostal: string;
  interventionVille: string;
  interventionAdresse: string;
  photoUrl: string;
  notes: string;
}

const initialFormData: FormData = {
  civilite: "",
  nom: "",
  nomSociete: "",
  email: "",
  telephone: "",
  adresse: "",
  codePostal: "",
  ville: "",
  serviceType: "",
  object: "",
  property: "",
  propertyOther: "",
  motif: "",
  motifOther: "",
  category: "",
  subcategory: "",
  vitrage: "",
  largeur: "",
  hauteur: "",
  quantite: "",
  assurance: "",
  differentAddress: false,
  interventionCodePostal: "",
  interventionVille: "",
  interventionAdresse: "",
  photoUrl: "",
  notes: "",
};

const OnlineQuote = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (url: string) => {
    setFormData((prevData) => ({
      ...prevData,
      photoUrl: url,
    }));
  };

  const steps = [
    "Informations",
    "Type de service",
    "Détails",
    "Adresse",
    "Récapitulatif",
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSubmit = async () => {
    if (currentStep < 4) return;
    
    setIsLoading(true);
    
    try {
      // Préparer les données client
      const clientData = {
        email: formData.email,
        civilite: formData.civilite,
        nom: formData.nom,
        nom_societe: formData.nomSociete,
        telephone: formData.telephone,
        adresse: formData.adresse,
        code_postal: formData.codePostal,
        ville: formData.ville
      };

      // Préparer les données du devis
      const devisData = {
        service_type: formData.serviceType,
        object: formData.object,
        property: formData.property,
        property_other: formData.propertyOther,
        motif: formData.motif,
        motif_other: formData.motifOther,
        category: formData.category,
        subcategory: formData.subcategory,
        vitrage: formData.vitrage,
        largeur_cm: formData.largeur ? parseFloat(formData.largeur) : undefined,
        hauteur_cm: formData.hauteur ? parseFloat(formData.hauteur) : undefined,
        quantite: parseInt(formData.quantite) || 1,
        assurance: formData.assurance,
        different_intervention_address: formData.differentAddress,
        intervention_code_postal: formData.differentAddress ? formData.interventionCodePostal : formData.codePostal,
        intervention_ville: formData.differentAddress ? formData.interventionVille : formData.ville,
        intervention_adresse: formData.differentAddress ? formData.interventionAdresse : formData.adresse,
        photo_url: formData.photoUrl,
        notes: formData.notes
      };

      console.log('Submitting quote with data:', { clientData, devisData });

      const result = await saveQuote(clientData, devisData);
      
      if (result.success) {
        toast({
          title: "Devis envoyé avec succès !",
          description: `Votre devis ${result.devis.quote_number} a été créé. Nous vous contacterons sous 24h.`,
        });
        
        // Réinitialiser le formulaire après succès
        setFormData(initialFormData);
        setCurrentStep(0);
      } else {
        console.error('Quote submission failed:', result.error);
        toast({
          title: "Erreur lors de l'envoi",
          description: result.message || "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="container max-w-4xl mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Demander un devis en ligne</CardTitle>
        <p className="text-sm text-muted-foreground">
          Remplissez le formulaire ci-dessous pour obtenir un devis personnalisé.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>

        {currentStep === 0 && (
          <QuoteStep0 formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 1 && (
          <QuoteStep1 formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 2 && (
          <QuoteStep2 formData={formData} handleChange={handleChange} handlePhotoUpload={handlePhotoUpload} />
        )}
        {currentStep === 3 && (
          <QuoteStep3 formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 4 && (
          <QuoteSummary formData={formData} />
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0 || isLoading}
          >
            Précédent
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading} loading={isLoading}>
              Envoyer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineQuote;
