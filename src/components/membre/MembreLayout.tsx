import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, User, Users, CalendarDays, FileText, LogOut, ChevronLeft, Shield } from "lucide-react";

const navItems = [
  { to: "/espace-membre", icon: LayoutDashboard, label: "Accueil", end: true },
  { to: "/espace-membre/profil", icon: User, label: "Mon profil" },
  { to: "/espace-membre/annuaire", icon: Users, label: "Annuaire" },
  { to: "/espace-membre/evenements", icon: CalendarDays, label: "Événements" },
  { to: "/espace-membre/ressources", icon: FileText, label: "Ressources" },
];

const MembreLayout = () => {
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(228 56% 8%)" }}>
      <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ background: "hsl(228 40% 10%)", borderColor: "hsl(228 30% 18%)" }}>
        <div className="p-6 border-b" style={{ borderColor: "hsl(228 30% 18%)" }}>
          <NavLink to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-mono uppercase tracking-wider">
            <ChevronLeft className="w-3 h-3" /> Retour au site
          </NavLink>
          <h2 className="text-lg font-grotesk font-bold text-white mt-3">
            Espace <span className="text-primary font-serif-accent italic">Futuriste</span>
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
                  isActive ? "bg-primary/10 text-primary font-medium" : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-grotesk text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/5 transition-colors"
            >
              <Shield className="w-4 h-4" /> Admin
            </NavLink>
          )}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "hsl(228 30% 18%)" }}>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-grotesk text-white/40 hover:text-white/70 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MembreLayout;
