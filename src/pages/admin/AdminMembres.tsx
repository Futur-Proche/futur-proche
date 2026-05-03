import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useState } from "react";

const AdminMembres = () => {
  const [search, setSearch] = useState("");

  const { data: members, isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = members?.filter((m) => {
    const term = search.toLowerCase();
    return !term || `${m.prenom} ${m.nom} ${m.entreprise} ${m.poste} ${m.ville}`.toLowerCase().includes(term);
  });

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-6">Membres</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-grotesk text-white outline-none"
          style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
        />
      </div>

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((m) => (
            <div key={m.id} className="rounded-xl p-5 card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex items-center gap-3 mb-3">
                {m.photo_url ? (
                  <img src={m.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono" style={{ background: "hsl(228 30% 20%)", color: "hsl(228 15% 55%)" }}>
                    {m.prenom[0]}{m.nom[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-white font-grotesk font-medium truncate">{m.prenom} {m.nom}</p>
                  <p className="text-white/40 text-xs truncate">{m.poste}</p>
                </div>
              </div>
              <p className="text-white/50 text-xs">{m.entreprise || "Indépendant"}</p>
              {m.ville && <p className="text-white/30 text-xs mt-1">{m.ville}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMembres;
