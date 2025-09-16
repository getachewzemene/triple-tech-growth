import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import TeamSection from '@/components/TeamSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <WhyChooseUsSection />
  <TeamSection />
  <Footer />
    </div>
  );
};

export default Index;
