import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { generateUnifiedQuoteHTML } from "../_shared/quote-html-template.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const { email, clientName, message = "", ccInternal = false, quoteData }: QuoteEmailRequest = await req.json();

    console.log("Sending quote email to:", email);
    console.log("Quote ID:", quoteData.id);
    console.log("CC Internal:", ccInternal);

    // Préparer la liste des destinataires
    const recipients = [email];
    const ccList = ccInternal ? ["contact@securyglass.fr"] : undefined;

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

    const emailResponse = await resend.emails.send({
      from: "SecuryGlass <contact@securyglass.fr>",
      to: recipients,
      cc: ccList,
      subject: `Devis ${quoteData.id} - SecuryGlass`,
      html: `
        <h2>Bonjour ${clientName},</h2>
        ${customMessage}
        <p>Veuillez trouver ci-joint votre devis pour les travaux de vitrerie.</p>
        <p>N'hésitez pas à nous contacter pour toute question.</p>
        <p>Cordialement,<br>L'équipe SecuryGlass</p>
        <hr>
        ${quoteHTML}
      `,
    });

    console.log("Email sent successfully:", emailResponse);
    console.log("Message ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id,
      to: recipients,
      cc: ccList
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote function:", error);
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