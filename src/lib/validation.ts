import { z } from "zod";

// Validation schemas for all user inputs

export const clientSchema = z.object({
  email: z.string()
    .trim()
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  mobile: z.string()
    .trim()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format de téléphone invalide (ex: 0612345678)")
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères"),
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
  adresse_intervention: z.string()
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
});

export const devisSchema = z.object({
  civilite: z.string()
    .trim()
    .max(50)
    .optional(),
  client_email: z.string()
    .trim()
    .email("Format d'email invalide")
    .max(255),
  service_type: z.string()
    .trim()
    .min(1, "Le type de service est requis")
    .max(50),
  object: z.string()
    .trim()
    .min(1, "L'objet est requis")
    .max(100),
  property: z.string()
    .trim()
    .max(100)
    .optional(),
  property_other: z.string()
    .trim()
    .max(200)
    .optional(),
  motif: z.string()
    .trim()
    .max(100)
    .optional(),
  motif_other: z.string()
    .trim()
    .max(200)
    .optional(),
  category: z.string()
    .trim()
    .max(100)
    .optional(),
  subcategory: z.string()
    .trim()
    .max(100)
    .optional(),
  vitrage: z.string()
    .trim()
    .max(100)
    .optional(),
  largeur_cm: z.number()
    .positive("La largeur doit être positive")
    .max(10000, "La largeur ne peut pas dépasser 10000 cm")
    .optional(),
  hauteur_cm: z.number()
    .positive("La hauteur doit être positive")
    .max(10000, "La hauteur ne peut pas dépasser 10000 cm")
    .optional(),
  quantite: z.number()
    .int("La quantité doit être un nombre entier")
    .positive("La quantité doit être positive")
    .max(1000, "La quantité ne peut pas dépasser 1000"),
  assurance: z.string()
    .trim()
    .max(100)
    .optional(),
  intervention_code_postal: z.string()
    .trim()
    .max(10)
    .optional(),
  intervention_ville: z.string()
    .trim()
    .max(100)
    .optional(),
  intervention_adresse: z.string()
    .trim()
    .max(500)
    .optional(),
  notes: z.string()
    .trim()
    .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
    .optional(),
});

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
