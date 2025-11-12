import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Logo SecuryGlass en base64 (à partir de src/assets/securyglass-logo.png)
// Note: Remplacer par la vraie conversion base64 si nécessaire
const LOGO_SECURYGLASS = '/src/assets/securyglass-logo.png';

// Logo certification en base64 (à partir de src/assets/certification-qualite.jpg)
const LOGO_CERTIFICATION = '/src/assets/certification-qualite.jpg';

// Couleurs de marque
const COLORS = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  secondary: '#f9fafb',
  text: '#333333',
  textMuted: '#666666',
  border: '#e5e7eb',
  white: '#ffffff',
  tableAlt: '#fafbfc',
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.text,
    position: 'relative',
  },
  
  // Header avec 2 colonnes
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: `2px solid ${COLORS.primary}`,
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  logoCertification: {
    width: 60,
    height: 80,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  companySlogan: {
    fontSize: 9,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  devisTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'right',
  },
  siegeTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textMuted,
    marginBottom: 5,
    textAlign: 'right',
  },
  companyInfo: {
    fontSize: 9,
    color: COLORS.text,
    textAlign: 'right',
    lineHeight: 1.4,
  },
  companyInfoLine: {
    marginBottom: 2,
  },
  
  // Section client
  clientSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  clientTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  clientInfo: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  clientLine: {
    marginBottom: 3,
  },
  clientLabel: {
    fontFamily: 'Helvetica-Bold',
    marginRight: 5,
  },
  
  // Tableau
  table: {
    marginTop: 15,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${COLORS.border}`,
    minHeight: 30,
  },
  tableRowAlt: {
    backgroundColor: COLORS.tableAlt,
  },
  tableCell: {
    fontSize: 9,
    padding: 8,
    justifyContent: 'center',
  },
  tableCellMultiLine: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  
  // Colonnes du tableau
  colDesignation: { width: '60%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  
  // Lignes de description détaillée
  descriptionMain: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  descriptionDetail: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginBottom: 1,
  },
  
  // Section totaux
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    fontSize: 10,
    textAlign: 'right',
  },
  finalTotalRow: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginTop: 5,
  },
  finalTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  finalTotalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  
  // Footer
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerSection: {
    marginBottom: 12,
  },
  footerTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  footerText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: COLORS.text,
  },
  footerTextSmall: {
    fontSize: 7,
    lineHeight: 1.4,
    color: COLORS.textMuted,
  },
  ribBox: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  ribTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  ribLine: {
    fontSize: 8,
    marginBottom: 2,
  },
  signatureLine: {
    marginTop: 30,
    borderTop: `1px solid ${COLORS.text}`,
    width: 150,
    paddingTop: 5,
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    opacity: 0.03,
    fontSize: 100,
    color: COLORS.primary,
    transform: 'rotate(-45deg)',
  },
});

export interface QuotePDFData {
  quoteNumber: string;
  date: string;
  
  // Client info
  civilite: string;
  nom: string;
  raison_sociale?: string;
  nomSociete?: string;
  telephone: string;
  email: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  
  // Intervention address (if different)
  differentInterventionAddress?: boolean;
  interventionAdresse?: string;
  interventionCodePostal?: string;
  interventionVille?: string;
  
  // Vitrage details
  object: string;
  largeur: string;
  hauteur: string;
  quantite: string;
  vitrage: string;
  
  // Détails techniques du vitrage
  vitrageDetails?: {
    type: string;
    epaisseur: string;
    normes: string;
  };
  
  // Délai
  delai?: string;
  
  // Price calculation
  priceCalculation: {
    subtotal: number;
    tva: number;
    total: number;
    tvaRate: number;
    details: any;
  };
  
  // Company info
  companyInfo?: {
    siret: string;
    tva: string;
    codeAPE: string;
    capital?: string;
    rcs?: string;
    address: string;
    iban: string;
    bic: string;
  };
}

export const QuotePDFTemplate = ({ data }: { data: QuotePDFData }) => {
  const subtotal = data.priceCalculation?.subtotal ?? 0;
  const tva = data.priceCalculation?.tva ?? 0;
  const total = data.priceCalculation?.total ?? 0;
  const tvaRate = data.priceCalculation?.tvaRate ?? 0.2;
  
  // Informations entreprise par défaut
  const companyInfo = data.companyInfo || {
    siret: '91094284600015',
    tva: 'FR2091094282846',
    codeAPE: '6201Z',
    capital: '10000',
    rcs: 'Nanterre',
    address: '65 Rue De La Croix - 92000 Nanterre',
    iban: 'FR76 1020 7000 0123 2145 6187 131',
    bic: 'CCBPFRPMTG',
  };
  
  // Détails vitrage par défaut
  const vitrageDetails = data.vitrageDetails || {
    type: 'Vitrage Feuilleté Sécurit CLR Transparent',
    epaisseur: 'EP10 55.2 mm',
    normes: 'Normes ERP - Normes EN 12600 / EN 356',
  };
  
  const delai = data.delai || '48H';
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark subtil */}
        <Text style={styles.watermark}>SecuryGlass</Text>
        
        {/* Header 2 colonnes */}
        <View style={styles.header}>
          {/* Colonne gauche: Logo + nom entreprise */}
          <View style={styles.headerLeft}>
            <Image src={LOGO_SECURYGLASS} style={styles.logo} />
            <Text style={styles.companyName}>securyglass</Text>
            <Text style={styles.companySlogan}>Glass for your security</Text>
          </View>
          
          {/* Colonne droite: Certification + Devis + Infos */}
          <View style={styles.headerRight}>
            <Image src={LOGO_CERTIFICATION} style={styles.logoCertification} />
            <Text style={styles.devisTitle}>Devis</Text>
            <Text style={styles.siegeTitle}>Siège social</Text>
            <View style={styles.companyInfo}>
              <Text style={styles.companyInfoLine}>Securyglass France</Text>
              <Text style={styles.companyInfoLine}>contact@securyglass.fr</Text>
              <Text style={styles.companyInfoLine}>09 70 144 344</Text>
              <Text style={styles.companyInfoLine}>Code APE {companyInfo.codeAPE}</Text>
              <Text style={styles.companyInfoLine}>Siret {companyInfo.siret}</Text>
              <Text style={styles.companyInfoLine}>TVA {companyInfo.tva}</Text>
            </View>
          </View>
        </View>
        
        {/* Section client */}
        <View style={styles.clientSection}>
          <Text style={styles.clientTitle}>Informations Client</Text>
          <View style={styles.clientInfo}>
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Devis N° :</Text>
              {data.quoteNumber}
            </Text>
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Date :</Text>
              {data.date}
            </Text>
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Client :</Text>
              {data.civilite} {data.nom}
            </Text>
            {(data.raison_sociale || data.nomSociete) && (
              <Text style={styles.clientLine}>
                <Text style={styles.clientLabel}>Société :</Text>
                {data.raison_sociale || data.nomSociete}
              </Text>
            )}
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Email :</Text>
              {data.email}
            </Text>
            <Text style={styles.clientLine}>
              <Text style={styles.clientLabel}>Téléphone :</Text>
              {data.telephone}
            </Text>
            {data.adresse && (
              <Text style={styles.clientLine}>
                <Text style={styles.clientLabel}>Adresse :</Text>
                {data.adresse}
              </Text>
            )}
            {data.codePostal && data.ville && (
              <Text style={styles.clientLine}>
                {data.codePostal} {data.ville}
              </Text>
            )}
            
            {data.differentInterventionAddress && data.interventionAdresse && (
              <>
                <Text style={[styles.clientLine, { marginTop: 8, fontFamily: 'Helvetica-Bold' }]}>
                  Adresse d'intervention :
                </Text>
                <Text style={styles.clientLine}>{data.interventionAdresse}</Text>
                {data.interventionCodePostal && data.interventionVille && (
                  <Text style={styles.clientLine}>
                    {data.interventionCodePostal} {data.interventionVille}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
        
        {/* Tableau détaillé */}
        <View style={styles.table}>
          {/* En-tête */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesignation]}>Désignation</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qté</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>P.U HT</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Montant</Text>
          </View>
          
          {/* Ligne 1: Déplacement */}
          {(data.priceCalculation?.details?.deplacement?.total ?? 0) > 0 && (
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.colDesignation, styles.tableCellMultiLine]}>
                <Text style={styles.descriptionMain}>
                  Déplacement / Constat des lieux / Prise de mesure
                </Text>
                <Text style={styles.descriptionDetail}>
                  REMPLACEMENT DE VITRAGE À L'IDENTIQUE SUITE À UN BRISE DE GLACE
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.colQty]}>1</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>
                {(data.priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)} €
              </Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {(data.priceCalculation?.details?.deplacement?.total ?? 0).toFixed(2)} €
              </Text>
            </View>
          )}
          
          {/* Ligne 2: Vitrage */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={[styles.tableCell, styles.colDesignation, styles.tableCellMultiLine]}>
              <Text style={styles.descriptionMain}>{vitrageDetails.type}</Text>
              <Text style={styles.descriptionDetail}>
                {data.largeur} × {data.hauteur} cm - {vitrageDetails.epaisseur}
              </Text>
              <Text style={styles.descriptionDetail}>{vitrageDetails.normes}</Text>
            </View>
            <Text style={[styles.tableCell, styles.colQty]}>{data.quantite}</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              {((data.priceCalculation?.details?.vitrage?.total ?? 0) / parseInt(data.quantite || '1')).toFixed(2)} €
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              {(data.priceCalculation?.details?.vitrage?.total ?? 0).toFixed(2)} €
            </Text>
          </View>
          
          {/* Ligne 3: Approvisionnement + Livraison */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.colDesignation, styles.tableCellMultiLine]}>
              <Text style={styles.descriptionMain}>Approvisionnement + Livraison sur site</Text>
              <Text style={styles.descriptionDetail}>Délai {delai}</Text>
            </View>
            <Text style={[styles.tableCell, styles.colQty]}>1</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              {(data.priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)} €
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              {(data.priceCalculation?.details?.livraison?.total ?? 0).toFixed(2)} €
            </Text>
          </View>
          
          {/* Ligne 4: Main d'œuvre */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={[styles.tableCell, styles.colDesignation, styles.tableCellMultiLine]}>
              <Text style={styles.descriptionMain}>Main d'œuvre</Text>
              <Text style={styles.descriptionDetail}>Dépose Vitrage Initial</Text>
              <Text style={styles.descriptionDetail}>REMPLACEMENT IDENTIQUE</Text>
              <Text style={styles.descriptionDetail}>Remise en état</Text>
            </View>
            <Text style={[styles.tableCell, styles.colQty]}>1</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              {(data.priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)} €
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              {(data.priceCalculation?.details?.main_oeuvre?.total ?? 0).toFixed(2)} €
            </Text>
          </View>
          
          {/* Ligne 5: Éco-enlèvement */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.colDesignation, styles.tableCellMultiLine]}>
              <Text style={styles.descriptionMain}>
                Éco-enlèvement / Nettoyage + Traitement déchets
              </Text>
              <Text style={styles.descriptionDetail}>INCLUS</Text>
            </View>
            <Text style={[styles.tableCell, styles.colQty]}>1</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>0,00 €</Text>
            <Text style={[styles.tableCell, styles.colTotal]}>0,00 €</Text>
          </View>
        </View>
        
        {/* Section totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({Math.round(tvaRate * 100)}%)</Text>
            <Text style={styles.totalValue}>{tva.toFixed(2)} €</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotalRow]}>
            <Text style={styles.finalTotalLabel}>Total TTC</Text>
            <Text style={styles.finalTotalValue}>{total.toFixed(2)} €</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          {/* Modalités de règlement */}
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Modalités de règlement :</Text>
            <Text style={styles.footerText}>
              Acompte de 50% après validation du devis, solde à payer fin de travaux
            </Text>
          </View>
          
          {/* Modes de paiement */}
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Modes de paiement :</Text>
            <Text style={styles.footerText}>
              1 - Espèces{'\n'}
              2 - Carte bancaire{'\n'}
              3 - Chèque libellé à l'ordre de SECURYGLASS{'\n'}
              4 - Virement bancaire :
            </Text>
          </View>
          
          {/* RIB */}
          <View style={[styles.footerSection, styles.ribBox]}>
            <Text style={styles.ribTitle}>RELEVÉ D'IDENTITÉ BANCAIRE</Text>
            <Text style={styles.ribLine}>Titulaire du compte :</Text>
            <Text style={styles.ribLine}>SAS SECURYGLASS</Text>
            <Text style={styles.ribLine}>IBAN : {companyInfo.iban}</Text>
            <Text style={styles.ribLine}>BIC / SWIFT : {companyInfo.bic}</Text>
          </View>
          
          {/* Mentions légales */}
          <View style={[styles.footerSection, { marginTop: 15 }]}>
            <Text style={styles.footerTextSmall}>
              La Société « Securyglass » conserve l'entière propriété du produit jusqu'au paiement intégral de la facture. 
              Dans le cas où celle-ci ne serait pas acquittée à la date prévue par les parties, la Société se réserve le droit 
              de reprendre le produit livré et de résoudre le contrat. Tout retard de paiement engendre une pénalité calculée 
              sur la base du taux d'intérêt légal en vigueur. SAS Securyglass - Siège Social - {companyInfo.address} - 
              SIREN 910942846 RCS {companyInfo.rcs}.
            </Text>
          </View>
          
          {/* Signature */}
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>SECURYGLASS</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
