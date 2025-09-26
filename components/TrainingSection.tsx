"use client";

import { BookOpen, Users, Monitor, Award, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TrainingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

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

  const trainingPrograms = [
    {
      icon: BookOpen,
      title: "Web Development Bootcamp",
      description:
        "Comprehensive full-stack development training covering modern frameworks and best practices.",
      gradient: "from-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/25",
      bgGradient: "from-blue-50 to-indigo-50",
      stats: "12 Weeks",
      features: ["React/Next.js", "Node.js", "Database Design"],
    },
    {
      icon: Monitor,
      title: "Digital Marketing Mastery",
      description:
        "Learn effective digital marketing strategies, SEO, social media marketing, and analytics.",
      gradient: "from-green-500 to-emerald-600",
      shadowColor: "shadow-green-500/25",
      bgGradient: "from-green-50 to-emerald-50",
      stats: "10 Weeks",
      features: ["SEO Optimization", "Social Media", "Analytics"],
    },
    {
      icon: Users,
      title: "IT Leadership Program",
      description:
        "Executive training for technology leaders focusing on team management and strategic planning.",
      gradient: "from-purple-500 to-pink-600",
      shadowColor: "shadow-purple-500/25",
      bgGradient: "from-purple-50 to-pink-50",
      stats: "8 Weeks",
      features: ["Team Leadership", "Strategic Planning", "Project Management"],
    },
    {
      icon: Award,
      title: "Professional Certifications",
      description:
        "Industry-recognized certification programs to advance your career in technology.",
      gradient: "from-orange-500 to-red-600",
      shadowColor: "shadow-orange-500/25",
      bgGradient: "from-orange-50 to-red-50",
      stats: "6 Weeks",
      features: [
        "Industry Certification",
        "Career Advancement",
        "Portfolio Building",
      ],
    },
  ];

  return (
    <section
      id="training"
      ref={sectionRef}
      className="py-12 xs:py-16 sm:py-20 bg-background from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration - responsive sizing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-40 xs:w-56 sm:w-72 h-40 xs:h-56 sm:h-72 bg-gradient-to-r from-light-blue/15 to-yellow/15 rounded-full blur-2xl xs:blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-40 xs:w-56 sm:w-72 h-40 xs:h-56 sm:h-72 bg-gradient-to-r from-yellow/15 to-light-blue/15 rounded-full blur-2xl xs:blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 relative z-10">
        <div className="text-center mb-8 xs:mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full mb-3 xs:mb-4">
            <Sparkles className="w-3 xs:w-4 h-3 xs:h-4 text-light-blue" />
            <span className="text-xs xs:text-sm font-medium text-gray-600">
              Professional Training Programs
            </span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 xs:mb-4">
            Training{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">
              Programs
            </span>
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 max-w-xs xs:max-w-sm sm:max-w-2xl mx-auto leading-relaxed">
            Comprehensive training programs designed to accelerate your career
            growth and technical expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 mt-6 xs:mt-8 sm:mt-12">
          {trainingPrograms.map((program, index) => (
            <div
              key={program.title}
              className={`group relative overflow-hidden rounded-2xl xs:rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-[rgba(0,0,0,0.06)] transition-all duration-700 transform hover:-translate-y-2 xs:hover:-translate-y-4 md:hover:-translate-y-6 hover:scale-105 ${program.shadowColor} hover:shadow-xl xs:hover:shadow-2xl cursor-pointer ${
                isVisible ? "animate-slide-in-right" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "forwards",
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => router.push("/training")}
            >
              {/* Background gradient overlay (behind content) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${program.bgGradient} opacity-0 group-hover:opacity-60 transition-all duration-500 pointer-events-none z-0`}
              ></div>

              {/* Animated border gradient (behind content) */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${program.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5 pointer-events-none z-0`}
              >
                <div className="w-full h-full bg-card rounded-3xl"></div>
              </div>

              {/* Content */}
              <div className="relative z-20 p-6">
                {/* Stats badge */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${program.gradient} text-white text-xs font-semibold`}
                  >
                    {program.stats}
                  </div>
                </div>

                {/* Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${program.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                  >
                    <program.icon className="w-8 h-8 text-white dark:group-hover:text-[#e2a70f]" />
                  </div>
                  {/* Floating particles */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                </div>

                {/* Title and description */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-black dark:group-hover:text-white">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {program.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-2 mb-4">
                  {program.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0`}
                      style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${program.gradient} animate-pulse`}
                      ></div>
                      <span className="text-xs font-medium text-gray-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-4 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${program.gradient} transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${program.gradient} opacity-20 blur-xl transform scale-110`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
