/**
 * Extensions de types Supabase
 * 
 * Ce fichier contient les types personnalisés qui ne sont pas auto-générés
 * par Supabase mais qui existent dans la base de données.
 */

import { Database } from './types';

// Extension de l'enum app_role
export type AppRole = 'admin' | 'moderator' | 'user';

// Extension des fonctions Supabase
export interface SupabaseFunctionsExtended {
  has_role: {
    Args: { _user_id: string; _role: AppRole };
    Returns: boolean;
  };
}

// Type combiné pour les fonctions
export type AllSupabaseFunctions = Database['public']['Functions'] & SupabaseFunctionsExtended;
