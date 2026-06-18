import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

interface Props {
  eventId: string;
  canSeeNames: boolean;
  count: number;
}

type Participant = {
  kind: string;
  user_id: string | null;
  prenom: string | null;
  nom: string | null;
  poste: string | null;
  entreprise: string | null;
  photo_url: string | null;
  linkedin: string | null;
};

export const ParticipantsList = ({ eventId, canSeeNames, count }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["event-participants", eventId],
    enabled: canSeeNames,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_event_participants", { _event_id: eventId });
      if (error) throw error;
      return (data ?? []) as Participant[];
    },
  });

  if (!canSeeNames) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ background: "hsl(228 40% 14%)", border: "1px dashed hsl(228 30% 22%)" }}
      >
        <Lock className="w-5 h-5 mx-auto mb-2 text-white/40" />
        <p className="text-white font-grotesk text-sm mb-1">
          {count} {count > 1 ? "personnes inscrites" : "personne inscrite"}
        </p>
        <p className="text-white/50 text-xs">
          <Link to="/login" className="text-primary hover:underline">Connectez-vous</Link>{" "}
          en tant que membre pour voir qui participe.
        </p>
      </div>
    );
  }

  if (isLoading) return <p className="text-white/40 text-sm">Chargement…</p>;
  if (!data?.length) return <p className="text-white/40 text-sm">Soyez le premier inscrit.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((p, i) => (
        <div
          key={i}
          className="rounded-xl p-4 text-center"
          style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
        >
          {p.photo_url ? (
            <img
              src={p.photo_url}
              alt={`${p.prenom ?? ""} ${p.nom ?? ""}`}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-2 ring-primary/20"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-white/60"
              style={{ background: "hsl(228 40% 18%)" }}
            >
              {(p.prenom?.[0] ?? "?")}
              {(p.nom?.[0] ?? "?")}
            </div>
          )}
          <p className="text-sm font-grotesk font-semibold text-white leading-tight">
            {p.prenom} {p.nom}
          </p>
          {p.poste && <p className="text-[11px] text-white/40 mt-1 leading-tight">{p.poste}</p>}
          {p.entreprise && <p className="text-[11px] text-primary/80 mt-0.5">{p.entreprise}</p>}
          {p.kind === "guest" && (
            <p className="text-[10px] text-white/30 mt-1 font-mono uppercase">invité·e</p>
          )}
        </div>
      ))}
    </div>
  );
};
