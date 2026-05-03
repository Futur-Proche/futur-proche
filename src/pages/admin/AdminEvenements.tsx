import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit2, Trash2, Calendar, Image } from "lucide-react";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import EventVisualGenerator from "@/components/admin/EventVisualGenerator";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

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

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Omit<EventInsert, "id">) => {
      const slug = data.titre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (editing) {
        const { error } = await supabase.from("events").update({ ...data, slug }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert({ ...data, slug });
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
    });
    setShowForm(true);
  };

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm font-grotesk text-white outline-none";
  const inputStyle = { background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-grotesk font-bold text-white">Événements</h1>
        <button
          onClick={() => { setEditing(null); setForm(defaultEvent); setShowForm(!showForm); }}
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
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Description</label>
            <textarea className={`${inputClass} min-h-[80px]`} style={inputStyle} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saveMutation.isPending} className="px-6 py-2 rounded-lg text-sm font-grotesk bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
              {editing ? "Modifier" : "Créer"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 rounded-lg text-sm font-grotesk text-white/50 hover:text-white transition-colors">
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
          {events.map((ev) => (
            <div key={ev.id} className="rounded-xl overflow-hidden" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              {/* Event poster preview */}
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
                <button onClick={() => deleteMutation.mutate(ev.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-grotesk text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                  <Trash2 className="w-3 h-3" /> Supprimer
                </button>
                {ev.prix && <span className="ml-auto text-xs font-mono text-primary">{Number(ev.prix).toFixed(0)}€</span>}
                {ev.capacite && <span className="text-xs font-mono text-white/30">{ev.capacite} places</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvenements;
