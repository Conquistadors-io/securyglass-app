-- Update pricing rules with correct Securyglass tariffs

-- Update glass prices
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
  "double": {
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
  "feuillete": {
    "particulier": 299,
    "professionnel": 299
  },
  "trempe": {
    "particulier": 399,
    "professionnel": 399
  },
  "miroir": {
    "particulier": 175,
    "professionnel": 175
  },
  "miroir_trou": {
    "particulier": 295,
    "professionnel": 295
  },
  "miroir_securit": {
    "particulier": 495,
    "professionnel": 495
  }
}'
WHERE rule_key = 'glass_prices';

-- Update labor costs
UPDATE pricing_rules 
SET rule_value = '{
  "base_rate_per_m2": 178.18,
  "minimum_charge": 89.09,
  "security_setup": 135.45
}'
WHERE rule_key = 'labor_costs';

-- Update delivery rules with correct thresholds
UPDATE pricing_rules 
SET rule_value = '{
  "cost_under_0_5_m2": 79,
  "cost_0_5_to_2_m2": 94.11,
  "cost_over_2_m2": 141.17,
  "free_threshold": 9999,
  "base_travel_cost": 62.73
}'
WHERE rule_key = 'delivery_rules';

-- Update general settings with correct VAT
UPDATE pricing_rules 
SET rule_value = '{
  "tva_rate": 0.10,
  "minimum_surface_m2": 0.5
}'
WHERE rule_key = 'general_settings';

-- Update client types with different security setup costs
UPDATE pricing_rules 
SET rule_value = '{
  "particulier": {
    "label": "Particulier",
    "multiplier": 1.0,
    "security_setup": 135.45
  },
  "professionnel": {
    "label": "Professionnel", 
    "multiplier": 1.0,
    "security_setup": 199
  }
}'
WHERE rule_key = 'client_types';