import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, LogOut, User } from "lucide-react";
import { AtomIcon } from "./AtomIcon";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Communauté", path: "/communaute" },
  { label: "Événements", path: "/evenements" },
  { label: "Ressources", path: "/ressources" },
  { label: "Partenaires", path: "/partenaires" },
  { label: "À propos", path: "/a-propos" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <AtomIcon className="w-7 h-7" />
          <span className="font-grotesk font-medium text-lg tracking-tight text-foreground">
            futur proche
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-mono text-[11px] uppercase tracking-[1.2px] transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[1.2px] text-yellow-400/80 hover:text-yellow-400 transition-colors"
                >
                  <Shield className="w-3 h-3" /> Admin
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-grotesk font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" /> Mon espace
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 z-50"
                    style={{ background: "hsl(228 40% 14%)", border: "1px solid hsl(228 30% 22%)" }}
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {[
                      { to: "/espace-membre", label: "Accueil" },
                      { to: "/espace-membre/profil", label: "Mon profil" },
                      { to: "/espace-membre/annuaire", label: "Annuaire" },
                      { to: "/espace-membre/evenements", label: "Mes événements" },
                      { to: "/espace-membre/ressources", label: "Ressources membres" },
                    ].map((it) => (
                      <Link
                        key={it.to}
                        to={it.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-grotesk text-white/70 hover:text-white hover:bg-white/5"
                      >
                        {it.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-grotesk text-white/50 hover:text-white hover:bg-white/5 border-t mt-1 pt-2 flex items-center gap-2"
                      style={{ borderColor: "hsl(228 30% 22%)" }}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground hover:text-primary transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/candidater"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-grotesk font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Devenir Futuriste →
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-6 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/espace-membre"
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-primary"
              >
                Mon espace
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-yellow-400"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="block py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-muted-foreground hover:text-primary transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/candidater"
                onClick={() => setOpen(false)}
                className="mt-4 inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-grotesk font-medium text-sm"
              >
                Devenir Futuriste →
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
