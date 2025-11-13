import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminGmailConfig } from "@/components/AdminGmailConfig";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();

    // Listen for auth changes (for OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          await checkAdminRole(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    console.log('🔵 [Admin] Checking admin role for user:', userId);
    try {
      const { data: hasAdminRole, error } = await supabase.rpc('has_role' as any, {
        _user_id: userId,
        _role: 'admin'
      });

      console.log('🔵 [Admin] has_role result:', { hasAdminRole, error });

      if (error) {
        console.error('❌ [Admin] RPC error:', error);
        throw error;
      }

      if (hasAdminRole) {
        console.log('✅ [Admin] User is admin, granting access');
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        console.log('❌ [Admin] User is not admin, denying access');
        await supabase.auth.signOut();
        toast.error("Accès refusé : vous n'avez pas les droits administrateur");
        navigate('/admin/login', { replace: true });
      }
    } catch (error) {
      console.error('❌ [Admin] Error checking admin role:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      await checkAdminRole(user.id);
    } catch (error) {
      console.error('Error during auth check:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

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