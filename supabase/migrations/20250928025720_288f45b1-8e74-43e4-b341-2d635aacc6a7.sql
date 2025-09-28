-- Corriger la grille tarifaire pour correspondre aux valeurs du frontend
UPDATE pricing_rules 
SET rule_value = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          rule_value,
          '{verre-feuillete}',
          rule_value->'feuillete_securit'
        ),
        '{verre-securit}',
        rule_value->'trempe_securit'
      ),
      '{verre-trempe}',
      rule_value->'trempe_securit'
    ),
    '{double}',
    rule_value->'double_transparent'
  ),
  '{double-delta-mat}',
  rule_value->'double_delta_mat'
)
WHERE rule_key = 'glass_prices';

-- Nettoyer les anciennes clés
UPDATE pricing_rules 
SET rule_value = rule_value - 'feuillete_securit' - 'trempe_securit' - 'double_transparent' - 'double_delta_mat'
WHERE rule_key = 'glass_prices';