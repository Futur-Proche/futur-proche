import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";

const MembreProfil = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const [form, setForm] = useState<any>(null);

  // Initialize form when profile loads
  if (profile && !form) {
    setForm({ prenom: profile.prenom, nom: profile.nom, email: profile.email ?? "", poste: profile.poste ?? "", entreprise: profile.entreprise ?? "", ville: profile.ville ?? "", code_postal: (profile as any).code_postal ?? "", bio: profile.bio ?? "", linkedin: profile.linkedin ?? "", telephone: profile.telephone ?? "" });
  }

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("profiles").update(data).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      toast({ title: "Profil mis à jour !" });
    },
  });

  const uploadPhoto = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erreur upload", variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ photo_url: publicUrl }).eq("id", user!.id);
    qc.invalidateQueries({ queryKey: ["my-profile"] });
    toast({ title: "Photo mise à jour !" });
  };

  if (isLoading || !form) return <p className="text-white/40 text-sm">Chargement...</p>;

  const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm font-grotesk text-white outline-none";
  const inputStyle = { background: "hsl(228 40% 12%)", border: "1px solid hsl(228 30% 25%)" };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-grotesk font-bold text-white mb-6">Mon profil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-mono" style={{ background: "hsl(228 30% 20%)", color: "hsl(228 15% 55%)" }}>
              {profile?.prenom?.[0]}{profile?.nom?.[0]}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-white font-grotesk font-medium">{profile?.prenom} {profile?.nom}</p>
          <p className="text-white/40 text-xs">Cliquez pour changer la photo</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(form); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Prénom</label>
            <input className={inputClass} style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Nom</label>
            <input className={inputClass} style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 font-mono uppercase mb-1">Poste</label>
          <input className={inputClass} style={inputStyle} value={form.poste} onChange={(e) => setForm({ ...form, poste: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Entreprise</label>
            <input className={inputClass} style={inputStyle} value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-white/40 font-mono uppercase mb-1">Ville</label>
            <input className={inputClass} style={inputStyle} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
          </div>
        </div>
        <div className="rounded-lg p-4" style={{ background: "hsl(228 40% 10%)", border: "1px solid hsl(228 30% 20%)" }}>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider mb-3">Coordonnées privées</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Email</label>
              <input type="email" className={inputClass} style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-mono uppercase mb-1">Téléphone</label>
              <input className={inputClass} style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-3 italic">Votre email et votre téléphone ne sont jamais affichés aux autres Futuristes.</p>
        </div>
        <div>
          <label className="block text-xs text-white/40 font-mono uppercase mb-1">Code postal</label>
          <input className={inputClass} style={inputStyle} value={form.code_postal} maxLength={5} placeholder="75001" onChange={(e) => setForm({ ...form, code_postal: e.target.value })} />
          <p className="text-[10px] text-white/30 mt-1">Permet de vous localiser sur la carte des Futuristes.</p>
        </div>
        <div>
          <label className="block text-xs text-white/40 font-mono uppercase mb-1">Bio</label>
          <textarea className={`${inputClass} min-h-[80px]`} style={inputStyle} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-white/40 font-mono uppercase mb-1">LinkedIn</label>
          <input className={inputClass} style={inputStyle} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
        </div>
        <button type="submit" disabled={updateMutation.isPending} className="px-6 py-2.5 rounded-lg text-sm font-grotesk bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {updateMutation.isPending ? "Enregistrement..." : "Enregistrer →"}
        </button>
      </form>
    </div>
  );
};

export default MembreProfil;
