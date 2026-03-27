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
    const body = await req.json();
    // Accept both quoteId (new) and devisId (legacy) for backward compatibility
    const quoteId = body.quoteId || body.devisId;
    const { status = 'validated', validatedAt, validationIp } = body;

    if (!quoteId) {
      console.error('❌ [Update Quote Status] Missing quoteId in request');
      return new Response(
        JSON.stringify({ error: 'Missing quoteId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔵 [Update Quote Status] Updating quote:', quoteId, 'to status:', status);

    // Use service role key to bypass RLS policies
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Prepare update data
    const updateData: Record<string, unknown> = {
      status: status,
      updated_at: new Date().toISOString()
    };

    // If validating, store validation metadata
    if (status === 'validated') {
      updateData.validated_at = validatedAt || new Date().toISOString();
      if (validationIp) {
        updateData.validation_ip = validationIp;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('quotes')
      .update(updateData)
      .eq('id', quoteId)
      .select('id, status, quote_number')
      .single();

    if (error) {
      console.error('❌ [Update Quote Status] Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ [Update Quote Status] Quote updated successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ [Update Quote Status] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
