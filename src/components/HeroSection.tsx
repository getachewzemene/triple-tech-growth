import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)',
      title: 'Accelerating business growth with smart technologies',
      subtitle: 'Triple Technologies fuels business growth with smart software, training, and digital marketing.',
      cta: 'Contact Us'
    },
    {
      background: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)',
      title: 'Innovation at the heart of everything we do',
      subtitle: 'From web development to mobile apps, we create solutions that drive success.',
      cta: 'Our Services'
    },
    {
      background: 'linear-gradient(135deg, #155e75 0%, #0e7490 50%, #0891b2 100%)',
      title: 'Expert training and consultation services',
      subtitle: 'Upskill your team with our comprehensive IT training programs and expert consultancy.',
      cta: 'Learn More'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTraining = () => {
    const element = document.getElementById('training');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCTAClick = () => {
    if (currentSlide === 0) scrollToContact();
    else if (currentSlide === 1) scrollToServices();
    else scrollToTraining();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
        style={{ background: heroSlides[currentSlide].background }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Animated circles for visual interest */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse animation-delay-600"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          {heroSlides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-0 animation-delay-300">
          {heroSlides[currentSlide].subtitle}
        </p>
        <Button
          onClick={handleCTAClick}
          size="lg"
          className="bg-yellow text-yellow-foreground hover:bg-yellow/90 text-lg px-8 py-4 animate-slide-up opacity-0 animation-delay-600 transform hover:scale-105 transition-all duration-300"
        >
          {heroSlides[currentSlide].cta}
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-yellow scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      <style>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: forwards;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;