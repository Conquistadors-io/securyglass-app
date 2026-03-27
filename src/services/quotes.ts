import { resendApi } from '@/integrations/resend/resend';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { quoteSchema } from '@/lib/validation';
import { saveClient } from './clients';

export type QuoteData = Database['public']['Tables']['quotes']['Insert'];
export type QuoteItemData = Database['public']['Tables']['quote_items']['Insert'];

type PropertyType = Database['public']['Enums']['property_type'];

const PROPERTY_TYPE_MAP: Record<string, PropertyType> = {
  appartement: 'apartment',
  maison: 'house',
  bureau: 'office',
  commerce: 'shop',
};

function generateValidationToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const validateQuote = async (quoteId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔵 [Validate Quote] Calling update-quote-status edge function for:', quoteId);

    const { data, error } = await supabase.functions.invoke('update-quote-status', {
      body: { quoteId, status: 'validated' },
    });

    if (error) {
      console.error('❌ [Validate Quote] Error from edge function:', error);
      return { success: false, error: error.message };
    }

    if (!data || !data.success) {
      console.error('❌ [Validate Quote] Edge function returned error:', data?.error);
      return { success: false, error: data?.error || 'Erreur lors de la validation' };
    }

    console.log('✅ [Validate Quote] Quote validated successfully:', data.data);
    return { success: true };
  } catch (err) {
    console.error('❌ [Validate Quote] Unexpected error:', err);
    return { success: false, error: 'Erreur lors de la validation du devis' };
  }
};

