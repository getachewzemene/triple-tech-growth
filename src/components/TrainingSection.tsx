import { BookOpen, Users, Monitor, Award } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrainingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

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

  const trainingPrograms = [
    {
      icon: BookOpen,
      title: 'Web Development Bootcamp',
      description: 'Comprehensive full-stack development training covering modern frameworks and best practices.'
    },
    {
      icon: Monitor,
      title: 'Digital Marketing Mastery',
      description: 'Learn effective digital marketing strategies, SEO, social media marketing, and analytics.'
    },
    {
      icon: Users,
      title: 'IT Leadership Program',
      description: 'Executive training for technology leaders focusing on team management and strategic planning.'
    },
    {
      icon: Award,
      title: 'Professional Certifications',
      description: 'Industry-recognized certification programs to advance your career in technology.'
    }
  ];

  return (
    <section id="training" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Training Programs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {trainingPrograms.map((program, index) => (
            <div
              key={program.title}
              className={`service-card cursor-pointer ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
              onClick={() => navigate('/training')}
            >
              <program.icon className="card-icon w-12 h-12 mb-4 text-primary transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-3">{program.title}</h3>
              <p className="text-muted-foreground">{program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;