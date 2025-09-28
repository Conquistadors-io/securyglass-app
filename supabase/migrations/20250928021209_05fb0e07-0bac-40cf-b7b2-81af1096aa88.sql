-- Mise à jour complète des règles tarifaires selon la nouvelle grille

-- 1. Mettre à jour les prix des verres selon la nouvelle grille
UPDATE pricing_rules 
SET rule_value = '{
  "simple": {
    "particulier": 97.19,
    "professionnel": 97.19
  },
  "simple_opaque": {
    "particulier": 167.31,
    "professionnel": 167.31
  },
  "double_transparent": {
    "particulier": 297.31,
    "professionnel": 297.31
  },
  "double_opaque": {
    "particulier": 348.31,
    "professionnel": 348.31
  },
  "double_securit": {
    "particulier": 399,
    "professionnel": 399
  },
  "double_delta_mat": {
    "particulier": 399,
    "professionnel": 399
  },
  "feuillete_securit": {
    "particulier": 299,
    "professionnel": 299
  },
  "trempe_securit": {
    "particulier": 399,
    "professionnel": 399
  },
  "miroir_standard": {
    "particulier": 175,
    "professionnel": 175
  },
  "miroir_avec_trou": {
    "particulier": 295,
    "professionnel": 295
  },
  "miroir_securit": {
    "particulier": 495,
    "professionnel": 495
  }
}'::jsonb
WHERE rule_key = 'glass_prices';

-- 2. Mettre à jour les coûts de main d'œuvre
UPDATE pricing_rules 
SET rule_value = '{
  "base_rate_per_m2": 178.18,
  "minimum_charge": 89.09
}'::jsonb
WHERE rule_key = 'labor_costs';

-- 3. Mettre à jour les règles de livraison
UPDATE pricing_rules 
SET rule_value = '{
  "cost_under_0_5_m2": 79,
  "cost_0_5_to_2_m2": 94.11,
  "cost_over_2_m2": 141.17,
  "base_travel_cost": 62.73,
  "free_threshold": null
}'::jsonb
WHERE rule_key = 'delivery_rules';

-- 4. Mettre à jour les types de clients avec TVA différenciée et mise en sécurité
UPDATE pricing_rules 
SET rule_value = '{
  "particulier": {
    "label": "Particulier",
    "multiplier": 1.0,
    "security_setup": 135.45,
    "tva_rate": 0.10
  },
  "professionnel": {
    "label": "Professionnel",
    "multiplier": 1.0,
    "security_setup_per_m2": 199,
    "tva_rate": 0.20
  }
}'::jsonb
WHERE rule_key = 'client_types';

-- 5. Supprimer le taux de TVA des paramètres généraux (maintenant dans client_types)
UPDATE pricing_rules 
SET rule_value = '{
  "minimum_surface_m2": 0.5
}'::jsonb
WHERE rule_key = 'general_settings';