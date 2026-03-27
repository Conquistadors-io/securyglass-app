import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { Resend } from 'npm:resend@2.0.0';
import { validateEmail } from '../_shared/validation.ts';
import { generateUnifiedQuoteHTML } from '../_shared/quote-html-template.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── Types ───────────────────────────────────────────────

type Action = 'send-quote' | 'notify-admin' | 'send-custom';

interface SendQuotePayload {
  action: 'send-quote';
  quoteId: string;
  validationToken?: string;
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

interface NotifyAdminPayload {
  action: 'notify-admin';
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  total: number;
  serviceType: string;
  motif?: string;
  interventionAddress: string;
  interventionCity: string;
  interventionPostalCode: string;
}

interface SendCustomPayload {
  action: 'send-custom';
  to: string | string[];
  subject: string;
  html: string;
  cc?: string[];
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}

type RequestPayload = SendQuotePayload | NotifyAdminPayload | SendCustomPayload;

// ─── Helpers ─────────────────────────────────────────────

function replaceVariables(text: string, data: Record<string, any>): string {
  let result = text;
  for (const [key, value] of Object.entries(data)) {
    const stringValue = String(value ?? '');
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), stringValue);
  }
  return result;
}

function getResend(): Resend {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

function getSupabaseClient() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key);
}

function getAppUrl(): string {
  const appUrl = Deno.env.get('APP_URL');
  if (!appUrl) {
    throw new Error('APP_URL must be configured in Supabase secrets');
  }
  return appUrl;
}

// ─── Action Handlers ─────────────────────────────────────

