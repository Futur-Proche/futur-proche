import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Candidature = Database["public"]["Tables"]["candidatures"]["Row"];

const AdminCandidatures = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const { data: candidatures, isLoading } = useQuery({
    queryKey: ["admin-candidatures", filter],
    queryFn: async () => {
      let q = supabase.from("candidatures").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("statut", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Candidature[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: "approved" | "rejected" }) => {
      const { error } = await supabase
        .from("candidatures")
        .update({ statut, reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { statut }) => {
      qc.invalidateQueries({ queryKey: ["admin-candidatures"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: statut === "approved" ? "Candidature approuvée" : "Candidature refusée" });
    },
  });

  const filters = [
    { key: "pending" as const, label: "En attente" },
    { key: "approved" as const, label: "Approuvées" },
    { key: "rejected" as const, label: "Refusées" },
    { key: "all" as const, label: "Toutes" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-6">Candidatures</h1>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-grotesk transition-colors ${
              filter === f.key ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-white"
            }`}
            style={filter !== f.key ? { background: "hsl(228 40% 14%)" } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : !candidatures?.length ? (
        <p className="text-white/40 text-sm">Aucune candidature.</p>
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => (
            <div key={c.id} className="rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-grotesk font-medium">{c.prenom} {c.nom}</p>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    c.statut === "pending" ? "bg-yellow-400/10 text-yellow-400" :
                    c.statut === "approved" ? "bg-emerald-400/10 text-emerald-400" :
                    "bg-red-400/10 text-red-400"
                  }`}>{c.statut}</span>
                </div>
                <p className="text-white/50 text-sm">{c.poste} · {c.entreprise || "Indépendant"} · {c.secteur}</p>
                <p className="text-white/40 text-xs mt-1">{c.email} · {c.telephone}</p>
                {c.linkedin && (
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-xs mt-1 hover:underline">
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {c.cooptation && <p className="text-white/30 text-xs mt-1">Coopté par : {c.cooptation}</p>}
              </div>
              {c.statut === "pending" && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateStatus.mutate({ id: c.id, statut: "approved" })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-grotesk bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approuver
                  </button>
                  <button
                    onClick={() => updateStatus.mutate({ id: c.id, statut: "rejected" })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-grotesk bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <X className="w-4 h-4" /> Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCandidatures;
