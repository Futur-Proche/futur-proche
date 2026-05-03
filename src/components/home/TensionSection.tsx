import { Link } from "react-router-dom";

const problems = [
  { num: "01", text: "Justifier ton budget à des gens qui ne comprennent pas ton métier." },
  { num: "02", text: "Chercher des réponses sur Google alors que t'as 10 ans d'XP." },
  { num: "03", text: "Te sentir seul face à des décisions que personne ne peut challenger." },
];

export const TensionSection = () => (
  <section id="tension" className="mode-lecture">
    <div className="container mx-auto px-6 py-24 md:py-32">
      <span className="section-label">— Le problème</span>
      <h2 className="text-3xl md:text-4xl font-grotesk font-medium mt-4 mb-12 tracking-tight text-foreground">
        Tu connais sûrement ça.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((p) => (
          <div key={p.num} className="border-t-2 border-primary pt-6">
            <span className="font-mono text-[12px] text-primary font-medium">{p.num}</span>
            <p className="text-base text-foreground mt-3 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      <Link
        to="/communaute"
        className="inline-flex items-center gap-2 mt-12 text-primary font-grotesk font-medium text-base hover:opacity-80 transition-opacity"
      >
        On a créé fp pour ça. →
      </Link>
    </div>
  </section>
);
