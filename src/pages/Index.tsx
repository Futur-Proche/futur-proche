import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TensionSection } from "@/components/home/TensionSection";
import { FormatsSection } from "@/components/home/FormatsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ForWhoSection } from "@/components/home/ForWhoSection";
import { PhotoBanner } from "@/components/home/PhotoBanner";
import { CTASection } from "@/components/home/CTASection";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <TensionSection />
      <FormatsSection />
      <StatsSection />
      <PhotoBanner />
      <TestimonialsSection />
      <ForWhoSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
