"use client";

import {
  Code,
  Smartphone,
  TrendingUp,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description:
        "Custom web applications built with modern technologies and best practices for optimal performance.",
      features: ["React/Next.js", "Node.js", "Cloud Deployment"],
      gradient: "from-blue-500 to-blue-700",
      shadowColor: "shadow-blue-500/25",
      bgGradient: "from-blue-50 to-indigo-50",
      stats: "100+ Projects",
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile apps that provide exceptional user experiences across all devices.",
      features: ["React Native", "Flutter", "iOS/Android"],
      gradient: "from-green-500 to-emerald-700",
      shadowColor: "shadow-green-500/25",
      bgGradient: "from-green-50 to-emerald-50",
      stats: "50+ Apps",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description:
        "Comprehensive digital marketing strategies to boost your online presence and drive business growth.",
      features: ["SEO", "Social Media", "Content Marketing"],
      gradient: "from-purple-500 to-pink-700",
      shadowColor: "shadow-purple-500/25",
      bgGradient: "from-purple-50 to-pink-50",
      stats: "200% Growth",
    },
    {
      icon: GraduationCap,
      title: "IT Training and Consultancy",
      description:
        "Expert training and consultancy services to upskill your team and optimize your technology stack.",
      features: ["Technical Training", "Code Review", "Architecture Design"],
      gradient: "from-orange-500 to-red-700",
      shadowColor: "shadow-orange-500/25",
      bgGradient: "from-orange-50 to-red-50",
      stats: "500+ Students",
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-background from-white via-gray-50 to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-light-blue/10 to-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow/10 to-light-blue/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full mb-3 xs:mb-4">
            <Sparkles className="w-3 xs:w-4 h-3 xs:h-4 text-light-blue" />
            <span className="text-xs xs:text-sm font-medium text-gray-600">
              Our Professional Services
            </span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 xs:mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">
              Services
            </span>
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-xs xs:max-w-sm sm:max-w-2xl mx-auto leading-relaxed">
            We provide comprehensive technology solutions to accelerate your
            business growth
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 mt-8 xs:mt-10 sm:mt-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative overflow-hidden rounded-2xl xs:rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-[rgba(0,0,0,0.06)] transition-all duration-700 transform hover:-translate-y-2 xs:hover:-translate-y-4 md:hover:-translate-y-6 hover:scale-105 ${service.shadowColor} hover:shadow-xl xs:hover:shadow-2xl cursor-pointer ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "forwards",
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-50 transition-all duration-500 pointer-events-none z-0`}
              ></div>

              {/* Animated border gradient */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5 pointer-events-none z-0`}
              >
                <div className="w-full h-full bg-card rounded-3xl"></div>
              </div>

              {/* Content - responsive padding */}
              <div className="relative p-4 xs:p-6 sm:p-8 z-20">
                {/* Stats badge - responsive positioning and sizing */}
                <div className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div
                    className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full bg-gradient-to-r ${service.gradient} text-white text-xs font-semibold`}
                  >
                    {service.stats}
                  </div>
                </div>

                {/* Icon + Title (centered) - responsive sizing */}
                <div className="flex flex-col items-center text-center gap-3 xs:gap-4 mb-4 xs:mb-6">
                  <div
                    className={`p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-gradient-to-br ${service.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg inline-block card-icon`}
                  >
                    <service.icon className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 text-white dark:group-hover:text-[#e2a70f]" />
                  </div>
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-card-foreground mb-2 transition-all duration-300 group-hover:text-black dark:group-hover:text-white leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm xs:text-base text-gray-600 dark:text-card-foreground leading-relaxed group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Features list - responsive spacing */}
                <div className="space-y-1.5 xs:space-y-2">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2 xs:space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}
                      style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                    >
                      <div
                        className={`w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full bg-gradient-to-r ${service.gradient} animate-pulse`}
                      ></div>
                      <span className="text-xs xs:text-sm font-medium text-gray-600 dark:text-card-foreground group-hover:text-black dark:group-hover:text-white">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress indicator - responsive positioning */}
                <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-4 xs:left-6 sm:left-8 right-4 xs:right-6 sm:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-0.5 xs:h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${service.gradient} transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-20 blur-xl transform scale-110`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
