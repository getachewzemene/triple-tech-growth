"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const heroSlides = [
    {
      background:
        "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)",
      title: "Accelerating business growth with smart technologies",
      subtitle:
        "Triple Technologies fuels business growth with smart software, training, and digital marketing.",
      cta: "Contact Us",
    },
    {
      background:
        "linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)",
      title: "Innovation at the heart of everything we do",
      subtitle:
        "From web development to mobile apps, we create solutions that drive success.",
      cta: "Our Services",
    },
    {
      background:
        "linear-gradient(135deg, #155e75 0%, #0e7490 50%, #0891b2 100%)",
      title: "Expert training and consultation services",
      subtitle:
        "Upskill your team with our comprehensive IT training programs and expert consultancy.",
      cta: "Learn More",
    },
  ];

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCTAClick = () => {
    if (currentSlide === 0) scrollToContact();
    else if (currentSlide === 1) scrollToServices();
    else router.push("/training");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Animated Background */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
        style={
          isDark
            ? { background: `hsl(var(--background))` }
            : { background: heroSlides[currentSlide].background }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>

        {/* Enhanced animated elements with responsive positioning */}
        <div className="absolute top-16 xs:top-20 sm:top-20 left-4 xs:left-8 sm:left-20 w-16 xs:w-24 sm:w-32 h-16 xs:h-24 sm:h-32 bg-white/10 rounded-full animate-pulse backdrop-blur-sm border border-white/20"></div>
        <div className="absolute bottom-16 xs:bottom-20 sm:bottom-20 right-4 xs:right-8 sm:right-20 w-12 xs:w-18 sm:w-24 h-12 xs:h-18 sm:h-24 bg-white/10 rounded-full animate-pulse animation-delay-300 backdrop-blur-sm border border-white/20"></div>
        <div className="absolute top-1/2 left-2 xs:left-4 sm:left-10 w-8 xs:w-12 sm:w-16 h-8 xs:h-12 sm:h-16 bg-white/10 rounded-full animate-pulse animation-delay-600 backdrop-blur-sm border border-white/20"></div>

        {/* Floating geometric shapes - hidden on very small screens */}
        <div className="hidden xs:block absolute top-1/3 right-1/3 w-6 xs:w-8 h-6 xs:h-8 bg-yellow/30 rotate-45 animate-float"></div>
        <div className="hidden xs:block absolute bottom-1/3 left-1/4 w-4 xs:w-6 h-4 xs:h-6 bg-light-blue/30 rounded-full animate-float animation-delay-1000"></div>
        <div className="hidden sm:block absolute top-2/3 right-1/4 w-3 xs:w-4 h-3 xs:h-4 bg-white/40 animate-float animation-delay-1500"></div>

        {/* Gradient overlay patterns */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>

      {/* Enhanced Navigation Arrows - responsive sizing */}
      <button
        onClick={prevSlide}
        className="absolute left-2 xs:left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-2 xs:p-3 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/30 hover:scale-110 hover:shadow-lg"
      >
        <ChevronLeft size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 xs:right-3 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-2 xs:p-3 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/30 hover:scale-110 hover:shadow-lg"
      >
        <ChevronRight size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Enhanced Content Overlay - responsive design */}
      <div className="relative z-10 text-center text-white max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto px-4 xs:px-6 sm:px-8">
        <div className="backdrop-blur-sm bg-white/5 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 border border-white/10">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 xs:mb-6 animate-fade-in bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 xs:mb-8 animate-slide-up opacity-0 animation-delay-300 text-gray-100 leading-relaxed">
            {heroSlides[currentSlide].subtitle}
          </p>
          <Button
            onClick={handleCTAClick}
            size="lg"
            className={`${isDark ? "bg-[#e2a70f] hover:bg-[#d69e0b] text-white" : "bg-gradient-to-r from-yellow to-yellow/80 text-yellow-foreground hover:from-yellow/90 hover:to-yellow/70"} text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 animate-slide-up opacity-0 animation-delay-600 transform hover:scale-110 transition-all duration-500 shadow-2xl border border-yellow/30 backdrop-blur-sm min-h-[44px]`}
          >
            <span className="relative z-10">
              {heroSlides[currentSlide].cta}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-light-blue/20 to-yellow/20 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>

      {/* Enhanced Slide Indicators - responsive positioning */}
      <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 xs:space-x-3 sm:space-x-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentSlide
                ? "w-6 xs:w-7 sm:w-8 h-2 xs:h-2.5 sm:h-3 bg-gradient-to-r from-yellow to-yellow/80 scale-125 shadow-lg"
                : "w-2 xs:w-2.5 sm:w-3 h-2 xs:h-2.5 sm:h-3 bg-white/50 hover:bg-white/75 hover:scale-110"
            } rounded-full backdrop-blur-sm border border-white/30 min-w-[32px] min-h-[32px] flex items-center justify-center`}
            aria-label={`Go to slide ${index + 1}`}
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
