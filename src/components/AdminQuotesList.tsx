import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Quote {
  id: string;
  quote_number: string | null;
  client_email: string;
  status: string;
  price_total: number | null;
  created_at: string;
  service_type: string;
  motif: string | null;
  vitrage: string | null;
}

export const AdminQuotesList = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = quotes.filter(quote => 
        quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.motif?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuotes(filtered);
    } else {
      setFilteredQuotes(quotes);
    }
  }, [searchTerm, quotes]);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('devis')
        .select('id, quote_number, client_email, status, price_total, created_at, service_type, motif, vitrage')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotes(data || []);
      setFilteredQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les devis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Brouillon", variant: "outline" },
      sent: { label: "Envoyé", variant: "default" },
      accepted: { label: "Accepté", variant: "default" },
      rejected: { label: "Refusé", variant: "destructive" },
    };

    const config = statusConfig[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Historique des Devis
            </h2>
            <p className="text-sm text-muted-foreground">
              Consultez tous les devis générés par le système.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro, email ou motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{quotes.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Envoyés</div>
            <div className="text-2xl font-bold">
              {quotes.filter(q => q.status === 'sent').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Acceptés</div>
            <div className="text-2xl font-bold text-green-600">
              {quotes.filter(q => q.status === 'accepted').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Montant Total</div>
            <div className="text-2xl font-bold">
              {quotes.reduce((sum, q) => sum + (q.price_total || 0), 0).toFixed(2)} €
            </div>
          </Card>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des devis...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Aucun devis trouvé.' : 'Aucun devis généré pour le moment.'}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Devis</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Vitrage</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Montant TTC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">
                      {quote.quote_number || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(quote.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {quote.client_email}
                    </TableCell>
                    <TableCell>{quote.service_type}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {quote.motif || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {quote.vitrage || 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {quote.price_total ? `${quote.price_total.toFixed(2)} €` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement view details
                            toast({
                              title: "Fonctionnalité à venir",
                              description: "La visualisation des détails sera bientôt disponible.",
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement download PDF
                            toast({
                              title: "Fonctionnalité à venir",
                              description: "Le téléchargement du PDF sera bientôt disponible.",
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};
