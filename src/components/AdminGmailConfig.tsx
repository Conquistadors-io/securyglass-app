import React from 'react';
import { AdminQuotesList } from "./AdminQuotesList";

/**
 * AdminGmailConfig - Interface admin simplifiée
 * 
 * Affiche uniquement la liste des devis avec barre de recherche.
 * Permet de rechercher par nom, prénom, raison sociale, téléphone, email, numéro de devis.
 */
export const AdminGmailConfig = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <AdminQuotesList />
      </div>
    </div>
  );
};