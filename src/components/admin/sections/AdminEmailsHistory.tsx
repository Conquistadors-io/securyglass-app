import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, Mail, Search, Filter, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmailSent {
  id: string;
  template_key: string;
  devis_id: string | null;
  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  html_content: string;
  variables_data: any;
  sendgrid_message_id: string | null;
  status: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  error_message: string | null;
  devis?: {
    quote_number: string;
  };
}

interface Stats {
  total: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
}

export const AdminEmailsHistory = () => {
  const [emails, setEmails] = useState<EmailSent[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    failed: 0,
  });
  const [selectedEmail, setSelectedEmail] = useState<EmailSent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('emails_sent')
        .select(`
          *,
          devis (
            quote_number
          )
        `)
        .order('sent_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setEmails(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading emails:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    }
  };

  const calculateStats = (emailsList: EmailSent[]) => {
    const stats: Stats = {
      total: emailsList.length,
      sent: emailsList.filter(e => e.status === 'sent').length,
      delivered: emailsList.filter(e => e.status === 'delivered').length,
      opened: emailsList.filter(e => e.opened_at).length,
      clicked: emailsList.filter(e => e.clicked_at).length,
      bounced: emailsList.filter(e => e.status === 'bounced').length,
      failed: emailsList.filter(e => e.status === 'failed').length,
    };
    setStats(stats);
  };

  const handleViewEmail = (email: EmailSent) => {
    setSelectedEmail(email);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status: string, email: EmailSent) => {
    if (email.bounced_at) return <Badge variant="destructive">Rejeté</Badge>;
    if (email.clicked_at) return <Badge className="bg-green-700">Cliqué</Badge>;
    if (email.opened_at) return <Badge className="bg-yellow-600">Ouvert</Badge>;
    if (status === 'delivered') return <Badge className="bg-green-500">Délivré</Badge>;
    if (status === 'sent') return <Badge className="bg-blue-500">Envoyé</Badge>;
    if (status === 'failed') return <Badge variant="destructive">Échec</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.devis?.quote_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Historique des emails</h2>
        <p className="text-muted-foreground">Tous les emails envoyés aux clients via le système</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Délivrés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.delivered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ouverts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.opened}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cliqués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.clicked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejetés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.bounced}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Échecs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par email, nom, devis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="sent">Envoyés</SelectItem>
            <SelectItem value="delivered">Délivrés</SelectItem>
            <SelectItem value="bounced">Rejetés</SelectItem>
            <SelectItem value="failed">Échecs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredEmails.length} résultat{filteredEmails.length > 1 ? 's' : ''} trouvé{filteredEmails.length > 1 ? 's' : ''}
      </div>

      {/* Emails Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Devis</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(email.sent_at).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{email.recipient_name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{email.recipient_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {email.template_key}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {email.devis?.quote_number || '-'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                  <TableCell>
                    {getStatusBadge(email.status, email)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewEmail(email)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Email Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Détails de l'email</DialogTitle>
            <DialogDescription>
              Informations et contenu de l'email envoyé
            </DialogDescription>
          </DialogHeader>

          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Destinataire:</span> {selectedEmail.recipient_name || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {selectedEmail.recipient_email}
                </div>
                <div>
                  <span className="font-semibold">Template:</span> {selectedEmail.template_key}
                </div>
                <div>
                  <span className="font-semibold">Devis:</span> {selectedEmail.devis?.quote_number || '-'}
                </div>
                <div>
                  <span className="font-semibold">Envoyé le:</span> {new Date(selectedEmail.sent_at).toLocaleString('fr-FR')}
                </div>
                <div>
                  <span className="font-semibold">Statut:</span> {getStatusBadge(selectedEmail.status, selectedEmail)}
                </div>
                {selectedEmail.opened_at && (
                  <div>
                    <span className="font-semibold">Ouvert le:</span> {new Date(selectedEmail.opened_at).toLocaleString('fr-FR')}
                  </div>
                )}
                {selectedEmail.clicked_at && (
                  <div>
                    <span className="font-semibold">Cliqué le:</span> {new Date(selectedEmail.clicked_at).toLocaleString('fr-FR')}
                  </div>
                )}
                {selectedEmail.sendgrid_message_id && (
                  <div className="col-span-2">
                    <span className="font-semibold">Message ID SendGrid:</span> 
                    <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">{selectedEmail.sendgrid_message_id}</code>
                  </div>
                )}
              </div>

              <div>
                <div className="font-semibold mb-2">Sujet:</div>
                <div className="text-sm bg-muted p-2 rounded">{selectedEmail.subject}</div>
              </div>

              <div>
                <div className="font-semibold mb-2">Contenu HTML:</div>
                <ScrollArea className="h-[400px] border rounded-md">
                  <div 
                    className="p-4"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html_content }}
                  />
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
