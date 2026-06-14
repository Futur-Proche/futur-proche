import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Headphones, FileText, BookOpen, ArrowRight, Lock } from "lucide-react";

const typeMeta: Record<string, { label: string; icon: any }> = {
  podcast: { label: "Podcast", icon: Headphones },
  etude: { label: "Étude", icon: BookOpen },
  article: { label: "Article", icon: FileText },
  guide: { label: "Guide", icon: FileText },
  template: { label: "Template", icon: FileText },
};

export const RessourcesTeaserSection = () => {
  const { data: items } = useQuery({
    queryKey: ["home-resources"],
    queryFn: async () => {
      const { data } = await supabase
        .from("resources")
        .select("id, titre, description, type, access, url, file_url, published_at")
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
    <section className="section-navy relative">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="section-label">— Ressources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight text-white">
              Podcast, études, frameworks <span className="font-serif-accent italic text-primary">à portée de main.</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/60">
              Les contenus produits par et pour les Futuristes — épisodes longs, études sectorielles, cas concrets.
            </p>
          </div>
          <Link to="/ressources" className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-grotesk font-medium text-primary group">
            Toutes les ressources <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((r) => {
            const meta = typeMeta[r.type] ?? { label: r.type, icon: FileText };
            const Icon = meta.icon;
            const isMembers = r.access === "members";
            const dateLabel = r.published_at
              ? new Date(r.published_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
              : "";
            return (
              <Link
                key={r.id}
                to="/ressources"
                className="group rounded-2xl p-5 block card-lift"
                style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(186 79% 47% / 0.12)" }}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {isMembers && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-white/50">
                      <Lock className="w-3 h-3" /> Membres
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary">{meta.label}</span>
                <h3 className="text-base font-grotesk font-semibold text-white mt-1.5 mb-2 leading-snug line-clamp-2">{r.titre}</h3>
                {r.description && (
                  <p className="text-xs text-white/55 leading-relaxed line-clamp-3 mb-3">{r.description}</p>
                )}
                {dateLabel && <p className="text-[10px] font-mono uppercase text-white/30">{dateLabel}</p>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RessourcesTeaserSection;
