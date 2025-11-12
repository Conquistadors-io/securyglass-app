import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateEmail } from '../_shared/validation.ts';
import { generateUnifiedQuoteHTML } from "../_shared/quote-html-template.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface QuoteEmailRequest {
  email: string;
  clientName: string;
  message: string;
  quoteData: any;
  senderEmail?: string;
}

// Refresh access token if needed
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokens = await response.json();
    
    if (tokens.access_token) {
      // Update the access token in database
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
      await supabase
        .from('gmail_credentials')
        .update({
          access_token: tokens.access_token,
          expires_at: expiresAt.toISOString(),
        })
        .eq('refresh_token', refreshToken);
      
      return tokens.access_token;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Get valid access token
async function getValidAccessToken(senderEmail: string): Promise<string | null> {
  try {
    const { data: credentials, error } = await supabase
      .from('gmail_credentials')
      .select('*')
      .eq('user_email', senderEmail)
      .single();

    if (error || !credentials) {
      console.error('No credentials found');
      return null;
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(credentials.expires_at);

    if (now >= expiresAt) {
      return await refreshAccessToken(credentials.refresh_token);
    }

    return credentials.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}


// Send email via Gmail API
async function sendGmailEmail(accessToken: string, senderEmail: string, recipientEmail: string, subject: string, htmlContent: string, textContent: string): Promise<boolean> {
  try {
    // Create MIME message
    const messageParts = [
      `From: ${senderEmail}`,
      `To: ${recipientEmail}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="boundary123"',
      '',
      '--boundary123',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      textContent,
      '',
      '--boundary123',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlContent,
      '',
      '--boundary123--'
    ];

    const mimeMessage = messageParts.join('\n');
    const encodedMessage = btoa(unescape(encodeURIComponent(mimeMessage)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gmail API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email via Gmail:', error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, clientName, message, quoteData, senderEmail }: QuoteEmailRequest = await req.json();

    // Validate recipient email address
    const emailValidation = validateEmail(email);
    if (!emailValidation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid recipient email', details: emailValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Use default sender email if not provided
    const actualSenderEmail = senderEmail || 'contact@securyglass.fr';

    // Get valid access token
    const accessToken = await getValidAccessToken(actualSenderEmail);
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ 
          error: 'Gmail not connected. Please authorize Gmail access first.',
          needsAuth: true 
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Generate email content
    const htmlContent = generateUnifiedQuoteHTML({
      id: quoteData.id,
      quoteNumber: quoteData.id,
      date: quoteData.date,
      client: quoteData.client,
      company: quoteData.company,
      items: quoteData.items,
      motifDescription: quoteData.motifDescription,
      subtotal: quoteData.subtotal,
      vat: quoteData.vat,
      total: quoteData.total,
    });
    const textContent = `
      Bonjour ${clientName},

      ${message}

      Détails du devis:
      - Numéro: ${quoteData.id}
      - Date: ${quoteData.date}
      - Total: ${quoteData.total.toFixed(2)} €

      Cordialement,
      ${quoteData.company.name}
    `;

    const subject = `Devis N° ${quoteData.id} - ${quoteData.company.name}`;

    // Send email
    const success = await sendGmailEmail(
      accessToken,
      actualSenderEmail,
      emailValidation.data!,
      subject,
      htmlContent,
      textContent
    );

    if (success) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully via Gmail' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } else {
      throw new Error('Failed to send email via Gmail');
    }

  } catch (error: any) {
    console.error('Error in send-quote-gmail function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
