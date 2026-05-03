import { Link } from "react-router-dom";
import { AtomIcon } from "./AtomIcon";

export const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <AtomIcon className="w-6 h-6" />
            <span className="font-grotesk font-medium text-foreground">futur proche</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La communauté des leaders marketing / comm qui ont arrêté d'y aller seuls.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary mb-4">Communauté</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/communaute" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Découvrir</Link>
            <Link to="/evenements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Événements</Link>
            <Link to="/ressources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ressources</Link>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary mb-4">En savoir plus</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/a-propos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">À propos</Link>
            <Link to="/partenaires" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partenaires</Link>
            <Link to="/candidater" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Candidater</Link>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[1.2px] text-primary mb-4">Contact</h4>
          <div className="flex flex-col gap-2.5">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            <a href="mailto:hello@futurproche.club" className="text-sm text-muted-foreground hover:text-foreground transition-colors">hello@futurproche.club</a>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[1px] text-muted-foreground">
          © 2024 futur proche · Tous droits réservés
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[1px] text-muted-foreground">
          99€/an · Tarif Founding · 99 places
        </p>
      </div>
    </div>
  </footer>
);
