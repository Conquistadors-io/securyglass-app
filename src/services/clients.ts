import { supabase } from "@/integrations/supabase/client";

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
    const clientData: ClientData = {
      email: data.email,
      mobile: data.mobile,
      nom: data.nom,
      prenom: data.prenom || null,
      raison_sociale: data.raison_sociale || null,
      email_facturation: data.email_facturation || null,
      adresse_intervention: data.adresse_intervention,
    };

    const { error } = await supabase
      .from('clients' as any)
      .upsert(clientData, {
        onConflict: 'email,mobile',
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