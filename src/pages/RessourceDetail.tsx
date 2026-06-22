import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lock, ArrowLeft, Clock, ExternalLink, Globe, User } from "lucide-react";
import { Seo } from "@/components/Seo";

const typeLabels: Record<string, string> = {
  etude: "Étude",
  synthese: "Synthèse",
  podcast: "Podcast",
  newsletter: "Newsletter",
  article: "Article",
  guide: "Guide",
  template: "Template",
  autre: "Ressource",
};

const RessourceDetail = () => {
  const { slug } = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const { data: resource, isLoading, error } = useQuery({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading || authLoading) {
    return (
      <>
        <Navbar />
        <main className="section-cream min-h-screen pt-32 pb-20">
          <div className="container mx-auto px-6 text-center text-sm" style={{ color: "hsl(228 15% 45%)" }}>
            Chargement…
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!resource || error) {
    return <Navigate to="/ressources" replace />;
  }

  const canSeeFullContent = resource.is_public || !!user;
  const dateLabel = resource.published_at
    ? new Date(resource.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const seoDesc =
    (resource.extrait as string | null)?.slice(0, 155) ??
    `${resource.titre} — Ressource futur proche pour les leaders Marketing & Comm.`;

  return (
    <>
      <Seo
        title={`${resource.titre} — futur proche`}
        description={seoDesc}
        path={`/ressources/${slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: resource.titre,
          author: resource.auteur ? { "@type": "Person", name: resource.auteur } : undefined,
          datePublished: resource.published_at ?? undefined,
          description: seoDesc,
          publisher: { "@type": "Organization", name: "futur proche" },
        }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="section-navy relative pt-32 pb-16">
          <div className="dot-grid" />
          <div className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl">
            <Link
              to="/ressources"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Toutes les ressources
            </Link>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                — {typeLabels[resource.type] ?? resource.type}
              </span>
              {resource.is_public ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400/80">
                  <Globe className="w-3 h-3" /> Accès libre
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-primary/80">
                  <Lock className="w-3 h-3" /> Réservé aux Futuristes
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-grotesk font-bold tracking-tight text-white leading-[1.1] mb-5">
              {resource.titre}
            </h1>

            {resource.extrait && (
              <p className="text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
                {resource.extrait}
              </p>
            )}

            <div className="flex items-center gap-5 mt-6 text-xs font-mono text-white/40">
              {resource.auteur && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3 h-3" /> {resource.auteur}
                </span>
              )}
              {resource.temps_lecture && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {resource.temps_lecture} min de lecture
                </span>
              )}
              {dateLabel && <span>{dateLabel}</span>}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="section-cream">
          <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20 max-w-3xl">
            {resource.image_url && (
              <img
                src={resource.image_url}
                alt={resource.titre}
                className="w-full rounded-2xl mb-10"
                style={{ border: "1px solid hsl(228 10% 85%)" }}
              />
            )}

            {canSeeFullContent ? (
              <>
                {resource.contenu ? (
                  <article
                    className="prose-content font-grotesk text-base md:text-[17px] leading-[1.75]"
                    style={{ color: "hsl(228 25% 20%)" }}
                    dangerouslySetInnerHTML={{ __html: resource.contenu }}
                  />
                ) : (
                  <p className="text-base leading-relaxed" style={{ color: "hsl(228 15% 40%)" }}>
                    {resource.description}
                  </p>
                )}

                {(resource.url || resource.file_url) && (
                  <div className="mt-10 pt-8 border-t" style={{ borderColor: "hsl(228 10% 85%)" }}>
                    <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: "hsl(186 60% 32%)" }}>
                      — Aller plus loin
                    </p>
                    <a
                      href={resource.url ?? resource.file_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-grotesk font-medium"
                      style={{ background: "hsl(228 56% 10%)", color: "hsl(36 29% 93%)" }}
                    >
                      Ouvrir la ressource <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div>
                {/* Teaser visible to all */}
                {resource.extrait ? (
                  <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "hsl(228 25% 25%)" }}>
                    {resource.extrait}
                  </p>
                ) : resource.description ? (
                  <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "hsl(228 25% 25%)" }}>
                    {resource.description}
                  </p>
                ) : null}

                {/* Gated overlay */}
                <div
                  className="relative rounded-2xl p-8 md:p-12 text-center mt-10 overflow-hidden"
                  style={{
                    background: "hsl(228 56% 10%)",
                    color: "hsl(36 29% 93%)",
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: "radial-gradient(hsl(36 29% 93%) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative">
                    <Lock className="w-7 h-7 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl md:text-2xl font-grotesk font-semibold mb-3">
                      La suite est <span className="font-serif-accent italic text-primary">réservée aux Futuristes</span>.
                    </h3>
                    <p className="text-sm md:text-base text-white/70 max-w-md mx-auto mb-6">
                      Connectez-vous pour accéder à l'intégralité du contenu, ou rejoignez la communauté.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link
                        to="/login"
                        className="px-5 py-2.5 rounded-full text-sm font-grotesk font-medium"
                        style={{ background: "hsl(228 30% 18%)", color: "hsl(36 29% 93%)" }}
                      >
                        Se connecter
                      </Link>
                      <Link
                        to="/candidater"
                        className="px-5 py-2.5 rounded-full text-sm font-grotesk font-semibold bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Devenir Futuriste →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RessourceDetail;
