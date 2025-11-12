import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Euro, TrendingUp, Receipt, Clock } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
    sentQuotes: 0,
    acceptedQuotes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch quotes stats
      const { data: quotes, error: quotesError } = await supabase
        .from('devis')
        .select('status, price_total');

      if (quotesError) throw quotesError;

      // Fetch clients count
      const { count: clientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      if (clientsError) throw clientsError;

      // Calculate stats
      const totalQuotes = quotes?.length || 0;
      const totalRevenue = quotes?.reduce((sum, quote) => {
        return sum + (parseFloat(quote.price_total?.toString() || '0'));
      }, 0) || 0;
      
      const pendingQuotes = quotes?.filter(q => q.status === 'draft' || q.status === 'pending').length || 0;
      const sentQuotes = quotes?.filter(q => q.status === 'sent').length || 0;
      const acceptedQuotes = quotes?.filter(q => q.status === 'accepted').length || 0;

      setStats({
        totalQuotes,
        totalClients: clientsCount || 0,
        totalRevenue,
        pendingQuotes,
        sentQuotes,
        acceptedQuotes,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const kpiCards = [
    {
      title: "Devis Total",
      value: stats.totalQuotes,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Chiffre d'Affaires",
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: Euro,
      color: "text-green-600",
    },
    {
      title: "Devis en Attente",
      value: stats.pendingQuotes,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Devis Envoyés",
      value: stats.sentQuotes,
      icon: Receipt,
      color: "text-purple-600",
    },
    {
      title: "Devis Acceptés",
      value: stats.acceptedQuotes,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
