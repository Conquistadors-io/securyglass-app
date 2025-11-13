import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    console.log('🔵 assign-admin-role called for userId:', userId);

    if (!userId) {
      console.error('❌ No userId provided');
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client with service role (bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { 
        auth: { 
          persistSession: false,
          autoRefreshToken: false 
        } 
      }
    );

    // Check if there are any existing admins
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing admins:', checkError);
      throw checkError;
    }

    console.log('🔵 Existing admins check:', existingAdmins);

    // If no admin exists, assign admin role to this user (first user becomes admin)
    if (!existingAdmins || existingAdmins.length === 0) {
      console.log('✅ No existing admin, assigning admin role to first user');
      
      const { error: insertError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });

      if (insertError) {
        console.error('❌ Error inserting admin role:', insertError);
        throw insertError;
      }

      console.log('✅ Admin role assigned successfully');
      return new Response(
        JSON.stringify({ success: true, message: "Admin role assigned to first user" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Admin already exists, do not assign admin role automatically
      console.log('⚠️ Admin already exists, not assigning admin role');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Un administrateur existe déjà. Contactez-le pour obtenir les droits admin." 
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error('❌ Error in assign-admin-role:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
