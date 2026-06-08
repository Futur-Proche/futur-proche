import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit2, Trash2, Calendar, Image, UserPlus, X, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Database } from "@/integrations/supabase/types";
import EventVisualGenerator from "@/components/admin/EventVisualGenerator";
import { EventGalleryUploader, type GalleryItem } from "@/components/admin/EventGalleryUploader";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface Speaker {
  id?: string;
  nom: string;
  prenom: string;
  poste: string;
  entreprise: string;
  photo_url: string | null;
  is_member?: boolean;
}

const defaultEvent: Omit<EventInsert, "id"> = {
  titre: "",
  description: "",
  format: "after_proche",
  date: new Date().toISOString().split("T")[0],
  heure: "19:00",
  ville: "Paris",
  lieu: "",
  capacite: 50,
  prix: null,
  statut: "draft",
  speakers: [],
  slug: "",
  is_open_to_all: false,
  recap: "",
  gallery: [] as any,
};

const formatLabels: Record<string, string> = {
  after_proche: "After Proche",
  diner: "Dîner",
  workshop: "Workshop",
  autre: "Autre",
};

const AdminEvenements = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<Omit<EventInsert, "id">>(defaultEvent);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [visualEvent, setVisualEvent] = useState<Event | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Close member search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowMemberSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProfiles = (profiles ?? []).filter((p) => {
    const q = memberSearch.toLowerCase();
    const alreadyAdded = speakers.some((s) => s.id === p.id);
    if (alreadyAdded) return false;
    return (
      p.prenom.toLowerCase().includes(q) ||
      p.nom.toLowerCase().includes(q) ||
      (p.entreprise ?? "").toLowerCase().includes(q)
    );
  });

  const addMemberAsSpeaker = (p: Profile) => {
    setSpeakers((prev) => [
      ...prev,
      {
        id: p.id,
        prenom: p.prenom,
        nom: p.nom,
        poste: p.poste ?? "",
        entreprise: p.entreprise ?? "",
        photo_url: p.photo_url,
        is_member: true,
      },
    ]);
    setShowMemberSearch(false);
    setMemberSearch("");
  };

  const addExternalSpeaker = () => {
    setSpeakers((prev) => [
      ...prev,
      { prenom: "", nom: "", poste: "", entreprise: "", photo_url: null, is_member: false },
    ]);
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    setSpeakers((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const removeSpeaker = (index: number) => {
    setSpeakers((prev) => prev.filter((_, i) => i !== index));
  };

  const saveMutation = useMutation({
    mutationFn: async (data: Omit<EventInsert, "id">) => {
      const slug = data.titre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { ...data, slug, speakers: speakers as any, gallery: gallery as any };
      if (editing) {
        const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: editing ? "Événement modifié" : "Événement créé" });
      setShowForm(false);
      setEditing(null);
      setForm(defaultEvent);
      setSpeakers([]);
      setGallery([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Événement supprimé" });
    },
  });

  const openEdit = (e: Event) => {
    setEditing(e);
    setForm({
      titre: e.titre,
      description: e.description ?? "",
      format: e.format,
      date: e.date,
      heure: e.heure ?? "19:00",
      ville: e.ville ?? "",
      lieu: e.lieu ?? "",
      capacite: e.capacite ?? 50,
      prix: e.prix,
      statut: e.statut,
      speakers: e.speakers ?? [],
      slug: e.slug ?? "",
      is_open_to_all: (e as any).is_open_to_all ?? false,
      recap: (e as any).recap ?? "",
      gallery: ((e as any).gallery ?? []) as any,
    });
    // Parse existing speakers from event
    const existingSpeakers = (e.speakers as unknown as Speaker[] | null) ?? [];
    setSpeakers(existingSpeakers);
    setGallery((((e as any).gallery as unknown as GalleryItem[]) ?? []));
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(defaultEvent);
    setSpeakers([]);
    setGallery([]);
    setShowForm(!showForm);
  };

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm font-grotesk text-white outline-none";
  const inputStyle = { background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" };

  const getSpeakerInitials = (s: Speaker) => {
    return `${(s.prenom || "?")[0]}${(s.nom || "?")[0]}`.toUpperCase();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-grotesk font-bold text-white">Événements</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-grotesk bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Nouveau
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
          className="rounded-xl p-6 mb-6 space-y-4"
          style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Titre</label>
              <input className={inputClass} style={inputStyle} value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Format</label>
              <select className={inputClass} style={inputStyle} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as any })}>
                <option value="after_proche">After Proche</option>
                <option value="diner">Dîner</option>
                <option value="workshop">Workshop</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Date</label>
              <input type="date" className={inputClass} style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Heure</label>
              <input type="time" className={inputClass} style={inputStyle} value={form.heure ?? ""} onChange={(e) => setForm({ ...form, heure: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Ville</label>
              <input className={inputClass} style={inputStyle} value={form.ville ?? ""} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Lieu</label>
              <input className={inputClass} style={inputStyle} value={form.lieu ?? ""} onChange={(e) => setForm({ ...form, lieu: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Capacité</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.capacite ?? ""} onChange={(e) => setForm({ ...form, capacite: parseInt(e.target.value) || null })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Prix (€) — vide = gratuit</label>
              <input type="number" step="0.01" className={inputClass} style={inputStyle} value={form.prix ?? ""} onChange={(e) => setForm({ ...form, prix: e.target.value ? parseFloat(e.target.value) : null })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Statut</label>
              <select className={inputClass} style={inputStyle} value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as any })}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="past">Passé</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(form as any).is_open_to_all ?? false}
                onChange={(e) => setForm({ ...form, is_open_to_all: e.target.checked } as any)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-grotesk text-white">Ouvert à tous</span>
              <span className="text-xs text-white/40">(sinon réservé aux membres)</span>
            </label>
          </div>
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Description</label>
            <textarea className={`${inputClass} min-h-[80px]`} style={inputStyle} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* ── Speakers Section ── */}
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-3">Speakers</label>

            {/* Current speakers */}
            <div className="space-y-3 mb-4">
              {speakers.map((speaker, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-4 flex items-start gap-4"
                  style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 20%)" }}
                >
                  {/* Round photo */}
                  <div className="flex-shrink-0">
                    {speaker.photo_url ? (
                      <img
                        src={speaker.photo_url}
                        alt={`${speaker.prenom} ${speaker.nom}`}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-grotesk font-bold text-white/60 ring-2 ring-white/10" style={{ background: "hsl(228 40% 18%)" }}>
                        {getSpeakerInitials(speaker)}
                      </div>
                    )}
                  </div>

                  {/* Editable fields */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      className={`${inputClass} text-xs`}
                      style={inputStyle}
                      placeholder="Prénom"
                      value={speaker.prenom}
                      onChange={(e) => updateSpeaker(idx, "prenom", e.target.value)}
                    />
                    <input
                      className={`${inputClass} text-xs`}
                      style={inputStyle}
                      placeholder="Nom"
                      value={speaker.nom}
                      onChange={(e) => updateSpeaker(idx, "nom", e.target.value)}
                    />
                    <input
                      className={`${inputClass} text-xs`}
                      style={inputStyle}
                      placeholder="Rôle / Poste"
                      value={speaker.poste}
                      onChange={(e) => updateSpeaker(idx, "poste", e.target.value)}
                    />
                    <input
                      className={`${inputClass} text-xs`}
                      style={inputStyle}
                      placeholder="Entreprise"
                      value={speaker.entreprise}
                      onChange={(e) => updateSpeaker(idx, "entreprise", e.target.value)}
                    />
                    {!speaker.is_member && (
                      <input
                        className={`${inputClass} text-xs sm:col-span-2`}
                        style={inputStyle}
                        placeholder="URL photo (optionnel)"
                        value={speaker.photo_url ?? ""}
                        onChange={(e) => updateSpeaker(idx, "photo_url", e.target.value)}
                      />
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeSpeaker(idx)}
                    className="flex-shrink-0 p-1 rounded hover:bg-red-500/10 text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add speaker buttons */}
            <div className="flex gap-3 relative" ref={searchRef}>
              <button
                type="button"
                onClick={() => setShowMemberSearch(!showMemberSearch)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-grotesk text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors"
                style={{ border: "1px solid hsl(186 79% 47% / 0.2)" }}
              >
                <Search className="w-3.5 h-3.5" /> Ajouter un membre
              </button>
              <button
                type="button"
                onClick={addExternalSpeaker}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-grotesk text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
                style={{ border: "1px solid hsl(228 30% 25%)" }}
              >
                <UserPlus className="w-3.5 h-3.5" /> Ajouter un externe
              </button>

              {/* Member search dropdown */}
              {showMemberSearch && (
                <div
                  className="absolute top-full left-0 mt-1 w-80 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                  style={{ background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" }}
                >
                  <div className="p-2">
                    <input
                      className={`${inputClass} text-xs`}
                      style={inputStyle}
                      placeholder="Rechercher un membre..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredProfiles.length === 0 ? (
                      <p className="text-xs text-white/30 text-center py-3">Aucun membre trouvé</p>
                    ) : (
                      filteredProfiles.map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => addMemberAsSpeaker(p)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                        >
                          {p.photo_url ? (
                            <img src={p.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40" style={{ background: "hsl(228 40% 18%)" }}>
                              {p.prenom[0]}{p.nom[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-white font-medium">{p.prenom} {p.nom}</p>
                            <p className="text-[10px] text-white/40">{p.poste} · {p.entreprise}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Après l'événement (recap + galerie) ── */}
          <div className="pt-4 border-t" style={{ borderColor: "hsl(228 30% 22%)" }}>
            <label className="block text-xs text-primary font-mono uppercase mb-3 tracking-wider">
              Après l'événement {form.statut !== "past" && <span className="text-white/30 normal-case">(visible une fois l'événement passé)</span>}
            </label>

            <div className="mb-4">
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Compte-rendu / résumé</label>
              <textarea
                className={`${inputClass} min-h-[140px]`}
                style={inputStyle}
                placeholder="Ce qui s'est dit, les moments forts, les insights partagés…"
                value={form.recap ?? ""}
                onChange={(e) => setForm({ ...form, recap: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-2">Galerie photo</label>
              {editing ? (
                <EventGalleryUploader eventId={editing.id} items={gallery} onChange={setGallery} />
              ) : (
                <p className="text-xs text-white/40 italic">
                  Enregistrez d'abord l'événement pour pouvoir ajouter des photos.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saveMutation.isPending} className="px-6 py-2 rounded-lg text-sm font-grotesk bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
              {editing ? "Modifier" : "Créer"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setSpeakers([]); setGallery([]); }} className="px-6 py-2 rounded-lg text-sm font-grotesk text-white/50 hover:text-white transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : !events?.length ? (
        <p className="text-white/40 text-sm">Aucun événement.</p>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => {
            const evSpeakers = (ev.speakers as unknown as Speaker[] | null) ?? [];
            return (
              <div key={ev.id} className="rounded-xl overflow-hidden" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
                <div className="relative p-6" style={{ background: "linear-gradient(135deg, hsl(228 56% 12%) 0%, hsl(248 60% 20%) 50%, hsl(228 56% 12%) 100%)" }}>
                  <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(186 79% 47% / 0.15) 0%, transparent 60%)" }} />
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                          {formatLabels[ev.format]} · {ev.ville}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          ev.statut === "published" ? "bg-emerald-400/10 text-emerald-400" :
                          ev.statut === "draft" ? "bg-yellow-400/10 text-yellow-400" :
                          "bg-white/10 text-white/40"
                        }`}>{ev.statut}</span>
                      </div>
                      <h3 className="text-xl font-grotesk font-bold text-white">{ev.titre}</h3>
                      {ev.lieu && <p className="text-white/40 text-sm mt-1">{ev.lieu}</p>}

                      {/* Speaker avatars in event card */}
                      {evSpeakers.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex -space-x-2">
                            {evSpeakers.slice(0, 5).map((s, i) => (
                              s.photo_url ? (
                                <img
                                  key={i}
                                  src={s.photo_url}
                                  alt={`${s.prenom} ${s.nom}`}
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[hsl(228,56%,12%)]"
                                />
                              ) : (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white/50 ring-2 ring-[hsl(228,56%,12%)]"
                                  style={{ background: "hsl(228 40% 20%)" }}
                                >
                                  {(s.prenom?.[0] ?? "")}{(s.nom?.[0] ?? "")}
                                </div>
                              )
                            ))}
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">
                            {evSpeakers.map((s) => s.prenom).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-center rounded-lg px-3 py-2" style={{ border: "1px solid hsl(186 79% 47% / 0.3)" }}>
                      <p className="text-[10px] font-mono uppercase text-primary">
                        {new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}
                      </p>
                      <p className="text-2xl font-grotesk font-bold text-white">{new Date(ev.date).getDate()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4">
                  <button onClick={() => openEdit(ev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-grotesk text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                    <Edit2 className="w-3 h-3" /> Modifier
                  </button>
                  <button onClick={() => setVisualEvent(ev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-grotesk text-primary/60 hover:text-primary hover:bg-primary/5 transition-colors">
                    <Image className="w-3 h-3" /> Visuels
                  </button>
                  <button onClick={() => deleteMutation.mutate(ev.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-grotesk text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                  {ev.prix && <span className="ml-auto text-xs font-mono text-primary">{Number(ev.prix).toFixed(0)}€</span>}
                  {ev.capacite && <span className="text-xs font-mono text-white/30">{ev.capacite} places</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {visualEvent && (
        <EventVisualGenerator
          event={visualEvent}
          onClose={() => setVisualEvent(null)}
        />
      )}
    </div>
  );
};

export default AdminEvenements;
