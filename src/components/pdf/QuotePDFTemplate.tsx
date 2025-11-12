import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed (optional)
// Font.register({ family: 'Roboto', src: 'path/to/font.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2563eb',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    color: '#333333',
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableCol1: {
    width: '35%',
  },
  tableCol2: {
    width: '20%',
  },
  tableCol3: {
    width: '10%',
  },
  tableCol4: {
    width: '15%',
  },
  tableCol5: {
    width: '20%',
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 5,
    minWidth: 250,
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 11,
  },
  totalValue: {
    fontSize: 11,
  },
  finalTotalRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2px solid #2563eb',
    minWidth: 250,
    justifyContent: 'space-between',
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  footer: {
    marginTop: 40,
    fontSize: 9,
    color: '#666666',
  },
  footerText: {
    marginBottom: 3,
  },
  interventionAddress: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: '1px solid #ddd',
  },
  interventionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export interface QuotePDFData {
  quoteNumber: string;
  date: string;
  civilite: string;
  nom: string;
  raison_sociale?: string;
  nomSociete?: string;
  telephone: string;
  email: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  differentInterventionAddress?: boolean;
  interventionAdresse?: string;
  interventionCodePostal?: string;
  interventionVille?: string;
  object: string;
  largeur: string;
  hauteur: string;
  quantite: string;
  vitrage: string;
  priceCalculation: {
    subtotal: number;
    tva: number;
    total: number;
    tvaRate: number;
    details: {
      deplacement?: { total: number };
      vitrage?: { total: number };
      livraison?: { total: number };
      main_oeuvre?: { total: number };
      securite?: { total: number };
      surface?: { totale: number };
    };
  };
}

export const QuotePDFTemplate = ({ data }: { data: QuotePDFData }) => {
  const { priceCalculation } = data;
  const subtotal = priceCalculation?.subtotal ?? 0;
  const tva = priceCalculation?.tva ?? 0;
  const total = priceCalculation?.total ?? 0;
  const tvaRate = priceCalculation?.tvaRate ?? 0.2;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DEVIS</Text>
          <Text style={styles.companyName}>SecuryGlass</Text>
          <Text style={styles.tagline}>Glass for your security</Text>
        </View>

        {/* Quote Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro de devis:</Text>
            <Text style={styles.value}>{data.quoteNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {data.civilite} {data.nom}
          </Text>
          {(data.raison_sociale || data.nomSociete) && (
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {data.raison_sociale || data.nomSociete}
            </Text>
          )}
          <Text style={styles.value}>{data.telephone}</Text>
          <Text style={styles.value}>{data.email}</Text>
          {data.adresse && <Text style={styles.value}>{data.adresse}</Text>}
          {data.codePostal && data.ville && (
            <Text style={styles.value}>
              {data.codePostal} {data.ville}
            </Text>
          )}

          {data.differentInterventionAddress && (
            <View style={styles.interventionAddress}>
              <Text style={styles.interventionTitle}>Adresse d'intervention</Text>
              {data.interventionAdresse && (
                <Text style={styles.value}>{data.interventionAdresse}</Text>
              )}
              {data.interventionCodePostal && data.interventionVille && (
                <Text style={styles.value}>
                  {data.interventionCodePostal} {data.interventionVille}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entreprise</Text>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Securyglass France</Text>
          <Text style={styles.value}>contact@securyglass.fr</Text>
          <Text style={styles.value}>09 70 144 344</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Désignation</Text>
            <Text style={styles.tableCol2}>Dimensions</Text>
            <Text style={styles.tableCol3}>Quantité</Text>
            <Text style={styles.tableCol4}>Prix unitaire</Text>
            <Text style={styles.tableCol5}>Total</Text>
          </View>

          {/* Déplacement */}
          {(priceCalculation?.details?.deplacement?.total ?? 0) > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCol1}>Déplacement</Text>
              <Text style={styles.tableCol2}>-</Text>
              <Text style={styles.tableCol3}>1</Text>
              <Text style={styles.tableCol4}>
                {((priceCalculation?.details?.deplacement?.total ?? 0) / parseInt(data.quantite || '1')).toFixed(2)}€
              </Text>
              <Text style={styles.tableCol5}>
                {(priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)}€
              </Text>
            </View>
          )}

          {/* Vitrage */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>{data.object}</Text>
            <Text style={styles.tableCol2}>
              {data.largeur} × {data.hauteur} cm
            </Text>
            <Text style={styles.tableCol3}>{data.quantite}</Text>
            <Text style={styles.tableCol4}>Vitrage {data.vitrage}</Text>
            <Text style={styles.tableCol5}>
              {(priceCalculation?.details?.vitrage?.total ?? 0).toFixed(2)}€
            </Text>
          </View>

          {/* Livraison */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>Livraison</Text>
            <Text style={styles.tableCol2}>-</Text>
            <Text style={styles.tableCol3}>1</Text>
            <Text style={styles.tableCol4}>
              {((priceCalculation?.details?.livraison?.total ?? 0) / parseInt(data.quantite || '1')).toFixed(2)}€
            </Text>
            <Text style={styles.tableCol5}>
              {(priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)}€
            </Text>
          </View>

          {/* Main d'œuvre */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>Main d'œuvre</Text>
            <Text style={styles.tableCol2}>
              {priceCalculation?.details?.surface?.totale?.toFixed(2) ?? '0.00'} m²
            </Text>
            <Text style={styles.tableCol3}>1</Text>
            <Text style={styles.tableCol4}>
              {((priceCalculation?.details?.main_oeuvre?.total ?? 0) / parseInt(data.quantite || '1')).toFixed(2)}€
            </Text>
            <Text style={styles.tableCol5}>
              {(priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)}€
            </Text>
          </View>

          {/* Mise en sécurité */}
          {(priceCalculation?.details?.securite?.total ?? 0) > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCol1}>Mise en sécurité</Text>
              <Text style={styles.tableCol2}>-</Text>
              <Text style={styles.tableCol3}>1</Text>
              <Text style={styles.tableCol4}>
                {((priceCalculation?.details?.securite?.total ?? 0) / parseInt(data.quantite || '1')).toFixed(2)}€
              </Text>
              <Text style={styles.tableCol5}>
                {(priceCalculation?.details?.securite?.total ?? 0).toFixed(2)}€
              </Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total HT:</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)}€</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({Math.round(tvaRate * 100)}%):</Text>
            <Text style={styles.totalValue}>{tva.toFixed(2)}€</Text>
          </View>
          <View style={styles.finalTotalRow}>
            <Text style={styles.finalTotalLabel}>Total TTC:</Text>
            <Text style={styles.finalTotalValue}>{total.toFixed(2)}€</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            * Prix indicatif, devis définitif après visite technique
          </Text>
          <Text style={styles.footerText}>
            Ce devis est valable 30 jours à compter de la date d'émission.
          </Text>
          <Text style={styles.footerText}>Merci de votre confiance.</Text>
        </View>
      </Page>
    </Document>
  );
};
