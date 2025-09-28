import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteRequest {
  vitrage: string;
  largeur: string;
  hauteur: string;
  quantite: number;
  clientType?: 'particulier' | 'professionnel';
  address?: string;
  interventionAddress?: string;
  miseEnSecurite?: 'oui' | 'non';
}

interface PricingRules {
  glass_prices: any;
  labor_costs: any;
  delivery_rules: any;
  general_settings: any;
  client_types: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Compute quote function called');
    
    const requestData: QuoteRequest = await req.json();
    console.log('Request data:', requestData);

    // Fetch pricing rules from database
    const { data: pricingData, error } = await supabase
      .from('pricing_rules')
      .select('rule_key, rule_value');

    if (error) {
      console.error('Error fetching pricing rules:', error);
      throw new Error('Failed to fetch pricing rules');
    }

    // Convert array to object for easier access
    const rules: PricingRules = pricingData.reduce((acc, rule) => {
      acc[rule.rule_key] = rule.rule_value;
      return acc;
    }, {} as any);

    console.log('Pricing rules loaded:', Object.keys(rules));

    // Calculate quote
    const result = calculateQuote(requestData, rules);
    console.log('Calculation result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in compute-quote function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateQuote(request: QuoteRequest, rules: PricingRules) {
  const { vitrage, largeur, hauteur, quantite, clientType = 'particulier', miseEnSecurite = 'oui' } = request;
  
  // Parse dimensions
  const largeurM = parseFloat(largeur) / 100; // convert cm to m
  const hauteurM = parseFloat(hauteur) / 100; // convert cm to m
  const surfaceUnitaire = largeurM * hauteurM;
  
  // Apply minimum surface
  const minSurface = rules.general_settings.minimum_surface_m2;
  const surfaceFacturee = Math.max(surfaceUnitaire, minSurface);
  const surfaceTotale = surfaceFacturee * quantite;

  console.log(`Surface calculation: ${largeurM}m x ${hauteurM}m = ${surfaceUnitaire}m² (min: ${minSurface}m²)`);
  console.log(`Factured surface per unit: ${surfaceFacturee}m², total: ${surfaceTotale}m²`);

  // Glass price calculation
  let glassPrice = 0;
  if (rules.glass_prices[vitrage] && rules.glass_prices[vitrage][clientType]) {
    const pricePerM2 = rules.glass_prices[vitrage][clientType];
    glassPrice = surfaceTotale * pricePerM2;
  } else {
    console.warn(`No price found for vitrage: ${vitrage}, clientType: ${clientType}`);
    // Fallback to simple glass price
    glassPrice = surfaceTotale * rules.glass_prices.simple[clientType];
  }

  // Labor cost calculation
  const laborPerM2 = rules.labor_costs.base_rate_per_m2;
  const laborCost = Math.max(surfaceTotale * laborPerM2, rules.labor_costs.minimum_charge);

  // Security setup cost calculation - only if client wants it
  let securityCost = 0;
  if (miseEnSecurite === 'oui') {
    if (clientType === 'particulier') {
      // Fixed cost for particuliers
      securityCost = rules.client_types[clientType].security_setup || 0;
    } else {
      // Per m² cost for professionals
      const securityPerM2 = rules.client_types[clientType].security_setup_per_m2 || 0;
      securityCost = surfaceTotale * securityPerM2;
    }
  }

  // Base subtotal
  let subtotal = glassPrice + laborCost + securityCost;

  // Delivery cost calculation based on surface thresholds
  let deliveryCost = 0;
  if (surfaceTotale < 0.5) {
    deliveryCost = rules.delivery_rules.cost_under_0_5_m2;
  } else if (surfaceTotale <= 2) {
    deliveryCost = rules.delivery_rules.cost_0_5_to_2_m2;
  } else {
    deliveryCost = rules.delivery_rules.cost_over_2_m2;
  }

  // Travel cost (not charged if security setup is included)
  const travelCost = securityCost > 0 ? 0 : rules.delivery_rules.base_travel_cost;

  // Apply client type multiplier
  const clientMultiplier = rules.client_types[clientType].multiplier;
  subtotal = (subtotal + deliveryCost + travelCost) * clientMultiplier;

  // Calculate VAT using client-specific rate
  const tvaRate = rules.client_types[clientType].tva_rate;
  const tva = subtotal * tvaRate;
  const total = subtotal + tva;

  const details = {
    surface: {
      unitaire: surfaceUnitaire,
      facturee: surfaceFacturee,
      totale: surfaceTotale,
      minimum: minSurface
    },
    vitrage: {
      type: vitrage,
      prix_m2: rules.glass_prices[vitrage]?.[clientType] || rules.glass_prices.simple[clientType],
      total: glassPrice
    },
    main_oeuvre: {
      prix_m2: laborPerM2,
      total: laborCost,
      minimum: rules.labor_costs.minimum_charge
    },
    securite: {
      total: securityCost,
      incluse: miseEnSecurite === 'oui',
      type: clientType === 'particulier' ? 'fixe' : 'par_m2',
      prix_m2: clientType === 'professionnel' ? rules.client_types[clientType].security_setup_per_m2 : null
    },
    livraison: {
      total: deliveryCost,
      seuil_gratuit: rules.delivery_rules.free_threshold
    },
    deplacement: {
      total: travelCost
    },
    client: {
      type: clientType,
      multiplicateur: clientMultiplier,
      label: rules.client_types[clientType].label
    }
  };

  console.log('Calculation breakdown:', {
    glassPrice,
    laborCost,
    securityCost,
    deliveryCost,
    travelCost,
    clientMultiplier,
    subtotal,
    tva,
    total
  });

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    tvaRate: tvaRate,
    total: Math.round(total * 100) / 100,
    details
  };
}