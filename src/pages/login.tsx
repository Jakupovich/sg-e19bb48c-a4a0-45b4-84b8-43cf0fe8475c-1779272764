import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Molimo unesite email i lozinku");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Pogrešan email ili lozinka");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Prijava - ALZA Grijanje i Hlađenje"
        description="Prijavite se na Vaš ALZA nalog"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />

        <div className="container flex items-center justify-center min-h-screen py-32">
          <GlassCard className="w-full max-w-md" glow="blue">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-mono font-bold gradient-blue mb-2">
                Dobrodošli Nazad
              </h1>
              <p className="text-muted-foreground">
                Prijavite se na Vaš ALZA nalog
              </p>
            </div>

            {error && (
              <Alert className="mb-6 border-destructive bg-destructive/10">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Lozinka
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>

              <NeonButton
                type="submit"
                variant="blue"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Prijavi se
                  </>
                )}
              </NeonButton>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Nemate nalog?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-primary hover:underline font-medium"
                >
                  Registrujte se
                </button>
              </p>
              
              <p className="text-xs text-muted-foreground">
                Admin pristup?{" "}
                <button
                  onClick={() => router.push("/admin/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Admin Login
                </button>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}