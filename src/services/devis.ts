import { supabase } from "@/integrations/supabase/client";
import { resendApi } from "@/integrations/resend/resend";
import { devisSchema } from "@/lib/validation";
import { z } from "zod";
import { saveClient } from "./clients";

export interface DevisData {
  quote_number?: string;
  civilite?: string;
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

export const validateDevis = async (devisId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔵 [Validate Devis] Calling validate-quote edge function for:', devisId);
    
    const { data, error } = await supabase.functions.invoke('validate-quote', {
      body: { devisId, status: 'validated' }
    });

    if (error) {
      console.error('❌ [Validate Devis] Error from edge function:', error);
      return { success: false, error: error.message };
    }

    if (!data || !data.success) {
      console.error('❌ [Validate Devis] Edge function returned error:', data?.error);
      return { success: false, error: data?.error || 'Erreur lors de la validation' };
    }

    console.log('✅ [Validate Devis] Devis validated successfully:', data.data);
    return { success: true };
  } catch (err) {
    console.error('❌ [Validate Devis] Unexpected error:', err);
    return { success: false, error: 'Erreur lors de la validation du devis' };
  }
};

export const updateDevisStatus = async (
  devisId: string, 
  newStatus: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔵 [Update Status] Calling validate-quote edge function for:', devisId, 'with status:', newStatus);
    
    const { data, error } = await supabase.functions.invoke('validate-quote', {
      body: { devisId, status: newStatus }
    });

    if (error) {
      console.error('❌ [Update Status] Error from edge function:', error);
      return { success: false, error: error.message };
    }

    if (!data || !data.success) {
      console.error('❌ [Update Status] Edge function returned error:', data?.error);
      return { success: false, error: data?.error || 'Erreur lors de la mise à jour du statut' };
    }

    console.log('✅ [Update Status] Status updated successfully:', data.data);
    return { success: true };
  } catch (err) {
    console.error('❌ [Update Status] Unexpected error:', err);
    return { success: false, error: 'Erreur lors de la mise à jour du statut' };
  }
};

