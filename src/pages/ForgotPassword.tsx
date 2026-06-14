import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({ title: "Email envoyé", description: "Vérifiez votre boîte de réception." });
  };

  const inputClass = "w-full rounded-lg border px-4 py-3 text-sm font-grotesk outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <>
      <Navbar />
      <main>
        <section className="section-navy relative min-h-screen flex items-center justify-center">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-grotesk font-bold text-white mb-2">
                Mot de passe <span className="font-serif-accent text-primary italic">oublié ?</span>
              </h1>
              <p className="text-white/50 text-sm">
                Saisissez votre email, nous vous enverrons un lien de réinitialisation.
              </p>
            </div>

            {sent ? (
              <div className="rounded-xl p-6 text-center" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <p className="text-white/80 font-grotesk mb-2">Email envoyé ✓</p>
                <p className="text-white/50 text-sm">
                  Si un compte existe pour <strong className="text-white/80">{email}</strong>, vous recevrez un lien de réinitialisation sous quelques minutes.
                </p>
                <Link to="/login" className="inline-block mt-4 text-primary hover:underline text-sm">← Retour à la connexion</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <div>
                  <label className="block text-sm font-grotesk font-medium text-white/70 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    style={{ background: "hsl(228 40% 12%)", borderColor: "hsl(228 30% 25%)", color: "white" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground px-7 py-3 rounded-lg font-grotesk font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Envoi..." : "Envoyer le lien →"}
                </button>
                <p className="text-center text-white/40 text-xs pt-2">
                  <Link to="/login" className="hover:text-white/70">← Retour à la connexion</Link>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;
