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
import { Loader2, UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Molimo popunite sva polja");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne poklapaju");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera");
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Update profile with full name
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: formData.fullName })
          .eq("id", data.user.id);

        if (profileError) console.error("Profile update error:", profileError);

        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Greška pri registraciji. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Registracija - ALZA Grijanje i Hlađenje"
        description="Napravite besplatan nalog na ALZA platformi"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />

        <div className="container flex items-center justify-center min-h-screen py-32">
          <GlassCard className="w-full max-w-md" glow="blue">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-mono font-bold gradient-blue mb-2">
                Napravite Nalog
              </h1>
              <p className="text-muted-foreground">
                Pridružite se ALZA platformi
              </p>
            </div>

            {success && (
              <Alert className="mb-6 border-green-500 bg-green-50">
                <AlertDescription className="text-green-700">
                  ✅ Uspješno ste se registrovali! Preusmeravamo vas...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-6 border-destructive bg-destructive/10">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Ime i Prezime
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Vaše ime i prezime"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Potvrdite Lozinku
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
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
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Kreiranje naloga...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Registruj se
                  </>
                )}
              </NeonButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Već imate nalog?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Prijavite se
                </button>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}