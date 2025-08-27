import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GmailConnectionProps {
  onConnectionChange?: (isConnected: boolean, email?: string) => void;
}

export const GmailConnection: React.FC<GmailConnectionProps> = ({ onConnectionChange }) => {
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
        onConnectionChange?.(true, data.user_email);
      } else {
        setIsConnected(false);
        setConnectedEmail('');
        onConnectionChange?.(false);
      }
    } catch (error) {
      console.log('No Gmail connection found');
      setIsConnected(false);
      setConnectedEmail('');
      onConnectionChange?.(false);
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
      onConnectionChange?.(false);

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

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Vérification de la connexion Gmail...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            {isConnected ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Gmail connecté</span>
                </div>
                <span className="text-xs text-muted-foreground">{connectedEmail}</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-sm">Gmail non connecté</span>
                </div>
                <span className="text-xs text-muted-foreground">Connectez Gmail pour envoyer les devis</span>
              </>
            )}
          </div>
        </div>
        
        {isConnected ? (
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Déconnecter
          </Button>
        ) : (
          <Button size="sm" onClick={handleConnect}>
            Connecter Gmail
          </Button>
        )}
      </div>
    </Card>
  );
};