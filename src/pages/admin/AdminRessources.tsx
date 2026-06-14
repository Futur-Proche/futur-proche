import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit2, Trash2, Lock, Globe } from "lucide-react";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Resource = Database["public"]["Tables"]["resources"]["Row"];
type ResourceInsert = Database["public"]["Tables"]["resources"]["Insert"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const defaultResource: Omit<ResourceInsert, "id"> = {
  titre: "",
  slug: "",
  description: "",
  extrait: "",
  contenu: "",
  type: "autre",
  url: "",
  file_url: "",
  image_url: "",
  auteur: "",
  temps_lecture: null,
  access: "public",
  is_public: false,
  published_at: new Date().toISOString(),
};

const typeLabels: Record<string, string> = {
  etude: "Étude",
  synthese: "Synthèse",
  podcast: "Podcast",
  newsletter: "Newsletter",
  autre: "Autre",
};

const AdminRessources = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState<Omit<ResourceInsert, "id">>(defaultResource);

  const { data: resources, isLoading } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Resource[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Omit<ResourceInsert, "id">) => {
      if (editing) {
        const { error } = await supabase.from("resources").update(data).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resources").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: editing ? "Ressource modifiée" : "Ressource créée" });
      setShowForm(false);
      setEditing(null);
      setForm(defaultResource);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
      toast({ title: "Ressource supprimée" });
    },
  });

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm font-grotesk text-white outline-none";
  const inputStyle = { background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-grotesk font-bold text-white">Ressources</h1>
        <button
          onClick={() => { setEditing(null); setForm(defaultResource); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-grotesk bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Nouvelle
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload = { ...form, slug: form.slug?.trim() || slugify(form.titre || "") };
            saveMutation.mutate(payload);
          }}
          className="rounded-xl p-6 mb-6 space-y-4"
          style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Titre</label>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.titre}
                onChange={(e) => {
                  const titre = e.target.value;
                  setForm({ ...form, titre, slug: form.slug && editing ? form.slug : slugify(titre) });
                }}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Slug (URL)</label>
              <input className={inputClass} style={inputStyle} value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="mon-article" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Type</label>
              <select className={inputClass} style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Visibilité</label>
              <select
                className={inputClass}
                style={inputStyle}
                value={form.is_public ? "public" : "members"}
                onChange={(e) => {
                  const isPub = e.target.value === "public";
                  setForm({ ...form, is_public: isPub, access: isPub ? "public" : "members" });
                }}
              >
                <option value="members">🔒 Réservé aux membres connectés</option>
                <option value="public">🌍 Accès libre (visible par tous)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Auteur</label>
              <input className={inputClass} style={inputStyle} value={form.auteur ?? ""} onChange={(e) => setForm({ ...form, auteur: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Temps de lecture (min)</label>
              <input type="number" min={1} className={inputClass} style={inputStyle} value={form.temps_lecture ?? ""} onChange={(e) => setForm({ ...form, temps_lecture: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Image de couverture (URL)</label>
              <input className={inputClass} style={inputStyle} value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">URL externe (optionnel)</label>
              <input className={inputClass} style={inputStyle} value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Fichier joint (URL)</label>
              <input className={inputClass} style={inputStyle} value={form.file_url ?? ""} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Description courte (admin)</label>
            <textarea className={`${inputClass} min-h-[60px]`} style={inputStyle} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Extrait public (teaser visible par tous)</label>
            <textarea className={`${inputClass} min-h-[80px]`} style={inputStyle} value={form.extrait ?? ""} onChange={(e) => setForm({ ...form, extrait: e.target.value })} placeholder="2-3 phrases d'accroche qui donnent envie de lire la suite." />
          </div>

          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Contenu complet (HTML autorisé)</label>
            <textarea className={`${inputClass} min-h-[240px] font-mono text-xs leading-relaxed`} style={inputStyle} value={form.contenu ?? ""} onChange={(e) => setForm({ ...form, contenu: e.target.value })} placeholder="<p>Le corps de l'article…</p>" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saveMutation.isPending} className="px-6 py-2 rounded-lg text-sm font-grotesk bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {editing ? "Modifier" : "Créer"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 rounded-lg text-sm font-grotesk text-white/50 hover:text-white">
              Annuler
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : (
        <div className="space-y-3">
          {resources?.map((r) => (
            <div key={r.id} className="rounded-xl p-5 flex items-center gap-4" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-white font-grotesk font-medium">{r.titre}</p>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/40">{typeLabels[r.type] ?? r.type}</span>
                  {r.is_public ? <Globe className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-yellow-400" />}
                  {r.slug && <span className="text-[10px] font-mono text-white/30">/{r.slug}</span>}
                </div>
                {(r.extrait || r.description) && <p className="text-white/40 text-xs truncate">{r.extrait ?? r.description}</p>}
              </div>
              <button
                onClick={() => {
                  setEditing(r);
                  setForm({
                    titre: r.titre,
                    slug: r.slug ?? "",
                    description: r.description,
                    extrait: r.extrait ?? "",
                    contenu: r.contenu ?? "",
                    type: r.type,
                    url: r.url,
                    file_url: r.file_url,
                    image_url: r.image_url ?? "",
                    auteur: r.auteur ?? "",
                    temps_lecture: r.temps_lecture ?? null,
                    access: r.access,
                    is_public: r.is_public ?? false,
                    published_at: r.published_at,
                  });
                  setShowForm(true);
                }}
                className="text-white/30 hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteMutation.mutate(r.id)} className="text-red-400/30 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRessources;
