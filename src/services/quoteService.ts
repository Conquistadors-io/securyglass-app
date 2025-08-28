
import { supabase } from "@/integrations/supabase/client";

export interface ClientData {
  email: string;
  civilite?: string;
  nom?: string;
  nom_societe?: string;
  telephone?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
}

export interface DevisData {
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
  assurance?: string;
  different_intervention_address: boolean;
  intervention_code_postal?: string;
  intervention_ville?: string;
  intervention_adresse?: string;
  photo_url?: string;
  price_subtotal?: number;
  price_tva?: number;
  price_tva_rate?: number;
  price_total?: number;
  price_details?: any;
  status?: string;
  source?: string;
  notes?: string;
}

// Génère un numéro de devis unique
function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `DEV-${year}${month}${day}-${random}`;
}

// Crée ou met à jour un client
export async function upsertClient(clientData: ClientData) {
  console.log('Upserting client:', clientData);
  
  const { data, error } = await supabase
    .from('clients')
    .upsert(clientData, {
      onConflict: 'email',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting client:', error);
    throw error;
  }

  console.log('Client upserted successfully:', data);
  return data;
}

// Crée un nouveau devis
export async function createDevis(devisData: DevisData) {
  console.log('Creating devis:', devisData);
  
  const devisWithQuoteNumber = {
    ...devisData,
    quote_number: generateQuoteNumber(),
    status: 'draft',
    source: 'online'
  };

  const { data, error } = await supabase
    .from('devis')
    .insert(devisWithQuoteNumber)
    .select()
    .single();

  if (error) {
    console.error('Error creating devis:', error);
    throw error;
  }

  console.log('Devis created successfully:', data);
  return data;
}

// Fonction principale pour sauvegarder un devis complet
export async function saveQuote(clientData: ClientData, devisData: Omit<DevisData, 'client_email'>) {
  try {
    // 1. Créer ou mettre à jour le client
    await upsertClient(clientData);
    
    // 2. Créer le devis
    const fullDevisData: DevisData = {
      ...devisData,
      client_email: clientData.email
    };
    
    const devis = await createDevis(fullDevisData);
    
    return {
      success: true,
      devis,
      message: 'Devis sauvegardé avec succès'
    };
  } catch (error: any) {
    console.error('Error saving quote:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la sauvegarde',
      message: 'Erreur lors de la sauvegarde du devis'
    };
  }
}
