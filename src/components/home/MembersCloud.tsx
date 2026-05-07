import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MembersCloud = () => {
  const { data: members } = useQuery({
    queryKey: ["homepage-members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, prenom, nom, photo_url")
        .not("photo_url", "is", null)
        .limit(30);
      return data ?? [];
    },
  });

  // Fallback placeholders if no members yet
  const placeholders = Array.from({ length: 24 }, (_, i) => ({
    id: `ph-${i}`,
    prenom: ["A", "C", "E", "G", "I", "K", "M", "O", "Q", "S", "U", "W"][i % 12],
    nom: ["B", "D", "F", "H", "J", "L", "N", "P", "R", "T", "V", "X"][i % 12],
    photo_url: null as string | null,
  }));

  const displayMembers = members?.length ? members : placeholders;

  return (
    <section className="section-navy relative">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">La communauté</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-3 text-white">
          Ils sont déjà{" "}
          <span className="font-serif-accent text-primary">Futuristes.</span>
        </h2>
        <p className="text-base max-w-xl mb-10 leading-relaxed text-white/50">
          850+ leaders Marketing / Comm qui échangent chaque jour.
        </p>

        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
          {displayMembers.map((m) => (
            <div key={m.id} className="relative group">
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  alt={`${m.prenom} ${m.nom}`}
                  className="w-14 h-14 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                  style={{ border: "2px solid hsl(228 30% 22%)" }}
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors duration-300"
                  style={{
                    border: "1px solid hsl(228 30% 22%)",
                    background: "hsl(228 40% 14%)",
                    color: "hsl(228 15% 55%)",
                  }}
                >
                  {m.prenom[0]}{m.nom[0]}
                </div>
              )}
            </div>
          ))}
        </div>
        {!members?.length && (
          <p className="text-center text-xs mt-6 font-mono uppercase tracking-wider text-white/30">
            Photos bientôt connectées depuis l'espace admin
          </p>
        )}
      </div>
    </section>
  );
};
