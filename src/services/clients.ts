import { supabase } from "@/integrations/supabase/client";
import { clientSchema } from "@/lib/validation";

export interface ClientData {
  email: string;
  mobile: string;
  nom: string;
  prenom?: string | null;
  raison_sociale?: string | null;
  civilite?: string | null;
  email_facturation?: string | null;
  address_line?: string | null;
  city?: string | null;
  postal_code?: string | null;
}

export const saveClient = async (data: {
  nom: string;
  prenom?: string;
  raison_sociale?: string;
  civilite?: string;
  mobile: string;
  email: string;
  email_facturation?: string;
  address_line?: string;
  city?: string;
  postal_code?: string;
}): Promise<{ success: boolean; error?: string; clientId?: string }> => {
  try {
    // Validate input data
    const validationResult = clientSchema.safeParse({
      email: data.email,
      mobile: data.mobile,
      nom: data.nom,
      prenom: data.prenom || null,
      raison_sociale: data.raison_sociale || null,
      email_facturation: data.email_facturation || null,
      address_line: data.address_line || null,
      city: data.city || null,
      postal_code: data.postal_code || null,
    });

    if (!validationResult.success) {
      const detailedErrors = validationResult.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code
      }));
      console.error('🔴 [SaveClient] Validation errors:', JSON.stringify(detailedErrors, null, 2));
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ");
      return { success: false, error: errors };
    }

    const clientData: ClientData = {
      email: validationResult.data.email!,
      mobile: validationResult.data.mobile!,
      nom: validationResult.data.nom!,
      prenom: validationResult.data.prenom,
      raison_sociale: validationResult.data.raison_sociale,
      civilite: data.civilite || null,
      email_facturation: validationResult.data.email_facturation || null,
      address_line: validationResult.data.address_line || null,
      city: validationResult.data.city || null,
      postal_code: validationResult.data.postal_code || null,
    };

    // Upsert client via SECURITY DEFINER function (bypasses RLS)
    const { data: clientId, error: upsertError } = await supabase
      .rpc('upsert_client', {
        _email: clientData.email,
        _mobile: clientData.mobile,
        _nom: clientData.nom,
        _prenom: clientData.prenom || null,
        _raison_sociale: clientData.raison_sociale || null,
        _civilite: clientData.civilite || null,
        _email_facturation: clientData.email_facturation || null,
        _address_line: clientData.address_line || null,
        _city: clientData.city || null,
        _postal_code: clientData.postal_code || null,
      });

    if (upsertError) {
      console.error('Error upserting client:', upsertError);
      return { success: false, error: upsertError.message };
    }

    if (!clientId) {
      return { success: false, error: 'Client ID non retourné après sauvegarde' };
    }

    console.log('Client saved/updated successfully:', clientId);
    return { success: true, clientId };
  } catch (err) {
    console.error('Unexpected error saving client:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
};