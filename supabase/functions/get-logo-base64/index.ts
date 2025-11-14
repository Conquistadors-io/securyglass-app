import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to fetch image from URL and convert to base64
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    // Determine content type from URL
    const contentType = url.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to load image from ${url}:`, error);
    throw error;
  }
};

// Public URLs of the images from the deployed app's public folder
const APP_URL = Deno.env.get('APP_URL') || 'https://kmeyrlplsvdjxowxmzan.supabase.co';
const LOGO_URLS = {
  securyglass: `${APP_URL}/securyglass-logo.png`,
  certification: `${APP_URL}/certification-qualite.jpg`,
};

// Alternative: If images are not in storage yet, we'll need to upload them first
// For now, the edge function will attempt to fetch from storage

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔵 [Get Logo] Function called");
    
    // Parse the request to get which logo
    const url = new URL(req.url);
    const logo = url.searchParams.get("logo");
    
    if (!logo || !["securyglass", "certification"].includes(logo)) {
      return new Response(
        JSON.stringify({ error: "Invalid logo parameter. Use ?logo=securyglass or ?logo=certification" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    console.log(`🔵 [Get Logo] Fetching ${logo} logo from storage...`);
    const logoUrl = LOGO_URLS[logo as keyof typeof LOGO_URLS];
    const base64Data = await fetchImageAsBase64(logoUrl);
    
    console.log(`✅ [Get Logo] Returning ${logo} logo (${base64Data.length} characters)`);
    
    return new Response(
      JSON.stringify({ base64: base64Data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("❌ [Get Logo] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
