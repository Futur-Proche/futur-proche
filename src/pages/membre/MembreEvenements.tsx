import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, MapPin, Users, CreditCard } from "lucide-react";

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Événement",
};

const MembreEvenements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: events } = useQuery({
    queryKey: ["member-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").in("statut", ["published", "past"]).order("date", { ascending: false });
      return data ?? [];
    },
  });

  const { data: myRegistrations } = useQuery({
    queryKey: ["my-registrations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("event_registrations").select("event_id, statut").eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from("event_registrations").insert({ event_id: eventId, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-registrations"] });
      toast({ title: "Inscription confirmée !" });
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events?.filter((e) => e.date >= today && e.statut === "published") ?? [];
  const past = events?.filter((e) => e.date < today || e.statut === "past") ?? [];

  const isRegistered = (eventId: string) => myRegistrations?.some((r) => r.event_id === eventId && r.statut !== "cancelled");

  const EventCard = ({ ev, isPast }: { ev: any; isPast?: boolean }) => (
    <div className="rounded-xl overflow-hidden" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
      {/* Poster */}
      <div className="relative p-6 min-h-[140px]" style={{ background: "linear-gradient(135deg, hsl(228 56% 12%) 0%, hsl(248 60% 20%) 50%, hsl(228 56% 12%) 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(186 79% 47% / 0.15) 0%, transparent 60%)" }} />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary">{formatLabels[ev.format]}</span>
            <h3 className="text-lg font-grotesk font-bold text-white mt-1">{ev.titre}</h3>
            {ev.description && <p className="text-white/40 text-xs mt-1 line-clamp-2">{ev.description}</p>}
          </div>
          <div className="flex-shrink-0 text-center rounded-lg px-3 py-2 ml-4" style={{ border: "1px solid hsl(186 79% 47% / 0.3)" }}>
            <p className="text-[10px] font-mono uppercase text-primary">
              {new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}
            </p>
            <p className="text-2xl font-grotesk font-bold text-white">{new Date(ev.date).getDate()}</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-white/40 text-xs">
          {ev.ville && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.ville}</span>}
          {ev.capacite && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.capacite} places</span>}
          {ev.prix && <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" />{Number(ev.prix).toFixed(0)}€</span>}
        </div>
        {!isPast && (
          isRegistered(ev.id) ? (
            <span className="text-xs font-mono text-emerald-400">✓ Inscrit</span>
          ) : ev.prix ? (
            <button disabled className="px-4 py-1.5 rounded-lg text-xs font-grotesk bg-white/10 text-white/40 cursor-not-allowed">
              Bientôt — Stripe
            </button>
          ) : (
            <button
              onClick={() => registerMutation.mutate(ev.id)}
              disabled={registerMutation.isPending}
              className="px-4 py-1.5 rounded-lg text-xs font-grotesk bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              S'inscrire →
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-6">Événements</h1>

      {upcoming.length > 0 && (
        <>
          <h2 className="text-xs font-mono uppercase tracking-wider text-primary mb-4">À venir</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {upcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-4">Passés</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-60">
            {past.map((ev) => <EventCard key={ev.id} ev={ev} isPast />)}
          </div>
        </>
      )}

      {!events?.length && <p className="text-white/40 text-sm">Aucun événement pour le moment.</p>}
    </div>
  );
};

export default MembreEvenements;
