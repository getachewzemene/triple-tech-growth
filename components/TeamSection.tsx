'use client';

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
      name: 'Tsegaselassie Kindye',
      description: 'Visionary leader with a passion for technology and innovation.'
    },
    {
      title: 'CTO',
      name: 'Getachew Zemene',
      description: 'Tech visionary with a focus on product development and innovation.'
    },
    {
      title: 'CMO',
      name: 'Dagim Wondale',
      description: 'Marketing guru with a knack for driving brand growth and engagement.'
    }
  ];

  return (
    <section id="team" ref={sectionRef} className="py-10 bg-muted/30">
      <div className="container mx-auto px-8">
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
              <User className="card-icon w-12 h-12 mb-4 transition-colors duration-300 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">{member.title}</h3>
              <h4 className="text-lg font-medium mb-2">{member.name}</h4>
              <p className="card-description">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;