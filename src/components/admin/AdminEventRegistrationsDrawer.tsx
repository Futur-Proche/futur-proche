import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { X, Lock, Unlock, Users as UsersIcon, Mail } from "lucide-react";

interface RegistrationRow {
  id: string;
  user_id: string | null;
  is_guest: boolean;
  statut: string;
  guest_email: string | null;
  guest_prenom: string | null;
  guest_nom: string | null;
  guest_poste: string | null;
  guest_entreprise: string | null;
  stripe_session_id: string | null;
  paid_at: string | null;
  created_at: string;
  prenom: string | null;
  nom: string | null;
  email: string | null;
  poste: string | null;
  entreprise: string | null;
  photo_url: string | null;
}

interface Props {
  event: {
    id: string;
    titre: string;
    capacite: number | null;
    prix: number | null;
    registrations_closed?: boolean;
  };
  onClose: () => void;
}

export const AdminEventRegistrationsDrawer = ({ event, onClose }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: regs, isLoading } = useQuery({
    queryKey: ["admin-event-regs", event.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_event_registrations_admin", { _event_id: event.id });
      if (error) throw error;
      return (data ?? []) as RegistrationRow[];
    },
  });

  const active = (regs ?? []).filter((r) => r.statut !== "cancelled");
  const isPaid = Number(event.prix ?? 0) > 0;

  const allEmails = active
    .map((r) => r.email ?? r.guest_email)
    .filter((e): e is string => !!e);

  const mailtoAll = allEmails.length
    ? `mailto:?bcc=${encodeURIComponent(allEmails.join(","))}&subject=${encodeURIComponent(event.titre)}`
    : undefined;

  const toggleClosed = useMutation({
    mutationFn: async (closed: boolean) => {
      const { error } = await supabase
        .from("events")
        .update({ registrations_closed: closed })
        .eq("id", event.id);
      if (error) throw error;
    },
    onSuccess: (_d, closed) => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["event-detail"] });
      toast({ title: closed ? "Inscriptions fermées" : "Inscriptions rouvertes" });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="w-full max-w-2xl h-full overflow-y-auto"
        style={{ background: "hsl(228 45% 10%)", borderLeft: "1px solid hsl(228 30% 22%)" }}
      >
        <div className="sticky top-0 z-10 p-5 flex items-start justify-between border-b" style={{ background: "hsl(228 45% 10%)", borderColor: "hsl(228 30% 22%)" }}>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary">Inscrits</p>
            <h2 className="text-xl font-grotesk font-bold text-white mt-1">{event.titre}</h2>
            <p className="text-sm text-white/60 mt-1 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              {active.length}
              {event.capacite ? ` / ${event.capacite}` : ""} inscrit{active.length > 1 ? "s" : ""}
              {event.capacite && active.length >= event.capacite && (
                <span className="ml-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-400/15 text-red-400">Complet</span>
              )}
              {event.registrations_closed && (
                <span className="ml-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400">Fermées</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              onClick={() => toggleClosed.mutate(!event.registrations_closed)}
              disabled={toggleClosed.isPending}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-grotesk text-sm transition-colors disabled:opacity-50"
              style={
                event.registrations_closed
                  ? { background: "hsl(186 79% 47%)", color: "hsl(228 56% 10%)" }
                  : { background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)", color: "white" }
              }
            >
              {event.registrations_closed ? (
                <><Unlock className="w-4 h-4" /> Rouvrir</>
              ) : (
                <><Lock className="w-4 h-4" /> Clore les inscriptions</>
              )}
            </button>
            <a
              href={mailtoAll ?? "#"}
              onClick={(e) => { if (!mailtoAll) e.preventDefault(); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-grotesk text-sm transition-colors"
              style={{
                background: "hsl(228 40% 14%)",
                border: "1px solid hsl(228 30% 22%)",
                color: mailtoAll ? "white" : "hsl(0 0% 100% / 0.3)",
                pointerEvents: mailtoAll ? "auto" : "none",
              }}
              title="Email à tous les inscrits (en copie cachée)"
            >
              <Mail className="w-4 h-4" /> Email à tous ({allEmails.length})
            </a>
          </div>

          {isLoading ? (
            <p className="text-white/40 text-sm">Chargement…</p>
          ) : active.length === 0 ? (
            <p className="text-white/40 text-sm italic">Aucun inscrit pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {active.map((r) => {
                const prenom = r.prenom ?? r.guest_prenom ?? "";
                const nom = r.nom ?? r.guest_nom ?? "";
                const email = r.email ?? r.guest_email ?? null;
                const poste = r.poste ?? r.guest_poste ?? null;
                const entreprise = r.entreprise ?? r.guest_entreprise ?? null;
                const isMember = !!r.user_id;
                const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(event.titre)}` : null;
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
                  >
                    {r.photo_url ? (
                      <img src={r.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white/60" style={{ background: "hsl(228 40% 18%)" }}>
                        {prenom[0] ?? "?"}{nom[0] ?? "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-grotesk font-semibold text-white truncate">
                        {prenom} {nom}
                      </p>
                      <p className="text-xs text-white/50 truncate">{email ?? "—"}</p>
                      {(poste || entreprise) && (
                        <p className="text-[11px] text-primary/70 truncate">
                          {poste}{poste && entreprise ? " · " : ""}{entreprise}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isMember ? "bg-primary/15 text-primary" : "bg-white/10 text-white/60"
                        }`}
                      >
                        {isMember ? "Membre" : "Invité"}
                      </span>
                      {isPaid && (
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            r.paid_at
                              ? "bg-emerald-400/15 text-emerald-400"
                              : "bg-yellow-400/15 text-yellow-400"
                          }`}
                        >
                          {r.paid_at ? "Payé" : "En attente"}
                        </span>
                      )}
                      {mailto && (
                        <a
                          href={mailto}
                          className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono text-white/50 hover:text-primary"
                          title={`Email ${email}`}
                        >
                          <Mail className="w-3 h-3" /> Contacter
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
