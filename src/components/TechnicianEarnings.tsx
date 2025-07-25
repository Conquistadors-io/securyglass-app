import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Euro, TrendingUp, Calendar, Download, Eye } from "lucide-react";

interface TechnicianEarningsProps {
  onNavigate: (route: string) => void;
}

export const TechnicianEarnings = ({ onNavigate }: TechnicianEarningsProps) => {
  const [period, setPeriod] = useState("month");

  const earnings = {
    current: 2450,
    target: 3000,
    previous: 2150,
    interventions: 45,
    avgPerIntervention: 54.5,
    pending: 350,
    paid: 2100
  };

  const recentPayments = [
    {
      id: 1,
      date: "15/01/2024",
      client: "Marie Dupont",
      amount: 450,
      type: "Installation",
      status: "paid"
    },
    {
      id: 2,
      date: "14/01/2024", 
      client: "Jean Martin",
      amount: 250,
      type: "Acompte",
      status: "paid"
    },
    {
      id: 3,
      date: "13/01/2024",
      client: "Paul Dubois", 
      amount: 380,
      type: "Dépannage",
      status: "pending"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const progressPercentage = (earnings.current / earnings.target) * 100;
  const growth = ((earnings.current - earnings.previous) / earnings.previous) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate("technician-dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Mes gains</h1>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">{/* Added pb-32 for bottom padding */}
        {/* Period Selection */}
        <div className="flex space-x-2">
          {[
            { key: "week", label: "Semaine" },
            { key: "month", label: "Mois" },
            { key: "year", label: "Année" }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={period === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Current Earnings */}
        <Card className="p-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary">{earnings.current}€</div>
            <div className="text-sm text-muted-foreground">Gains ce mois</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Objectif mensuel</span>
              <span className="font-medium text-foreground">{earnings.target}€</span>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-600">+{growth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-primary">{earnings.interventions}</div>
            <div className="text-xs text-muted-foreground">Interventions</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-green-600">{earnings.avgPerIntervention}€</div>
            <div className="text-xs text-muted-foreground">Moyenne/intervention</div>
          </Card>
        </div>

        {/* Payment Status */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Statut des paiements</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-green-800">Montants payés</div>
                <div className="text-xs text-green-600">Versements reçus</div>
              </div>
              <div className="text-lg font-bold text-green-800">{earnings.paid}€</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-yellow-800">En attente</div>
                <div className="text-xs text-yellow-600">À recevoir prochainement</div>
              </div>
              <div className="text-lg font-bold text-yellow-800">{earnings.pending}€</div>
            </div>
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">Paiements récents</h3>
          
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div 
                key={payment.id}
                className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{payment.client}</span>
                    {getStatusBadge(payment.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {payment.date} • {payment.type}
                    </div>
                    <div className="text-sm font-bold text-primary">{payment.amount}€</div>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="ml-2">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Breakdown */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Répartition mensuelle
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Semaine 1</span>
              <span className="font-medium text-foreground">580€</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Semaine 2</span>
              <span className="font-medium text-foreground">650€</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Semaine 3</span>
              <span className="font-medium text-foreground">720€</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t pt-2">
              <span className="text-muted-foreground">Semaine 4 (en cours)</span>
              <span className="font-medium text-primary">500€</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => onNavigate("technician-dashboard")}
        >
          Retour tableau de bord
        </Button>
      </div>
    </div>
  );
};