import { supabase } from "@/integrations/supabase/client";

export interface ClientData {
  civilite?: string | null;
  nom?: string | null;
  nom_societe?: string | null;
  telephone?: string | null;
  email: string;
  adresse?: string | null;
  code_postal?: string | null;
  ville?: string | null;
}

export const saveClient = async (data: {
  civilite: string;
  nom: string;
  nomSociete: string;
  telephone: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const clientData: ClientData = {
      civilite: data.civilite || null,
      nom: data.nom || null,
      nom_societe: data.nomSociete || null,
      telephone: data.telephone || null,
      email: data.email,
      adresse: data.adresse || null,
      code_postal: data.codePostal || null,
      ville: data.ville || null,
    };

    const { error } = await supabase
      .from('clients' as any)
      .upsert(clientData, {
        onConflict: 'email',
        ignoreDuplicates: false
      });

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