-- Table email_templates : Stocker les templates modifiables
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_templates_key ON email_templates(key);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates"
  ON email_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all templates"
  ON email_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

COMMENT ON TABLE email_templates IS 'Templates d''emails modifiables dans l''admin avec système de variables';

-- Table emails_sent : Historique des envois
CREATE TABLE emails_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL,
  devis_id UUID REFERENCES devis(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables_data JSONB,
  sendgrid_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_emails_sent_devis_id ON emails_sent(devis_id);
CREATE INDEX idx_emails_sent_template_key ON emails_sent(template_key);
CREATE INDEX idx_emails_sent_status ON emails_sent(status);
CREATE INDEX idx_emails_sent_recipient ON emails_sent(recipient_email);
CREATE INDEX idx_emails_sent_sent_at ON emails_sent(sent_at DESC);

CREATE TRIGGER update_emails_sent_updated_at
  BEFORE UPDATE ON emails_sent
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE emails_sent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all emails"
  ON emails_sent FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all emails"
  ON emails_sent FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

COMMENT ON TABLE emails_sent IS 'Historique de tous les emails envoyés via SendGrid';

-- Ajouter colonnes validation au devis
ALTER TABLE devis 
ADD COLUMN IF NOT EXISTS validation_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validation_ip TEXT;

CREATE INDEX IF NOT EXISTS idx_devis_validation_token ON devis(validation_token);

COMMENT ON COLUMN devis.validation_token IS 'Token unique pour validation du devis par le client via email';
COMMENT ON COLUMN devis.validated_at IS 'Date et heure de validation du devis par le client';
COMMENT ON COLUMN devis.validation_ip IS 'Adresse IP du client lors de la validation';

-- Données initiales : Templates par défaut
INSERT INTO email_templates (key, name, description, subject, html_content, variables) VALUES (
  'DEVIS_ENVOYE',
  'Email de devis avec lien de validation',
  'Email envoyé au client avec le devis en PDF et un bouton de validation',
  'Votre devis {{quote_number}} - SecuryGlass',
  '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Bonjour {{client_name}},</h2>
    <br>
    {{custom_message}}
    <p>Votre devis <strong>{{quote_number}}</strong> est prêt ! Vous le trouverez en pièce jointe.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Type de service :</strong> {{service_type}}</p>
      <p><strong>Montant TTC :</strong> {{quote_amount}} €</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{validation_url}}" 
         style="display: inline-block;
                background-color: #22c55e;
                color: white;
                padding: 16px 48px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ✅ Valider ce devis
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; text-align: center;">
      En validant ce devis, vous confirmez votre accord pour les travaux décrits.
    </p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p>N''hésitez pas à nous contacter pour toute question.</p>
    <p>Cordialement,<br>L''équipe SecuryGlass</p>
    
    {{quote_html}}
  </div>',
  '[
    {"name": "client_name", "description": "Nom complet du client", "required": true},
    {"name": "quote_number", "description": "Numéro du devis", "required": true},
    {"name": "service_type", "description": "Type de service", "required": true},
    {"name": "quote_amount", "description": "Montant TTC", "required": true},
    {"name": "validation_url", "description": "Lien de validation du devis", "required": true},
    {"name": "custom_message", "description": "Message personnalisé optionnel", "required": false},
    {"name": "quote_html", "description": "HTML détaillé du devis", "required": true}
  ]'::jsonb
);

INSERT INTO email_templates (key, name, description, subject, html_content, variables) VALUES (
  'RELANCE_DEVIS',
  'Relance client pour devis non validé',
  'Email de relance envoyé X jours après l''envoi du devis si non validé',
  'Relance : Votre devis {{quote_number}} - SecuryGlass',
  '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Bonjour {{client_name}},</h2>
    <p>Nous vous avons envoyé un devis le <strong>{{quote_date}}</strong> pour vos travaux de vitrerie.</p>
    <p>Nous souhaitions savoir si vous avez eu l''occasion de le consulter et si vous avez des questions.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{validation_url}}" 
         style="display: inline-block;
                background-color: #3b82f6;
                color: white;
                padding: 14px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;">
        📄 Consulter et valider le devis
      </a>
    </div>
    
    <p>Notre équipe reste à votre disposition pour toute information complémentaire.</p>
    <p>Cordialement,<br>L''équipe SecuryGlass<br>☎️ 09 70 14 43 44</p>
  </div>',
  '[
    {"name": "client_name", "description": "Nom complet du client", "required": true},
    {"name": "quote_number", "description": "Numéro du devis", "required": true},
    {"name": "quote_date", "description": "Date d''envoi du devis", "required": true},
    {"name": "validation_url", "description": "Lien de validation du devis", "required": true}
  ]'::jsonb
);

INSERT INTO email_templates (key, name, description, subject, html_content, variables) VALUES (
  'CONFIRMATION_VALIDATION',
  'Confirmation de validation de devis',
  'Email automatique envoyé au client après validation du devis',
  '✅ Devis {{quote_number}} validé - SecuryGlass',
  '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background: #22c55e; color: white; padding: 20px; border-radius: 50%; margin-bottom: 20px;">
        <span style="font-size: 48px;">✅</span>
      </div>
      <h2 style="color: #22c55e;">Devis validé avec succès !</h2>
    </div>
    
    <p>Bonjour {{client_name}},</p>
    <p>Nous avons bien reçu votre validation pour le devis <strong>{{quote_number}}</strong>.</p>
    
    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Prochaines étapes :</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Notre équipe va vous contacter sous 24h pour planifier l''intervention</li>
        <li>Un technicien se rendra sur place à la date convenue</li>
        <li>Les travaux seront réalisés selon le devis validé</li>
      </ul>
    </div>
    
    <p>Pour toute question, n''hésitez pas à nous contacter au <strong>09 70 14 43 44</strong>.</p>
    <p>Cordialement,<br>L''équipe SecuryGlass</p>
  </div>',
  '[
    {"name": "client_name", "description": "Nom complet du client", "required": true},
    {"name": "quote_number", "description": "Numéro du devis", "required": true}
  ]'::jsonb
);