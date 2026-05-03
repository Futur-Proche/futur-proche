import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AtomIcon } from "./AtomIcon";

const navLinks = [
  { label: "Communauté", path: "/communaute" },
  { label: "Événements", path: "/evenements" },
  { label: "Ressources", path: "/ressources" },
  { label: "Partenaires", path: "/partenaires" },
  { label: "À propos", path: "/a-propos" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
          <Link
            to="/candidater"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-grotesk font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Je candidate →
          </Link>
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
          <Link
            to="/candidater"
            onClick={() => setOpen(false)}
            className="mt-4 inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-grotesk font-medium text-sm"
          >
            Je candidate →
          </Link>
        </div>
      )}
    </nav>
  );
};