export const updateDevis = async (
  devisId: string, 
  updatedData: Partial<DevisData>
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔵 [Update Devis] Updating devis:', devisId);
    
    const { data, error } = await supabase
      .from('devis')
      .update({
        ...updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', devisId)
      .select()
      .single();

    if (error) {
      console.error('❌ [Update Devis] Error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [Update Devis] Devis updated successfully:', data);
    return { success: true };
  } catch (err) {
    console.error('❌ [Update Devis] Unexpected error:', err);
    return { success: false, error: 'Erreur lors de la mise à jour du devis' };
  }
};

export const saveDevis = async (formData: any, calculatedPrices: any): Promise<{ success: boolean; error?: string; devisId?: string; quoteNumber?: string }> => {
  try {
    // Debug: Log form data before saving client
    console.log('🔵 [SaveDevis] Form data received:', {
      nom: formData.nom,
      prenom: formData.prenom,
      mobile: formData.telephone || formData.mobile,
      email: formData.email,
      differentInterventionAddress: formData.differentInterventionAddress,
      adresse_intervention: formData.adresse_intervention,
      interventionAdresse: formData.interventionAdresse,
      ville: formData.ville,
      codePostal: formData.codePostal,
      interventionVille: formData.interventionVille,
      interventionCodePostal: formData.interventionCodePostal
    });

    // Construct the correct intervention address
    const interventionAddress = formData.differentInterventionAddress 
      ? (formData.interventionAdresse || `${formData.interventionVille || ''} ${formData.interventionCodePostal || ''}`.trim())
      : (formData.adresse_intervention || `${formData.ville || ''} ${formData.codePostal || ''}`.trim());

    console.log('🔵 [SaveDevis] Calling saveClient with:', {
      nom: formData.nom,
      prenom: formData.prenom,
      mobile: formData.telephone || formData.mobile,
      email: formData.email,
      adresse_intervention: interventionAddress
    });

    // First, save the client information
    const clientResult = await saveClient({
      nom: formData.nom,
      prenom: formData.prenom,
      raison_sociale: formData.raison_sociale || formData.nomSociete,
      mobile: formData.telephone || formData.mobile,
      email: formData.email,
      email_facturation: formData.email_facturation,
      adresse_intervention: interventionAddress
    });

    if (!clientResult.success) {
      console.error('Error saving client:', clientResult.error);
      return { success: false, error: `Erreur lors de la sauvegarde du client: ${clientResult.error}` };
    }

    // Generate unique quote number
    const quoteNumber = generateQuoteNumber();
    
    // Prepare data for validation
    const dataToValidate = {
      civilite: formData.civilite,
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
      quantite: parseInt(formData.quantite, 10) || 1,
      assurance: formData.assurance,
      intervention_code_postal: formData.differentInterventionAddress ? formData.interventionCodePostal : formData.codePostal,
      intervention_ville: formData.differentInterventionAddress ? formData.interventionVille : formData.ville,
      intervention_adresse: interventionAddress,
      notes: formData.notes
    };

    // Validate input data
    const validationResult = devisSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ");
      console.error('Validation error:', errors);
      return { success: false, error: errors };
    }

    const devisData: DevisData = {
      quote_number: quoteNumber,
      civilite: validationResult.data.civilite,
      client_email: validationResult.data.client_email!,
      service_type: validationResult.data.service_type!,
      object: validationResult.data.object!,
      property: validationResult.data.property,
      property_other: validationResult.data.property_other,
      motif: validationResult.data.motif,
      motif_other: validationResult.data.motif_other,
      category: validationResult.data.category,
      subcategory: validationResult.data.subcategory,
      vitrage: validationResult.data.vitrage,
      largeur_cm: validationResult.data.largeur_cm,
      hauteur_cm: validationResult.data.hauteur_cm,
      quantite: validationResult.data.quantite!,
      assurance: validationResult.data.assurance,
      intervention_code_postal: validationResult.data.intervention_code_postal,
      intervention_ville: validationResult.data.intervention_ville,
      intervention_adresse: validationResult.data.intervention_adresse,
      notes: validationResult.data.notes,
      photo_url: formData.photo,
      different_intervention_address: formData.differentInterventionAddress || false,
      price_subtotal: calculatedPrices.subtotal,
      price_tva: calculatedPrices.tva,
      price_tva_rate: calculatedPrices.tvaRate,
      price_total: calculatedPrices.total,
      price_details: calculatedPrices.details,
      status: 'draft',
      source: 'online',
    };

    const { data, error } = await supabase
      .from('devis' as any)
      .insert(devisData)
      .select('id, quote_number')
      .single();

    if (error) {
      console.error('Error saving devis:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      console.error('No data returned from insert');
      return { success: false, error: 'Aucune donnée retournée' };
    }

    const savedData = data as any;
    console.log('Devis saved successfully:', { id: savedData.id, quote_number: savedData.quote_number });
    
    // Send admin notification asynchronously (don't wait for it)
    resendApi.notifyAdmin({
      quoteNumber: savedData.quote_number,
      clientName: `${formData.prenom || ''} ${formData.nom || formData.raison_sociale || ''}`.trim(),
      clientEmail: formData.email,
      clientPhone: formData.telephone,
      total: calculatedPrices.total,
      serviceType: formData.serviceType || 'vitrerie',
      motif: formData.motif !== 'autre' ? formData.motif : formData.motifOther,
      interventionAddress: interventionAddress,
      interventionCity: formData.differentInterventionAddress ? formData.interventionVille : formData.ville,
      interventionPostalCode: formData.differentInterventionAddress ? formData.interventionCodePostal : formData.codePostal,
    }).then(response => {
      if (!response.success) {
        console.error('Failed to send admin notification:', response.error);
      } else {
        console.log('Admin notification sent successfully');
      }
    }).catch(err => {
      console.error('Error sending admin notification:', err);
    });
    
    return { 
      success: true, 
      devisId: savedData.id, 
      quoteNumber: savedData.quote_number 
    };
  } catch (err) {
    console.error('Unexpected error saving devis:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
};