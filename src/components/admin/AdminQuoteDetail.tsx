import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Phone, MapPin, Edit, CheckCircle, Calendar } from "lucide-react";

interface QuoteDetailProps {
  quote: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onValidate?: () => void;
}

export const AdminQuoteDetail = ({ quote, open, onOpenChange, onEdit, onValidate }: QuoteDetailProps) => {
  if (!quote) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Brouillon", variant: "outline" },
      validated: { label: "Validé", variant: "default" },
      sent: { label: "Envoyé", variant: "default" },
      accepted: { label: "Accepté", variant: "default" },
      rejected: { label: "Refusé", variant: "destructive" },
    };
    const config = statusConfig[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Devis {quote.quote_number || quote.id}
            </DialogTitle>
            {getStatusBadge(quote.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            {(quote.status === 'draft' || quote.status === 'validated') && onValidate && (
              <Button onClick={onValidate} variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                {quote.status === 'draft' ? 'Valider' : 'Marquer comme brouillon'}
              </Button>
            )}
          </div>

          {/* Informations Client */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Informations Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Nom:</span>
                  <span>{quote.clients?.raison_sociale || `${quote.clients?.prenom || ''} ${quote.clients?.nom || ''}`.trim() || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${quote.client_email}`} className="text-primary hover:underline">
                    {quote.client_email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${quote.clients?.mobile}`} className="text-primary hover:underline">
                    {quote.clients?.mobile || 'N/A'}
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                {quote.intervention_adresse && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div>{quote.intervention_adresse}</div>
                      <div>{quote.intervention_code_postal} {quote.intervention_ville}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Créé le {format(new Date(quote.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Caractéristiques Techniques */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Caractéristiques Techniques</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Type de service:</span>
                <div className="mt-1">{quote.service_type}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Objet:</span>
                <div className="mt-1">{quote.object}</div>
              </div>
              {quote.property && (
                <div>
                  <span className="font-medium text-muted-foreground">Propriété:</span>
                  <div className="mt-1">{quote.property}</div>
                </div>
              )}
              {quote.motif && (
                <div>
                  <span className="font-medium text-muted-foreground">Motif:</span>
                  <div className="mt-1">{quote.motif}</div>
                </div>
              )}
              {quote.category && (
                <div>
                  <span className="font-medium text-muted-foreground">Catégorie:</span>
                  <div className="mt-1">{quote.category}</div>
                </div>
              )}
              {quote.vitrage && (
                <div>
                  <span className="font-medium text-muted-foreground">Vitrage:</span>
                  <div className="mt-1">{quote.vitrage}</div>
                </div>
              )}
              {quote.largeur_cm && (
                <div>
                  <span className="font-medium text-muted-foreground">Largeur:</span>
                  <div className="mt-1">{quote.largeur_cm} cm</div>
                </div>
              )}
              {quote.hauteur_cm && (
                <div>
                  <span className="font-medium text-muted-foreground">Hauteur:</span>
                  <div className="mt-1">{quote.hauteur_cm} cm</div>
                </div>
              )}
              <div>
                <span className="font-medium text-muted-foreground">Quantité:</span>
                <div className="mt-1">{quote.quantite}</div>
              </div>
              {quote.assurance && (
                <div>
                  <span className="font-medium text-muted-foreground">Assurance:</span>
                  <div className="mt-1">{quote.assurance}</div>
                </div>
              )}
            </div>
            {quote.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <span className="font-medium text-muted-foreground">Notes:</span>
                  <div className="mt-2 text-sm whitespace-pre-wrap">{quote.notes}</div>
                </div>
              </>
            )}
          </Card>

          {/* Tarification */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Tarification</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sous-total HT:</span>
                <span className="font-medium">{formatPrice(quote.price_subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">TVA ({quote.price_tva_rate || 10}%):</span>
                <span className="font-medium">{formatPrice(quote.price_tva)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total TTC:</span>
                <span className="font-bold text-primary">{formatPrice(quote.price_total)}</span>
              </div>
            </div>

            {quote.price_details && (
              <>
                <Separator className="my-4" />
                <div>
                  <span className="font-medium text-muted-foreground">Détails du calcul:</span>
                  <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(quote.price_details, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};