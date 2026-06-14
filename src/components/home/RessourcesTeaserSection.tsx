import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Headphones, FileText, BookOpen, ArrowRight, Lock, Globe } from "lucide-react";

const typeMeta: Record<string, { label: string; icon: any }> = {
  podcast: { label: "Podcast", icon: Headphones },
  etude: { label: "Étude", icon: BookOpen },
  synthese: { label: "Synthèse", icon: FileText },
  article: { label: "Article", icon: FileText },
  guide: { label: "Guide", icon: FileText },
  template: { label: "Template", icon: FileText },
  newsletter: { label: "Newsletter", icon: FileText },
  autre: { label: "Ressource", icon: FileText },
};

export const RessourcesTeaserSection = () => {
  const { data: items } = useQuery({
    queryKey: ["home-resources"],
    queryFn: async () => {
      const { data } = await supabase
        .from("resources")
        .select("id, slug, titre, description, extrait, type, is_public, published_at")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const isEmpty = !items || items.length === 0;

  const placeholders = [
    { label: "Podcast", icon: Headphones, titre: "Décisions en coulisses", desc: "Conversations longues avec des CMO sur leurs arbitrages réels." },
    { label: "Étude", icon: BookOpen, titre: "Benchmarks sectoriels", desc: "Données propriétaires Marketing / Comm, par secteur et par taille." },
    { label: "Framework", icon: FileText, titre: "Frameworks de décision", desc: "Templates et grilles éprouvés par les Futuristes pour trancher vite." },
  ];

  return (
    <section className="section-navy relative" style={{ paddingTop: 0 }}>
      <div className="container relative z-10 mx-auto px-6 lg:px-12 pb-20 md:pb-24 pt-4">
        <div className="h-px w-full mb-16" style={{ background: "hsl(228 30% 22%)" }} />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="section-label inline-block mb-3">— Ressources</span>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white">
              Podcast, études, frameworks <span className="font-serif-accent italic text-primary">à portée de main.</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/60">
              Les contenus produits par et pour les Futuristes — épisodes longs, études sectorielles, cas concrets.
            </p>
          </div>
          <Link
            to="/ressources"
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-grotesk font-medium group"
            style={{ color: "hsl(186 79% 47%)" }}
          >
            Toutes les ressources <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {isEmpty ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {placeholders.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.label}
                  className="rounded-2xl bg-white p-5"
                  style={{ border: "1px solid hsl(228 10% 85%)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                      <Icon className="w-5 h-5" style={{ color: "hsl(186 60% 32%)" }} />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>Bientôt</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>{p.label}</span>
                  <h3 className="text-base font-grotesk font-semibold mt-1.5 mb-2 leading-snug" style={{ color: "hsl(228 56% 10%)" }}>{p.titre}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(228 15% 50%)" }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {items!.map((r) => {
              const meta = typeMeta[r.type] ?? { label: r.type, icon: FileText };
              const Icon = meta.icon;
              const dateLabel = r.published_at
                ? new Date(r.published_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                : "";
              const href = r.slug ? `/ressources/${r.slug}` : "/ressources";
              return (
                <Link
                  key={r.id}
                  to={href}
                  className="group rounded-2xl bg-white p-5 block card-lift flex flex-col"
                  style={{ border: "1px solid hsl(228 10% 85%)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                      <Icon className="w-5 h-5" style={{ color: "hsl(186 60% 32%)" }} />
                    </div>
                    {r.is_public ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-emerald-600/80">
                        <Globe className="w-3 h-3" /> Libre
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: "hsl(228 15% 50%)" }}>
                        <Lock className="w-3 h-3" /> Membres
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "hsl(186 60% 32%)" }}>{meta.label}</span>
                  <h3 className="text-base font-grotesk font-semibold mt-1.5 mb-2 leading-snug line-clamp-2" style={{ color: "hsl(228 56% 10%)" }}>{r.titre}</h3>
                  {(r.extrait || r.description) && (
                    <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: "hsl(228 15% 50%)" }}>
                      {r.extrait ?? r.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    {dateLabel && <p className="text-[10px] font-mono uppercase" style={{ color: "hsl(228 15% 60%)" }}>{dateLabel}</p>}
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-medium group-hover:gap-2 transition-all" style={{ color: "hsl(186 60% 32%)" }}>
                      Lire <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RessourcesTeaserSection;
