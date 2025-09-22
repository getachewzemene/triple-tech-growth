"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
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

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

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


  const handleCTAClick = () => {
    if (currentSlide === 0) scrollToContact();
    else if (currentSlide === 1) scrollToServices();
    else router.push('/training');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
        style={ isDark ? { background: `hsl(var(--background))` } : { background: heroSlides[currentSlide].background }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
        
        {/* Enhanced animated elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse backdrop-blur-sm border border-white/20"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse animation-delay-300 backdrop-blur-sm border border-white/20"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse animation-delay-600 backdrop-blur-sm border border-white/20"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-yellow/30 rotate-45 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-light-blue/30 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-white/40 animate-float animation-delay-1500"></div>
        
        {/* Gradient overlay patterns */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/30 hover:scale-110 hover:shadow-lg"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/30 hover:scale-110 hover:shadow-lg"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Enhanced Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-0 animation-delay-300 text-gray-100">
            {heroSlides[currentSlide].subtitle}
          </p>
          <Button
            onClick={handleCTAClick}
            size="lg"
            className={`${isDark ? 'bg-[#e2a70f] hover:bg-[#d69e0b] text-white' : 'bg-gradient-to-r from-yellow to-yellow/80 text-yellow-foreground hover:from-yellow/90 hover:to-yellow/70'} text-lg px-8 py-4 animate-slide-up opacity-0 animation-delay-600 transform hover:scale-110 transition-all duration-500 shadow-2xl border border-yellow/30 backdrop-blur-sm`}
          >
            <span className="relative z-10">{heroSlides[currentSlide].cta}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-light-blue/20 to-yellow/20 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentSlide 
                ? 'w-8 h-3 bg-gradient-to-r from-yellow to-yellow/80 scale-125 shadow-lg' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75 hover:scale-110'
            } rounded-full backdrop-blur-sm border border-white/30`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow/50 to-light-blue/50 rounded-full animate-pulse"></div>
            )}
          </button>
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