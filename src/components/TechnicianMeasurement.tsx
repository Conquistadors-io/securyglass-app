import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Camera, Ruler, Euro, CheckCircle, Receipt } from "lucide-react";

interface TechnicianMeasurementProps {
  onNavigate: (route: string) => void;
}

export const TechnicianMeasurement = ({ onNavigate }: TechnicianMeasurementProps) => {
  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
    quantity: "1"
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onNavigate("technician-order");
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Visite terminée</h2>
          <p className="text-muted-foreground">Acompte encaissé</p>
          <p className="text-sm text-muted-foreground mt-2">Redirection vers la commande...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate("technician-appointment")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Visite de mesures</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Client Info */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-2">Marie Dupont</h3>
          <p className="text-sm text-muted-foreground">15 rue Victor Hugo, 75001 Paris</p>
          <p className="text-sm text-muted-foreground">Vitre cassée - Porte d'entrée</p>
        </Card>

        {/* Photo Upload */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Photos du dégât</h3>
          <Button variant="outline" className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Prendre des photos (0/3)
          </Button>
        </Card>

        {/* Dimensions */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Ruler className="h-4 w-4 mr-2" />
            Dimensions (cm)
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="width" className="text-sm">Largeur</Label>
              <Input
                id="width"
                placeholder="80"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-sm">Hauteur</Label>
              <Input
                id="height"
                placeholder="120"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantity" className="text-sm">Quantité</Label>
            <Input
              id="quantity"
              placeholder="1"
              value={dimensions.quantity}
              onChange={(e) => setDimensions({...dimensions, quantity: e.target.value})}
            />
          </div>
        </Card>

        {/* Deposit Collection */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Euro className="h-4 w-4 mr-2" />
            Encaissement acompte (250€)
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cb"
                checked={paymentMethod === "cb"}
                onCheckedChange={() => setPaymentMethod("cb")}
              />
              <Label htmlFor="cb" className="text-sm">Carte bancaire</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cash"
                checked={paymentMethod === "cash"}
                onCheckedChange={() => setPaymentMethod("cash")}
              />
              <Label htmlFor="cash" className="text-sm">Espèces</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="check"
                checked={paymentMethod === "check"}
                onCheckedChange={() => setPaymentMethod("check")}
              />
              <Label htmlFor="check" className="text-sm">Chèque</Label>
            </div>
          </div>

          {paymentMethod && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800 font-medium">Acompte de 250€ encaissé</div>
              <div className="text-xs text-green-600">Mode: {paymentMethod === "cb" ? "Carte bancaire" : paymentMethod === "cash" ? "Espèces" : "Chèque"}</div>
            </div>
          )}
        </Card>

        {/* Receipt */}
        {paymentMethod && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Générer reçu d'acompte</span>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                <Receipt className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={!dimensions.width || !dimensions.height || !paymentMethod}
          onClick={handleComplete}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Terminer la visite
        </Button>
      </div>
    </div>
  );
};