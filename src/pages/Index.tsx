import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TensionSection } from "@/components/home/TensionSection";
import { KeyElementsSection } from "@/components/home/KeyElementsSection";
import { FormatsSection } from "@/components/home/FormatsSection";
import { PhotoBanner } from "@/components/home/PhotoBanner";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { JoinSection } from "@/components/home/JoinSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <TensionSection />
      <KeyElementsSection />
      <FormatsSection />
      <PhotoBanner />
      <TestimonialsSection />
      <JoinSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
