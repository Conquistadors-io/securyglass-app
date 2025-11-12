import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
  
  // Quote info (before client section)
  quoteInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  quoteInfoLeft: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  quoteInfoRight: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
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
  
  // Page 2 & 3 styles
  page2Header: {
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  page2HeaderText: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  cgvMainTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 10,
  },
  cgvSection: {
    marginBottom: 10,
  },
  cgvSectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  cgvTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  cgvText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: COLORS.text,
    textAlign: 'justify',
  },
  cgvFooter: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: `1px solid ${COLORS.border}`,
  },
  cgvFooterText: {
    fontSize: 7,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 3,
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
  
  // Motif description (dynamic)
  motifDescription?: string;
  
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
  
  // Base64 encoded images (required for PDF generation)
  logoSecuryglass?: string;
  logoCertification?: string;
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
            {data.logoSecuryglass && <Image src={data.logoSecuryglass} style={styles.logo} />}
            <Text style={styles.companyName}>securyglass</Text>
            <Text style={styles.companySlogan}>Glass for your security</Text>
          </View>
          
          {/* Colonne droite: Certification + Devis + Infos */}
          <View style={styles.headerRight}>
            {data.logoCertification && <Image src={data.logoCertification} style={styles.logoCertification} />}
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
        
        {/* Quote info (before client section) */}
        <View style={styles.quoteInfo}>
          <Text style={styles.quoteInfoLeft}>Devis N° : {data.quoteNumber}</Text>
          <Text style={styles.quoteInfoRight}>Date : {data.date}</Text>
        </View>
        
        {/* Section client */}
        <View style={styles.clientSection}>
          <Text style={styles.clientTitle}>À : {data.civilite} {data.nom}</Text>
          <View style={styles.clientInfo}>
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
                  Déplacement / Constat des lieux / Prise de mesures
                </Text>
                {data.motifDescription && (
                  <Text style={styles.descriptionDetail}>
                    {data.motifDescription}
                  </Text>
                )}
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
              <Text style={styles.descriptionMain}>SAVE PLANET</Text>
              <Text style={styles.descriptionDetail}>
                Éco-enlèvement - Tri-sélectif - Recyclage
              </Text>
            </View>
            <Text style={[styles.tableCell, styles.colQty]}>1</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>0,00 €</Text>
            <Text style={[styles.tableCell, styles.colTotal]}>0,00 €</Text>
          </View>
        </View>
        
        {/* Section totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA 10 % ({subtotal.toFixed(2)} €)</Text>
            <Text style={styles.totalValue}>{tva.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total TTC</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
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
      
      {/* PAGE 2: Modalités et CGV (sections 1-5) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.page2Header}>
          <Text style={styles.page2HeaderText}>
            Devis {data.quoteNumber} - {data.date}
          </Text>
        </View>
        
        {/* Modalités de règlement */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvTitle}>Modalités de règlement</Text>
          <Text style={styles.cgvText}>
            Acompte de 50% à la validation du devis, solde à payer fin de travaux.
          </Text>
        </View>
        
        {/* Mode de règlement */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvTitle}>Mode de règlement :</Text>
          <Text style={styles.cgvText}>
            - Carte bancaire{'\n'}
            - Chèque libellé à l'ordre de SECURYGLASS{'\n'}
            - Numéraire ( Voir Article L112-6 Code Financier Monétaire ){'\n'}
            - Virement bancaire :
          </Text>
        </View>
        
        {/* RIB */}
        <View style={[styles.cgvSection, styles.ribBox]}>
          <Text style={styles.ribTitle}>RELEVÉ D'IDENTITÉ BANCAIRE</Text>
          <Text style={styles.ribLine}>Titulaire du compte : SAS SECURYGLASS</Text>
          <Text style={styles.ribLine}>Domiciliation : BPRIVES MONTROUGE</Text>
          <Text style={styles.ribLine}>IBAN : {companyInfo.iban}</Text>
          <Text style={styles.ribLine}>BIC / SWIFT : {companyInfo.bic}</Text>
        </View>
        
        {/* Conditions générales */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvMainTitle}>Conditions générales</Text>
        </View>
        
        {/* Section 1 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>1. CHAMP D'APPLICATION</Text>
          <Text style={styles.cgvText}>
            Les présentes conditions générales de vente (CGV) s'appliquent à toutes les prestations 
            de serrurerie, vitrerie, miroiterie, pose, réparation ou remplacement de produits, services, 
            prestations annexes, proposées par l'entreprise SECURYGLASS, auprès des particuliers et 
            professionnels (ERP, commerces, bureaux, etc...), en France métropolitaine.{'\n\n'}
            Toute commande implique l'adhésion pleine et entière du client aux présentes CGV.
          </Text>
        </View>
        
        {/* Section 2 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>2. DEVIS – COMMANDE</Text>
          <Text style={styles.cgvText}>
            Nos devis sont valables 3 mois à compter de leur date d'émission.{'\n\n'}
            La commande est considérée comme ferme et définitive dès réception de la mention 
            « Bon pour accord » par mail et, le cas échéant, du versement de l'acompte requis.{'\n\n'}
            Les devis sont établis sur la base des dimensions et informations communiquées par le client, 
            sous réserve de constat des lieux et mesures définitives. Toute erreur ou omission de sa part 
            engage sa responsabilité.
          </Text>
        </View>
        
        {/* Section 3 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>3. PAIEMENT</Text>
          <Text style={styles.cgvText}>
            Les prix sont exprimés en euros, hors taxes et toutes taxes comprises.{'\n\n'}
            Sauf conditions particulières, les prix incluent :{'\n'}
            - les déplacements et livraisons{'\n'}
            - la fourniture du ou des produits,{'\n'}
            - la dépose éventuelle et la pose,{'\n'}
            - l'éco-enlèvement et le recyclage.{'\n\n'}
            Le paiement s'effectue selon les modalités suivantes :{'\n'}
            - 50 % d'acompte à la commande,{'\n'}
            - 50 % à payer fin de travaux, sauf accord spécifique.{'\n\n'}
            L'entreprise SECURYGLASS conserve l'entière propriété du produit jusqu'à paiement intégral 
            de la facture. Dans le cas où celle-ci ne serait pas acquittée à la date prévue par les parties, 
            la Société se réserve le droit de reprendre le produit livré et de résoudre le contrat. 
            Tout retard de paiement entraîne l'application de pénalités calculées sur la base du taux 
            d'intérêt légal en vigueur (article D.441-5 du Code de commerce).
          </Text>
        </View>
        
        {/* Section 4 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>4. DÉLAIS D'INTERVENTION</Text>
          <Text style={styles.cgvText}>
            L'entreprise SECURYGLASS s'engage à intervenir dans le délai indiqué sur le devis à compter 
            de la validation de la commande (sous réserve de disponibilité du ou des produits).{'\n\n'}
            En cas de rupture de stock, le client sera immédiatement informé d'un délai estimatif de livraison.
          </Text>
        </View>
        
        {/* Section 5 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>5. ACCÈS AU CHANTIER</Text>
          <Text style={styles.cgvText}>
            Le client s'engage à assurer un accès sécurisé et dégagé à la zone d'intervention.{'\n\n'}
            L'entreprise SECURYGLASS ne pourra être tenue responsable d'un retard ou d'une impossibilité 
            d'exécution en cas d'obstacle physique ou d'environnement non conforme à la sécurité des techniciens.
          </Text>
        </View>
      </Page>
      
      {/* PAGE 3: CGV (sections 6-12) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.page2Header}>
          <Text style={styles.page2HeaderText}>
            Devis {data.quoteNumber} - {data.date}
          </Text>
        </View>
        
        {/* Section 6 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>6. GARANTIE – CONFORMITÉ</Text>
          <Text style={styles.cgvText}>
            Nos produits sont conformes aux normes françaises en vigueur : (Réglementation Thermique RT2012, 
            Réglementation Environnementale RE 2020, NF, CEKAL, etc...).{'\n\n'}
            Les prestations de pose bénéficient d'une garantie de 2 ans, à compter de la date de réalisation. 
            Cette garantie couvre uniquement les défauts de pose ou de fabrication, à l'exclusion des 
            détériorations causées par :{'\n'}
            - une mauvaise utilisation,{'\n'}
            - un choc extérieur,{'\n'}
            - un défaut d'entretien.{'\n\n'}
            Les défauts apparents doivent être signalés dans les 48 heures suivant la pose. 
            Passé ce délai, ils seront réputés acceptés.
          </Text>
        </View>
        
        {/* Section 7 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>7. RESPONSABILITÉ</Text>
          <Text style={styles.cgvText}>
            L'entreprise SECURYGLASS ne saurait être tenue responsable des dommages indirects ou immatériels 
            subis par le client (perte d'exploitation, de chiffre d'affaires, etc...). La responsabilité de 
            l'entreprise SECURYGLASS est strictement limitée au montant de la commande en cas de manquement avéré.
          </Text>
        </View>
        
        {/* Section 8 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>8. RÉTRACTATION (CLIENTS PARTICULIERS UNIQUEMENT)</Text>
          <Text style={styles.cgvText}>
            Conformément à l'article L.221-18 du Code de la consommation, le client particulier dispose 
            d'un délai de 14 jours calendaires pour exercer son droit de rétractation, sauf si la prestation 
            a été pleinement exécutée avec son accord avant la fin du délai de rétractation.{'\n\n'}
            Toute demande de rétractation doit être adressée par lettre recommandée avec accusé de réception à :{'\n\n'}
            SECURYGLASS – Service Client : 65 Rue De La Croix - 92000 Nanterre - Email : contact@securyglass.fr
          </Text>
        </View>
        
        {/* Section 9 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>9. ANNULATION DE COMMANDE</Text>
          <Text style={styles.cgvText}>
            Toute commande validée (devis signé et/ou acompte versé) est ferme et définitive. En cas 
            d'annulation à l'initiative du client, l'entreprise SECURYGLASS conservera l'acompte versé 
            à titre de dédommagement, en compensation des frais engagés, de la mobilisation des équipes 
            et des fournitures ou produits éventuellement commandés sur mesure.{'\n\n'}
            Aucune commande ne pourra être annulée après le début de la fabrication ou de l'intervention sur site.
          </Text>
        </View>
        
        {/* Section 10 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>10. RÉCLAMATIONS</Text>
          <Text style={styles.cgvText}>
            Toute réclamation doit être formulée par écrit (mail ou courrier recommandé) dans un délai 
            de 48 heures suivant l'intervention. Au-delà, les prestations seront réputées conformes. 
            En cas de défaut avéré couvert par la garantie (voir article 6), l'entreprise SECURYGLASS 
            procédera à une reprise dans les meilleurs délais.
          </Text>
        </View>
        
        {/* Section 11 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>11. DONNÉES PERSONNELLES</Text>
          <Text style={styles.cgvText}>
            Les données personnelles collectées sont nécessaires au traitement des commandes. 
            Elles sont traitées conformément à la réglementation RGPD. Le client dispose d'un droit 
            d'accès, de rectification ou de suppression en écrivant à : contact@securyglass.fr
          </Text>
        </View>
        
        {/* Section 12 */}
        <View style={styles.cgvSection}>
          <Text style={styles.cgvSectionTitle}>12. RÈGLEMENT DES LITIGES</Text>
          <Text style={styles.cgvText}>
            En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le litige 
            sera porté devant les tribunaux compétents du ressort du siège de l'entreprise SECURYGLASS. 
            Pour les clients particuliers, en cas de désaccord persistant, le client peut recourir 
            gratuitement à un médiateur de la consommation.
          </Text>
        </View>
        
        {/* Footer */}
        <View style={styles.cgvFooter}>
          <Text style={styles.cgvFooterText}>
            SECURYGLASS SAS - Siège Social : Securyglass France - 65 Rue De La Croix - 92000 Nanterre - RCS Nanterre
          </Text>
          <Text style={styles.cgvFooterText}>
            Dernière mise à jour : 01/05/2025
          </Text>
        </View>
      </Page>
    </Document>
  );
};