export const updateQuoteStatus = async (
  quoteId: string,
  newStatus: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(
      '🔵 [Update Status] Calling update-quote-status edge function for:',
      quoteId,
      'with status:',
      newStatus,
    );

    const { data, error } = await supabase.functions.invoke('update-quote-status', {
      body: { quoteId, status: newStatus },
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

export const updateQuote = async (
  quoteId: string,
  updatedData: Partial<QuoteData>,
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔵 [Update Quote] Updating quote:', quoteId);

    const { error } = await supabase
      .from('quotes')
      .update({
        ...updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quoteId);

    if (error) {
      console.error('❌ [Update Quote] Error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [Update Quote] Quote updated successfully');
    return { success: true };
  } catch (err) {
    console.error('❌ [Update Quote] Unexpected error:', err);
    return { success: false, error: 'Erreur lors de la mise à jour du devis' };
  }
};

export const saveQuote = async (
  formData: any,
  calculatedPrices: any,
): Promise<{ success: boolean; error?: string; quoteId?: string; quoteNumber?: string; validationToken?: string }> => {
  try {
    // Construct the correct intervention address
    const interventionAddress = formData.differentInterventionAddress
      ? formData.interventionAdresse ||
        `${formData.interventionVille || ''} ${formData.interventionCodePostal || ''}`.trim()
      : formData.adresse_intervention || `${formData.ville || ''} ${formData.codePostal || ''}`.trim();

    const interventionCity = formData.differentInterventionAddress ? formData.interventionVille : formData.ville;

    const interventionPostalCode = formData.differentInterventionAddress
      ? formData.interventionCodePostal
      : formData.codePostal;

    console.log('🔵 [SaveQuote] Calling saveClient...');

    // First, save the client information and get back the client_id
    const clientResult = await saveClient({
      nom: formData.nom,
      prenom: formData.prenom,
      raison_sociale: formData.raison_sociale || formData.nomSociete,
      civilite: formData.civilite,
      mobile: formData.telephone || formData.mobile,
      email: formData.email,
      email_facturation: formData.email_facturation,
      address_line: interventionAddress,
      city: interventionCity,
      postal_code: interventionPostalCode,
    });

    if (!clientResult.success || !clientResult.clientId) {
      console.error('Error saving client:', clientResult.error);
      return { success: false, error: `Erreur lors de la sauvegarde du client: ${clientResult.error}` };
    }

    // Generate validation token at insert time
    const validationToken = generateValidationToken();

    // Validate input data
    const dataToValidate = {
      client_id: clientResult.clientId,
      service_type: formData.serviceType || 'vitrerie',
      motif: formData.motif !== 'autre' ? formData.motif : undefined,
      motif_other: formData.motif === 'autre' ? formData.motifOther : undefined,
      property_type: formData.property !== 'autre'
        ? PROPERTY_TYPE_MAP[formData.property] || (formData.property as PropertyType)
        : undefined,
      property_other: formData.property === 'autre' ? formData.propertyOther : undefined,
      assurance: formData.assurance,
      intervention_postal_code: interventionPostalCode,
      intervention_city: interventionCity,
      intervention_address: interventionAddress,
      notes: formData.notes,
    };

    const validationResult = quoteSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.error('Validation error:', errors);
      return { success: false, error: errors };
    }

    // Insert into quotes table (quote_number = '' triggers DB sequence)
    const quoteInsert: QuoteData = {
      quote_number: '',
      client_id: clientResult.clientId,
      service_type: validationResult.data.service_type!,
      motif: validationResult.data.motif,
      motif_other: validationResult.data.motif_other,
      property_type: validationResult.data.property_type as PropertyType | undefined,
      property_other: validationResult.data.property_other,
      assurance: validationResult.data.assurance,
      intervention_address: validationResult.data.intervention_address,
      intervention_postal_code: validationResult.data.intervention_postal_code,
      intervention_city: validationResult.data.intervention_city,
      notes: validationResult.data.notes,
      photo_url: formData.photo,
      price_subtotal: calculatedPrices.subtotal,
      price_tva: calculatedPrices.tva,
      price_tva_rate: calculatedPrices.tvaRate,
      price_total: calculatedPrices.total,
      status: 'draft' as const,
      source: 'online_quote',
      validation_token: validationToken,
    };

    const { data, error } = await supabase.from('quotes').insert(quoteInsert).select('id, quote_number').single();

    if (error) {
      console.error('Error saving quote:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      console.error('No data returned from insert');
      return { success: false, error: 'Aucune donnée retournée' };
    }

    console.log('Quote saved successfully:', { id: data.id, quote_number: data.quote_number });

    // Insert quote item with product details
    const quoteItemInsert = {
      quote_id: data.id,
      description: formData.object || `${formData.serviceType || 'vitrerie'} - ${formData.vitrage || 'standard'}`,
      category: formData.category,
      subcategory: formData.subcategory,
      vitrage: formData.vitrage,
      largeur_cm: formData.largeur ? parseFloat(formData.largeur) : null,
      hauteur_cm: formData.hauteur ? parseFloat(formData.hauteur) : null,
      quantite: parseInt(formData.quantite, 10) || 1,
      unit_price: calculatedPrices.subtotal,
      price_subtotal: calculatedPrices.subtotal,
      price_tva: calculatedPrices.tva,
      price_total: calculatedPrices.total,
      price_details: calculatedPrices.details,
      sort_order: 0,
    };

    const { error: itemError } = await supabase.from('quote_items').insert(quoteItemInsert);

    if (itemError) {
      console.error('Error saving quote item:', itemError);
      // Quote was saved, item failed — log but don't fail the whole operation
    }

    // Send admin notification asynchronously (don't wait for it)
    resendApi
      .notifyAdmin({
        quoteNumber: data.quote_number,
        clientName: `${formData.prenom || ''} ${formData.nom || formData.raison_sociale || ''}`.trim(),
        clientEmail: formData.email,
        clientPhone: formData.telephone,
        total: calculatedPrices.total,
        serviceType: formData.serviceType || 'vitrerie',
        motif: formData.motif !== 'autre' ? formData.motif : formData.motifOther,
        interventionAddress: interventionAddress,
        interventionCity: interventionCity || '',
        interventionPostalCode: interventionPostalCode || '',
      })
      .then((response) => {
        if (!response.success) {
          console.error('Failed to send admin notification:', response.error);
        } else {
          console.log('Admin notification sent successfully');
        }
      })
      .catch((err) => {
        console.error('Error sending admin notification:', err);
      });

    return {
      success: true,
      quoteId: data.id,
      quoteNumber: data.quote_number,
      validationToken,
    };
  } catch (err) {
    console.error('Unexpected error saving quote:', err);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};
