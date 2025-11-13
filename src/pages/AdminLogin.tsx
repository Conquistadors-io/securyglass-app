import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import securyglassLogo from "@/assets/securyglass-logo.png";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: hasAdminRole } = await supabase.rpc('has_role' as any, {
        _user_id: user.id,
        _role: 'admin'
      });
      
      if (hasAdminRole) {
        navigate('/admin', { replace: true });
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role' as any, {
          _user_id: data.user.id,
          _role: 'admin'
        });

        if (roleError) throw roleError;

        if (hasAdminRole) {
          toast.success("Connexion réussie !");
          navigate('/admin', { replace: true });
        } else {
          await supabase.auth.signOut();
          toast.error("Accès refusé : vous n'avez pas les droits administrateur");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion Google");
      console.error("Google login error:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <img src={securyglassLogo} alt="SECURYGLASS" className="h-16 w-auto" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <CardTitle className="text-3xl font-bold">Admin Portal</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Connectez-vous pour accéder à l'espace administrateur
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@securyglass.fr"
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-muted-foreground font-medium">
                OU
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full h-12 text-base font-medium border-2"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </>
            )}
          </Button>

          <div className="text-center pt-4">
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
