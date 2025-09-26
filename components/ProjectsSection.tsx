"use client";

import {
  Package,
  Dumbbell,
  Hotel,
  Building,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
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

  const projects = [
    {
      icon: Package,
      title: "Stock Management System",
      description:
        "Comprehensive inventory tracking and management solution with real-time analytics and automated reporting.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      features: [
        "Real-time Analytics",
        "Automated Reports",
        "Inventory Tracking",
      ],
    },
    {
      icon: Dumbbell,
      title: "Gym Website",
      description:
        "Modern fitness center website with membership management, class scheduling, and online booking features.",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      features: ["Membership Management", "Class Scheduling", "Online Booking"],
    },
    {
      icon: Hotel,
      title: "Hotel Management System",
      description:
        "Complete hotel operations platform with booking management, guest services, and revenue optimization.",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50",
      features: [
        "Booking Management",
        "Guest Services",
        "Revenue Optimization",
      ],
    },
    {
      icon: Building,
      title: "Custom Enterprise Systems",
      description:
        "Tailored business solutions designed to streamline operations and enhance productivity across industries.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      features: ["Custom Solutions", "Process Automation", "Enterprise Scale"],
    },
  ];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 bg-background from-slate-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow/20 to-light-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-light-blue/20 to-yellow/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-light-blue" />
            <span className="text-sm font-medium text-gray-600">
              Our Projects We worked on
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">
              Projects
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcasing our expertise through innovative solutions that drive
            real business results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative overflow-hidden rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-[rgba(0,0,0,0.06)] transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.15}s`,
                animationFillMode: "forwards",
              }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient background overlay (behind content) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.bgColor} opacity-0 group-hover:opacity-50 transition-all duration-500 pointer-events-none z-0`}
              ></div>

              {/* Animated border gradient (with inner card fill) - behind content */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5 pointer-events-none z-0`}
              >
                <div className="w-full h-full bg-card rounded-3xl"></div>
              </div>

              {/* Content */}
              <div className="relative z-20 p-8">
                {/* Icon + Title (centered) */}
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${project.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg card-icon`}
                  >
                    <project.icon className="w-8 h-8 text-white dark:group-hover:text-[#e2a70f]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-card-foreground mb-2 transition-all duration-300 group-hover:text-black dark:group-hover:text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-card-foreground leading-relaxed group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                      {project.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 absolute top-6 right-6">
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-light-blue dark:group-hover:text-[#e2a70f] transition-colors duration-300" />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.color}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-card-foreground group-hover:text-black dark:group-hover:text-white">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight className="w-5 h-5 text-light-blue dark:group-hover:text-[#e2a70f] transition-colors duration-300" />
                </div>
              </div>

              {/* Hover glow effect (match ServicesSection) */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${project.color} opacity-20 blur-xl transform scale-110`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
