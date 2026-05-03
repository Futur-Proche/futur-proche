import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Inbox, CalendarDays, FileText } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [members, pendingCandidatures, events, resources] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("candidatures").select("id", { count: "exact", head: true }).eq("statut", "pending"),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }),
      ]);
      return {
        members: members.count ?? 0,
        pendingCandidatures: pendingCandidatures.count ?? 0,
        events: events.count ?? 0,
        resources: resources.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Membres", value: stats?.members ?? 0, icon: Users, color: "text-primary" },
    { label: "Candidatures en attente", value: stats?.pendingCandidatures ?? 0, icon: Inbox, color: "text-yellow-400" },
    { label: "Événements", value: stats?.events ?? 0, icon: CalendarDays, color: "text-violet-400" },
    { label: "Ressources", value: stats?.resources ?? 0, icon: FileText, color: "text-emerald-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-grotesk font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl p-5" style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-white/40">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-3xl font-grotesk font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
