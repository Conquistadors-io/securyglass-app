import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Printer, Copy, FileText, Euro, Calendar, User, Phone, Mail, CheckCircle } from "lucide-react";
import securyglassLogo from "@/assets/securyglass-logo.png";

interface InvoiceDetailProps {
  onNavigate: (route: string) => void;
}

export const InvoiceDetail = ({ onNavigate }: InvoiceDetailProps) => {
  const invoice = {
    id: "FA212200",
    date: "19/03/2025",
    dueDate: "19/04/2025",
    originalQuoteId: "DV212200",
    status: "sent",
    client: {
      name: "Monsieur VUILLERMET Bernard",
      email: "bernard.vuillermet@orange.fr",
      address: "111 Rue Edouard Tremblay",
      postalCode: "94400",
      city: "Vitry-sur-Seine",
      phone: "06 79 73 38 47"
    },
    company: {
      name: "Securyglass France",
      email: "contact@securyglass.fr",
      phone: "09 70 144 344",
      apeCode: "APE 62012",
      siret: "91094284600015",
      tva: "FR20910942846"
    },
    items: [
      {
        id: 1,
        designation: "Déplacement / Constat des lieux / Prise de mesures :",
        description: "REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE",
        quantity: 1,
        unitPrice: 62.73,
        vatRate: 10,
        total: 62.73
      },
      {
        id: 2,
        designation: "VERRE IMPRIMÉ LISTRAL 130",
        description: "EP4 mm - Hauteur 800 x L 600\nRéglementation Thermique RT 2020",
        quantity: 1,
        unitPrice: 130.56,
        vatRate: 10,
        total: 130.56
      }
    ]
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = invoice.items.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
  const total = subtotal + vatAmount;

  const getStatusBadge = () => {
    switch (invoice.status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Envoyée</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      default:
        return <Badge>Brouillon</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("technician-dashboard")}
            className="text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Facture {invoice.id}</h1>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary"
          >
            Modifier
          </Button>
        </div>
        <p className="text-center text-muted-foreground">{invoice.client.name}</p>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Success Message */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Facture générée avec succès</h3>
              <p className="text-sm text-green-600">
                Devis {invoice.originalQuoteId} converti en facture {invoice.id}
              </p>
            </div>
          </div>
        </Card>

        {/* Company Header */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={securyglassLogo} 
                alt="SECURYGLASS" 
                className="h-12 w-12"
              />
              <div>
                <h2 className="font-bold text-foreground">securyglass®</h2>
                <p className="text-sm text-muted-foreground">Glass for your security</p>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div className="w-12 h-8 bg-orange-500 rounded mb-1"></div>
              <div className="w-12 h-4 bg-red-500 rounded"></div>
            </div>
          </div>
        </Card>

        {/* Invoice Info */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Facture N° :</span>
                  <span className="font-medium">{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date :</span>
                  <span className="font-medium">{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Échéance :</span>
                  <span className="font-medium">{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">À :</span>
                  <div className="text-right">
                    <div className="font-medium">{invoice.client.name}</div>
                    <div className="text-xs text-muted-foreground">{invoice.client.email}</div>
                    <div className="text-xs text-muted-foreground">{invoice.client.address}</div>
                    <div className="text-xs text-muted-foreground">
                      {invoice.client.postalCode} {invoice.client.city}
                    </div>
                    <div className="text-xs text-muted-foreground">{invoice.client.phone}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="space-y-1 text-xs">
                <div className="font-medium">Facture</div>
                <div className="text-muted-foreground">{invoice.company.name}</div>
                <div className="text-muted-foreground">{invoice.company.email}</div>
                <div className="text-muted-foreground">{invoice.company.phone}</div>
                <div className="text-muted-foreground">Code {invoice.company.apeCode}</div>
                <div className="text-muted-foreground">Siret {invoice.company.siret}</div>
                <div className="text-muted-foreground">TVA {invoice.company.tva}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Items Table */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-5">Désignation</div>
              <div className="col-span-1 text-center">Qté</div>
              <div className="col-span-2 text-right">P.U.</div>
              <div className="col-span-1 text-center">TVA</div>
              <div className="col-span-3 text-right">Montant</div>
            </div>

            {/* Items */}
            {invoice.items.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-sm">
                  <div className="col-span-5">
                    <div className="font-medium text-foreground">{item.designation}</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">
                      {item.description}
                    </div>
                  </div>
                  <div className="col-span-1 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">{item.unitPrice.toFixed(2)} €</div>
                  <div className="col-span-1 text-center">{item.vatRate} %</div>
                  <div className="col-span-3 text-right font-medium">{item.total.toFixed(2)} €</div>
                </div>
                {item.id < invoice.items.length && <Separator />}
              </div>
            ))}
          </div>
        </Card>

        {/* Total */}
        <Card className="p-6">
          <div className="text-center">
            <div className="text-lg text-muted-foreground mb-1">Total à payer</div>
            <div className="text-4xl font-bold text-foreground">{total.toFixed(2)} €</div>
            <div className="text-sm text-muted-foreground mt-2">
              Échéance : {invoice.dueDate}
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Statut</span>
            </div>
            {getStatusBadge()}
          </div>
        </Card>

        {/* Additional Options */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">PLUS</span>
            </div>
            
            <Button variant="ghost" className="w-full justify-start">
              <Printer className="h-4 w-4 mr-3" />
              Imprimer
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Copy className="h-4 w-4 mr-3" />
              Copier
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 space-y-2">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
        >
          <Send className="h-5 w-5 mr-2" />
          Envoyer la facture
        </Button>
      </div>
    </div>
  );
};