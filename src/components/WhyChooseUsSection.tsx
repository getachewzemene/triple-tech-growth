import { Lightbulb, Award, HeadphonesIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WhyChooseUsSection = () => {
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

  const benefits = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We leverage cutting-edge technologies and innovative approaches to deliver solutions that set you apart from the competition.'
    },
    {
      icon: Award,
      title: 'Expertise',
      description: 'Our team of experienced professionals brings deep industry knowledge and technical expertise to every project.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Support',
      description: '24/7 dedicated support and maintenance services to ensure your systems run smoothly and efficiently.'
    }
  ];

  return (
    <section id="why-choose-us" ref={sectionRef} className="py-10 bg-background">
      <div className="container mx-auto px-8">
        <h2 className="section-title">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`service-card ${
                isVisible ? 'animate-slide-in-left' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.3}s`,
                animationFillMode: 'forwards'
              }}
            >
              <benefit.icon className="card-icon w-12 h-12 mb-4 transition-colors duration-300 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="card-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;