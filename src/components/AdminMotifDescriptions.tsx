import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Save, Trash2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MotifDescription {
  id: string;
  motif: string;
  description: string;
}

export const AdminMotifDescriptions = () => {
  const [motifDescriptions, setMotifDescriptions] = useState<MotifDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMotif, setEditingMotif] = useState<MotifDescription | null>(null);
  const [newMotif, setNewMotif] = useState({ motif: '', description: '' });
  const { toast } = useToast();

  const loadMotifDescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('motif_descriptions')
        .select('*')
        .order('motif', { ascending: true });

      if (error) throw error;
      setMotifDescriptions(data || []);
    } catch (error) {
      console.error('Error loading motif descriptions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les descriptions de motifs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMotifDescriptions();
  }, []);

  const handleSaveNew = async () => {
    if (!newMotif.motif || !newMotif.description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('motif_descriptions')
        .insert([{ motif: newMotif.motif, description: newMotif.description }]);

      if (error) throw error;

      toast({
        title: "Ajouté",
        description: "La description a été ajoutée avec succès.",
      });

      setNewMotif({ motif: '', description: '' });
      loadMotifDescriptions();
    } catch (error) {
      console.error('Error adding motif description:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la description.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, motif: string, description: string) => {
    try {
      const { error } = await supabase
        .from('motif_descriptions')
        .update({ motif, description })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Mis à jour",
        description: "La description a été mise à jour avec succès.",
      });

      setEditingMotif(null);
      loadMotifDescriptions();
    } catch (error) {
      console.error('Error updating motif description:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la description.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette description ?")) return;

    try {
      const { error } = await supabase
        .from('motif_descriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Supprimé",
        description: "La description a été supprimée avec succès.",
      });

      loadMotifDescriptions();
    } catch (error) {
      console.error('Error deleting motif description:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la description.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Descriptions de Motifs</h2>
          <p className="text-sm text-muted-foreground">
            Configurez les descriptions qui apparaîtront sur les devis selon le motif sélectionné
          </p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Liste des motifs</TabsTrigger>
          <TabsTrigger value="add">Ajouter un motif</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {motifDescriptions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Aucune description de motif configurée.</p>
            </Card>
          ) : (
            motifDescriptions.map((item) => (
              <Card key={item.id} className="p-4">
                {editingMotif?.id === item.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`edit-motif-${item.id}`}>Motif</Label>
                      <Input
                        id={`edit-motif-${item.id}`}
                        value={editingMotif.motif}
                        onChange={(e) =>
                          setEditingMotif({ ...editingMotif, motif: e.target.value })
                        }
                        placeholder="Ex: Vitre cassée"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-desc-${item.id}`}>Description (apparaîtra sur le devis)</Label>
                      <Textarea
                        id={`edit-desc-${item.id}`}
                        value={editingMotif.description}
                        onChange={(e) =>
                          setEditingMotif({ ...editingMotif, description: e.target.value })
                        }
                        placeholder="Ex: REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleUpdate(item.id, editingMotif.motif, editingMotif.description)
                        }
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingMotif(null)}
                        size="sm"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.motif}</h3>
                      <p className="text-sm text-muted-foreground italic">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMotif(item)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-motif">Motif</Label>
                <Input
                  id="new-motif"
                  value={newMotif.motif}
                  onChange={(e) => setNewMotif({ ...newMotif, motif: e.target.value })}
                  placeholder="Ex: Vitre cassée"
                />
              </div>
              <div>
                <Label htmlFor="new-description">Description (apparaîtra sur le devis)</Label>
                <Textarea
                  id="new-description"
                  value={newMotif.description}
                  onChange={(e) => setNewMotif({ ...newMotif, description: e.target.value })}
                  placeholder="Ex: REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cette description apparaîtra sous la ligne "Déplacement" dans le devis PDF
                </p>
              </div>
              <Button onClick={handleSaveNew}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter ce motif
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
