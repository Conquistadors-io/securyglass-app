import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { devisId, status = 'validated', validatedAt, validationIp } = await req.json();
    
    if (!devisId) {
      console.error('❌ [Validate Quote] Missing devisId in request');
      return new Response(
        JSON.stringify({ error: 'Missing devisId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔵 [Validate Quote] Starting validation for devis:', devisId, 'with status:', status);

    // Use service role key to bypass RLS policies
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Préparer les données à mettre à jour
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    };

    // Si validation client, stocker les métadonnées
    if (status === 'validated') {
      updateData.validated_at = validatedAt || new Date().toISOString();
      if (validationIp) {
        updateData.validation_ip = validationIp;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('devis')
      .update(updateData)
      .eq('id', devisId)
      .select('id, status, quote_number')
      .single();

    if (error) {
      console.error('❌ [Validate Quote] Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ [Validate Quote] Devis validated successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ [Validate Quote] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
