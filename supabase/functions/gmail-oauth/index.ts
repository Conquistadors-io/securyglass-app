import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  if (path === 'authorize') {
    // Step 1: Redirect to Google OAuth
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/gmail-oauth/callback`;
    
    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ');

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId!);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    return Response.redirect(authUrl.toString(), 302);
  }

  if (path === 'callback') {
    // Step 2: Handle callback and exchange code for tokens
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return new Response(`
        <html>
          <body>
            <h1>Erreur d'autorisation</h1>
            <p>Une erreur s'est produite: ${error}</p>
            <script>window.close();</script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders }
      });
    }

    if (!code) {
      return new Response('Code manquant', { status: 400, headers: corsHeaders });
    }

    try {
      // Exchange code for tokens
      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/gmail-oauth/callback`;

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId!,
          client_secret: clientSecret!,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        console.error('No access token received:', tokens);
        throw new Error('Échec de l\'obtention du token');
      }

      // Get user email
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      const userInfo = await userResponse.json();
      const userEmail = userInfo.email;

      // Calculate expiry time
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

      // Store credentials in database
      const { error: dbError } = await supabase
        .from('gmail_credentials')
        .upsert({
          user_email: userEmail,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt.toISOString(),
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Erreur de base de données');
      }

      console.log('Gmail OAuth success for:', userEmail);

      // Return success page
      return new Response(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .success { color: green; }
              .btn { background: #4285f4; color: white; padding: 10px 20px; border: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1 class="success">✓ Autorisation réussie</h1>
            <p>Votre compte Gmail <strong>${userEmail}</strong> a été connecté avec succès.</p>
            <p>Vous pouvez maintenant fermer cette fenêtre et envoyer vos devis par email.</p>
            <button class="btn" onclick="window.close()">Fermer</button>
            <script>
              // Auto-close after 3 seconds
              setTimeout(() => window.close(), 3000);
            </script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders }
      });

    } catch (error) {
      console.error('OAuth callback error:', error);
      return new Response(`
        <html>
          <body>
            <h1>Erreur</h1>
            <p>Une erreur s'est produite: ${error.message}</p>
            <script>window.close();</script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders }
      });
    }
  }

  // Default response
  return new Response('Endpoint non trouvé', { status: 404, headers: corsHeaders });
};

serve(handler);