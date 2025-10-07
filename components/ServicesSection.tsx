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
      className="py-12 xs:py-16 sm:py-20 bg-background from-white via-gray-50 to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-light-blue/10 to-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow/10 to-light-blue/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
  <div className="text-center mb-8 sm:mb-10 px-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-light-blue" />
            <span className="text-sm font-medium text-gray-600">
              Our Professional Services
            </span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">
              Services
            </span>
          </h2>
          <p className="text-sm xs:text-base text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive technology solutions to accelerate your
            business growth
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 gap-6 mt-8 sm:mt-12 px-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-[rgba(0,0,0,0.06)] transition-all duration-700 transform hover:-translate-y-3 sm:hover:-translate-y-6 hover:scale-102 sm:hover:scale-105 ${service.shadowColor} sm:hover:shadow-2xl cursor-pointer ${
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

              {/* Content */}
              <div className="relative p-4 sm:p-8 z-20">
                {/* Stats badge */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${service.gradient} text-white text-xs font-semibold`}
                  >
                    {service.stats}
                  </div>
                </div>

                {/* Icon + Title (centered) */}
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${service.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg inline-block card-icon`}
                  >
                    <service.icon className="w-8 h-8 text-white dark:group-hover:text-[#e2a70f]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-card-foreground mb-2 transition-all duration-300 group-hover:text-black dark:group-hover:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-card-foreground leading-relaxed group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}
                      style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} animate-pulse`}
                      ></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-card-foreground group-hover:text-black dark:group-hover:text-white">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-4 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
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
