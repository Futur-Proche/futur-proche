import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, MapPin, Users, CreditCard, ChevronDown, ChevronUp, LayoutGrid, List } from "lucide-react";
import { ParticipantsList } from "@/components/event/ParticipantsList";

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Événement",
};

const MembreEvenements = () => {
  const { user } = useAuth();
  const [openParticipants, setOpenParticipants] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [villeFilter, setVilleFilter] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

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

  const today = new Date().toISOString().split("T")[0];

  const villes = useMemo(
    () => Array.from(new Set((events ?? []).map((e) => e.ville).filter(Boolean))).sort() as string[],
    [events]
  );
  const types = useMemo(
    () => Array.from(new Set((events ?? []).map((e) => e.format).filter(Boolean))).sort() as string[],
    [events]
  );

  const matchesFilters = (e: { format: string; ville: string | null }) =>
    (typeFilter === "all" || e.format === typeFilter) &&
    (villeFilter === "all" || e.ville === villeFilter);

  const allUpcoming = (events ?? []).filter((e) => e.date >= today && e.statut === "published");
  const allPast = (events ?? []).filter((e) => e.date < today || e.statut === "past");

  const upcoming = allUpcoming.filter(matchesFilters);
  const past = allPast.filter(matchesFilters);

  const myUpcoming = upcoming.filter((ev) => myRegistrations?.some((r) => r.event_id === ev.id && r.statut !== "cancelled"));
  const otherUpcoming = upcoming.filter((ev) => !myRegistrations?.some((r) => r.event_id === ev.id && r.statut !== "cancelled"));

  const myPast = past.filter((ev) => myRegistrations?.some((r) => r.event_id === ev.id && r.statut !== "cancelled"));
  const otherPast = past.filter((ev) => !myRegistrations?.some((r) => r.event_id === ev.id && r.statut !== "cancelled"));

  const isRegistered = (eventId: string) => myRegistrations?.some((r) => r.event_id === eventId && r.statut !== "cancelled");

  const selectClass = "px-3 py-2.5 rounded-lg text-sm font-grotesk text-white outline-none";
  const selectStyle = { background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" };

  const EventRow = ({ ev, isPast }: { ev: any; isPast?: boolean }) => (
    <Link
      to={`/evenements/${ev.slug ?? ev.id}`}
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 border-b items-center hover:bg-white/[0.02]"
      style={{ borderColor: "hsl(228 30% 22%)" }}
    >
      <div className="md:col-span-1 text-center rounded-md py-1 px-2" style={{ background: "hsl(228 56% 10%)" }}>
        <p className="text-[9px] font-mono uppercase text-primary">{new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}</p>
        <p className="text-base font-grotesk font-bold text-white">{new Date(ev.date).getDate()}</p>
      </div>
      <div className="md:col-span-5">
        <p className="text-sm font-grotesk font-semibold text-white">{ev.titre}</p>
        <p className="text-[10px] font-mono uppercase tracking-wider text-primary mt-0.5">{formatLabels[ev.format] ?? ev.format}</p>
      </div>
      <span className="md:col-span-2 text-white/60 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.ville ?? "—"}</span>
      <span className="md:col-span-1 text-white/50 text-xs">{ev.capacite ? `${ev.capacite} pl.` : "—"}</span>
      <span className="md:col-span-1 text-white/50 text-xs">{ev.prix ? `${Number(ev.prix).toFixed(0)}€` : "Gratuit"}</span>
      <div className="md:col-span-2 md:text-right text-xs">
        {!isPast && isRegistered(ev.id) ? (
          <span className="font-mono text-emerald-400">✓ Inscrit</span>
        ) : !isPast ? (
          <span className="text-primary font-mono">Voir & s'inscrire →</span>
        ) : (
          <span className="text-white/40 font-mono">A eu lieu</span>
        )}
      </div>
    </Link>
  );

  const EventCard = ({ ev, isPast }: { ev: any; isPast?: boolean }) => (
    <div className="rounded-xl overflow-hidden" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
      <Link to={`/evenements/${ev.slug ?? ev.id}`} className="block">
        <div className="relative p-6 min-h-[140px]" style={{ background: "linear-gradient(135deg, hsl(228 56% 12%) 0%, hsl(248 60% 20%) 50%, hsl(228 56% 12%) 100%)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(186 79% 47% / 0.15) 0%, transparent 60%)" }} />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                {formatLabels[ev.format]}{ev.is_open_to_all && " · Ouvert à tous"}
              </span>
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
      </Link>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-white/40 text-xs">
          {ev.ville && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.ville}</span>}
          {ev.capacite && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.capacite} places</span>}
          {ev.prix && <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" />{Number(ev.prix).toFixed(0)}€</span>}
        </div>
        {!isPast && (
          isRegistered(ev.id) ? (
            <span className="text-xs font-mono text-emerald-400">✓ Inscrit</span>
          ) : (
            <Link
              to={`/evenements/${ev.slug ?? ev.id}`}
              className="px-4 py-1.5 rounded-lg text-xs font-grotesk bg-primary text-primary-foreground hover:opacity-90"
            >
              Voir & s'inscrire →
            </Link>
          )
        )}
      </div>
    </div>
  );

  const renderSection = (title: string, color: string, items: any[], isPast?: boolean) => {
    if (items.length === 0) return null;
    return (
      <>
        <h2 className={`text-xs font-mono uppercase tracking-wider ${color} mb-4`}>{title}</h2>
        {view === "grid" ? (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 ${isPast ? "opacity-60" : ""}`}>
            {items.map((ev) => <EventCard key={ev.id} ev={ev} isPast={isPast} />)}
          </div>
        ) : (
          <div className={`rounded-xl overflow-hidden mb-8 ${isPast ? "opacity-60" : ""}`} style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
            {items.map((ev) => <EventRow key={ev.id} ev={ev} isPast={isPast} />)}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-6">Événements</h1>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass} style={selectStyle}>
          <option value="all">Tous les formats</option>
          {types.map((t) => <option key={t} value={t}>{formatLabels[t] ?? t}</option>)}
        </select>
        <select value={villeFilter} onChange={(e) => setVilleFilter(e.target.value)} className={selectClass} style={selectStyle}>
          <option value="all">Toutes les villes</option>
          {villes.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <div className="flex rounded-lg overflow-hidden ml-auto" style={selectStyle}>
          <button onClick={() => setView("grid")} className={`p-2.5 ${view === "grid" ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-white"}`} aria-label="Grille">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2.5 ${view === "list" ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-white"}`} aria-label="Liste">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {renderSection("Mes prochaines participations", "text-emerald-400", myUpcoming)}
      {renderSection("À venir · Ouverts aux inscriptions", "text-primary", otherUpcoming)}

      {myPast.length > 0 && (
        <>
          <h2 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-4">Mes événements passés</h2>
          <div className="space-y-3 mb-8">
            {myPast.map((ev) => (
              <div key={ev.id} className="rounded-xl overflow-hidden" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <button
                  onClick={() => setOpenParticipants(openParticipants === ev.id ? null : ev.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-grotesk font-semibold text-white">{ev.titre}</p>
                      <p className="text-xs text-white/40">
                        {new Date(ev.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        {ev.ville && ` · ${ev.ville}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary font-mono">
                    Retrouver les participants
                    {openParticipants === ev.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                </button>
                {openParticipants === ev.id && (
                  <div className="p-5 border-t space-y-5" style={{ borderColor: "hsl(228 30% 22%)" }}>
                    {(() => {
                      const g = (((ev as any).gallery as { url: string; alt?: string }[] | null) ?? []);
                      if (g.length === 0) return null;
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-mono uppercase tracking-wider text-primary">Galerie</p>
                            <Link to={`/evenements/${ev.slug ?? ev.id}`} className="text-xs text-primary/80 hover:text-primary">
                              Voir le compte-rendu →
                            </Link>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {g.slice(0, 3).map((it, i) => (
                              <Link key={i} to={`/evenements/${ev.slug ?? ev.id}`} className="relative aspect-[4/3] overflow-hidden rounded">
                                <img src={it.url} alt={it.alt ?? ""} className="w-full h-full object-cover" />
                                {i === 2 && g.length > 3 && (
                                  <div className="absolute inset-0 flex items-center justify-center text-white font-grotesk font-bold text-sm" style={{ background: "hsl(228 56% 10% / 0.65)" }}>
                                    +{g.length - 3}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    <ParticipantsList eventId={ev.id} visible={true} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {otherPast.length > 0 && (
        <>
          <h2 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-4">Événements passés</h2>
          {view === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-60">
              {otherPast.map((ev) => <EventCard key={ev.id} ev={ev} isPast />)}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden opacity-60" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              {otherPast.map((ev) => <EventRow key={ev.id} ev={ev} isPast />)}
            </div>
          )}
        </>
      )}

      {!events?.length && <p className="text-white/40 text-sm">Aucun événement pour le moment.</p>}
    </div>
  );
};

export default MembreEvenements;
