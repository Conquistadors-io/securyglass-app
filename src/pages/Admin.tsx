import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminGmailConfig } from "@/components/AdminGmailConfig";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (isChecking) return;
      setIsChecking(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!mounted) return;

      if (user) {
        await checkAdminRole(user.id);
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
      }

      setIsChecking(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔵 [Admin] Auth event:', event);

        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate('/admin/login', { replace: true });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          if (!isChecking) {
            setIsChecking(true);
            await checkAdminRole(session.user.id);
            setIsChecking(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminRole = async (userId: string) => {
    console.log('🔵 [Admin] Checking admin role for user:', userId);

    try {
      // Créer un timeout de 10 secondes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de vérification des droits')), 10000)
      );

      const rpcPromise = supabase.rpc('has_role' as any, {
        _user_id: userId,
        _role: 'admin'
      });

      const { data: hasAdminRole, error } = await Promise.race([
        rpcPromise,
        timeoutPromise
      ]) as any;

      console.log('🔵 [Admin] has_role result:', { hasAdminRole, error });

      if (error) {
        console.error('❌ [Admin] RPC error:', error);
        setError(`Erreur de vérification des droits: ${error.message}`);
        toast.error(`Erreur de vérification des droits: ${error.message}`);
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      if (hasAdminRole) {
        console.log('✅ [Admin] User is admin, granting access');
        setIsAuthenticated(true);
        setIsLoading(false);
        setError(null);
      } else {
        console.log('❌ [Admin] User is not admin');
        toast.error("Accès refusé : vous n'avez pas les droits administrateur");
        setIsLoading(false);
        setIsAuthenticated(false);
        await supabase.auth.signOut();
        navigate('/admin/login', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ [Admin] Error checking admin role:', error);
      setError(`Erreur: ${error.message || 'Erreur inconnue'}`);
      toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur d'accès</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  setError(null);
                  setIsLoading(true);
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await checkAdminRole(user.id);
                  }
                }}
              >
                Réessayer
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/admin/login', { replace: true });
                }}
              >
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminGmailConfig />;
}