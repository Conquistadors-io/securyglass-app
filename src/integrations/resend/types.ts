// ─── Resend API Types ────────────────────────────────────

export interface SendQuoteParams {
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

export interface NotifyAdminParams {
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

export interface SendCustomParams {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string[];
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}

export interface ResendApiResponse {
  success: boolean;
  messageId?: string;
  to?: string | string[];
  cc?: string[];
  templateUsed?: string;
  error?: string;
}
