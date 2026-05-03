import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const PageShell = ({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="pt-16">
      <section className="container mx-auto px-6 py-24 md:py-32">
        <span className="section-label">{label}</span>
        <h1 className="text-4xl md:text-5xl font-grotesk font-medium tracking-tight mt-4 mb-8">{title}</h1>
        {children || (
          <p className="text-muted-foreground text-lg max-w-2xl">
            Cette page est en construction. Reviens bientôt.
          </p>
        )}
      </section>
    </main>
    <Footer />
  </>
);

export default PageShell;
