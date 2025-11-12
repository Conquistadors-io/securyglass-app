import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

interface AdminTab {
  id: string;
  title: string;
  key: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  is_system: boolean;
}

export const AdminTabsManager = () => {
  const [tabs, setTabs] = useState<AdminTab[]>([]);
  const [newTab, setNewTab] = useState({ title: '', key: '', icon: 'FileText' });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTabs();
  }, []);

  const fetchTabs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_tabs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTabs(data || []);
    } catch (error) {
      console.error('Error fetching tabs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les onglets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTab = async () => {
    if (!newTab.title || !newTab.key) {
      toast({
        title: "Erreur",
        description: "Le titre et la clé sont requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrder = Math.max(...tabs.map(t => t.display_order), -1);
      
      const { error } = await supabase
        .from('admin_tabs')
        .insert({
          title: newTab.title,
          key: newTab.key,
          icon: newTab.icon,
          display_order: maxOrder + 1,
          is_active: true,
          is_system: false,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Onglet ajouté avec succès.",
      });

      setNewTab({ title: '', key: '', icon: 'FileText' });
      fetchTabs();
    } catch (error: any) {
      console.error('Error adding tab:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'onglet.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTab = async (id: string, isSystem: boolean) => {
    if (isSystem) {
      toast({
        title: "Action non autorisée",
        description: "Les onglets système ne peuvent pas être supprimés.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_tabs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Onglet supprimé avec succès.",
      });

      fetchTabs();
    } catch (error) {
      console.error('Error deleting tab:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'onglet.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTab = async (id: string, updates: Partial<AdminTab>) => {
    try {
      const { error } = await supabase
        .from('admin_tabs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Onglet mis à jour.",
      });

      fetchTabs();
    } catch (error) {
      console.error('Error updating tab:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'onglet.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display_order for all tabs
    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index,
    }));

    setTabs(items);

    try {
      for (const update of updates) {
        await supabase
          .from('admin_tabs')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({
        title: "Succès",
        description: "Ordre des onglets mis à jour.",
      });
    } catch (error) {
      console.error('Error reordering tabs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les onglets.",
        variant: "destructive",
      });
      fetchTabs(); // Reload on error
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Nouvel Onglet</CardTitle>
          <CardDescription>Créez un nouvel onglet personnalisé pour le menu admin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-title">Titre</Label>
              <Input
                id="new-title"
                value={newTab.title}
                onChange={(e) => setNewTab({ ...newTab, title: e.target.value })}
                placeholder="Nom de l'onglet"
              />
            </div>
            <div>
              <Label htmlFor="new-key">Clé (unique)</Label>
              <Input
                id="new-key"
                value={newTab.key}
                onChange={(e) => setNewTab({ ...newTab, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="cle-unique"
              />
            </div>
            <div>
              <Label htmlFor="new-icon">Icône (Lucide)</Label>
              <Input
                id="new-icon"
                value={newTab.icon}
                onChange={(e) => setNewTab({ ...newTab, icon: e.target.value })}
                placeholder="FileText"
              />
            </div>
          </div>
          <Button onClick={handleAddTab} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gérer les Onglets</CardTitle>
          <CardDescription>Réorganisez, modifiez ou supprimez les onglets existants</CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tabs">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {tabs.map((tab, index) => (
                    <Draggable key={tab.id} draggableId={tab.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-4 p-4 border rounded-lg bg-card"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          </div>
                          
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <Input
                              value={tab.title}
                              onChange={(e) => handleUpdateTab(tab.id, { title: e.target.value })}
                              placeholder="Titre"
                            />
                            <Input
                              value={tab.key}
                              disabled
                              className="bg-muted"
                            />
                            <Input
                              value={tab.icon}
                              onChange={(e) => handleUpdateTab(tab.id, { icon: e.target.value })}
                              placeholder="Icône"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={tab.is_active}
                              onCheckedChange={(checked) => handleUpdateTab(tab.id, { is_active: checked })}
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTab(tab.id, tab.is_system)}
                              disabled={tab.is_system}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};
