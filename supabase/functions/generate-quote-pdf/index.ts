import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { renderToBuffer } from "npm:@react-pdf/renderer@4.3.1";
import React from "npm:react@18.3.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Import the PDF template components
const { Document, Page, Text, View, StyleSheet } = await import("npm:@react-pdf/renderer@4.3.1");

// Styles for PDF
const colors = {
  primary: '#1e40af',
  secondary: '#3b82f6',
  text: '#1f2937',
  lightGray: '#f3f4f6',
  border: '#e5e7eb',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: colors.border,
    paddingBottom: 5,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    color: 'white',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: colors.border,
    padding: 8,
  },
  tableCell: {
    flex: 1,
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    width: 250,
  },
  totalLabel: {
    fontWeight: 'bold',
    width: 150,
    textAlign: 'right',
    marginRight: 20,
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#6b7280',
    borderTop: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
});

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId } = await req.json();

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: 'Quote ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔵 Generating PDF for quote:', quoteId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch quote data with client and items
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select(`
        *,
        clients (
          nom,
          prenom,
          mobile,
          raison_sociale,
          email,
          email_facturation,
          address_line,
          city,
          postal_code
        ),
        quote_items (
          description,
          category,
          vitrage,
          largeur_cm,
          hauteur_cm,
          quantite,
          unit_price,
          price_subtotal,
          price_total,
          sort_order
        )
      `)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error('❌ Error fetching quote:', quoteError);
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Quote data loaded');

    // Prepare PDF data
    const clientAddress = [
      quote.clients?.address_line,
      `${quote.clients?.postal_code || ''} ${quote.clients?.city || ''}`.trim()
    ].filter(Boolean).join(', ');

    const pdfData = {
      quoteNumber: quote.quote_number || 'DRAFT',
      date: new Date(quote.created_at).toLocaleDateString('fr-FR'),
      client: {
        name: quote.clients?.raison_sociale || `${quote.clients?.prenom || ''} ${quote.clients?.nom || ''}`.trim(),
        address: clientAddress || quote.intervention_address || '',
        city: `${quote.intervention_postal_code || ''} ${quote.intervention_city || ''}`.trim(),
        email: quote.clients?.email || '',
        phone: quote.clients?.mobile || '',
      },
      company: {
        name: 'SECURYGLASS',
        address: '65 Rue De La Croix',
        city: '92000 Nanterre',
        phone: '09 70 14 43 44',
        email: 'contact@securyglass.fr',
        siret: '91094284600015',
      },
      items: (quote.quote_items || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((item: any) => ({
          description: `${item.description}${item.vitrage ? ` - Vitrage: ${item.vitrage}` : ''}${item.largeur_cm && item.hauteur_cm ? `, ${item.largeur_cm}x${item.hauteur_cm} cm` : ''}`,
          details: item.category || '',
          quantity: item.quantite || 1,
          unitPrice: item.unit_price || 0,
          total: item.price_total || 0,
        })),
      subtotal: quote.price_subtotal || 0,
      vat: quote.price_tva || 0,
      vatRate: quote.price_tva_rate || 10,
      total: quote.price_total || 0,
      notes: quote.notes || '',
    };

    // Fallback if no items
    if (pdfData.items.length === 0) {
      pdfData.items = [{
        description: `${quote.service_type}${quote.motif ? ` (${quote.motif})` : ''}`,
        details: '',
        quantity: 1,
        unitPrice: quote.price_subtotal || 0,
        total: quote.price_total || 0,
      }];
    }

    // Create PDF document
    const QuotePDFDocument = React.createElement(
      Document,
      {},
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        // Header
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(
            View,
            { style: styles.headerLeft },
            React.createElement(Text, { style: styles.companyName }, pdfData.company.name),
            React.createElement(Text, {}, pdfData.company.address),
            React.createElement(Text, {}, pdfData.company.city),
            React.createElement(Text, {}, `Tél: ${pdfData.company.phone}`),
            React.createElement(Text, {}, pdfData.company.email),
            React.createElement(Text, {}, `SIRET: ${pdfData.company.siret}`)
          ),
          React.createElement(
            View,
            { style: styles.headerRight },
            React.createElement(Text, { style: styles.title }, 'DEVIS'),
            React.createElement(Text, {}, `N° ${pdfData.quoteNumber}`),
            React.createElement(Text, {}, `Date: ${pdfData.date}`)
          )
        ),
        // Client info
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, 'Client'),
          React.createElement(Text, {}, pdfData.client.name),
          React.createElement(Text, {}, pdfData.client.address),
          React.createElement(Text, {}, pdfData.client.city),
          React.createElement(Text, {}, `Email: ${pdfData.client.email}`),
          pdfData.client.phone && React.createElement(Text, {}, `Tél: ${pdfData.client.phone}`)
        ),
        // Items table
        React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableHeader },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 3 } }, 'Description'),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1, textAlign: 'center' } }, 'Qté'),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1, textAlign: 'right' } }, 'Prix Unit.'),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1, textAlign: 'right' } }, 'Total HT')
          ),
          ...pdfData.items.map((item: any, index: number) =>
            React.createElement(
              View,
              { key: index, style: styles.tableRow },
              React.createElement(
                View,
                { style: { ...styles.tableCell, flex: 3 } },
                React.createElement(Text, {}, item.description),
                item.details && React.createElement(Text, { style: { fontSize: 8, color: '#6b7280', marginTop: 2 } }, item.details)
              ),
              React.createElement(Text, { style: { ...styles.tableCell, flex: 1, textAlign: 'center' } }, item.quantity.toString()),
              React.createElement(Text, { style: { ...styles.tableCell, flex: 1, textAlign: 'right' } }, `${item.unitPrice.toFixed(2)} €`),
              React.createElement(Text, { style: { ...styles.tableCell, flex: 1, textAlign: 'right' } }, `${item.total.toFixed(2)} €`)
            )
          )
        ),
        // Totals
        React.createElement(
          View,
          { style: styles.totals },
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(Text, { style: styles.totalLabel }, 'Sous-total HT:'),
            React.createElement(Text, { style: styles.totalValue }, `${pdfData.subtotal.toFixed(2)} €`)
          ),
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(Text, { style: styles.totalLabel }, `TVA (${pdfData.vatRate}%):`),
            React.createElement(Text, { style: styles.totalValue }, `${pdfData.vat.toFixed(2)} €`)
          ),
          React.createElement(
            View,
            { style: { ...styles.totalRow, borderTop: 2, borderTopColor: colors.primary, paddingTop: 5, marginTop: 5 } },
            React.createElement(Text, { style: { ...styles.totalLabel, fontSize: 12 } }, 'Total TTC:'),
            React.createElement(Text, { style: { ...styles.totalValue, fontSize: 12, fontWeight: 'bold' } }, `${pdfData.total.toFixed(2)} €`)
          )
        ),
        // Notes
        pdfData.notes && React.createElement(
          View,
          { style: { ...styles.section, marginTop: 30 } },
          React.createElement(Text, { style: styles.sectionTitle }, 'Notes'),
          React.createElement(Text, {}, pdfData.notes)
        ),
        // Footer
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(Text, {}, 'Devis valable 30 jours - Conditions de paiement: 30% à la commande, solde à la livraison'),
          React.createElement(Text, {}, `${pdfData.company.name} - SIRET: ${pdfData.company.siret}`)
        )
      )
    );

    console.log('🔵 Rendering PDF...');
    const pdfBuffer = await renderToBuffer(QuotePDFDocument);
    console.log('✅ PDF rendered successfully');

    // Upload to storage with organized path: pdf/{quote_id}/devis-XXX.pdf
    const fileName = `pdf/${quoteId}/devis-${pdfData.quoteNumber}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('quote-documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Error uploading PDF:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('✅ PDF uploaded to storage');

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('quote-documents')
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;

    // Update quote with PDF URL
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ pdf_url: pdfUrl })
      .eq('id', quoteId);

    if (updateError) {
      console.error('❌ Error updating quote:', updateError);
      throw new Error('Failed to update quote with PDF URL');
    }

    console.log('✅ Quote updated with PDF URL');

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl,
        message: 'PDF generated and stored successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Error in generate-quote-pdf:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
