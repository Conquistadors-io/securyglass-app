import { supabase } from "@/integrations/supabase/client";

export interface DevisData {
  quote_number?: string;
  client_email: string;
  service_type: string;
  object: string;
  property?: string;
  property_other?: string;
  motif?: string;
  motif_other?: string;
  category?: string;
  subcategory?: string;
  vitrage?: string;
  largeur_cm?: number;
  hauteur_cm?: number;
  quantite: number;
  photo_url?: string;
  assurance?: string;
  different_intervention_address: boolean;
  intervention_adresse?: string;
  intervention_code_postal?: string;
  intervention_ville?: string;
  price_subtotal?: number;
  price_tva?: number;
  price_tva_rate?: number;
  price_total?: number;
  price_details?: any;
  status: string;
  source: string;
  notes?: string;
}

const generateQuoteNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DEV-${year}${month}${day}-${random}`;
};

export const saveDevis = async (formData: any, calculatedPrices: any): Promise<{ success: boolean; error?: string; devisId?: string }> => {
  try {
    // Generate unique quote number
    const quoteNumber = generateQuoteNumber();
    
    const devisData: DevisData = {
      quote_number: quoteNumber,
      client_email: formData.email,
      service_type: formData.serviceType || 'vitrerie',
      object: formData.object || '',
      property: formData.property !== 'autre' ? formData.property : undefined,
      property_other: formData.property === 'autre' ? formData.propertyOther : undefined,
      motif: formData.motif !== 'autre' ? formData.motif : undefined,
      motif_other: formData.motif === 'autre' ? formData.motifOther : undefined,
      category: formData.category,
      subcategory: formData.subcategory,
      vitrage: formData.vitrage,
      largeur_cm: formData.largeur ? parseFloat(formData.largeur) : undefined,
      hauteur_cm: formData.hauteur ? parseFloat(formData.hauteur) : undefined,
      quantite: formData.quantite || 1,
      photo_url: formData.photo,
      assurance: formData.assurance,
      different_intervention_address: formData.differentInterventionAddress || false,
      intervention_adresse: formData.differentInterventionAddress ? formData.interventionAdresse : formData.adresse,
      intervention_code_postal: formData.differentInterventionAddress ? formData.interventionCodePostal : formData.codePostal,
      intervention_ville: formData.differentInterventionAddress ? formData.interventionVille : formData.ville,
      price_subtotal: calculatedPrices.subtotal,
      price_tva: calculatedPrices.tva,
      price_tva_rate: calculatedPrices.tvaRate,
      price_total: calculatedPrices.total,
      price_details: calculatedPrices.details,
      status: 'draft',
      source: 'online',
      notes: formData.notes
    };

    const { data, error } = await supabase
      .from('devis' as any)
      .insert(devisData);

    if (error) {
      console.error('Error saving devis:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error saving devis:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
};