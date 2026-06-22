import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Seo } from "@/components/Seo";

const EvenementSuccess = () => {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"pending" | "confirmed">(sessionId ? "pending" : "confirmed");

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      const { data } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setStatus("confirmed");
        return;
      }
      if (attempts < 8) {
        setTimeout(tick, 1500);
      } else {
        setStatus("confirmed"); // give up waiting, show success anyway
      }
    };
    tick();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <>
      <Seo title={"Inscription confirmée — futur proche"} description={"Votre inscription à l'événement futur proche est confirmée."} path={"/evenements/success"} noindex />
      <Navbar />
      <main className="section-navy min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-xl text-center">
          {status === "pending" ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h1 className="text-3xl md:text-4xl font-grotesk font-bold text-white mb-3">Confirmation en cours…</h1>
              <p className="text-white/60 mb-8">
                Nous finalisons votre inscription. Cela ne prend que quelques secondes.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-grotesk font-bold text-white mb-3">Inscription confirmée</h1>
              <p className="text-white/60 mb-8">
                Votre inscription a bien été enregistrée. À très vite !
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={`/evenements/${slug}`} className="px-6 py-3 rounded-lg font-grotesk font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90">
                  Revenir à l'événement
                </Link>
                <Link to="/espace-membre" className="px-6 py-3 rounded-lg font-grotesk font-semibold text-sm text-white/70 hover:text-white" style={{ border: "1px solid hsl(228 30% 22%)" }}>
                  Mon espace membre
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EvenementSuccess;
