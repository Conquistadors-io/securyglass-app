import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateDevis } from "@/services/devis";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";

interface QuoteEditProps {
  quote: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AdminQuoteEdit = ({ quote, open, onOpenChange, onSuccess }: QuoteEditProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client_email: '',
    service_type: '',
    object: '',
    property: '',
    motif: '',
    category: '',
    vitrage: '',
    largeur_cm: '',
    hauteur_cm: '',
    quantite: '1',
    assurance: '',
    intervention_adresse: '',
    intervention_code_postal: '',
    intervention_ville: '',
    notes: '',
    price_subtotal: '',
    price_tva: '',
    price_tva_rate: '10',
    price_total: '',
    status: 'draft',
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        client_email: quote.client_email || '',
        service_type: quote.service_type || '',
        object: quote.object || '',
        property: quote.property || '',
        motif: quote.motif || '',
        category: quote.category || '',
        vitrage: quote.vitrage || '',
        largeur_cm: quote.largeur_cm?.toString() || '',
        hauteur_cm: quote.hauteur_cm?.toString() || '',
        quantite: quote.quantite?.toString() || '1',
        assurance: quote.assurance || '',
        intervention_adresse: quote.intervention_adresse || '',
        intervention_code_postal: quote.intervention_code_postal || '',
        intervention_ville: quote.intervention_ville || '',
        notes: quote.notes || '',
        price_subtotal: quote.price_subtotal?.toString() || '',
        price_tva: quote.price_tva?.toString() || '',
        price_tva_rate: quote.price_tva_rate?.toString() || '10',
        price_total: quote.price_total?.toString() || '',
        status: quote.status || 'draft',
      });
    }
  }, [quote]);

  const handleRegeneratePDF = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Génération du PDF",
        description: "Régénération en cours...",
      });

      const { data, error } = await supabase.functions.invoke(
        'generate-store-quote-pdf',
        { body: { quoteId: quote.id } }
      );

      if (error) throw error;

      toast({
        title: "Succès",
        description: "PDF régénéré avec succès",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error regenerating PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de régénérer le PDF",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedData: any = {
        client_email: formData.client_email,
        service_type: formData.service_type,
        object: formData.object,
        quantite: parseInt(formData.quantite),
        status: formData.status,
      };

      if (formData.property) updatedData.property = formData.property;
      if (formData.motif) updatedData.motif = formData.motif;
      if (formData.category) updatedData.category = formData.category;
      if (formData.vitrage) updatedData.vitrage = formData.vitrage;
      if (formData.largeur_cm) updatedData.largeur_cm = parseFloat(formData.largeur_cm);
      if (formData.hauteur_cm) updatedData.hauteur_cm = parseFloat(formData.hauteur_cm);
      if (formData.assurance) updatedData.assurance = formData.assurance;
      if (formData.intervention_adresse) updatedData.intervention_adresse = formData.intervention_adresse;
      if (formData.intervention_code_postal) updatedData.intervention_code_postal = formData.intervention_code_postal;
      if (formData.intervention_ville) updatedData.intervention_ville = formData.intervention_ville;
      if (formData.notes) updatedData.notes = formData.notes;
      if (formData.price_subtotal) updatedData.price_subtotal = parseFloat(formData.price_subtotal);
      if (formData.price_tva) updatedData.price_tva = parseFloat(formData.price_tva);
      if (formData.price_tva_rate) updatedData.price_tva_rate = parseFloat(formData.price_tva_rate);
      if (formData.price_total) updatedData.price_total = parseFloat(formData.price_total);

      const result = await updateDevis(quote.id, updatedData);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      toast({
        title: "Devis mis à jour",
        description: "Le devis a été modifié avec succès.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour le devis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Modifier le devis {quote?.quote_number}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRegeneratePDF}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Régénérer le PDF
          </Button>
        </DialogTitle>
      </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations Client */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_email">Email *</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Caractéristiques Techniques */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Caractéristiques Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_type">Type de service *</Label>
                <Input
                  id="service_type"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="object">Objet *</Label>
                <Input
                  id="object"
                  value={formData.object}
                  onChange={(e) => setFormData({ ...formData, object: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property">Propriété</Label>
                <Input
                  id="property"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motif">Motif</Label>
                <Input
                  id="motif"
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitrage">Vitrage</Label>
                <Input
                  id="vitrage"
                  value={formData.vitrage}
                  onChange={(e) => setFormData({ ...formData, vitrage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="largeur_cm">Largeur (cm)</Label>
                <Input
                  id="largeur_cm"
                  type="number"
                  step="0.01"
                  value={formData.largeur_cm}
                  onChange={(e) => setFormData({ ...formData, largeur_cm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hauteur_cm">Hauteur (cm)</Label>
                <Input
                  id="hauteur_cm"
                  type="number"
                  step="0.01"
                  value={formData.hauteur_cm}
                  onChange={(e) => setFormData({ ...formData, hauteur_cm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantite">Quantité *</Label>
                <Input
                  id="quantite"
                  type="number"
                  value={formData.quantite}
                  onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assurance">Assurance</Label>
                <Input
                  id="assurance"
                  value={formData.assurance}
                  onChange={(e) => setFormData({ ...formData, assurance: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Adresse d'intervention */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Adresse d'intervention</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="intervention_adresse">Adresse</Label>
                <Input
                  id="intervention_adresse"
                  value={formData.intervention_adresse}
                  onChange={(e) => setFormData({ ...formData, intervention_adresse: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intervention_code_postal">Code postal</Label>
                <Input
                  id="intervention_code_postal"
                  value={formData.intervention_code_postal}
                  onChange={(e) => setFormData({ ...formData, intervention_code_postal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intervention_ville">Ville</Label>
                <Input
                  id="intervention_ville"
                  value={formData.intervention_ville}
                  onChange={(e) => setFormData({ ...formData, intervention_ville: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Tarification */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tarification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_subtotal">Sous-total HT</Label>
                <Input
                  id="price_subtotal"
                  type="number"
                  step="0.01"
                  value={formData.price_subtotal}
                  onChange={(e) => setFormData({ ...formData, price_subtotal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_tva_rate">Taux TVA (%)</Label>
                <Input
                  id="price_tva_rate"
                  type="number"
                  step="0.01"
                  value={formData.price_tva_rate}
                  onChange={(e) => setFormData({ ...formData, price_tva_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_tva">TVA</Label>
                <Input
                  id="price_tva"
                  type="number"
                  step="0.01"
                  value={formData.price_tva}
                  onChange={(e) => setFormData({ ...formData, price_tva: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_total">Total TTC</Label>
                <Input
                  id="price_total"
                  type="number"
                  step="0.01"
                  value={formData.price_total}
                  onChange={(e) => setFormData({ ...formData, price_total: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Statut</h3>
            <div className="space-y-2">
              <Label htmlFor="status">Statut du devis</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="validated">Validé</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                  <SelectItem value="accepted">Accepté</SelectItem>
                  <SelectItem value="rejected">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes internes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};