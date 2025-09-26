"use client";

import {
  Lightbulb,
  Award,
  HeadphonesIcon,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WhyChooseUsSection = () => {
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

  const benefits = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We leverage cutting-edge technologies and innovative approaches to deliver solutions that set you apart from the competition.",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      shadowColor: "shadow-yellow-500/25",
      bgGradient: "from-yellow-50 to-orange-50",
      stats: "100+ Projects",
      features: [
        "AI Integration",
        "Modern Frameworks",
        "Future-Ready Solutions",
      ],
    },
    {
      icon: Award,
      title: "Expertise",
      description:
        "Our team of experienced professionals brings deep industry knowledge and technical expertise to every project.",
      gradient: "from-blue-400 via-purple-500 to-indigo-600",
      shadowColor: "shadow-blue-500/25",
      bgGradient: "from-blue-50 to-purple-50",
      stats: "5+ Years",
      features: [
        "Certified Professionals",
        "Industry Standards",
        "Best Practices",
      ],
    },
    {
      icon: HeadphonesIcon,
      title: "Support",
      description:
        "24/7 dedicated support and maintenance services to ensure your systems run smoothly and efficiently.",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      shadowColor: "shadow-green-500/25",
      bgGradient: "from-green-50 to-teal-50",
      stats: "24/7 Available",
      features: [
        "Instant Response",
        "Proactive Monitoring",
        "Continuous Updates",
      ],
    },
  ];

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="py-20 bg-background from-gray-50 via-white to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-light-blue/10 to-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow/10 to-light-blue/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-light-blue" />
            <span className="text-sm font-medium text-gray-600">
              Why Choose Triple Technologies
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">
              Choose Us
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine innovation, expertise, and dedication to deliver
            exceptional results that exceed expectations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`group relative overflow-hidden rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-[rgba(0,0,0,0.06)] transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 ${benefit.shadowColor} hover:shadow-2xl cursor-pointer ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "forwards",
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Background gradient overlay (behind content) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${benefit.bgGradient} opacity-0 group-hover:opacity-50 transition-all duration-500 pointer-events-none z-0`}
              ></div>

              {/* Animated border gradient (behind content) */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5 pointer-events-none z-0`}
              >
                <div className="w-full h-full bg-card rounded-3xl"></div>
              </div>

              {/* Content */}
              <div className="relative z-20 p-8">
                {/* Stats badge */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${benefit.gradient} text-white text-xs font-semibold`}
                  >
                    {benefit.stats}
                  </div>
                </div>

                {/* Icon + Title (centered) */}
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${benefit.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg inline-block card-icon`}
                  >
                    <benefit.icon className="w-8 h-8 text-white dark:group-hover:text-[#e2a70f]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:text-black dark:group-hover:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2">
                  {benefit.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0`}
                      style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.gradient} animate-pulse`}
                      ></div>
                      <span className="text-sm font-medium text-gray-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-4 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${benefit.gradient} transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${benefit.gradient} opacity-20 blur-xl transform scale-110`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
