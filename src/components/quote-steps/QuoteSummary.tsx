import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Calendar, CreditCard, FileText } from "lucide-react";
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
    const tva = subtotal * 0.2; // TVA 20%
    const total = subtotal + tva;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tva: Math.round(tva * 100) / 100,
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
  return <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 shadow-card border-0 bg-gradient-card">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Devis envoyé !</h2>
          <p className="text-muted-foreground">
            à : yves@securyglass.fr
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
              <span>TVA (20%):</span>
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

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button variant="default" size="lg" className="w-full" onClick={() => {/* Handle PDF download */}}>
          <Download className="h-5 w-5 mr-2" />
          Télécharger le devis PDF
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

      {/* Back to Home */}
      <Button variant="ghost" className="w-full" onClick={() => onNavigate('welcome')}>
        Retour à l'accueil
      </Button>
    </div>;
};