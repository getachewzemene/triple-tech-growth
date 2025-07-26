import { User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TeamSection = () => {
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

  const teamMembers = [
    {
      title: 'CEO',
      description: 'Visionary leader driving strategic growth and innovation initiatives across all business verticals.'
    },
    {
      title: 'CTO',
      description: 'Technical architect ensuring cutting-edge solutions and maintaining highest standards of code quality.'
    },
    {
      title: 'CMO',
      description: 'Marketing strategist building brand presence and driving customer engagement through digital channels.'
    }
  ];

  return (
    <section id="team" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.title}
              className={`service-card ${
                isVisible ? 'animate-slide-in-right' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
            >
              <User className="card-icon w-12 h-12 mb-4 text-primary transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-3">{member.title}</h3>
              <p className="text-muted-foreground">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;