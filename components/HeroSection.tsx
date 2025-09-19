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
      {/* Animated Background */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
        style={{ background: heroSlides[currentSlide].background }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-white/20 to-yellow/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-yellow/30 to-white/20 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-white/30 to-yellow/20 rounded-full animate-pulse animation-delay-600"></div>
        <div className="absolute top-32 right-32 w-20 h-20 bg-gradient-to-br from-yellow/20 to-white/30 rounded-full animate-pulse animation-delay-900"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-br from-white/15 to-yellow/25 rounded-full animate-pulse animation-delay-1200"></div>
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
      >
        <ChevronLeft size={24} className="text-white group-hover:text-yellow transition-colors duration-300" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
      >
        <ChevronRight size={24} className="text-white group-hover:text-yellow transition-colors duration-300" />
      </button>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white to-yellow bg-clip-text text-transparent">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-0 animation-delay-300 text-white/90 leading-relaxed">
            {heroSlides[currentSlide].subtitle}
          </p>
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="bg-gradient-to-r from-yellow to-yellow/80 text-yellow-foreground hover:from-yellow/90 hover:to-yellow/70 text-lg px-10 py-4 animate-slide-up opacity-0 animation-delay-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            {heroSlides[currentSlide].cta}
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentSlide 
                ? 'bg-yellow shadow-lg shadow-yellow/50 scale-125' 
                : 'bg-white/50 hover:bg-white/80'
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
        .animation-delay-900 {
          animation-delay: 0.9s;
          animation-fill-mode: forwards;
        }
        .animation-delay-1200 {
          animation-delay: 1.2s;
          animation-fill-mode: forwards;
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;