import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, CheckCircle, AlertCircle, Settings, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminMotifDescriptions } from "./AdminMotifDescriptions";
import { GmailConnection } from "./GmailConnection";
import { AdminQuotePreview } from "./AdminQuotePreview";
import { AdminQuotesList } from "./AdminQuotesList";

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
            <h1 className="text-3xl font-bold text-foreground">Administration</h1>
            <p className="text-muted-foreground">Configurez Gmail et les descriptions de devis</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="devis" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="devis">Devis</TabsTrigger>
            <TabsTrigger value="gmail">Configuration Gmail</TabsTrigger>
            <TabsTrigger value="motifs">Descriptions de Motifs</TabsTrigger>
            <TabsTrigger value="preview">Aperçu PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="devis">
            <AdminQuotesList />
          </TabsContent>

          <TabsContent value="gmail">
            <GmailConnection 
              isConnected={isConnected}
              connectedEmail={connectedEmail}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </TabsContent>

          <TabsContent value="motifs">
            <AdminMotifDescriptions />
          </TabsContent>

          <TabsContent value="preview">
            <AdminQuotePreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};