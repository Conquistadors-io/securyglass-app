import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Calendar, CreditCard, FileText, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { saveDevis } from "@/services/devis";
import { generatePDFFromHTML, generatePDFFromHTMLBase64 } from "@/lib/pdf-generator";
interface QuoteSummaryProps {
  data: any;
  onNavigate: (route: string) => void;
  onComplete?: () => void;
}
export const QuoteSummary = ({
  data,
  onNavigate,
  onComplete
}: QuoteSummaryProps) => {
  const { toast } = useToast();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gmailConfigured, setGmailConfigured] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [devisSaved, setDevisSaved] = useState(false);
  const [savedQuoteNumber, setSavedQuoteNumber] = useState<string>('');
  // Calculate price using centralized backend calculation
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [calculationLoading, setCalculationLoading] = useState(true);

  const calculatePrice = async () => {
    try {
      setCalculationLoading(true);
      console.log('Calling compute-quote function with data:', data);
      
      // Determine client type
      const clientType = (data.civilite === 'madame' || data.civilite === 'monsieur') ? 'particulier' : 'professionnel';
      
      const { data: result, error } = await supabase.functions.invoke('compute-quote', {
        body: {
          vitrage: data.vitrage,
          largeur: data.largeur,
          hauteur: data.hauteur,
          quantite: parseInt(data.quantite) || 1,
          clientType,
          address: data.adresse,
          interventionAddress: data.differentInterventionAddress ? data.interventionAdresse : data.adresse,
          miseEnSecurite: data.miseEnSecurite || 'oui'
        }
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
        title: "Erreur",
        description: "Erreur lors du calcul du prix. Veuillez réessayer.",
        variant: "destructive",
      });
      
      // Fallback to default values
      const fallbackResult = {
        subtotal: 0,
        tva: 0,
        tvaRate: 0.2,
        total: 0,
        details: {}
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
  }, []);
  const quoteNumber = `DEV-${Date.now().toString().slice(-8)}`;

  const generateQuoteHTML = () => {
    const displayQuoteNumber = savedQuoteNumber || quoteNumber;
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
          .final-total { font-weight: bold; font-size: 1.2em; color: #2563eb; }
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
          ${(data.raison_sociale || data.nomSociete) ? `<p><strong>${data.raison_sociale || data.nomSociete}</strong></p>` : ''}
          <p>${data.telephone}</p>
          <p>${data.email}</p>
          ${data.adresse ? `<p>${data.adresse}</p>` : ''}
          ${data.codePostal && data.ville ? `<p>${data.codePostal} ${data.ville}</p>` : ''}
          
          ${data.differentInterventionAddress ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <h4>Adresse d'intervention</h4>
            ${data.interventionAdresse ? `<p>${data.interventionAdresse}</p>` : ''}
            ${data.interventionCodePostal && data.interventionVille ? `<p>${data.interventionCodePostal} ${data.interventionVille}</p>` : ''}
          </div>
          ` : ''}
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
            <tr>
              <td>${data.object}</td>
              <td>${data.largeur} × ${data.hauteur} cm</td>
              <td>${data.quantite}</td>
              <td>Vitrage ${data.vitrage}</td>
              <td>${(priceCalculation?.details?.vitrage?.total ?? 0).toFixed(2)}€</td>
            </tr>
            <tr>
              <td>Main d'œuvre</td>
              <td>${priceCalculation?.details?.surface?.totale?.toFixed(2) ?? '0.00'} m²</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.main_oeuvre?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)}€</td>
            </tr>
            <tr>
              <td>Livraison</td>
              <td>-</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.livraison?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)}€</td>
            </tr>
            ${(priceCalculation?.details?.deplacement?.total ?? 0) > 0 ? `
            <tr>
              <td>Déplacement</td>
              <td>-</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.deplacement?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)}€</td>
            </tr>
            ` : ''}
            ${(priceCalculation?.details?.securite?.total ?? 0) > 0 ? `
            <tr>
              <td>Mise en sécurité</td>
              <td>-</td>
              <td>1</td>
              <td>${((priceCalculation?.details?.securite?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${(priceCalculation?.details?.securite?.total ?? 0).toFixed(2)}€</td>
            </tr>
            ` : ''}
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

  const handleDownloadPDF = async () => {
    try {
      const quoteHTML = generateQuoteHTML();
      const filename = `devis-${savedQuoteNumber || quoteNumber}.pdf`;
      await generatePDFFromHTML(quoteHTML, filename);
      toast({
        title: "PDF téléchargé",
        description: "Le PDF a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du PDF",
        variant: "destructive",
      });
    }
  };

  // Check if Gmail is configured by admin
  const checkGmailConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('gmail_credentials')
        .select('user_email, expires_at')
        .gte('expires_at', new Date().toISOString())
        .single();

      if (data && !error) {
        setGmailConfigured(true);
        setAdminEmail(data.user_email);
      } else {
        setGmailConfigured(false);
        setAdminEmail('');
      }
    } catch (error) {
      console.log('No Gmail configuration found');
      setGmailConfigured(false);
      setAdminEmail('');
    }
  };

  useEffect(() => {
    checkGmailConfiguration();
    
    // Check if there's already a saved devis for this session
    const sessionKey = `devis_session_${data.email}_${JSON.stringify(data).substring(0, 50)}`;
    const savedDevisInfo = localStorage.getItem(sessionKey);
    if (savedDevisInfo) {
      const { devisId, quoteNumber } = JSON.parse(savedDevisInfo);
      setDevisSaved(true);
      setSavedQuoteNumber(quoteNumber);
      console.log('Found existing devis:', { devisId, quoteNumber });
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

  const saveDevisToDatabase = async () => {
    if (devisSaved || !priceCalculation) return;

    try {
      console.log('Saving devis to database...');
      const result = await saveDevis(data, priceCalculation);
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde du devis');
      }

      if (!result.devisId || !result.quoteNumber) {
        throw new Error('ID ou numéro de devis manquant après sauvegarde');
      }

      console.log('Devis saved with ID:', result.devisId, 'Quote number:', result.quoteNumber);
      setDevisSaved(true);
      setSavedQuoteNumber(result.quoteNumber);
      
      // Save to localStorage to prevent duplicate submissions
      const sessionKey = `devis_session_${data.email}_${JSON.stringify(data).substring(0, 50)}`;
      localStorage.setItem(sessionKey, JSON.stringify({
        devisId: result.devisId,
        quoteNumber: result.quoteNumber
      }));

      if (gmailConfigured) {
        toast({
          title: "Devis enregistré",
          description: "Devis enregistré avec succès!",
        });
      } else {
        toast({
          title: "Devis enregistré",
          description: "Devis enregistré avec succès! L'envoi par email n'est pas configuré.",
        });
      }
    } catch (error) {
      console.error('Error saving devis:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde du devis',
        variant: "destructive",
      });
    }
  };

  const sendQuoteEmailViaSendGrid = async () => {
    if (isLoading || emailSent || !devisSaved || !savedQuoteNumber || !priceCalculation || calculationLoading) {
      console.log('Envoi bloqué:', { isLoading, emailSent, devisSaved, savedQuoteNumber: !!savedQuoteNumber, priceCalculation: !!priceCalculation, calculationLoading });
      return;
    }
    
    setIsLoading(true);
    console.log("Sending quote email via SendGrid to:", data.email);

    try {
      const displayQuoteNumber = savedQuoteNumber || quoteNumber;
      console.log("Generating quote HTML...");
      const quoteHTML = generateQuoteHTML();
      console.log("Quote HTML generated, length:", quoteHTML.length);
      
      console.log("Generating PDF from HTML...");
      // Generate PDF as base64 for attachment
      const pdfBase64 = await generatePDFFromHTMLBase64(quoteHTML);
      console.log('PDF generated, size:', pdfBase64.length, 'characters');
      
      // Warning for small PDF size (don't block anymore)
      if (pdfBase64.length < 1000) {
        console.warn('PDF appears small:', pdfBase64.length, 'characters');
        toast({
          title: "Avertissement PDF",
          description: `Le PDF généré est petit (${pdfBase64.length} caractères). Envoi en cours...`,
        });
      }
      
      const quoteData = {
        id: displayQuoteNumber,
        date: new Date().toLocaleDateString('fr-FR'),
        client: {
          name: `${data.civilite} ${data.nom}`,
          email: data.email,
          phone: data.telephone,
          address: data.adresse || ""
        },
        company: {
          name: "Securyglass France",
          email: "contact@securyglass.fr",
          phone: "09 70 144 344",
          address: "France"
        },
         items: [
           ...(priceCalculation?.details?.deplacement?.total > 0 ? [{
             designation: "Frais de déplacement",
             quantity: 1,
             unitPrice: parseFloat((priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)),
             total: parseFloat((priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2))
           }] : []),
           ...(priceCalculation?.details?.securite?.total > 0 ? [{
             designation: "Mise en sécurité",
             quantity: 1,
             unitPrice: parseFloat((priceCalculation?.details?.securite?.total ?? 0).toFixed(2)),
             total: parseFloat((priceCalculation?.details?.securite?.total ?? 0).toFixed(2))
           }] : []),
           {
             designation: `${data.vitrage || 'Double vitrage'} (${data.largeur}x${data.hauteur} cm)`,
             quantity: parseInt(data.quantite || 1),
             unitPrice: parseFloat(((priceCalculation?.details?.vitrage?.total ?? 0) / parseInt(data.quantite || 1)).toFixed(2)),
             total: parseFloat((priceCalculation?.details?.vitrage?.total ?? 0).toFixed(2))
           },
           {
             designation: "Frais de livraison",
             quantity: 1,
             unitPrice: parseFloat((priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)),
             total: parseFloat((priceCalculation?.details?.livraison?.total ?? 0).toFixed(2))
           },
           {
             designation: "Main d'œuvre",
             quantity: 1,
             unitPrice: parseFloat((priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)),
             total: parseFloat((priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2))
           },
           {
             designation: "SAVE PLANET : Éco-enlèvement - Tri-sélectif - Recyclage",
             quantity: 1,
             unitPrice: 0,
             total: 0
           }
         ],
         subtotal: parseFloat((priceCalculation?.subtotal ?? 0).toFixed(2)),
         vat: parseFloat((priceCalculation?.tva ?? 0).toFixed(2)),
         total: parseFloat((priceCalculation?.total ?? 0).toFixed(2))
      };

      console.log("Preparing quote data for email...");
      const { data: result, error } = await supabase.functions.invoke('send-quote-sendgrid', {
        body: {
          email: data.email,
          clientName: `${data.civilite} ${data.nom}`,
          message: `Merci pour votre demande de devis. Veuillez trouver ci-joint votre devis pour ${data.object}.`,
          ccInternal: true,
          attachment: {
            filename: `Devis-${displayQuoteNumber}.pdf`,
            contentBase64: pdfBase64,
            type: "application/pdf"
          },
          quoteData
        }
      });

      console.log("SendGrid function result:", { result, error });

      if (error) {
        console.error("Erreur lors de l'envoi du devis:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le devis par email. Veuillez réessayer.",
          variant: "destructive",
        });
      } else {
        console.log("Devis envoyé avec succès via SendGrid:", result);
        setEmailSent(true);
        toast({
          title: "Devis envoyé",
          description: `Le devis a été envoyé avec succès à ${data.email}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du devis:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du devis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send email when component loads and devis is saved
  useEffect(() => {
    if (data.email && !emailSent && !isLoading && devisSaved && savedQuoteNumber && priceCalculation && !calculationLoading) {
      sendQuoteEmailViaSendGrid();
    }
  }, [data.email, devisSaved, savedQuoteNumber, priceCalculation, calculationLoading]);

  return <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 shadow-card border-0 bg-gradient-card">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isLoading ? "Envoi en cours..." : emailSent ? "Devis envoyé !" : "Préparation du devis..."}
          </h2>
          <p className="text-muted-foreground">
            {emailSent ? `à : ${data.email}` : isLoading ? "Veuillez patienter..." : ""}
          </p>
        </div>
      </Card>

      {/* Quote Details */}
      <Card className="shadow-card border-0">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Récapitulatif</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type d'intervention:</span>
              <span className="font-medium">{data.object}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vitrage:</span>
              <span className="font-medium">{data.vitrage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="font-medium">{data.largeur} × {data.hauteur} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantité:</span>
              <span className="font-medium">{data.quantite}</span>
            </div>
            {data.assurance === "oui" && <div className="flex justify-between">
                <span className="text-muted-foreground">Assurance:</span>
                <span className="font-medium text-primary">Prise en charge possible</span>
              </div>}
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
                 <div className="flex justify-between">
                   <span>Vitrage ({priceCalculation.details.surface?.totale?.toFixed(2) || '0.00'} m²):</span>
                   <span>{(priceCalculation.details.vitrage?.total || 0).toFixed(2)}€</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Main d'œuvre:</span>
                   <span>{(priceCalculation.details.main_oeuvre?.total || 0).toFixed(2)}€</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Livraison:</span>
                   <span>{(priceCalculation.details.livraison?.total || 0).toFixed(2)}€</span>
                 </div>
                 {priceCalculation.details.deplacement?.total > 0 && (
                   <div className="flex justify-between">
                     <span>Déplacement:</span>
                     <span>{priceCalculation.details.deplacement.total.toFixed(2)}€</span>
                   </div>
                 )}
                 {priceCalculation.details.securite?.total > 0 && (
                   <div className="flex justify-between">
                     <span>Mise en sécurité:</span>
                     <span>{priceCalculation.details.securite.total.toFixed(2)}€</span>
                   </div>
                 )}
               </div>

               <Separator className="my-3" />

               <div className="space-y-1">
                 <div className="flex justify-between">
                   <span>Sous-total HT:</span>
                   <span>{priceCalculation.subtotal.toFixed(2)}€</span>
                 </div>
                 <div className="flex justify-between">
                   <span>TVA ({Math.round(priceCalculation.tvaRate * 100)}%):</span>
                   <span>{priceCalculation.tva.toFixed(2)}€</span>
                 </div>
               </div>

               <Separator className="my-3" />

               <div className="flex justify-between items-center">
                 <span className="text-lg font-semibold">Total TTC:</span>
                 <span className="text-2xl font-bold text-primary">
                   {priceCalculation.total.toFixed(2)}€
                 </span>
               </div>
            </>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            * Prix indicatif, devis définitif après visite technique
          </p>
        </div>
      </Card>

      {/* Contact Info */}
      <Card className="shadow-card border-0">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vos coordonnées</h3>
          
          <div className="space-y-2 text-sm">
            <p><strong>{data.civilite} {data.nom}</strong></p>
            {(data.raison_sociale || data.nomSociete) && <p><strong>{data.raison_sociale || data.nomSociete}</strong></p>}
            <p>{data.telephone}</p>
            <p>{data.email}</p>
            {data.adresse && <p>{data.adresse}</p>}
            {data.codePostal && data.ville && <p>{data.codePostal} {data.ville}</p>}
            
            {/* Adresse d'intervention si différente */}
            {data.differentInterventionAddress && (
              <div className="mt-3 pt-3 border-t border-muted">
                <p className="text-xs font-medium text-muted-foreground mb-1">ADRESSE D'INTERVENTION</p>
                {data.interventionAdresse && <p>{data.interventionAdresse}</p>}
                {data.interventionCodePostal && data.interventionVille && (
                  <p>{data.interventionCodePostal} {data.interventionVille}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Gmail Status Info */}
      {!gmailConfigured && devisSaved && (
        <Card className="shadow-card border-0">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Devis enregistré avec succès
                </p>
                <p className="text-xs text-muted-foreground">
                  Vous pouvez télécharger le devis en PDF ci-dessous.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Manual Send Button if not auto-sent */}
      {gmailConfigured && !emailSent && !isLoading && (
        <Button 
          variant="default" 
          size="lg" 
          className="w-full" 
          onClick={sendQuoteEmailViaSendGrid}
        >
          <Mail className="h-5 w-5 mr-2" />
          Envoyer le devis par email
        </Button>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button variant="default" size="lg" className="w-full" onClick={handleDownloadPDF}>
          <Download className="h-5 w-5 mr-2" />
          Télécharger le PDF
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => {
            onComplete?.();
            // Handle validation
          }}>
            <CreditCard className="h-4 w-4 mr-2" />
            Valider
          </Button>
          
          <Button variant="outline" onClick={() => {
            onComplete?.();
            // Handle payment
          }}>
            <CreditCard className="h-4 w-4 mr-2" />
            Payer
          </Button>
        </div>

        <Button variant="secondary" size="lg" className="w-full" onClick={() => {
          onComplete?.();
          // Handle appointment booking
        }}>
          <Calendar className="h-5 w-5 mr-2" />
          Prendre RDV
        </Button>
      </div>

      {/* Info Message */}
      <Card className="p-4 bg-accent border-0">
        <p className="text-sm text-center text-foreground">
          <strong>Vérifiez votre e-mail  📩

        </strong> pour confirmer votre demande et programmer l'intervention si nécessaire.
        </p>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => onNavigate("modify-quote")}>
          Modifier
        </Button>
        <Button variant="outline" onClick={() => onNavigate("new-quote")}>
          Nouveau Devis
        </Button>
      </div>
    </div>;
};
