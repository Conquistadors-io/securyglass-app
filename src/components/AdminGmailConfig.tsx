import React, { useState } from 'react';
import { AdminQuotesList } from "./AdminQuotesList";
import { AdminEmailTemplates } from "./admin/sections/AdminEmailTemplates";
import { AdminEmailsHistory } from "./admin/sections/AdminEmailsHistory";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LogOut, FileText, Mail, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * AdminGmailConfig - Interface admin simplifiée
 * 
 * Affiche uniquement la liste des devis avec barre de recherche.
 * Permet de rechercher par nom, prénom, raison sociale, téléphone, email, numéro de devis.
 */
export const AdminGmailConfig = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate('/admin/login', { replace: true });
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Espace Admin</h1>
            <p className="text-sm text-muted-foreground">SECURYGLASS</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="quotes" className="gap-2">
              <FileText className="w-4 h-4" />
              Devis
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <Mail className="w-4 h-4" />
              Templates d'emails
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              Historique emails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes">
            <AdminQuotesList />
          </TabsContent>

          <TabsContent value="templates">
            <AdminEmailTemplates />
          </TabsContent>

          <TabsContent value="history">
            <AdminEmailsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};