import { supabase } from "@/integrations/supabase/client";
import { clientSchema } from "@/lib/validation";
import { z } from "zod";

export interface ClientData {
  email: string;
  mobile: string;
  nom: string;
  prenom?: string | null;
  raison_sociale?: string | null;
  email_facturation?: string | null;
  adresse_intervention: string;
}

export const saveClient = async (data: {
  nom: string;
  prenom?: string;
  raison_sociale?: string;
  mobile: string;
  email: string;
  email_facturation?: string;
  adresse_intervention: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate input data
    const validationResult = clientSchema.safeParse({
      email: data.email,
      mobile: data.mobile,
      nom: data.nom,
      prenom: data.prenom || null,
      raison_sociale: data.raison_sociale || null,
      email_facturation: data.email_facturation || null,
      adresse_intervention: data.adresse_intervention,
    });

    if (!validationResult.success) {
      const detailedErrors = validationResult.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code
      }));
      console.error('🔴 [SaveClient] Validation errors:', JSON.stringify(detailedErrors, null, 2));
      console.error('🔴 [SaveClient] Input data:', JSON.stringify({
        email: data.email,
        mobile: data.mobile,
        nom: data.nom,
        adresse_intervention: data.adresse_intervention?.substring(0, 50) + '...'
      }, null, 2));
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ");
      return { success: false, error: errors };
    }

    const clientData: ClientData = {
      email: validationResult.data.email!,
      mobile: validationResult.data.mobile!,
      nom: validationResult.data.nom!,
      prenom: validationResult.data.prenom,
      raison_sociale: validationResult.data.raison_sociale,
      email_facturation: validationResult.data.email_facturation || null,
      adresse_intervention: validationResult.data.adresse_intervention!,
    };

    // Check if client exists using the secure function
    const { data: existsData, error: existsError } = await supabase
      .rpc('check_client_exists', {
        _email: clientData.email,
        _mobile: clientData.mobile
      });

    if (existsError) {
      console.error('Error checking client existence:', existsError);
      return { success: false, error: existsError.message };
    }

    let error;
    if (existsData) {
      // Client exists, update it
      const result = await supabase
        .from('clients')
        .update(clientData)
        .or(`email.eq.${clientData.email},mobile.eq.${clientData.mobile}`);
      error = result.error;
    } else {
      // Client doesn't exist, insert it
      const result = await supabase
        .from('clients')
        .insert(clientData);
      error = result.error;
    }

    if (error) {
      console.error('Error saving client:', error);
      return { success: false, error: error.message };
    }

    console.log('Client saved/updated successfully for email:', data.email);
    return { success: true };
  } catch (err) {
    console.error('Unexpected error saving client:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
};