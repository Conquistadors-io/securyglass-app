import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Calendar, CreditCard, FileText, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
  // Calculate estimated price based on form data
  const calculatePrice = () => {
    const largeur = parseFloat(data.largeur) || 0;
    const hauteur = parseFloat(data.hauteur) || 0;
    const quantite = parseInt(data.quantite) || 1;
    
    // Convertir dimensions en m²
    const area = (largeur * hauteur) / 10000; // cm² vers m²
    const areaMinimum = Math.max(area, 0.5); // Quantité minimum 0,5 m²
    
    // Prix vitrage selon le type
    let pricePerM2 = 0;
    
    switch(data.vitrage) {
      case 'simple':
        pricePerM2 = data.category === 'autre' ? 167.31 : 97.19;
        break;
      case 'double':
        pricePerM2 = data.category === 'autre' ? 348.31 : 297.31;
        break;
      case 'trempe':
        pricePerM2 = 399;
        break;
      case 'feuillete':
        pricePerM2 = 299;
        break;
      case 'anti-bruit':
        pricePerM2 = 399;
        break;
      default:
        pricePerM2 = 97.19;
    }
    
    // Calcul des coûts
    const vitragePrice = areaMinimum * pricePerM2;
    const mainOeuvrePrice = areaMinimum * 178.18; // Main d'œuvre par m²
    
    // Approvisionnement + Livraison
    let livraison = 79;
    if (area > 1.5) livraison = 141.17;
    else if (area > 0.5) livraison = 94.11;
    
    // Déplacement (non facturé si mise en sécurité)
    const deplacement = data.object?.includes('sécurité') ? 0 : 62.73;
    
    // Mise en sécurité si applicable
    let miseEnSecurite = 0;
    if (data.object?.includes('sécurité')) {
      miseEnSecurite = data.typeClient === 'entreprise' ? 150 * areaMinimum : 135.45;
    }
    
    const subtotal = (vitragePrice + mainOeuvrePrice + livraison + deplacement + miseEnSecurite) * quantite;
    
    // TVA différente selon le type de client
    const isParticulier = data.civilite === 'madame' || data.civilite === 'monsieur';
    const tvaRate = isParticulier ? 0.1 : 0.2; // 10% pour particuliers, 20% pour entreprises
    const tva = subtotal * tvaRate;
    const total = subtotal + tva;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tva: Math.round(tva * 100) / 100,
      tvaRate: tvaRate,
      total: Math.round(total * 100) / 100,
      details: {
        vitrage: Math.round(vitragePrice * quantite * 100) / 100,
        mainOeuvre: Math.round(mainOeuvrePrice * quantite * 100) / 100,
        livraison: Math.round(livraison * quantite * 100) / 100,
        deplacement: Math.round(deplacement * quantite * 100) / 100,
        miseEnSecurite: Math.round(miseEnSecurite * quantite * 100) / 100,
        area: areaMinimum
      }
    };
  };
  const priceCalculation = calculatePrice();
  const quoteNumber = `DEV-${Date.now().toString().slice(-8)}`;

  const generateQuoteHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Devis ${quoteNumber}</title>
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
          <p><strong>Numéro de devis:</strong> ${quoteNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div class="client-info">
          <h3>Client</h3>
          <p><strong>${data.civilite} ${data.nom}</strong></p>
          <p>${data.telephone}</p>
          <p>${data.email}</p>
          ${data.adresse ? `<p>${data.adresse}</p>` : ''}
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
              <td>${priceCalculation.details.vitrage}€</td>
            </tr>
            <tr>
              <td>Main d'œuvre</td>
              <td>${priceCalculation.details.area.toFixed(2)} m²</td>
              <td>1</td>
              <td>${(priceCalculation.details.mainOeuvre / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${priceCalculation.details.mainOeuvre}€</td>
            </tr>
            <tr>
              <td>Livraison</td>
              <td>-</td>
              <td>1</td>
              <td>${(priceCalculation.details.livraison / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${priceCalculation.details.livraison}€</td>
            </tr>
            ${priceCalculation.details.deplacement > 0 ? `
            <tr>
              <td>Déplacement</td>
              <td>-</td>
              <td>1</td>
              <td>${(priceCalculation.details.deplacement / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${priceCalculation.details.deplacement}€</td>
            </tr>
            ` : ''}
            ${priceCalculation.details.miseEnSecurite > 0 ? `
            <tr>
              <td>Mise en sécurité</td>
              <td>-</td>
              <td>1</td>
              <td>${(priceCalculation.details.miseEnSecurite / parseInt(data.quantite || 1)).toFixed(2)}€</td>
              <td>${priceCalculation.details.miseEnSecurite}€</td>
            </tr>
            ` : ''}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-line">Sous-total HT: ${priceCalculation.subtotal}€</div>
          <div class="total-line">TVA (${Math.round(priceCalculation.tvaRate * 100)}%): ${priceCalculation.tva}€</div>
          <div class="total-line final-total">Total TTC: ${priceCalculation.total}€</div>
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

  const handleDownloadPDF = () => {
    const htmlContent = generateQuoteHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_self');
    
    // Clean up the URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
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
  }, []);

  const sendQuoteEmailViaGmail = async () => {
    if (isLoading || emailSent || !gmailConfigured) return;
    
    setIsLoading(true);
    console.log("Sending quote email via Gmail to:", data.email);

    try {
      const quoteData = {
        id: quoteNumber,
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
          {
            designation: data.object,
            quantity: parseInt(data.quantite || 1),
            unitPrice: priceCalculation.details.vitrage / parseInt(data.quantite || 1),
            total: priceCalculation.details.vitrage
          }
        ],
        subtotal: priceCalculation.subtotal,
        vat: priceCalculation.tva,
        total: priceCalculation.total
      };

      const { data: result, error } = await supabase.functions.invoke('send-quote-gmail', {
        body: {
          email: data.email,
          clientName: `${data.civilite} ${data.nom}`,
          message: `Merci pour votre demande de devis. Veuillez trouver ci-joint votre devis pour ${data.object}.`,
          senderEmail: adminEmail,
          quoteData
        }
      });

      if (error) {
        console.error("Erreur lors de l'envoi du devis:", error);
        
        if (error.message?.includes('needsAuth')) {
          toast({
            title: "Gmail non configuré",
            description: "L'administrateur doit configurer Gmail pour l'envoi automatique des devis.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible d'envoyer le devis par email. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      } else {
        console.log("Devis envoyé avec succès via Gmail:", result);
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

  // Auto-send email when component loads if Gmail is configured
  useEffect(() => {
    if (data.email && !emailSent && !isLoading && gmailConfigured) {
      sendQuoteEmailViaGmail();
    }
  }, [data.email, gmailConfigured]);

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

          {/* Détail des coûts */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Vitrage ({priceCalculation.details.area.toFixed(2)} m²):</span>
              <span>{priceCalculation.details.vitrage}€</span>
            </div>
            <div className="flex justify-between">
              <span>Main d'œuvre:</span>
              <span>{priceCalculation.details.mainOeuvre}€</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison:</span>
              <span>{priceCalculation.details.livraison}€</span>
            </div>
            {priceCalculation.details.deplacement > 0 && (
              <div className="flex justify-between">
                <span>Déplacement:</span>
                <span>{priceCalculation.details.deplacement}€</span>
              </div>
            )}
            {priceCalculation.details.miseEnSecurite > 0 && (
              <div className="flex justify-between">
                <span>Rénovation:</span>
                <span>{priceCalculation.details.miseEnSecurite}€</span>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Sous-total HT:</span>
              <span>{priceCalculation.subtotal}€</span>
            </div>
            <div className="flex justify-between">
              <span>TVA ({Math.round(priceCalculation.tvaRate * 100)}%):</span>
              <span>{priceCalculation.tva}€</span>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total TTC:</span>
            <span className="text-2xl font-bold text-primary">
              {priceCalculation.total}€
            </span>
          </div>

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
            <p>{data.telephone}</p>
            <p>{data.email}</p>
            {data.adresse && <p>{data.adresse}</p>}
          </div>
        </div>
      </Card>

      {/* Gmail Status Info */}
      {!gmailConfigured && (
        <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Configuration Gmail requise
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                L'administrateur doit configurer Gmail pour l'envoi automatique des devis.
              </p>
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
          onClick={sendQuoteEmailViaGmail}
        >
          <Mail className="h-5 w-5 mr-2" />
          Envoyer le devis par email
        </Button>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button variant="default" size="lg" className="w-full" onClick={handleDownloadPDF}>
          <FileText className="h-5 w-5 mr-2" />
          Voir le Devis
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
