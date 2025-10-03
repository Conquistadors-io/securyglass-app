import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

const generateQuotePDF = (quoteData: any) => {
  // Génération HTML du devis pour conversion PDF
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Devis ${quoteData.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-info { margin-bottom: 20px; }
        .client-info { margin-bottom: 20px; }
        .quote-details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; }
        .totals { text-align: right; margin-top: 20px; }
        .total-line { margin-bottom: 5px; }
        .final-total { font-weight: bold; font-size: 1.2em; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>DEVIS</h1>
        <h2>SecuryGlass</h2>
      </div>
      
      <div class="company-info">
        <h3>Entreprise</h3>
        <p><strong>${quoteData.company.name}</strong></p>
        <p>${quoteData.company.address}</p>
        <p>${quoteData.company.phone}</p>
        <p>${quoteData.company.email}</p>
      </div>
      
      <div class="client-info">
        <h3>Client</h3>
        <p><strong>${quoteData.client.name}</strong></p>
        <p>${quoteData.client.address}</p>
        <p>${quoteData.client.phone}</p>
        <p>${quoteData.client.email}</p>
      </div>
      
      <div class="quote-details">
        <p><strong>Numéro de devis:</strong> ${quoteData.id}</p>
        <p><strong>Date:</strong> ${quoteData.date}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Désignation</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${quoteData.items.map((item: any) => `
            <tr>
              <td>${item.designation}</td>
              <td>${item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)} €</td>
              <td>${item.total.toFixed(2)} €</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-line">Sous-total: ${quoteData.subtotal.toFixed(2)} €</div>
        <div class="total-line">TVA (20%): ${quoteData.vat.toFixed(2)} €</div>
        <div class="total-line final-total">Total TTC: ${quoteData.total.toFixed(2)} €</div>
      </div>
      
      <div style="margin-top: 40px; font-size: 0.9em; color: #666;">
        <p>Ce devis est valable 30 jours à compter de la date d'émission.</p>
        <p>Merci de votre confiance.</p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, clientName, message = "", ccInternal = false, attachment, quoteData }: QuoteEmailRequest = await req.json();

    console.log("Sending quote email via SendGrid to:", email);
    console.log("Quote ID:", quoteData.id);
    console.log("CC Internal:", ccInternal);

    // Générer le HTML du devis
    const quoteHTML = generateQuotePDF(quoteData);

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
      to: [{ email: email }],
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

    console.log("SendGrid payload:", JSON.stringify(sendGridPayload, null, 2));

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sendGridPayload)
    });

    console.log("SendGrid response status:", response.status);
    console.log("SendGrid response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendGrid error response:", errorText);
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log("SendGrid response body:", responseText);

    // SendGrid renvoie une réponse vide en cas de succès (202)
    const messageId = response.headers.get('x-message-id') || 'unknown';

    console.log("Email sent successfully via SendGrid");
    console.log("Message ID:", messageId);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: messageId,
      to: [email],
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