import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp } from "lucide-react";

interface Quote {
  id: string;
  quote_number: string | null;
  client_id: string;
  status: string;
  price_total: number | null;
  created_at: string;
  service_type: string;
  motif: string | null;
  pdf_url: string | null;
  clients?: {
    nom: string | null;
    prenom: string | null;
    mobile: string;
    email: string;
    raison_sociale: string | null;
  };
}

interface AdminQuoteStatsProps {
  quotes: Quote[];
  filteredQuotes: Quote[];
}

export const AdminQuoteStats = ({ quotes, filteredQuotes }: AdminQuoteStatsProps) => {
  const statusStats = useMemo(() => {
    const stats = {
      draft: 0,
      validated: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
    };

    filteredQuotes.forEach(quote => {
      if (quote.status in stats) {
        stats[quote.status as keyof typeof stats]++;
      }
    });

    return [
      { name: 'Brouillons', value: stats.draft, color: '#94a3b8', status: 'draft' },
      { name: 'Validés', value: stats.validated, color: '#60bca8', status: 'validated' },
      { name: 'Envoyés', value: stats.sent, color: '#3d7a99', status: 'sent' },
      { name: 'Acceptés', value: stats.accepted, color: '#5ba085', status: 'accepted' },
      { name: 'Refusés', value: stats.rejected, color: '#e06860', status: 'rejected' },
    ].filter(stat => stat.value > 0);
  }, [filteredQuotes]);

  const totalAmount = useMemo(() => {
    return filteredQuotes.reduce((sum, q) => sum + (q.price_total || 0), 0);
  }, [filteredQuotes]);

  const sentCount = useMemo(() => 
    filteredQuotes.filter(q => q.status === 'sent').length, 
    [filteredQuotes]
  );

  const acceptedCount = useMemo(() => 
    filteredQuotes.filter(q => q.status === 'accepted').length, 
    [filteredQuotes]
  );

  return (
    <div className="space-y-6 mb-8">
      {/* Cards de stats simples */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-2">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{filteredQuotes.length}</div>
        </Card>
        <Card className="p-4 border-2">
          <div className="text-sm text-muted-foreground">Envoyés</div>
          <div className="text-2xl font-bold text-primary">
            {sentCount}
          </div>
        </Card>
        <Card className="p-4 border-2">
          <div className="text-sm text-muted-foreground">Acceptés</div>
          <div className="text-2xl font-bold text-green-600">
            {acceptedCount}
          </div>
        </Card>
        <Card className="p-4 border-2">
          <div className="text-sm text-muted-foreground">Montant Total</div>
          <div className="text-2xl font-bold text-primary">
            {totalAmount.toFixed(2)} €
          </div>
        </Card>
      </div>

      {/* Graphiques visuels */}
      {statusStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en camembert */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Répartition par statut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {statusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} devis`, 'Quantité']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique en barres */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Comparaison des statuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusStats}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} devis`, 'Quantité']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {statusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
