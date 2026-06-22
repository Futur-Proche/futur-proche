import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Erreur de connexion", description: "Email ou mot de passe incorrect.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check if user is admin to redirect accordingly
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData) {
        navigate("/admin");
      } else {
        navigate("/espace-membre");
      }
    }
    setLoading(false);
  };

  const inputClass = "w-full rounded-lg border px-4 py-3 text-sm font-grotesk outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <>
      <Seo title={"Connexion — futur proche"} description={"Connectez-vous à votre espace Futuriste sur futur proche."} path={"/login"} noindex />
      <Navbar />
      <main>
        <section className="section-navy relative min-h-screen flex items-center justify-center">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-grotesk font-bold text-white mb-2">
                Espace <span className="font-serif-accent text-primary italic">Futuriste</span>
              </h1>
              <p className="text-white/50 text-sm">Connectez-vous à votre espace membre.</p>
            </div>

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
              <div>
                <label className="block text-sm font-grotesk font-medium text-white/70 mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  style={{ background: "hsl(228 40% 12%)", borderColor: "hsl(228 30% 25%)", color: "white" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground px-7 py-3 rounded-lg font-grotesk font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Connexion..." : "Se connecter →"}
              </button>
              <p className="text-center text-xs pt-1">
                <Link to="/mot-de-passe-oublie" className="text-white/40 hover:text-primary transition-colors">
                  Mot de passe oublié ?
                </Link>
              </p>
            </form>

            <p className="text-center text-white/30 text-xs mt-6">
              Pas encore membre ?{" "}
              <Link to="/candidater" className="text-primary hover:underline">Candidater</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Login;
