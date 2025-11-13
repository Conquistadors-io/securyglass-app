import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { validateEmail } from '../_shared/validation.ts';
import { generateUnifiedQuoteHTML } from '../_shared/quote-html-template.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  devisId: string;
  templateKey?: string;
  email: string;
  clientName: string;
  message?: string;
  ccInternal?: boolean;
  attachment?: {
    filename: string;
    contentBase64: string;
    type?: string;
  };
  quoteData: {
    id: string;
    date: string;
    client: any;
    company: any;
    items: any[];
    motifDescription?: string;
    subtotal: number;
    vat: number;
    total: number;
  };
}

// Fonction de génération de token sécurisé
function generateValidationToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Fonction de remplacement des variables dans les templates
function replaceVariables(text: string, data: Record<string, any>): string {
  let result = text;
  for (const [key, value] of Object.entries(data)) {
    const stringValue = String(value ?? '');
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), stringValue);
  }
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      devisId,
      templateKey = 'DEVIS_ENVOYE',
      email, 
      clientName, 
      message = "", 
      ccInternal = false, 
      quoteData,
      attachment 
    }: QuoteEmailRequest = await req.json();

    console.log('🔵 [SendGrid] Sending quote email to:', email);
    console.log('🔵 [SendGrid] Using template:', templateKey);
    console.log('🔵 [SendGrid] Devis ID:', devisId);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid email', details: emailValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Créer le client Supabase avec service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ÉTAPE 1 : Charger le template depuis la base
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('key', templateKey)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('❌ Template not found:', templateKey, templateError);
      throw new Error(`Template not found: ${templateKey}`);
    }

    console.log('✅ Template loaded:', template.name);

    // ÉTAPE 2 : Générer le token de validation
    const validationToken = generateValidationToken();
    console.log('🔵 Generated validation token for devis:', devisId);

    const { error: updateError } = await supabase
      .from('devis')
      .update({ validation_token: validationToken })
      .eq('id', devisId);

    if (updateError) {
      console.error('❌ Error updating devis with token:', updateError);
      throw new Error('Failed to generate validation token');
    }

    // ÉTAPE 3 : Construire l'URL de validation
    const appUrl = Deno.env.get('APP_URL') || 'https://kmeyrlplsvdjxowxmzan.supabase.co';
    const validationUrl = `${appUrl}/devis/valider?token=${validationToken}`;
    console.log('🔵 Validation URL generated');

    // ÉTAPE 4 : Générer le HTML du devis
    const quoteHTML = generateUnifiedQuoteHTML({
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

    // ÉTAPE 5 : Préparer les variables pour le template
    const customMessage = message ? `<p>${message.replace(/\n/g, '<br>')}</p>` : '';
    const templateVariables = {
      client_name: clientName,
      quote_number: quoteData.id,
      service_type: quoteData.items[0]?.designation || 'Vitrerie',
      quote_amount: quoteData.total.toFixed(2),
      validation_url: validationUrl,
      custom_message: customMessage,
      quote_html: quoteHTML,
      quote_date: new Date().toLocaleDateString('fr-FR'),
    };

    // ÉTAPE 6 : Remplacer les variables dans le HTML et le sujet
    const emailContent = replaceVariables(template.html_content, templateVariables);
    const emailSubject = replaceVariables(template.subject, templateVariables);

    console.log('🔵 Template variables replaced');

    // ÉTAPE 7 : Préparer la liste des destinataires
    const recipients = [emailValidation.data!];
    const ccList = ccInternal ? ["contact@securyglass.fr"] : undefined;

    // ÉTAPE 8 : Construire le payload SendGrid
    const sendGridPayload: any = {
      personalizations: [{
        to: recipients.map(e => ({ email: e })),
        ...(ccList ? { cc: ccList.map(e => ({ email: e })) } : {})
      }],
      from: { 
        email: "no-reply@securyglass.fr", 
        name: "SecuryGlass" 
      },
      subject: emailSubject,
      content: [
        {
          type: "text/html",
          value: emailContent
        }
      ]
    };

    // Ajouter la pièce jointe si présente
    if (attachment) {
      sendGridPayload.attachments = [{
        content: attachment.contentBase64,
        filename: attachment.filename,
        type: attachment.type || "application/pdf",
        disposition: "attachment"
      }];
    }

    // ÉTAPE 9 : Envoyer via SendGrid
    console.log('🔵 Calling SendGrid API...');
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sendGridPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ SendGrid API error:", errorText);
      throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
    }

    const messageId = response.headers.get('x-message-id') || 'unknown';
    console.log('✅ Email sent successfully. Message ID:', messageId);

    // ÉTAPE 10 : Logger l'envoi dans emails_sent
    const { error: logError } = await supabase
      .from('emails_sent')
      .insert({
        template_key: templateKey,
        devis_id: devisId,
        recipient_email: emailValidation.data!,
        recipient_name: clientName,
        subject: emailSubject,
        html_content: emailContent,
        variables_data: templateVariables,
        sendgrid_message_id: messageId,
        status: 'sent'
      });

    if (logError) {
      console.error('⚠️ Warning: Failed to log email send:', logError);
      // Non-bloquant, on continue
    } else {
      console.log('✅ Email send logged to emails_sent table');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      messageId,
      to: recipients,
      cc: ccList,
      templateUsed: templateKey
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in send-quote-sendgrid function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
