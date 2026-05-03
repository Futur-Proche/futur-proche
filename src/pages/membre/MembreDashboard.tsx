import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const MembreDashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: nextEvent } = useQuery({
    queryKey: ["next-event"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("statut", "published").gte("date", new Date().toISOString().split("T")[0]).order("date").limit(1).maybeSingle();
      return data;
    },
  });

  const { data: recentResources } = useQuery({
    queryKey: ["recent-resources"],
    queryFn: async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false }).limit(3);
      return data;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-1">
        Bienvenue{profile ? `, ${profile.prenom}` : ""} 👋
      </h1>
      <p className="text-white/40 text-sm mb-8">Votre espace membre futur proche.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next event */}
        <div className="rounded-xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-white/40">Prochain événement</span>
          </div>
          {nextEvent ? (
            <div>
              <p className="text-white font-grotesk font-medium mb-1">{nextEvent.titre}</p>
              <p className="text-white/40 text-sm">
                {new Date(nextEvent.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {nextEvent.ville}
              </p>
              <Link to="/espace-membre/evenements" className="inline-block mt-3 text-primary text-sm hover:underline">
                Voir les événements →
              </Link>
            </div>
          ) : (
            <p className="text-white/30 text-sm">Aucun événement à venir.</p>
          )}
        </div>

        {/* Recent resources */}
        <div className="rounded-xl p-6" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-white/40">Dernières ressources</span>
          </div>
          {recentResources?.length ? (
            <div className="space-y-2">
              {recentResources.map((r) => (
                <p key={r.id} className="text-white/60 text-sm">{r.titre}</p>
              ))}
              <Link to="/espace-membre/ressources" className="inline-block mt-2 text-primary text-sm hover:underline">
                Toutes les ressources →
              </Link>
            </div>
          ) : (
            <p className="text-white/30 text-sm">Aucune ressource disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembreDashboard;
