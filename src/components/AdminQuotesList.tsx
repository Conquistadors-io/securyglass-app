import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download, Search, Edit, CheckCircle, Mail, Phone, Filter, FilePlus, RefreshCw } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfToday, startOfWeek, startOfMonth, endOfToday, endOfWeek, endOfMonth, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { AdminQuoteDetail } from "./admin/AdminQuoteDetail";
import { AdminQuoteEdit } from "./admin/AdminQuoteEdit";
import { AdminQuoteStats } from "./admin/AdminQuoteStats";
import { updateQuoteStatus } from "@/services/quotes";
import { Calendar, CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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

export const AdminQuotesList = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
  }, []);

  const getDateRange = (filter: string) => {
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return { from: startOfToday(), to: endOfToday() };
      case 'week':
        return { from: startOfWeek(now, { locale: fr }), to: endOfWeek(now, { locale: fr }) };
      case 'month':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'custom':
        return customDateRange;
      default:
        return null;
    }
  };

  const filterByDate = (quotesToFilter: Quote[], filter: string) => {
    if (filter === 'all') return quotesToFilter;
    
    const range = getDateRange(filter);
    if (!range || !range.from || !range.to) return quotesToFilter;
    
    return quotesToFilter.filter(quote => {
      const quoteDate = new Date(quote.created_at);
      return isWithinInterval(quoteDate, { start: range.from!, end: range.to! });
    });
  };

  useEffect(() => {
    let filtered = quotes;

    // Filter by date
    filtered = filterByDate(filtered, dateFilter);

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.clients?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.motif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.raison_sociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.clients?.mobile?.includes(searchTerm)
      );
    }

    setFilteredQuotes(filtered);
  }, [searchTerm, statusFilter, dateFilter, customDateRange, quotes]);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients!inner(nom, prenom, mobile, email, raison_sociale)
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

  const handleGeneratePDF = async (quoteId: string) => {
    try {
      toast({
        title: "Génération du PDF",
        description: "Génération en cours...",
      });

      const { data, error } = await supabase.functions.invoke(
        'generate-quote-pdf',
        { body: { quoteId } }
      );

      if (error) throw error;

      toast({
        title: "Succès",
        description: "PDF généré avec succès",
      });

      loadQuotes();
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive",
      });
    }
  };

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" }> = {
    draft: { label: "Brouillon", variant: "outline" },
    validated: { label: "Validé", variant: "success" },
    sent: { label: "Envoyé", variant: "default" },
    accepted: { label: "Accepté", variant: "secondary" },
    rejected: { label: "Refusé", variant: "destructive" },
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewDetails = async (quoteId: string) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients!inner(nom, prenom, mobile, email, raison_sociale)
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
        .from('quotes')
        .select(`
          *,
          clients!inner(nom, prenom, mobile, email, raison_sociale)
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
      const result = await updateQuoteStatus(quoteId, newStatus);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Devis</h1>
          <p className="text-muted-foreground">
            Recherchez et gérez tous les devis clients
          </p>
        </div>

        {/* Statistiques visuelles */}
        <AdminQuoteStats quotes={quotes} filteredQuotes={filteredQuotes} />

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro, email, nom, prénom, téléphone, raison sociale..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-2"
              />
            </div>

            {/* Status filter */}
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filtrer par statut" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      Tous les devis
                    </div>
                  </SelectItem>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                      Brouillons
                    </div>
                  </SelectItem>
                  <SelectItem value="validated">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Validés
                    </div>
                  </SelectItem>
                  <SelectItem value="sent">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      Envoyés
                    </div>
                  </SelectItem>
                  <SelectItem value="accepted">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                      Acceptés
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      Refusés
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre par date */}
            <div className="w-full md:w-64">
              <Select value={dateFilter} onValueChange={(value) => {
                setDateFilter(value);
                if (value !== 'custom') {
                  setCustomDateRange({ from: undefined, to: undefined });
                }
              }}>
                <SelectTrigger className="h-12 border-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="Filtrer par date" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Toutes les dates
                    </div>
                  </SelectItem>
                  <SelectItem value="today">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Aujourd'hui
                    </div>
                  </SelectItem>
                  <SelectItem value="week">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Cette semaine
                    </div>
                  </SelectItem>
                  <SelectItem value="month">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ce mois
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="h-4 w-4" />
                      Plage personnalisée
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sélecteur de plage personnalisée */}
          {dateFilter === 'custom' && (
            <div className="flex justify-start">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 border-2">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    {customDateRange.from && customDateRange.to ? (
                      <>
                        {format(customDateRange.from, 'dd/MM/yyyy', { locale: fr })} - {format(customDateRange.to, 'dd/MM/yyyy', { locale: fr })}
                      </>
                    ) : (
                      'Sélectionner les dates'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: customDateRange.from,
                      to: customDateRange.to,
                    }}
                    onSelect={(range) => {
                      setCustomDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    numberOfMonths={2}
                    locale={fr}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Indicateur de résultats */}
          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
              <span className="font-semibold text-muted-foreground">
                {filteredQuotes.length} résultat{filteredQuotes.length !== 1 ? 's' : ''} trouvé{filteredQuotes.length !== 1 ? 's' : ''}
              </span>
              
              {/* Afficher les filtres actifs */}
              <div className="flex items-center gap-2 flex-wrap">
                {statusFilter !== 'all' && (
                  <Badge variant="outline" className="gap-1">
                    Statut: {statusConfig[statusFilter]?.label || statusFilter}
                  </Badge>
                )}
                {dateFilter !== 'all' && (
                  <Badge variant="outline" className="gap-1">
                    {dateFilter === 'today' && 'Aujourd\'hui'}
                    {dateFilter === 'week' && 'Cette semaine'}
                    {dateFilter === 'month' && 'Ce mois'}
                    {dateFilter === 'custom' && customDateRange.from && customDateRange.to && (
                      `${format(customDateRange.from, 'dd/MM/yy', { locale: fr })} - ${format(customDateRange.to, 'dd/MM/yy', { locale: fr })}`
                    )}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="outline" className="gap-1">
                    Recherche: "{searchTerm}"
                  </Badge>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                  setCustomDateRange({ from: undefined, to: undefined });
                }}
                className="h-8"
              >
                Réinitialiser tous les filtres
              </Button>
            </div>
          )}
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
                  <TableHead>PDF</TableHead>
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
                          <span className="truncate max-w-[150px]">{quote.clients?.email || 'N/A'}</span>
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
                      {quote.service_type || 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {quote.price_total ? `${quote.price_total.toFixed(2)} €` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {quote.pdf_url ? (
                        <div className="flex items-center gap-2">
                          <a 
                            href={quote.pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            title="Télécharger le PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGeneratePDF(quote.id)}
                            title="Régénérer le PDF"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleGeneratePDF(quote.id)}
                          title="Générer le PDF"
                        >
                          <FilePlus className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (quote.pdf_url) {
                              window.open(quote.pdf_url, '_blank', 'noopener,noreferrer');
                            } else {
                              toast({
                                title: "PDF non disponible",
                                description: "Le PDF du devis n'a pas encore été généré.",
                                variant: "destructive",
                              });
                            }
                          }}
                          title="Ouvrir le PDF"
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
