import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Send, Printer, Copy, FileText, Euro, Calendar, User, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import securyglassLogo from "@/assets/securyglass-logo.png";

interface QuoteDetailProps {
  onNavigate: (route: string) => void;
}

export const QuoteDetail = ({ onNavigate }: QuoteDetailProps) => {
  const [status, setStatus] = useState<"pending" | "sent" | "accepted" | "converted">("pending");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const quote = {
    id: "DV212200",
    date: "19/03/2025",
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

  const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = quote.items.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
  const total = subtotal + vatAmount;

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Envoyé</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepté</Badge>;
      case "converted":
        return <Badge className="bg-purple-100 text-purple-800">Facturé</Badge>;
      default:
        return <Badge>Brouillon</Badge>;
    }
  };

  const handleSend = () => {
    setShowSendDialog(true);
    setClientEmail(quote.client.email);
    setClientPhone(quote.client.phone);
    setMessage(`Voici votre devis ${quote.id} pour vos travaux de vitrage. Montant: ${total.toFixed(2)} €`);
  };

  const handleSendQuote = async () => {
    try {
      // Simulation d'envoi d'email
      const emailData = {
        to: clientEmail,
        subject: `Devis ${quote.id} - Securyglass`,
        body: message,
        attachments: [`devis_${quote.id}.pdf`]
      };

      // Simulation d'envoi de SMS
      const smsData = {
        to: clientPhone,
        message: `Securyglass: Votre devis ${quote.id} a été envoyé par email. Montant: ${total.toFixed(2)} €`
      };

      // Ici on simule les appels API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus("sent");
      setShowSendDialog(false);
      
      toast({
        title: "Devis envoyé avec succès",
        description: `Email envoyé à ${clientEmail} et SMS envoyé au ${clientPhone}`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur s'est produite lors de l'envoi du devis",
        variant: "destructive",
      });
    }
  };

  const handleConvertToInvoice = () => {
    setStatus("converted");
    onNavigate("invoice-detail");
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
            Terminé
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Devis {quote.id}</h1>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary"
          >
            Modifier
          </Button>
        </div>
        <p className="text-center text-muted-foreground">{quote.client.name}</p>
      </div>

      <div className="p-4 space-y-4 pb-32">
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

        {/* Quote Info */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Devis N° :</span>
                  <span className="font-medium">{quote.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date :</span>
                  <span className="font-medium">{quote.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">À :</span>
                  <div className="text-right">
                    <div className="font-medium">{quote.client.name}</div>
                    <div className="text-xs text-muted-foreground">{quote.client.email}</div>
                    <div className="text-xs text-muted-foreground">{quote.client.address}</div>
                    <div className="text-xs text-muted-foreground">
                      {quote.client.postalCode} {quote.client.city}
                    </div>
                    <div className="text-xs text-muted-foreground">{quote.client.phone}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="space-y-1 text-xs">
                <div className="font-medium">Devis</div>
                <div className="text-muted-foreground">{quote.company.name}</div>
                <div className="text-muted-foreground">{quote.company.email}</div>
                <div className="text-muted-foreground">{quote.company.phone}</div>
                <div className="text-muted-foreground">Code {quote.company.apeCode}</div>
                <div className="text-muted-foreground">Siret {quote.company.siret}</div>
                <div className="text-muted-foreground">TVA {quote.company.tva}</div>
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
            {quote.items.map((item) => (
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
                {item.id < quote.items.length && <Separator />}
              </div>
            ))}
          </div>
        </Card>

        {/* Total */}
        <Card className="p-6">
          <div className="text-center">
            <div className="text-lg text-muted-foreground mb-1">Total</div>
            <div className="text-4xl font-bold text-foreground">{total.toFixed(2)} €</div>
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

        {/* Actions */}
        {status !== "converted" && (
          <Card className="p-4">
            <div className="space-y-3">
              <Button 
                variant="default"
                className="w-full flex items-center justify-center space-x-2"
                onClick={handleConvertToInvoice}
              >
                <FileText className="h-4 w-4" />
                <span>Convertir en facture</span>
              </Button>
            </div>
          </Card>
        )}

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

      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Envoyer le devis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email du client</Label>
              <Input
                id="email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone du client (SMS)</Label>
              <Input
                id="phone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="06 XX XX XX XX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Votre message..."
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSendDialog(false)}
              >
                Annuler
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSendQuote}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer Email + SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4 space-y-2">
        {status === "pending" ? (
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={handleSend}
          >
            <Send className="h-5 w-5 mr-2" />
            Envoyer par Email + SMS
          </Button>
        ) : status === "sent" ? (
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full"
            onClick={handleSend}
          >
            <Send className="h-5 w-5 mr-2" />
            Renvoyer
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={handleSend}
            >
              <Send className="h-5 w-5 mr-2" />
              Renvoyer
            </Button>
            <Button 
              variant="hero" 
              size="lg" 
              className="flex-1"
              onClick={() => onNavigate("technician-dashboard")}
            >
              Terminé
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};