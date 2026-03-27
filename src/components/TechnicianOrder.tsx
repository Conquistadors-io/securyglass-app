import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Package, Truck, Calendar, CheckCircle2, Clock } from "lucide-react";

interface TechnicianOrderProps {
  onNavigate: (route: string) => void;
}

export const TechnicianOrder = ({ onNavigate }: TechnicianOrderProps) => {
  const [orderStatus, setOrderStatus] = useState<"ordered" | "confirmed" | "ready">("ordered");

  const order = {
    id: "CMD-2024-001",
    client: "Marie Dupont",
    glass: "Verre feuilleté 6mm",
    dimensions: "80 x 120 cm",
    quantity: 1,
    supplier: "Verrerie Parisienne",
    estimatedDelivery: "3-4 jours ouvrés"
  };

  const getStatusInfo = () => {
    switch (orderStatus) {
      case "ordered":
        return {
          label: "Commandé",
          color: "bg-yellow-100 text-yellow-800",
          progress: 25,
          description: "Commande transmise au fournisseur"
        };
      case "confirmed":
        return {
          label: "Confirmé",
          color: "bg-primary/10 text-primary-dark", 
          progress: 50,
          description: "Production en cours chez le fournisseur"
        };
      case "ready":
        return {
          label: "Prêt",
          color: "bg-green-100 text-green-800",
          progress: 100,
          description: "Prêt pour livraison/retrait"
        };
      default:
        return {
          label: "En attente",
          color: "bg-gray-100 text-gray-800",
          progress: 0,
          description: "Statut inconnu"
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleNextStatus = () => {
    if (orderStatus === "ordered") {
      setOrderStatus("confirmed");
    } else if (orderStatus === "confirmed") {
      setOrderStatus("ready");
    } else {
      onNavigate("technician-installation");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate("technician-measurement")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Commande verre</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Order Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">Statut de la commande</h3>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </div>
          
          <Progress value={statusInfo.progress} className="mb-3" />
          
          <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
          
          <div className="flex items-center space-x-1 mt-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Délai: {order.estimatedDelivery}</span>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Détails commande
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">N° commande</span>
              <span className="font-medium text-foreground">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client</span>
              <span className="font-medium text-foreground">{order.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type de verre</span>
              <span className="font-medium text-foreground">{order.glass}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dimensions</span>
              <span className="font-medium text-foreground">{order.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantité</span>
              <span className="font-medium text-foreground">{order.quantity}</span>
            </div>
          </div>
        </Card>

        {/* Supplier Info */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Fournisseur
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">{order.supplier}</div>
              <div className="text-sm text-muted-foreground">Livraison prévue jeudi 18/01</div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Actif
            </Badge>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Suivi de commande</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Commande passée</div>
                <div className="text-xs text-muted-foreground">Aujourd'hui 14:30</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${
                orderStatus !== "ordered" ? "bg-green-500" : "bg-gray-300"
              }`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Confirmation fournisseur</div>
                <div className="text-xs text-muted-foreground">
                  {orderStatus !== "ordered" ? "Confirmée" : "En attente"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${
                orderStatus === "ready" ? "bg-green-500" : "bg-gray-300"
              }`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Prêt pour livraison</div>
                <div className="text-xs text-muted-foreground">
                  {orderStatus === "ready" ? "Disponible" : "En production"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Actions */}
        {orderStatus === "ready" && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Verre disponible</span>
            </div>
            <p className="text-sm text-green-700">
              Le verre est prêt. Vous pouvez programmer l'installation.
            </p>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4">
        {orderStatus === "ready" ? (
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={() => onNavigate("technician-installation")}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Programmer l'installation
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={handleNextStatus}
            >
              <Clock className="h-5 w-5 mr-2" />
              Simuler mise à jour statut
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full"
              onClick={() => onNavigate("technician-dashboard")}
            >
              Retour tableau de bord
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};