import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Edit, Eye, Copy, Plus, Code, Save, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  description: string;
  subject: string;
  html_content: string;
  variables: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    key: '',
    name: '',
    description: '',
    subject: '',
    html_content: '',
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as EmailTemplate[]);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erreur lors du chargement des templates');
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditForm({
      key: template.key,
      name: template.name,
      description: template.description || '',
      subject: template.subject,
      html_content: template.html_content,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          name: editForm.name,
          description: editForm.description,
          subject: editForm.subject,
          html_content: editForm.html_content,
        })
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast.success('Template mis à jour avec succès');
      setIsEditModalOpen(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Template ${!currentStatus ? 'activé' : 'désactivé'}`);
      loadTemplates();
    } catch (error) {
      console.error('Error toggling template:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const replaceVariables = (html: string, variables: Record<string, string>): string => {
    let result = html;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  };

  const sampleData = {
    client_name: "Jean Dupont",
    quote_number: "DEV-2024-001",
    service_type: "Remplacement vitre cassée",
    quote_amount: "450.00",
    validation_url: "https://votre-app.com/devis/valider?token=exemple",
    custom_message: "<p>Voici votre devis personnalisé.</p>",
    quote_html: "<div style='padding: 20px; background: #f9fafb;'>... HTML du devis ...</div>",
    quote_date: new Date().toLocaleDateString('fr-FR'),
  };

  const previewHtml = selectedTemplate 
    ? replaceVariables(selectedTemplate.html_content, sampleData)
    : '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates d'emails</h2>
          <p className="text-muted-foreground">Gérez les templates d'emails envoyés aux clients</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Clé</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {template.key}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {template.variables.slice(0, 3).map((variable, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {variable.name}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.variables.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={() => handleToggleActive(template.id, template.is_active)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(template)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Modifier le template</DialogTitle>
            <DialogDescription>
              Modifiez le contenu du template. Les variables sont au format {`{{variable_name}}`}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key">Clé technique (non modifiable)</Label>
                <Input
                  id="key"
                  value={editForm.key}
                  disabled
                  className="font-mono bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom du template</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet de l'email</Label>
                <Input
                  id="subject"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="Ex: Votre devis {{quote_number}} - SecuryGlass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="html_content">Contenu HTML</Label>
                <Textarea
                  id="html_content"
                  value={editForm.html_content}
                  onChange={(e) => setEditForm({ ...editForm, html_content: e.target.value })}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              {selectedTemplate && (
                <div className="space-y-2">
                  <Label>Variables disponibles</Label>
                  <div className="flex gap-2 flex-wrap p-3 bg-muted rounded-md">
                    {selectedTemplate.variables.map((variable, idx) => (
                      <Badge key={idx} variant="secondary">
                        {`{{${variable.name}}}`}
                        {variable.required && <span className="text-red-500 ml-1">*</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Aperçu du template</DialogTitle>
            <DialogDescription>
              Aperçu avec des données d'exemple
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[70vh] border rounded-md">
            <div 
              className="p-4"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
