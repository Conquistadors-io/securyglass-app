export interface QuoteHTMLData {
  id: string;
  quoteNumber: string;
  date: string;
  client: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    siret?: string;
  };
  items: Array<{
    designation: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  motifDescription?: string;
  subtotal: number;
  vat: number;
  total: number;
}

export function generateUnifiedQuoteHTML(data: QuoteHTMLData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Devis ${data.quoteNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body { 
          font-family: Arial, sans-serif;
          padding: 40px;
          background-color: #ffffff;
          color: #1a1a1a;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header { 
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .header-left {
          flex: 1;
        }
        .header-title {
          font-size: 32px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        .header-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .header-right {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .logo {
          height: 60px;
          width: auto;
        }
        .quote-info {
          margin-bottom: 20px;
          padding: 0 5px;
        }
        .quote-info-line {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #1a1a1a;
        }
        .client-section { 
          background-color: #f3f4f6;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 8px;
        }
        .client-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #1a1a1a;
        }
        .client-info {
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 15px;
          color: #374151;
        }
        .client-info strong {
          color: #1a1a1a;
        }
        .company-address {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #d1d5db;
        }
        table { 
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background-color: #ffffff;
        }
        th, td { 
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th { 
          background-color: #f9fafb;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          color: #6b7280;
        }
        td {
          font-size: 11px;
          color: #374151;
        }
        .text-right {
          text-align: right;
        }
        .motif-section {
          background-color: #fef3c7;
          padding: 15px;
          margin-bottom: 30px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        .motif-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #92400e;
        }
        .motif-content {
          font-size: 11px;
          line-height: 1.6;
          color: #78350f;
          white-space: pre-wrap;
        }
        .totals { 
          text-align: right;
          margin-bottom: 40px;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        .total-line { 
          margin-bottom: 8px;
          font-size: 12px;
          color: #374151;
        }
        .final-total { 
          font-weight: bold;
          font-size: 16px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
          color: #1a1a1a;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          font-size: 10px;
          color: #6b7280;
          line-height: 1.8;
        }
        .footer p {
          margin-bottom: 8px;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #3a9a84, #60bca8); border-radius: 8px;">
          <div class="header-left">
            <div style="font-size: 32px; font-weight: bold; color: #ffffff; margin-bottom: 5px;">DEVIS</div>
            <div style="font-size: 14px; color: rgba(255,255,255,0.85); font-style: italic;">SecuryGlass — Glass for your security</div>
          </div>
        </div>
        
        <!-- Quote Info -->
        <div class="quote-info">
          <div class="quote-info-line">Devis N° : ${data.quoteNumber}</div>
          <div class="quote-info-line">Date : ${data.date}</div>
        </div>
        
        <!-- Client Section -->
        <div class="client-section">
          <div class="client-title">Client</div>
          <div class="client-info">
            <strong>${data.client.name}</strong><br>
            ${data.client.address}<br>
            Tél : ${data.client.phone}<br>
            Email : ${data.client.email}
          </div>
          
          <div class="company-address">
            <div class="client-title">Siège social</div>
            <div class="client-info">
              <strong>${data.company.name}</strong><br>
              ${data.company.address}<br>
              Tél : ${data.company.phone}<br>
              Email : ${data.company.email}
              ${data.company.siret ? `<br>SIRET : ${data.company.siret}` : ''}
            </div>
          </div>
        </div>
        
        <!-- Items Table -->
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th class="text-right">Quantité</th>
              <th class="text-right">Prix unitaire</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.designation}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.unitPrice.toFixed(2)} €</td>
                <td class="text-right">${item.total.toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${data.motifDescription ? `
        <!-- Motif Description -->
        <div class="motif-section">
          <div class="motif-title">Motif de l'intervention</div>
          <div class="motif-content">${data.motifDescription}</div>
        </div>
        ` : ''}
        
        <!-- Totals -->
        <div class="totals">
          <div class="total-line">Sous-total HT : ${data.subtotal.toFixed(2)} €</div>
          <div class="total-line">TVA (20%) : ${data.vat.toFixed(2)} €</div>
          <div class="final-total">Total TTC : ${data.total.toFixed(2)} €</div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p><strong>Conditions de validité :</strong></p>
          <p>Ce devis est valable 30 jours à compter de la date d'émission.</p>
          <p>Les travaux seront réalisés conformément aux normes en vigueur.</p>
          <p>Un acompte de 30% pourra être demandé à la commande.</p>
          <p><br>Merci de votre confiance.</p>
          <p><strong>SecuryGlass</strong> - Expert en vitrerie et miroiterie</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
