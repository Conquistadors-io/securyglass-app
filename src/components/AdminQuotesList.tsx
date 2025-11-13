import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download, Search, Edit, CheckCircle, Mail, Phone } from "lucide-react";
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
import { AdminQuoteDetail } from "./admin/AdminQuoteDetail";
import { AdminQuoteEdit } from "./admin/AdminQuoteEdit";
import { updateDevisStatus } from "@/services/devis";

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
  clients?: {
    nom: string | null;
    prenom: string | null;
    mobile: string;
    raison_sociale: string | null;
  };
}

export const AdminQuotesList = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = quotes.filter(quote => 
        quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.motif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.mobile?.includes(searchTerm)
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
        .select(`
          *,
          clients!inner(nom, prenom, mobile, raison_sociale)
        `)
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
      validated: { label: "Validé", variant: "default" },
      sent: { label: "Envoyé", variant: "default" },
      accepted: { label: "Accepté", variant: "default" },
      rejected: { label: "Refusé", variant: "destructive" },
    };

    const config = statusConfig[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewDetails = async (quoteId: string) => {
    try {
      const { data, error } = await supabase
        .from('devis')
        .select(`
          *,
          clients!inner(nom, prenom, mobile, raison_sociale)
        `)
        .eq('id', quoteId)
        .single();

      if (error) throw error;

      setSelectedQuote(data);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error loading quote details:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du devis.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (quoteId: string) => {
    try {
      const { data, error } = await supabase
        .from('devis')
        .select(`
          *,
          clients!inner(nom, prenom, mobile, raison_sociale)
        `)
        .eq('id', quoteId)
        .single();

      if (error) throw error;

      setSelectedQuote(data);
      setIsEditOpen(true);
    } catch (error) {
      console.error('Error loading quote for edit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le devis pour modification.",
        variant: "destructive",
      });
    }
  };

  const handleValidateToggle = async (quoteId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'draft' ? 'validated' : 'draft';
      const result = await updateDevisStatus(quoteId, newStatus);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la validation');
      }

      toast({
        title: "Statut mis à jour",
        description: `Le devis a été ${newStatus === 'validated' ? 'validé' : 'marqué comme brouillon'}.`,
      });

      loadQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    loadQuotes();
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
              placeholder="Rechercher par numéro, email, nom, téléphone..."
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
                    <TableCell className="max-w-[250px]">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {quote.clients?.raison_sociale || `${quote.clients?.prenom || ''} ${quote.clients?.nom || ''}`.trim() || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{quote.client_email}</span>
                        </div>
                        {quote.clients?.mobile && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${quote.clients.mobile}`} className="hover:text-primary">
                              {quote.clients.mobile}
                            </a>
                          </div>
                        )}
                      </div>
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
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(quote.id)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(quote.id)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {(quote.status === 'draft' || quote.status === 'validated') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleValidateToggle(quote.id, quote.status)}
                            title={quote.status === 'draft' ? 'Valider' : 'Marquer comme brouillon'}
                          >
                            <CheckCircle className={`h-4 w-4 ${quote.status === 'validated' ? 'text-green-600' : ''}`} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modals */}
      {selectedQuote && (
        <>
          <AdminQuoteDetail
            quote={selectedQuote}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            onEdit={() => {
              setIsDetailOpen(false);
              setIsEditOpen(true);
            }}
            onValidate={() => handleValidateToggle(selectedQuote.id, selectedQuote.status)}
          />
          <AdminQuoteEdit
            quote={selectedQuote}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  );
};
