'use client';

import { Package, Dumbbell, Hotel, Building, ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      icon: Package,
      title: 'Stock Management System',
      description: 'Comprehensive inventory tracking and management solution with real-time analytics and automated reporting.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      features: ['Real-time Analytics', 'Automated Reports', 'Inventory Tracking']
    },
    {
      icon: Dumbbell,
      title: 'Gym Website',
      description: 'Modern fitness center website with membership management, class scheduling, and online booking features.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      features: ['Membership Management', 'Class Scheduling', 'Online Booking']
    },
    {
      icon: Hotel,
      title: 'Hotel Management System',
      description: 'Complete hotel operations platform with booking management, guest services, and revenue optimization.',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
      features: ['Booking Management', 'Guest Services', 'Revenue Optimization']
    },
    {
      icon: Building,
      title: 'Custom Enterprise Systems',
      description: 'Tailored business solutions designed to streamline operations and enhance productivity across industries.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      features: ['Custom Solutions', 'Process Automation', 'Enterprise Scale']
    }
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-background from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow/20 to-light-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-light-blue/20 to-yellow/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
           <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue/10 to-yellow/10 px-4 py-2 rounded-full mb-4">
                      <Sparkles className="w-4 h-4 text-light-blue" />
                      <span className="text-sm font-medium text-gray-600">Our Projects We worked on</span>
                    </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-yellow">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcasing our expertise through innovative solutions that drive real business results
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 cursor-pointer dark:border-transparent ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.15}s`,
                animationFillMode: 'forwards'
              }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:opacity-30`}></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-6">
                {/* Icon and header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${project.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <project.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-light-blue transition-colors duration-300" />
                  </div>
                </div>
                
                {/* Title and description */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-light-blue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-200 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {project.description}
                  </p>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.color}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-200 group-hover:text-gray-700 dark:group-hover:text-gray-100">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight className="w-5 h-5 text-light-blue" />
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;