import { supabase } from '@/integrations/supabase/client';
import type { SendQuoteParams, NotifyAdminParams, SendCustomParams, ResendApiResponse } from './types';

export const resendApi = {
  sendQuote: async (params: SendQuoteParams): Promise<ResendApiResponse> => {
    const { data, error } = await supabase.functions.invoke('resend-api', {
      body: { action: 'send-quote', ...params },
    });

    if (error) {
      throw error;
    }

    return data as ResendApiResponse;
  },

  notifyAdmin: async (params: NotifyAdminParams): Promise<ResendApiResponse> => {
    const { data, error } = await supabase.functions.invoke('resend-api', {
      body: { action: 'notify-admin', ...params },
    });

    if (error) {
      throw error;
    }

    return data as ResendApiResponse;
  },

  sendCustom: async (params: SendCustomParams): Promise<ResendApiResponse> => {
    const { data, error } = await supabase.functions.invoke('resend-api', {
      body: { action: 'send-custom', ...params },
    });

    if (error) {
      throw error;
    }

    return data as ResendApiResponse;
  },
};
