import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle, Settings, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminGmailConfig = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check Gmail connection status
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('gmail_credentials')
        .select('user_email, expires_at')
        .gte('expires_at', new Date().toISOString())
        .single();

      if (data && !error) {
        setIsConnected(true);
        setConnectedEmail(data.user_email);
      } else {
        setIsConnected(false);
        setConnectedEmail('');
      }
    } catch (error) {
      console.log('No Gmail connection found');
      setIsConnected(false);
      setConnectedEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleConnect = () => {
    const authUrl = `https://kmeyrlplsvdjxowxmzan.supabase.co/functions/v1/gmail-oauth/authorize`;
    
    // Open popup window
    const popup = window.open(
      authUrl,
      'gmail-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Check if popup was closed (user completed auth)
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Wait a bit then check connection
        setTimeout(() => {
          checkConnection();
          toast({
            title: "Vérification en cours",
            description: "Vérification de la connexion Gmail...",
          });
        }, 1000);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from('gmail_credentials')
        .delete()
        .eq('user_email', connectedEmail);

      if (error) throw error;

      setIsConnected(false);
      setConnectedEmail('');

      toast({
        title: "Déconnecté",
        description: "Votre compte Gmail a été déconnecté.",
      });
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter Gmail.",
        variant: "destructive",
      });
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Vérification de la connexion Gmail...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={handleBackToHome}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuration Gmail</h1>
            <p className="text-muted-foreground">Configurez votre compte Gmail pour l'envoi automatique des devis</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-8">
            <Settings className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Configuration de l'envoi des devis</h2>
            <p className="text-muted-foreground">
              Connectez votre compte Gmail professionnel pour envoyer automatiquement les devis à vos clients
            </p>
          </div>

          {/* Connection Status */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  {isConnected ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-lg">Gmail connecté</span>
                      </div>
                      <span className="text-muted-foreground">{connectedEmail}</span>
                      <p className="text-sm text-green-600 mt-1">✓ Prêt à envoyer des devis</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span className="font-semibold text-lg">Gmail non connecté</span>
                      </div>
                      <p className="text-muted-foreground">Les devis ne peuvent pas être envoyés automatiquement</p>
                    </>
                  )}
                </div>
              </div>
              
              {isConnected ? (
                <Button variant="outline" onClick={handleDisconnect}>
                  Déconnecter
                </Button>
              ) : (
                <Button size="lg" onClick={handleConnect}>
                  Connecter Gmail
                </Button>
              )}
            </div>
          </Card>

          {/* Instructions */}
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">📧 Comment ça fonctionne :</h3>
              <ul className="space-y-1">
                <li>• Une fois votre Gmail connecté, tous les devis seront envoyés depuis votre compte</li>
                <li>• Les clients recevront les devis directement dans leur boîte mail</li>
                <li>• Vous recevrez une copie de chaque devis envoyé</li>
                <li>• L'autorisation Gmail est sécurisée et peut être révoquée à tout moment</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">🔒 Sécurité :</h3>
              <ul className="space-y-1">
                <li>• Seules les permissions d'envoi d'emails sont demandées</li>
                <li>• Vos emails existants ne sont pas accessibles</li>
                <li>• Les tokens sont stockés de manière sécurisée et chiffrée</li>
                <li>• L'autorisation peut être révoquée depuis votre compte Google</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};