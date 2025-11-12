import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface GmailConnectionProps {
  isConnected: boolean;
  connectedEmail: string;
  onConnect: () => void;
  onDisconnect: () => Promise<void>;
}

export const GmailConnection = ({ 
  isConnected, 
  connectedEmail, 
  onConnect, 
  onDisconnect 
}: GmailConnectionProps) => {
  return (
    <Card className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
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
            <Button variant="outline" onClick={onDisconnect}>
              Déconnecter
            </Button>
          ) : (
            <Button size="lg" onClick={onConnect}>
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
  );
};
