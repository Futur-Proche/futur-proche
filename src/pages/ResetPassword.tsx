import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase handles the recovery session automatically on this page when
    // arriving via the recovery email link (type=recovery in URL hash).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Check current session in case event already fired
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Mot de passe trop court", description: "8 caractères minimum.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Mots de passe différents", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Mot de passe mis à jour ✓" });
    navigate("/espace-membre");
  };

  const inputClass = "w-full rounded-lg border px-4 py-3 text-sm font-grotesk outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <>
      <Seo title={"Nouveau mot de passe — futur proche"} description={"Définissez un nouveau mot de passe pour votre compte Futuriste."} path={"/reinitialiser-mot-de-passe"} noindex />
      <Navbar />
      <main>
        <section className="section-navy relative min-h-screen flex items-center justify-center">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-grotesk font-bold text-white mb-2">
                Nouveau <span className="font-serif-accent text-primary italic">mot de passe</span>
              </h1>
              <p className="text-white/50 text-sm">Choisissez un nouveau mot de passe pour votre compte.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              {!ready && (
                <p className="text-white/40 text-xs">Validation du lien en cours…</p>
              )}
              <div>
                <label className="block text-sm font-grotesk font-medium text-white/70 mb-1.5">Nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  style={{ background: "hsl(228 40% 12%)", borderColor: "hsl(228 30% 25%)", color: "white" }}
                />
              </div>
              <div>
                <label className="block text-sm font-grotesk font-medium text-white/70 mb-1.5">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                  style={{ background: "hsl(228 40% 12%)", borderColor: "hsl(228 30% 25%)", color: "white" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !ready}
                className="w-full bg-primary text-primary-foreground px-7 py-3 rounded-lg font-grotesk font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Mise à jour..." : "Mettre à jour →"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ResetPassword;
