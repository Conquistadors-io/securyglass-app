import React from 'react';
import { AdminQuotesList } from "./AdminQuotesList";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
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
        <AdminQuotesList />
      </div>
    </div>
  );
};