async function handleSendQuote(payload: SendQuotePayload) {
  const {
    quoteId,
    validationToken,
    templateKey = 'DEVIS_ENVOYE',
    email,
    clientName,
    message = '',
    ccInternal = false,
    quoteData,
    attachment,
  } = payload;

  console.log('🔵 [Resend API] send-quote to:', email, '| template:', templateKey, '| quote:', quoteId);

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.success) {
    throw new Error(`Invalid email: ${emailValidation.error}`);
  }

  const supabase = getSupabaseClient();
  const resend = getResend();
  const appUrl = getAppUrl();

  // 1. Load email template from DB
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

  // 2. Build validation URL from pre-generated token
  const validationUrl = validationToken
    ? `${appUrl}/devis/valider?token=${validationToken}`
    : '';
  if (validationToken) {
    console.log('✅ Validation URL generated:', validationUrl);
  }

  // 4. Generate quote HTML and replace logo URLs with APP_URL (logos served from public folder)
  let quoteHTML = generateUnifiedQuoteHTML({
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
  quoteHTML = quoteHTML.replace(/\{\{APP_URL\}\}/g, appUrl);

  // 5. Prepare template variables
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

  // 6. Replace variables in template
  const emailContent = replaceVariables(template.html_content, templateVariables);
  const emailSubject = replaceVariables(template.subject, templateVariables);
  console.log('🔵 Template variables replaced');

  // 7. Prepare recipients
  const recipients = [emailValidation.data!];
  const ccList = ccInternal ? ['contact@securyglass.fr'] : undefined;

  // 8. Build Resend payload
  const resendPayload: any = {
    from: 'SecuryGlass <no-reply@securyglass.fr>',
    to: recipients,
    cc: ccList,
    subject: emailSubject,
    html: emailContent,
  };

  // Add attachment if present
  if (attachment) {
    resendPayload.attachments = [
      {
        filename: attachment.filename,
        content: attachment.contentBase64,
        content_type: attachment.type || 'application/pdf',
      },
    ];
  }

  // 9. Send via Resend
  console.log('🔵 Calling Resend API...');
  const emailResponse = await resend.emails.send(resendPayload);

  if (emailResponse.error) {
    console.error('❌ Resend API error:', emailResponse.error);
    throw new Error(`Resend error: ${emailResponse.error.message}`);
  }

  const messageId = emailResponse.data?.id || 'unknown';
  console.log('✅ Email sent successfully. Message ID:', messageId);

  // 10. Log in emails_sent
  const { error: logError } = await supabase.from('emails_sent').insert({
    template_key: templateKey,
    quote_id: quoteId,
    recipient_email: emailValidation.data!,
    recipient_name: clientName,
    subject: emailSubject,
    html_content: emailContent,
    variables_data: templateVariables,
    external_message_id: messageId,
    status: 'sent',
  });

  if (logError) {
    console.error('⚠️ Warning: Failed to log email send:', logError);
  } else {
    console.log('✅ Email send logged to emails_sent table');
  }

  return {
    success: true,
    messageId,
    to: recipients,
    cc: ccList,
    templateUsed: templateKey,
  };
}

async function handleNotifyAdmin(payload: NotifyAdminPayload) {
  const {
    quoteNumber,
    clientName,
    clientEmail,
    clientPhone,
    total,
    serviceType,
    motif,
    interventionAddress,
    interventionCity,
    interventionPostalCode,
  } = payload;

  console.log('🔵 [Resend API] notify-admin for quote:', quoteNumber);

  const resend = getResend();
  const appUrl = getAppUrl();

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a9a84; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9fafb; padding: 20px; margin: 20px 0; }
        .info-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .info-label { font-weight: bold; color: #4b5563; }
        .info-value { color: #111827; }
        .amount { font-size: 24px; color: #3a9a84; font-weight: bold; text-align: center; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #3a9a84; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nouveau Devis Soumis</h1>
        </div>
        
        <div class="content">
          <h2>Devis N° ${quoteNumber}</h2>
          
          <div class="info-row">
            <span class="info-label">Client :</span>
            <span class="info-value">${clientName}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Email :</span>
            <span class="info-value"><a href="mailto:${clientEmail}">${clientEmail}</a></span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Téléphone :</span>
            <span class="info-value"><a href="tel:${clientPhone}">${clientPhone}</a></span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Service :</span>
            <span class="info-value">${serviceType}</span>
          </div>
          
          ${
            motif
              ? `
          <div class="info-row">
            <span class="info-label">Motif :</span>
            <span class="info-value">${motif}</span>
          </div>
          `
              : ''
          }
          
          <div class="info-row">
            <span class="info-label">Adresse d'intervention :</span>
            <span class="info-value">${interventionAddress}, ${interventionPostalCode} ${interventionCity}</span>
          </div>
          
          <div class="amount">
            Montant Total TTC : ${total.toFixed(2)} €
          </div>
          
          <div style="text-align: center;">
            <a href="${appUrl}/admin" class="button">
              Voir le devis dans l'admin
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Cette notification a été envoyée automatiquement suite à une nouvelle soumission de devis.</p>
          <p>SecuryGlass - Système de gestion des devis</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailResponse = await resend.emails.send({
    from: 'SecuryGlass - Notifications <no-reply@securyglass.fr>',
    to: ['yves@securyglass.fr'],
    subject: `🔔 Nouveau devis ${quoteNumber} - ${clientName}`,
    html: emailContent,
  });

  if (emailResponse.error) {
    console.error('❌ Resend API error:', emailResponse.error);
    throw new Error(`Resend error: ${emailResponse.error.message}`);
  }

  const messageId = emailResponse.data?.id || 'unknown';
  console.log('✅ Admin notification sent. Message ID:', messageId);

  return {
    success: true,
    messageId,
    to: 'yves@securyglass.fr',
  };
}

async function handleSendCustom(payload: SendCustomPayload) {
  const { to, subject, html, cc, attachments } = payload;

  console.log('🔵 [Resend API] send-custom to:', to);

  const resend = getResend();

  const resendPayload: any = {
    from: 'SecuryGlass <no-reply@securyglass.fr>',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    cc,
  };

  if (attachments) {
    resendPayload.attachments = attachments;
  }

  const emailResponse = await resend.emails.send(resendPayload);

  if (emailResponse.error) {
    console.error('❌ Resend API error:', emailResponse.error);
    throw new Error(`Resend error: ${emailResponse.error.message}`);
  }

  const messageId = emailResponse.data?.id || 'unknown';
  console.log('✅ Custom email sent. Message ID:', messageId);

  return {
    success: true,
    messageId,
    to,
  };
}

// ─── Main Handler ────────────────────────────────────────

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestPayload = await req.json();
    const { action } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing "action" field', success: false }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`🔵 [Resend API] Action received: ${action}`);

    let result: any;

    switch (action) {
      case 'send-quote':
        result = await handleSendQuote(body as SendQuotePayload);
        break;
      case 'notify-admin':
        result = await handleNotifyAdmin(body as NotifyAdminPayload);
        break;
      case 'send-custom':
        result = await handleSendCustom(body as SendCustomPayload);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}`, success: false }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('❌ [Resend API] Error:', error);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
