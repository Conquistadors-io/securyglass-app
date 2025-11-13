import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Home } from 'lucide-react';
import { toast } from 'sonner';

export const DevisValidation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-validated'>('loading');
  const [quoteNumber, setQuoteNumber] = useState<string>('');

  useEffect(() => {
    const validateQuote = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        toast.error('Lien de validation invalide (token manquant)');
        return;
      }

      try {
        console.log('🔵 Validating quote with token:', token.substring(0, 10) + '...');

        // Chercher le devis par token
        const { data: devis, error: fetchError } = await supabase
          .from('devis')
          .select('id, quote_number, status, client_email')
          .eq('validation_token', token)
          .single();

        if (fetchError || !devis) {
          console.error('❌ Token not found:', fetchError);
          setStatus('error');
          toast.error('Ce lien de validation est invalide ou expiré');
          return;
        }

        setQuoteNumber(devis.quote_number || devis.id);

        // Vérifier si déjà validé
        if (devis.status === 'validated') {
          console.log('⚠️ Quote already validated');
          setStatus('already-validated');
          toast.info('Ce devis a déjà été validé précédemment');
          return;
        }

        // Récupérer l'IP du client
        let clientIp = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          clientIp = ipData.ip;
        } catch (error) {
          console.error('Could not fetch IP:', error);
        }

        // Valider le devis via l'edge function
        const { data: validateData, error: validateError } = await supabase.functions.invoke('validate-quote', {
          body: { 
            devisId: devis.id, 
            status: 'validated',
            validatedAt: new Date().toISOString(),
            validationIp: clientIp
          }
        });

        if (validateError || !validateData?.success) {
          console.error('❌ Validation failed:', validateError);
          setStatus('error');
          toast.error('Impossible de valider le devis. Contactez-nous.');
          return;
        }

        console.log('✅ Quote validated successfully');
        setStatus('success');
        toast.success('Devis validé ! Nous vous recontactons rapidement.');

      } catch (error) {
        console.error('❌ Unexpected error:', error);
        setStatus('error');
        toast.error('Une erreur inattendue s\'est produite');
      }
    };

    validateQuote();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-16 w-16 text-green-500" />}
            {status === 'already-validated' && <CheckCircle2 className="h-16 w-16 text-blue-500" />}
            {status === 'error' && <XCircle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle className="text-3xl font-bold">
            {status === 'loading' && 'Validation en cours...'}
            {status === 'success' && '✅ Devis validé avec succès !'}
            {status === 'already-validated' && 'Devis déjà validé'}
            {status === 'error' && 'Erreur de validation'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === 'loading' && (
            <p className="text-center text-muted-foreground">
              Veuillez patienter pendant que nous validons votre devis...
            </p>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <p className="text-lg font-semibold text-green-900 mb-2">
                  Votre devis <span className="font-mono bg-green-100 px-2 py-1 rounded">{quoteNumber}</span> a été validé !
                </p>
                <p className="text-green-700">
                  Nous avons bien reçu votre confirmation et allons vous recontacter dans les plus brefs délais pour planifier l'intervention.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Prochaines étapes :</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                  <li>Vous recevrez un email de confirmation</li>
                  <li>Notre équipe vous contactera pour convenir d'une date d'intervention</li>
                  <li>Un technicien se rendra sur place selon le rendez-vous convenu</li>
                </ul>
              </div>
            </div>
          )}

          {status === 'already-validated' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-900">
                Ce devis <span className="font-mono bg-blue-100 px-2 py-1 rounded">{quoteNumber}</span> a déjà été validé précédemment.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Si vous avez des questions, n'hésitez pas à nous contacter.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-900 mb-4">
                Le lien de validation semble invalide ou expiré.
              </p>
              <p className="text-sm text-red-700">
                Veuillez contacter notre service client au <strong>09 70 14 43 44</strong> ou par email à <strong>contact@securyglass.fr</strong>
              </p>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
