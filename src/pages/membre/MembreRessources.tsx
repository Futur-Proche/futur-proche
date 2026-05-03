import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Globe, ExternalLink } from "lucide-react";

const typeLabels: Record<string, string> = {
  etude: "Étude",
  synthese: "Synthèse",
  podcast: "Podcast",
  newsletter: "Newsletter",
  autre: "Autre",
};

const MembreRessources = () => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["member-resources"],
    queryFn: async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-2">Ressources</h1>
      <p className="text-white/40 text-sm mb-6">Études, synthèses, podcasts et plus encore.</p>

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : !resources?.length ? (
        <p className="text-white/30 text-sm">Aucune ressource disponible.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r) => (
            <div key={r.id} className="rounded-xl p-5 card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/40">{typeLabels[r.type]}</span>
                {r.access === "members" ? <Lock className="w-3 h-3 text-yellow-400" /> : <Globe className="w-3 h-3 text-emerald-400" />}
              </div>
              <h3 className="text-white font-grotesk font-medium mb-1">{r.titre}</h3>
              {r.description && <p className="text-white/40 text-xs line-clamp-2 mb-3">{r.description}</p>}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-xs hover:underline">
                  Accéder <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembreRessources;
