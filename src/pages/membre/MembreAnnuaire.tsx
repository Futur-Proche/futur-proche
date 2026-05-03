import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useState } from "react";

const MembreAnnuaire = () => {
  const [search, setSearch] = useState("");

  const { data: members, isLoading } = useQuery({
    queryKey: ["members-directory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("nom");
      if (error) throw error;
      return data;
    },
  });

  const filtered = members?.filter((m) => {
    const term = search.toLowerCase();
    return !term || `${m.prenom} ${m.nom} ${m.entreprise} ${m.poste} ${m.ville} ${m.secteur}`.toLowerCase().includes(term);
  });

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-2">Annuaire des Futuristes</h1>
      <p className="text-white/40 text-sm mb-6">{members?.length ?? 0} membres</p>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher par nom, entreprise, ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-grotesk text-white outline-none"
          style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
        />
      </div>

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered?.map((m) => (
            <div key={m.id} className="rounded-xl p-5 card-lift" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex flex-col items-center text-center">
                {m.photo_url ? (
                  <img src={m.photo_url} alt="" className="w-16 h-16 rounded-full object-cover mb-3" />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-mono mb-3" style={{ background: "hsl(228 30% 20%)", color: "hsl(228 15% 55%)" }}>
                    {m.prenom[0]}{m.nom[0]}
                  </div>
                )}
                <p className="text-white font-grotesk font-medium text-sm">{m.prenom} {m.nom}</p>
                <p className="text-white/40 text-xs mt-0.5">{m.poste}</p>
                <p className="text-white/30 text-xs">{m.entreprise}</p>
                {m.ville && <p className="text-primary/60 text-[10px] font-mono uppercase mt-1">{m.ville}</p>}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary text-xs mt-2 hover:underline">
                    LinkedIn →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembreAnnuaire;
