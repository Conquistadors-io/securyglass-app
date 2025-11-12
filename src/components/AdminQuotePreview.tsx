import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Eye, Download } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { QuotePDFTemplate } from './pdf/QuotePDFTemplate';
import type { QuotePDFData } from '@/lib/pdf-generator';

// Exemple de données de devis
const sampleQuoteData: QuotePDFData = {
  quoteNumber: "DV212200",
  date: "19/03/2025",
  civilite: "Monsieur",
  nom: "VUILLERMET Bernard",
  adresse: "111 Rue Edouard Tremblay",
  codePostal: "94400",
  ville: "Vitry-sur-Seine",
  telephone: "06 79 73 38 47",
  email: "bernard.vuillermet@orange.fr",
  object: "REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE",
  largeur: "800",
  hauteur: "600",
  quantite: "1",
  vitrage: "VERRE IMPRIMÉ LISTRAL 130",
  vitrageDetails: {
    type: "VERRE IMPRIMÉ LISTRAL 130",
    epaisseur: "4 mm",
    normes: "RT 2020"
  },
  priceCalculation: {
    subtotal: 193.29,
    tva: 19.33,
    total: 212.62,
    tvaRate: 10,
    details: {}
  },
  motifDescription: "REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRIS DE GLACE"
};

export const AdminQuotePreview = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [quoteData, setQuoteData] = useState<QuotePDFData>(sampleQuoteData);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Aperçu PDF des Devis
            </h2>
            <p className="text-sm text-muted-foreground">
              Visualisez le rendu PDF de vos devis avant de les envoyer aux clients.
              Vous pouvez utiliser les données d'exemple ou modifier les informations ci-dessous.
            </p>
          </div>
        </div>

        {/* Formulaire rapide pour modifier les données */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="quoteNumber">Numéro de devis</Label>
            <Input
              id="quoteNumber"
              value={quoteData.quoteNumber}
              onChange={(e) => setQuoteData({ ...quoteData, quoteNumber: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="clientName">Nom du client</Label>
            <Input
              id="clientName"
              value={quoteData.nom}
              onChange={(e) => setQuoteData({ ...quoteData, nom: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email du client</Label>
            <Input
              id="clientEmail"
              value={quoteData.email}
              onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="total">Total TTC (€)</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              value={quoteData.priceCalculation.total}
              onChange={(e) => setQuoteData({ 
                ...quoteData, 
                priceCalculation: { 
                  ...quoteData.priceCalculation, 
                  total: parseFloat(e.target.value) || 0 
                } 
              })}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}
          </Button>
          
          <PDFDownloadLink
            document={<QuotePDFTemplate data={quoteData} />}
            fileName={`Devis-${quoteData.quoteNumber}.pdf`}
          >
            {({ loading }) => (
              <Button variant="outline" disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Génération...' : 'Télécharger le PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </Card>

      {/* Aperçu PDF */}
      {showPreview && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Aperçu du PDF
          </h3>
          <div className="w-full" style={{ height: '800px' }}>
            <PDFViewer width="100%" height="100%" className="border rounded-lg">
              <QuotePDFTemplate data={quoteData} />
            </PDFViewer>
          </div>
        </Card>
      )}
    </div>
  );
};
