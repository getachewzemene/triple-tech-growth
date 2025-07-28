import { Package, Dumbbell, Hotel, Building } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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
      description: 'Comprehensive inventory tracking and management solution with real-time analytics and automated reporting.'
    },
    {
      icon: Dumbbell,
      title: 'Gym Website',
      description: 'Modern fitness center website with membership management, class scheduling, and online booking features.'
    },
    {
      icon: Hotel,
      title: 'Hotel Management System',
      description: 'Complete hotel operations platform with booking management, guest services, and revenue optimization.'
    },
    {
      icon: Building,
      title: 'Custom Enterprise Systems',
      description: 'Tailored business solutions designed to streamline operations and enhance productivity across industries.'
    }
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`service-card ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
            >
              <project.icon className="card-icon w-12 h-12 mb-4 text-primary transition-colors duration-300 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
              <p className="card-description">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;