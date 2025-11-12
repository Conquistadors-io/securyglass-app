import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { validateEmail } from '../_shared/validation.ts';
import { generateUnifiedQuoteHTML } from "../_shared/quote-html-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
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
    subtotal: number;
    vat: number;
    total: number;
  };
}


const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔵 [SendGrid] Function called');
    const { email, clientName, message = "", ccInternal = false, attachment, quoteData }: QuoteEmailRequest = await req.json();
    console.log('🔵 [SendGrid] Request data:', { email, clientName, hasAttachment: !!attachment, attachmentSize: attachment?.contentBase64?.length });

    // Validate recipient email address
    const emailValidation = validateEmail(email);
    if (!emailValidation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid recipient email', details: emailValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Générer le HTML du devis
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

    // Préparer le message personnalisé
    const customMessage = message ? `<p>${message.replace(/\n/g, '<br>')}</p>` : "";

    const emailContent = `
      <h2>Bonjour ${clientName},</h2>
      <br>
      ${customMessage}
      <p>Veuillez trouver ci-joint votre devis pour les travaux de vitrerie.</p>
      <p>N'hésitez pas à nous contacter pour toute question.</p>
      <p>Cordialement,<br>L'équipe SecuryGlass</p>
      <hr>
      ${quoteHTML}
    `;

    // Préparer les destinataires
    const personalizations = [{
      to: [{ email: emailValidation.data! }],
      ...(ccInternal ? { cc: [{ email: "contact@securyglass.fr" }] } : {})
    }];

    const sendGridPayload = {
      personalizations,
      from: { email: "no-reply@securyglass.fr", name: "SecuryGlass" },
      subject: `Devis ${quoteData.id} - SecuryGlass`,
      content: [{ 
        type: "text/html", 
        value: emailContent 
      }],
      ...(attachment ? {
        attachments: [{
          content: attachment.contentBase64,
          filename: attachment.filename,
          type: attachment.type || "application/pdf",
          disposition: "attachment"
        }]
      } : {})
    };

    console.log('🔵 [SendGrid] Calling SendGrid API...');
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
      console.error("❌ [SendGrid] API error response:", errorText);
      console.error("❌ [SendGrid] Status:", response.status);
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }
    
    console.log('✅ [SendGrid] Email sent successfully');

    // SendGrid renvoie une réponse vide en cas de succès (202)
    const messageId = response.headers.get('x-message-id') || 'unknown';

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: messageId,
      to: [emailValidation.data!],
      cc: ccInternal ? ["contact@securyglass.fr"] : undefined
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-sendgrid function:", error);
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
