import { QuotePDFTemplate } from '@/components/pdf/QuotePDFTemplate';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { resendApi } from '@/integrations/resend/resend';
import { supabase } from '@/integrations/supabase/client';
import { generateQuotePDF, generateQuotePDFBase64, QuotePDFData } from '@/lib/pdf-generator';
import { saveQuote, validateQuote } from '@/services/quotes';
import { PDFViewer } from '@react-pdf/renderer';
import { CheckCircle, Download, Eye, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface QuoteSummaryProps {
  data: any;
  onNavigate: (route: string) => void;
  onComplete?: () => void;
}
export const QuoteSummary = ({ data, onNavigate, onComplete }: QuoteSummaryProps) => {
  const { toast } = useToast();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devisSaved, setDevisSaved] = useState(false);
  const [savedQuoteNumber, setSavedQuoteNumber] = useState<string>('');
  const [savedDevisId, setSavedDevisId] = useState<string>('');
  const [devisValidated, setDevisValidated] = useState(false);
  const [motifDescription, setMotifDescription] = useState<string>('');
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfData, setPdfData] = useState<QuotePDFData | null>(null);
  const [validationToken, setValidationToken] = useState<string>('');
  const navigate = useNavigate();

  // Fetch motif description from database
  const fetchMotifDescription = async () => {
    if (!data.motif) return;

    try {
      const { data: result, error } = await supabase
        .from('motif_descriptions')
        .select('description')
        .eq('motif', data.motif)
        .single();

      if (result && !error) {
        setMotifDescription(result.description);
      } else {
        // Fallback to default description
        setMotifDescription("REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE");
      }
    } catch (error) {
      console.error('Error fetching motif description:', error);
      setMotifDescription("REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE");
    }
  };

  // Calculate price using centralized backend calculation
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [calculationLoading, setCalculationLoading] = useState(true);
  const calculatePrice = async () => {
    try {
      setCalculationLoading(true);
      console.log('Calling compute-quote function with data:', data);

      // Determine client type
      const clientType = data.civilite === 'madame' || data.civilite === 'monsieur' ? 'particulier' : 'professionnel';
      const { data: result, error } = await supabase.functions.invoke('compute-quote', {
        body: {
          vitrage: data.vitrage,
          largeur: data.largeur,
          hauteur: data.hauteur,
          quantite: parseInt(data.quantite) || 1,
          clientType,
          address: data.adresse,
          interventionAddress: data.differentInterventionAddress ? data.interventionAdresse : data.adresse,
          miseEnSecurite: data.miseEnSecurite || 'oui',
        },
      });
      if (error) {
        console.error('Error calling compute-quote:', error);
        throw new Error('Erreur lors du calcul du prix');
      }
      console.log('Price calculation result:', result);
      setPriceCalculation(result);
      return result;
    } catch (error) {
      console.error('Error calculating price:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du calcul du prix. Veuillez réessayer.',
        variant: 'destructive',
      });

      // Fallback to default values
      const fallbackResult = {
        subtotal: 0,
        tva: 0,
        tvaRate: 0.2,
        total: 0,
        details: {},
      };
      setPriceCalculation(fallbackResult);
      return fallbackResult;
    } finally {
      setCalculationLoading(false);
    }
  };
  // Initialize calculation on component mount
  useEffect(() => {
    calculatePrice();
    fetchMotifDescription();
  }, []);
  const generateQuoteHTML = () => {
    const displayQuoteNumber = savedQuoteNumber || 'DRAFT';
    const subtotal = priceCalculation?.subtotal ?? 0;
    const tva = priceCalculation?.tva ?? 0;
    const total = priceCalculation?.total ?? 0;
    const tvaRate = priceCalculation?.tvaRate ?? 0.2;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Devis ${displayQuoteNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 20px; }
          .client-info { margin-bottom: 20px; }
          .quote-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f5f5f5; }
          .totals { text-align: right; margin-top: 20px; }
          .total-line { margin-bottom: 5px; }
          .final-total { font-weight: bold; font-size: 1.2em; color: #3a9a84; }
          .logo { width: 80px; height: 80px; margin: 0 auto 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DEVIS</h1>
          <h2>SecuryGlass</h2>
          <p style="font-style: italic; color: #666;">Glass for your security</p>
        </div>
        
        <div class="quote-details">
          <p><strong>Numéro de devis:</strong> ${displayQuoteNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div class="client-info">
          <h3>Client</h3>
          <p><strong>${data.civilite} ${data.nom}</strong></p>
          ${data.raison_sociale || data.nomSociete ? `<p><strong>${data.raison_sociale || data.nomSociete}</strong></p>` : ''}
          <p>${data.mobile}</p>
          <p>${data.email}</p>
          ${data.adresse ? `<p>${data.adresse}</p>` : ''}
          ${data.codePostal && data.ville ? `<p>${data.codePostal} ${data.ville}</p>` : ''}
          
          ${
            data.differentInterventionAddress
              ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <h4>Adresse d'intervention</h4>
            ${data.interventionAdresse ? `<p>${data.interventionAdresse}</p>` : ''}
            ${data.interventionCodePostal && data.interventionVille ? `<p>${data.interventionCodePostal} ${data.interventionVille}</p>` : ''}
          </div>
          `
              : ''
          }
        </div>
        
        <div class="company-info">
          <h3>Entreprise</h3>
          <p><strong>Securyglass France</strong></p>
          <p>contact@securyglass.fr</p>
          <p>09 70 144 344</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Dimensions</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              (priceCalculation?.details?.deplacement?.total ?? 0) > 0
                ? `
            <tr>
              <td>Déplacement</td>
              <td>-</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.deplacement?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)}€</td>
            </tr>
            `
                : ''
            }
            <tr>
              <td>${data.object}</td>
              <td>${data.largeur} × ${data.hauteur} cm</td>
              <td>${data.quantite}</td>
              <td>Vitrage ${data.vitrage}</td>
              <td>${(priceCalculation?.details?.vitrage?.total ?? 0).toFixed(2)}€</td>
            </tr>
            <tr>
              <td>Livraison</td>
              <td>-</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.livraison?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)}€</td>
            </tr>
            <tr>
              <td>Main d'œuvre</td>
              <td>${priceCalculation?.details?.surface?.totale?.toFixed(2) ?? '0.00'} m²</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.main_oeuvre?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)}€</td>
            </tr>
            ${
              (priceCalculation?.details?.securite?.total ?? 0) > 0
                ? `
            <tr>
              <td>Mise en sécurité</td>
              <td>-</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.securite?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.securite?.total ?? 0).toFixed(2)}€</td>
            </tr>
            `
                : ''
            }
          </tbody>
        </table>
        
         <div class="totals">
           <div class="total-line">Sous-total HT: ${subtotal.toFixed(2)}€</div>
           <div class="total-line">TVA (${Math.round(tvaRate * 100)}%): ${tva.toFixed(2)}€</div>
           <div class="total-line final-total">Total TTC: ${total.toFixed(2)}€</div>
         </div>
        
        <div style="margin-top: 40px; font-size: 0.9em; color: #666;">
          <p>* Prix indicatif, devis définitif après visite technique</p>
          <p>Ce devis est valable 30 jours à compter de la date d'émission.</p>
          <p>Merci de votre confiance.</p>
        </div>
      </body>
      </html>
    `;
  };
  // Helper function to load logos from public folder as base64
  const loadLogo = async (logoName: 'securyglass' | 'certification'): Promise<string> => {
    const fileName = logoName === 'securyglass' ? '/securyglass-logo.png' : '/certification-qualite.jpg';
    try {
      const res = await fetch(fileName);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`❌ [Logo] Failed to load ${logoName}:`, error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('🔵 [PDF Download] Starting PDF generation...');

      // Load images using edge function with fallback
      console.log('🔵 [PDF Download] Loading images...');
      const [logoSecuryglass, logoCertification] = await Promise.all([
        loadLogo('securyglass'),
        loadLogo('certification'),
      ]);

      console.log('✅ [PDF Download] Images loaded:', {
        logoSize: logoSecuryglass.length,
        certSize: logoCertification.length,
      });

      const displayQuoteNumber = savedQuoteNumber || 'DRAFT';
      const pdfDataToDownload: QuotePDFData = {
        quoteNumber: displayQuoteNumber,
        date: new Date().toLocaleDateString('fr-FR'),
        civilite: data.civilite,
        nom: data.nom,
        raison_sociale: data.raison_sociale,
        nomSociete: data.nomSociete,
        telephone: data.mobile,
        email: data.email,
        adresse: data.adresse,
        codePostal: data.codePostal,
        ville: data.ville,
        differentInterventionAddress: data.differentInterventionAddress,
        interventionAdresse: data.interventionAdresse,
        interventionCodePostal: data.interventionCodePostal,
        interventionVille: data.interventionVille,
        object: data.object,
        largeur: data.largeur,
        hauteur: data.hauteur,
        quantite: data.quantite,
        vitrage: data.vitrage,
        vitrageDetails: {
          type: 'Vitrage Feuilleté Sécurit CLR Transparent',
          epaisseur: 'EP10 55.2 mm',
          normes: 'Normes ERP - Normes EN 12600 / EN 356',
        },
        delai: '48H',
        motifDescription: motifDescription,
        priceCalculation: priceCalculation || {
          subtotal: 0,
          tva: 0,
          total: 0,
          tvaRate: 0.2,
          details: {},
        },
        companyInfo: {
          siret: '91094284600015',
          tva: 'FR2091094282846',
          codeAPE: '6201Z',
          capital: '10000',
          rcs: 'Nanterre',
          address: '65 Rue De La Croix - 92000 Nanterre',
          iban: 'FR76 1020 7000 0123 2145 6187 131',
          bic: 'CCBPFRPMTG',
        },
        logoSecuryglass,
        logoCertification,
      };

      const filename = `devis-${displayQuoteNumber}.pdf`;
      console.log('🔵 [PDF Download] Calling generateQuotePDF with filename:', filename);
      await generateQuotePDF(pdfDataToDownload, filename);

      console.log('✅ [PDF Download] PDF generated successfully');
      toast({
        title: 'PDF téléchargé',
        description: 'Le PDF a été téléchargé avec succès',
      });
    } catch (error) {
      console.error('❌ [PDF Download] Error generating PDF:', error);
      console.error('❌ [PDF Download] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        title: 'Erreur PDF',
        description: error instanceof Error ? error.message : 'Erreur lors de la génération du PDF',
        variant: 'destructive',
      });
    }
  };

  // Prepare PDF data when email is sent
  useEffect(() => {
    if (emailSent && priceCalculation && !pdfData) {
      const preparePdfData = async () => {
        try {
          console.log('🔵 [PDF Preview] Loading images for preview...');
          const [logoSecuryglass, logoCertification] = await Promise.all([
            loadLogo('securyglass'),
            loadLogo('certification'),
          ]);

          const displayQuoteNumber = savedQuoteNumber || 'DRAFT';
          const preparedData: QuotePDFData = {
            quoteNumber: displayQuoteNumber,
            date: new Date().toLocaleDateString('fr-FR'),
            civilite: data.civilite,
            nom: data.nom,
            raison_sociale: data.raison_sociale,
            nomSociete: data.nomSociete,
            telephone: data.mobile,
            email: data.email,
            adresse: data.adresse,
            codePostal: data.codePostal,
            ville: data.ville,
            differentInterventionAddress: data.differentInterventionAddress,
            interventionAdresse: data.interventionAdresse,
            interventionCodePostal: data.interventionCodePostal,
            interventionVille: data.interventionVille,
            object: data.object,
            largeur: data.largeur,
            hauteur: data.hauteur,
            quantite: data.quantite,
            vitrage: data.vitrage,
            vitrageDetails: {
              type: 'Vitrage Feuilleté Sécurit CLR Transparent',
              epaisseur: 'EP10 55.2 mm',
              normes: 'Normes ERP - Normes EN 12600 / EN 356',
            },
            delai: '48H',
            motifDescription: motifDescription,
            priceCalculation: priceCalculation,
            companyInfo: {
              siret: '91094284600015',
              tva: 'FR2091094282846',
              codeAPE: '6201Z',
              capital: '10000',
              rcs: 'Nanterre',
              address: '65 Rue De La Croix - 92000 Nanterre',
              iban: 'FR76 1020 7000 0123 2145 6187 131',
              bic: 'CCBPFRPMTG',
            },
            logoSecuryglass,
            logoCertification,
          };

          setPdfData(preparedData);
          console.log('✅ [PDF Preview] PDF data prepared for preview');
        } catch (error) {
          console.error('❌ [PDF Preview] Error preparing PDF data:', error);
        }
      };

      preparePdfData();
    }
  }, [emailSent, priceCalculation, pdfData, data, savedQuoteNumber, motifDescription]);

  useEffect(() => {
    // Check if there's already a saved devis for this session
    const sessionKey = `devis_session_${data.email}_${JSON.stringify(data).substring(0, 50)}`;
    const savedDevisInfo = localStorage.getItem(sessionKey);
    if (savedDevisInfo) {
      const { devisId, quoteNumber: savedQN } = JSON.parse(savedDevisInfo);
      setDevisSaved(true);
      setSavedQuoteNumber(savedQN);
      setSavedDevisId(devisId);
      console.log('Found existing devis:', {
        devisId,
        quoteNumber: savedQN,
      });
      return;
    }

    // Auto-save devis when price calculation completes
  }, []);

  // Trigger save when price calculation is complete
  useEffect(() => {
    if (priceCalculation && !devisSaved && !calculationLoading) {
      saveDevisToDatabase();
    }
  }, [priceCalculation, devisSaved, calculationLoading]);
  const validateDevisInDatabase = async (devisId: string) => {
    if (devisValidated) {
      console.log('🟡 [Validation] Devis already validated, skipping');
      return;
    }

    try {
      console.log('🔵 [Validation] Validating devis:', devisId);
      const { success, error } = await validateQuote(devisId);

      if (!success) {
        throw new Error(error || 'Erreur lors de la validation');
      }

      console.log('✅ [Validation] Devis validated successfully');
      setDevisValidated(true);

      toast({
        title: 'Devis validé',
        description: 'Votre devis a été validé avec succès',
      });
    } catch (error) {
      console.error('❌ [Validation] Error:', error);
      toast({
        title: 'Erreur de validation',
        description: error instanceof Error ? error.message : 'Erreur lors de la validation',
        variant: 'destructive',
      });
    }
  };

  const saveDevisToDatabase = async () => {
    if (devisSaved || !priceCalculation) return;
    try {
      console.log('Saving quote to database...');
      const result = await saveQuote(data, priceCalculation);
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde du devis');
      }
      if (!result.quoteId || !result.quoteNumber) {
        throw new Error('ID ou numéro de devis manquant après sauvegarde');
      }
      console.log('Quote saved with ID:', result.quoteId, 'Quote number:', result.quoteNumber);
      setDevisSaved(true);
      setSavedQuoteNumber(result.quoteNumber);
      setSavedDevisId(result.quoteId);

      // Store the validation token from the insert
      if (result.validationToken) {
        setValidationToken(result.validationToken);
      }

      // Save to localStorage to prevent duplicate submissions
      const sessionKey = `devis_session_${data.email}_${JSON.stringify(data).substring(0, 50)}`;
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          devisId: result.quoteId,
          quoteNumber: result.quoteNumber,
        }),
      );
      toast({
        title: 'Devis enregistré',
        description: 'Devis enregistré avec succès!',
      });
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde du devis',
        variant: 'destructive',
      });
    }
  };
  const sendQuoteEmailViaSendGrid = async () => {
    if (isLoading || emailSent || !devisSaved || !savedQuoteNumber || !priceCalculation || calculationLoading) {
      console.log('🔴 [Email] Envoi bloqué:', {
        isLoading,
        emailSent,
        devisSaved,
        savedQuoteNumber: !!savedQuoteNumber,
        priceCalculation: !!priceCalculation,
        calculationLoading,
      });
      return;
    }
    setIsLoading(true);
    console.log('🔵 [Email] Starting email send process to:', data.email);
    try {
      const displayQuoteNumber = savedQuoteNumber || 'DRAFT';
      console.log('🔵 [Email] Generating PDF with @react-pdf/renderer for quote:', displayQuoteNumber);

      // Load images using edge function with fallback
      console.log('🔵 [Email] Loading images...');
      const [logoSecuryglass, logoCertification] = await Promise.all([
        loadLogo('securyglass'),
        loadLogo('certification'),
      ]);

      console.log('✅ [Email] Images loaded:', {
        logoSize: logoSecuryglass.length,
        certSize: logoCertification.length,
      });

      // Prepare PDF data
      const pdfData: QuotePDFData = {
        quoteNumber: displayQuoteNumber,
        date: new Date().toLocaleDateString('fr-FR'),
        civilite: data.civilite,
        nom: data.nom,
        raison_sociale: data.raison_sociale,
        nomSociete: data.nomSociete,
        telephone: data.mobile,
        email: data.email,
        adresse: data.adresse,
        codePostal: data.codePostal,
        ville: data.ville,
        differentInterventionAddress: data.differentInterventionAddress,
        interventionAdresse: data.interventionAdresse,
        interventionCodePostal: data.interventionCodePostal,
        interventionVille: data.interventionVille,
        object: data.object,
        largeur: data.largeur,
        hauteur: data.hauteur,
        quantite: data.quantite,
        vitrage: data.vitrage,
        vitrageDetails: {
          type: 'Vitrage Feuilleté Sécurit CLR Transparent',
          epaisseur: 'EP10 55.2 mm',
          normes: 'Normes ERP - Normes EN 12600 / EN 356',
        },
        delai: '48H',
        motifDescription: motifDescription,
        priceCalculation: priceCalculation || {
          subtotal: 0,
          tva: 0,
          total: 0,
          tvaRate: 0.2,
          details: {},
        },
        companyInfo: {
          siret: '91094284600015',
          tva: 'FR2091094282846',
          codeAPE: '6201Z',
          capital: '10000',
          rcs: 'Nanterre',
          address: '65 Rue De La Croix - 92000 Nanterre',
          iban: 'FR76 1020 7000 0123 2145 6187 131',
          bic: 'CCBPFRPMTG',
        },
        logoSecuryglass,
        logoCertification,
      };

      // Generate PDF as base64 for attachment
      console.log('🔵 [Email] Calling generateQuotePDFBase64...');
      const pdfBase64 = await generateQuotePDFBase64(pdfData);
      console.log('✅ [Email] PDF generated with vector rendering, size:', pdfBase64.length, 'characters');

      if (!pdfBase64 || pdfBase64.length < 100) {
        throw new Error('PDF generation failed - base64 string too short');
      }
      const quoteData = {
        id: displayQuoteNumber,
        date: new Date().toLocaleDateString('fr-FR'),
        client: {
          name: `${data.civilite} ${data.nom}`,
          email: data.email,
          phone: data.mobile,
          address: data.adresse || '',
        },
        company: {
          name: 'Securyglass France',
          email: 'contact@securyglass.fr',
          phone: '09 70 144 344',
          address: 'France',
        },
        items: [
          ...(priceCalculation?.details?.deplacement?.total > 0
            ? [
                {
                  designation: 'Frais de déplacement',
                  quantity: 1,
                  unitPrice: parseFloat((priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)),
                  total: parseFloat((priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)),
                },
              ]
            : []),
          {
            designation: `${data.vitrage || 'Double vitrage'} (${data.largeur}x${data.hauteur} cm)`,
            quantity: parseInt(data.quantite || 1),
            unitPrice: parseFloat(
              ((priceCalculation?.details?.vitrage?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2),
            ),
            total: parseFloat((priceCalculation?.details?.vitrage?.total ?? 0).toFixed(2)),
          },
          {
            designation: 'Frais de livraison',
            quantity: 1,
            unitPrice: parseFloat((priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)),
            total: parseFloat((priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)),
          },
          {
            designation: "Main d'œuvre",
            quantity: 1,
            unitPrice: parseFloat((priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)),
            total: parseFloat((priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)),
          },
          ...(priceCalculation?.details?.securite?.total > 0
            ? [
                {
                  designation: 'Mise en sécurité',
                  quantity: 1,
                  unitPrice: parseFloat((priceCalculation?.details?.securite?.total ?? 0).toFixed(2)),
                  total: parseFloat((priceCalculation?.details?.securite?.total ?? 0).toFixed(2)),
                },
              ]
            : []),
          {
            designation: 'SAVE PLANET : Éco-enlèvement - Tri-sélectif - Recyclage',
            quantity: 1,
            unitPrice: 0,
            total: 0,
          },
        ],
        subtotal: parseFloat((priceCalculation?.subtotal ?? 0).toFixed(2)),
        vat: parseFloat((priceCalculation?.tva ?? 0).toFixed(2)),
        total: parseFloat((priceCalculation?.total ?? 0).toFixed(2)),
      };
      console.log('🔵 [Email] Preparing quote data for email...');
      const emailPayload = {
        quoteId: savedDevisId,
        validationToken: validationToken || undefined,
        email: data.email,
        clientName: `${data.civilite} ${data.nom}`,
        message: `Merci pour votre demande de devis. Veuillez trouver ci-joint votre devis pour ${data.object}.`,
        ccInternal: true,
        attachment: {
          filename: `Devis-${displayQuoteNumber}.pdf`,
          contentBase64: pdfBase64,
          type: 'application/pdf',
        },
        quoteData,
      };

      console.log('🔵 [Email] Calling resend-api edge function...');
      const result = await resendApi.sendQuote(emailPayload);

      console.log('🔵 [Email] Resend API result:', {
        success: result?.success,
      });

      if (!result || !result.success) {
        throw new Error(result?.error || "Échec de l'envoi de l'email");
      }

      console.log('✅ [Email] Email sent successfully to:', data.email);
      setEmailSent(true);

      // Marquer le devis comme complété dans le cache
      try {
        const cache = localStorage.getItem('quote-cache');
        if (cache) {
          const cacheData = JSON.parse(cache);
          cacheData.completed = true;
          localStorage.setItem('quote-cache', JSON.stringify(cacheData));
          console.log('✅ Devis marqué comme complété dans le cache');
        }
      } catch (error) {
        console.error('❌ Erreur marquage complétion:', error);
      }

      toast({
        title: 'Email envoyé',
        description: `Le devis a été envoyé avec succès à ${data.email}`,
      });

      // Validate the devis after successful email send
      if (savedDevisId && !devisValidated) {
        await validateDevisInDatabase(savedDevisId);
      }
    } catch (error) {
      console.error('❌ [Email] Error in sendQuoteEmailViaSendGrid:', error);
      console.error('❌ [Email] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        title: "Erreur d'envoi",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur s'est produite lors de l'envoi du devis. Veuillez télécharger le PDF et l'envoyer manuellement.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send email when component loads and devis is saved
  useEffect(() => {
    if (
      data.email &&
      !emailSent &&
      !isLoading &&
      devisSaved &&
      savedQuoteNumber &&
      priceCalculation &&
      !calculationLoading
    ) {
      console.log('🟢 [Auto-send] Triggering automatic email send');
      sendQuoteEmailViaSendGrid();
    } else {
      console.log('🟡 [Auto-send] Conditions not met:', {
        hasEmail: !!data.email,
        emailSent,
        isLoading,
        devisSaved,
        hasSavedQuoteNumber: !!savedQuoteNumber,
        hasPriceCalculation: !!priceCalculation,
        calculationLoading,
      });
    }
  }, [data.email, emailSent, isLoading, devisSaved, savedQuoteNumber, priceCalculation, calculationLoading]);

  // Safety timeout: if email not sent after 10 seconds, show fallback option
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!emailSent && !isLoading && devisSaved && savedQuoteNumber && priceCalculation && !calculationLoading) {
        console.warn('⚠️ [Auto-send] Email not sent after 10 seconds despite all conditions being met');
        toast({
          title: 'Devis prêt',
          description: 'Vous pouvez télécharger le PDF ci-dessous.',
        });
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [emailSent, isLoading, devisSaved, savedQuoteNumber, priceCalculation, calculationLoading]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`p-6 rounded-xl border-2 ${emailSent ? 'border-emerald-200 bg-emerald-50' : 'border-primary/20 bg-primary/5'}`}
      >
        <div className="text-center">
          {emailSent && <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />}
          <h2 className={`text-2xl font-bold mb-2 ${emailSent ? 'text-emerald-600' : 'text-primary'}`}>
            {isLoading ? (
              'Envoi en cours...'
            ) : emailSent ? (
              'Devis envoyé !'
            ) : (
              <span>
                Devis en cours<span className="animate-dots">...</span>
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {emailSent ? `à : ${data.email}` : isLoading ? 'Veuillez patienter...' : ''}
          </p>
          {emailSent && (
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Vérifiez votre e-mail</strong> — Vérifiez également dans les spams et indésirables
            </p>
          )}
        </div>
      </div>

      {/* Quote Details */}
      <div className="border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Estimation</h3>

        <div className="space-y-3">
          {data.assurance === 'oui' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assurance</span>
              <span className="font-medium text-primary">Prise en charge possible</span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Loading or error state */}
        {calculationLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Calcul en cours...</p>
          </div>
        ) : !priceCalculation ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Erreur lors du calcul</p>
          </div>
        ) : (
          <>
            {/* Détail des coûts */}
            <div className="space-y-2 text-sm">
              {priceCalculation.details.deplacement?.total > 0 && (
                <div className="flex justify-between">
                  <span>Déplacement</span>
                  <span>{priceCalculation.details.deplacement.total.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>
                  Vitrage ({data.largeur} × {data.hauteur} cm - Qté: {data.quantite})
                </span>
                <span>{(priceCalculation.details.vitrage?.total || 0).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{(priceCalculation.details.livraison?.total || 0).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Main d'œuvre</span>
                <span>{(priceCalculation.details.main_oeuvre?.total || 0).toFixed(2)}€</span>
              </div>
              {priceCalculation.details.securite?.total > 0 && (
                <div className="flex justify-between">
                  <span>Mise en sécurité</span>
                  <span>{priceCalculation.details.securite.total.toFixed(2)}€</span>
                </div>
              )}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Sous-total HT</span>
                <span>{priceCalculation.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({Math.round(priceCalculation.tvaRate * 100)}%)</span>
                <span>{priceCalculation.tva.toFixed(2)}€</span>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total TTC</span>
              <span className="text-lg font-bold text-primary">{priceCalculation.total.toFixed(2)}€</span>
            </div>
          </>
        )}
      </div>

      {/* Manual Send Button if not auto-sent */}
      {!emailSent && !isLoading && (
        <Button variant="default" size="lg" className="w-full" onClick={sendQuoteEmailViaSendGrid}>
          <Mail className="h-5 w-5 mr-2" />
          Envoyer le devis par email
        </Button>
      )}

      {/* Action Buttons */}
      {emailSent && (
        <div className="space-y-4">
          {validationToken && (
            <Button
              variant="default"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              onClick={() => navigate(`/devis/valider?token=${validationToken}`)}
            >
              <CheckCircle className="h-5 w-5 mr-2" />✓ Valider le devis
            </Button>
          )}
          <Button
            variant="default"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowPDFPreview(true)}
          >
            <Eye className="h-5 w-5 mr-2" />
            Voir le devis
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={handleDownloadPDF}>
            <Download className="h-5 w-5 mr-2" />
            Télécharger le PDF
          </Button>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => onNavigate('modify-quote')}>
          Modifier
        </Button>
        <Button variant="outline" onClick={() => onNavigate('new-quote')}>
          Nouveau Devis
        </Button>
      </div>

      {/* PDF Preview Dialog */}
      {pdfData && (
        <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
              <DialogTitle>Aperçu du devis</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden px-6 pb-6 pt-2">
              <PDFViewer width="100%" height="100%" className="border-0">
                <QuotePDFTemplate data={pdfData} />
              </PDFViewer>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
