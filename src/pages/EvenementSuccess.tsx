import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const EvenementSuccess = () => {
  const { slug } = useParams();
  return (
    <>
      <Navbar />
      <main className="section-navy min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-grotesk font-bold text-white mb-3">Inscription confirmée</h1>
          <p className="text-white/60 mb-8">
            Votre paiement a bien été reçu. Vous recevrez un email de confirmation sous peu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/evenements/${slug}`} className="px-6 py-3 rounded-lg font-grotesk font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90">
              Revenir à l'événement
            </Link>
            <Link to="/espace-membre" className="px-6 py-3 rounded-lg font-grotesk font-semibold text-sm text-white/70 hover:text-white" style={{ border: "1px solid hsl(228 30% 22%)" }}>
              Mon espace membre
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EvenementSuccess;
