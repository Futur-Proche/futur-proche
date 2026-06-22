import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Users, CalendarDays, FileText, Inbox, LogOut, ChevronLeft } from "lucide-react";
import { Seo } from "@/components/Seo";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/candidatures", icon: Inbox, label: "Candidatures" },
  { to: "/admin/membres", icon: Users, label: "Membres" },
  { to: "/admin/evenements", icon: CalendarDays, label: "Événements" },
  { to: "/admin/ressources", icon: FileText, label: "Ressources" },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(228 56% 8%)" }}>
      <Seo title="Admin — futur proche" description="Espace d'administration." path="/admin" noindex />
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ background: "hsl(228 40% 10%)", borderColor: "hsl(228 30% 18%)" }}>
        <div className="p-6 border-b" style={{ borderColor: "hsl(228 30% 18%)" }}>
          <NavLink to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-mono uppercase tracking-wider">
            <ChevronLeft className="w-3 h-3" /> Retour au site
          </NavLink>
          <h2 className="text-lg font-grotesk font-bold text-white mt-3">
            Admin <span className="text-primary font-serif-accent italic">fp</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-grotesk transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "hsl(228 30% 18%)" }}>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-grotesk text-white/40 hover:text-white/70 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
