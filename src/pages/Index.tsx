import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import TrainingSection from '@/components/TrainingSection';
import TeamSection from '@/components/TeamSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <WhyChooseUsSection />
      <TrainingSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
};

export default Index;
