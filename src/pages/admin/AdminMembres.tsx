import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, ShieldCheck, ShieldOff, Pencil, X, Save, Trash2, Linkedin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  poste: string | null;
  entreprise: string | null;
  secteur: string | null;
  ville: string | null;
  telephone: string | null;
  linkedin: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

const AdminMembres = () => {
  const [search, setSearch] = useState("");
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: adminUserIds } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role").eq("role", "admin");
      if (error) throw error;
      return new Set(data.map((r) => r.user_id));
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isCurrentlyAdmin }: { userId: string; isCurrentlyAdmin: boolean }) => {
      if (isCurrentlyAdmin) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast({ title: "Rôle mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de modifier le rôle", variant: "destructive" });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Profile> }) => {
      const { error } = await supabase.from("profiles").update(data.updates).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
      toast({ title: "Profil mis à jour" });
      setEditingMember(null);
    },
    onError: (err) => {
      toast({ title: "Erreur", description: String(err), variant: "destructive" });
    },
  });

  const openEdit = (member: Profile) => {
    setEditingMember(member);
    setForm({
      prenom: member.prenom,
      nom: member.nom,
      email: member.email,
      poste: member.poste || "",
      entreprise: member.entreprise || "",
      secteur: member.secteur || "",
      ville: member.ville || "",
      telephone: member.telephone || "",
      linkedin: member.linkedin || "",
      bio: member.bio || "",
      photo_url: member.photo_url || "",
    });
  };

  const handleSave = () => {
    if (!editingMember) return;
    const updates: Partial<Profile> = {};
    const fields: (keyof Profile)[] = ["prenom", "nom", "email", "poste", "entreprise", "secteur", "ville", "telephone", "linkedin", "bio", "photo_url"];
    for (const f of fields) {
      const val = (form as Record<string, string>)[f];
      (updates as Record<string, string | null>)[f] = val?.trim() || null;
    }
    // prenom, nom, email are required
    if (!updates.prenom || !updates.nom || !updates.email) {
      toast({ title: "Erreur", description: "Prénom, nom et email sont obligatoires", variant: "destructive" });
      return;
    }
    updateProfile.mutate({ id: editingMember.id, updates });
  };

  const filtered = members?.filter((m) => {
    const term = search.toLowerCase();
    return !term || `${m.prenom} ${m.nom} ${m.entreprise} ${m.poste} ${m.ville} ${m.email}`.toLowerCase().includes(term);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-grotesk font-bold text-white">Membres ({members?.length || 0})</h1>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-grotesk text-white outline-none"
          style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
        />
      </div>

      {isLoading ? (
        <p className="text-white/40 text-sm">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((m) => {
            const isAdmin = adminUserIds?.has(m.id) ?? false;
            return (
              <div key={m.id} className="rounded-xl p-5 card-lift" style={{ background: "hsl(228 40% 14%)", border: `1px solid ${isAdmin ? "hsl(187 78% 48%)" : "hsl(228 30% 22%)"}` }}>
                <div className="flex items-center gap-3 mb-3">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono" style={{ background: "hsl(228 30% 20%)", color: "hsl(228 15% 55%)" }}>
                      {m.prenom[0]}{m.nom[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-grotesk font-medium truncate">{m.prenom} {m.nom}</p>
                    <p className="text-white/40 text-xs truncate">{m.poste}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "hsl(187 78% 48% / 0.15)", color: "hsl(187 78% 48%)" }}>
                        Admin
                      </span>
                    )}
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      title="Modifier le profil"
                    >
                      <Pencil className="w-3.5 h-3.5 text-white/40 hover:text-white" />
                    </button>
                  </div>
                </div>
                <p className="text-white/50 text-xs">{m.entreprise || "Indépendant"}</p>
                <p className="text-white/30 text-xs mt-0.5">{m.email}</p>
                {m.ville && <p className="text-white/30 text-xs mt-0.5">{m.ville}</p>}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary/60 hover:text-primary text-xs mt-1">
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </a>
                )}

                <button
                  onClick={() => toggleAdmin.mutate({ userId: m.id, isCurrentlyAdmin: isAdmin })}
                  disabled={toggleAdmin.isPending}
                  className="mt-3 flex items-center gap-1.5 text-xs font-grotesk px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: isAdmin ? "hsl(0 60% 50% / 0.15)" : "hsl(187 78% 48% / 0.15)",
                    color: isAdmin ? "hsl(0 60% 65%)" : "hsl(187 78% 48%)",
                  }}
                >
                  {isAdmin ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  {isAdmin ? "Retirer admin" : "Rendre admin"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" style={{ background: "hsl(228 35% 10%)", borderColor: "hsl(228 30% 22%)" }}>
          <DialogHeader>
            <DialogTitle className="text-white font-grotesk">
              Modifier le profil — {editingMember?.prenom} {editingMember?.nom}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Prénom *</Label>
                <Input value={form.prenom || ""} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Nom *</Label>
                <Input value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
            </div>

            <div>
              <Label className="text-white/60 text-xs">Email *</Label>
              <Input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Poste</Label>
                <Input value={form.poste || ""} onChange={(e) => setForm({ ...form, poste: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Entreprise</Label>
                <Input value={form.entreprise || ""} onChange={(e) => setForm({ ...form, entreprise: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs">Secteur</Label>
                <Input value={form.secteur || ""} onChange={(e) => setForm({ ...form, secteur: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Ville</Label>
                <Input value={form.ville || ""} onChange={(e) => setForm({ ...form, ville: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
            </div>

            <div>
              <Label className="text-white/60 text-xs">Téléphone</Label>
              <Input value={form.telephone || ""} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" />
            </div>

            <div>
              <Label className="text-white/60 text-xs">LinkedIn</Label>
              <Input value={form.linkedin || ""} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" placeholder="https://linkedin.com/in/..." />
            </div>

            <div>
              <Label className="text-white/60 text-xs">Photo URL</Label>
              <Input value={form.photo_url || ""} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" placeholder="https://..." />
              {form.photo_url && (
                <img src={form.photo_url} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />
              )}
            </div>

            <div>
              <Label className="text-white/60 text-xs">Bio</Label>
              <Textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-white/5 border-white/10 text-white text-sm" rows={3} />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={updateProfile.isPending} className="flex-1 gap-2">
                <Save className="w-4 h-4" />
                {updateProfile.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button variant="outline" onClick={() => setEditingMember(null)} className="border-white/10 text-white/60 hover:text-white">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembres;
