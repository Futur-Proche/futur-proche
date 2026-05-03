import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TensionSection } from "@/components/home/TensionSection";
import { KeyElementsSection } from "@/components/home/KeyElementsSection";
import { FormatsSection } from "@/components/home/FormatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ForYouSection } from "@/components/home/ForYouSection";
import { MembersCloud } from "@/components/home/MembersCloud";
import { JoinSection } from "@/components/home/JoinSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => (
  <>
    <Navbar />
    <main>
      {/* 1. Navy — Hero */}
      <HeroSection />
      {/* 2. Cream — Constat */}
      <TensionSection />
      {/* 3. Navy — Stats */}
      <KeyElementsSection />
      {/* 4. Cream — Formats + Photos */}
      <FormatsSection />
      {/* 5. Navy — Testimonials */}
      <TestimonialsSection />
      {/* 6. Cream — Pour qui */}
      <ForYouSection />
      {/* 7. Navy — Members */}
      <MembersCloud />
      {/* 8. Cream — Join */}
      <JoinSection />
      {/* 9. Mesh gradient — CTA */}
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
