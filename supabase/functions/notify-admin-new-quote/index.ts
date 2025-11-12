import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔵 [Admin Notification] Function called');
    const requestData: AdminNotificationRequest = await req.json();
    console.log('🔵 [Admin Notification] Request data:', { 
      quoteNumber: requestData.quoteNumber,
      clientEmail: requestData.clientEmail,
      total: requestData.total
    });

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
      interventionPostalCode
    } = requestData;

    // Email content for admin
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; margin: 20px 0; }
          .info-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: bold; color: #4b5563; }
          .info-value { color: #111827; }
          .amount { font-size: 24px; color: #1e40af; font-weight: bold; text-align: center; padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #1e40af; 
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
            
            ${motif ? `
            <div class="info-row">
              <span class="info-label">Motif :</span>
              <span class="info-value">${motif}</span>
            </div>
            ` : ''}
            
            <div class="info-row">
              <span class="info-label">Adresse d'intervention :</span>
              <span class="info-value">${interventionAddress}, ${interventionPostalCode} ${interventionCity}</span>
            </div>
            
            <div class="amount">
              Montant Total TTC : ${total.toFixed(2)} €
            </div>
            
            <div style="text-align: center;">
              <a href="https://kmeyrlplsvdjxowxmzan.supabase.co/admin" class="button">
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

    const sendGridPayload = {
      personalizations: [{
        to: [{ email: "yves@securyglass.fr" }]
      }],
      from: { email: "no-reply@securyglass.fr", name: "SecuryGlass - Notifications" },
      subject: `🔔 Nouveau devis ${quoteNumber} - ${clientName}`,
      content: [{ 
        type: "text/html", 
        value: emailContent 
      }]
    };

    console.log('🔵 [Admin Notification] Calling SendGrid API...');
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
      console.error("❌ [Admin Notification] SendGrid API error:", errorText);
      console.error("❌ [Admin Notification] Status:", response.status);
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }
    
    console.log('✅ [Admin Notification] Email sent successfully to admin');

    const messageId = response.headers.get('x-message-id') || 'unknown';

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: messageId,
      to: "yves@securyglass.fr"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ [Admin Notification] Error:", error);
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
