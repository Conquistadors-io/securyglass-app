-- Seed the DEVIS_ENVOYE email template used by the send-quote action
INSERT INTO public.email_templates (key, name, subject, html_content, description, variables)
VALUES (
  'DEVIS_ENVOYE',
  'Devis envoyé au client',
  'Votre devis SecuryGlass N° {{quote_number}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #3a9a84, #60bca8); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .content h2 { color: #3a9a84; }
    .quote-section { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 14px 28px; background-color: #60bca8; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 13px; background-color: #f9fafb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SecuryGlass</h1>
      <p>Votre devis est prêt</p>
    </div>
    <div class="content">
      <p>Bonjour {{client_name}},</p>
      <p>Nous vous remercions pour votre demande. Veuillez trouver ci-dessous votre devis.</p>
      {{custom_message}}
      <div class="quote-section">
        {{quote_html}}
      </div>
      <div class="button-container">
        <a href="{{validation_url}}" class="button">✅ Valider mon devis</a>
      </div>
      <p style="text-align: center; color: #6b7280; font-size: 13px;">En cliquant sur ce bouton, vous confirmez accepter les termes de ce devis.</p>
    </div>
    <div class="footer">
      <p>SecuryGlass - Vitrier professionnel</p>
      <p>Ce devis a été généré le {{quote_date}}</p>
    </div>
  </div>
</body>
</html>',
  'Template envoyé au client avec le devis et le lien de validation',
  '["client_name", "quote_number", "service_type", "quote_amount", "validation_url", "custom_message", "quote_html", "quote_date"]'::jsonb
)
ON CONFLICT (key) DO NOTHING;
