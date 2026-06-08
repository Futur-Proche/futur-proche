import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  eventId: string;
  visible: boolean;
}

export const ParticipantsList = ({ eventId, visible }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["event-participants", eventId],
    enabled: visible,
    queryFn: async () => {
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("user_id, is_guest, guest_prenom, guest_nom")
        .eq("event_id", eventId)
        .neq("statut", "cancelled");
      if (!regs?.length) return [];
      const userIds = regs.filter((r) => r.user_id).map((r) => r.user_id as string);
      const { data: profiles } = userIds.length
        ? await supabase.from("profiles").select("id, prenom, nom, poste, entreprise, photo_url, linkedin").in("id", userIds)
        : { data: [] as any[] };
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return regs.map((r) => {
        if (r.user_id && map.has(r.user_id)) return { kind: "member", ...map.get(r.user_id)! };
        return { kind: "guest", prenom: r.guest_prenom, nom: r.guest_nom };
      });
    },
  });

  if (!visible) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: "hsl(228 40% 14%)", border: "1px dashed hsl(228 30% 22%)" }}>
        <p className="text-white/50 text-sm">Inscrivez-vous pour voir qui participe.</p>
      </div>
    );
  }

  if (isLoading) return <p className="text-white/40 text-sm">Chargement…</p>;
  if (!data?.length) return <p className="text-white/40 text-sm">Soyez le premier inscrit.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((p: any, i) => (
        <div key={i} className="rounded-xl p-4 text-center" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
          {p.photo_url ? (
            <img src={p.photo_url} alt={`${p.prenom} ${p.nom}`} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-2 ring-primary/20" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold text-white/60" style={{ background: "hsl(228 40% 18%)" }}>
              {(p.prenom?.[0] ?? "?")}{(p.nom?.[0] ?? "?")}
            </div>
          )}
          <p className="text-sm font-grotesk font-semibold text-white leading-tight">{p.prenom} {p.nom}</p>
          {p.poste && <p className="text-[11px] text-white/40 mt-1 leading-tight">{p.poste}</p>}
          {p.entreprise && <p className="text-[11px] text-primary/80 mt-0.5">{p.entreprise}</p>}
        </div>
      ))}
    </div>
  );
};
