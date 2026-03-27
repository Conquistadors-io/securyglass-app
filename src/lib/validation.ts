import { z } from "zod";

// Validation schemas for all user inputs

export const clientSchema = z.object({
  email: z.string()
    .trim()
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  mobile: z.string()
    .trim()
    .transform(val => val.replace(/[\s.\-]/g, '')) // Supprimer espaces, points, tirets
    .refine(val => /^(\+33|0)[1-9](\d{2}){4}$/.test(val), {
      message: "Format de téléphone invalide (ex: 0612345678 ou 06 12 34 56 78)"
    }),
  nom: z.string()
    .trim()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  prenom: z.string()
    .trim()
    .max(100, "Le prénom ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  raison_sociale: z.string()
    .trim()
    .max(200, "La raison sociale ne peut pas dépasser 200 caractères")
    .optional()
    .nullable(),
  email_facturation: z.string()
    .trim()
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .optional()
    .nullable()
    .or(z.literal("")),
  address_line: z.string()
    .trim()
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .optional()
    .nullable(),
  city: z.string()
    .trim()
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  postal_code: z.string()
    .trim()
    .max(10, "Le code postal ne peut pas dépasser 10 caractères")
    .optional()
    .nullable(),
});

export const quoteSchema = z.object({
  client_id: z.string()
    .uuid("L'identifiant client est invalide")
    .optional(),
  service_type: z.string()
    .trim()
    .min(1, "Le type de service est requis")
    .max(50),
  motif: z.string()
    .trim()
    .max(100)
    .optional(),
  motif_other: z.string()
    .trim()
    .max(200)
    .optional(),
  property_type: z.string()
    .trim()
    .max(100)
    .optional(),
  property_other: z.string()
    .trim()
    .max(200)
    .optional(),
  assurance: z.string()
    .trim()
    .max(100)
    .optional(),
  intervention_postal_code: z.string()
    .trim()
    .max(10)
    .optional(),
  intervention_city: z.string()
    .trim()
    .max(100)
    .optional(),
  intervention_address: z.string()
    .trim()
    .max(500)
    .optional(),
  notes: z.string()
    .trim()
    .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
    .optional(),
});

// Keep the old name as alias for backward compatibility during migration
export const devisSchema = quoteSchema;

export const quoteComputeSchema = z.object({
  largeur: z.number()
    .positive("La largeur doit être positive")
    .max(10000, "La largeur ne peut pas dépasser 10000 cm"),
  hauteur: z.number()
    .positive("La hauteur doit être positive")
    .max(10000, "La hauteur ne peut pas dépasser 10000 cm"),
  quantite: z.number()
    .int("La quantité doit être un nombre entier")
    .positive("La quantité doit être positive")
    .max(1000, "La quantité ne peut pas dépasser 1000"),
  vitrage: z.string()
    .trim()
    .min(1, "Le type de vitrage est requis")
    .max(50),
  client_type: z.enum(["particulier", "professionnel"], {
    errorMap: () => ({ message: "Le type de client doit être 'particulier' ou 'professionnel'" })
  }),
  mise_en_securite: z.boolean(),
});

export const emailSchema = z.object({
  email: z.string()
    .trim()
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
});
