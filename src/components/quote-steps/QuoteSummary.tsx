import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Calendar, CreditCard, FileText } from "lucide-react";
interface QuoteSummaryProps {
  data: any;
  onNavigate: (route: string) => void;
}
export const QuoteSummary = ({
  data,
  onNavigate
}: QuoteSummaryProps) => {
  // Calculate estimated price based on form data
  const calculatePrice = () => {
    const basePrice = 150;
    const area = parseInt(data.largeur) * parseInt(data.hauteur) / 10000; // m²
    const typeMultiplier = {
      'simple': 1,
      'double': 1.5,
      'trempe': 2,
      'feuillete': 2.2,
      'anti-bruit': 2.5
    }[data.vitrage] || 1;
    const pricePerM2 = 80;
    const totalPrice = basePrice + area * pricePerM2 * typeMultiplier;
    return Math.round(totalPrice * parseInt(data.quantite));
  };
  const estimatedPrice = calculatePrice();
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

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Prix estimé:</span>
            <span className="text-2xl font-bold text-primary">
              {estimatedPrice}€ TTC
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
          <Button variant="outline" onClick={() => {/* Handle payment */}}>
            <CreditCard className="h-4 w-4 mr-2" />
            Valider
          </Button>
          
          <Button variant="outline" onClick={() => {/* Handle insurance */}}>
            <CreditCard className="h-4 w-4 mr-2" />
            Payer
          </Button>
        </div>

        <Button variant="secondary" size="lg" className="w-full" onClick={() => {/* Handle appointment booking */}}>
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